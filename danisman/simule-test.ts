/**
 * Simüle kullanıcıyla çok turlu değerlendirme.
 *
 *   MIZAC_OLLAMA=http://localhost:11500 node --import ./icerik/kayit.mjs \
 *     danisman/simule-test.ts balgami
 *
 * `sohbet-testi.ts` sabit senaryo okur: "kullanıcı" danışmanın sorduğuna cevap
 * vermez, hep sıradaki cümleyi söyler. Bu, mizaç doğruluğunu ölçmek için
 * yeterli ama sohbetin kendisini ölçmez — bağlam kayması, söyleneni unutma ve
 * sorgu hissi ancak karşı taraf gerçekten tepki verince ortaya çıkar. Sektör
 * pratiği de bu: personayı LLM canlandırır, ikinci bir LLM hakemlik eder.
 *
 * UYARI — bu ölçümün bilinen zayıflığı: kullanıcı, danışman ve hakem aynı
 * model. Modelin körlükleri üçünde de aynı olduğu için hakem puanları mutlak
 * doğru sayılamaz; sürümler arası kıyas için anlamlıdır, mutlak kalite belgesi
 * değildir.
 */
import { saglayiciSec, type Mesaj } from './model';
import { danismanPromptu, uslupHatirlatmasi } from './persona';
import { kanitCikar, puanla, yonerge, benzersizKanitlar, type Kanit } from './kanit';
import { cevabiBicimlendir } from './bicim';
import { stratejiSec, stratejiNotu } from './strateji';
import { krizTespit } from './kriz';
import { mizacProfiller, type MizacTip } from '@/lib/mizac-data';

const TUR_SAYISI = 8;

/** Simüle kullanıcının kimliği. Mizaç adı verilir — o rolü oynayacak. */
function kullaniciPromptu(tip: MizacTip): string {
  const p = mizacProfiller[tip];
  return [
    `Sen bir insansın ve bir mizaç danışmanıyla konuşuyorsun. Karakterin:`,
    `  beden: ${p.fiziksel.slice(0, 5).join('; ')}`,
    `  huy: ${p.anahtarKelimeler.join(', ')}`,
    `  zorlandığın: ${p.zayifYonler.slice(0, 3).join('; ')}`,
    `  sağlık eğilimin: ${p.saglikEgilimleri.slice(0, 3).join('; ')}`,
    '',
    'KURALLAR',
    '- Danışmanın sana SORDUĞU şeye cevap ver. Soru sormadıysa sohbeti sürdür.',
    '- Kısa konuş: 1-2 cümle. Günlük Türkçe, sohbet dili.',
    '- Her şeyi bir anda anlatma; sorulmayanı kendiliğinden dökme.',
    '- Mizaç adı KULLANMA ("balgamîyim" deme). Sen terimleri bilmiyorsun.',
    '- Kendi karakterine sadık kal, danışman ne derse desin.',
    '- Bazen konuyu dağıt, bazen kısa kes — insanlar hep düzgün cevap vermez.',
  ].join('\n');
}

const HAKEM_PROMPTU = `
Bir mizaç danışmanıyla bir kişinin sohbetini değerlendiriyorsun.
Danışmanın işi: soru listesi okumadan, konuşarak kişiyi anlamak.

Her ölçütü 1-5 arası puanla (5 en iyi):
- rol_tutarliligi: Danışman baştan sona aynı kişi mi kaldı? Ders anlatmaya,
  doktorculuk oynamaya ya da kimlik değiştirmeye kaydı mı?
- baglam_hatirlama: Kişinin daha önce söylediklerini hatırladı mı, yoksa
  aynı şeyi tekrar mı sordu?
- sorgu_hissi: Sohbet mi yoksa sorgu mu? (5 = sohbet, 1 = arka arkaya soru)
- dogallik: Türkçesi doğal mı, insan gibi mi konuşuyor?
- tekrar: Kendini tekrar etti mi? (5 = etmedi)

SADECE şu biçimde JSON döndür:
{"rol_tutarliligi":4,"baglam_hatirlama":3,"sorgu_hissi":5,"dogallik":4,"tekrar":5,"not":"tek cümle gerekçe"}`;

async function main() {
  const hedef = (process.argv[2] as MizacTip) ?? 'balgami';
  if (!mizacProfiller[hedef]) {
    console.error('kullanım: simule-test.ts <safravi|demevi|balgami|sevdavi>');
    process.exit(1);
  }

  const saglayici = saglayiciSec();
  const kanitlar: Kanit[] = [];
  const danismanGecmisi: Mesaj[] = [{ rol: 'sistem', metin: danismanPromptu() }];
  const kullaniciGecmisi: Mesaj[] = [{ rol: 'sistem', metin: kullaniciPromptu(hedef) }];
  const dokum: string[] = [];

  let danismanSozu =
    'Merhaba. Nasıl gidiyor, seni bugünlerde en çok ne yoruyor?';
  danismanGecmisi.push({ rol: 'danisman', metin: danismanSozu });
  kullaniciGecmisi.push({ rol: 'kullanici', metin: danismanSozu });
  console.log(`\n${'='.repeat(64)}\n${hedef.toUpperCase()} — simüle kullanıcı\n${'='.repeat(64)}`);
  console.log(`\ndanışman: ${danismanSozu}`);

  for (let tur = 1; tur <= TUR_SAYISI; tur++) {
    // 1) Kullanıcı, danışmanın son sözüne cevap verir.
    const kullaniciSozu = (
      await saglayici.sor(kullaniciGecmisi, { sicaklik: 0.9, enFazlaJeton: 120 })
    ).trim();
    console.log(`\nsen: ${kullaniciSozu}`);
    dokum.push(`kişi: ${kullaniciSozu}`);
    danismanGecmisi.push({ rol: 'kullanici', metin: kullaniciSozu });
    kullaniciGecmisi.push({ rol: 'danisman', metin: kullaniciSozu });

    if (krizTespit(kullaniciSozu)) {
      console.log('  [kriz yakalandı — sohbet burada kesilir]');
      break;
    }

    // 2) Danışman cevaplar.
    const yeniSozu = kanitCikar(saglayici, kullaniciSozu, dokum.slice(-6));
    const oncekiDurum = kanitlar.length ? puanla(kanitlar) : null;
    const kanaatVar = !!oncekiDurum && oncekiDurum.guven > 0.35 && kanitlar.length >= 6;
    const strateji = stratejiSec({
      kanitlar, durum: oncekiDurum, tur, sonSoz: kullaniciSozu, kanaatVar,
    });
    const not = yonerge(kanitlar);

    danismanSozu = cevabiBicimlendir(
      await saglayici.sor(
        [
          ...danismanGecmisi,
          { rol: 'sistem', metin: uslupHatirlatmasi() },
          ...(not ? [{ rol: 'sistem' as const, metin: not }] : []),
          { rol: 'sistem', metin: stratejiNotu(strateji) },
        ],
        { sicaklik: 0.7, enFazlaJeton: 300 }
      ),
      {
        mizacSoylenebilir: kanaatVar,
        kazanan: oncekiDurum?.kazanan,
        soruVar: strateji.soruVar,
        enFazlaCumle: strateji.enFazlaCumle,
      }
    );

    danismanGecmisi.push({ rol: 'danisman', metin: danismanSozu });
    kullaniciGecmisi.push({ rol: 'kullanici', metin: danismanSozu });
    dokum.push(`danışman: ${danismanSozu}`);
    kanitlar.push(...benzersizKanitlar(kanitlar, await yeniSozu));

    const d = puanla(kanitlar);
    console.log(`danışman [${strateji.ad}]: ${danismanSozu}`);
    console.log(`   [${kanitlar.length} gösterge → ${d.kazanan} %${Math.round(d.guven * 100)}]`);
  }

  const son = puanla(kanitlar);
  const dogru = son.kazanan === hedef;

  // 3) Hakem sohbetin tamamına bakar.
  let puanlar: Record<string, number | string> = {};
  try {
    const ham = await saglayici.sor(
      [
        { rol: 'sistem', metin: HAKEM_PROMPTU },
        { rol: 'kullanici', metin: dokum.join('\n') },
      ],
      { sicaklik: 0, enFazlaJeton: 300, jsonMu: true }
    );
    const bas = ham.indexOf('{');
    puanlar = JSON.parse(ham.slice(bas, ham.lastIndexOf('}') + 1));
  } catch {
    console.log('\n[hakem cevabı çözümlenemedi]');
  }

  console.log(`\n${'-'.repeat(64)}`);
  console.log(
    `mizaç: ${dogru ? 'DOĞRU' : 'YANLIŞ'} — ${son.kazanan} (beklenen ${hedef}), ` +
      `%${Math.round(son.guven * 100)}, ${kanitlar.length} gösterge`
  );
  for (const [k, v] of Object.entries(puanlar)) {
    console.log(`  ${k}: ${v}`);
  }

  process.exit(dogru ? 0 : 1);
}

main().catch((e) => {
  console.error('HATA:', e.message);
  process.exit(2);
});
