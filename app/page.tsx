'use client';

import Link from "next/link";
import { mizacProfiller } from "@/lib/mizac-data";
import { useLang } from "@/lib/lang-context";

export default function Home() {
  const profiller = Object.values(mizacProfiller);
  const { lang } = useLang();
  const tr = lang === 'tr';

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
            <span style={{ color: 'var(--gold)' }}>
              {tr ? 'Mizacını' : 'Discover Your'}
            </span>{' '}
            {tr ? 'Keşfet' : 'Temperament'}
          </h1>
          <p className="text-lg max-w-2xl mx-auto mb-10 leading-relaxed opacity-75">
            {tr
              ? "İbn-i Sina'nın geliştirdiği 4 element teorisine dayanan kadim mizaç bilimi ile kendinizi daha iyi tanıyın. Sağlık, ilişki ve yaşam rehberiniz."
              : "Discover yourself through the ancient science of temperament based on Ibn Sina's four-element theory. Your guide to health, relationships, and life."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/test"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-white font-semibold text-lg transition-all hover:scale-105 hover:shadow-lg"
              style={{ background: 'linear-gradient(135deg, var(--earth), var(--gold))' }}
            >
              ✦ {tr ? 'Testi Başlat' : 'Start the Test'}
            </Link>
            <Link
              href="/mizaclar"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-lg transition-all hover:scale-105 border-2"
              style={{ borderColor: 'var(--gold)', color: 'var(--earth)' }}
            >
              {tr ? '4 Mizacı İncele' : 'Explore 4 Types'}
            </Link>
          </div>
        </div>
      </section>

      {/* 4 Elements */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-2" style={{ color: 'var(--foreground)' }}>
          {tr ? '4 Temel Mizaç Tipi' : 'The Four Temperament Types'}
        </h2>
        <p className="text-center mb-12 opacity-60">
          {tr ? 'İbn-i Sina Geleneği · 4 Element' : 'Based on Ibn Sina\'s Ancient Tradition'}
        </p>
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
                {tr ? profil.isim : profil.isimEn}
              </h3>
              <p className="text-sm opacity-60 mb-3">
                {tr ? profil.isimEn : profil.isim} · {tr ? profil.element : profil.elementEn}
              </p>
              <p className="text-sm leading-relaxed opacity-80">
                {tr ? profil.kisaAciklama : profil.kisaAciklamaEn}
              </p>
              <div className="mt-4 flex flex-wrap gap-1">
                {(tr ? profil.anahtarKelimeler : profil.anahtarKelimelerEn).slice(0, 3).map((kelime) => (
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

      {/* Nasıl Çalışır */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12" style={{ color: 'var(--foreground)' }}>
          {tr ? 'Nasıl Çalışır?' : 'How Does It Work?'}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {[
            {
              icon: '📝',
              tr: { baslik: '50 Soru', aciklama: 'Fiziksel, duygusal ve sosyal özelliklerini kapsayan kapsamlı sorular' },
              en: { baslik: '50 Questions', aciklama: 'Comprehensive questions covering physical, emotional and social traits' },
            },
            {
              icon: '🔬',
              tr: { baslik: 'Analiz', aciklama: 'İbn-i Sina\'nın 4 mizaç teorisine dayalı bilimsel skorlama' },
              en: { baslik: 'Analysis', aciklama: 'Scientific scoring based on Ibn Sina\'s four temperament theory' },
            },
            {
              icon: '✦',
              tr: { baslik: 'Kişisel Profil', aciklama: 'Sağlık, ilişki ve yaşam önerileri içeren detaylı mizaç profilin' },
              en: { baslik: 'Personal Profile', aciklama: 'Detailed temperament profile with health, relationship and life insights' },
            },
          ].map((adim) => (
            <div key={adim.icon} className="text-center">
              <div className="text-4xl mb-4">{adim.icon}</div>
              <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--earth)' }}>
                {tr ? adim.tr.baslik : adim.en.baslik}
              </h3>
              <p className="text-sm opacity-70 leading-relaxed">
                {tr ? adim.tr.aciklama : adim.en.aciklama}
              </p>
            </div>
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
            {tr ? 'Mizacınızı öğrenin, hayatınızı keşfedin' : 'Know your temperament, transform your life'}
          </h2>
          <p className="opacity-70 mb-8 text-lg">
            {tr
              ? '50 soruluk testimizi tamamlayın, kişisel mizaç profilinizi alın.'
              : 'Complete our 50-question test and receive your personal temperament profile.'}
          </p>
          <Link
            href="/test"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-full text-white font-bold text-lg transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg, var(--earth), var(--gold))' }}
          >
            ✦ {tr ? 'Ücretsiz Testi Başlat' : 'Start Free Test'}
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 text-center opacity-50 text-sm" style={{ borderColor: 'var(--gold-light)' }}>
        <p>Mizaç · {tr ? 'İbn-i Sina Geleneğine Dayalı Mizaç Rehberi' : 'Temperament Guide Based on Ibn Sina\'s Tradition'}</p>
      </footer>
    </main>
  );
}
