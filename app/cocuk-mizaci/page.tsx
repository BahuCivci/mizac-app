'use client';

import Link from 'next/link';
import { useLang } from '@/lib/lang-context';
import { mizacProfiller, MizacTip } from '@/lib/mizac-data';

const sirala: MizacTip[] = ['safravi', 'demevi', 'balgami', 'sevdavi'];

const uyarilar = {
  safravi: {
    tr: 'Safrasını bilmeden artırırsanız hiperaktif olur; bu hem çocuğa hem ebeveyne eziyet verir.',
    en: 'Unknowingly increasing their bile makes them hyperactive — a burden on both child and parent.',
  },
  demevi: {
    tr: 'Demini bilmeden artırırsanız yasaklara meyli olur ve merakının esiri olur.',
    en: 'Unknowingly increasing their blood makes them prone to rule-breaking and becomes a slave to curiosity.',
  },
  balgami: {
    tr: 'Balgamını bilmeden artırırsanız tembel ve içine kapanık olur; bu hayatının her döneminde önüne çıkar.',
    en: 'Unknowingly increasing their phlegm makes them lazy and withdrawn — this follows them throughout life.',
  },
  sevdavi: {
    tr: 'Sovdasını bilmeden artırırsanız yalnız, bencil ve uzak olur. Tohum gibidir; sıcaklık ve ıslaklık verirseniz içindeki hazineyi çıkarabilirsiniz.',
    en: 'Unknowingly increasing their black bile makes them lonely, selfish and distant. Like a seed — give warmth and moisture and the treasure inside will emerge.',
  },
};

export default function CocukMizaciPage() {
  const { lang } = useLang();
  const tr = lang === 'tr';

  return (
    <main className="min-h-screen px-4 py-16" style={{ background: 'var(--background)' }}>
      <div className="max-w-3xl mx-auto">

        {/* Başlık */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">🧒</div>
          <h1 className="text-4xl font-bold mb-3" style={{ color: 'var(--earth)' }}>
            {tr ? 'Çocuğunuzun Mizacı' : 'Your Child\'s Temperament'}
          </h1>
          <p className="text-lg opacity-60 max-w-xl mx-auto leading-relaxed">
            {tr
              ? 'Her çocuk belirli bir mizaçla doğar. Mizacını tanıyan ebeveyn, çocuğunu hem daha iyi anlar hem de gelişimine doğru yönde destek olur.'
              : 'Every child is born with a specific temperament. A parent who knows their child\'s temperament both understands them better and supports their development in the right direction.'}
          </p>
        </div>

        {/* Önemli Not */}
        <div className="rounded-2xl p-5 mb-10 border-l-4" style={{ background: '#fffbeb', borderColor: 'var(--gold)' }}>
          <p className="text-sm leading-relaxed opacity-80">
            <strong>{tr ? 'Önemli: ' : 'Important: '}</strong>
            {tr
              ? 'Çocuğunuzun mizacını anlamak ona etiket yapıştırmak değil; güçlü yanlarını desteklemek ve zayıf yanlarında ona rehber olmaktır.'
              : "Understanding your child's temperament is not about labeling them — it's about supporting their strengths and guiding them through their weaknesses."}
          </p>
        </div>

        {/* Mizaçlar */}
        {sirala.map((tip) => {
          const profil = mizacProfiller[tip];
          const uyari = uyarilar[tip];
          return (
            <div key={tip} className="rounded-3xl p-8 mb-8"
              style={{ background: `linear-gradient(135deg, ${profil.renkAcik}, white)` }}>

              {/* Başlık */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-5xl">{profil.elementSembol}</span>
                <div>
                  <h2 className="text-2xl font-bold" style={{ color: profil.renk }}>
                    {tr ? profil.isim : profil.isimEn}
                  </h2>
                  <p className="text-sm opacity-50">{tr ? profil.element : profil.elementEn} · {profil.sicaklik} & {profil.nem}</p>
                </div>
              </div>

              {/* Özellikler */}
              <ul className="space-y-3 mb-6">
                {(tr ? profil.cocukOzellikleri : profil.cocukOzellikleriEn).map((c, i) => (
                  <li key={i} className="flex gap-3 text-sm leading-relaxed opacity-80">
                    <span className="mt-0.5 flex-shrink-0 font-bold" style={{ color: profil.renk }}>·</span>
                    {c}
                  </li>
                ))}
              </ul>

              {/* Uyarı */}
              <div className="rounded-xl p-4 border" style={{ background: 'white', borderColor: profil.renk + '40' }}>
                <p className="text-sm leading-relaxed opacity-70">
                  <strong style={{ color: profil.renk }}>⚠ {tr ? 'Ebeveyn Uyarısı: ' : 'Parent Warning: '}</strong>
                  {tr ? uyari.tr : uyari.en}
                </p>
              </div>

              <Link
                href={`/mizaclar/${tip}`}
                className="inline-block mt-4 text-xs px-4 py-2 rounded-full font-semibold text-white"
                style={{ background: profil.renk }}
              >
                {tr ? 'Tam Profili Gör →' : 'See Full Profile →'}
              </Link>
            </div>
          );
        })}

        {/* Alt CTA */}
        <div className="text-center mt-4">
          <p className="text-sm opacity-50 mb-4">
            {tr
              ? 'Kendi mizacınızı öğrenmek ister misiniz?'
              : 'Would you like to discover your own temperament?'}
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
