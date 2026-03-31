import Link from 'next/link';
import type { Metadata } from 'next';
import { blogYazilari } from '@/lib/blog-data';
import { mizacProfiller, MizacTip } from '@/lib/mizac-data';

export const metadata: Metadata = {
  title: 'Mizaç Blog · İbn-i Sina Geleneği',
  description: 'Safravî, Demevî, Balgamî ve Sevdavî mizaç tipleri hakkında kapsamlı yazılar. Mizaç testi, sağlık tavsiyeleri ve uyum rehberi.',
  alternates: { canonical: 'https://mizac.xyz/blog' },
};

export default function BlogPage() {
  return (
    <main className="min-h-screen px-4 py-16" style={{ background: 'var(--background)' }}>
      <div className="max-w-3xl mx-auto">

        {/* Başlık */}
        <div className="text-center mb-12">
          <div className="text-4xl mb-3">✦</div>
          <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>
            Mizaç Blog
          </h1>
          <p className="opacity-60 text-sm">
            İbn-i Sina geleneğine dayalı mizaç bilgisi
          </p>
        </div>

        {/* Yazı listesi */}
        <div className="space-y-5">
          {blogYazilari.map((yazi) => {
            const profil = yazi.ilgiliMizac ? mizacProfiller[yazi.ilgiliMizac as MizacTip] : null;
            return (
              <Link
                key={yazi.slug}
                href={`/blog/${yazi.slug}`}
                className="group flex gap-4 rounded-2xl p-6 border transition-all hover:scale-[1.01] hover:shadow-lg"
                style={{
                  background: profil ? profil.renkAcik : 'var(--cream)',
                  borderColor: profil ? profil.renk + '30' : 'var(--gold-light)',
                }}
              >
                <div className="text-5xl flex-shrink-0">{profil ? profil.elementSembol : '📖'}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap gap-1 mb-2">
                    {yazi.etiketler.slice(0, 2).map((e) => (
                      <span
                        key={e}
                        className="text-xs px-2 py-0.5 rounded-full text-white"
                        style={{ background: profil ? profil.renk : 'var(--earth)' }}
                      >
                        {e}
                      </span>
                    ))}
                  </div>
                  <h2 className="font-bold text-lg mb-1 group-hover:underline" style={{ color: 'var(--foreground)' }}>
                    {yazi.baslik}
                  </h2>
                  <p className="text-sm opacity-70 leading-relaxed line-clamp-2">{yazi.ozet}</p>
                  <p className="text-xs opacity-40 mt-2">{yazi.okumaSuresi} dk okuma · {yazi.tarih}</p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* CTA */}
        <div
          className="rounded-3xl p-8 text-center mt-12"
          style={{ background: 'linear-gradient(135deg, var(--cream), var(--gold-light))' }}
        >
          <div className="text-3xl mb-3">✦</div>
          <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>
            Kendi mizacını öğren
          </h2>
          <p className="opacity-60 text-sm mb-5">50 soruluk ücretsiz mizaç testi</p>
          <Link
            href="/test"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-bold transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg, var(--earth), var(--gold))' }}
          >
            ✦ Testi Başlat
          </Link>
        </div>

      </div>
    </main>
  );
}
