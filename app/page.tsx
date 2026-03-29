import Link from "next/link";
import { mizacProfiller } from "@/lib/mizac-data";

export default function Home() {
  const profiller = Object.values(mizacProfiller);

  return (
    <main className="min-h-screen" style={{ background: 'var(--background)' }}>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, var(--gold) 0%, transparent 50%),
                              radial-gradient(circle at 80% 20%, var(--earth) 0%, transparent 50%)`,
          }}
        />
        <div className="relative max-w-5xl mx-auto px-6 py-24 text-center">
          <div className="text-5xl mb-6">✦</div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6" style={{ color: 'var(--foreground)' }}>
            <span style={{ color: 'var(--gold)' }}>Mizacını</span> Keşfet
          </h1>
          <p className="text-xl md:text-2xl mb-4" style={{ color: 'var(--earth)' }}>
            Discover Your Temperament
          </p>
          <p className="text-lg max-w-2xl mx-auto mb-10 leading-relaxed opacity-75">
            İbn-i Sina&apos;nın geliştirdiği 4 element teorisine dayanan kadim mizaç bilimi ile
            kendinizi daha iyi tanıyın. Sağlık, ilişki ve yaşam rehberiniz.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/test"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-white font-semibold text-lg transition-all hover:scale-105 hover:shadow-lg"
              style={{ background: 'linear-gradient(135deg, var(--earth), var(--gold))' }}
            >
              ✦ Testi Başlat
            </Link>
            <Link
              href="/mizaclar"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-lg transition-all hover:scale-105 border-2"
              style={{ borderColor: 'var(--gold)', color: 'var(--earth)' }}
            >
              4 Mizacı İncele
            </Link>
          </div>
        </div>
      </section>

      {/* 4 Elements */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-4" style={{ color: 'var(--foreground)' }}>
          4 Temel Mizaç Tipi
        </h2>
        <p className="text-center mb-12 opacity-60">The Four Temperament Types</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {profiller.map((profil) => (
            <Link
              key={profil.id}
              href={`/mizaclar/${profil.id}`}
              className="group rounded-2xl p-6 transition-all hover:scale-105 hover:shadow-xl cursor-pointer border"
              style={{
                background: profil.renkAcik,
                borderColor: profil.renk + '40',
              }}
            >
              <div className="text-4xl mb-3">{profil.elementSembol}</div>
              <h3 className="text-xl font-bold mb-1" style={{ color: profil.renk }}>
                {profil.isim}
              </h3>
              <p className="text-sm opacity-60 mb-3">{profil.isimEn} · {profil.element}</p>
              <p className="text-sm leading-relaxed opacity-80">{profil.kisaAciklama}</p>
              <div className="mt-4 flex flex-wrap gap-1">
                {profil.anahtarKelimeler.slice(0, 3).map((kelime) => (
                  <span
                    key={kelime}
                    className="text-xs px-2 py-0.5 rounded-full text-white"
                    style={{ background: profil.renk }}
                  >
                    {kelime}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-6 py-16 text-center">
        <div
          className="rounded-3xl p-10"
          style={{ background: 'linear-gradient(135deg, var(--cream), var(--gold-light))' }}
        >
          <div className="text-4xl mb-4">🌙</div>
          <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>
            Mizacınızı öğrenin, hayatınızı keşfedin
          </h2>
          <p className="opacity-70 mb-8 text-lg">
            12 soruluk testimizi tamamlayın, kişisel mizaç profilinizi alın.
          </p>
          <Link
            href="/test"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-full text-white font-bold text-lg transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg, var(--earth), var(--gold))' }}
          >
            ✦ Ücretsiz Testi Başlat
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 text-center opacity-50 text-sm" style={{ borderColor: 'var(--gold-light)' }}>
        <p>Mizaç · İbn-i Sina Geleneğine Dayalı Mizaç Rehberi</p>
      </footer>
    </main>
  );
}
