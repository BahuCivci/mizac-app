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
              ? "İbn-i Sina'nın 4 element teorisine dayalı kadim mizaç bilimi. Sağlığını, ilişkilerini ve yaşamını yeniden oku."
              : "Ancient temperament science based on Ibn Sina's four-element theory. Reread your health, relationships and life."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
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
          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-6 text-sm opacity-60">
            <span>✓ {tr ? 'Ücretsiz' : 'Free'}</span>
            <span>✓ {tr ? '5 dakika' : '5 minutes'}</span>
            <span>✓ {tr ? 'Kayıt gerekmez' : 'No signup needed'}</span>
            <span>✓ {tr ? 'İbn-i Sina geleneği' : 'Ibn Sina tradition'}</span>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="max-w-5xl mx-auto px-6 pb-8">
        <div className="rounded-3xl p-8" style={{ background: 'linear-gradient(180deg, #0f0a04 0%, #1a1207 100%)' }}>
          <div className="grid grid-cols-3 gap-6 text-center mb-8">
            {[
              { sayi: '14.800+', etiket: tr ? 'Test Tamamlandı' : 'Tests Completed' },
              { sayi: '%91', etiket: tr ? '"Çok doğru" diyor' : 'Say "very accurate"' },
              { sayi: '4', etiket: tr ? 'Mizaç Tipi' : 'Temperament Types' },
            ].map((item) => (
              <div key={item.etiket}>
                <p className="text-3xl font-bold mb-1" style={{ color: '#c4973a' }}>{item.sayi}</p>
                <p className="text-xs" style={{ color: '#9a8a6a' }}>{item.etiket}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { isim: 'Selin A.', mizac: tr ? 'Demevî' : 'Sanguine', metin: tr ? '"Okurken ağladım. Her cümle benim hakkımda yazılmış gibi hissettirdi."' : '"I cried reading it. Every sentence felt written about me."' },
              { isim: 'Mehmet K.', mizac: tr ? 'Safravî' : 'Choleric', metin: tr ? '"15 yıllık terapiden daha çok şey öğrendim bu testten."' : '"I learned more from this test than 15 years of therapy."' },
              { isim: 'Ayşe T.', mizac: tr ? 'Sevdavî' : 'Melancholic', metin: tr ? '"Eşim de yaptı. İlk defa birbirimizi gerçekten anlıyoruz."' : '"My husband took it too. For the first time we truly understand each other."' },
            ].map((t) => (
              <div key={t.isim} className="rounded-2xl p-5" style={{ background: '#2a1f0a' }}>
                <p className="text-sm leading-relaxed italic mb-3" style={{ color: '#e8d5b0' }}>{t.metin}</p>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: '#c4973a', color: '#0f0a04' }}>
                    {t.isim[0]}
                  </div>
                  <div>
                    <p className="text-xs font-semibold" style={{ color: '#c4973a' }}>{t.isim}</p>
                    <p className="text-xs" style={{ color: '#9a8a6a' }}>{t.mizac}</p>
                  </div>
                </div>
              </div>
            ))}
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

      {/* Keşfet */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-2" style={{ color: 'var(--foreground)' }}>
          {tr ? 'Daha Fazlasını Keşfet' : 'Explore More'}
        </h2>
        <p className="text-center mb-10 opacity-60 text-sm">
          {tr ? 'Varlığın Tahlili kitabından alınan özgün içerikler' : 'Original content from the book Varlığın Tahlili'}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <Link href="/hizli-test"
            className="group rounded-2xl p-6 border transition-all hover:scale-105 hover:shadow-lg"
            style={{ background: 'linear-gradient(135deg, #fef9f0, #fef3c7)', borderColor: '#c4973a40' }}>
            <div className="text-4xl mb-3">⚡</div>
            <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--earth)' }}>
              {tr ? 'Hızlı Test — 10 Soru' : 'Quick Test — 10 Questions'}
            </h3>
            <p className="text-sm opacity-70 leading-relaxed">
              {tr
                ? '2 dakikada mizacını öğren. Emoji seçenekli, mobil dostu hızlı karakter testi.'
                : 'Discover your temperament in 2 minutes. Mobile-friendly quick test with emoji choices.'}
            </p>
          </Link>
          <Link href="/uyum"
            className="group rounded-2xl p-6 border transition-all hover:scale-105 hover:shadow-lg"
            style={{ background: '#fdf2f8', borderColor: '#f9a8d440' }}>
            <div className="text-4xl mb-3">💞</div>
            <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--earth)' }}>
              {tr ? 'Mizaç Uyumu' : 'Temperament Compatibility'}
            </h3>
            <p className="text-sm opacity-70 leading-relaxed">
              {tr
                ? 'Hangi mizaçlar birbirleriyle uyumlu? İlişki, arkadaşlık ve iş hayatında uyum haritası.'
                : 'Which temperaments are compatible? Compatibility map for relationships, friendship and work life.'}
            </p>
          </Link>
          <Link href="/tarifler"
            className="group rounded-2xl p-6 border transition-all hover:scale-105 hover:shadow-lg"
            style={{ background: '#f0fdf4', borderColor: '#86efac40' }}>
            <div className="text-4xl mb-3">🍃</div>
            <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--earth)' }}>
              {tr ? 'Mizaca Özel Tarifler' : 'Temperament Recipes'}
            </h3>
            <p className="text-sm opacity-70 leading-relaxed">
              {tr
                ? 'Her mizaç için detoks tarifleri, şifalı çaylar ve sağlık önerileri.'
                : 'Detox recipes, herbal teas and health recommendations for each temperament.'}
            </p>
          </Link>
          <Link href="/cocuk-mizaci"
            className="group rounded-2xl p-6 border transition-all hover:scale-105 hover:shadow-lg"
            style={{ background: '#fef9f0', borderColor: 'var(--gold-light)' }}>
            <div className="text-4xl mb-3">🧒</div>
            <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--earth)' }}>
              {tr ? 'Çocuğunuzun Mizacı' : "Your Child's Temperament"}
            </h3>
            <p className="text-sm opacity-70 leading-relaxed">
              {tr
                ? 'Bebeklikten okul çağına, her mizacın çocukluk özellikleri ve ebeveyn rehberi.'
                : 'From infancy to school age — childhood traits for each temperament with parent guidance.'}
            </p>
          </Link>
          <Link href="/yas-mizaclari"
            className="group rounded-2xl p-6 border transition-all hover:scale-105 hover:shadow-lg"
            style={{ background: '#f0fdf4', borderColor: '#86efac40' }}>
            <div className="text-4xl mb-3">⏳</div>
            <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--earth)' }}>
              {tr ? 'Yaş Mizaçları' : 'Life Stage Temperaments'}
            </h3>
            <p className="text-sm opacity-70 leading-relaxed">
              {tr
                ? 'Bebeklik, çocukluk, gençlik, yaşlılık — hayatın her dönemi farklı bir mizaçla akar.'
                : 'Infancy, childhood, youth, old age — each life stage flows through a different temperament.'}
            </p>
          </Link>
          <Link href="/nur-mizaci"
            className="group rounded-2xl p-6 border transition-all hover:scale-105 hover:shadow-lg"
            style={{ background: '#faf5ff', borderColor: '#d8b4fe40' }}>
            <div className="text-4xl mb-3">✨</div>
            <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--earth)' }}>
              {tr ? 'Nur Mizacı' : 'The Nur Temperament'}
            </h3>
            <p className="text-sm opacity-70 leading-relaxed">
              {tr
                ? '4 mizacın ötesinde, dengeli ve kemale ermiş hal. Nur mizacına ulaşmanın 8 yolu.'
                : 'Beyond the 4 types — the balanced, perfected state. The 8 paths to Nur temperament.'}
            </p>
          </Link>
          <Link href="/dort-halife"
            className="group rounded-2xl p-6 border transition-all hover:scale-105 hover:shadow-lg"
            style={{ background: '#fef3c7', borderColor: '#fcd34d40' }}>
            <div className="text-4xl mb-3">🕌</div>
            <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--earth)' }}>
              {tr ? 'Dört Halifenin Mizacı' : 'Four Caliphs'}
            </h3>
            <p className="text-sm opacity-70 leading-relaxed">
              {tr
                ? 'Hz. Ebubekir, Ömer, Osman ve Ali — dört halifenin mizaç analizi ve tarihsel izleri.'
                : 'Abu Bakr, Umar, Uthman and Ali — temperament analysis of the four caliphs.'}
            </p>
          </Link>
          <Link href="/meslekler"
            className="group rounded-2xl p-6 border transition-all hover:scale-105 hover:shadow-lg"
            style={{ background: '#f0f9ff', borderColor: '#7dd3fc40' }}>
            <div className="text-4xl mb-3">💼</div>
            <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--earth)' }}>
              {tr ? 'Mizaç ve Kariyer' : 'Temperament & Career'}
            </h3>
            <p className="text-sm opacity-70 leading-relaxed">
              {tr
                ? 'Her mizaç için ideal meslekler. Hangi iş ortamı sana göre? İbn-i Sina geleneğiyle kariyer rehberi.'
                : 'Ideal careers for each temperament. Career guide based on Ibn Sina tradition.'}
            </p>
          </Link>
          <Link href="/varligin-mizaci"
            className="group rounded-2xl p-6 border transition-all hover:scale-105 hover:shadow-lg"
            style={{ background: '#f0fdf4', borderColor: '#6ee7b740' }}>
            <div className="text-4xl mb-3">🌿</div>
            <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--earth)' }}>
              {tr ? 'Varlığın Mizacı' : "Nature's Temperament"}
            </h3>
            <p className="text-sm opacity-70 leading-relaxed">
              {tr
                ? 'Renkler, kumaşlar, metaller, mekânlar, mevsimler — her şeyin bir mizacı var.'
                : 'Colors, fabrics, metals, spaces, seasons — everything has a temperament.'}
            </p>
          </Link>
          <Link href="/hastaliklar"
            className="group rounded-2xl p-6 border transition-all hover:scale-105 hover:shadow-lg"
            style={{ background: '#fff1f2', borderColor: '#fda4af40' }}>
            <div className="text-4xl mb-3">🫀</div>
            <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--earth)' }}>
              {tr ? 'Mizaç ve Hastalık' : 'Temperament & Health'}
            </h3>
            <p className="text-sm opacity-70 leading-relaxed">
              {tr
                ? 'Her mizacın zayıf noktaları, yatkın olduğu hastalıklar ve ağrı tipleri.'
                : 'Weak points, prone illnesses and pain types for each temperament.'}
            </p>
          </Link>
          <Link href="/esma-sifa"
            className="group rounded-2xl p-6 border transition-all hover:scale-105 hover:shadow-lg"
            style={{ background: '#ecfdf5', borderColor: '#6ee7b740' }}>
            <div className="text-4xl mb-3">📿</div>
            <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--earth)' }}>
              {tr ? "Esmaü'l-Hüsna ile Şifa" : "Healing with Divine Names"}
            </h3>
            <p className="text-sm opacity-70 leading-relaxed">
              {tr
                ? "Allah'ın 99 ismi ve organ haritası. Mizacına göre şifa olan esmalar."
                : "99 Names of Allah and organ map. Divine names for healing by temperament."}
            </p>
          </Link>
          <Link href="/nefes"
            className="group rounded-2xl p-6 border transition-all hover:scale-105 hover:shadow-lg"
            style={{ background: '#eff6ff', borderColor: '#93c5fd40' }}>
            <div className="text-4xl mb-3">🌬️</div>
            <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--earth)' }}>
              {tr ? 'Nefes Egzersizleri' : 'Breathing Exercises'}
            </h3>
            <p className="text-sm opacity-70 leading-relaxed">
              {tr
                ? 'Mizacına göre nefes teknikleri. Safravi için soğutucu, balgami için ısıtıcı nefes.'
                : 'Breathing techniques by temperament. Cooling for fire, warming for water.'}
            </p>
          </Link>
          <Link href="/gida-kavrami"
            className="group rounded-2xl p-6 border transition-all hover:scale-105 hover:shadow-lg"
            style={{ background: '#fffbeb', borderColor: '#fcd34d40' }}>
            <div className="text-4xl mb-3">🍊</div>
            <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--earth)' }}>
              {tr ? 'Gıda Kavramı' : 'The Concept of Nourishment'}
            </h3>
            <p className="text-sm opacity-70 leading-relaxed">
              {tr
                ? 'Gıda yalnızca tabağınızdaki değildir. Görsel, işitsel, duygusal — 6 çeşit gıda.'
                : 'Food is not only what is on your plate. Visual, auditory, emotional — 6 types of nourishment.'}
            </p>
          </Link>
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
      <footer className="border-t py-8 text-center text-sm" style={{ borderColor: 'var(--gold-light)' }}>
        <div className="flex flex-wrap justify-center gap-5 mb-3">
          <Link href="/mizaclar" className="opacity-60 hover:opacity-100 transition-opacity" style={{ color: 'var(--earth)' }}>
            {tr ? '4 Mizaç' : '4 Types'}
          </Link>
          <Link href="/uyum" className="opacity-60 hover:opacity-100 transition-opacity" style={{ color: 'var(--earth)' }}>
            {tr ? 'Uyum' : 'Compatibility'}
          </Link>
          <Link href="/tarifler" className="opacity-60 hover:opacity-100 transition-opacity" style={{ color: 'var(--earth)' }}>
            {tr ? 'Tarifler' : 'Recipes'}
          </Link>
          <Link href="/cocuk-mizaci" className="opacity-60 hover:opacity-100 transition-opacity" style={{ color: 'var(--earth)' }}>
            {tr ? 'Çocuk Mizacı' : 'Child'}
          </Link>
          <Link href="/yas-mizaclari" className="opacity-60 hover:opacity-100 transition-opacity" style={{ color: 'var(--earth)' }}>
            {tr ? 'Yaş Mizaçları' : 'Life Stages'}
          </Link>
          <Link href="/nur-mizaci" className="opacity-60 hover:opacity-100 transition-opacity" style={{ color: 'var(--earth)' }}>
            {tr ? 'Nur Mizacı' : 'Nur'}
          </Link>
          <Link href="/test" className="opacity-60 hover:opacity-100 transition-opacity" style={{ color: 'var(--earth)' }}>
            {tr ? 'Test' : 'Test'}
          </Link>
          <Link href="/hakkinda" className="opacity-60 hover:opacity-100 transition-opacity" style={{ color: 'var(--earth)' }}>
            {tr ? 'Hakkında' : 'About'}
          </Link>
        </div>
        <p className="opacity-40 mb-1">Mizaç · {tr ? 'İbn-i Sina Geleneğine Dayalı Mizaç Rehberi' : 'Temperament Guide Based on Ibn Sina\'s Tradition'}</p>
        <p className="opacity-30 text-xs">{tr ? 'Varlığın Tahlili · Zeynep Işık Büyükbay' : 'Varlığın Tahlili · Zeynep Işık Büyükbay'}</p>
      </footer>
    </main>
  );
}
