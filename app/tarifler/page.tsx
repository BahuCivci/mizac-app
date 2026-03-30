'use client';

import Link from 'next/link';
import { useLang } from '@/lib/lang-context';
import { mizacProfiller, MizacTip } from '@/lib/mizac-data';

const mizacTarifleri: Record<MizacTip, {
  detoks: { isim: string; isimEn: string; malzemeler: string[]; hazirlanis: string; hazirlanisEn: string }[];
  cay: string; cayEn: string;
}> = {
  safravi: {
    detoks: [
      {
        isim: 'Yeşil Serinletici Smoothie',
        isimEn: 'Green Cooling Smoothie',
        malzemeler: ['1 bardak ıspanak veya marul', '1 bardak salatalık', '1 elma', '1 bardak ayran veya soğuk su', '1 çay kaşığı nane'],
        hazirlanis: 'Tüm malzemeleri blenderdan geçirin. Aç karnına veya öğlen tüketilebilir.',
        hazirlanisEn: 'Blend all ingredients together. Can be consumed on an empty stomach or at lunch.',
      },
      {
        isim: 'Avokado-Şeftali Püresi',
        isimEn: 'Avocado-Peach Purée',
        malzemeler: ['1 olgun avokado', '2 şeftali', '1 bardak soğuk su', 'Yarım limon suyu', '1 tatlı kaşığı bal'],
        hazirlanis: 'Malzemeleri blenderda iyice çekin. Soğuk servis yapın. Safravinin karaciğer ve safra kesesini destekler.',
        hazirlanisEn: 'Blend ingredients well. Serve cold. Supports the liver and gallbladder of choleric types.',
      },
      {
        isim: 'Ispanak-Marul Detoks',
        isimEn: 'Spinach-Lettuce Detox',
        malzemeler: ['2 avuç ıspanak', '1 avuç marul', '1 bardak soğuk su', '1/2 salatalık', 'Birkaç damla limon'],
        hazirlanis: 'Blenderdan geçirin, süzebilirsiniz. Sabah aç karnına veya öğlen için idealdir.',
        hazirlanisEn: 'Blend and optionally strain. Ideal on an empty stomach in the morning or at lunch.',
      },
    ],
    cay: 'Aynısafa yaprakları + yeşil çay + lavanta + funda yaprağı + mate. Güne serinlik ve huzur katar.',
    cayEn: 'Calendula leaves + green tea + lavender + heather leaf + mate. Brings coolness and calm to the day.',
  },
  demevi: {
    detoks: [
      {
        isim: 'Alıç Sirkesi Kürü',
        isimEn: 'Hawthorn Vinegar Cure',
        malzemeler: ['1 yemek kaşığı alıç sirkesi', '1 bardak ılık su', 'İsteğe göre 1 tatlı kaşığı bal'],
        hazirlanis: 'Sabah aç karnına için. 21 gün boyunca düzenli uygulanabilir. Kanı temizler, karaciğeri destekler.',
        hazirlanisEn: 'Drink on an empty stomach in the morning. Can be applied regularly for 21 days. Cleanses blood, supports liver.',
      },
      {
        isim: 'Ekşi Nar-Demirhindi Şerbeti',
        isimEn: 'Sour Pomegranate-Tamarind Sherbet',
        malzemeler: ['1 bardak ekşi nar suyu', '1 tatlı kaşığı demirhindi özü', '1 bardak soğuk su', 'İsteğe göre birkaç buz küpü'],
        hazirlanis: 'Malzemeleri karıştırın. Öğleden sonra veya akşam tüketilebilir. Kan kalitesini artırır.',
        hazirlanisEn: 'Mix all ingredients together. Can be consumed in the afternoon or evening. Improves blood quality.',
      },
      {
        isim: 'Badem Sütü',
        isimEn: 'Almond Milk',
        malzemeler: ['50 gram çiğ badem', '3 yemek kaşığı bal', '1 su bardağı soğuk su'],
        hazirlanis: 'Bademleri 1 gece suda bekletin, soyun. Soğuk su ve bal ile blenderdan geçirin, süzün. Sakinleştirici etkisi vardır, iyi uyku sağlar.',
        hazirlanisEn: 'Soak almonds overnight, peel. Blend with cold water and honey, strain. Has a calming effect, promotes good sleep.',
      },
    ],
    cay: 'Aynısafa yaprakları + yeşil çay + lavanta + funda yaprağı + mate. Demevinin enerjisini dengeler, kalp ve karaciğeri destekler.',
    cayEn: 'Calendula + green tea + lavender + heather + mate. Balances sanguine energy, supports heart and liver.',
  },
  balgami: {
    detoks: [
      {
        isim: 'Zencefil-Tarçın Isıtıcı Çorbası',
        isimEn: 'Ginger-Cinnamon Warming Soup',
        malzemeler: ['1 lt kemik suyu', '1 tatlı kaşığı taze zencefil rendesi', '1/2 tatlı kaşığı tarçın', '1/2 tatlı kaşığı karanfil', 'Tuz, karabiber'],
        hazirlanis: 'Kemik suyunu ısıtın, baharatları ekleyin. Öğlen veya akşam tüketin. Balgamı yakar, metabolizmayı hızlandırır.',
        hazirlanisEn: 'Heat bone broth, add spices. Consume at lunch or dinner. Burns phlegm, speeds up metabolism.',
      },
      {
        isim: 'Greyfurt-Kereviz Detoksu',
        isimEn: 'Grapefruit-Celery Detox',
        malzemeler: ['1 greyfurt (suyu)', '3-4 sap kereviz', '1 havuç', '1 bardak su'],
        hazirlanis: 'Malzemeleri blenderdan geçirin, süzün. Sabah aç karnına için. Balgami atıklarını temizler.',
        hazirlanisEn: 'Blend ingredients, strain. Drink on an empty stomach in the morning. Clears phlegmatic waste.',
      },
      {
        isim: 'Aspir Yağı Kürü',
        isimEn: 'Safflower Oil Cure',
        malzemeler: ['1 tatlı kaşığı aspir yağı', '1 bardak ılık su'],
        hazirlanis: 'Sabah aç karnına aspir yağını ılık suyla için. 40 gün uygulanabilir. Kilo kontrolüne ve mukus temizliğine yardımcıdır.',
        hazirlanisEn: 'Drink safflower oil with warm water on an empty stomach in the morning. Can be applied for 40 days. Aids weight control and mucus clearance.',
      },
    ],
    cay: 'Zerdeçal + zencefil + tarçın + kakule + bal + ekinezya. Balgamları ısıtır, bağışıklığı güçlendirir.',
    cayEn: 'Turmeric + ginger + cinnamon + cardamom + honey + echinacea. Warms phlegmatics, strengthens immunity.',
  },
  sevdavi: {
    detoks: [
      {
        isim: 'Zeytinyağlı İncir Kürü',
        isimEn: 'Olive Oil Fig Cure',
        malzemeler: ['7 adet kuru incir', '1 yemek kaşığı sızma zeytinyağı'],
        hazirlanis: '7 incirleri gece suda bekletin. Sabah aç karnına zeytinyağı ile tüketin. 40 gün uygulanabilir. Kemikleri, bağırsağı ve karbondioksit atımını destekler.',
        hazirlanisEn: 'Soak 7 figs overnight in water. Consume with olive oil on an empty stomach in the morning. Can be applied for 40 days. Supports bones, intestines and CO2 elimination.',
      },
      {
        isim: 'Hurma Sütü',
        isimEn: 'Date Milk',
        malzemeler: ['7-8 adet hurma (çekirdeksiz)', '1 litre süt veya su', '1 çubuk tarçın (isteğe göre)'],
        hazirlanis: 'Hurmaları birkaç saat suda bekletin. Süt veya su ile blenderdan geçirin, tülbentle süzün. İsteğe göre tarçınla tatlandırın. Enerji verir, mineral eksikliğini giderir.',
        hazirlanisEn: 'Soak dates in water for a few hours. Blend with milk or water, strain through cheesecloth. Sweeten with cinnamon if desired. Provides energy, replenishes mineral deficiencies.',
      },
      {
        isim: 'Nohut-Buğday Kürü',
        isimEn: 'Chickpea-Wheat Cure',
        malzemeler: ['1/2 bardak haşlanmış nohut', '1/2 bardak haşlanmış buğday', '1 bardak su', '1 yemek kaşığı sade yağ', 'Tarçın'],
        hazirlanis: 'Tüm malzemeleri blenderdan geçirerek sıvı kıvamına getirin. Tarçınla baharatlayın. Özellikle soğuk havalarda içilebilir. Güçlü bir sovda atıcı tariftir.',
        hazirlanisEn: 'Blend all ingredients to a liquid consistency. Season with cinnamon. Especially good in cold weather. A powerful black-bile-clearing recipe.',
      },
    ],
    cay: 'Zerdeçal + zencefil + tarçın + kakule + bal + ekinezya. Sovdaviyi ısıtır, depresyon ve kaygıya karşı koruyucudur.',
    cayEn: 'Turmeric + ginger + cinnamon + cardamom + honey + echinacea. Warms melancholics, protective against depression and anxiety.',
  },
};

const genelTarifler = [
  {
    baslik: { tr: 'Stres Karşıtı Detoks', en: 'Anti-Stress Detox' },
    aciklama: { tr: 'Her mizaç için uygun', en: 'Suitable for all temperaments' },
    malzemeler: ['1 bardak yeşillik', '2 bardak ananas', '1 bardak şeftali', '1 muz', '1 bardak su'],
    hazirlanis: { tr: 'Malzemeleri blenderdan geçirin. Salata veya smoothie olarak tüketilebilir.', en: 'Blend all ingredients. Can be consumed as a salad or smoothie.' },
  },
  {
    baslik: { tr: 'Bağırsak Güçlendirici', en: 'Gut Strengthener' },
    aciklama: { tr: 'Her mizaç için uygun', en: 'Suitable for all temperaments' },
    malzemeler: ['1 bardak yeşillik', 'Yarım bardak taze yeşil çay', '1 muz', '1 havuç', '1 bardak kavun'],
    hazirlanis: { tr: 'Malzemeleri blenderdan geçirin. Sabah aç karnına tüketin.', en: 'Blend all ingredients. Consume on an empty stomach in the morning.' },
  },
  {
    baslik: { tr: 'Kemik ve Eklem Desteği', en: 'Bone & Joint Support' },
    aciklama: { tr: 'Özellikle sovdaviler için', en: 'Especially for melancholics' },
    malzemeler: ['1 bardak badem sütü', '2 muz', '2 yemek kaşığı kakao tozu', '2 yemek kaşığı keten tohumu', '1 bardak yeşillik'],
    hazirlanis: { tr: 'Blenderdan geçirin. Kemikleri ve eklemleri destekler.', en: 'Blend together. Supports bones and joints.' },
  },
  {
    baslik: { tr: 'Karaciğer Temizleme', en: 'Liver Cleanse' },
    aciklama: { tr: 'Özellikle safraviler ve demeviler için', en: 'Especially for cholerics and sanguines' },
    malzemeler: ['16 dal maydanoz', '1 fincan zeytinyağı', '1 limon suyu', '2 diş sarımsak', '1 bardak su'],
    hazirlanis: { tr: 'Tüm malzemeleri blenderdan geçirin. İftarda veya akşam aç karnına için. 2 saat önce ve sonra bir şey yenilip içilmez.', en: 'Blend all ingredients. Consume at iftar or on an empty stomach in the evening. Nothing should be eaten or drunk 2 hours before or after.' },
  },
];

export default function TariflerPage() {
  const { lang } = useLang();
  const tr = lang === 'tr';

  return (
    <main className="min-h-screen px-4 py-16" style={{ background: 'var(--background)' }}>
      <div className="max-w-3xl mx-auto">

        {/* Başlık */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">🍃</div>
          <h1 className="text-4xl font-bold mb-3" style={{ color: 'var(--earth)' }}>
            {tr ? 'Mizaca Özel Tarifler' : 'Temperament-Specific Recipes'}
          </h1>
          <p className="text-lg opacity-60 max-w-xl mx-auto leading-relaxed">
            {tr
              ? 'Her mizacın ihtiyacı farklıdır. Aşağıdaki tarifler "Varlığın Tahlili" kitabından derlenerek mizacınıza özel hazırlanmıştır.'
              : 'Every temperament has different needs. The recipes below are compiled from the book "Varlığın Tahlili" and prepared specifically for your temperament.'}
          </p>
        </div>

        {/* Mizaca özel tarifler */}
        {(Object.keys(mizacTarifleri) as MizacTip[]).map((tip) => {
          const profil = mizacProfiller[tip];
          const verisi = mizacTarifleri[tip];
          return (
            <div key={tip} className="mb-12">
              {/* Bölüm başlığı */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-4xl">{profil.elementSembol}</span>
                <div>
                  <h2 className="text-2xl font-bold" style={{ color: profil.renk }}>
                    {tr ? profil.isim : profil.isimEn}
                  </h2>
                  <p className="text-sm opacity-50">{tr ? profil.element : profil.elementEn} · {profil.sicaklik} & {profil.nem}</p>
                </div>
              </div>

              {/* Detoks tarifleri */}
              <div className="space-y-4 mb-5">
                {verisi.detoks.map((tarif, i) => (
                  <div key={i} className="rounded-2xl p-5" style={{ background: profil.renkAcik }}>
                    <h3 className="font-bold mb-3" style={{ color: profil.renk }}>
                      {tr ? tarif.isim : tarif.isimEn}
                    </h3>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {tarif.malzemeler.map((m) => (
                        <span key={m} className="text-xs px-2 py-1 rounded-full bg-white border font-medium"
                          style={{ borderColor: profil.renk + '30', color: 'var(--foreground)' }}>
                          {m}
                        </span>
                      ))}
                    </div>
                    <p className="text-sm leading-relaxed opacity-75">
                      {tr ? tarif.hazirlanis : tarif.hazirlanisEn}
                    </p>
                  </div>
                ))}
              </div>

              {/* Çay tarifi */}
              <div className="rounded-xl p-4 border" style={{ borderColor: profil.renk + '40', background: 'white' }}>
                <p className="text-sm font-semibold mb-1" style={{ color: profil.renk }}>
                  🫖 {tr ? 'Günlük Çay Karışımı' : 'Daily Tea Blend'}
                </p>
                <p className="text-sm opacity-70">{tr ? verisi.cay : verisi.cayEn}</p>
              </div>
            </div>
          );
        })}

        {/* Genel tarifler */}
        <div className="rounded-3xl p-8 mb-8" style={{ background: 'var(--cream)' }}>
          <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--earth)' }}>
            {tr ? '✦ Tüm Mizaçlar İçin' : '✦ For All Temperaments'}
          </h2>
          <div className="space-y-6">
            {genelTarifler.map((tarif, i) => (
              <div key={i} className="rounded-xl p-5 bg-white">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h3 className="font-bold" style={{ color: 'var(--earth)' }}>
                    {tr ? tarif.baslik.tr : tarif.baslik.en}
                  </h3>
                  <span className="text-xs px-2 py-1 rounded-full flex-shrink-0"
                    style={{ background: 'var(--gold-light)', color: 'var(--earth)' }}>
                    {tr ? tarif.aciklama.tr : tarif.aciklama.en}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {tarif.malzemeler.map((m) => (
                    <span key={m} className="text-xs px-2 py-1 rounded-full border"
                      style={{ borderColor: 'var(--gold-light)' }}>
                      {m}
                    </span>
                  ))}
                </div>
                <p className="text-sm opacity-70">{tr ? tarif.hazirlanis.tr : tarif.hazirlanis.en}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Kaynak */}
        <div className="rounded-xl p-4 text-center border mb-8" style={{ borderColor: 'var(--gold-light)', background: 'var(--cream)' }}>
          <p className="text-xs opacity-50">
            📖 {tr
              ? 'Bu tarifler Zeynep Işık Büyükbay\'ın "Varlığın Tahlili" kitabından alınmıştır.'
              : 'These recipes are taken from "Varlığın Tahlili" by Zeynep Işık Büyükbay.'}
          </p>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link href="/test"
            className="inline-block px-8 py-3 rounded-full font-semibold text-white transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg, var(--earth), var(--gold))' }}>
            ✦ {tr ? 'Mizaç Testini Başlat' : 'Start the Temperament Test'}
          </Link>
        </div>
      </div>
    </main>
  );
}
