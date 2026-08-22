/**
 * Kanıt çıkarma ve puanlama.
 *
 * Model mizacı **belirlemez**. Serbest konuşmadan yapılandırılmış gözlem
 * çıkarır; kararı `lib/puanlama.ts` verir — sitedeki 60 soruluk testle birebir
 * aynı motor. Böylece aynı kişi iki yerde iki farklı mizaç almaz, ve her sonuç
 * "şunu söyledin, bu yüzden" diye gerekçelendirilebilir.
 */
import { sorular, type MizacTip } from '@/lib/mizac-data';
import { kazananBelirle } from '@/lib/puanlama';
import { kanitPromptu } from './persona';
import type { Saglayici } from './model';

const TIPLER: MizacTip[] = ['safravi', 'demevi', 'balgami', 'sevdavi'];

export interface Kanit {
  /** Ne gözlendi: "yazın bunalıyor", "bol terliyor" */
  gosterge: string;
  mizac: MizacTip;
  /** 1 zayıf ipucu, 2 belirgin, 3 açık gösterge. Testteki puanlarla aynı ölçek. */
  guc: 1 | 2 | 3;
  /** Kişinin kendi sözü — gerekçe gösterebilmek için. */
  alinti: string;
  /** Hangi alandan geldi (fiziksel, duygusal, ...) */
  alan?: string;
}

export interface Durum {
  puanlar: Record<MizacTip, number>;
  kazanan: MizacTip;
  /** 0-1. Birinci ile ikinci arasındaki fark toplama oranlanır. */
  guven: number;
  ikinci: MizacTip;
}

const ALANLAR = [...new Set(sorular.map((s) => s.kategori))];

const CIKAR_TALIMATI = `
Kişinin son sözünden mizaç göstergesi çıkar.

Kurallar:
- Yalnız gerçekten söylenene dayan. Çıkarım yapma, uydurma.
- Gösterge yoksa boş liste döndür. Zorlama.
- Bir sözde birden çok gösterge olabilir; HER BİRİNİ ayrı ayrı çıkar.
  "Az uyuyorum ama dinç kalkıyorum, bir de yazın bunalıyorum" üç göstergedir:
  uyku süresi, uyanma hâli, sıcağa tahammül.
- gosterge alanı ne gözlendiğini ANLATIR, kelimeyi tekrar etmez:
  kötü → "bağırdım";  iyi → "öfkesi ani parlayıp hemen sönüyor"
- Her gösterge için mizaç ve güç ver. Güç ölçeği:
    3 = açık gösterge ("hiç terlemem", "beş alarm kuruyorum")
    2 = belirgin ama tek başına yetmez
    1 = zayıf ipucu
- alinti alanına kişinin KENDİ sözcüklerini koy, kısalt ama değiştirme.
- alan şunlardan biri olmalı: ${ALANLAR.join(', ')}

SADECE şu biçimde JSON döndür, başka hiçbir şey yazma:
{"kanitlar":[{"gosterge":"...","mizac":"safravi","guc":3,"alinti":"...","alan":"fiziksel"}]}`;

function gecerliKanit(x: unknown): x is Kanit {
  if (typeof x !== 'object' || x === null) return false;
  const k = x as Record<string, unknown>;
  return (
    typeof k.gosterge === 'string' &&
    typeof k.alinti === 'string' &&
    typeof k.mizac === 'string' &&
    TIPLER.includes(k.mizac as MizacTip) &&
    (k.guc === 1 || k.guc === 2 || k.guc === 3)
  );
}

export async function kanitCikar(
  saglayici: Saglayici,
  soz: string,
  baglam: string[] = []
): Promise<Kanit[]> {
  const oncesi = baglam.length ? `Sohbetin önceki bölümü:\n${baglam.join('\n')}\n\n` : '';

  const ham = await saglayici.sor(
    [
      { rol: 'sistem', metin: kanitPromptu() + '\n' + CIKAR_TALIMATI },
      { rol: 'kullanici', metin: `${oncesi}Kişinin son sözü:\n${soz}` },
    ],
    { sicaklik: 0, enFazlaJeton: 600, jsonMu: true }
  );

  try {
    // Model bazen JSON'u metne sarar; ilk süslü paranteze kadar olanı at.
    const bas = ham.indexOf('{');
    const son = ham.lastIndexOf('}');
    if (bas < 0 || son < bas) return [];
    const d = JSON.parse(ham.slice(bas, son + 1));
    const liste = Array.isArray(d.kanitlar) ? d.kanitlar : [];
    return liste.filter(gecerliKanit);
  } catch {
    // Bozuk JSON sohbeti kesmemeli — bu turda kanıt yok sayılır.
    return [];
  }
}

export function puanla(kanitlar: Kanit[]): Durum {
  const puanlar: Record<MizacTip, number> = {
    safravi: 0, demevi: 0, balgami: 0, sevdavi: 0,
  };
  for (const k of kanitlar) puanlar[k.mizac] += k.guc;

  // Testteki "güçlü cevap" kavramının karşılığı: 3 puanlık kanıtlar.
  const secilen = kanitlar.map((k) => ({ [k.mizac]: k.guc }) as Partial<Record<MizacTip, number>>);
  const kazanan = kazananBelirle(puanlar, secilen);

  const sirali = [...TIPLER].sort((a, b) => puanlar[b] - puanlar[a]);
  const ikinci = sirali[0] === kazanan ? sirali[1] : sirali[0];
  const toplam = TIPLER.reduce((n, t) => n + puanlar[t], 0);
  const guven = toplam === 0 ? 0 : (puanlar[kazanan] - puanlar[ikinci]) / toplam;

  return { puanlar, kazanan, guven, ikinci };
}

/** Hangi alanlarda hâlâ hiç gözlem yok — sohbet oraya kaydırılmalı. */
export function eksikAlanlar(kanitlar: Kanit[]): string[] {
  const gorulen = new Set(kanitlar.map((k) => k.alan).filter(Boolean));
  return ALANLAR.filter((a) => !gorulen.has(a));
}

/**
 * Ölçümde görülen sistematik hatanın karşılığı.
 *
 * İlk iki aday aynı sıcaklık grubundaysa fark yalnız nem eksenindedir ve model
 * tam orada yanılıyor. Bu durumda tahmine bırakmayıp doğrudan yoklanacak
 * göstergeler döndürülür.
 */
export function nemYoklamasiGerek(durum: Durum): string[] | null {
  const sicak: MizacTip[] = ['safravi', 'demevi'];
  const soguk: MizacTip[] = ['balgami', 'sevdavi'];
  const ayniGrup =
    (sicak.includes(durum.kazanan) && sicak.includes(durum.ikinci)) ||
    (soguk.includes(durum.kazanan) && soguk.includes(durum.ikinci));

  if (!ayniGrup) return null;
  if (durum.guven > 0.35) return null; // fark yeterince açılmışsa gerek yok

  return [
    'terleme (kolay ve bol mu, yok denecek kadar az mı)',
    'cilt (kuru ve çatlayan mı, nemli ve yumuşak mı)',
    'kilo (almakta zorlanır mı, kolay mı alır)',
    'uyku (kısa ve bölük mü, uzun ve derin mi)',
  ];
}

/**
 * Modele o turda nereye yöneleceğini söyleyen, kullanıcının görmediği not.
 * Terminal prototipi ve API rotası aynı mantığı kullansın diye burada.
 */
export function yonerge(kanitlar: Kanit[]): string | null {
  if (!kanitlar.length) return null;
  const d = puanla(kanitlar);
  const notlar: string[] = [];

  const nem = nemYoklamasiGerek(d);
  if (nem) {
    notlar.push(
      `İlk iki aday (${d.kazanan}, ${d.ikinci}) aynı sıcaklık grubunda; ` +
        `aralarındaki fark nem ekseninde ve tam orada yanılma riskin yüksek. ` +
        `Sohbetin akışına sığdırarak şunlardan BİRİNİ öğren: ${nem.join(' / ')}.`
    );
  }

  const eksik = eksikAlanlar(kanitlar);
  if (eksik.length > 4) {
    notlar.push(`Şu alanlarda hiç gözlem yok: ${eksik.slice(0, 4).join(', ')}.`);
  }

  if (d.guven > 0.35 && kanitlar.length >= 6) {
    notlar.push(
      `Kanaatin oluştu (${d.kazanan}). Artık mizaç adını söyleyebilirsin: uygun ` +
        `bir anda söyle ve gerekçesini kişinin kendi sözlerinden göster.`
    );
  }

  return notlar.length ? `[yönerge — kullanıcıya gösterme]\n${notlar.join('\n')}` : null;
}
