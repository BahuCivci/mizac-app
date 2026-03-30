'use client';

import Link from 'next/link';
import { useLang } from '@/lib/lang-context';
import { mizacProfiller } from '@/lib/mizac-data';

const donemler = [
  {
    tip: 'balgami' as const,
    yasAraligi: '0–3',
    donem: { tr: 'Bebeklik', en: 'Infancy' },
    aciklama: {
      tr: 'Tüm bebekler bu dönemde balgami özellikler taşır. Anne karnındaki su ortamından gelen bebek, ıslak ve yumuşaktır. Allah bu dönemi balgamilikle yaratmıştır; bebeğin sakinliği ve uysallığı bu mizacın yansımasıdır.',
      en: 'All babies carry phlegmatic traits in this period. Coming from the watery womb, the baby is moist and soft. God has created this period with phlegmatic qualities; the baby\'s calmness and docility reflect this temperament.',
    },
    ozellikler: {
      tr: ['Çok uyur, sakindir', 'Beslenmesi düzenlidir', 'Fiziksel dokunmaya ve sıcaklığa ihtiyaç duyar', 'Bağlanma dönemidir; anne-baba bağı kurulur'],
      en: ['Sleeps a lot, calm', 'Regular feeding patterns', 'Needs physical touch and warmth', 'Attachment period; parent bond is formed'],
    },
  },
  {
    tip: 'demevi' as const,
    yasAraligi: '3–12',
    donem: { tr: 'Çocukluk', en: 'Childhood' },
    aciklama: {
      tr: 'Çocukluk dönemi demevi mizaçla akar. Vücut bol kan üretir; bu dönemde üretilen kaliteli kan ömür boyu kullanılır. Oyun, arkadaşlık ve keşif bu dönemin özüdür.',
      en: 'Childhood flows with sanguine temperament. The body produces abundant blood; quality blood produced in this period lasts a lifetime. Play, friendship and exploration are the essence of this period.',
    },
    ozellikler: {
      tr: ['Enerji ve hareketlilik zirvededir', 'Arkadaşlık kurmaya başlar', 'Oyun ve eğlence ön plandadır', 'Öğrenme kapasitesi çok yüksektir'],
      en: ['Energy and movement at peak', 'Begins forming friendships', 'Play and fun come first', 'Very high learning capacity'],
    },
  },
  {
    tip: 'safravi' as const,
    yasAraligi: '12–40',
    donem: { tr: 'Gençlik', en: 'Youth' },
    aciklama: {
      tr: 'Gençlik dönemi safravî mizaçla yaşanır. Vücuttaki nem azalır, kuruma başlar. Büyüme boy olarak değil enine gerçekleşir. Liderlik, rekabet ve hedef koyma bu dönemin baskın temasıdır.',
      en: 'Youth is lived through the choleric temperament. Body moisture decreases, drying begins. Growth becomes lateral rather than in height. Leadership, competition and goal-setting are the dominant themes of this period.',
    },
    ozellikler: {
      tr: ['Kariyer ve kimlik inşası', 'Rekabet ve hırs doruktadır', 'Karar verme yeteneği gelişir', 'Aile kurma ve sorumluluk alma dönemi'],
      en: ['Career and identity building', 'Competition and ambition at peak', 'Decision-making ability develops', 'Period of family formation and taking responsibility'],
    },
  },
  {
    tip: 'sevdavi' as const,
    yasAraligi: '60+',
    donem: { tr: 'Yaşlılık', en: 'Old Age' },
    aciklama: {
      tr: 'Yaşlılık dönemi sovdavî mizaçla gelir. Yaşlandıkça herkes — hangi mizaçtan olursa olsun — sovdalaşmaya başlar. Kemikler ağrır, içe kapanıklık artar, geçmiş daha çok düşünülür. Bu dönem derinlik ve hikmete dönüşün zamanıdır.',
      en: 'Old age arrives with the melancholic temperament. As everyone ages — regardless of their temperament — they begin to become more melancholic. Bones ache, introversion increases, the past is thought about more. This period is a time of depth and return to wisdom.',
    },
    ozellikler: {
      tr: ['Derin düşünce ve hikmet dönemi', 'Geçmişe bakış ve hesap verme', 'Kemik ve eklem sorunları artar', 'Sosyal çevreye bağlılık azalır, maneviyat güçlenir'],
      en: ['Period of deep thought and wisdom', 'Reflection on the past and accountability', 'Bone and joint issues increase', 'Social ties loosen, spirituality strengthens'],
    },
  },
];

const ortaYas = {
  tr: {
    baslik: 'Orta Yaş (40–60)',
    aciklama: 'Orta yaş dönemi hem safravî hem de sovdavî özellikler taşır. Gençliğin enerjisi hâlâ hissedilir ama vücut yavaş yavaş güçten düşmeye başlar. Bu dönem denge ve tedbirin önem kazandığı geçiş zamanıdır.',
  },
  en: {
    baslik: 'Middle Age (40–60)',
    aciklama: 'Middle age carries both choleric and melancholic traits. The energy of youth is still felt but the body gradually begins to lose strength. This is a transitional period where balance and caution become important.',
  },
};

export default function YasMizaclariPage() {
  const { lang } = useLang();
  const tr = lang === 'tr';

  return (
    <main className="min-h-screen px-4 py-16" style={{ background: 'var(--background)' }}>
      <div className="max-w-3xl mx-auto">

        {/* Başlık */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">⏳</div>
          <h1 className="text-4xl font-bold mb-3" style={{ color: 'var(--earth)' }}>
            {tr ? 'Yaş Mizaçları' : 'Life Stage Temperaments'}
          </h1>
          <p className="text-lg opacity-60 max-w-xl mx-auto leading-relaxed">
            {tr
              ? 'İnsan hayatının her dönemi farklı bir mizaçla yaşanır. Bu bilgi; kendinizi, çocuklarınızı ve yaşlıları anlamlandırmanızı kolaylaştırır.'
              : 'Each period of human life is lived through a different temperament. This knowledge makes it easier to understand yourself, your children and the elderly.'}
          </p>
        </div>

        {/* Dönemler */}
        {donemler.map(({ tip, yasAraligi, donem, aciklama, ozellikler }) => {
          const profil = mizacProfiller[tip];
          return (
            <div key={tip} className="rounded-3xl p-8 mb-6"
              style={{ background: `linear-gradient(135deg, ${profil.renkAcik}, white)` }}>

              <div className="flex items-center gap-4 mb-4">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ background: profil.renk + '20', border: `2px solid ${profil.renk}40` }}
                >
                  {profil.elementSembol}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
                      style={{ background: profil.renk }}>
                      {yasAraligi} {tr ? 'yaş' : 'years'}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold" style={{ color: profil.renk }}>
                    {tr ? donem.tr : donem.en}
                  </h2>
                  <p className="text-sm opacity-50">{tr ? profil.isim : profil.isimEn} mizacı</p>
                </div>
              </div>

              <p className="text-sm leading-relaxed opacity-80 mb-5">
                {tr ? aciklama.tr : aciklama.en}
              </p>

              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {(tr ? ozellikler.tr : ozellikler.en).map((o, i) => (
                  <li key={i} className="flex gap-2 text-sm opacity-70">
                    <span style={{ color: profil.renk }}>·</span> {o}
                  </li>
                ))}
              </ul>

              <Link
                href={`/mizaclar/${tip}`}
                className="inline-block mt-5 text-xs px-4 py-2 rounded-full font-semibold text-white"
                style={{ background: profil.renk }}
              >
                {tr ? `${profil.isim} Mizacını İncele →` : `Explore ${profil.isimEn} →`}
              </Link>
            </div>
          );
        })}

        {/* Orta Yaş */}
        <div className="rounded-2xl p-6 mb-10 border-2" style={{ borderColor: 'var(--gold-light)', background: 'var(--cream)' }}>
          <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--earth)' }}>
            ⚖ {tr ? ortaYas.tr.baslik : ortaYas.en.baslik}
          </h3>
          <p className="text-sm leading-relaxed opacity-70">
            {tr ? ortaYas.tr.aciklama : ortaYas.en.aciklama}
          </p>
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-sm opacity-50 mb-4">
            {tr ? 'Hangi mizaçla doğduğunuzu öğrenin' : 'Discover which temperament you were born with'}
          </p>
          <Link
            href="/test"
            className="inline-block px-8 py-3 rounded-full font-semibold text-white transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg, var(--earth), var(--gold))' }}
          >
            ✦ {tr ? 'Mizaç Testini Başlat' : 'Start the Temperament Test'}
          </Link>
        </div>
      </div>
    </main>
  );
}
