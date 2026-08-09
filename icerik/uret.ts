/**
 * Yıllık sosyal medya içerik üreticisi.
 *
 *   node --import ./icerik/kayit.mjs icerik/uret.ts [--yil 2026] [--gorselsiz]
 *
 * Üretilenler (icerik/cikti/):
 *   takvim.csv              — tabloya/Sheets'e aktarılabilir yayın takvimi
 *   postlar/<tarih>-<...>.md — post başına hazır metin ve video senaryosu
 *   gorsel/<...>.png        — yüklemeye hazır görseller
 *
 * Hiçbir metin elle yazılmaz; hepsi uygulamanın verisinden türetilir.
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { mizacProfiller } from '../lib/mizac-data';
import { atomlariUret } from './kaynak';
import type { Atom } from './kaynak';
import { KADANS, AYLIK_UZUN, ETIKETLER, CTA, SUTUNLAR, VIDEO_BICIMLERI } from './temalar';
import type { Bicim, Platform } from './temalar';
import { kareSvg, kapanisSvg } from './sablon';

const KOK = path.resolve(import.meta.dirname);
const CIKTI = path.join(KOK, 'cikti');
const SITE = 'mizac.xyz';

const arg = (ad: string, varsayilan?: string) => {
  const i = process.argv.indexOf(`--${ad}`);
  return i >= 0 ? process.argv[i + 1] : varsayilan;
};
/** Varsayılan başlangıç: yarın. Takvimin ocakta başlaması için sebep yok. */
function yarin(): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
}
const BASLANGIC = arg('baslangic', yarin())!;
const GUN_SAYISI = Number(arg('gun', '365'));
const GORSEL_URET = !process.argv.includes('--gorselsiz');

type Post = {
  tarih: string;
  platform: Platform;
  bicim: Bicim;
  atom: Atom;
  baslik: string;
  metin: string;
  etiketler: string;
  gorseller: string[];
  dosya: string;
  /** Gün klasöründeki alt yol: 2026-08-10/instagram-karusel */
  klasor: string;
};

/**
 * Sütunlar arasında sırayla dolaşan seçici.
 *
 * Basitçe atomları karıştırmak dengesiz sonuç veriyordu: 31 blog yazısı tek
 * grup olduğu için blog sütunu payın beşte birini alıyordu. Burada önce
 * sütunlar arasında sıra dönüyor, her sütunun kendi atomları da kendi içinde
 * döngüye giriyor. Böylece her sütun eşit paya sahip oluyor ve aynı mizaç
 * arka arkaya gelmiyor.
 */
function sutunDonusu(atomlar: Atom[]) {
  const sutunlar = new Map<string, Atom[]>();
  for (const a of atomlar) {
    if (!sutunlar.has(a.sutun)) sutunlar.set(a.sutun, []);
    sutunlar.get(a.sutun)!.push(a);
  }
  const anahtarlar = [...sutunlar.keys()];
  const imlecler = new Map(anahtarlar.map((k) => [k, 0]));
  let sutunIndex = 0;
  return () => {
    const k = anahtarlar[sutunIndex++ % anahtarlar.length];
    const liste = sutunlar.get(k)!;
    const i = imlecler.get(k)!;
    imlecler.set(k, i + 1);
    return liste[i % liste.length];
  };
}

function videoSenaryosu(a: Atom, bicim: Bicim): string {
  const uzun = bicim === 'uzun';
  const saniye = uzun ? [0, 20, 60, 180, 300] : [0, 3, 8, 18, 25];
  const sahneler = [
    ['Kanca', a.baslik],
    ['Bağlam', a.maddeler[0] ?? ''],
    ['Ana içerik', a.maddeler.slice(1, uzun ? 6 : 3).join(' · ')],
    ['Örnek / derinleştirme', a.maddeler.slice(uzun ? 6 : 3, uzun ? 10 : 5).join(' · ') || 'İzleyiciye kendi hayatından örnek sordur.'],
    ['Kapanış (zorunlu)', `"Kendi mizacını öğrenmek istersen ${SITE}. 60 soru, 8 dakika, ücretsiz." Ekranda ${SITE} yazsın.`],
  ];
  return sahneler
    .map(([ad, icerik], i) => `**${saniye[i]}${uzun ? 'sn' : 'sn'} — ${ad}**\n${icerik}`)
    .join('\n\n');
}

function postMetni(a: Atom, platform: Platform): string {
  const p = a.mizac ? mizacProfiller[a.mizac] : null;
  const basSatir = p ? `${p.elementSembol} ${a.baslik}` : `✦ ${a.baslik}`;
  const govde = a.maddeler.slice(0, 5).map((m) => `• ${m}`).join('\n');
  return [
    basSatir,
    '',
    govde,
    '',
    CTA[platform],
    '',
    `Kaynak: Varlığın Tahlili — Zeynep Işık Büyükbay · ${SITE}`,
  ].join('\n');
}

async function gorselYaz(svg: string, hedef: string) {
  await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(hedef);
}


/**
 * Gezilebilir HTML dizini. 429 markdown dosyasını tek tek açmak yerine
 * tarayıcıda ay/platform süzerek bakılır, metin tek tıkla kopyalanır.
 * Görseller göreli yolla gömülür — dosyayı çift tıklayıp açmak yeterli.
 */
function dizinYaz(postlar: Post[]) {
  // Gün gün gruplanmış akış: bir ekranda bir gün, sırayla ilerler.
  const gunler = new Map<string, Post[]>();
  for (const p of postlar) {
    if (!gunler.has(p.tarih)) gunler.set(p.tarih, []);
    gunler.get(p.tarih)!.push(p);
  }
  const veri = [...gunler.entries()].map(([tarih, liste]) => ({
    t: tarih,
    postlar: liste.map((p) => ({
      pl: p.platform,
      b: p.bicim,
      s: SUTUNLAR[p.atom.sutun].ad,
      m: p.atom.mizac ? mizacProfiller[p.atom.mizac].isim : '',
      baslik: p.baslik,
      metin: p.metin + '\n' + p.etiketler,
      g: p.gorseller,
      klasor: p.klasor,
      video: VIDEO_BICIMLERI.includes(p.bicim),
      md: `postlar/${p.dosya}.md`,
    })),
  }));

  const html = `<!doctype html><html lang="tr"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Mizaç · Günlük Post Akışı</title>
<style>
:root{--bg:#14100a;--kart:#1f1810;--gold:#c4973a;--cream:#f5f0e8;--muted:#9a8060;--kenar:#3d2c0e}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--cream);font:16px/1.6 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial}
header{position:sticky;top:0;background:#0f0a04;border-bottom:1px solid var(--kenar);padding:12px 16px;display:flex;gap:12px;align-items:center;z-index:9}
.gun{font-size:19px;font-weight:700;color:var(--gold)}
.ilerleme{color:var(--muted);font-size:13px}
nav{margin-left:auto;display:flex;gap:8px}
button{background:var(--gold);color:#1a1207;border:0;border-radius:9px;padding:9px 15px;font-weight:700;cursor:pointer;font-size:14px}
button.ikincil{background:transparent;color:var(--gold);border:1px solid var(--gold)}
button:disabled{opacity:.35;cursor:default}
main{max-width:760px;margin:0 auto;padding:18px 16px 90px}
.post{background:var(--kart);border:1px solid var(--kenar);border-radius:16px;margin-bottom:20px;overflow:hidden}
.ust{padding:13px 16px;border-bottom:1px solid var(--kenar);display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.rozet{font-size:12px;padding:3px 9px;border-radius:99px;border:1px solid var(--kenar);color:var(--muted)}
.pl{background:var(--gold);color:#1a1207;font-weight:700;border:0}
.uyari{background:#4a2f0a;color:#f0c987;border:0}
h2{margin:14px 16px 6px;font-size:19px}
.slayt{display:flex;gap:10px;overflow-x:auto;padding:12px 16px;scroll-snap-type:x mandatory}
.slayt figure{margin:0;flex:0 0 auto;scroll-snap-align:center;text-align:center}
.slayt img{height:340px;border-radius:10px;border:1px solid var(--kenar);display:block}
.slayt figcaption{font-size:11px;color:var(--muted);margin-top:5px}
pre{margin:0 16px;padding:13px;background:#0f0a04;border-radius:10px;white-space:pre-wrap;font:13px/1.6 ui-monospace,Menlo,monospace;color:#e8d5b0}
.alt{padding:13px 16px;display:flex;gap:9px;flex-wrap:wrap}
a.dl{background:transparent;color:var(--gold);border:1px solid var(--gold);border-radius:9px;padding:9px 15px;font-weight:700;font-size:14px;text-decoration:none;display:inline-block}
.bos{text-align:center;color:var(--muted);padding:60px 20px}
dialog{border:0;background:transparent;padding:0}
dialog img{max-width:96vw;max-height:96vh;border-radius:10px}
dialog::backdrop{background:#000d}
.atla{padding:0 16px 14px;display:flex;gap:8px;align-items:center}
input[type=date]{background:var(--kart);color:var(--cream);border:1px solid var(--kenar);border-radius:8px;padding:7px 10px}
</style></head><body>
<header>
  <div>
    <div class="gun" id="gunBaslik"></div>
    <div class="ilerleme" id="ilerleme"></div>
  </div>
  <nav>
    <button class="ikincil" id="geri">‹ Dün</button>
    <button id="ileri">Yarın ›</button>
  </nav>
</header>
<div class="atla"><span class="ilerleme">Tarihe git:</span><input type="date" id="tarihSec"></div>
<main id="icerik"></main>
<dialog id="buyut"><img id="buyutImg" alt=""></dialog>
<script>
const G = ${JSON.stringify(veri)};
const GUNLER = ['Pazar','Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi'];
const AYLAR = ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
const el = (i) => document.getElementById(i);
const kacir = (t) => t.replace(/[&<>]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
let n = 0;

function tarihYaz(iso) {
  const d = new Date(iso + 'T00:00:00');
  return d.getDate() + ' ' + AYLAR[d.getMonth()] + ' ' + d.getFullYear() + ', ' + GUNLER[d.getDay()];
}

function ciz() {
  const g = G[n];
  el('gunBaslik').textContent = tarihYaz(g.t);
  el('ilerleme').textContent = (n + 1) + ' / ' + G.length + ' · bugün ' + g.postlar.length + ' post';
  el('tarihSec').value = g.t;
  el('geri').disabled = n === 0;
  el('ileri').disabled = n === G.length - 1;

  el('icerik').innerHTML = g.postlar.map((p, i) => \`
    <div class="post">
      <div class="ust">
        <span class="rozet pl">\${p.pl}</span>
        <span class="rozet">\${p.b}</span>
        <span class="rozet">\${p.s}</span>
        \${p.m ? '<span class="rozet">' + p.m + '</span>' : ''}
        \${p.video ? '<span class="rozet uyari">video çekilmeli — kapak + senaryo hazır</span>' : ''}
      </div>
      <h2>\${kacir(p.baslik)}</h2>
      <div class="slayt">\${p.g.map((x, k) =>
        '<figure><img loading="lazy" src="gunluk/' + p.klasor + '/' + x + '" alt=""><figcaption>' + (k+1) + '/' + p.g.length + '</figcaption></figure>').join('')}</div>
      <pre id="m\${i}">\${kacir(p.metin)}</pre>
      <div class="alt">
        <button onclick="kopyala('m\${i}',this)">Metni kopyala</button>
        \${p.g.map((x, k) => '<a class="dl" href="gunluk/' + p.klasor + '/' + x + '" download>Görsel ' + (k+1) + ' indir</a>').join('')}
        \${p.video ? '<a class="dl" href="' + p.md + '">Senaryo →</a>' : ''}
      </div>
    </div>\`).join('') || '<div class="bos">Bu gün için post yok.</div>';
  window.scrollTo({ top: 0 });
  location.hash = g.t;
}

function kopyala(id, btn) {
  navigator.clipboard.writeText(el(id).textContent).then(() => {
    const e = btn.textContent; btn.textContent = 'Kopyalandı ✓';
    setTimeout(() => btn.textContent = e, 1200);
  });
}
el('geri').onclick = () => { if (n > 0) { n--; ciz(); } };
el('ileri').onclick = () => { if (n < G.length - 1) { n++; ciz(); } };
el('tarihSec').onchange = (e) => { const i = G.findIndex(x => x.t === e.target.value); if (i >= 0) { n = i; ciz(); } };
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') el('geri').click();
  if (e.key === 'ArrowRight') el('ileri').click();
});
document.addEventListener('click', (e) => {
  if (e.target.tagName === 'IMG' && e.target.closest('.slayt')) { el('buyutImg').src = e.target.src; el('buyut').showModal(); }
});
el('buyut').onclick = () => el('buyut').close();
// dokunmatik kaydırma
let x0 = null;
document.addEventListener('touchstart', (e) => x0 = e.changedTouches[0].clientX, { passive: true });
document.addEventListener('touchend', (e) => {
  if (x0 === null) return;
  const fark = e.changedTouches[0].clientX - x0;
  if (Math.abs(fark) > 90) (fark < 0 ? el('ileri') : el('geri')).click();
  x0 = null;
}, { passive: true });

// adres çubuğundaki tarihe ya da bugüne en yakın güne aç
const istenen = location.hash.slice(1);
const bugun = new Date().toISOString().slice(0, 10);
const bul = G.findIndex(x => x.t >= (istenen || bugun));
n = bul >= 0 ? bul : 0;
ciz();
</script></body></html>`;
  fs.writeFileSync(path.join(CIKTI, 'index.html'), html);
}


/**
 * Zamanlayıcıya toplu yüklenecek CSV'ler.
 *
 * Meta Business Suite, Later, Buffer, Metricool gibi araçların hepsi CSV/
 * tablo içe aktarımını destekler ama sütun adları araçtan araca değişir.
 * Burada yaygın sütun adlarıyla düz bir dosya üretilir; içe aktarırken
 * eşleme (mapping) ekranında bir kez karşılık gösterilmesi yeterlidir.
 * Medya için hem dosya adı hem tam yol verilir — bazı araçlar tam yol ister.
 */
function zamanlayiciYaz(postlar: Post[]) {
  const dizin = path.join(CIKTI, 'zamanlayici');
  fs.mkdirSync(dizin, { recursive: true });
  const k = (s: string) => `"${s.replace(/"/g, '""')}"`;

  // Platforma göre yayın saati — hedef kitlenin aktif olduğu varsayılan saatler
  const SAAT: Record<Platform, string> = {
    instagram: '19:30',
    tiktok: '20:30',
    youtube: '18:00',
  };

  for (const platform of ['instagram', 'tiktok', 'youtube'] as Platform[]) {
    const secili = postlar.filter((p) => p.platform === platform);
    const satirlar = [
      'Date,Time,Platform,Format,Caption,Hashtags,MediaFiles,MediaPaths,Title',
      ...secili.map((p) => [
        p.tarih,
        SAAT[platform],
        platform,
        p.bicim,
        k(p.metin),
        k(p.etiketler),
        k(p.gorseller.join(' | ')),
        k(p.gorseller.map((g) => path.join(CIKTI, 'gunluk', p.klasor, g)).join(' | ')),
        k(p.baslik),
      ].join(',')),
    ];
    fs.writeFileSync(path.join(dizin, `${platform}.csv`), satirlar.join('\n'));
  }

  fs.writeFileSync(path.join(dizin, 'OKU.md'), [
    '# Zamanlayıcıya toplu yükleme',
    '',
    'Bu klasördeki CSV\'ler bir yıllık planı zamanlama araçlarına tek seferde',
    'yüklemek içindir. Yüklendikten sonra postları araç kendisi yayınlar.',
    '',
    '| Dosya | İçerik |',
    '|---|---|',
    '| `instagram.csv` | Instagram postları (karusel, tek görsel, reels) |',
    '| `tiktok.csv` | TikTok videoları |',
    '| `youtube.csv` | Shorts ve uzun videolar |',
    '',
    '## Sütunlar',
    '',
    '`Date, Time, Platform, Format, Caption, Hashtags, MediaFiles, MediaPaths, Title`',
    '',
    'İçe aktarma sırasında araç kendi alanlarıyla eşleme ister; sütun adları',
    'araçtan araca değiştiği için bunu bir kez elle göstermek gerekir.',
    '',
    '## Önemli',
    '',
    '- **Video biçimleri** (reels/tiktok/shorts/uzun) için burada yalnızca kapak',
    '  görseli ve senaryo var. Videoyu çekip kurgulamadan zamanlayıcıya',
    '  yükleyemezsiniz. Senaryolar `postlar/` klasöründe.',
    '- **Karusel** postlarında `MediaFiles` birden çok dosya içerir, sırası',
    '  önemlidir (kapak → içerik → mizac.xyz çağrısı).',
    '- Saatler varsayılan; kendi analitiğinize göre değiştirin.',
    '',
  ].join('\n'));
}


/**
 * Her gün klasörünün köküne "bugün ne yapılacak" notu. Klasörü açan kişi
 * uygulamayı çalıştırmadan, tarayıcı açmadan ne paylaşacağını görsün.
 */
function gunNotuYaz(postlar: Post[]) {
  const gunler = new Map<string, Post[]>();
  for (const p of postlar) {
    if (!gunler.has(p.tarih)) gunler.set(p.tarih, []);
    gunler.get(p.tarih)!.push(p);
  }
  const GUN_ADI = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
  for (const [tarih, liste] of gunler) {
    const d = new Date(tarih + 'T00:00:00Z');
    const satirlar = [
      `${tarih} — ${GUN_ADI[d.getUTCDay()]}`,
      `Bugün ${liste.length} post var.`,
      '',
    ];
    liste.forEach((p, i) => {
      const video = VIDEO_BICIMLERI.includes(p.bicim);
      const alt = p.klasor.split('/')[1];
      satirlar.push(
        `${i + 1}) ${p.platform.toUpperCase()} · ${p.bicim}`,
        `   klasör : ${alt}/`,
        `   konu   : ${p.baslik}`,
        video
          ? `   yapılacak: VIDEO ÇEKİLECEK. kapak.png kapak karesi, SENARYO.md sahne planı.`
          : `   yapılacak: ${p.gorseller.length} görseli (${p.gorseller.join(', ')}) sırayla yükle, METIN.txt'yi yapıştır.`,
        '',
      );
    });
    satirlar.push('Not: Karusel görsellerinin sırası önemli — son kare mizac.xyz çağrısıdır.');
    fs.writeFileSync(path.join(CIKTI, 'gunluk', tarih, '_BUGUN.txt'), satirlar.join('\n'));
  }
}

async function main() {
  fs.rmSync(CIKTI, { recursive: true, force: true });
  fs.mkdirSync(path.join(CIKTI, 'postlar'), { recursive: true });
  fs.mkdirSync(path.join(CIKTI, 'gorsel'), { recursive: true });

  const tumAtomlar = atomlariUret();
  const testAtomlari = tumAtomlar.filter((a) => a.sutun === 'test');
  const uyumAtomlari = tumAtomlar.filter((a) => a.sutun === 'uyum');

  const sonrakiGenel = sutunDonusu(tumAtomlar.filter((a) => a.sutun !== 'test'));
  let ti = 0, ui = 0;
  const sonrakiTest = () => testAtomlari[ti++ % testAtomlari.length];
  const sonrakiUyum = () => uyumAtomlari[ui++ % uyumAtomlari.length];

  const postlar: Post[] = [];
  const baslangic = new Date(BASLANGIC + 'T00:00:00Z');
  const bitis = new Date(baslangic);
  bitis.setUTCDate(bitis.getUTCDate() + GUN_SAYISI - 1);

  for (let d = new Date(baslangic); d <= bitis; d.setUTCDate(d.getUTCDate() + 1)) {
    const gun = d.getUTCDay();
    const tarih = d.toISOString().slice(0, 10);

    const slotlar = KADANS.filter((s) => s.gun === gun).map((s) => ({ ...s }));
    // ayın ilk pazarı: uzun YouTube videosu
    if (gun === 0 && d.getUTCDate() <= 7) slotlar.push({ gun, ...AYLIK_UZUN });

    for (const slot of slotlar) {
      const atom =
        slot.sutun === 'test' ? sonrakiTest()
        : slot.sutun === 'uyum' ? sonrakiUyum()
        : sonrakiGenel();

      postlar.push({
        tarih,
        platform: slot.platform,
        bicim: slot.bicim,
        atom,
        baslik: atom.baslik,
        metin: postMetni(atom, slot.platform),
        etiketler: ETIKETLER[slot.platform].join(' '),
        gorseller: [],
        dosya: `${tarih}-${slot.platform}-${slot.bicim}-${atom.id}`,
        klasor: '',
      });
    }
  }

  // Aynı günde aynı platformdan birden çok post olabilir; klasör adı çakışmasın
  const gunSayaci = new Map<string, number>();
  for (const post of postlar) {
    const taban = `${post.tarih}/${post.platform}-${post.bicim}`;
    const n = (gunSayaci.get(taban) ?? 0) + 1;
    gunSayaci.set(taban, n);
    post.klasor = n === 1 ? taban : `${taban}-${n}`;
  }

  // Görseller ve post dosyaları
  let uretilenGorsel = 0;
  for (const post of postlar) {
    const renk = post.atom.mizac ? mizacProfiller[post.atom.mizac].renk : '#c4973a';
    const etiket = SUTUNLAR[post.atom.sutun].ad;
    const gunDizin = path.join(CIKTI, 'gunluk', post.klasor);
    fs.mkdirSync(gunDizin, { recursive: true });

    if (GORSEL_URET) {
      if (post.bicim === 'karusel') {
        const maddeler = post.atom.maddeler.slice(0, 3);
        const toplam = maddeler.length + 2;
        const kareler: string[] = [
          kareSvg({ bicim: post.bicim, ustEtiket: etiket, baslik: post.atom.baslik, vurguRenk: renk, sayfa: { su: 1, toplam } }),
          ...maddeler.map((m, i) =>
            kareSvg({ bicim: post.bicim, ustEtiket: etiket, baslik: m, vurguRenk: renk, sayfa: { su: i + 2, toplam } })),
          kapanisSvg(post.bicim, renk, { su: toplam, toplam }),
        ];
        for (let i = 0; i < kareler.length; i++) {
          const ad = `${i + 1}.png`;
          await gorselYaz(kareler[i], path.join(gunDizin, ad));
          post.gorseller.push(ad);
          uretilenGorsel++;
        }
      } else {
        // tek görsel: statik post ya da videonun kapak karesi
        const svg = kareSvg({
          bicim: post.bicim, ustEtiket: etiket, baslik: post.atom.baslik,
          maddeler: VIDEO_BICIMLERI.includes(post.bicim) ? undefined : post.atom.maddeler.slice(0, 4),
          vurguRenk: renk,
        });
        const ad = VIDEO_BICIMLERI.includes(post.bicim) ? 'kapak.png' : '1.png';
        await gorselYaz(svg, path.join(gunDizin, ad));
        post.gorseller.push(ad);
        uretilenGorsel++;
      }
    }

    const video = VIDEO_BICIMLERI.includes(post.bicim);
    const md = [
      `# ${post.baslik}`,
      '',
      `- **Tarih:** ${post.tarih}`,
      `- **Platform:** ${post.platform}`,
      `- **Biçim:** ${post.bicim}`,
      `- **Sütun:** ${etiket}`,
      ...(post.atom.mizac ? [`- **Mizaç:** ${mizacProfiller[post.atom.mizac].isim}`] : []),
      `- **Veri kaynağı:** \`${post.atom.kaynak}\``,
      `- **Görsel:** ${post.gorseller.join(', ') || '—'}`,
      '',
      video ? '## Video senaryosu' : '## Görsel metni',
      '',
      video ? videoSenaryosu(post.atom, post.bicim) : post.atom.maddeler.map((m) => `- ${m}`).join('\n'),
      '',
      '## Açıklama metni',
      '',
      '```',
      post.metin,
      '```',
      '',
      '## Etiketler',
      '',
      post.etiketler,
      '',
    ].join('\n');
    fs.writeFileSync(path.join(CIKTI, 'postlar', `${post.dosya}.md`), md);

    // Gün klasörü: paylaşmak için gereken her şey, uygulama çalıştırmadan
    fs.writeFileSync(path.join(gunDizin, 'METIN.txt'), `${post.metin}\n${post.etiketler}\n`);
    if (video) {
      fs.writeFileSync(path.join(gunDizin, 'SENARYO.md'),
        `# ${post.baslik}\n\n${post.tarih} · ${post.platform} · ${post.bicim}\n\n` +
        `> Bu bir video postu. Kapak görseli ve senaryo hazır, videoyu çekmen gerekiyor.\n\n` +
        videoSenaryosu(post.atom, post.bicim) + '\n');
    }
  }

  // Takvim CSV
  const csvKacis = (s: string) => `"${s.replace(/"/g, '""').replace(/\n/g, ' ')}"`;
  const csv = [
    'tarih,platform,bicim,sutun,mizac,baslik,cta,gorsel_sayisi,dosya',
    ...postlar.map((p) => [
      p.tarih, p.platform, p.bicim, p.atom.sutun,
      p.atom.mizac ?? '', csvKacis(p.baslik), csvKacis(CTA[p.platform]),
      String(p.gorseller.length), p.dosya,
    ].join(',')),
  ].join('\n');
  fs.writeFileSync(path.join(CIKTI, 'takvim.csv'), csv);

  gunNotuYaz(postlar);
  dizinYaz(postlar);
  zamanlayiciYaz(postlar);

  // Özet
  const sayac = (f: (p: Post) => string) =>
    postlar.reduce<Record<string, number>>((a, p) => { const k = f(p); a[k] = (a[k] || 0) + 1; return a; }, {});

  console.log(`İçerik planı üretildi: ${BASLANGIC} → ${bitis.toISOString().slice(0, 10)} (${GUN_SAYISI} gün)`);
  console.log(`  toplam post   : ${postlar.length}`);
  console.log(`  platform      : ${JSON.stringify(sayac((p) => p.platform))}`);
  console.log(`  biçim         : ${JSON.stringify(sayac((p) => p.bicim))}`);
  console.log(`  sütun         : ${JSON.stringify(sayac((p) => p.atom.sutun))}`);
  console.log(`  üretilen görsel: ${uretilenGorsel}`);
  console.log(`  çıktı         : icerik/cikti/`);
  console.log(`  gezinmek için : open icerik/cikti/index.html`);
}

main().catch((e) => { console.error(e); process.exit(1); });
