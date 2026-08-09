import Link from 'next/link';
import type { Metadata } from 'next';
import { mizacProfiller, SORU_SAYISI } from '@/lib/mizac-data';
import { uyumVerisi, kombinasyonlar } from '@/lib/uyum-data';

export const metadata: Metadata = {
  title: 'Mizaç Uyum Karşılaştırması · Hangi Mizaçlar Uyumlu?',
  description: 'Safravî, Demevî, Balgamî ve Sevdavî mizaçlar arasındaki uyum skorları. İlişki, arkadaşlık ve iş hayatında hangi mizaçlar birbirini tamamlar?',
  alternates: { canonical: 'https://mizac.xyz/karsilastir' },
};


function uyumRenk(puan: number) {
  if (puan >= 85) return { bar: '#16a34a', label: '#dcfce7', text: '#15803d' };
  if (puan >= 65) return { bar: '#2563eb', label: '#dbeafe', text: '#1d4ed8' };
  if (puan >= 50) return { bar: '#d97706', label: '#fef3c7', text: '#92400e' };
  return { bar: '#dc2626', label: '#fee2e2', text: '#991b1b' };
}

export default function KarsilastirIndexPage() {
  return (
    <main className="min-h-screen px-4 py-16" style={{ background: 'var(--background)' }}>
      <div className="max-w-3xl mx-auto">

        {/* Hero */}
        <div
          className="rounded-3xl px-8 py-14 text-center mb-12"
          style={{ background: 'linear-gradient(180deg, #0f0a04 0%, #1a1207 100%)' }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.3em] mb-5" style={{ color: '#c4973a' }}>
            Mizaç Uyumu
          </p>
          <div className="text-5xl mb-5">⚖️</div>
          <h1 className="text-4xl font-bold mb-4" style={{ color: '#e8d5b0' }}>
            Hangi mizaçlar birbirini tamamlar?
          </h1>
          <p className="text-base leading-relaxed max-w-xl mx-auto" style={{ color: '#9a8a6a' }}>
            Ateş suyu mu söndürür, yoksa birbirini dengeler mi? İbn-i Sina geleneğiyle 6 mizaç kombinasyonunun uyum skoru.
          </p>
        </div>

        {/* Kombinasyon listesi */}
        <div className="space-y-4">
          {kombinasyonlar.map((k) => {
            const profilA = mizacProfiller[k.a];
            const profilB = mizacProfiller[k.b];
            const uyum = uyumVerisi[k.a][k.b];
            const renk = uyumRenk(uyum.puan);

            return (
              <Link
                key={k.slug}
                href={`/karsilastir/${k.slug}`}
                className="group flex items-center gap-5 rounded-2xl p-5 border transition-all hover:scale-[1.01] hover:shadow-lg"
                style={{ background: 'var(--cream)', borderColor: 'var(--gold-light)' }}
              >
                {/* Semboller */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-4xl">{profilA.elementSembol}</span>
                  <span className="text-sm opacity-40">×</span>
                  <span className="text-4xl">{profilB.elementSembol}</span>
                </div>

                {/* Bilgi */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h2 className="font-bold text-base" style={{ color: 'var(--foreground)' }}>
                      {profilA.isim} & {profilB.isim}
                    </h2>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-semibold"
                      style={{ background: renk.label, color: renk.text }}
                    >
                      {uyum.baslik}
                    </span>
                  </div>
                  {/* Puan çubuğu */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 rounded-full" style={{ background: '#e5d5b0' }}>
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{ width: `${uyum.puan}%`, background: renk.bar }}
                      />
                    </div>
                    <span className="text-sm font-bold flex-shrink-0" style={{ color: renk.text }}>
                      %{uyum.puan}
                    </span>
                  </div>
                </div>

                {/* Ok */}
                <div className="text-xl opacity-30 group-hover:opacity-70 transition-opacity flex-shrink-0">→</div>
              </Link>
            );
          })}
        </div>

        {/* CTA */}
        <div
          className="rounded-3xl p-8 text-center mt-12"
          style={{ background: 'linear-gradient(180deg, #0f0a04 0%, #1a1207 100%)' }}
        >
          <div className="text-3xl mb-3" style={{ color: '#c4973a' }}>✦</div>
          <h2 className="text-xl font-bold mb-2" style={{ color: '#e8d5b0' }}>
            Önce kendi mizacını öğren
          </h2>
          <p className="text-sm mb-5" style={{ color: '#9a8a6a' }}>
            Hangi kombinasyona girdiğini bilmek için {SORU_SAYISI} soruluk ücretsiz test
          </p>
          <Link
            href="/test"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all hover:scale-105"
            style={{ background: '#c4973a', color: '#0f0a04' }}
          >
            ✦ Testi Başlat
          </Link>
        </div>

      </div>
    </main>
  );
}
