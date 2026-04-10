'use client';

import { useState } from 'react';

export function BlogEmailCapture({ mizacRenk }: { mizacRenk?: string }) {
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
        body: JSON.stringify({ email, tip: 'blog' }),
      });
      setStatus(res.ok ? 'success' : 'error');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-3xl p-8 text-center" style={{ background: 'linear-gradient(180deg, #0f0a04 0%, #1a1207 100%)' }}>
        <div className="text-4xl mb-3">📬</div>
        <p className="font-bold text-lg" style={{ color: '#e8d5b0' }}>Eklendi!</p>
        <p className="text-sm mt-1" style={{ color: '#9a8a6a' }}>Her Pazartesi mizaç içerikleri gönderilecek.</p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl p-8" style={{ background: 'linear-gradient(180deg, #0f0a04 0%, #1a1207 100%)' }}>
      <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#c4973a' }}>
        Haftalık Mizaç Bülteni
      </p>
      <h3 className="text-xl font-bold mb-2" style={{ color: '#e8d5b0' }}>
        Bu yazıyı beğendiysen her hafta böyle içerikler.
      </h3>
      <p className="text-sm mb-6" style={{ color: '#9a8a6a' }}>
        Mizaç, sağlık, ilişki ve bilinç — her Pazartesi. Ücretsiz.
      </p>
      <form onSubmit={submit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@adresiniz.com"
          required
          className="flex-1 px-4 py-3 rounded-full text-sm outline-none border"
          style={{ background: '#1a1207', color: '#e8d5b0', borderColor: '#3d2c0e' }}
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="px-6 py-3 rounded-full text-sm font-semibold shrink-0 transition-all hover:opacity-90 disabled:opacity-60"
          style={{ background: mizacRenk || '#c4973a', color: '#0f0a04' }}
        >
          {status === 'loading' ? '⏳' : 'Gönder'}
        </button>
      </form>
      {status === 'error' && (
        <p className="text-xs mt-2" style={{ color: '#f87171' }}>Bir hata oluştu, tekrar deneyin.</p>
      )}
    </div>
  );
}
