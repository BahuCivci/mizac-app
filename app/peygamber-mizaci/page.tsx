import Link from 'next/link';

const ozellikler = [
  {
    baslik: 'Fiziksel Denge',
    icon: '⚖️',
    maddeler: [
      'Ne çok uzun ne çok kısa — orta boylu, dengeli yapı',
      'Geniş omuzlar, güçlü beden — Demevî ve Safravî dengeyi işaret eder',
      'Parlak, güler yüzlü — sıcak hıltların işareti',
      'Hızlı adım atar, dağa iner gibi yürür — enerji ve kararlılık',
      'Terlediğinde güzel koku — safî mizacın alameti',
    ],
  },
  {
    baslik: 'Ahlaki Denge',
    icon: '🌹',
    maddeler: [
      'Öfkelendiğinde hemen kontrol ederdi — mizaç hakimiyeti',
      'Gülümserdi ama kahkaha atmazdı — ölçülü neşe',
      'Yumuşak konuşur, net ve kısa söylerdi — balgamî istikrar',
      'Çok uyumaz, çok da uykusuz kalmazdı — ritim dengesi',
      'İhtiyaç olmadıkça az yerdi — mideden dörtte biri hava',
    ],
  },
  {
    baslik: 'Beslenmesi',
    icon: '🍯',
    maddeler: [
      'Bal — "Bal şifadır" (Kur\'an, Nahl 69)',
      'Çörekotu — "Ölümden başka her derde devadır"',
      'Zeytinyağı — "Bereket kaynağı"',
      'Taze hurma ve su ile iftar açardı',
      'Üzüm, incir, nar — meyvelerden tercih ederdi',
      'Et yerdi ancak aşırıya kaçmazdı',
    ],
  },
  {
    baslik: 'Sağlık Alışkanlıkları',
    icon: '🌙',
    maddeler: [
      'Hacamat (kan aldırma) yaptırırdı — hılt dengeleme',
      'Pek çok kez oruç tutardı — mide dinlendirme',
      'Seferde bile misvak kullanırdı — hijyen',
      'Sabah namazından sonra biraz uyumazdı — Kayle uykusu öğlede',
      'Kızgın güneşte uyumazdı — sevda hıltı birikmesine karşı',
    ],
  },
];

const alimlerin_gorusleri = [
  {
    alim: 'İbn-i Sina',
    eser: 'el-Kânûn fi\'t-Tıbb',
    yorum: 'Dengeli mizaç (mutedil mizaç), hastalığa en az yatkın olan yapıdır. Hz. Peygamber\'in fiziksel ve ahlaki dengesinin tariflerine bakıldığında sıcak-nemli ağırlıklı dengeli bir mizaç tablosu çıkmaktadır.',
  },
  {
    alim: 'İbn Kayyım el-Cevziyye',
    eser: 'et-Tıbbu\'n-Nebevî',
    yorum: 'Nebevî tıp üç temele dayanır: bedenin korunması, hastalığın giderilmesi ve zararlı olanın uzaklaştırılması. Bu ilkelerin tamamı mizaç dengesini koruma amacı taşır.',
  },
  {
    alim: 'Davûd el-Antâkî',
    eser: 'Tezkire',
    yorum: 'Peygamberlerin mizacı, Allah\'ın onlara bahşettiği fıtri denge sebebiyle en mükemmel haldedir. Bu denge ruh, beden ve ahlakta aynı anda tezahür eder.',
  },
];

const nebevi_receteler = [
  {
    baslik: 'Çörekotu Karışımı',
    icerik: 'Çörekotu + bal (eşit miktar). Sabah aç karna bir kaşık.',
    fayda: 'Bağışıklık, balgam eritme, enerji.',
    mizac: 'Özellikle balgamî ve sevdavî için',
    renk: '#7b5ea7',
  },
  {
    baslik: 'Bal Suyu',
    icerik: 'Bir bardak ılık suya bir kaşık ham bal. Sabah aç karna.',
    fayda: 'Sindirim, enerji, sevinç.',
    mizac: 'Balgamî ve sevdavî için ideal',
    renk: '#e8832a',
  },
  {
    baslik: 'Zeytinyağı',
    icerik: 'Taze sızma zeytinyağı, hem içeride hem dışarıda.',
    fayda: 'Cilt, beyin, kalp, bağışıklık.',
    mizac: 'Tüm mizaçlar için',
    renk: '#4a9eda',
  },
  {
    baslik: 'Hacamat Takvimi',
    icerik: 'Ay takvimine göre 17, 19 veya 21. günde.',
    fayda: 'Kan hıltı temizleme, ağrı giderme.',
    mizac: 'Özellikle demevî ve safravî için',
    renk: '#e05a7a',
  },
];

export default function PeygamberMizaciPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Hz. Peygamber\'in Mizacı · İslam Tıbbında Nebevî Denge',
    description: 'İslam âlimlerine ve İbn-i Sina geleneğine göre Hz. Muhammed\'in mizacı.',
    inLanguage: 'tr',
    author: { '@type': 'Organization', name: 'Mizaç', url: 'https://mizac.xyz' },
    about: { '@type': 'Person', name: 'Hz. Muhammed' },
  };

  return (
    <main className="min-h-screen px-4 py-16" style={{ background: 'var(--background)' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <div className="max-w-3xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm opacity-50 mb-8">
          <Link href="/" className="hover:opacity-100">Ana Sayfa</Link>
          <span>/</span>
          <span>Hz. Peygamber&#39;in Mizacı</span>
        </div>

        {/* Hero */}
        <div
          className="rounded-2xl p-8 mb-10 text-center"
          style={{ background: 'linear-gradient(135deg, #fef9f0, #fff8ee)', border: '1.5px solid var(--gold-light)' }}
        >
          <div className="text-6xl mb-4">🌙</div>
          <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>
            Hz. Peygamber&#39;in Mizacı
          </h1>
          <p className="text-lg opacity-70 max-w-xl mx-auto leading-relaxed">
            İslam âlimleri ve İbn-i Sina geleneğine göre Hz. Muhammed&#39;in (s.a.v.) mizacı, bedeni ve ruhundaki ilahi denge.
          </p>
          <div
            className="inline-block mt-4 px-4 py-2 rounded-full text-sm font-semibold"
            style={{ background: 'var(--gold-light)', color: 'var(--earth)' }}
          >
            Mutedil (Dengeli) Mizaç
          </div>
        </div>

        {/* Intro */}
        <div className="mb-10 space-y-4">
          <p className="opacity-80 leading-relaxed">
            İslam tıbbı geleneğinde peygamberlerin mizacı, insanlığın en dengeli örneği olarak kabul edilir. İbn-i Sina&#39;ya göre <strong>mutedil mizaç</strong> — dört hıltın en dengeli hali — sağlığın, güzelliğin ve üstün ahlakın temelidir.
          </p>
          <p className="opacity-80 leading-relaxed">
            Siyer kaynakları, Hz. Peygamber&#39;in fiziksel ve ahlaki özelliklerini aktarırken farkında olmadan bir mizaç portresi çizer: <strong>sıcak-nemli ağırlıklı dengeli yapı</strong>, yani Demevî-Safravî dengesinde, balgamî istikrar ve sevdavî derinlikle harmanlanmış bir bütünlük.
          </p>
        </div>

        {/* Characteristics */}
        <div className="grid sm:grid-cols-2 gap-5 mb-12">
          {ozellikler.map((oz) => (
            <div
              key={oz.baslik}
              className="rounded-2xl p-5"
              style={{ background: 'var(--card)', border: '1px solid var(--gold-light)' }}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{oz.icon}</span>
                <h2 className="font-bold" style={{ color: 'var(--earth)' }}>{oz.baslik}</h2>
              </div>
              <ul className="space-y-2">
                {oz.maddeler.map((m) => (
                  <li key={m} className="flex items-start gap-2 text-sm opacity-80">
                    <span className="mt-0.5" style={{ color: 'var(--gold)' }}>✦</span>
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Nebevi tarifler */}
        <h2 className="text-2xl font-bold mb-5" style={{ color: 'var(--foreground)' }}>Nebevî Tarifler</h2>
        <div className="grid sm:grid-cols-2 gap-4 mb-12">
          {nebevi_receteler.map((r) => (
            <div
              key={r.baslik}
              className="rounded-2xl p-5"
              style={{ background: 'var(--card)', border: `1.5px solid ${r.renk}25` }}
            >
              <h3 className="font-bold mb-2" style={{ color: r.renk }}>{r.baslik}</h3>
              <p className="text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>{r.icerik}</p>
              <p className="text-xs opacity-60 mb-1">{r.fayda}</p>
              <p className="text-xs italic opacity-50">{r.mizac}</p>
            </div>
          ))}
        </div>

        {/* Scholars' views */}
        <h2 className="text-2xl font-bold mb-5" style={{ color: 'var(--foreground)' }}>Âlimlerin Görüşleri</h2>
        <div className="space-y-4 mb-12">
          {alimlerin_gorusleri.map((a) => (
            <div
              key={a.alim}
              className="rounded-2xl p-5"
              style={{ background: 'linear-gradient(135deg, #fef9f0, #fff8ee)', border: '1px solid var(--gold-light)' }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="text-xs px-2 py-1 rounded-full font-semibold"
                  style={{ background: 'var(--gold-light)', color: 'var(--earth)' }}
                >
                  {a.alim}
                </div>
                <span className="text-xs opacity-40 italic">{a.eser}</span>
              </div>
              <p className="text-sm opacity-80 leading-relaxed">{a.yorum}</p>
            </div>
          ))}
        </div>

        {/* Connection to test */}
        <div
          className="rounded-2xl p-6 mb-8"
          style={{ background: 'var(--card)', border: '1.5px solid var(--gold-light)' }}
        >
          <h2 className="font-bold mb-3" style={{ color: 'var(--earth)' }}>
            Senin Mizacın Hangi Nebevî Özelliği Taşıyor?
          </h2>
          <p className="text-sm opacity-70 leading-relaxed mb-4">
            Hz. Peygamber&#39;in dengeli mizacı her tipe bir model sunar: Safravî&#39;ye kararlılık, Demevî&#39;ye sevgi, Balgamî&#39;ye sabır, Sevdavî&#39;ye derinlik. Kendi mizacındaki potansiyeli keşfet.
          </p>
          <div className="flex flex-wrap gap-2">
            {['safravi', 'demevi', 'balgami', 'sevdavi'].map((tip) => (
              <Link
                key={tip}
                href={`/mizaclar/${tip}`}
                className="text-sm px-3 py-1.5 rounded-full font-medium transition-all hover:scale-105"
                style={{ background: 'var(--cream)', color: 'var(--earth)', border: '1px solid var(--gold-light)' }}
              >
                {tip.charAt(0).toUpperCase() + tip.slice(1)} →
              </Link>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div
          className="rounded-2xl p-8 text-center"
          style={{ background: 'linear-gradient(180deg, #0f0a04 0%, #1a1207 100%)' }}
        >
          <p className="text-lg font-semibold mb-2" style={{ color: '#c8b87a' }}>
            Senin mizacın nedir?
          </p>
          <p className="text-sm opacity-60 mb-6" style={{ color: '#c8b87a' }}>
            Hz. Peygamber&#39;in dengeli yolunda, kendi mizacını tanıyarak başla.
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
