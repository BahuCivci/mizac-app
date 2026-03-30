'use client';

import Link from 'next/link';
import { useLang } from '@/lib/lang-context';

const yollar = [
  {
    icon: '🏠',
    tr: { baslik: 'Aile Terbiyesi', aciklama: 'Helal rızık ve sağlıklı aile ilişkileri nur mizacının temelidir. Aile içindeki huzur, kişinin mizacını dengeler.' },
    en: { baslik: 'Family Upbringing', aciklama: 'Lawful provision and healthy family relationships are the foundation of nur temperament. Peace within the family balances one\'s temperament.' },
  },
  {
    icon: '📚',
    tr: { baslik: 'Eğitim ve İlim', aciklama: 'Bilmediklerini öğrenmeye açık olmak; bilgi ile ameli bir arada yürütmek. Gerçek ilim, davranışı dönüştürür.' },
    en: { baslik: 'Education & Knowledge', aciklama: 'Being open to learning what you don\'t know; keeping knowledge and action together. True knowledge transforms behavior.' },
  },
  {
    icon: '👁️',
    tr: { baslik: 'Farkındalık', aciklama: 'Kim olduğunun, ne yapacağının ve neyi amaçladığının farkında olmak. Öz farkındalık mizaç terbiyesinin başlangıç noktasıdır.' },
    en: { baslik: 'Awareness', aciklama: 'Being aware of who you are, what you do, and what you aim for. Self-awareness is the starting point of temperament discipline.' },
  },
  {
    icon: '🌙',
    tr: { baslik: 'İnanç ve İman', aciklama: 'Gerçek iman farkındalık kapılarını açar. Zorluklar karşısında şikâyeti bırakmak, sabır ve şükür ile karşılamak.' },
    en: { baslik: 'Faith & Belief', aciklama: 'True faith opens the doors of awareness. Leaving complaints behind in the face of hardship, meeting them with patience and gratitude.' },
  },
  {
    icon: '⚖️',
    tr: { baslik: 'Ahlak', aciklama: 'İslami ahlak çerçevesinde yaşamak. Dürüstlük, adalet, merhamet ve vakar her mizacın zirveye taşıyıcısıdır.' },
    en: { baslik: 'Ethics & Morality', aciklama: 'Living within the framework of Islamic ethics. Honesty, justice, compassion and dignity carry every temperament to its peak.' },
  },
  {
    icon: '🤝',
    tr: { baslik: 'Saygı ve Sevgi', aciklama: 'İnsana olan saygı, Allah\'a olan saygının yansımasıdır. Sevgi ve saygı dengesi nur mizacının dışa vuran yüzüdür.' },
    en: { baslik: 'Respect & Love', aciklama: 'Respect for people is a reflection of respect for God. The balance of love and respect is the outward face of nur temperament.' },
  },
  {
    icon: '🌱',
    tr: { baslik: 'Mizaç Terbiyesi', aciklama: 'Çaba, sabır ve irade ile sivri yanları törpülemek. Mizaç değişmez ama yönetilebilir; bu çaba ömür boyu sürer.' },
    en: { baslik: 'Temperament Discipline', aciklama: 'Filing down sharp edges through effort, patience and will. Temperament doesn\'t change but can be managed; this effort lasts a lifetime.' },
  },
  {
    icon: '🎭',
    tr: { baslik: 'Görgü', aciklama: 'Duruma, ortama ve şartlara göre davranabilmek. Hangi mizaçta olursa olsun, zamanı ve mekânı okuyabilen kişi nur mizacına yaklaşır.' },
    en: { baslik: 'Etiquette & Conduct', aciklama: 'Being able to behave according to the situation, environment and conditions. Regardless of temperament, one who can read time and place approaches nur temperament.' },
  },
];

export default function NurMizaciPage() {
  const { lang } = useLang();
  const tr = lang === 'tr';

  return (
    <main className="min-h-screen px-4 py-12" style={{ background: 'var(--background)' }}>
      <div className="max-w-2xl mx-auto">

        {/* Hero */}
        <div className="text-center mb-12">
          <div
            className="inline-flex items-center justify-center w-20 h-20 rounded-full text-4xl mb-5"
            style={{ background: 'linear-gradient(135deg, var(--gold-light), white)', border: '2px solid var(--gold)' }}
          >
            ✦
          </div>
          <h1 className="text-4xl font-bold mb-3" style={{ color: 'var(--foreground)' }}>
            {tr ? 'Nur Mizacı' : 'Nur Temperament'}
          </h1>
          <p className="text-lg opacity-60 mb-4">
            {tr ? 'Denge ve Olgunluğun Hali' : 'The State of Balance and Maturity'}
          </p>
          <div
            className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold"
            style={{ background: 'var(--gold-light)', color: 'var(--earth)' }}
          >
            {tr ? 'Hedef Mizaç · Ulaşılması Gereken' : 'Target Temperament · The Goal to Reach'}
          </div>
        </div>

        {/* Tanım */}
        <div className="rounded-2xl p-6 mb-6" style={{ background: 'var(--cream)' }}>
          <p className="leading-relaxed opacity-80 text-sm mb-4">
            {tr
              ? 'Nur Mizacı, dört mizacın (Safravî, Demevî, Balgamî, Sevdavî) ötesinde bir denge ve olgunluk halidir. Kitabın yazarı Zeynep Işık Büyükbay\'ın tanımıyla: "Etik, ahlaki, dengeli ve evrensel olan"dır.'
              : 'Nur Temperament is a state of balance and maturity beyond the four temperaments (Choleric, Sanguine, Phlegmatic, Melancholic). As defined by author Zeynep Işık Büyükbay: "That which is ethical, moral, balanced and universal."'}
          </p>
          <p className="leading-relaxed opacity-80 text-sm">
            {tr
              ? 'Tüm mizaçlar nur mizacına yaklaşabilir. Ancak "Ben nur mizacına geçtim" denilemez; bu bir varış noktası değil, sürekli devam eden bir yolculuktur.'
              : 'All temperaments can approach nur temperament. However, one cannot say "I have reached nur temperament"; this is not a destination but a continuously ongoing journey.'}
          </p>
        </div>

        {/* Hz. Peygamber */}
        <div
          className="rounded-2xl p-6 mb-6 text-center"
          style={{ background: 'linear-gradient(135deg, var(--gold-light), var(--cream))', border: '1px solid var(--gold)' }}
        >
          <div className="text-3xl mb-3">🌟</div>
          <h2 className="font-bold text-lg mb-2" style={{ color: 'var(--earth)' }}>
            {tr ? 'En Yüksek Örnek' : 'The Highest Example'}
          </h2>
          <p className="text-sm leading-relaxed opacity-80">
            {tr
              ? 'Hz. Muhammed (s.a.v.), demevî mizaca en yakın olmasına rağmen nur mizacını en çok temsil eden insandır. Onun ahlakı, bütün mizaçların zirve halini gösterir: Hem Safravî\'nin adaleti, hem Demevî\'nin sevgisi, hem Balgamî\'nin sabrı, hem Sevdavî\'nin derinliği.'
              : 'Prophet Muhammad (p.b.u.h.), while closest to the sanguine temperament, is the person who best represents nur temperament. His character shows the peak of all temperaments: the justice of Choleric, the love of Sanguine, the patience of Phlegmatic, and the depth of Melancholic.'}
          </p>
        </div>

        {/* 4 Mizaçla Farkı */}
        <div className="rounded-2xl p-6 mb-6" style={{ background: 'var(--cream)' }}>
          <h2 className="font-bold text-lg mb-4" style={{ color: 'var(--earth)' }}>
            {tr ? '4 Mizaçtan Farkı Nedir?' : 'How Does It Differ from the 4 Temperaments?'}
          </h2>
          <div className="space-y-3">
            {[
              {
                sembol: '🔥',
                mizac: tr ? 'Safravî' : 'Choleric',
                sorun: tr ? 'Öfke ve aceleciliğe düşer' : 'Falls into anger and impulsiveness',
                nur: tr ? 'Adaleti öfke olmadan gösterir' : 'Shows justice without anger',
              },
              {
                sembol: '💨',
                mizac: tr ? 'Demevî' : 'Sanguine',
                sorun: tr ? 'Dağınıklık ve övgüye muhtaçlığa düşer' : 'Falls into scatter and need for praise',
                nur: tr ? 'Sevgiyi karşılık beklemeden verir' : 'Gives love without expecting return',
              },
              {
                sembol: '💧',
                mizac: tr ? 'Balgamî' : 'Phlegmatic',
                sorun: tr ? 'Tembellik ve kararsızlığa düşer' : 'Falls into laziness and indecision',
                nur: tr ? 'Sabrı hareketsizlik olmadan kullanır' : 'Uses patience without inactivity',
              },
              {
                sembol: '🌿',
                mizac: tr ? 'Sevdavî' : 'Melancholic',
                sorun: tr ? 'Karamsarlık ve vesvese düşer' : 'Falls into pessimism and obsession',
                nur: tr ? 'Derinliği melankolisiz taşır' : 'Carries depth without melancholy',
              },
            ].map((item) => (
              <div key={item.sembol} className="flex gap-3 items-start text-sm">
                <span className="text-xl flex-shrink-0 mt-0.5">{item.sembol}</span>
                <div>
                  <span className="font-semibold">{item.mizac}: </span>
                  <span className="opacity-60">{item.sorun}</span>
                  <span className="text-green-700"> → </span>
                  <span className="text-green-700 font-medium">{item.nur}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Nur Mizacına Ulaşım Yolları */}
        <h2 className="font-bold text-xl mb-4" style={{ color: 'var(--foreground)' }}>
          {tr ? 'Nur Mizacına Erişim Yolları' : 'Pathways to Nur Temperament'}
        </h2>
        <div className="space-y-3 mb-10">
          {yollar.map((yol) => (
            <div key={yol.icon} className="rounded-2xl p-5 flex gap-4" style={{ background: 'var(--cream)' }}>
              <div className="text-2xl flex-shrink-0">{yol.icon}</div>
              <div>
                <h3 className="font-bold mb-1" style={{ color: 'var(--earth)' }}>
                  {tr ? yol.tr.baslik : yol.en.baslik}
                </h3>
                <p className="text-sm leading-relaxed opacity-75">
                  {tr ? yol.tr.aciklama : yol.en.aciklama}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="opacity-50 text-sm mb-4">
            {tr ? 'Önce mizacınızı öğrenin, sonra yolculuğa başlayın.' : 'First learn your temperament, then begin the journey.'}
          </p>
          <Link
            href="/test"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-white font-semibold text-lg transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg, var(--earth), var(--gold))' }}
          >
            ✦ {tr ? 'Mizaç Testini Başlat' : 'Start the Temperament Test'}
          </Link>
        </div>
      </div>
    </main>
  );
}
