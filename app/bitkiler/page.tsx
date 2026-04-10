import Link from 'next/link';

const mizacBitkiler = [
  {
    mizac: 'Safravî',
    mizacId: 'safravi',
    sembol: '🔥',
    renk: '#e8832a',
    renkAcik: '#fef6ed',
    nitelik: 'Sıcak & Kuru',
    ozet: 'Safravî mizaç için serinletici, nemlendirici bitkiler önerilir. Isıtıcı ve kurutucu bitkilerden kaçınılmalıdır.',
    oneriliBitkiler: [
      { isim: 'Nane', aciklama: 'Serinletici ve sindirim düzenleyici. Safranın ısısını dengeler.' },
      { isim: 'Limon otu (Melisa)', aciklama: 'Sinir sistemini yatıştırır, öfkeyi azaltır.' },
      { isim: 'Gül', aciklama: 'Kalbi ve karaciğeri serinletir, ruh halini iyileştirir.' },
      { isim: 'Papatya', aciklama: 'İltihap önler, mideyi sakinleştirir.' },
      { isim: 'Narlı bitkisel çaylar', aciklama: 'Antioksidan, safra dengeleyici.' },
      { isim: 'Hindiba', aciklama: 'Karaciğeri temizler, safra salgısını düzenler.' },
    ],
    kacinilacakBitkiler: [
      { isim: 'Zencefil', aciklama: 'Isıtıcıdır, safravî kişilerde öfkeyi artırabilir.' },
      { isim: 'Tarçın', aciklama: 'Kuru ve ısıtıcı. Safra hıltını yoğunlaştırır.' },
      { isim: 'Karanfil', aciklama: 'Çok sıcak etkili, safravî için aşırı uyarıcıdır.' },
    ],
    baharatlar: ['Kişniş tohumu', 'Rezene', 'Sumak', 'Sarımsak (az)', 'Dereotu'],
  },
  {
    mizac: 'Demevî',
    mizacId: 'demevi',
    sembol: '💨',
    renk: '#e05a7a',
    renkAcik: '#fdf0f3',
    nitelik: 'Sıcak & Nemli',
    ozet: 'Demevî mizaç için kurutucu ve hafif soğutucu bitkiler önerilir. Fazla nem artıran bitkilerden kaçınılmalıdır.',
    oneriliBitkiler: [
      { isim: 'Adaçayı', aciklama: 'Kuru ve serinletici. Kan hıltının fazla nemini dengeler.' },
      { isim: 'Kekik', aciklama: 'Antibakteriyal, solunumu güçlendirir.' },
      { isim: 'Biberiye', aciklama: 'Belleği güçlendirir, kan dolaşımını dengeler.' },
      { isim: 'Fesleğen', aciklama: 'Sinir sistemini güçlendirir, ruh halini düzenler.' },
      { isim: 'Lavanta', aciklama: 'Fazla enerjiyi sakinleştirir, uykuyu iyileştirir.' },
      { isim: 'Kızılcık', aciklama: 'Hafif astrenjan, kan şekerini dengeler.' },
    ],
    kacinilacakBitkiler: [
      { isim: 'Meyankökü', aciklama: 'Nem artırıcı. Demevî için fazla nemlendirir.' },
      { isim: 'Hatmi', aciklama: 'Balgam artırıcı ve müsilaj etkili.' },
      { isim: 'Gece yarısı çayları (ıhlamur)', aciklama: 'Aşırı terlemeye neden olabilir.' },
    ],
    baharatlar: ['Kimyon', 'Muskat', 'Zerdeçal', 'Nane', 'Karabiber (az)'],
  },
  {
    mizac: 'Balgamî',
    mizacId: 'balgami',
    sembol: '💧',
    renk: '#4a9eda',
    renkAcik: '#eef6fc',
    nitelik: 'Soğuk & Nemli',
    ozet: 'Balgamî mizaç için ısıtıcı ve kurutucu bitkiler önerilir. Soğutucular ve nem artırıcılardan kaçınılmalıdır.',
    oneriliBitkiler: [
      { isim: 'Zencefil', aciklama: 'Güçlü ısıtıcı. Balgamı eritir, sindirimi hızlandırır.' },
      { isim: 'Tarçın', aciklama: 'Kuru ve sıcak. Balgam hıltının fazla nemini kurutur.' },
      { isim: 'Karabiber', aciklama: 'Ateşli ve keskin. Metabolizmayı hızlandırır.' },
      { isim: 'Zerdeçal', aciklama: 'İltihap önler, karaciğeri güçlendirir.' },
      { isim: "Çörekotu (Kara'nın Tohumu)", aciklama: 'Hz. Peygamber\'in önerdiği bitki. Bağışıklık güçlendirir.' },
      { isim: 'Defne yaprağı', aciklama: 'Isıtıcı, sindirimi düzenler.' },
    ],
    kacinilacakBitkiler: [
      { isim: 'Papatya', aciklama: 'Soğutucudur. Balgamî için balgamı artırabilir.' },
      { isim: 'Hatmi', aciklama: 'Balgam oluşumunu artırır.' },
      { isim: 'Soğuk nane çayı', aciklama: 'Soğutucu etkisiyle balgamı kötüleştirir.' },
    ],
    baharatlar: ['Çörekotu', 'Zencefil', 'Karanfil', 'Tarçın', 'Çemen otu'],
  },
  {
    mizac: 'Sevdavî',
    mizacId: 'sevdavi',
    sembol: '🌍',
    renk: '#7b5ea7',
    renkAcik: '#f3f0f8',
    nitelik: 'Soğuk & Kuru',
    ozet: 'Sevdavî mizaç için ısıtıcı, nemlendirici ve ruh hali iyileştirici bitkiler önerilir. Soğuk-kuru bitkilerden kaçınılmalıdır.',
    oneriliBitkiler: [
      { isim: 'Gül', aciklama: 'Kalp ve ruh için. Melankoli ve kaygıyı azaltır.' },
      { isim: 'Safran', aciklama: 'Ruh halini yükseltir, antidepresif etki. İbn-i Sina\'nın önerisi.' },
      { isim: 'Lavanta', aciklama: 'Kaygıyı azaltır, uykuyu düzenler.' },
      { isim: 'Limon otu (Melisa)', aciklama: 'Sinir sistemi rahatlatıcı, vesvesede faydalı.' },
      { isim: 'Bergamot', aciklama: 'Koku terapisi. Melankoli için güçlü.' },
      { isim: 'Papatya', aciklama: 'Uyku düzeni ve kaygı için.' },
    ],
    kacinilacakBitkiler: [
      { isim: 'Adaçayı (fazla)', aciklama: 'Kurutucu etkisi sevdayı yoğunlaştırır.' },
      { isim: 'Mersin', aciklama: 'Astrenjan ve kurutucu.' },
      { isim: 'Acı baharatlar', aciklama: 'Sinir sistemini aşırı uyarır, kaygıyı artırır.' },
    ],
    baharatlar: ['Safran', 'Rezene', 'Anason', 'Kakule', 'Dereotu'],
  },
];

const genelBitkiler = [
  {
    isim: 'Çörekotu (Nigella sativa)',
    aciklama: 'Hz. Peygamber: "Çörekotu ölümden başka her derde devadır." Tüm mizaçlar için koruyucu.',
    icon: '🌿',
  },
  {
    isim: 'Gül Suyu',
    aciklama: 'Kalp, beyin ve ruh için. Tüm hıltları dengeler, özellikle safra ve sevda.',
    icon: '🌹',
  },
  {
    isim: 'Bal',
    aciklama: 'Kur\'an\'ın şifalı saydığı besin. Soğuk mizaçlara (balgam, sevda) özellikle faydalı.',
    icon: '🍯',
  },
  {
    isim: 'Zeytinyağı',
    aciklama: 'İbn-i Sina\'nın temel ilacı. Sindirim, cilt ve bağışıklık için tüm mizaçlara.',
    icon: '🫒',
  },
];

export default function BitkilerPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Şifalı Bitkiler ve Mizaç · Her Mizaç İçin Bitki Rehberi',
    description: 'Safravî, Demevî, Balgamî ve Sevdavî mizaçlar için önerilen ve kaçınılacak şifalı bitkiler.',
    inLanguage: 'tr',
    author: { '@type': 'Organization', name: 'Mizaç', url: 'https://mizac.xyz' },
  };

  return (
    <main className="min-h-screen px-4 py-16" style={{ background: 'var(--background)' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <div className="max-w-3xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm opacity-50 mb-8">
          <Link href="/" className="hover:opacity-100">Ana Sayfa</Link>
          <span>/</span>
          <span>Şifalı Bitkiler</span>
        </div>

        {/* Hero */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">🌿</div>
          <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>
            Şifalı Bitkiler & Mizaç
          </h1>
          <p className="text-lg opacity-70 max-w-xl mx-auto leading-relaxed">
            İbn-i Sina geleneğinde her mizacın kendine özgü bitkisel dostu ve düşmanı vardır. Hangi bitki seni dengeler, hangi bitki dengesini bozar?
          </p>
        </div>

        {/* Navigation */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {mizacBitkiler.map((m) => (
            <a
              key={m.mizacId}
              href={`#${m.mizacId}`}
              className="flex items-center gap-1.5 text-sm px-4 py-2 rounded-full font-semibold transition-all hover:scale-105"
              style={{ background: m.renkAcik, color: m.renk, border: `1.5px solid ${m.renk}30` }}
            >
              {m.sembol} {m.mizac}
            </a>
          ))}
        </div>

        {/* Universal plants */}
        <div
          className="rounded-2xl p-6 mb-12"
          style={{ background: 'linear-gradient(135deg, #fef9f0, #fff8ee)', border: '1.5px solid var(--gold-light)' }}
        >
          <h2 className="font-bold text-lg mb-4" style={{ color: 'var(--earth)' }}>
            ✦ Tüm Mizaçlar İçin Şifalı
          </h2>
          <p className="text-sm opacity-70 mb-5">İslam tıbbında her mizaca şifa veren evrensel bitkiler:</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {genelBitkiler.map((b) => (
              <div
                key={b.isim}
                className="flex gap-3 p-4 rounded-xl"
                style={{ background: 'white' }}
              >
                <div className="text-2xl">{b.icon}</div>
                <div>
                  <p className="font-bold text-sm" style={{ color: 'var(--foreground)' }}>{b.isim}</p>
                  <p className="text-xs opacity-65 leading-relaxed mt-0.5">{b.aciklama}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Per-temperament sections */}
        <div className="space-y-12">
          {mizacBitkiler.map((m) => (
            <section key={m.mizacId} id={m.mizacId}>
              {/* Header */}
              <div
                className="rounded-2xl p-6 mb-4"
                style={{ background: m.renkAcik, border: `1.5px solid ${m.renk}25` }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-4xl">{m.sembol}</span>
                  <div>
                    <h2 className="text-xl font-bold" style={{ color: m.renk }}>{m.mizac} Mizacı</h2>
                    <p className="text-xs opacity-60">{m.nitelik}</p>
                  </div>
                </div>
                <p className="text-sm opacity-75 leading-relaxed">{m.ozet}</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                {/* Önerilen */}
                <div
                  className="rounded-2xl p-5"
                  style={{ background: 'var(--card)', border: `1px solid ${m.renk}20` }}
                >
                  <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
                    <span style={{ color: m.renk }}>✦</span>
                    Önerilen Bitkiler
                  </h3>
                  <ul className="space-y-3">
                    {m.oneriliBitkiler.map((b) => (
                      <li key={b.isim}>
                        <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{b.isim}</p>
                        <p className="text-xs opacity-60 leading-relaxed">{b.aciklama}</p>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Kaçınılacak */}
                <div
                  className="rounded-2xl p-5"
                  style={{ background: 'var(--card)', border: '1px solid #f0e0e0' }}
                >
                  <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
                    <span className="opacity-50">◦</span>
                    Kaçınılacak Bitkiler
                  </h3>
                  <ul className="space-y-3 mb-6">
                    {m.kacinilacakBitkiler.map((b) => (
                      <li key={b.isim}>
                        <p className="font-semibold text-sm text-red-700 opacity-80">{b.isim}</p>
                        <p className="text-xs opacity-60 leading-relaxed">{b.aciklama}</p>
                      </li>
                    ))}
                  </ul>
                  <div>
                    <h3 className="font-bold text-sm mb-2 opacity-70">Önerilen Baharatlar</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {m.baharatlar.map((b) => (
                        <span
                          key={b}
                          className="text-xs px-2 py-1 rounded-full"
                          style={{ background: m.renkAcik, color: m.renk }}
                        >
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-3">
                <Link
                  href={`/mizaclar/${m.mizacId}`}
                  className="text-sm font-semibold opacity-60 hover:opacity-100 transition-opacity"
                  style={{ color: m.renk }}
                >
                  → {m.mizac} Profili için tüm bilgiler
                </Link>
              </div>
            </section>
          ))}
        </div>

        {/* Note */}
        <div
          className="rounded-2xl p-5 mt-12 text-sm opacity-70 leading-relaxed"
          style={{ background: 'var(--cream)', border: '1px solid var(--gold-light)' }}
        >
          <p className="font-semibold mb-1" style={{ color: 'var(--earth)' }}>⚠️ Önemli Not</p>
          <p>
            Bu bilgiler İbn-i Sina geleneğine dayanan genel rehberliktir. Herhangi bir sağlık sorunu için hekim tavsiyesi alınmalıdır. Bitkisel ürünler ilaçlarla etkileşime girebilir.
          </p>
        </div>

        {/* CTA */}
        <div
          className="rounded-2xl p-8 text-center mt-8"
          style={{ background: 'linear-gradient(180deg, #0f0a04 0%, #1a1207 100%)' }}
        >
          <p className="text-lg font-semibold mb-2" style={{ color: '#c8b87a' }}>
            Hangi bitkiler sana uygun?
          </p>
          <p className="text-sm opacity-60 mb-6" style={{ color: '#c8b87a' }}>
            Önce mizacını öğren, sonra doğru bitkiyi seç.
          </p>
          <Link
            href="/test"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full text-white font-bold transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #8b5e1e, #c4973a)' }}
          >
            ✦ Mizaç Testini Yap
          </Link>
        </div>
      </div>
    </main>
  );
}
