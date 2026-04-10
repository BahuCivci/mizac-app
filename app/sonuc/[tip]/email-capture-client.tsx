'use client';

import { useState } from 'react';

export function SonucEmailCapture({ tip, renk }: { tip: string; renk: string }) {
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
        body: JSON.stringify({ email, tip: `sonuc-${tip}` }),
      });
      setStatus(res.ok ? 'success' : 'error');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-3xl p-8 text-center mb-6" style={{ background: '#1a1207' }}>
        <div className="text-4xl mb-3">📬</div>
        <p className="font-bold text-white text-lg">Profiliniz gönderildi!</p>
        <p className="text-sm mt-1" style={{ color: '#9a8a6a' }}>Gelen kutunuzu kontrol edin.</p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl p-8 mb-6" style={{ background: '#1a1207' }}>
      <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: renk }}>
        📬 Profilinizi kaydedin
      </p>
      <h3 className="text-xl font-bold text-white mb-2">
        Bu profili e-postanıza alalım
      </h3>
      <p className="text-sm mb-5" style={{ color: '#9a8a6a' }}>
        Sağlık tavsiyeleri, beslenme rehberi ve ilişki uyum analizi — her Pazartesi.
      </p>
      <form onSubmit={submit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@adresiniz.com"
          required
          className="flex-1 px-4 py-3 rounded-full text-sm outline-none"
          style={{ background: '#2a1f0a', border: '1px solid #c4973a40', color: '#e8d5b0' }}
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="px-5 py-3 rounded-full text-sm font-semibold text-white shrink-0 transition-all hover:opacity-90 disabled:opacity-60"
          style={{ background: renk }}
        >
          {status === 'loading' ? '⏳' : 'Gönder'}
        </button>
      </form>
      {status === 'error' && (
        <p className="text-xs text-red-400 mt-2">Bir hata oluştu, tekrar deneyin.</p>
      )}
    </div>
  );
}
