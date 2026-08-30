import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { blogYazilari, getBlogYazisi } from '@/lib/blog-data';
import { mizacProfiller, MizacTip } from '@/lib/mizac-data';
import { BlogEmailCapture } from './email-capture-client';
import { BlogShareBar } from './share-client';
import { ReadingProgress } from './reading-progress-client';
import Reklam from '@/components/reklam';
import { ADSENSE_SLOT_MAKALE } from '@/lib/reklam';

const siteUrl = 'https://mizac.xyz';

export function generateStaticParams() {
  return blogYazilari.map((y) => ({ slug: y.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const yazi = getBlogYazisi(slug);
  if (!yazi) return {};

  return {
    title: yazi.baslik,
    description: yazi.ozet,
    keywords: yazi.etiketler,
    openGraph: {
      title: yazi.baslik,
      description: yazi.ozet,
      url: `${siteUrl}/blog/${slug}`,
      type: 'article',
      publishedTime: yazi.tarih,
    },
    twitter: {
      card: 'summary_large_image',
      title: yazi.baslik,
      description: yazi.ozet,
    },
    alternates: { canonical: `${siteUrl}/blog/${slug}` },
  };
}

export default async function BlogYazisiPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const yazi = getBlogYazisi(slug);
  if (!yazi) notFound();

  const ilgiliProfil = yazi.ilgiliMizac ? mizacProfiller[yazi.ilgiliMizac as MizacTip] : null;

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: yazi.baslik,
    description: yazi.ozet,
    datePublished: yazi.tarih,
    dateModified: yazi.tarih,
    author: { '@type': 'Organization', name: 'Mizaç', url: siteUrl },
    publisher: { '@type': 'Organization', name: 'Mizaç', url: siteUrl },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${siteUrl}/blog/${slug}` },
    keywords: yazi.etiketler.join(', '),
    inLanguage: 'tr',
  };

  const diger = blogYazilari
    .filter((y) => y.slug !== slug)
    .slice(0, 3);

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${siteUrl}/blog` },
      { '@type': 'ListItem', position: 3, name: yazi.baslik, item: `${siteUrl}/blog/${slug}` },
    ],
  };

  return (
    <main className="min-h-screen px-4 py-16" style={{ background: 'var(--background)' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <ReadingProgress renk={ilgiliProfil?.renk} />
      <div className="max-w-2xl mx-auto">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm opacity-50 mb-8">
          <Link href="/" className="hover:opacity-100">Ana Sayfa</Link>
          <span>/</span>
          <Link href="/blog" className="hover:opacity-100">Blog</Link>
          <span>/</span>
          <span className="truncate">{yazi.baslik}</span>
        </div>

        {/* Başlık */}
        <div
          className="rounded-2xl p-8 mb-8"
          style={{
            background: ilgiliProfil
              ? `linear-gradient(135deg, ${ilgiliProfil.renkAcik}, white)`
              : 'linear-gradient(135deg, #fef9f0, white)',
          }}
        >
          {ilgiliProfil && (
            <div className="text-5xl mb-4">{ilgiliProfil.elementSembol}</div>
          )}
          <div className="flex flex-wrap gap-2 mb-3">
            {yazi.etiketler.slice(0, 3).map((e) => (
              <span
                key={e}
                className="text-xs px-2 py-0.5 rounded-full text-white"
                style={{ background: ilgiliProfil ? ilgiliProfil.renk : 'var(--earth)' }}
              >
                {e}
              </span>
            ))}
          </div>
          <h1 className="text-3xl font-bold mb-3" style={{ color: 'var(--foreground)' }}>
            {yazi.baslik}
          </h1>
          <p className="opacity-70 leading-relaxed mb-3">{yazi.ozet}</p>
          <p className="text-xs opacity-40">{yazi.okumaSuresi} dk okuma · {yazi.tarih}</p>
        </div>

        {/* Share bar */}
        <BlogShareBar baslik={yazi.baslik} slug={slug} />

        {/* İçerik */}
        <article className="prose-custom space-y-5 mb-12">
          {yazi.icerik.map((bolum, i) => {
            /* Makale ortasına tek birim: okuyucu yazıya girmişken, ilk ekranda
               değil. Kısa yazılarda hiç çıkmıyor — üç bloklu bir yazıyı
               reklamla bölmek okumayı bitiriyor. */
            const ortaya = i === 4 && yazi.icerik.length >= 9;
            if (bolum.tip === 'h2') {
              return (
                <h2 key={i} className="text-2xl font-bold mt-8 mb-3" style={{ color: 'var(--foreground)' }}>
                  {bolum.metin}
                </h2>
              );
            }
            if (bolum.tip === 'h3') {
              return (
                <h3 key={i} className="text-xl font-semibold mt-6 mb-2" style={{ color: 'var(--earth)' }}>
                  {bolum.metin}
                </h3>
              );
            }
            if (bolum.tip === 'p') {
              return (
                <div key={i}>
                  <p className="leading-relaxed opacity-80 text-base">{bolum.metin}</p>
                  {ortaya && <Reklam slot={ADSENSE_SLOT_MAKALE} />}
                </div>
              );
            }
            if (bolum.tip === 'ul' && bolum.maddeler) {
              return (
                <ul key={i} className="space-y-2 pl-4">
                  {bolum.maddeler.map((m, j) => (
                    <li key={j} className="text-sm opacity-80 leading-relaxed">
                      <span className="mr-2" style={{ color: ilgiliProfil ? ilgiliProfil.renk : 'var(--gold)' }}>✦</span>
                      {m}
                    </li>
                  ))}
                </ul>
              );
            }
            if (bolum.tip === 'cta') {
              return (
                <div
                  key={i}
                  className="rounded-2xl p-6 text-center mt-8"
                  style={{ background: 'linear-gradient(180deg, #0f0a04 0%, #1a1207 100%)' }}
                >
                  <p className="font-semibold mb-4" style={{ color: '#c8b87a' }}>{bolum.metin}</p>
                  <Link
                    href={bolum.href || '/test'}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-bold transition-all hover:scale-105"
                    style={{ background: 'linear-gradient(135deg, #8b5e1e, #c4973a)' }}
                  >
                    ✦ {bolum.buton}
                  </Link>
                </div>
              );
            }
            return null;
          })}
        </article>

        <Reklam slot={ADSENSE_SLOT_MAKALE} />

        {/* İlgili mizaç detay linki */}
        {ilgiliProfil && (
          <div
            className="rounded-2xl p-5 mb-8 flex items-center gap-4"
            style={{ background: ilgiliProfil.renkAcik, border: `1.5px solid ${ilgiliProfil.renk}40` }}
          >
            <div className="text-4xl">{ilgiliProfil.elementSembol}</div>
            <div className="flex-1">
              <p className="font-bold" style={{ color: ilgiliProfil.renk }}>{ilgiliProfil.isim} Profili</p>
              <p className="text-sm opacity-70">Sağlık, kariyer, ilişki ve daha fazlası</p>
            </div>
            <Link
              href={`/mizaclar/${ilgiliProfil.id}`}
              className="text-sm px-4 py-2 rounded-full font-semibold text-white shrink-0"
              style={{ background: ilgiliProfil.renk }}
            >
              Detaylı İncele
            </Link>
          </div>
        )}

        {/* Email capture */}
        <div className="mb-8">
          <BlogEmailCapture mizacRenk={ilgiliProfil?.renk} />
        </div>

        {/* Diğer yazılar */}
        <div>
          <h2 className="font-bold text-lg mb-4" style={{ color: 'var(--foreground)' }}>
            Diğer Yazılar
          </h2>
          <div className="space-y-3">
            {diger.map((d) => {
              const dp = d.ilgiliMizac ? mizacProfiller[d.ilgiliMizac as MizacTip] : null;
              return (
                <Link
                  key={d.slug}
                  href={`/blog/${d.slug}`}
                  className="flex items-center gap-3 rounded-xl p-4 border transition-all hover:scale-[1.01] hover:shadow-md"
                  style={{ background: dp ? dp.renkAcik : 'var(--cream)', borderColor: 'var(--gold-light)' }}
                >
                  <span className="text-2xl">{dp ? dp.elementSembol : '✦'}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate" style={{ color: 'var(--foreground)' }}>{d.baslik}</p>
                    <p className="text-xs opacity-50 mt-0.5">{d.okumaSuresi} dk okuma</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

      </div>
    </main>
  );
}
