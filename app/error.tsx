'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-16"
      style={{ background: 'var(--background)' }}>
      <div className="max-w-lg w-full mx-auto text-center">
        <div
          className="rounded-3xl px-8 py-14 mb-8"
          style={{ background: 'linear-gradient(180deg, #0f0a04 0%, #1a1207 100%)' }}
        >
          <div className="text-5xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold mb-3" style={{ color: '#e8d5b0' }}>
            Bir hata oluştu
          </h1>
          <p className="text-sm leading-relaxed mb-6" style={{ color: '#9a8a6a' }}>
            Beklenmedik bir sorun çıktı. Sayfayı yenilemeyi deneyin.
          </p>
          <button
            onClick={reset}
            className="w-full py-3 rounded-full font-bold text-white mb-3 transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, var(--earth), var(--gold))' }}
          >
            ✦ Tekrar Dene
          </button>
        </div>
        <Link
          href="/"
          className="text-sm"
          style={{ color: 'var(--earth)' }}
        >
          ← Ana Sayfaya Dön
        </Link>
      </div>
    </main>
  );
}
