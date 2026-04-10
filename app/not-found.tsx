'use client';

import Link from 'next/link';
import { useLang } from '@/lib/lang-context';

export default function NotFound() {
  const { lang } = useLang();
  const tr = lang === 'tr';

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-16"
      style={{ background: 'var(--background)' }}>
      <div className="max-w-lg w-full mx-auto text-center">

        {/* Dark hero */}
        <div
          className="rounded-3xl px-8 py-14 mb-8"
          style={{ background: 'linear-gradient(180deg, #0f0a04 0%, #1a1207 100%)' }}
        >
          <p className="text-6xl font-bold mb-3" style={{ color: '#c4973a' }}>404</p>
          <div className="text-5xl mb-4">✦</div>
          <h1 className="text-2xl font-bold mb-3" style={{ color: '#e8d5b0' }}>
            {tr ? 'Bu sayfa bulunamadı.' : 'This page could not be found.'}
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: '#9a8a6a' }}>
            {tr
              ? 'Ama belki kaybolmak, kendini bulmak için bir fırsattır. Mizacını keşfetmeye ne dersin?'
              : 'But maybe getting lost is a chance to find yourself. How about discovering your temperament?'}
          </p>
        </div>

        {/* CTA */}
        <div className="flex flex-col gap-3">
          <Link
            href="/test"
            className="w-full py-4 rounded-full text-center font-bold text-lg transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg, var(--earth), var(--gold))', color: '#fff' }}
          >
            ✦ {tr ? 'Mizaç Testini Başlat' : 'Start the Temperament Test'}
          </Link>
          <Link
            href="/"
            className="w-full py-3 rounded-full text-center font-semibold transition-all hover:scale-105 border"
            style={{ borderColor: 'var(--gold-light)', color: 'var(--earth)' }}
          >
            {tr ? '← Ana Sayfaya Dön' : '← Back to Home'}
          </Link>
        </div>

      </div>
    </main>
  );
}
