'use client';

import Link from 'next/link';
import { useState } from 'react';
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

function EmailCaptureCocuk({ tr }: { tr: boolean }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, tip: 'cocuk-mizaci' }),
      });
      setStatus(res.ok ? 'success' : 'error');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-3xl p-8 text-center mb-8" style={{ background: '#1a1207' }}>
        <div className="text-4xl mb-3">📬</div>
        <p className="font-bold text-white text-lg">{tr ? 'Eklendi!' : 'Added!'}</p>
        <p className="text-sm mt-1" style={{ color: '#9a8a6a' }}>{tr ? 'Gelen kutunuzu kontrol edin.' : 'Check your inbox.'}</p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl p-8 mb-8" style={{ background: '#1a1207' }}>
      <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#c4973a' }}>
        {tr ? 'Çocuk Gelişim Rehberi' : 'Child Development Guide'}
      </p>
      <h3 className="text-xl font-bold text-white mb-2">
        {tr ? 'Çocuğunu anlayan ebeveyn.' : 'The parent who understands their child.'}
      </h3>
      <p className="text-sm mb-6" style={{ color: '#9a8a6a' }}>
        {tr
          ? 'Mizaca göre çocuk yetiştirme, beslenme ve iletişim tavsiyeleri — her Pazartesi.'
          : 'Temperament-based parenting, nutrition and communication tips — every Monday.'}
      </p>
      <form onSubmit={submit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={tr ? 'email@adresiniz.com' : 'your@email.com'}
          required
          className="flex-1 px-4 py-3 rounded-full text-sm outline-none"
          style={{ background: '#2a1f0a', border: '1px solid #c4973a40', color: '#e8d5b0' }}
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="px-6 py-3 rounded-full text-sm font-semibold text-white shrink-0 transition-all hover:opacity-90 disabled:opacity-60"
          style={{ background: '#c4973a' }}
        >
          {status === 'loading' ? '⏳' : (tr ? 'Gönder' : 'Send')}
        </button>
      </form>
      {status === 'error' && (
        <p className="text-xs text-red-400 mt-2">{tr ? 'Bir hata oluştu.' : 'An error occurred.'}</p>
      )}
    </div>
  );
}

export default function CocukMizaciPage() {
  const { lang } = useLang();
  const tr = lang === 'tr';

  return (
    <main className="min-h-screen px-4 py-16" style={{ background: 'var(--background)' }}>
      <div className="max-w-3xl mx-auto">

        {/* Hero */}
        <div className="rounded-3xl px-8 py-14 text-center mb-10" style={{ background: 'linear-gradient(180deg, #0f0a04 0%, #1a1207 100%)' }}>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] mb-6" style={{ color: '#c4973a' }}>
            {tr ? 'Çocuk Mizacı' : 'Child Temperament'}
          </p>
          <div className="text-7xl mb-6">🧒</div>
          <h1 className="text-4xl font-bold mb-4" style={{ color: '#e8d5b0' }}>
            {tr ? 'Çocuğun doğasına karşı mı gidiyorsun?' : 'Are you working against your child\'s nature?'}
          </h1>
          <p className="text-lg leading-relaxed max-w-xl mx-auto" style={{ color: '#9a8a6a' }}>
            {tr
              ? 'Her çocuk bir mizaçla doğar. Onu anlamadan verilen her "iyi niyet" ters tepebilir.'
              : 'Every child is born with a temperament. Every "good intention" given without understanding it can backfire.'}
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

        {/* Email Capture */}
        <EmailCaptureCocuk tr={tr} />

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
