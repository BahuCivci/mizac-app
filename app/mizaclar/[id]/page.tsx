import type { Metadata } from 'next';
import Link from 'next/link';
import { mizacProfiller, MizacTip } from '@/lib/mizac-data';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return Object.keys(mizacProfiller).map((id) => ({ id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const profil = mizacProfiller[id as MizacTip];
  if (!profil) return {};
  return {
    title: `${profil.isim} Mizacı`,
    description: profil.kisaAciklama,
    openGraph: {
      title: `${profil.isim} ${profil.elementSembol} · Mizaç`,
      description: profil.kisaAciklama,
    },
    alternates: { canonical: `/mizaclar/${id}` },
  };
}

export default async function MizacDetayPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const profil = mizacProfiller[id as MizacTip];
  if (!profil) notFound();

  return (
    <main className="min-h-screen px-4 py-16" style={{ background: 'var(--background)' }}>
      <div className="max-w-3xl mx-auto">

        {/* Hero */}
        <div
          className="rounded-3xl p-10 text-center mb-8"
          style={{ background: `linear-gradient(135deg, ${profil.renkAcik}, white)` }}
        >
          <div className="text-7xl mb-4">{profil.elementSembol}</div>
          <h1 className="text-5xl font-bold mb-1" style={{ color: profil.renk }}>
            {profil.isim}
          </h1>
          <p className="text-xl opacity-50 mb-2">{profil.isimEn}</p>
          <div className="flex justify-center gap-4 text-sm opacity-60 mb-6">
            <span>Element: <strong>{profil.element}</strong></span>
            <span>·</span>
            <span>{profil.sicaklik} & {profil.nem}</span>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {profil.anahtarKelimeler.map((k) => (
              <span key={k} className="px-3 py-1 rounded-full text-sm font-medium text-white"
                style={{ background: profil.renk }}>
                {k}
              </span>
            ))}
          </div>
        </div>

        {/* Açıklama */}
        <div className="rounded-2xl p-6 mb-6" style={{ background: 'var(--cream)' }}>
          <h2 className="font-bold text-lg mb-3" style={{ color: 'var(--earth)' }}>
            Mizaç Özellikleri
          </h2>
          <p className="leading-relaxed opacity-80 mb-4">{profil.uzunAciklama}</p>
          <p className="leading-relaxed opacity-60 text-sm italic">{profil.uzunAciklamaEn}</p>
        </div>

        {/* Güçlü / Zayıf */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="rounded-2xl p-6" style={{ background: '#f0fdf4' }}>
            <h3 className="font-bold mb-3 text-green-700">✓ Güçlü Yönler</h3>
            <ul className="space-y-2">
              {profil.gucluYonler.map((y) => (
                <li key={y} className="text-sm flex gap-2">
                  <span className="text-green-500">·</span> {y}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl p-6" style={{ background: '#fff7ed' }}>
            <h3 className="font-bold mb-3 text-orange-700">△ Gelişim Alanları</h3>
            <ul className="space-y-2">
              {profil.zayifYonler.map((y) => (
                <li key={y} className="text-sm flex gap-2">
                  <span className="text-orange-400">·</span> {y}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Sağlık */}
        <div className="rounded-2xl p-6 mb-6" style={{ background: 'var(--cream)' }}>
          <h3 className="font-bold mb-3" style={{ color: 'var(--earth)' }}>⚕ Sağlık Eğilimleri</h3>
          <div className="flex flex-wrap gap-2">
            {profil.saglikEgilimleri.map((s) => (
              <span key={s} className="text-sm px-3 py-1 rounded-full bg-white border"
                style={{ borderColor: 'var(--gold-light)' }}>
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Beslenme */}
        <div className="rounded-2xl p-6 mb-6" style={{ background: 'var(--cream)' }}>
          <h3 className="font-bold mb-3" style={{ color: 'var(--earth)' }}>🍃 Beslenme Tavsiyeleri</h3>
          <div className="flex flex-wrap gap-2">
            {profil.beslenme.map((b) => (
              <span key={b} className="text-sm px-3 py-1 rounded-full bg-white border"
                style={{ borderColor: 'var(--gold-light)' }}>
                {b}
              </span>
            ))}
          </div>
        </div>

        {/* İlişki */}
        <div className="rounded-2xl p-6 mb-8" style={{ background: 'var(--cream)' }}>
          <h3 className="font-bold mb-2" style={{ color: 'var(--earth)' }}>💛 İlişki Uyumu</h3>
          <p className="text-sm leading-relaxed opacity-80">{profil.iliski}</p>
        </div>

        {/* Nav */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/test"
            className="text-center px-6 py-3 rounded-full font-semibold text-white transition-all hover:scale-105"
            style={{ background: profil.renk }}>
            Testi Başlat
          </Link>
          <Link href="/mizaclar"
            className="text-center px-6 py-3 rounded-full font-semibold border-2 transition-all hover:scale-105"
            style={{ borderColor: 'var(--gold)', color: 'var(--earth)' }}>
            ← Tüm Mizaçlar
          </Link>
        </div>
      </div>
    </main>
  );
}
