import Link from 'next/link';
import { mizacProfiller, MizacTip } from '@/lib/mizac-data';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

const siteUrl = 'https://mizac.xyz';

export function generateStaticParams() {
  return Object.keys(mizacProfiller).map((tip) => ({ tip }));
}

export async function generateMetadata({ params }: { params: Promise<{ tip: string }> }): Promise<Metadata> {
  const { tip } = await params;
  const profil = mizacProfiller[tip as MizacTip];
  if (!profil) return {};

  const title = `${profil.isim} Mizacı ${profil.elementSembol} · Mizaç`;
  const description = `${profil.isim} (${profil.isimEn}) mizacı: ${profil.kisaAciklama} Sen de öğren!`;
  const ogImage = `${siteUrl}/sonuc/${tip}/opengraph-image`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: ogImage, width: 1200, height: 630 }],
      url: `${siteUrl}/sonuc/${tip}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function SonucPaylasilabilirPage({ params }: { params: Promise<{ tip: string }> }) {
  const { tip } = await params;
  const profil = mizacProfiller[tip as MizacTip];
  if (!profil) notFound();

  const uyumluTipler: Record<MizacTip, MizacTip[]> = {
    safravi: ['balgami', 'demevi'],
    demevi: ['sevdavi', 'safravi'],
    balgami: ['safravi', 'sevdavi'],
    sevdavi: ['demevi', 'balgami'],
  };

  const uyumlar = uyumluTipler[tip as MizacTip].map((t) => mizacProfiller[t]);

  return (
    <main className="min-h-screen px-4 py-16" style={{ background: 'var(--background)' }}>
      <div className="max-w-2xl mx-auto">

        {/* Hero */}
        <div
          className="rounded-3xl p-10 text-center mb-8"
          style={{ background: `linear-gradient(135deg, ${profil.renkAcik}, white)` }}
        >
          <div className="text-7xl mb-4">{profil.elementSembol}</div>
          <p className="text-sm font-medium opacity-50 mb-2 uppercase tracking-widest">Mizaç Sonucu</p>
          <h1 className="text-5xl font-bold mb-2" style={{ color: profil.renk }}>
            {profil.isim}
          </h1>
          <p className="text-xl opacity-60 mb-4">{profil.isimEn} · {profil.element}</p>
          <p className="text-lg leading-relaxed opacity-80 max-w-md mx-auto">
            {profil.kisaAciklama}
          </p>
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {profil.anahtarKelimeler.map((kelime) => (
              <span
                key={kelime}
                className="px-3 py-1 rounded-full text-sm font-medium text-white"
                style={{ background: profil.renk }}
              >
                {kelime}
              </span>
            ))}
          </div>
        </div>

        {/* Güçlü Yönler */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="rounded-2xl p-6" style={{ background: '#f0fdf4' }}>
            <h3 className="font-bold mb-3 text-green-700">✓ Güçlü Yönler</h3>
            <ul className="space-y-1">
              {profil.gucluYonler.map((y) => (
                <li key={y} className="text-sm opacity-80">· {y}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl p-6" style={{ background: '#fff7ed' }}>
            <h3 className="font-bold mb-3 text-orange-700">△ Gelişim Alanları</h3>
            <ul className="space-y-1">
              {profil.zayifYonler.map((y) => (
                <li key={y} className="text-sm opacity-80">· {y}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Uyumlu Mizaçlar */}
        <div className="rounded-2xl p-6 mb-8" style={{ background: 'var(--cream)' }}>
          <h2 className="font-bold mb-3" style={{ color: 'var(--foreground)' }}>💞 Uyumlu Mizaçlar</h2>
          <div className="flex gap-3 flex-wrap">
            {uyumlar.map((u) => (
              <Link
                key={u.id}
                href={`/mizaclar/${u.id}`}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white transition-all hover:scale-105"
                style={{ background: u.renk }}
              >
                {u.elementSembol} {u.isim}
              </Link>
            ))}
          </div>
        </div>

        {/* CTA Kutusu */}
        <div
          className="rounded-3xl p-8 text-center mb-6"
          style={{ background: `linear-gradient(135deg, var(--cream), var(--gold-light))` }}
        >
          <div className="text-4xl mb-3">✦</div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>
            Peki senin mizacın ne?
          </h2>
          <p className="opacity-70 mb-6 text-sm">
            İbn-i Sina geleneğine dayalı 50 soruluk ücretsiz test
          </p>
          <Link
            href="/test"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full text-white font-bold text-lg transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg, var(--earth), var(--gold))' }}
          >
            ✦ Testi Başlat
          </Link>
        </div>

        {/* Detaylı profil linki */}
        <div className="text-center">
          <Link
            href={`/mizaclar/${tip}`}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold border-2 transition-all hover:scale-105 text-sm"
            style={{ borderColor: profil.renk, color: profil.renk }}
          >
            {profil.isim} Profilini Detaylı İncele →
          </Link>
        </div>

      </div>
    </main>
  );
}
