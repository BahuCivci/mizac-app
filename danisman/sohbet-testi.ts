/**
 * Uçtan uca sohbet testi — danışman gerçekten mizacı buluyor mu?
 *
 *   MIZAC_OLLAMA=http://localhost:11500 node --import ./icerik/kayit.mjs danisman/sohbet-testi.ts
 *   ... danisman/sohbet-testi.ts balgami      (tek profil koşmak için)
 *
 * Senaryolar sitedeki 60 soruluk testin göstergelerinden türetilmiş, ama
 * şıkların diliyle değil insanların konuştuğu dille yazılmıştır. Ölçüt, planın
 * doğrulama maddesi: aynı kişi profili danışmanda ve testte AYNI mizacı vermeli.
 *
 * Balgamî senaryosu özellikle önemli: ölçümde modelin balgamî'yi sevdavî
 * sanması sistematikti (bkz. olcum-sonuclari.md), yani sohbet uzadıkça
 * sönmüyor. Bu test onun tutup tutmadığını gösterir.
 */
import { saglayiciSec, type Mesaj } from './model';
import { danismanPromptu, uslupHatirlatmasi } from './persona';
import { kanitCikar, puanla, yonerge, type Kanit } from './kanit';
import { mizacProfiller, type MizacTip } from '@/lib/mizac-data';

const SENARYOLAR: Record<MizacTip, string[]> = {
  balgami: [
    'Sabahları bir türlü kalkamıyorum, beş tane alarm kuruyorum dördünü uykumda kapatıyorum.',
    'Kalktıktan sonra da yarım saat kendime gelemiyorum, o saatte kimse benimle konuşmasın.',
    'Ben suya baksam kilo alıyorum, özellikle göbek bölgem. Akşamları tatlı krizim tutuyor, dayanamıyorum.',
    'Elim ayağım sürekli buz gibi. Yazın klimalı ofiste hırka giyiyorum, herkes dalga geçiyor.',
    'İşler sarpa sardığında ortadan kayboluyorum. Eve gelip yatıyorum, bazen ağlıyorum, uyanınca hafifliyorum.',
    'Haklı olduğum tartışmalarda bile geri adım atıyorum, o gerginlik günlerce içimde kalıyor.',
    'On beş yıldır aynı marketten alışveriş yapıyorum, market kapanınca haftalarca huzursuz oldum.',
    'Terleme konusunda sorarsan, terlerim ve terim soğuk olur. Cildim de yağlı sayılır, kuru değil.',
  ],
  safravi: [
    'Trafikte bağırdım ama adam gözden kaybolmadan ben unutmuştum bile.',
    'Alarm kurmuyorum yıllardır, altıya çeyrek kala gözüm açılıyor ve dinç kalkıyorum.',
    'Temmuz benim için kâbus, klima olmayan yerde duramıyorum.',
    'Sporda yanımdaki sırılsıklam olurken benim sadece saç diplerim nemleniyor.',
    'Dolabı taşımak gerekti, eşim birini çağıralım dedi, ben çağırana kadar taşımıştım.',
    'Ekipte iş dağıtırım ama sonunda çoğunu kendim yaparım, başkası yapınca içim rahat etmiyor.',
    'Kilo almakta zorlanırım, ne yesem üstümde kalmıyor.',
    'Randevuya geç kalan biri varsa o gün benim için bitmiştir.',
  ],
  demevi: [
    'Dün markette kuyrukta bir teyzeyle tanıştım, çıkarken numara alışverişi yaptık.',
    'Biraz yürüsem sırtım sırılsıklam oluyor, ortam ısınınca yüzüm hemen kızarıyor.',
    'Sofrada kalabalık yoksa iştahım kapanıyor, kalabalıksa doyduğumu fark etmeden yiyorum.',
    'Uykumu alamadığım gün kimse bana yaklaşmasın, sekiz saatten aşağısı beni bitiriyor.',
    'Bir şey almaya giriyorum üç poşetle çıkıyorum, sonra bunu niye aldım diyorum.',
    'Tartışma büyüyünce araya bir şaka sıkıştırırım, gerginliğe dayanamıyorum.',
    'Aynı anda dört işe başlıyorum, hepsi yarım kalıyor.',
    'Cildim nemli ve yumuşaktır, kuruluk sorunu yaşamam.',
  ],
  sevdavi: [
    'Dokuz yıl önce bir arkadaşımın söylediği lafı hâlâ kelimesi kelimesine hatırlıyorum.',
    'O gün bir şey demedim ama bir daha da eskisi gibi olamadım onunla.',
    'Neredeyse hiç terlemiyorum. Cildim sürekli kuru, kışın çatlıyor.',
    'Projeye başlamak için doğru anı bekliyorum, hazır hissetmeden başlayamıyorum.',
    'Bacaklarımda sürekli ağrı var, tahlillerde bir şey çıkmıyor. Uyandığımda bile yorgunum.',
    'Bana ne anlatırsan anlat, elimle tutup gözümle görmeden ikna olmam.',
    'Ekiple çalışmak yoruyor, kendi başıma daha iyi iş çıkarıyorum.',
    'Uykum hafiftir ve sık bölünür, uzun uyuyamam.',
  ],
};

async function senaryoKos(hedef: MizacTip) {
  const saglayici = saglayiciSec();
  const kanitlar: Kanit[] = [];
  const gecmis: Mesaj[] = [
    { rol: 'sistem', metin: danismanPromptu() },
    { rol: 'danisman', metin: 'Merhaba. Nasıl gidiyor, seni bugünlerde en çok ne yoruyor?' },
  ];

  let nemYoklandi = false;
  let ilkDogruTur: number | null = null;

  console.log(`\n${'='.repeat(64)}\n${hedef.toUpperCase()} senaryosu\n${'='.repeat(64)}`);

  for (const [i, soz] of SENARYOLAR[hedef].entries()) {
    gecmis.push({ rol: 'kullanici', metin: soz });
    console.log(`\nsen: ${soz}`);

    const yeniSozu = kanitCikar(
      saglayici,
      soz,
      gecmis.slice(-6).filter((m) => m.rol !== 'sistem').map((m) => `${m.rol}: ${m.metin}`)
    );

    const not = yonerge(kanitlar);
    if (not?.includes('nem ekseninde')) nemYoklandi = true;

    const cevap = (
      await saglayici.sor(
        [
          ...gecmis,
          { rol: 'sistem' as const, metin: uslupHatirlatmasi() },
          ...(not ? [{ rol: 'sistem' as const, metin: not }] : []),
        ],
        { sicaklik: 0.7, enFazlaJeton: 300 }
      )
    ).trim();

    gecmis.push({ rol: 'danisman', metin: cevap });
    kanitlar.push(...(await yeniSozu));

    const d = puanla(kanitlar);
    if (d.kazanan === hedef && ilkDogruTur === null && kanitlar.length >= 3) ilkDogruTur = i + 1;

    console.log(`danışman: ${cevap}`);
    console.log(
      `   [${kanitlar.length} gösterge · saf ${d.puanlar.safravi} dem ${d.puanlar.demevi} ` +
        `bal ${d.puanlar.balgami} sev ${d.puanlar.sevdavi} → ${d.kazanan} %${Math.round(d.guven * 100)}]`
    );
  }

  const son = puanla(kanitlar);
  const dogru = son.kazanan === hedef;
  console.log(
    `\n>>> ${dogru ? 'DOĞRU' : 'YANLIŞ'}: ${mizacProfiller[son.kazanan].isim} ` +
      `(beklenen ${mizacProfiller[hedef].isim}), güven %${Math.round(son.guven * 100)}, ` +
      `${kanitlar.length} gösterge, ilk doğru tur: ${ilkDogruTur ?? '—'}` +
      `${nemYoklandi ? ', nem yoklaması tetiklendi' : ''}`
  );

  // Yanlışsa nerede kaydığını görmek gerekir.
  if (!dogru) {
    const yanlislar = kanitlar.filter((k) => k.mizac !== hedef);
    console.log(`    hedef dışı ${yanlislar.length} gösterge:`);
    for (const k of yanlislar) console.log(`      ${k.mizac} ${k.guc}  ${k.gosterge}`);
  }

  return { hedef, kazanan: son.kazanan, dogru, kanit: kanitlar.length, guven: son.guven };
}

async function main() {
  const istenen = process.argv[2] as MizacTip | undefined;
  const hedefler: MizacTip[] = istenen
    ? [istenen]
    : ['balgami', 'safravi', 'demevi', 'sevdavi'];

  const sonuclar = [];
  for (const h of hedefler) sonuclar.push(await senaryoKos(h));

  console.log(`\n${'='.repeat(64)}\nÖZET`);
  for (const s of sonuclar) {
    console.log(
      `  ${s.dogru ? '✓' : '✗'} ${s.hedef.padEnd(8)} → ${s.kazanan.padEnd(8)} ` +
        `(%${Math.round(s.guven * 100)}, ${s.kanit} gösterge)`
    );
  }
  const dogruSayisi = sonuclar.filter((s) => s.dogru).length;
  console.log(`  ${dogruSayisi}/${sonuclar.length} doğru`);
  process.exit(dogruSayisi === sonuclar.length ? 0 : 1);
}

main().catch((e) => {
  console.error('HATA:', e.message);
  process.exit(2);
});
