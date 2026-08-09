import Link from 'next/link';
import { SORU_SAYISI } from '@/lib/mizac-data';
import type { Metadata } from 'next';
import { blogYazilari } from '@/lib/blog-data';
import { BlogFilter } from './blog-filter-client';

export const metadata: Metadata = {
  title: 'Mizaç Blog · İbn-i Sina Geleneği',
  description: 'Safravî, Demevî, Balgamî ve Sevdavî mizaç tipleri hakkında kapsamlı yazılar. Mizaç testi, sağlık tavsiyeleri ve uyum rehberi.',
  alternates: { canonical: 'https://mizac.xyz/blog' },
};

export default function BlogPage() {
  return (
    <main className="min-h-screen px-4 py-16" style={{ background: 'var(--background)' }}>
      <div className="max-w-3xl mx-auto">

        {/* Hero */}
        <div className="rounded-3xl px-8 py-14 text-center mb-12"
          style={{ background: 'linear-gradient(180deg, #0f0a04 0%, #1a1207 100%)' }}>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] mb-5" style={{ color: '#c4973a' }}>
            Mizaç Blog
          </p>
          <div className="text-5xl mb-5">✦</div>
          <h1 className="text-4xl font-bold mb-4" style={{ color: '#e8d5b0' }}>
            Kendini okumayı öğren.
          </h1>
          <p className="text-base leading-relaxed max-w-xl mx-auto" style={{ color: '#9a8a6a' }}>
            Öfken neden o organa gidiyor, çocuğun neden o şekilde tepki veriyor, yanlış mizaçla neden yoruluyorsun — cevaplar burada.
          </p>
        </div>

        {/* Yazı listesi + Filtre */}
        <BlogFilter yazilar={blogYazilari} />

        {/* CTA */}
        <div
          className="rounded-3xl p-8 text-center mt-12"
          style={{ background: 'linear-gradient(180deg, #0f0a04 0%, #1a1207 100%)' }}
        >
          <div className="text-3xl mb-3" style={{ color: '#c4973a' }}>✦</div>
          <h2 className="text-xl font-bold mb-2" style={{ color: '#e8d5b0' }}>
            Kendi mizacını öğren
          </h2>
          <p className="text-sm mb-5" style={{ color: '#6b5230' }}>{SORU_SAYISI} soruluk ücretsiz mizaç testi</p>
          <Link
            href="/test"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-bold transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #8b5e1e, #c4973a)' }}
          >
            ✦ Testi Başlat
          </Link>
        </div>

      </div>
    </main>
  );
}
