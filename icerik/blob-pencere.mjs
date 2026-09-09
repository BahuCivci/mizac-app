/**
 * Blob'da yalnız yaklaşan günlerin videosunu tutar — kayan pencere.
 *
 *     node --env-file=.env.local icerik/blob-pencere.mjs --deneme
 *     node --env-file=.env.local icerik/blob-pencere.mjs
 *     node --env-file=.env.local icerik/blob-pencere.mjs --gun 30
 *
 * NEDEN VAR
 * Instagram medyayı kendi sunucusuyla indiriyor, yani her videonun herkese
 * açık bir adresi olmak zorunda ("we cURL media used in publishing
 * attempts"). Dosyayı doğrudan yollamak yalnız Facebook Login for Business
 * kullanan uygulamalara açık; biz Instagram Login yolundayız (hesap Creator,
 * Facebook Sayfası yok — App Review'u atlayan şey bu). TikTok ve YouTube
 * dosyayı doğrudan alıyor, adres yalnız Instagram için gerekiyor.
 *
 * Ama Blob'un ücretsiz planı 1 GB ve kitaptan üretilen 254 video 6.6 GB.
 * 9 Eyl 2026'da yükleme tam bu duvara tosladı: 218 dosyanın 183'ü
 * "Storage quota exceeded" ile döndü, ve kota aşılmışken üzerine yazma
 * bile reddediliyor.
 *
 * ÇÖZÜM: Blob arşiv değil teslim noktası. Videoların tamamı Mac'te duruyor;
 * Blob'da yalnız önümüzdeki PENCERE kadar günün videosu bulunuyor, geçen
 * günlerinki siliniyor. ~21 gün ≈ 16 video ≈ 420 MB — tam kalitede, sıkışma
 * yok. Günlük paylaşımı yine GitHub Actions yapıyor, yani Mac uyusa da post
 * çıkıyor; Mac yalnız ara sıra uyanıp pencereyi tazeliyor ve üç haftalık
 * tampon bunu bekletmeye izin veriyor.
 *
 * GÖRSELLER PENCEREYE GİRMİYOR. 816 PNG toplam 42 MB; hepsini sürekli
 * tutmak kotanın %4'ü. Silip yeniden yüklemenin getirisi yok, riski var.
 *
 * DEFTERE DEĞİL BLOB'A BAKIYOR. `blob-adresler.json` neyin yüklendiğini
 * söylüyor ama `yukle.mjs` onu belleğe alıp bitince üzerine yazıyor; yükleme
 * sürerken düşürülen kayıt geri geliyor. Bu yüzden gerçek `list()` ile
 * okunuyor, defter sonradan ona uyduruluyor.
 */
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { put, del, list } from '@vercel/blob';

const KOK = dirname(fileURLToPath(import.meta.url));
const GUNLUK = join(KOK, 'cikti', 'gunluk');
const DEFTER = join(KOK, 'cikti', 'blob-adresler.json');

const PENCERE = 21;      // gün
const GERIYE = 2;        // paylaşılmış günü hemen silme: geç kalan post olabilir
const ESZAMANLI = 6;

const gun = (d) => d.toISOString().slice(0, 10);

function argv(ad, varsayilan) {
  const i = process.argv.indexOf(`--${ad}`);
  return i >= 0 ? process.argv[i + 1] : varsayilan;
}

function dosyalar(kok) {
  const cikti = [];
  for (const ad of readdirSync(kok)) {
    const yol = join(kok, ad);
    if (statSync(yol).isDirectory()) cikti.push(...dosyalar(yol));
    else cikti.push(yol);
  }
  return cikti;
}

async function main() {
  const deneme = process.argv.includes('--deneme');
  const pencere = Number(argv('gun', PENCERE));
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) { console.error('BLOB_READ_WRITE_TOKEN yok. Önce: vercel env pull'); process.exit(1); }

  const bugun = new Date();
  const bas = new Date(bugun); bas.setDate(bas.getDate() - GERIYE);
  const son = new Date(bugun); son.setDate(son.getDate() + pencere);
  const [gBas, gSon] = [gun(bas), gun(son)];
  console.log(`pencere: ${gBas} → ${gSon} (${pencere} gün)`);

  // Blob'daki gerçek durum
  const uzak = new Map();
  let cursor;
  do {
    const r = await list({ cursor, limit: 1000, token });
    for (const b of r.blobs) uzak.set(b.pathname, b);
    cursor = r.cursor;
  } while (cursor);
  const toplam = [...uzak.values()].reduce((s, b) => s + b.size, 0);
  console.log(`Blob'da ${uzak.size} dosya, ${(toplam / 1e6).toFixed(0)} MB`);

  // Yereldeki videolar
  const yerel = dosyalar(GUNLUK)
    .filter((y) => y.endsWith('video.mp4'))
    .map((y) => ({ yol: y, anahtar: relative(GUNLUK, y), gun: relative(GUNLUK, y).split('/')[0],
                   boyut: statSync(y).size }));

  const icerde = yerel.filter((v) => v.gun >= gBas && v.gun <= gSon);
  const yuklenecek = icerde.filter((v) => {
    const b = uzak.get(v.anahtar);
    return !b || b.size !== v.boyut;
  });
  const silinecek = [...uzak.values()].filter((b) => {
    if (!b.pathname.endsWith('video.mp4')) return false;   // görsellere dokunma
    const g = b.pathname.split('/')[0];
    return g < gBas || g > gSon;
  });

  const yMB = yuklenecek.reduce((s, v) => s + v.boyut, 0) / 1e6;
  const sMB = silinecek.reduce((s, b) => s + b.size, 0) / 1e6;
  console.log(`pencere içi video: ${icerde.length}`);
  console.log(`yüklenecek: ${yuklenecek.length} (${yMB.toFixed(0)} MB)`);
  console.log(`silinecek : ${silinecek.length} (${sMB.toFixed(0)} MB)`);
  console.log(`sonrası   : ~${((toplam - sMB * 1e6 + yMB * 1e6) / 1e6).toFixed(0)} MB / 1000 MB`);

  if (deneme) {
    for (const v of yuklenecek.slice(0, 5)) console.log(`  [yükle] ${v.anahtar}`);
    for (const b of silinecek.slice(0, 5)) console.log(`  [sil]   ${b.pathname}`);
    return;
  }

  const defter = existsSync(DEFTER) ? JSON.parse(readFileSync(DEFTER, 'utf8')) : {};

  // ÖNCE SİL. Kota doluyken hiçbir yazma kabul edilmiyor — yer açmadan
  // yüklemeye başlamak bütün işi "quota exceeded" ile geri getirir.
  for (let i = 0; i < silinecek.length; i += 20) {
    await del(silinecek.slice(i, i + 20).map((b) => b.url), { token });
    for (const b of silinecek.slice(i, i + 20)) delete defter[b.pathname];
    console.log(`  silindi ${Math.min(i + 20, silinecek.length)}/${silinecek.length}`);
  }

  let bitti = 0, hata = 0;
  const kuyruk = [...yuklenecek];
  async function isci() {
    while (kuyruk.length) {
      const v = kuyruk.shift();
      try {
        const { url } = await put(v.anahtar, readFileSync(v.yol), {
          access: 'public', addRandomSuffix: false, allowOverwrite: true, token });
        defter[v.anahtar] = url;
      } catch (e) {
        hata++;
        console.error(`HATA ${v.anahtar}: ${e.message}`);
      }
      if (++bitti % 5 === 0) {
        writeFileSync(DEFTER, JSON.stringify(defter, null, 2));
        console.log(`  yüklendi ${bitti}/${yuklenecek.length}`);
      }
    }
  }
  await Promise.all(Array.from({ length: ESZAMANLI }, isci));
  writeFileSync(DEFTER, JSON.stringify(defter, null, 2));
  console.log(`bitti — ${bitti - hata} yüklendi, ${hata} hata, ${silinecek.length} silindi`);
}

main().catch((e) => { console.error(e); process.exit(1); });
