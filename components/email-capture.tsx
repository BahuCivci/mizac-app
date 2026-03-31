'use client';

import { useState } from 'react';

interface EmailCaptureProps {
  title: string;
  subtitle: string;
  cta?: string;
  tip?: string;
  dark?: boolean;
}

export function EmailCapture({ title, subtitle, cta = 'Gönder', tip, dark = true }: EmailCaptureProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const submit = async () => {
    if (!email || !email.includes('@')) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, tip }),
      });
      setStatus(res.ok ? 'success' : 'error');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div
        className="rounded-3xl p-8 text-center"
        style={{ background: dark ? '#1a1207' : '#fef9f0', border: dark ? 'none' : '1px solid #e8d5a3' }}
      >
        <div className="text-4xl mb-3">✦</div>
        <p className="font-bold text-lg mb-1" style={{ color: dark ? '#fff' : '#3d2c0e' }}>
          Teşekkürler!
        </p>
        <p className="text-sm" style={{ color: dark ? '#c4973a' : '#9a8060' }}>
          İçerik kutuna gelecek. Spam yok, istediğin zaman çıkabilirsin.
        </p>
      </div>
    );
  }

  return (
    <div
      className="rounded-3xl p-8"
      style={{ background: dark ? '#1a1207' : '#fef9f0', border: dark ? 'none' : '1px solid #e8d5a3' }}
    >
      <div className="max-w-md mx-auto text-center">
        <div className="text-3xl mb-3">📬</div>
        <h3 className="text-xl font-bold mb-2" style={{ color: dark ? '#fff' : '#3d2c0e' }}>
          {title}
        </h3>
        <p className="text-sm mb-6" style={{ color: dark ? '#9a8060' : '#9a8060' }}>
          {subtitle}
        </p>
        <div className="flex gap-2">
          <input
            type="email"
            placeholder="E-posta adresin"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            className="flex-1 rounded-full px-4 py-3 text-sm focus:outline-none"
            style={{
              background: dark ? 'rgba(255,255,255,0.08)' : 'white',
              color: dark ? '#fff' : '#3d2c0e',
              border: dark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e8d5a3',
            }}
          />
          <button
            onClick={submit}
            disabled={status === 'loading'}
            className="px-5 py-3 rounded-full text-sm font-bold text-white transition-all hover:scale-105 shrink-0 disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg, #7c4a1e, #c4973a)' }}
          >
            {status === 'loading' ? '...' : cta}
          </button>
        </div>
        {status === 'error' && (
          <p className="text-red-400 text-xs mt-3">Bir hata oluştu, tekrar dene.</p>
        )}
        <p className="text-xs mt-4" style={{ color: dark ? '#4a3520' : '#c4a96a' }}>
          Ücretsiz · Spam yok · İstediğin zaman çıkabilirsin
        </p>
      </div>
    </div>
  );
}
