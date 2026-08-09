import Link from 'next/link';
import { mizacProfiller, MizacTip, SORU_SAYISI } from '@/lib/mizac-data';
import { uyumVerisi } from '@/lib/uyum-data';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { SonucEmailCapture } from './email-capture-client';

const siteUrl = 'https://mizac.xyz';

// Uyum haritası tek kaynaktan türetilir (lib/uyum-data.ts). Burada elle
// yazılmış bir kopya vardı ve puanlar simetrikleştirilirken güncellenmediği
// için eski değerleri (demevi->safravi 72 gibi) göstermeye devam ediyordu.
const uyumHaritasi = Object.fromEntries(
  (Object.keys(uyumVerisi) as MizacTip[]).map((a) => [
    a,
    (Object.keys(uyumVerisi[a]) as MizacTip[])
      .map((b) => ({ tip: b, puan: uyumVerisi[a][b].puan }))
      .sort((x, y) => y.puan - x.puan),
  ])
) as Record<MizacTip, { tip: MizacTip; puan: number }[]>;
const uyumOrder: MizacTip[] = ['safravi', 'demevi', 'balgami', 'sevdavi'];

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
    // Üst layout (app/sonuc/layout.tsx) kişisel sonuç sayfası için noindex
    // veriyor; bu statik mizaç sayfaları ise indekslenmek üzere var
    // (generateStaticParams + kendi OG image'ları + sitemap kaydı).
    // Miras alınan noindex burada açıkça geri alınır.
    robots: { index: true, follow: true },
    alternates: { canonical: `${siteUrl}/sonuc/${tip}` },
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
  const tipKey = tip as MizacTip;
  if (!profil) notFound();

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
          <h2 className="font-bold mb-4" style={{ color: 'var(--foreground)' }}>💞 Mizaç Uyumu</h2>
          <div className="space-y-2 mb-3">
            {uyumHaritasi[tipKey]?.slice(0, 3).map(({ tip: digerTip, puan }) => {
              const diger = mizacProfiller[digerTip];
              const [x, y] = [tipKey, digerTip].sort((a, b) => uyumOrder.indexOf(a) - uyumOrder.indexOf(b));
              const slug = `${x}-vs-${y}`;
              const renkHex = puan >= 80 ? '#16a34a' : puan >= 60 ? '#2563eb' : puan >= 45 ? '#d97706' : '#dc2626';
              return (
                <Link key={digerTip} href={`/karsilastir/${slug}`}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white hover:shadow-sm transition-all border"
                  style={{ borderColor: diger.renk + '30' }}>
                  <span className="text-2xl shrink-0">{diger.elementSembol}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm" style={{ color: diger.renk }}>{diger.isim}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-sm font-bold" style={{ color: renkHex }}>%{puan}</span>
                    <div className="h-1 w-14 rounded-full mt-1" style={{ background: '#e5d5b0' }}>
                      <div className="h-1 rounded-full" style={{ width: `${puan}%`, background: renkHex }} />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
          <Link href="/karsilastir"
            className="block text-center text-xs transition-opacity hover:opacity-100 opacity-50"
            style={{ color: 'var(--earth)' }}>
            Tüm uyum kombinasyonlarını gör →
          </Link>
        </div>

        {/* Email Capture */}
        <SonucEmailCapture tip={tip as string} renk={profil.renk} />

        {/* CTA Kutusu */}
        <div
          className="rounded-3xl p-8 text-center mb-6"
          style={{ background: 'linear-gradient(180deg, #0f0a04 0%, #1a1207 100%)', border: `1.5px solid ${profil.renk}20` }}
        >
          <div className="text-4xl mb-3" style={{ color: profil.renk }}>✦</div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: '#e8d5b0' }}>
            Peki senin mizacın ne?
          </h2>
          <p className="mb-6 text-sm" style={{ color: '#6b5230' }}>
            İbn-i Sina geleneğine dayalı {SORU_SAYISI} soruluk ücretsiz test
          </p>
          <Link
            href="/test"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full text-white font-bold text-lg transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #8b5e1e, #c4973a)' }}
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
