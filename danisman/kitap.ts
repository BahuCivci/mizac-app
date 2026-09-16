/**
 * Kitabın tam metni üzerinde getirim (RAG).
 *
 * Bugüne kadar danışman kitabın yalnız **damıtılmış** hâlini kullanıyordu:
 * `lib/mizac-data.ts`'teki 240 puanlanmış gösterge. 432 KB'lık asıl metin
 * (244 sayfa) hiç açılmamıştı. Burası onu açıyor: danışman derinlik
 * gerektiğinde ilgili pasajı bulup alıntılayabilsin.
 *
 * METİN NEREDE (16 Eyl 2026)
 * Kitap telifli; `kaynak/` hem `.gitignore` hem `.vercelignore` dışında ve
 * Vercel siteyi depodan derlediği için üretimde o dosya YOK. Önce yerel
 * dosyaya bakılıyor (geliştirme), yoksa danışmanın zaten kullandığı vekilden
 * (`danisman/sunucu/vekil.py` → `GET /kitap`) aynı anahtarla çekiliyor.
 * Böylece public depoya tek satır kitap girmiyor ve yeni bir sır gerekmiyor.
 *
 * Neden gömme (embedding) değil de sözcük tabanlı arama:
 * gömme için ayrı bir model indirmek, yüklemek ve her istekte çağırmak
 * gerekiyor. Sözcük tabanlı arama bağımlılıksız, deterministik ve test
 * edilebilir — önce bunun yeterli olup olmadığı ölçülür (`kitap-olc.ts`).
 * Yetmezse gömmeye geçmek `puanla()`yı değiştirmekten ibaret.
 *
 * ALINTI UYARISI: OCR'da basılı sayfa numaraları yalnız 14 sayfada korunmuş.
 * Bu yüzden `sayfa` alanı **tarama sırasıdır**, kitabın basılı sayfa numarası
 * değil. Kullanıcıya ne danışman ne de arayüz üzerinden sayfa numarası
 * verilmez — "kitapta şöyle anlatılıyor" ve bölüm başlığı yeterli, üstelik
 * okura daha faydalı. Bu alan yalnız hata ayıklama ve izlenebilirlik için.
 */
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

export interface Pasaj {
  /** Tarama sırası (1..244) — basılı sayfa numarası DEĞİL. */
  sayfa: number;
  /** OCR dosya kimliği, kaynağa dönmek için. */
  kimlik: string;
  metin: string;
  /** Sayfada geçen en belirgin başlık; alıntıyı konumlandırmak için. */
  baslik?: string;
}

export interface Bulgu extends Pasaj {
  skor: number;
}

/**
 * Türkçe için kaba kök: ilk 4 harf.
 *
 * `kanit.ts` tekrar tespitinde 3 harf kullanıyor çünkü orada amaç aynı
 * gözlemi yakalamak; burada amaç farklı konuları ayırmak, 3 harf fazla
 * gevşek ("balgam" ile "balık" aynı kökte buluşur). 4 harf ayrımı koruyor.
 */
const DURAK = new Set([
  'için', 'ile', 'gibi', 'daha', 'çok', 'olan', 'olarak', 'bunu', 'bir', 'bu',
  'şu', 'the', 'and', 'veya', 'ancak', 'yani', 'kadar', 'sonra', 'önce',
  'ise', 'ki', 'de', 'da', 'mi', 'mı', 'her', 'bazı', 'göre', 'üzere',
]);

function kokle(metin: string): string[] {
  return metin
    .toLocaleLowerCase('tr-TR')
    .replace(/[^a-zçğıöşü\s]/g, ' ')
    .split(/\s+/)
    .filter((k) => k.length > 3 && !DURAK.has(k))
    .map((k) => k.slice(0, 4));
}

interface Dizin {
  pasajlar: Pasaj[];
  df: Map<string, number>;
  ortUzunluk: number;
}

const BOS: Dizin = { pasajlar: [], df: new Map(), ortUzunluk: 1 };

let sozu: Promise<Dizin> | null = null;

/** Test kancası: dizin bir kez kurulup önbelleğe alınıyor, testler sıfırlayabilsin. */
export function onbellegiSifirla(): void {
  sozu = null;
}

function yerelYol(): string | null {
  // MIZAC_KITAP açıkça verilmişse YALNIZ ona bakılır: testler "kitap yok"
  // hâlini böyle kuruyor, uzak sunucuya kaçış o durumu gizlerdi.
  const acik = process.env.MIZAC_KITAP;
  if (acik) return existsSync(acik) ? acik : null;
  const varsayilan = path.join(process.cwd(), 'kaynak', 'kitap_tam_metin.txt');
  return existsSync(varsayilan) ? varsayilan : null;
}

async function metniGetir(): Promise<string> {
  const yerel = yerelYol();
  if (yerel) return readFileSync(yerel, 'utf-8');
  if (process.env.MIZAC_KITAP) throw new Error(`kitap yok: ${process.env.MIZAC_KITAP}`);

  const uzak = process.env.MIZAC_OLLAMA;
  const anahtar = process.env.MIZAC_OLLAMA_ANAHTAR;
  if (!uzak || !anahtar) throw new Error('kitap ne yerelde ne uzakta bulunabildi');

  // Vekil kimlik doğruluyor; anahtar zaten model çağrılarında kullanılan.
  const cevap = await fetch(`${uzak.replace(/\/+$/, '')}/kitap`, {
    headers: { Authorization: `Bearer ${anahtar}` },
    cache: 'no-store',
    signal: AbortSignal.timeout(20_000),
  });
  if (!cevap.ok) throw new Error(`kitap ${cevap.status}`);
  return cevap.text();
}

function ayristir(ham: string): Pasaj[] {
  const parcalar = ham.split(/=== SAYFA: (\S+) ===/);

  const pasajlar: Pasaj[] = [];
  for (let i = 1; i < parcalar.length - 1; i += 2) {
    const kimlik = parcalar[i];
    const metin = parcalar[i + 1].trim();
    if (metin.length < 80) continue; // boş/bozuk tarama sayfaları

    /*
     * Başlık: yalnız BÜYÜK HARFLİ satırlar.
     *
     * İlk sürüm "büyük harfle başlayan kısa satır" arıyordu ve OCR gürültüsünü
     * başlık sanıyordu ("Oak “fkeli bir hayatı varsa", yazarın adı, kitabın
     * adı). Bu kitapta gerçek bölüm başlıkları büyük harfle dizilmiş; ölçüt
     * buna daraltıldı. Bulunamazsa başlık verilmiyor — yanlış başlık,
     * başlıksızlıktan kötü.
     */
    const baslik = metin
      .split('\n')
      .map((s) => s.trim())
      .find((s) => {
        if (s.length < 8 || s.length > 60) return false;
        const harfler = s.replace(/[^a-zA-ZçğıöşüÇĞİÖŞÜ]/g, '');
        if (harfler.length < 6) return false;
        const buyuk = harfler.replace(/[^A-ZÇĞİÖŞÜ]/g, '').length;
        return buyuk / harfler.length > 0.85;
      });

    pasajlar.push({ sayfa: pasajlar.length + 1, kimlik, metin, baslik });
  }
  return pasajlar;
}

/**
 * KİTAP YOKSA DANIŞMAN ÖLMEZ, KİTAPSIZ DEVAM EDER (16 Eyl 2026).
 *
 * Rota kitabı yalnız kullanıcı SORU sorduğunda açıyor; o gün metin üretimde
 * bulunamayınca `readFileSync` ENOENT fırlattı, istek 503 döndü ve ekranda
 * "Danışmana şu an ulaşılamıyor" çıktı. Soru içermeyen turlar çalıştığı için
 * arıza günlerce "aralıklı" sanıldı. Getirim bir EK; yokluğu danışmanı
 * durdurmamalı.
 *
 * Başarısızlık ÖNBELLEĞE ALINMIYOR: geçici bir ağ hatası lambda'nın ömrü
 * boyunca kitabı kapatmasın, sonraki istek yeniden denesin.
 */
async function dizin(): Promise<Dizin> {
  if (sozu) return sozu;
  sozu = (async () => {
    const pasajlar = ayristir(await metniGetir());
    const df = new Map<string, number>();
    let toplam = 0;
    for (const p of pasajlar) {
      const kokler = kokle(p.metin);
      toplam += kokler.length;
      for (const k of new Set(kokler)) df.set(k, (df.get(k) ?? 0) + 1);
    }
    return { pasajlar, df, ortUzunluk: toplam / (pasajlar.length || 1) };
  })().catch((e) => {
    console.warn('kitap okunamadı, danışman kitapsız devam ediyor:', e);
    sozu = null;
    return BOS;
  });
  return sozu;
}

/**
 * BM25. Klasik k1/b değerleri; ayarlanacaksa `kitap-olc.ts` ile ölçülerek
 * ayarlanmalı, göz kararıyla değil.
 */
const K1 = 1.5;
const B = 0.75;

export async function kitaptaAra(sorgu: string, adet = 3): Promise<Bulgu[]> {
  const { pasajlar, df, ortUzunluk } = await dizin();
  const sorguKokleri = kokle(sorgu);
  if (!sorguKokleri.length || !pasajlar.length) return [];

  const N = pasajlar.length;
  const bulgular: Bulgu[] = [];

  for (const p of pasajlar) {
    const kokler = kokle(p.metin);
    const sayim = new Map<string, number>();
    for (const k of kokler) sayim.set(k, (sayim.get(k) ?? 0) + 1);

    let skor = 0;
    for (const k of new Set(sorguKokleri)) {
      const f = sayim.get(k);
      if (!f) continue;
      const n = df.get(k) ?? 0;
      const idf = Math.log(1 + (N - n + 0.5) / (n + 0.5));
      skor += idf * ((f * (K1 + 1)) / (f + K1 * (1 - B + (B * kokler.length) / ortUzunluk)));
    }
    if (skor > 0) bulgular.push({ ...p, skor });
  }

  return bulgular.sort((a, b) => b.skor - a.skor).slice(0, adet);
}

/** Prompt'a konacak biçim — modele nereden alıntı yaptığını da söyler. */
export function pasajlariBicimle(bulgular: Bulgu[], enFazlaKarakter = 700): string {
  return bulgular
    .map((b) => {
      const kisa = b.metin.replace(/\s+/g, ' ').slice(0, enFazlaKarakter);
      return `[kitap:${b.sayfa}${b.baslik ? ` — ${b.baslik}` : ''}]\n${kisa}`;
    })
    .join('\n\n');
}

/** Modelin uydurduğu kaynak numarasını yakalamak için: geçerli mi? */
export async function gecerliSayfa(no: number): Promise<boolean> {
  const { pasajlar } = await dizin();
  return Number.isInteger(no) && no >= 1 && no <= pasajlar.length;
}
