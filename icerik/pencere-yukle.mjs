/**
 * Blob penceresinin AĞ tarafı. `~/mizac-pencere/` içinde çalışır.
 *
 *     node --env-file=.env pencere-yukle.mjs
 *
 * PROJE KLASÖRÜNE HİÇ DOKUNMAZ — bütün mesele bu. launchd altında
 * `/opt/homebrew/bin/node` `~/Documents`'ı okuyamıyor ve hata vermeden
 * asılı kalıyor (bash'in Tam Disk Erişimi çocuğuna geçmiyor; ayrıntı
 * `icerik/pencere-hazirla.py` başında). Bu yüzden okunacak her şey önce
 * Python tarafından buraya kopyalanıyor: `plan.json` ve `yuklenecek/`.
 *
 * İKİ İŞ YAPAR
 * 1. Pencere dışında kalan videoları siler — Blob'un ücretsiz planı 1 GB ve
 *    kota doluyken ÜZERİNE YAZMA BİLE reddediliyor, yani önce yer açmak şart.
 * 2. `yuklenecek/` içindekileri gerçek anahtarlarıyla yükler.
 *
 * GÖRSELLERE DOKUNMAZ: 816 PNG toplam 42 MB, kotanın %4'ü.
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { put, del, list } from '@vercel/blob';

const KOK = dirname(fileURLToPath(import.meta.url));
const PLAN = join(KOK, 'plan.json');
const YUKLENECEK = join(KOK, 'yuklenecek');
const ESZAMANLI = 6;

async function main() {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) { console.error('BLOB_READ_WRITE_TOKEN yok'); process.exit(1); }
  if (!existsSync(PLAN)) { console.error('plan.json yok — önce pencere-hazirla.py'); process.exit(1); }

  const plan = JSON.parse(readFileSync(PLAN, 'utf8'));
  const { pencere_bas: bas, pencere_son: son } = plan;
  console.log(`pencere: ${bas} → ${son}`);

  let cursor, hepsi = [];
  do {
    const r = await list({ cursor, limit: 1000, token });
    hepsi.push(...r.blobs);
    cursor = r.cursor;
  } while (cursor);
  const toplam = hepsi.reduce((s, b) => s + b.size, 0);
  console.log(`Blob'da ${hepsi.length} dosya, ${(toplam / 1e6).toFixed(0)} MB`);

  const silinecek = hepsi.filter((b) => {
    if (!b.pathname.endsWith('video.mp4')) return false;
    const g = b.pathname.split('/')[0];
    return g < bas || g > son;
  });

  // ÖNCE SİL. Kota doluyken hiçbir yazma kabul edilmiyor.
  for (let i = 0; i < silinecek.length; i += 20) {
    await del(silinecek.slice(i, i + 20).map((b) => b.url), { token });
    console.log(`  silindi ${Math.min(i + 20, silinecek.length)}/${silinecek.length}`);
  }

  const kuyruk = [...plan.yuklenecek];
  let bitti = 0, hata = 0;
  async function isci() {
    while (kuyruk.length) {
      const x = kuyruk.shift();
      const yol = join(YUKLENECEK, x.dosya);
      if (!existsSync(yol)) { hata++; console.error(`YOK ${x.dosya}`); continue; }
      try {
        await put(x.anahtar, readFileSync(yol), {
          access: 'public', addRandomSuffix: false, allowOverwrite: true, token });
      } catch (e) { hata++; console.error(`HATA ${x.anahtar}: ${e.message}`); }
      if (++bitti % 5 === 0) console.log(`  yüklendi ${bitti}/${plan.yuklenecek.length}`);
    }
  }
  await Promise.all(Array.from({ length: ESZAMANLI }, isci));

  const kalan = readdirSync(YUKLENECEK).length;
  console.log(`bitti — ${bitti - hata} yüklendi, ${hata} hata, ${silinecek.length} silindi, ${kalan} dosya hazırlıkta`);
  if (hata) process.exit(1);
}

main().catch((e) => { console.error(e); process.exit(1); });
