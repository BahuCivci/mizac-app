/**
 * Modellerin Türkçe sohbet kalitesini yan yana koyar.
 *
 *   MIZAC_OLLAMA=http://localhost:11500 node --import ./icerik/kayit.mjs \
 *     danisman/dil-karsilastir.ts qwen2.5vl:72b aya-expanse:8b gemma3:27b
 *
 * Neden ayrı bir araç: `olc.py` sınıflandırma doğruluğunu ölçüyor, dil
 * kalitesini değil. Sohbet testinde 72B doğru mizacı buldu ama "uzlaşmaca
 * zamanı", "biravukatlık yaparak", "insensellikten yoksun" gibi var olmayan
 * sözcükler üretti. Doğruluk iyi, Türkçe bozuk — bu ikisi ayrı ölçülmeli.
 *
 * Otomatik olarak yalnız sayılabilir şeyler raporlanır (Latin dışı karakter,
 * uzunluk, soru sayısı). Akıcılık kararı okumakla verilir; araç cevapları
 * yan yana basar ki okunabilsin.
 */
import { ollama } from './model';
import { danismanPromptu } from './persona';
import { stratejiSec, stratejiNotu } from './strateji';

const SOZLER = [
  'Sabahları bir türlü kalkamıyorum, beş tane alarm kuruyorum dördünü uykumda kapatıyorum.',
  'İşler sarpa sardığında ortadan kayboluyorum. Eve gelip yatıyorum, bazen ağlıyorum.',
  'Elim ayağım sürekli buz gibi. Yazın klimalı ofiste hırka giyiyorum.',
];

/** Latin dışı karakter (Çince/Korece sızıntısı) — 72B'de görüldü. */
const LATIN_DISI = /[　-鿿가-힯]/;

async function modelDene(model: string) {
  const saglayici = ollama({ model });
  console.log(`\n${'='.repeat(64)}\n${model}\n${'='.repeat(64)}`);

  let toplamUzunluk = 0;
  let sizintiSayisi = 0;

  for (const [i, soz] of SOZLER.entries()) {
    const strateji = stratejiSec({
      kanitlar: [],
      durum: null,
      tur: i + 1,
      sonSoz: soz,
      kanaatVar: false,
    });

    let cevap: string;
    const basla = Date.now();
    try {
      // Ham cevap: `bicim.ts` sonradan temizliyor ama burada modelin kendi
      // ürettiği dile bakmak istiyoruz.
      cevap = (
        await saglayici.sor(
          [
            { rol: 'sistem', metin: danismanPromptu() },
            { rol: 'kullanici', metin: soz },
            { rol: 'sistem', metin: stratejiNotu(strateji) },
          ],
          { sicaklik: 0.7, enFazlaJeton: 300 }
        )
      ).trim();
    } catch (e) {
      console.log(`  [hata: ${(e as Error).message}]`);
      continue;
    }
    const sure = ((Date.now() - basla) / 1000).toFixed(1);

    toplamUzunluk += cevap.length;
    if (LATIN_DISI.test(cevap)) sizintiSayisi++;

    console.log(`\n[${strateji.ad}] "${soz.slice(0, 45)}..."  (${sure} sn)`);
    console.log(`  ${cevap.replace(/\n/g, '\n  ')}`);
  }

  console.log(
    `\n  → ortalama uzunluk ${Math.round(toplamUzunluk / SOZLER.length)} karakter, ` +
      `latin dışı sızıntı ${sizintiSayisi}/${SOZLER.length}`
  );
}

async function main() {
  const modeller = process.argv.slice(2);
  if (!modeller.length) {
    console.error('kullanım: dil-karsilastir.ts <model> [model...]');
    process.exit(1);
  }
  for (const m of modeller) await modelDene(m);
}

main().catch((e) => {
  console.error('HATA:', e.message);
  process.exit(2);
});
