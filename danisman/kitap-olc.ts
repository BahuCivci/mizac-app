/**
 * Getirim kalitesini ölçer — gömme modeline geçmeye değer mi?
 *
 *   node --import ./icerik/kayit.mjs danisman/kitap-olc.ts
 *
 * Sözcük tabanlı arama bağımlılıksız ve deterministik; gömme ise ayrı bir
 * model indirmek, yüklemek ve her istekte çağırmak demek. Hangisinin gerektiği
 * tahminle değil, bilinen sorgularla ölçülerek belirlenir: her sorgu için
 * dönen pasajda bulunması beklenen sözcükler var mı?
 */
import { kitaptaAra, pasajlariBicimle } from './kitap';

interface Deneme {
  sorgu: string;
  /** Doğru pasajda geçmesi beklenen sözcüklerden en az biri. */
  beklenen: RegExp;
}

const DENEMELER: Deneme[] = [
  { sorgu: 'balgami mizacın uyku düzeni nasıldır', beklenen: /balgam/i },
  { sorgu: 'safravi öfke', beklenen: /safrav|öfke/i },
  { sorgu: 'sevdavi kuruluk ve toprak elementi', beklenen: /sovdav|sevdav|toprak/i },
  { sorgu: 'demevi kan hıltı ve hava elementi', beklenen: /demev|kan|hava/i },
  { sorgu: 'terleme ve ter mizaç göstergesi', beklenen: /ter\b|terle/i },
  { sorgu: 'hılt nedir dört hılt', beklenen: /hılt|hilt/i },
  { sorgu: 'beslenme ve gıdaların mizaca etkisi', beklenen: /gıda|besl/i },
  { sorgu: 'mizaç nasıl belirlenir tespit', beklenen: /mizaç|mizac/i },
];

function main() {
  let gecen = 0;
  console.log('sorgu → ilk 3 pasaj (tarama sırası) · isabet\n');

  for (const d of DENEMELER) {
    const bulgular = kitaptaAra(d.sorgu, 3);
    if (!bulgular.length) {
      console.log(`✗ "${d.sorgu}" → hiç sonuç yok`);
      continue;
    }
    const isabet = bulgular.some((b) => d.beklenen.test(b.metin));
    if (isabet) gecen++;
    console.log(
      `${isabet ? '✓' : '✗'} "${d.sorgu}"`
    );
    console.log(
      `   → s.${bulgular.map((b) => `${b.sayfa}(${b.skor.toFixed(1)})`).join(', s.')}` +
        `  başlık: ${bulgular[0].baslik ?? '—'}`
    );
    if (!isabet) {
      console.log(`   ↳ ilk pasajın başı: ${bulgular[0].metin.replace(/\s+/g, ' ').slice(0, 120)}`);
    }
  }

  console.log(`\n${gecen}/${DENEMELER.length} sorgu ilgili pasajı getirdi`);

  // Prompt'a ne kadar yük bindiği de kararın parçası.
  const ornek = pasajlariBicimle(kitaptaAra('balgami uyku', 2));
  console.log(`prompt yükü (2 pasaj): ${ornek.length} karakter`);

  process.exit(gecen === DENEMELER.length ? 0 : 1);
}

main();
