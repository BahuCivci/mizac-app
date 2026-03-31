'use client';

import { useState } from 'react';

export function KarsilastirEmailCapture({ slug, isimA, isimB }: { slug: string; isimA: string; isimB: string }) {
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
        body: JSON.stringify({ email, tip: `karsilastir-${slug}` }),
      });
      setStatus(res.ok ? 'success' : 'error');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-3xl p-8 text-center bg-stone-800">
        <div className="text-4xl mb-3">📬</div>
        <p className="font-bold text-white text-lg">Eklendi!</p>
        <p className="text-sm text-stone-400 mt-1">Her Pazartesi mizaç içerikleri gönderilecek.</p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl p-8 bg-stone-800">
      <p className="text-xs font-semibold uppercase tracking-widest mb-2 text-amber-400">
        Haftalık İlişki Rehberi
      </p>
      <h3 className="text-xl font-bold text-white mb-2">
        {isimA} ile {isimB} ilişkisini derinleştir.
      </h3>
      <p className="text-sm text-stone-400 mb-6">
        Mizaç uyumu, ilişki tavsiyeleri ve iletişim rehberi — her Pazartesi.
      </p>
      <form onSubmit={submit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@adresiniz.com"
          required
          className="flex-1 px-4 py-3 rounded-full text-sm outline-none bg-stone-700 text-stone-100 border border-stone-600 placeholder:text-stone-500"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="px-6 py-3 rounded-full text-sm font-semibold text-stone-900 shrink-0 transition-all hover:opacity-90 disabled:opacity-60 bg-amber-400"
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
