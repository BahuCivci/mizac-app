import Link from 'next/link';

const mevsimler = [
  {
    mevsim: 'İlkbahar',
    icon: '🌸',
    hilt: 'Kan Hıltı',
    mizac: 'Demevî',
    mizacId: 'demevi',
    renk: '#e05a7a',
    renkAcik: '#fdf0f3',
    nitelik: 'Sıcak & Nemli',
    aylar: 'Mart · Nisan · Mayıs',
    aciklama: 'İlkbaharda doğa canlanır, kan hıltı yükselir. Enerjinin arttığı, sosyalliğin canlandığı, yeni başlangıçların güçlendiği mevsim. Vücudun kış balgamından arındığı dönem.',
    saglik: [
      'Kan hıltı yükseldiği için dolaşım hızlanır — kalp ve damarlar dikkat ister',
      'Alerjik tepkiler artar: nem ve çiçek tozu kan hıltını uyarır',
      'Aşırı uyarılmışlık, huzursuzluk ve uykusuzluk görülebilir',
      'Safravî kişiler ilkbaharda en ateşli hallerindedir — dikkat!',
    ],
    beslenme: [
      'Soğutucu ve serinletici besinler: nar, salatalık, yoğurt',
      'Taze yeşillikler: bağırsak sağlığı için önemli',
      'Az tuz: kan basıncı artışına karşı',
      'Karahindiba ve hindiba: doğal kan temizleyici',
    ],
    tavsiye: 'İlkbaharda vücudu yenilemek için hafif detoks yapılabilir. Sabah erken kalkış ve açık hava yürüyüşü kan hıltını dengeler. Aşırı neşeden ve dürtüsellikten kaçının.',
    mizacEtkisi: 'Demevî kişiler ilkbaharda çiçek açar — en enerjik, en sosyal, en yaratıcı hallerindedir. Safravî için tehlikeli dönem; öfke ve çatışma eğilimi artar. Balgamî ilkbaharda doğal olarak canlanır.',
    sunnTavsiye: 'Hz. Peygamber ilkbaharı bedenin yenilenmesi için önemli bulmuş; çörekotu ve bal kullanımını bu dönemde de önermiştir.',
  },
  {
    mevsim: 'Yaz',
    icon: '☀️',
    hilt: 'Safra Hıltı',
    mizac: 'Safravî',
    mizacId: 'safravi',
    renk: '#e8832a',
    renkAcik: '#fef6ed',
    nitelik: 'Sıcak & Kuru',
    aylar: 'Haziran · Temmuz · Ağustos',
    aciklama: 'Yazın güneş doruktadır, safra hıltı zirveye çıkar. Sindirim güçlenir, zihin keskinleşir. Ancak aşırı ısı tüm mizaçlarda dengesizliğe yol açar.',
    saglik: [
      'Safra hıltı artar: sindirim güçlenir ama aşırı ısı öfkeyi tetikler',
      'Güneş çarpması ve dehidrasyon en büyük risk',
      'Cilt problemleri, döküntüler ve yanmalar sıklaşır',
      'Sinir sistemi aşırı uyarılabilir: baş ağrısı ve migren artar',
    ],
    beslenme: [
      'Serinletici meyveler: karpuz, kavun, şeftali',
      'Soğuk su ama buz yeme — mide şoku yapar',
      'Nane, gül suyu, limonlu su',
      'Ağır ve yağlı yemeklerden kaçının',
    ],
    tavsiye: 'Yazın öğle saatlerinde güneşten korunun. Soğuk banyo ve abdest safra hıltını dengeler. Öfkeli anların zirvesi bu mevsimdir — Hz. Peygamber "Öfkelendiğinde otur, oturuyorsan uzan" buyurmuştur.',
    mizacEtkisi: 'Safravî kişiler yazda en güçlü ama en dengesiz hallerindedir. Balgamî yazı sever; kış balgamından arınır, canlanır. Sevdavî yaz sıcağından hoşlanmaz — kurutucu etki sevdayı artırır.',
    sunnTavsiye: 'Hacamat yazın ortasında (Hicrî takvim 17, 19 veya 21. günü) yapılması Hz. Peygamber tarafından özellikle tavsiye edilmiştir — safra hıltını temizlemek için ideal.',
  },
  {
    mevsim: 'Sonbahar',
    icon: '🍂',
    hilt: 'Sevda Hıltı',
    mizac: 'Sevdavî',
    mizacId: 'sevdavi',
    renk: '#7b5ea7',
    renkAcik: '#f3f0f8',
    nitelik: 'Soğuk & Kuru',
    aylar: 'Eylül · Ekim · Kasım',
    aciklama: 'Sonbaharda hava soğur ve kurur, sevda hıltı yoğunlaşır. Düşünceler derinleşir, içe dönüş başlar. Bu mevsim kaygı ve melankoliye en yatkın dönemdir.',
    saglik: [
      'Sevda hıltı artar: kaygı, uykusuzluk ve melankoli riski yükselir',
      'Bağışıklık düşmeye başlar — ilk soğuk algınlıkları',
      'Eklem ve kemik ağrıları belirginleşebilir',
      'Depresif döngüler ve vesvese bu mevsimde zirveye çıkabilir',
    ],
    beslenme: [
      'Isıtıcı ve nemlendirici besinler: bal, çorba, komposto',
      'Üzüm, incir, nar — sonbaharın doğal şifası',
      'Safran: ruh hali yükseltici, doğal antidepresif',
      'Soğuk ve ekşi besinlerden kaçının',
    ],
    tavsiye: 'Sonbaharda güneş ışığına maruz kalmak çok önemlidir — D vitamini sevdayı dengeler. Toplulukta vakit geçirin, yalnız kalmayın. Güzel koku ve müzik bu mevsimde en güçlü şifalardır.',
    mizacEtkisi: 'Sevdavî kişiler sonbaharda en derin ve en kaygılı hallerindedir — dikkat ve öz-bakım gerektirir. Safravî için dinlenme dönemi: ateş soğur. Demevî neşesini kaybetmeye başlar; sosyal bağlara tutunmak önemlidir.',
    sunnTavsiye: 'İbn-i Sina sonbaharı "hastalığa en açık mevsim" olarak tanımlar ve beden hazırlığı için kış öncesi detoks önerir. Güzel koku ve müzik sevda hıltına karşı birincil tedavidir.',
  },
  {
    mevsim: 'Kış',
    icon: '❄️',
    hilt: 'Balgam Hıltı',
    mizac: 'Balgamî',
    mizacId: 'balgami',
    renk: '#4a9eda',
    renkAcik: '#eef6fc',
    nitelik: 'Soğuk & Nemli',
    aylar: 'Aralık · Ocak · Şubat',
    aciklama: 'Kışta balgam hıltı hakimdir. Doğa dinlenir, beden yavaşlar, uyku artar. Bu mevsim onarım, sabır ve iç dünyaya dönüş zamanıdır.',
    saglik: [
      'Balgam hıltı artar: soğuk algınlığı, grip, sinüzit ve öksürük',
      'Metabolizma yavaşlar, kilo alma eğilimi artar',
      'Uyku ihtiyacı artar — bu doğaldır, baskı yapmayın',
      'Eklem tutulmaları ve sertlik belirginleşir',
    ],
    beslenme: [
      'Isıtıcı baharatlar: zencefil, tarçın, karabiber',
      'Sıcak çorbalar ve taze et: balgamı eritir',
      'Bal ve çörekotu: bağışıklık için temel',
      'Soğuk ve nemli gıdalardan uzak durun',
    ],
    tavsiye: 'Kışın ısıtıcı kıyafetler ve sıcak ortam önceliklidir. Sabah erken kalkış balgam birikimini engeller. Egzersiz azalmadan sürdürün — balgamî tembelleme tuzağına dikkat.',
    mizacEtkisi: 'Balgamî kişiler kışta doğal alanlarındadır — ama aşırı hareketsizlik tehlikeli. Demevî bu mevsimde en durgun dönemine girer; ışık terapisi faydalı. Sevdavî kışın kaygısı çözer — destek önemli.',
    sunnTavsiye: 'Hz. Peygamber kış aylarında oruçtan sevdayı arındırmayı, sıcak suyla yüz yıkamayı ve zeytinyağı kullanmayı tavsiye etmiştir.',
  },
];

const mevsimDogasi = [
  {
    baslik: 'Mevsimsel Hılt Döngüsü',
    metin: 'İbn-i Sina\'ya göre dört mevsim dört hıltın yıllık döngüsüdür. Yaz sonu safranın zirvesidir; sonbahar sevdanın başlangıcı; kış balgamın hâkimiyeti; ilkbahar kanın yenilenmesidir.',
    icon: '🔄',
  },
  {
    baslik: 'Mizacınız ve Mevsim',
    metin: 'Baskın mizacınız hangi hılt ise, o hıltın mevsiminde en güçlü ama aynı zamanda en dengesiz olursunuz. Karşı nitelikteki mevsimde ise en sakin halinizdedir.',
    icon: '⚖️',
  },
  {
    baslik: 'Geçiş Dönemleri',
    metin: 'Mevsim geçişleri — özellikle sonbahar başı ve ilkbahar — hastalıklara en açık anlardır. İbn-i Sina bu dönemlerde beslenme değişikliği ve detoks önerir.',
    icon: '🌀',
  },
];

export default function MevsimMizacPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Mevsimler & Mizaç · Her Mevsim Bir Hılt',
    description: 'İbn-i Sina\'ya göre mevsimler ve hılt döngüsü.',
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
          <span>Mevsim & Mizaç</span>
        </div>

        {/* Hero */}
        <div
          className="rounded-2xl p-8 mb-10 text-center"
          style={{ background: 'linear-gradient(135deg, #fef9f0, #fff8ee)', border: '1.5px solid var(--gold-light)' }}
        >
          <div className="text-6xl mb-4">🌿</div>
          <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>
            Mevsimler & Mizaç
          </h1>
          <p className="text-lg opacity-70 max-w-xl mx-auto leading-relaxed">
            İbn-i Sina&#39;ya göre yılın dört mevsimi dört hıltın döngüsüdür. Her mevsimde bir hılt yükselir, bir mizaç güçlenir.
          </p>
          <div className="flex justify-center gap-3 mt-5 flex-wrap">
            {mevsimler.map((m) => (
              <a
                key={m.mevsim}
                href={`#${m.mevsim.toLowerCase()}`}
                className="flex items-center gap-1.5 text-sm px-4 py-2 rounded-full font-semibold transition-all hover:scale-105"
                style={{ background: m.renkAcik, color: m.renk, border: `1.5px solid ${m.renk}30` }}
              >
                {m.icon} {m.mevsim}
              </a>
            ))}
          </div>
        </div>

        {/* Theory */}
        <div className="grid sm:grid-cols-3 gap-4 mb-12">
          {mevsimDogasi.map((d) => (
            <div
              key={d.baslik}
              className="rounded-2xl p-5"
              style={{ background: 'var(--card)', border: '1px solid var(--gold-light)' }}
            >
              <div className="text-2xl mb-2">{d.icon}</div>
              <h3 className="font-bold text-sm mb-2" style={{ color: 'var(--earth)' }}>{d.baslik}</h3>
              <p className="text-xs opacity-70 leading-relaxed">{d.metin}</p>
            </div>
          ))}
        </div>

        {/* Seasons */}
        <div className="space-y-10">
          {mevsimler.map((m) => (
            <section
              key={m.mevsim}
              id={m.mevsim.toLowerCase()}
              className="rounded-2xl overflow-hidden"
              style={{ border: `1.5px solid ${m.renk}25` }}
            >
              {/* Header */}
              <div className="p-6" style={{ background: m.renkAcik }}>
                <div className="flex items-start gap-4">
                  <div className="text-5xl">{m.icon}</div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h2 className="text-2xl font-bold" style={{ color: m.renk }}>{m.mevsim}</h2>
                      <span
                        className="text-xs px-2 py-1 rounded-full font-semibold"
                        style={{ background: m.renk, color: 'white' }}
                      >
                        {m.hilt}
                      </span>
                      <span className="text-xs opacity-50">{m.nitelik}</span>
                    </div>
                    <p className="text-xs opacity-50 mb-2">{m.aylar}</p>
                    <p className="text-sm opacity-75 leading-relaxed">{m.aciklama}</p>
                  </div>
                </div>
              </div>

              <div className="p-6 grid sm:grid-cols-2 gap-6" style={{ background: 'var(--card)' }}>
                {/* Health */}
                <div>
                  <h3 className="text-xs font-bold opacity-50 mb-3">SAĞLIK DİKKATLERİ</h3>
                  <ul className="space-y-1.5">
                    {m.saglik.map((s) => (
                      <li key={s} className="flex items-start gap-2 text-sm opacity-80">
                        <span style={{ color: m.renk }} className="mt-0.5">✦</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Nutrition */}
                <div>
                  <h3 className="text-xs font-bold opacity-50 mb-3">BESLENME</h3>
                  <ul className="space-y-1.5">
                    {m.beslenme.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-sm opacity-80">
                        <span style={{ color: m.renk }} className="mt-0.5">✦</span>
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Mizac etkisi */}
                <div
                  className="sm:col-span-2 rounded-xl p-4 text-sm leading-relaxed"
                  style={{ background: m.renkAcik }}
                >
                  <p className="font-semibold mb-1" style={{ color: m.renk }}>Mizaç Etkisi</p>
                  <p className="opacity-80">{m.mizacEtkisi}</p>
                </div>

                {/* Tavsiye */}
                <div className="sm:col-span-2">
                  <p className="text-sm opacity-70 leading-relaxed mb-2">{m.tavsiye}</p>
                  <p className="text-xs italic opacity-50 border-l-2 pl-3" style={{ borderColor: m.renk }}>
                    {m.sunnTavsiye}
                  </p>
                </div>

                {/* Mizac link */}
                <div className="sm:col-span-2">
                  <Link
                    href={`/mizaclar/${m.mizacId}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full text-white transition-all hover:scale-105"
                    style={{ background: m.renk }}
                  >
                    {m.icon} {m.mizac} Profili →
                  </Link>
                </div>
              </div>
            </section>
          ))}
        </div>

        {/* Seasonal tips summary */}
        <div
          className="rounded-2xl p-6 mt-12"
          style={{ background: 'linear-gradient(135deg, #fef9f0, #fff8ee)', border: '1.5px solid var(--gold-light)' }}
        >
          <h2 className="font-bold text-lg mb-4" style={{ color: 'var(--earth)' }}>
            ✦ Her Mevsim İçin Genel Kural
          </h2>
          <ul className="space-y-2">
            {[
              'Mevsime karşı değil, mevsimle birlikte yaşa — dört element aynı anda hem içinde hem dışında.',
              'Soğuk mevsimde ısıtıcı, sıcak mevsimde serinletici beslen.',
              'Mevsim geçişlerinde 1 hafta daha az et, daha çok sebze ve ılık su.',
              'Her mevsimde o mevsimin hakim hıltına karşı denge besinleri kullan.',
              'Baskın mizacınızın mevsiminde en dikkatli olun — hılt üst üste gelir.',
            ].map((tip) => (
              <li key={tip} className="flex items-start gap-2 text-sm opacity-80">
                <span style={{ color: 'var(--gold)' }}>✦</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <div
          className="rounded-2xl p-8 text-center mt-8"
          style={{ background: 'linear-gradient(180deg, #0f0a04 0%, #1a1207 100%)' }}
        >
          <p className="text-lg font-semibold mb-2" style={{ color: '#c8b87a' }}>
            Hangi mevsimde en güçlü hissediyorsun?
          </p>
          <p className="text-sm opacity-60 mb-6" style={{ color: '#c8b87a' }}>
            Mizacını öğren, mevsimsel döngünü dengele.
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
