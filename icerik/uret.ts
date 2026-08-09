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
}

main().catch((e) => { console.error(e); process.exit(1); });
