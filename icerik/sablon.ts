/**
 * SVG post şablonları. sharp ile PNG'ye çevrilir (ek bağımlılık yok).
 *
 * Site paleti: bg #1a1207, gold #c4973a, cream #f5f0e8, muted #9a8060.
 * Her karenin altında mizac.xyz görünür — istisnasız.
 */
import type { Bicim } from './temalar';
import { OLCU } from './temalar';
import { SORU_SAYISI, TAHMINI_DAKIKA } from '../lib/mizac-data';

const GOLD = '#c4973a';
const CREAM = '#f5f0e8';
const MUTED = '#9a8060';
const BG = '#1a1207';
const BG2 = '#0f0a04';

const kacis = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Kaba genişlik tahminiyle satırlara böler (SVG'de otomatik sarma yok). */
function sar(metin: string, karakterSiniri: number): string[] {
  const kelimeler = metin.split(/\s+/);
  const satirlar: string[] = [];
  let s = '';
  for (const k of kelimeler) {
    if ((s + ' ' + k).trim().length > karakterSiniri && s) {
      satirlar.push(s.trim());
      s = k;
    } else {
      s = (s + ' ' + k).trim();
    }
  }
  if (s) satirlar.push(s);
  return satirlar;
}


/**
 * Uzun maddeleri kareye sığacak hale getirir. Veride birçok alan
 * "Başlık — uzun açıklama" biçiminde; sosyal kare için baştaki kısım yeterli.
 */
function kisalt(m: string, sinir = 85): string {
  if (m.length <= sinir) return m;
  const tire = m.indexOf(' — ');
  if (tire > 0 && tire <= sinir) return m.slice(0, tire);
  const kesim = m.lastIndexOf(' ', sinir);
  return m.slice(0, kesim > 40 ? kesim : sinir).trim() + '…';
}

function metinBloku(
  satirlar: string[],
  x: number, y: number, boyut: number, renk: string,
  hiza: 'middle' | 'start' = 'middle', satirAralik = 1.35
): string {
  return satirlar
    .map((l, i) => `<text x="${x}" y="${y + i * boyut * satirAralik}" font-family="Helvetica Neue, Helvetica, Arial" font-size="${boyut}" fill="${renk}" text-anchor="${hiza}">${kacis(l)}</text>`)
    .join('\n');
}

/** Her görselde görünen site imzası — bunu kaldırma, reklam bunun üstünde duruyor. */
function altBilgi(g: number, y: number): string {
  return `
  <rect x="0" y="${y - 96}" width="${g}" height="96" fill="${BG2}"/>
  <text x="${g / 2}" y="${y - 38}" font-family="Helvetica Neue, Helvetica, Arial" font-size="34" font-weight="bold" fill="${GOLD}" text-anchor="middle" letter-spacing="3">mizac.xyz</text>
  <text x="${g / 2}" y="${y - 12}" font-family="Helvetica Neue, Helvetica, Arial" font-size="20" fill="${MUTED}" text-anchor="middle">ücretsiz mizaç testi · İbn-i Sina geleneği</text>`;
}

function yildiz(cx: number, cy: number, r: number, renk: string): string {
  const d = `M ${cx} ${cy - r} L ${cx + r * 0.2} ${cy - r * 0.2} L ${cx + r} ${cy} L ${cx + r * 0.2} ${cy + r * 0.2} L ${cx} ${cy + r} L ${cx - r * 0.2} ${cy + r * 0.2} L ${cx - r} ${cy} L ${cx - r * 0.2} ${cy - r * 0.2} Z`;
  return `<path d="${d}" fill="${renk}"/>`;
}

export type KareGirdi = {
  bicim: Bicim;
  ustEtiket: string;      // sütun adı / mizaç
  baslik: string;
  maddeler?: string[];
  vurguRenk?: string;
  sayfa?: { su: number; toplam: number };
};

export function kareSvg(k: KareGirdi): string {
  const { g, y } = OLCU[k.bicim];
  const vurgu = k.vurguRenk || GOLD;
  const merkez = g / 2;
  const dikey = y > g * 1.5;

  const ALT_BILGI = 96;
  const guvenliDip = y - ALT_BILGI - 48;

  const baslikBoyut = dikey ? 76 : 68;
  const baslikSatir = sar(k.baslik, dikey ? 20 : 22);
  const maddeVar = !!k.maddeler?.length;

  // Madde yoksa (kapak/video kapağı) başlık bloğunu dikeyde ortala,
  // yoksa alt yarısı bomboş kalıyordu.
  const yildizY = dikey ? 300 : 210;
  const etiketY = dikey ? 410 : 300;
  const baslikY = maddeVar
    ? etiketY + 110
    : (etiketY + guvenliDip) / 2 - (baslikSatir.length * baslikBoyut * 1.2) / 2 + baslikBoyut;

  let govde = '';
  if (maddeVar) {
    const boyut = dikey ? 40 : 38;
    let cy = baslikY + baslikSatir.length * baslikBoyut * 1.2 + 70;
    for (const m of k.maddeler!) {
      const satirlar = sar(kisalt(m), dikey ? 34 : 36);
      const yukseklik = satirlar.length * boyut * 1.35 + 34;
      // Alt bilgiye taşacaksa bu maddeyi hiç yazma — yarım kalmış
      // satır görüntüsü oluşuyordu.
      if (cy + yukseklik > guvenliDip) break;
      govde += `<circle cx="${110}" cy="${cy - boyut * 0.35}" r="7" fill="${vurgu}"/>\n`;
      govde += metinBloku(satirlar, 150, cy, boyut, CREAM, 'start');
      cy += yukseklik;
    }
  }

  const sayfaEtiketi = k.sayfa
    ? `<text x="${g - 60}" y="${100}" font-family="Helvetica" font-size="26" fill="${MUTED}" text-anchor="end">${k.sayfa.su}/${k.sayfa.toplam}</text>`
    : '';

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${g}" height="${y}" viewBox="0 0 ${g} ${y}">
  <defs>
    <linearGradient id="arka" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${BG2}"/>
      <stop offset="100%" stop-color="${BG}"/>
    </linearGradient>
  </defs>
  <rect width="${g}" height="${y}" fill="url(#arka)"/>
  <circle cx="${g * 0.85}" cy="${y * 0.12}" r="${g * 0.35}" fill="${vurgu}" opacity="0.05"/>
  <circle cx="${g * 0.1}" cy="${y * 0.82}" r="${g * 0.28}" fill="${vurgu}" opacity="0.04"/>

  ${yildiz(merkez, yildizY, 46, vurgu)}
  <text x="${merkez}" y="${etiketY}" font-family="Helvetica Neue, Helvetica, Arial" font-size="26" fill="${vurgu}" text-anchor="middle" letter-spacing="6">${kacis(k.ustEtiket.toLocaleUpperCase('tr-TR'))}</text>
  ${sayfaEtiketi}

  ${metinBloku(baslikSatir, merkez, baslikY, baslikBoyut, CREAM)}
  ${govde}
  ${altBilgi(g, y)}
</svg>`;
}

/** Karusel son karesi — doğrudan siteye çağrı */
export function kapanisSvg(bicim: Bicim, vurguRenk: string, sayfa?: { su: number; toplam: number }): string {
  const { g, y } = OLCU[bicim];
  const merkez = g / 2;
  const sayfaEtiketi = sayfa
    ? `<text x="${g - 60}" y="100" font-family="Helvetica" font-size="26" fill="${MUTED}" text-anchor="end">${sayfa.su}/${sayfa.toplam}</text>`
    : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${g}" height="${y}" viewBox="0 0 ${g} ${y}">
  <rect width="${g}" height="${y}" fill="${BG2}"/>
  <circle cx="${merkez}" cy="${y * 0.42}" r="${g * 0.42}" fill="${vurguRenk}" opacity="0.06"/>
  ${yildiz(merkez, y * 0.28, 58, vurguRenk)}
  ${sayfaEtiketi}
  ${metinBloku(sar('Peki senin mizacın ne?', 18), merkez, y * 0.42, 82, CREAM)}
  ${metinBloku(sar(`${SORU_SAYISI} soruluk ücretsiz test · ${TAHMINI_DAKIKA} dakika · kayıt yok`, 30), merkez, y * 0.56, 36, MUTED)}
  <rect x="${merkez - 300}" y="${y * 0.63}" width="600" height="110" rx="55" fill="${vurguRenk}"/>
  <text x="${merkez}" y="${y * 0.63 + 72}" font-family="Helvetica Neue, Helvetica, Arial" font-size="44" font-weight="bold" fill="#ffffff" text-anchor="middle">mizac.xyz</text>
  ${altBilgi(g, y)}
</svg>`;
}
