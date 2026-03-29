'use client';

import Link from 'next/link';
import { useLang } from '@/lib/lang-context';

export default function NotFound() {
  const { lang } = useLang();
  const tr = lang === 'tr';

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 text-center"
      style={{ background: 'var(--background)' }}>
      <div className="text-8xl mb-6">✦</div>
      <h1 className="text-6xl font-bold mb-4" style={{ color: 'var(--gold)' }}>404</h1>
      <p className="text-xl opacity-60 mb-8">
        {tr ? 'Bu sayfa bulunamadı.' : 'This page could not be found.'}
      </p>
      <Link
        href="/"
        className="px-8 py-3 rounded-full text-white font-semibold transition-all hover:scale-105"
        style={{ background: 'linear-gradient(135deg, var(--earth), var(--gold))' }}
      >
        {tr ? '← Ana Sayfaya Dön' : '← Back to Home'}
      </Link>
    </main>
  );
}
