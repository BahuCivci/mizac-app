/**
 * Kitaptan üretilen kart metinlerini görsele basıp takvime yerleştirir.
 *
 *   node --import ./icerik/kayit.mjs icerik/kart-yerlestir.ts --deneme
 *   node --import ./icerik/kayit.mjs icerik/kart-yerlestir.ts
 *
 * NE YAPIYOR
 * `cikti/kartlar/<no>.json` (kart-uret.py'nin çıktısı) → aynı SVG şablonuyla
 * PNG'ler + METIN.txt → `cikti/gunluk/<gün>/instagram-{karusel,kare}/`.
 *
 * GÖRSEL MODELİ YOK, olması da gerekmiyor: kartlar fotoğraf değil,
 * `sablon.ts` SVG kuruyor, `sharp` PNG'ye basıyor. Videolarda olduğu gibi
 * saatlerce GPU işi çıkmıyor — bütün mesele metindi.
 *
 * 17 EYLÜL'E KADAR OLAN GÜNLERE DOKUNULMUYOR
 * O gönderiler Publer kuyruğunda ve oradan çıkacak; şimdi değiştirmek ya
 * hiçbir şeyi değiştirmez ya da yarısı eski yarısı yeni bir takvim doğurur.
 *
 * BLOB DEFTERİNDEN KAYIT DÜŞÜYOR
 * `yukle.mjs` `cikti/blob-adresler.json`'da kaydı olan dosyayı atlıyor.
 * Kayıt silinmezse yeni görsel hiç yüklenmez ve Blob eskisini sunmaya devam
 * eder — hiçbir yerde hata görünmeden. Görseller kayan pencereye girmiyor,
 * hepsi sürekli Blob'da duruyor (816 PNG = 42 MB), o yüzden yükleme
 * `yukle.mjs`'in işi.
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { kareSvg, kapanisSvg } from './sablon';

const KOK = path.resolve(import.meta.dirname);
const GUNLUK = path.join(KOK, 'cikti', 'gunluk');
const KARTLAR = path.join(KOK, 'cikti', 'kartlar');
const DEFTER = path.join(KOK, 'cikti', 'blob-adresler.json');

const SON_PUBLER_GUNU = '2026-09-17';
const GOLD = '#c4973a';
const ETIKETLER = '#mizaç #mizaçtesti #tıbbınebevi #kişilikanalizi #huy #kendinitanı #keşfet';
const CAGRI = 'Kendi mizacını öğren → mizac.xyz';
const KAYNAK = 'Kaynak: Varlığın Tahlili — Zeynep Işık Büyükbay';

type Kart = {
  tur: 'karusel' | 'kare';
  baslik: string;
  maddeler: string[];
  bolum: string;
  sayfa: string[];
};

function kartlariOku(): { no: string; kart: Kart }[] {
  if (!fs.existsSync(KARTLAR)) return [];
  return fs.readdirSync(KARTLAR).filter((f) => f.endsWith('.json')).sort()
    .map((f) => ({ no: f.replace('.json', ''),
                   kart: JSON.parse(fs.readFileSync(path.join(KARTLAR, f), 'utf8')) as Kart }));
}

/** Değiştirilecek klasörler, tarihe göre sıralı. */
function yuvalar(tur: 'karusel' | 'kare'): string[] {
  const ad = tur === 'karusel' ? 'instagram-karusel' : 'instagram-kare';
  const bulunan: string[] = [];
  for (const gun of fs.readdirSync(GUNLUK).sort()) {
    if (gun <= SON_PUBLER_GUNU) continue;
    const k = path.join(GUNLUK, gun, ad);
    if (fs.existsSync(k) && fs.statSync(k).isDirectory()) bulunan.push(k);
  }
  return bulunan;
}

function metinUret(kart: Kart): string {
  // İlk satır başlık; gövde maddeler. Karusel metninde "kaydır" çağrısı
  // duruyor çünkü kaydırmayan okuyucu içeriğin çoğunu görmüyor.
  const kaydir = kart.tur === 'karusel' ? '\nKaydır 👉\n' : '';
  return [`✦ ${kart.baslik}`, '', ...kart.maddeler.map((m) => `✦ ${m}`),
          kaydir, CAGRI, KAYNAK, ETIKETLER, ''].join('\n');
}

async function gorselYaz(svg: string, hedef: string) {
  await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(hedef);
}

async function yerlestir(klasor: string, kart: Kart, defter: Record<string, string>,
                         deneme: boolean): Promise<string> {
  const gun = path.basename(path.dirname(klasor));
  const ad = path.basename(klasor);
  const etiket = kart.bolum.replace(/^Bölüm\s*\d+\s*—\s*/, '').slice(0, 28);

  const kareler: string[] = [];
  if (kart.tur === 'karusel') {
    const toplam = kart.maddeler.length + 2;
    kareler.push(kareSvg({ bicim: 'karusel', ustEtiket: etiket, baslik: kart.baslik,
                           vurguRenk: GOLD, sayfa: { su: 1, toplam } }));
    kart.maddeler.forEach((m, i) =>
      kareler.push(kareSvg({ bicim: 'karusel', ustEtiket: etiket, baslik: m,
                             vurguRenk: GOLD, sayfa: { su: i + 2, toplam } })));
    kareler.push(kapanisSvg('karusel', GOLD, { su: toplam, toplam }));
  } else {
    kareler.push(kareSvg({ bicim: 'kare', ustEtiket: etiket, baslik: kart.baslik,
                           maddeler: kart.maddeler.slice(0, 4), vurguRenk: GOLD }));
  }

  if (!deneme) {
    // Eski PNG'ler silinmeli: yeni karusel eskisinden az kareliyse artakalan
    // dosya klasörde kalır ve paylaşıma eski bir kare karışır.
    for (const f of fs.readdirSync(klasor)) {
      if (/^\d+\.png$/.test(f)) {
        fs.rmSync(path.join(klasor, f));
        delete defter[`${gun}/${ad}/${f}`];
      }
    }
    for (let i = 0; i < kareler.length; i++) {
      const dosya = `${i + 1}.png`;
      await gorselYaz(kareler[i], path.join(klasor, dosya));
      delete defter[`${gun}/${ad}/${dosya}`];
    }
    fs.writeFileSync(path.join(klasor, 'METIN.txt'), metinUret(kart));
  }
  return `  ${gun}/${ad} ← ${kart.tur} (${kareler.length} kare, ${etiket})`;
}

async function main() {
  const deneme = process.argv.includes('--deneme');
  const kacIdx = process.argv.indexOf('--kac');
  const kac = kacIdx >= 0 ? Number(process.argv[kacIdx + 1]) : 0;

  const hepsi = kartlariOku();
  const karuseller = hepsi.filter((x) => x.kart.tur === 'karusel');
  const kareler = hepsi.filter((x) => x.kart.tur === 'kare');
  const kYuva = yuvalar('karusel');
  const eYuva = yuvalar('kare');

  console.log(`kart: ${karuseller.length} karusel, ${kareler.length} kare`);
  console.log(`yuva: ${kYuva.length} karusel, ${eYuva.length} kare${deneme ? '  [DENEME]' : ''}`);

  let ciftler: [string, Kart][] = [
    ...kYuva.slice(0, karuseller.length).map((y, i) => [y, karuseller[i].kart] as [string, Kart]),
    ...eYuva.slice(0, kareler.length).map((y, i) => [y, kareler[i].kart] as [string, Kart]),
  ];
  if (kac) ciftler = ciftler.slice(0, kac);

  const defter: Record<string, string> =
    fs.existsSync(DEFTER) ? JSON.parse(fs.readFileSync(DEFTER, 'utf8')) : {};

  for (const [klasor, kart] of ciftler) console.log(await yerlestir(klasor, kart, defter, deneme));

  if (!deneme) fs.writeFileSync(DEFTER, JSON.stringify(defter, null, 2));
  console.log(`\n${ciftler.length} yuva dolduruldu.`);
  console.log('Sonraki adım: node icerik/yukle.mjs  ve  python3 -m paylasim.dizin --uret');
}

main().catch((e) => { console.error(e); process.exit(1); });
