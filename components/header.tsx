'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useLang } from '@/lib/lang-context';

export function Header() {
  const { lang, setLang } = useLang();
  const tr = lang === 'tr';
  const [menuAcik, setMenuAcik] = useState(false);

  return (
    <>
      <header
        className="sticky top-0 z-50 flex items-center justify-between px-4 py-3 border-b"
        style={{
          background: 'rgba(250, 247, 242, 0.92)',
          backdropFilter: 'blur(12px)',
          borderColor: 'var(--gold-light)',
        }}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-lg" style={{ color: 'var(--earth)' }}
          onClick={() => setMenuAcik(false)}>
          <span style={{ color: 'var(--gold)' }}>✦</span>
          <span>Mizaç</span>
        </Link>

        {/* Desktop Nav + Dil */}
        <div className="flex items-center gap-3">
          <Link
            href="/mizaclar"
            className="hidden sm:block text-sm font-medium opacity-70 hover:opacity-100 transition-opacity"
            style={{ color: 'var(--foreground)' }}
          >
            {tr ? '4 Mizaç' : '4 Types'}
          </Link>
          <Link
            href="/nur-mizaci"
            className="hidden sm:block text-sm font-medium opacity-70 hover:opacity-100 transition-opacity"
            style={{ color: 'var(--foreground)' }}
          >
            {tr ? 'Nur Mizacı' : 'Nur'}
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

          {/* Hamburger (mobil) */}
          <button
            className="sm:hidden flex flex-col gap-1.5 p-1"
            onClick={() => setMenuAcik(!menuAcik)}
            aria-label="Menü"
          >
            <span
              className="block w-5 h-0.5 transition-all"
              style={{
                background: 'var(--earth)',
                transform: menuAcik ? 'translateY(8px) rotate(45deg)' : 'none',
              }}
            />
            <span
              className="block w-5 h-0.5 transition-all"
              style={{
                background: 'var(--earth)',
                opacity: menuAcik ? 0 : 1,
              }}
            />
            <span
              className="block w-5 h-0.5 transition-all"
              style={{
                background: 'var(--earth)',
                transform: menuAcik ? 'translateY(-8px) rotate(-45deg)' : 'none',
              }}
            />
          </button>
        </div>
      </header>

      {/* Mobil menü */}
      {menuAcik && (
        <div
          className="sm:hidden fixed top-[49px] left-0 right-0 z-40 border-b px-4 py-4 flex flex-col gap-3"
          style={{
            background: 'rgba(250, 247, 242, 0.98)',
            backdropFilter: 'blur(12px)',
            borderColor: 'var(--gold-light)',
          }}
        >
          <Link
            href="/mizaclar"
            onClick={() => setMenuAcik(false)}
            className="text-base font-medium py-2 border-b opacity-80"
            style={{ color: 'var(--foreground)', borderColor: 'var(--gold-light)' }}
          >
            {tr ? '4 Mizaç' : '4 Types'}
          </Link>
          <Link
            href="/nur-mizaci"
            onClick={() => setMenuAcik(false)}
            className="text-base font-medium py-2 border-b opacity-80"
            style={{ color: 'var(--foreground)', borderColor: 'var(--gold-light)' }}
          >
            {tr ? 'Nur Mizacı' : 'Nur'}
          </Link>
          <Link
            href="/hakkinda"
            onClick={() => setMenuAcik(false)}
            className="text-base font-medium py-2 border-b opacity-80"
            style={{ color: 'var(--foreground)', borderColor: 'var(--gold-light)' }}
          >
            {tr ? 'Hakkında' : 'About'}
          </Link>
          <Link
            href="/test"
            onClick={() => setMenuAcik(false)}
            className="flex items-center justify-center gap-2 py-3 rounded-full text-white font-semibold mt-1"
            style={{ background: 'linear-gradient(135deg, var(--earth), var(--gold))' }}
          >
            ✦ {tr ? 'Testi Başlat' : 'Start Test'}
          </Link>
        </div>
      )}
    </>
  );
}
