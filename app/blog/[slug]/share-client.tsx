'use client';

import { useState } from 'react';

export function BlogShareBar({ baslik, slug }: { baslik: string; slug: string }) {
  const [copied, setCopied] = useState(false);
  const url = `https://mizac.xyz/blog/${slug}`;
  const text = `${baslik} — mizac.xyz`;

  function handleCopy() {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex items-center gap-2 flex-wrap mb-8">
      <span className="text-xs opacity-40 mr-1">Paylaş:</span>
      <a
        href={`https://wa.me/?text=${encodeURIComponent(text + '\n' + url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white transition-all hover:scale-105"
        style={{ background: '#25D366' }}
      >
        WhatsApp
      </a>
      <a
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white transition-all hover:scale-105"
        style={{ background: '#000' }}
      >
        𝕏 Twitter
      </a>
      <button
        onClick={handleCopy}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all hover:scale-105 border"
        style={{ borderColor: 'var(--gold-light)', color: 'var(--earth)' }}
      >
        {copied ? '✓ Kopyalandı' : '🔗 Linki Kopyala'}
      </button>
    </div>
  );
}
