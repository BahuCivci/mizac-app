'use client';

import Link from 'next/link';
import { mizacProfiller } from '@/lib/mizac-data';
import { useLang } from '@/lib/lang-context';

export default function MizaclarPage() {
  const profiller = Object.values(mizacProfiller);
  const { lang } = useLang();
  const tr = lang === 'tr';

  return (
    <main className="min-h-screen px-4 py-16" style={{ background: 'var(--background)' }}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="text-4xl mb-4" style={{ color: 'var(--gold)' }}>✦</div>
          <h1 className="text-4xl font-bold mb-3" style={{ color: 'var(--foreground)' }}>
            {tr ? '4 Mizaç Tipi' : 'The Four Temperament Types'}
          </h1>
          <p className="opacity-60">
            {tr ? 'İbn-i Sina Geleneği · 4 Element' : 'Based on Ibn Sina\'s Ancient Tradition'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {profiller.map((profil) => (
            <Link
              key={profil.id}
              href={`/mizaclar/${profil.id}`}
              className="group rounded-3xl p-8 border-2 transition-all hover:scale-[1.02] hover:shadow-xl"
              style={{
                background: profil.renkAcik,
                borderColor: profil.renk + '30',
              }}
            >
              <div className="flex items-start gap-4">
                <div className="text-5xl">{profil.elementSembol}</div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold" style={{ color: profil.renk }}>
                    {tr ? profil.isim : profil.isimEn}
                  </h2>
                  <p className="text-sm opacity-50 mb-3">
                    {tr ? profil.isimEn : profil.isim} · {tr ? profil.element : profil.elementEn}
                  </p>
                  <p className="text-sm leading-relaxed opacity-80 mb-4">
                    {(tr ? profil.uzunAciklama : profil.uzunAciklamaEn).slice(0, 120)}...
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {(tr ? profil.anahtarKelimeler : profil.anahtarKelimelerEn).map((k) => (
                      <span key={k} className="text-xs px-2 py-0.5 rounded-full text-white"
                        style={{ background: profil.renk }}>
                        {k}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/test"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-white font-semibold text-lg transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg, var(--earth), var(--gold))' }}
          >
            ✦ {tr ? 'Mizacını Keşfet' : 'Discover Your Temperament'}
          </Link>
        </div>
      </div>
    </main>
  );
}
