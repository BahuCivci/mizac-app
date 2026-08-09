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
const YIL = Number(arg('yil', String(new Date().getFullYear() + 1)));
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
  const veri = postlar.map((p) => ({
    t: p.tarih,
    pl: p.platform,
    b: p.bicim,
    s: SUTUNLAR[p.atom.sutun].ad,
    m: p.atom.mizac ? mizacProfiller[p.atom.mizac].isim : '',
    baslik: p.baslik,
    metin: p.metin,
    etiket: p.etiketler,
    g: p.gorseller,
    md: `postlar/${p.dosya}.md`,
  }));

  const html = `<!doctype html><html lang="tr"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Mizaç · ${YIL} İçerik Takvimi</title>
<style>
:root{--bg:#14100a;--kart:#1f1810;--gold:#c4973a;--cream:#f5f0e8;--muted:#9a8060;--kenar:#3d2c0e}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--cream);font:15px/1.6 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial}
header{position:sticky;top:0;background:#0f0a04;border-bottom:1px solid var(--kenar);padding:14px 20px;z-index:5}
h1{margin:0 0 10px;font-size:19px;color:var(--gold)}
.suz{display:flex;gap:8px;flex-wrap:wrap}
select,input{background:var(--kart);color:var(--cream);border:1px solid var(--kenar);border-radius:8px;padding:7px 10px;font-size:14px}
.sayac{color:var(--muted);font-size:13px;margin-left:auto;align-self:center}
main{display:grid;grid-template-columns:repeat(auto-fill,minmax(330px,1fr));gap:14px;padding:18px;max-width:1600px;margin:0 auto}
.kart{background:var(--kart);border:1px solid var(--kenar);border-radius:14px;overflow:hidden;display:flex;flex-direction:column}
.ust{padding:11px 13px;border-bottom:1px solid var(--kenar);display:flex;gap:7px;align-items:center;flex-wrap:wrap}
.rozet{font-size:11px;padding:2px 8px;border-radius:99px;border:1px solid var(--kenar);color:var(--muted)}
.tarih{font-weight:700;color:var(--gold);font-size:13px}
.gorseller{display:flex;gap:6px;overflow-x:auto;padding:11px 13px;scrollbar-width:thin}
.gorseller img{height:190px;border-radius:8px;border:1px solid var(--kenar);cursor:zoom-in;flex:0 0 auto}
.baslik{padding:0 13px;font-weight:600}
pre{margin:10px 13px;padding:11px;background:#0f0a04;border-radius:8px;white-space:pre-wrap;font:12px/1.55 ui-monospace,Menlo,monospace;color:#e8d5b0;max-height:190px;overflow:auto}
.alt{margin-top:auto;padding:11px 13px;display:flex;gap:8px;flex-wrap:wrap}
button{background:var(--gold);color:#1a1207;border:0;border-radius:8px;padding:7px 12px;font-weight:700;cursor:pointer;font-size:13px}
button.ikincil{background:transparent;color:var(--gold);border:1px solid var(--gold)}
a{color:var(--gold)}
dialog{border:0;background:transparent;padding:0;max-width:96vw;max-height:96vh}
dialog img{max-width:96vw;max-height:96vh;border-radius:10px}
dialog::backdrop{background:#000c}
</style></head><body>
<header>
  <h1>Mizaç · ${YIL} içerik takvimi — <span id="toplam"></span> post</h1>
  <div class="suz">
    <select id="fPlatform"><option value="">Tüm platformlar</option></select>
    <select id="fAy"><option value="">Tüm aylar</option></select>
    <select id="fSutun"><option value="">Tüm sütunlar</option></select>
    <input id="fArama" placeholder="Başlıkta ara…" size="22">
    <span class="sayac" id="sayac"></span>
  </div>
</header>
<main id="liste"></main>
<dialog id="buyut"><img id="buyutImg" alt=""></dialog>
<script>
const P = ${JSON.stringify(veri)};
const AYLAR = ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
const el = (id) => document.getElementById(id);
el('toplam').textContent = P.length;
const doldur = (sel, degerler) => degerler.forEach(d => { const o=document.createElement('option'); o.value=d; o.textContent=d; sel.appendChild(o); });
doldur(el('fPlatform'), [...new Set(P.map(p=>p.pl))]);
doldur(el('fSutun'), [...new Set(P.map(p=>p.s))].sort());
AYLAR.forEach((a,i) => { const o=document.createElement('option'); o.value=String(i+1).padStart(2,'0'); o.textContent=a; el('fAy').appendChild(o); });

function ciz() {
  const pl=el('fPlatform').value, ay=el('fAy').value, su=el('fSutun').value, q=el('fArama').value.toLocaleLowerCase('tr');
  const secili = P.filter(p =>
    (!pl||p.pl===pl) && (!ay||p.t.slice(5,7)===ay) && (!su||p.s===su) &&
    (!q||p.baslik.toLocaleLowerCase('tr').includes(q)));
  el('sayac').textContent = secili.length + ' post gösteriliyor';
  el('liste').innerHTML = secili.map((p,i) => \`
    <div class="kart">
      <div class="ust">
        <span class="tarih">\${p.t}</span>
        <span class="rozet">\${p.pl}</span>
        <span class="rozet">\${p.b}</span>
        <span class="rozet">\${p.s}</span>
        \${p.m?'<span class="rozet">'+p.m+'</span>':''}
      </div>
      <div class="gorseller">\${p.g.map(g=>'<img loading="lazy" src="gorsel/'+g+'" alt="">').join('')}</div>
      <div class="baslik">\${p.baslik}</div>
      <pre id="m\${i}">\${p.metin.replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]))}

\${p.etiket}</pre>
      <div class="alt">
        <button onclick="kopyala('m\${i}',this)">Metni kopyala</button>
        <a class="rozet" href="\${p.md}">brief →</a>
      </div>
    </div>\`).join('');
}
function kopyala(id, btn) {
  navigator.clipboard.writeText(document.getElementById(id).textContent).then(()=>{
    const e=btn.textContent; btn.textContent='Kopyalandı ✓'; setTimeout(()=>btn.textContent=e,1200);
  });
}
document.addEventListener('click', e => {
  if (e.target.tagName==='IMG' && e.target.closest('.gorseller')) {
    el('buyutImg').src = e.target.src; el('buyut').showModal();
  }
});
el('buyut').addEventListener('click', ()=>el('buyut').close());
['fPlatform','fAy','fSutun'].forEach(id=>el(id).addEventListener('change',ciz));
el('fArama').addEventListener('input',ciz);
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
        k(p.gorseller.map((g) => path.join(CIKTI, 'gorsel', g)).join(' | ')),
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
  const baslangic = new Date(Date.UTC(YIL, 0, 1));
  const bitis = new Date(Date.UTC(YIL, 11, 31));

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
      });
    }
  }

  // Görseller ve post dosyaları
  let uretilenGorsel = 0;
  for (const post of postlar) {
    const renk = post.atom.mizac ? mizacProfiller[post.atom.mizac].renk : '#c4973a';
    const etiket = SUTUNLAR[post.atom.sutun].ad;

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
          const ad = `${post.dosya}-${i + 1}.png`;
          await gorselYaz(kareler[i], path.join(CIKTI, 'gorsel', ad));
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
        const ad = `${post.dosya}.png`;
        await gorselYaz(svg, path.join(CIKTI, 'gorsel', ad));
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

  dizinYaz(postlar);
  zamanlayiciYaz(postlar);

  // Özet
  const sayac = (f: (p: Post) => string) =>
    postlar.reduce<Record<string, number>>((a, p) => { const k = f(p); a[k] = (a[k] || 0) + 1; return a; }, {});

  console.log(`${YIL} yılı içerik planı üretildi`);
  console.log(`  toplam post   : ${postlar.length}`);
  console.log(`  platform      : ${JSON.stringify(sayac((p) => p.platform))}`);
  console.log(`  biçim         : ${JSON.stringify(sayac((p) => p.bicim))}`);
  console.log(`  sütun         : ${JSON.stringify(sayac((p) => p.atom.sutun))}`);
  console.log(`  üretilen görsel: ${uretilenGorsel}`);
  console.log(`  çıktı         : icerik/cikti/`);
  console.log(`  gezinmek için : open icerik/cikti/index.html`);
}

main().catch((e) => { console.error(e); process.exit(1); });
