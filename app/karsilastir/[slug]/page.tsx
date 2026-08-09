import Link from 'next/link';
import type { Metadata } from 'next';
import { mizacProfiller } from '@/lib/mizac-data';
import { uyumVerisi, kombinasyonlar } from '@/lib/uyum-data';
import { notFound } from 'next/navigation';
import { KarsilastirEmailCapture } from './email-capture-client';


export function generateStaticParams() {
  return kombinasyonlar.map((k) => ({ slug: k.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const kombo = kombinasyonlar.find((k) => k.slug === slug);
  if (!kombo) return {};
  const a = mizacProfiller[kombo.a];
  const b = mizacProfiller[kombo.b];
  const uyum = uyumVerisi[kombo.a][kombo.b];
  return {
    title: `${a.isim} ve ${b.isim} Uyumu — %${uyum.puan} · Mizaç`,
    description: `${a.isim} ile ${b.isim} mizaçları arasındaki uyum skoru, güçlü yönler ve zorluklar. İbn-i Sina geleneğiyle mizaç karşılaştırması.`,
    alternates: { canonical: `https://mizac.xyz/karsilastir/${slug}` },
    openGraph: {
      title: `${a.elementSembol} ${a.isim} × ${b.elementSembol} ${b.isim} — %${uyum.puan} Uyum`,
      description: uyum.aciklama,
    },
  };
}

function UyumRenk(puan: number) {
  if (puan >= 85) return { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', bar: '#16a34a' };
  if (puan >= 65) return { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', bar: '#2563eb' };
  if (puan >= 50) return { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', bar: '#d97706' };
  return { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', bar: '#dc2626' };
}

export default async function KarsilastirPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const kombo = kombinasyonlar.find((k) => k.slug === slug);
  if (!kombo) notFound();

  const { a, b } = kombo;
  const profilA = mizacProfiller[a];
  const profilB = mizacProfiller[b];
  const uyum = uyumVerisi[a][b];
  const renk = UyumRenk(uyum.puan);

  const diger = kombinasyonlar.filter((k) => k.slug !== slug);

  return (
    <main className="min-h-screen bg-linear-to-b from-stone-50 to-white">
      {/* Hero */}
      <section className="py-14 px-4 text-center bg-linear-to-b from-stone-900 to-stone-800 text-white">
        <div className="max-w-3xl mx-auto">
          <p className="text-stone-400 text-sm tracking-widest uppercase mb-4">Mizaç Karşılaştırma</p>
          <div className="flex items-center justify-center gap-4 mb-4">
            <div>
              <div className="text-4xl">{profilA.elementSembol}</div>
              <div className="font-bold text-xl mt-1" style={{ color: profilA.renk }}>{profilA.isim}</div>
            </div>
            <div className="text-stone-500 text-2xl font-light">vs</div>
            <div>
              <div className="text-4xl">{profilB.elementSembol}</div>
              <div className="font-bold text-xl mt-1" style={{ color: profilB.renk }}>{profilB.isim}</div>
            </div>
          </div>
          <p className="text-stone-300 text-sm max-w-xl mx-auto">
            İki mizaç arasındaki uyum, güçlü yönler, zorluklar ve denge noktaları.
            İbn-i Sina geleneğiyle mizaç analizi.
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">

        {/* Uyum Skoru */}
        <div className={`rounded-3xl p-8 text-center border ${renk.bg} ${renk.border}`}>
          <div className="text-5xl font-bold mb-1" style={{ color: renk.bar }}>%{uyum.puan}</div>
          <div className={`font-bold text-lg mb-3 ${renk.text}`}>{uyum.baslik}</div>
          <div className="h-3 rounded-full bg-white overflow-hidden max-w-sm mx-auto mb-4">
            <div className="h-full rounded-full transition-all" style={{ width: `${uyum.puan}%`, background: renk.bar }} />
          </div>
          <p className="text-stone-600 text-sm leading-relaxed max-w-xl mx-auto">{uyum.aciklama}</p>
        </div>

        {/* Profiller Yan Yana */}
        <div className="grid grid-cols-2 gap-4">
          {[{ profil: profilA, tip: a }, { profil: profilB, tip: b }].map(({ profil, tip }) => (
            <div key={tip} className="rounded-2xl p-5 bg-white border border-stone-100 shadow-sm">
              <div className="text-3xl mb-2">{profil.elementSembol}</div>
              <div className="font-bold text-stone-800 mb-1">{profil.isim}</div>
              <div className="text-xs text-stone-400 mb-3">{profil.element} · {profil.sicaklik} & {profil.nem}</div>
              <ul className="space-y-1">
                {profil.anahtarKelimeler.slice(0, 4).map((k) => (
                  <li key={k} className="text-xs text-stone-500">· {k}</li>
                ))}
              </ul>
              <Link
                href={`/mizaclar/${tip}`}
                className="inline-block mt-3 text-xs px-3 py-1 rounded-full text-white font-semibold"
                style={{ background: profil.renk }}
              >
                Profili Gör →
              </Link>
            </div>
          ))}
        </div>

        {/* Güçler & Zorluklar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
            <h3 className="font-bold text-green-700 mb-3">✓ Güçlü Yönler</h3>
            <ul className="space-y-2">
              {uyum.gucler.map((g) => (
                <li key={g} className="text-sm text-stone-600 flex gap-2">
                  <span className="text-green-500 shrink-0">✓</span>
                  {g}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
            <h3 className="font-bold text-amber-700 mb-3">△ Zorluklar</h3>
            <ul className="space-y-2">
              {uyum.zorluklar.map((z) => (
                <li key={z} className="text-sm text-stone-600 flex gap-2">
                  <span className="text-amber-500 shrink-0">△</span>
                  {z}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Özellik Karşılaştırması */}
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
          <div className="grid grid-cols-3 text-xs font-bold uppercase tracking-widest text-stone-400 border-b border-stone-100">
            <div className="p-3 text-center" style={{ color: profilA.renk }}>{profilA.isim}</div>
            <div className="p-3 text-center text-stone-400">Özellik</div>
            <div className="p-3 text-center" style={{ color: profilB.renk }}>{profilB.isim}</div>
          </div>
          {[
            { label: 'Element', va: profilA.element, vb: profilB.element },
            { label: 'Sıcaklık', va: profilA.sicaklik, vb: profilB.sicaklik },
            { label: 'Nem', va: profilA.nem, vb: profilB.nem },
          ].map((row) => (
            <div key={row.label} className="grid grid-cols-3 border-b border-stone-50 last:border-0">
              <div className="p-3 text-sm text-center text-stone-600">{row.va}</div>
              <div className="p-3 text-xs text-center text-stone-400 font-semibold">{row.label}</div>
              <div className="p-3 text-sm text-center text-stone-600">{row.vb}</div>
            </div>
          ))}
        </div>

        {/* Diğer Karşılaştırmalar */}
        <div>
          <h2 className="font-bold text-stone-700 mb-3 text-sm uppercase tracking-widest">Diğer Karşılaştırmalar</h2>
          <div className="flex flex-wrap gap-2">
            {diger.map((k) => {
              const pA = mizacProfiller[k.a];
              const pB = mizacProfiller[k.b];
              const u = uyumVerisi[k.a][k.b];
              const r = UyumRenk(u.puan);
              return (
                <Link
                  key={k.slug}
                  href={`/karsilastir/${k.slug}`}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold ${r.bg} ${r.border} ${r.text} hover:shadow-sm transition-all`}
                >
                  {pA.elementSembol} {pA.isim} × {pB.elementSembol} {pB.isim}
                  <span className="opacity-60">%{u.puan}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Email Capture */}
        <KarsilastirEmailCapture slug={slug} isimA={profilA.isim} isimB={profilB.isim} />

        {/* CTA */}
        <div className="rounded-3xl p-8 text-center bg-stone-800 text-white">
          <h2 className="font-bold text-xl mb-2">Sen hangi mizaçsın?</h2>
          <p className="text-stone-300 text-sm mb-6">
            50 soruluk ücretsiz test ile mizacını öğren, ardından uyum haritanı gör.
          </p>
          <Link
            href="/test"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full font-bold bg-amber-400 text-stone-900 hover:bg-amber-300 transition-colors"
          >
            ✦ Testi Başlat
          </Link>
        </div>
      </div>
    </main>
  );
}
