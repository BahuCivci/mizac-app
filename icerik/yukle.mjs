/**
 * Günlük içeriği Vercel Blob'a yükler ve her dosyanın herkese açık adresini kaydeder.
 *
 *     node icerik/yukle.mjs              # eksik olanları yükle
 *     node icerik/yukle.mjs --deneme     # hiçbir şey yükleme, ne olacağını yaz
 *     node icerik/yukle.mjs --sinir 20   # ilk 20 dosya (deneme için)
 *
 * NEDEN VAR
 * Ne Instagram'ın API'si ne de Publer/Buffer gibi zamanlayıcılar senin
 * diskindeki dosyayı görebilir; ikisi de herkese açık bir URL istiyor.
 * Instagram'ın dokümantasyonundaki söz açık: "we cURL media used in publishing
 * attempts, so the media must be hosted on a publicly accessible server."
 * Bu betik o sunucuyu sağlıyor.
 *
 * ADRES DÜZENİ
 * Blob içindeki yol yereldeki yolla birebir aynı tutuluyor:
 *
 *     <gün>/<biçim>/<dosya>      örn. 2026-08-24/instagram-karusel/1.png
 *
 * Böylece paylas.py'nin beklediği MEDYA_TABAN_URL düzeni kendiliğinden
 * oturuyor ve onay geldiğinde ikinci bir taşıma işi çıkmıyor.
 *
 * YENİDEN ÇALIŞTIRILABİLİR
 * Yüklenenler `cikti/blob-adresler.json` içinde tutuluyor; betik yarıda
 * kesilirse kaldığı yerden devam eder, aynı dosyayı iki kez yüklemez.
 * 211 MB'lık bir yüklemede bu isteğe bağlı değil.
 */
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import { put } from '@vercel/blob';

const KOK = dirname(fileURLToPath(import.meta.url));
const GUNLUK = join(KOK, 'cikti', 'gunluk');
const DEFTER = join(KOK, 'cikti', 'blob-adresler.json');

// Yalnız paylaşılabilir medya. SENARYO.md, METIN.txt gibi çalışma dosyaları
// dışarıya açılmamalı — kimseye faydası yok, gereksiz yere görünür oluyorlar.
const UZANTILAR = new Set(['.png', '.jpg', '.jpeg', '.mp4']);

// Vercel Blob eşzamanlı isteklerde cömert ama sınırsız değil; 8 ölçüldüğünde
// hız kazancı düzleşiyor, üstü 429 riskini artırıyor.
const ESZAMANLI = 8;

function dosyalariTara(kok) {
  const cikti = [];
  for (const ad of readdirSync(kok)) {
    const yol = join(kok, ad);
    if (statSync(yol).isDirectory()) cikti.push(...dosyalariTara(yol));
    else if (UZANTILAR.has(ad.slice(ad.lastIndexOf('.')).toLowerCase())) cikti.push(yol);
  }
  return cikti;
}

function defteriOku() {
  if (!existsSync(DEFTER)) return {};
  try {
    return JSON.parse(readFileSync(DEFTER, 'utf8'));
  } catch {
    // Bozuk defter yüzünden 211 MB'ı baştan yüklemek yerine sıfırdan başla.
    console.warn('blob-adresler.json okunamadı, boş kabul ediliyor.');
    return {};
  }
}

async function main() {
  const argv = process.argv.slice(2);
  const deneme = argv.includes('--deneme');
  const sinirIdx = argv.indexOf('--sinir');
  const sinir = sinirIdx >= 0 ? Number(argv[sinirIdx + 1]) : 0;

  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token && !deneme) {
    console.error('BLOB_READ_WRITE_TOKEN tanımlı değil. Önce: vercel env pull');
    process.exit(1);
  }
  if (!existsSync(GUNLUK)) {
    console.error('İçerik üretilmemiş. Önce: npm run icerik');
    process.exit(1);
  }

  const defter = defteriOku();
  let hepsi = dosyalariTara(GUNLUK).sort();
  const eksik = hepsi.filter((y) => !defter[relative(GUNLUK, y)]);
  const isler = sinir ? eksik.slice(0, sinir) : eksik;

  const boyut = isler.reduce((t, y) => t + statSync(y).size, 0);
  console.log(`toplam ${hepsi.length} dosya, ${hepsi.length - eksik.length} zaten yüklü`);
  console.log(`yüklenecek: ${isler.length} dosya, ${(boyut / 1024 / 1024).toFixed(0)} MB\n`);

  if (!isler.length) {
    console.log('Yüklenecek bir şey yok.');
    return;
  }
  if (deneme) {
    for (const y of isler.slice(0, 5)) console.log(`  [deneme] ${relative(GUNLUK, y)}`);
    if (isler.length > 5) console.log(`  … ve ${isler.length - 5} tane daha`);
    return;
  }

  let bitti = 0;
  let hata = 0;
  const kuyruk = [...isler];

  async function isci() {
    while (kuyruk.length) {
      const yol = kuyruk.shift();
      const anahtar = relative(GUNLUK, yol);
      try {
        const { url } = await put(anahtar, readFileSync(yol), {
          access: 'public',
          addRandomSuffix: false, // adres tahmin edilebilir kalmalı
          // Blob varsa üzerine yaz. addRandomSuffix:false bunu TEK BAŞINA
          // sağlamıyor — Vercel Blob "This blob already exists" deyip
          // reddediyor. İçerik yeniden üretildiğinde (yeni seslendirme gibi)
          // adresin sabit kalması şart: Publer'da zamanlanmış gönderiler ve
          // paylas.py'nin ürettiği MEDYA_TABAN_URL o adresleri gösteriyor.
          allowOverwrite: true,
          token,
        });
        defter[anahtar] = url;
      } catch (e) {
        hata++;
        console.error(`HATA ${anahtar}: ${e.message}`);
      }
      bitti++;
      if (bitti % 25 === 0) {
        // Ara kayıt: yükleme yarıda kesilirse ilerleme kaybolmasın.
        writeFileSync(DEFTER, JSON.stringify(defter, null, 2));
        console.log(`  ${bitti}/${isler.length}`);
      }
    }
  }

  await Promise.all(Array.from({ length: ESZAMANLI }, isci));
  writeFileSync(DEFTER, JSON.stringify(defter, null, 2));

  const ornek = Object.values(defter)[0] ?? '';
  const taban = ornek.slice(0, ornek.indexOf('/', 'https://'.length));
  console.log(`\nbitti — ${bitti - hata} yüklendi, ${hata} hata`);
  console.log(`adresler: ${relative(process.cwd(), DEFTER)}`);
  if (taban) console.log(`MEDYA_TABAN_URL=${taban}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
