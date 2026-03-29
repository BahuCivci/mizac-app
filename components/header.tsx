'use client';

import Link from 'next/link';
import { useLang } from '@/lib/lang-context';

export function Header() {
  const { lang, setLang } = useLang();
  const tr = lang === 'tr';

  return (
    <header
      className="sticky top-0 z-50 flex items-center justify-between px-4 py-3 border-b"
      style={{
        background: 'rgba(250, 247, 242, 0.92)',
        backdropFilter: 'blur(12px)',
        borderColor: 'var(--gold-light)',
      }}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 font-bold text-lg" style={{ color: 'var(--earth)' }}>
        <span style={{ color: 'var(--gold)' }}>✦</span>
        <span>Mizaç</span>
      </Link>

      {/* Nav + Dil */}
      <div className="flex items-center gap-3">
        <Link
          href="/mizaclar"
          className="hidden sm:block text-sm font-medium opacity-70 hover:opacity-100 transition-opacity"
          style={{ color: 'var(--foreground)' }}
        >
          {tr ? '4 Mizaç' : '4 Types'}
        </Link>
        <Link
          href="/hakkinda"
          className="hidden sm:block text-sm font-medium opacity-70 hover:opacity-100 transition-opacity"
          style={{ color: 'var(--foreground)' }}
        >
          {tr ? 'Hakkında' : 'About'}
        </Link>
        <Link
          href="/test"
          className="hidden sm:flex items-center gap-1 px-4 py-1.5 rounded-full text-sm font-semibold text-white transition-all hover:scale-105"
          style={{ background: 'linear-gradient(135deg, var(--earth), var(--gold))' }}
        >
          {tr ? 'Testi Başlat' : 'Start Test'}
        </Link>

        {/* Dil seçici */}
        <div
          className="flex rounded-full overflow-hidden text-sm font-semibold"
          style={{ border: '1.5px solid var(--gold)' }}
        >
          <button
            onClick={() => setLang('tr')}
            className="px-3 py-1 transition-all"
            style={{
              background: lang === 'tr' ? 'var(--gold)' : 'transparent',
              color: lang === 'tr' ? 'white' : 'var(--earth)',
            }}
          >
            TR
          </button>
          <button
            onClick={() => setLang('en')}
            className="px-3 py-1 transition-all"
            style={{
              background: lang === 'en' ? 'var(--gold)' : 'transparent',
              color: lang === 'en' ? 'white' : 'var(--earth)',
            }}
          >
            EN
          </button>
        </div>
      </div>
    </header>
  );
}
