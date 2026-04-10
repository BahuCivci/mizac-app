import Link from 'next/link';

const mizacMuzik = [
  {
    mizac: 'Safravî',
    mizacId: 'safravi',
    sembol: '🔥',
    renk: '#e8832a',
    renkAcik: '#fef6ed',
    nitelik: 'Sıcak & Kuru',
    ozet: 'Safravî kişiler için müzik, öfke ve aşırı enerjiyi boşaltmak için güçlü bir araçtır. Ağır tempolu, derinlikli müzikler safrânın ateşini söndürür.',
    sifaMuzik: [
      { tip: 'Makam', deger: 'Uşşak, Rast', aciklama: 'Serinletici ve sakinleştirici etki. Öfkeyi diner.' },
      { tip: 'Ritim', deger: 'Yavaş, ağır', aciklama: 'Hızlı ritimler safrânın ateşini körükler. Yavaş tempo sakinleştirir.' },
      { tip: 'Enstrüman', deger: 'Ud, ney', aciklama: 'Derin ve topraklayıcı ses. Sinir sistemini sakinleştirir.' },
      { tip: 'Vakit', deger: 'Akşam saatleri', aciklama: 'Günün enerjisini boşalttıktan sonra dinginleşme müziği.' },
    ],
    kacinilanlar: [
      'Davul ve darbuka — ateşi artırır',
      'Hızlı ve çıkık sesler — aşırı uyarılmışlık',
      'Gürültülü kalabalık ortamlar',
    ],
    ibniSina: 'İbn-i Sina "Safravî kişinin müziği serinletici ve ağır olmalı; öfkesi olgunlaştıkça makamı derinleşmeli" der.',
  },
  {
    mizac: 'Demevî',
    mizacId: 'demevi',
    sembol: '💨',
    renk: '#e05a7a',
    renkAcik: '#fdf0f3',
    nitelik: 'Sıcak & Nemli',
    ozet: 'Demevî kişiler müzikle en kolay bağlantı kuran mizaçtır. Canlı, ritmik ve neşeli müzikler enerjilerini besler; sakinleştirici müzikler dengeyi sağlar.',
    sifaMuzik: [
      { tip: 'Makam', deger: 'Segah, Hicaz', aciklama: 'Duygusal zenginlik ve sevgi teması. Demevî\'nin ruh dünyasını besler.' },
      { tip: 'Ritim', deger: 'Orta tempo, ritmik', aciklama: 'Dans ettirici ama aşırıya kaçmayan ritimler.' },
      { tip: 'Enstrüman', deger: 'Keman, kanun', aciklama: 'Tiz ve sıcak ses. Demevî\'nin sosyal enerjisiyle rezonans yaratır.' },
      { tip: 'Vakit', deger: 'Sabah ve akşam', aciklama: 'Güne başlangıç ve gün sonu dinginleşme.' },
    ],
    kacinilanlar: [
      'Çok ağır ve melankolik müzikler — enerjisini düşürür',
      'Monoton ve tekrarlayan müzikler — sıkıyor',
      'Müziksiz ortam — demevî için stresli',
    ],
    ibniSina: 'İbn-i Sina demevî kişilerin müzikle en iyi iyileştiğini ve müziğin onlar için bir zorunluluk olduğunu belirtir.',
  },
  {
    mizac: 'Balgamî',
    mizacId: 'balgami',
    sembol: '💧',
    renk: '#4a9eda',
    renkAcik: '#eef6fc',
    nitelik: 'Soğuk & Nemli',
    ozet: 'Balgamî kişiler için müzik uyandırıcı ve harekete geçirici işlev görmelidir. Isıtıcı ve ritmik müzikler balgam hıltını eritir, tembelliği kırar.',
    sifaMuzik: [
      { tip: 'Makam', deger: 'Hicaz, Nihavend', aciklama: 'Uyandırıcı ve biraz hüzünlü makamlar — balgamiyi yerinden oynatır.' },
      { tip: 'Ritim', deger: 'Orta-hızlı, canlı', aciklama: 'Yavaş ritimler balgamı artırır. Canlı tempo harekete geçirir.' },
      { tip: 'Enstrüman', deger: 'Darbuka, zurna, boru', aciklama: 'Isıtıcı ve uyandırıcı enstrümanlar. Metabolizmayı hızlandırır.' },
      { tip: 'Vakit', deger: 'Sabah ve öğle', aciklama: 'Günün yavaş başlayan balgamîsini uyandırmak için.' },
    ],
    kacinilanlar: [
      'Çok yavaş ve hüzünlü müzikler — balgamı artırır',
      'Uyku müzikleri gündüz dinlenmek — uyuturlar',
      'Sessiz ortam çalışma — motivasyonu düşürür',
    ],
    ibniSina: 'İbn-i Sina balgamî hastaları tedavisinde canlı ve ısıtıcı ritimler kullandığını, bunun balgamın erimesini hızlandırdığını yazar.',
  },
  {
    mizac: 'Sevdavî',
    mizacId: 'sevdavi',
    sembol: '🌍',
    renk: '#7b5ea7',
    renkAcik: '#f3f0f8',
    nitelik: 'Soğuk & Kuru',
    ozet: 'İbn-i Sina sevdavî kişiler için müziği en güçlü ilaç olarak tanımlar. Vesvese, melankoli ve kaygı için müzik birincil tedavidir. Isıtıcı ve neşelendirici makamlar şifadır.',
    sifaMuzik: [
      { tip: 'Makam', deger: 'Rast, Buselik', aciklama: 'Umut ve neşe veren makamlar. Melankoli karşıtı en güçlü etki.' },
      { tip: 'Ritim', deger: 'Orta tempo, düzenli', aciklama: 'Çok hızlı da çok yavaş da değil; sevdavîyi dengeleyici ritim.' },
      { tip: 'Enstrüman', deger: 'Ney, ud, kopuz', aciklama: 'Ruhsal ve derinlikli ses. Sevdavî\'nin iç dünyasıyla rezonans.' },
      { tip: 'Vakit', deger: 'Akşam ve sabah', aciklama: 'Geceye girmeden önce ve güne başlarken ruh hali düzenleyici.' },
    ],
    kacinilanlar: [
      'Çok melankolik ve ağlamaklı müzikler — sevdayı artırır',
      'Gürültülü ve kaotik sesler — kaygıyı tetikler',
      'Müziksiz ve sessiz uzun süreler — vesvese döngüsü güçlenir',
    ],
    ibniSina: '"Müzik sevda için en büyük ilaçtır. Makam seçimi hastalığın seyrini doğrudan etkiler." — İbn-i Sina, el-Kânûn fi\'t-Tıbb',
  },
];

const makamSifa = [
  { makam: 'Rast', etki: 'Neşe ve umut', hilt: 'Sevda karşıtı', renk: '#4a9eda' },
  { makam: 'Uşşak', etki: 'Sakinlik', hilt: 'Safra dengeleyici', renk: '#e8832a' },
  { makam: 'Hicaz', etki: 'Özlem ve yükseklik', hilt: 'Balgam uyandırıcı', renk: '#7b5ea7' },
  { makam: 'Segah', etki: 'Sevgi ve bağlılık', hilt: 'Kan dengeleyici', renk: '#e05a7a' },
  { makam: 'Nihavend', etki: 'Huzur ve karar', hilt: 'Sevda ve balgam', renk: '#6b8e5e' },
  { makam: 'Buselik', etki: 'Güç ve cesaret', hilt: 'Sevda ve safra', renk: '#c4973a' },
];

const ibniSinaHakkinda = `İbn-i Sina (980-1037), müziği tıbbın ayrılmaz bir parçası olarak görüyordu. el-Kânûn fi't-Tıbb'da ve el-Şifâ'da müziğin hıltlar üzerindeki etkisini ayrıntılı biçimde inceler. Ona göre müzik yalnızca estetik bir zevk değil, nefsi ve bedeni etkileyen fizyolojik bir araçtır. Doğru makamla yapılan müzik, ilaç gibi hılt dengesini yeniden kurabilir.`;

export default function MuzikMizacPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Müzik & Mizaç · İbn-i Sina\'da Müzik Terapisi',
    description: 'Her mizaç için şifa veren makam ve ritim.',
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
          <span>Müzik & Mizaç</span>
        </div>

        {/* Hero */}
        <div
          className="rounded-2xl p-8 mb-10 text-center"
          style={{ background: 'linear-gradient(135deg, #fef9f0, #fff8ee)', border: '1.5px solid var(--gold-light)' }}
        >
          <div className="text-6xl mb-4">🎵</div>
          <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>
            Müzik & Mizaç
          </h1>
          <p className="text-lg opacity-70 max-w-xl mx-auto leading-relaxed">
            İbn-i Sina&#39;ya göre müzik, doğru makam ve ritimde kullanıldığında hılt dengesini yeniden kurabilen bir ilaçtır.
          </p>
        </div>

        {/* Ibn Sina note */}
        <div
          className="rounded-2xl p-5 mb-10 text-sm leading-relaxed opacity-80 italic border-l-4"
          style={{ background: 'var(--cream)', borderColor: 'var(--gold)' }}
        >
          {ibniSinaHakkinda}
        </div>

        {/* Makam table */}
        <h2 className="text-2xl font-bold mb-5" style={{ color: 'var(--foreground)' }}>
          Şifalı Makamlar
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-12">
          {makamSifa.map((m) => (
            <div
              key={m.makam}
              className="rounded-2xl p-4"
              style={{ background: 'var(--card)', border: `1.5px solid ${m.renk}25` }}
            >
              <p className="font-bold text-base mb-1" style={{ color: m.renk }}>{m.makam}</p>
              <p className="text-sm opacity-80 mb-0.5">{m.etki}</p>
              <p className="text-xs opacity-50">{m.hilt}</p>
            </div>
          ))}
        </div>

        {/* Per temperament */}
        <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--foreground)' }}>
          Mizaca Göre Müzik Reçetesi
        </h2>
        <div className="space-y-8 mb-12">
          {mizacMuzik.map((m) => (
            <div
              key={m.mizacId}
              className="rounded-2xl overflow-hidden"
              style={{ border: `1.5px solid ${m.renk}25` }}
            >
              <div className="p-5" style={{ background: m.renkAcik }}>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-4xl">{m.sembol}</span>
                  <div>
                    <h3 className="text-xl font-bold" style={{ color: m.renk }}>{m.mizac} Mizacı</h3>
                    <p className="text-xs opacity-60">{m.nitelik}</p>
                  </div>
                </div>
                <p className="text-sm opacity-75 leading-relaxed">{m.ozet}</p>
              </div>

              <div className="p-5" style={{ background: 'var(--card)' }}>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <h4 className="text-xs font-bold opacity-50 mb-3">MÜZİK REÇETESİ</h4>
                    <div className="space-y-3">
                      {m.sifaMuzik.map((s) => (
                        <div key={s.tip}>
                          <div className="flex items-center gap-2">
                            <span
                              className="text-xs px-2 py-0.5 rounded-full font-semibold"
                              style={{ background: `${m.renk}20`, color: m.renk }}
                            >
                              {s.tip}
                            </span>
                            <span className="text-sm font-medium">{s.deger}</span>
                          </div>
                          <p className="text-xs opacity-60 mt-0.5 pl-1">{s.aciklama}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold opacity-50 mb-3">KAÇINILACAKLAR</h4>
                    <ul className="space-y-1.5 mb-4">
                      {m.kacinilanlar.map((k) => (
                        <li key={k} className="flex items-start gap-2 text-sm opacity-75">
                          <span className="opacity-40 mt-0.5">◦</span>
                          {k}
                        </li>
                      ))}
                    </ul>
                    <div
                      className="text-xs italic opacity-60 border-l-2 pl-3 leading-relaxed"
                      style={{ borderColor: m.renk }}
                    >
                      {m.ibniSina}
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <Link
                    href={`/mizaclar/${m.mizacId}`}
                    className="text-sm font-semibold opacity-60 hover:opacity-100 transition-opacity"
                    style={{ color: m.renk }}
                  >
                    → {m.mizac} profilini incele
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Practical tips */}
        <div
          className="rounded-2xl p-6 mb-8"
          style={{ background: 'linear-gradient(135deg, #fef9f0, #fff8ee)', border: '1.5px solid var(--gold-light)' }}
        >
          <h2 className="font-bold text-lg mb-4" style={{ color: 'var(--earth)' }}>
            ✦ Müzik Terapisi Nasıl Uygulanır?
          </h2>
          <ul className="space-y-2">
            {[
              'Günde 20-30 dakika bilinçli müzik dinlemek hılt dengesini etkiler.',
              'Sabah uyandırıcı ritimler, akşam sakinleştirici makamlar tercih edin.',
              'Kulaklık yerine hoparlör — sesin bedene doğrudan teması önemlidir.',
              'Hz. Peygamber sesi güzel olan kişinin Kur\'an okuması için şifa olduğunu söylemiştir.',
              'Ağlatan müzik bazen şifadır — sevdayı boşaltır. Ağlamaktan çekinmeyin.',
              'Ney sesi en derin hılt dengeleyici enstrüman olarak İbn-i Sina tarafından öne çıkarılır.',
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
          className="rounded-2xl p-8 text-center"
          style={{ background: 'linear-gradient(180deg, #0f0a04 0%, #1a1207 100%)' }}
        >
          <p className="text-lg font-semibold mb-2" style={{ color: '#c8b87a' }}>
            Hangi müzik seni dengeler?
          </p>
          <p className="text-sm opacity-60 mb-6" style={{ color: '#c8b87a' }}>
            Mizacını öğren, doğru müziği seç.
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
