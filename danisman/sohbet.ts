/**
 * Terminalde çalışan danışman prototipi.
 *
 *   node --import ./icerik/kayit.mjs danisman/sohbet.ts
 *
 * Sunucudaki modele bağlanır (VPN gerekir):
 *   MIZAC_OLLAMA=http://localhost:11500 node --import ./icerik/kayit.mjs danisman/sohbet.ts
 * Claude'a geçmek için tek değişken:
 *   MIZAC_SAGLAYICI=claude ANTHROPIC_API_KEY=... node --import ...
 *
 * Komutlar: /durum — okuduklarını göster, /cik — çık
 */
import * as readline from 'node:readline/promises';
import { saglayiciSec, type Mesaj } from './model';
import { danismanPromptu } from './persona';
import { kanitCikar, puanla, eksikAlanlar, yonerge, type Kanit } from './kanit';
import { mizacProfiller } from '@/lib/mizac-data';

const saglayici = saglayiciSec();
const kanitlar: Kanit[] = [];
const gecmis: Mesaj[] = [];

function durumYaz() {
  const d = puanla(kanitlar);
  console.log('\n  ── okuduklarım ──');
  if (!kanitlar.length) {
    console.log('  henüz gösterge yok');
  } else {
    for (const k of kanitlar) {
      console.log(`  ${k.mizac.padEnd(8)} ${String(k.guc)}  ${k.gosterge}  ← "${k.alinti}"`);
    }
    const p = d.puanlar;
    console.log(
      `  puan: safravi ${p.safravi} · demevi ${p.demevi} · balgami ${p.balgami} · sevdavi ${p.sevdavi}`
    );
    console.log(
      `  şu an: ${mizacProfiller[d.kazanan].isim} (güven %${Math.round(d.guven * 100)})`
    );
  }
  const eksik = eksikAlanlar(kanitlar);
  if (eksik.length) console.log(`  hiç değinilmeyen alanlar: ${eksik.join(', ')}`);
  console.log('  ─────────────────\n');
}

async function main() {
  const arayuz = readline.createInterface({ input: process.stdin, output: process.stdout });

  console.log(`mizaç danışmanı — ${saglayici.ad}`);
  console.log('anlatmak istediğin şeyi yaz. /durum ile ne okuduğumu görürsün, /cik ile çıkarsın.\n');

  gecmis.push({ rol: 'sistem', metin: danismanPromptu() });

  const acilis =
    'Merhaba. Ben mizacını anlamana yardım eden bir danışmanım — sana soru listesi ' +
    'okumayacağım, konuşurken anlamaya çalışacağım. Nasıl gidiyor, seni bugünlerde ' +
    'en çok ne yoruyor?';
  console.log(`danışman: ${acilis}\n`);
  gecmis.push({ rol: 'danisman', metin: acilis });

  for (;;) {
    const soz = (await arayuz.question('sen: ')).trim();
    if (!soz) continue;
    if (soz === '/cik') break;
    if (soz === '/durum') {
      durumYaz();
      continue;
    }

    gecmis.push({ rol: 'kullanici', metin: soz });

    // Kanıt çıkarma ile cevap üretme birbirini beklemez.
    const yeniKanitSozu = kanitCikar(
      saglayici,
      soz,
      gecmis.slice(-6).filter((m) => m.rol !== 'sistem').map((m) => `${m.rol}: ${m.metin}`)
    );

    const not = yonerge(kanitlar);
    const istem: Mesaj[] = not
      ? [...gecmis, { rol: 'sistem' as const, metin: not }]
      : [...gecmis];

    let cevap: string;
    try {
      cevap = await saglayici.sor(istem, { sicaklik: 0.7, enFazlaJeton: 400 });
    } catch (e) {
      console.error(`\n[model hatası: ${(e as Error).message}]\n`);
      continue;
    }

    const yeni = await yeniKanitSozu;
    kanitlar.push(...yeni);

    console.log(`\ndanışman: ${cevap.trim()}\n`);
    if (yeni.length) {
      console.log(`  [+${yeni.length} gösterge: ${yeni.map((k) => k.mizac).join(', ')}]\n`);
    }
  }

  durumYaz();
  arayuz.close();
}

main();
