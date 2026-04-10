import Link from 'next/link';

const vakitler = [
  {
    vakit: 'Sabah Namazı',
    arapca: 'Fecr / Sabah',
    saat: '~05:00 – 07:00',
    hilt: 'Kan (Demevî)',
    element: 'Hava',
    sembol: '🌅',
    renk: '#e05a7a',
    renkAcik: '#fdf0f3',
    hiltDurumu: 'Kan hıltı gece boyunca dinlenmiş, sabahın serinliğinde taze ve aktiftir.',
    mizacEtkisi: 'Sabah namazı, kan dolaşımını uyandırır. Demevî yapılı kişiler bu vakitte doğal enerjilerini hisseder. Diğer mizaçlar için sabah namazı kan hıltını canlandıran bir ritüeldir.',
    tavsiye: 'Namazdan sonra biraz hareket edin. Soğuk su veya nar suyu için. Kalkışı zorlanıyorsanız erken yatmayı deneyin.',
    sunn: 'Hz. Peygamber sabah namazından sonra güneş doğana kadar yerinde oturur, ardından günlük işlerine başlardı.',
    renkHex: '#e05a7a',
  },
  {
    vakit: 'Öğle Namazı',
    arapca: 'Zuhr',
    saat: '~12:00 – 13:30',
    hilt: 'Safra (Safravî)',
    element: 'Ateş',
    sembol: '☀️',
    renk: '#e8832a',
    renkAcik: '#fef6ed',
    hiltDurumu: 'Güneşin zirvesinde safra hıltı en aktif haldedir. Sindirim sistemi çalışır, zihin keskinleşir.',
    mizacEtkisi: 'Öğle namazı, yoğun çalışma döneminin ortasında bir sıfırlamadır. Safravî kişiler için öfke ve stres boşaltma vaktidir; diğer mizaçlar için de zihinsel duraksamayı sağlar.',
    tavsiye: 'Öğle yemeği namazdan sonra hafif olsun. Kısa Kayle (öğle) uykusu sünnettir — 20 dakika idealdir. Sıcak havada soğutucu besin tercih edin.',
    sunn: 'Hz. Peygamber öğle namazından sonra kısa uyku (Kayle) tavsiye etmiş ve kendisi de uygulamıştır.',
    renkHex: '#e8832a',
  },
  {
    vakit: 'İkindi Namazı',
    arapca: 'Asr',
    saat: '~15:30 – 17:30',
    hilt: 'Geçiş — Safra → Balgam',
    element: 'Geçiş',
    sembol: '🌤️',
    renk: '#6b8e5e',
    renkAcik: '#f0f5ee',
    hiltDurumu: 'Günün enerjisi yavaş yavaş düşer. Safra hıltı azalır, beden dinginleşmeye başlar. Bu geçiş anı özeldir.',
    mizacEtkisi: 'Kur\'an\'ın yemin ettiği "Asr vakti" — zamanın kıymetinin hatırlatıldığı an. Her mizaç için gün değerlendirme, öncelikleri gözden geçirme saatidir.',
    tavsiye: 'Hafif bir yürüyüş faydalıdır. Ağır yemeklerden kaçının. Balgamî mizaçlar bu saatte uyuyakalabilir — dikkat.',
    sunn: 'Hz. Peygamber ikindi vakti özellikle kıymetli sayar, bu namazı kaçırmamak için uyarırdı.',
    renkHex: '#6b8e5e',
  },
  {
    vakit: 'Akşam Namazı',
    arapca: 'Mağrib',
    saat: '~Günbatımı',
    hilt: 'Sevda (Sevdavî)',
    element: 'Toprak',
    sembol: '🌆',
    renk: '#7b5ea7',
    renkAcik: '#f3f0f8',
    hiltDurumu: 'Güneş batarken sevda hıltı yükselmeye başlar. Düşünceler derinleşir, iç ses güçlenir.',
    mizacEtkisi: 'Akşam namazı, günün muhasebesinin yapıldığı vakittir. Sevdavî kişiler bu saatte meditasyon ve derin düşünce için güçlü bir zemin bulur. Diğerleri için nefsle hesaplaşma zamanıdır.',
    tavsiye: 'Akşam yemeği hafif ve sıcak olsun. Gül suyu veya lavanta içeren çay içilebilir. Sosyal bağları pekiştirme vaktidir.',
    sunn: 'Hz. Peygamber akşam yemeğini namazdan önce yemez; önce namaz, ardından aile sofrasına otururdu.',
    renkHex: '#7b5ea7',
  },
  {
    vakit: 'Yatsı Namazı',
    arapca: 'İşa',
    saat: '~Yatsı',
    hilt: 'Balgam (Balgamî)',
    element: 'Su',
    sembol: '🌙',
    renk: '#4a9eda',
    renkAcik: '#eef6fc',
    hiltDurumu: 'Gece derinleştikçe balgam hıltı hakimiyeti artar. Beden onarım moduna geçer, zihin sakinleşir.',
    mizacEtkisi: 'Yatsı namazı bedeni uyku için hazırlar. Balgamî kişiler bu vakitte en sakin hallerindedir. Diğerleri için geceyi geç tutmak balgam birikimini artırır — erken uyumak sünnete uygundur.',
    tavsiye: 'Yatsıdan sonra gereksiz konuşmaktan kaçınmak sünnettir. Ağır egzersiz, parlak ekranlar ve gıda tüketimi bedeni uyarır; kaçının.',
    sunn: '"Yatsıdan önce uyumak ve yatsıdan sonra boş sohbet etmek hoş değildir." (Hz. Peygamber)',
    renkHex: '#4a9eda',
  },
];

const genel = [
  {
    baslik: 'Namaz Ritmi Biyolojik Saati Düzenler',
    metin: 'Modern kronobiyoloji, sirkadiyen ritmin sağlık için kritik olduğunu ortaya koymuştur. Beş vakit namazın zamanlaması — fecrin ilk ışığıyla başlayıp gece biterken — biyolojik saati gün ışığıyla senkronize eder.',
  },
  {
    baslik: 'Her Rekat Bir Nefes Egzersizi',
    metin: 'Kıyam, rükü ve secde; solunum kaslarını, omurgayı ve kan dolaşımını çalıştırır. İbn-i Sina\'ya göre düzenli beden hareketleri hılt dengesini korur. Namaz, İslam\'ın beden-ruh egzersizi olarak da tanımlanabilir.',
  },
  {
    baslik: 'Abdest Hılt Dengeleyicidir',
    metin: 'Soğuk su ile alınan abdest, safra hıltını serinletir; el-yüz yıkama sinir sistemi üzerinde yatıştırıcı etki yapar. Hz. Peygamber öfkelendiğinde abdest almayı tavsiye etmiştir — bu doğrudan hılt yönetimidir.',
  },
];

export default function NamazMizacPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Namaz Vakitleri & Mizaç · Her Vakit Bir Hılt',
    description: 'Beş vakit namazın hılt teorisiyle ilişkisi.',
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
          <span>Namaz & Mizaç</span>
        </div>

        {/* Hero */}
        <div
          className="rounded-2xl p-8 mb-10 text-center"
          style={{ background: 'linear-gradient(135deg, #fef9f0, #fff8ee)', border: '1.5px solid var(--gold-light)' }}
        >
          <div className="text-6xl mb-4">🕌</div>
          <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>
            Namaz Vakitleri & Mizaç
          </h1>
          <p className="text-lg opacity-70 max-w-xl mx-auto leading-relaxed">
            İslam tıbbı geleneğinde beş vakit namaz yalnızca ibadet değil, hılt dengesini günlük olarak koruyan ilahi bir ritimdir.
          </p>
        </div>

        {/* Prayer times */}
        <div className="space-y-6 mb-14">
          {vakitler.map((v, i) => (
            <div
              key={v.vakit}
              className="rounded-2xl overflow-hidden"
              style={{ border: `1.5px solid ${v.renk}25` }}
            >
              <div
                className="p-5 flex items-start gap-4"
                style={{ background: v.renkAcik }}
              >
                <div className="text-4xl">{v.sembol}</div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h2 className="text-xl font-bold" style={{ color: v.renk }}>{v.vakit}</h2>
                    <span className="text-xs opacity-50">({v.arapca})</span>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{ background: `${v.renk}20`, color: v.renk }}
                    >
                      {v.saat}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-xs px-2 py-1 rounded-full font-semibold"
                      style={{ background: v.renk, color: 'white' }}
                    >
                      {v.hilt}
                    </span>
                    <span className="text-xs opacity-50">{v.element} · {i + 1}. Vakit</span>
                  </div>
                </div>
              </div>

              <div className="p-5 space-y-3" style={{ background: 'var(--card)' }}>
                <div>
                  <p className="text-xs font-semibold opacity-50 mb-1">HILT DURUMU</p>
                  <p className="text-sm opacity-80 leading-relaxed">{v.hiltDurumu}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold opacity-50 mb-1">MİZAÇ ETKİSİ</p>
                  <p className="text-sm opacity-80 leading-relaxed">{v.mizacEtkisi}</p>
                </div>
                <div
                  className="rounded-xl p-3 text-sm"
                  style={{ background: v.renkAcik }}
                >
                  <span className="font-semibold" style={{ color: v.renk }}>Tavsiye: </span>
                  <span className="opacity-75">{v.tavsiye}</span>
                </div>
                <div className="text-xs opacity-50 italic border-l-2 pl-3" style={{ borderColor: v.renk }}>
                  {v.sunn}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* General insights */}
        <h2 className="text-2xl font-bold mb-5" style={{ color: 'var(--foreground)' }}>
          Neden Namaz Mizaç Dengeler?
        </h2>
        <div className="space-y-4 mb-12">
          {genel.map((g) => (
            <div
              key={g.baslik}
              className="rounded-2xl p-5"
              style={{ background: 'var(--card)', border: '1px solid var(--gold-light)' }}
            >
              <h3 className="font-bold mb-2" style={{ color: 'var(--earth)' }}>{g.baslik}</h3>
              <p className="text-sm opacity-75 leading-relaxed">{g.metin}</p>
            </div>
          ))}
        </div>

        {/* Mizac links */}
        <div
          className="rounded-2xl p-6 mb-8"
          style={{ background: 'var(--card)', border: '1.5px solid var(--gold-light)' }}
        >
          <h2 className="font-bold mb-1" style={{ color: 'var(--earth)' }}>Mizacına Göre Namaz Ritmi</h2>
          <p className="text-sm opacity-60 mb-4">Her mizaç tipi namazı farklı yaşar. Kendi profilinde detaylarını gör.</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'safravi', isim: 'Safravî', sembol: '🔥', renk: '#e8832a' },
              { id: 'demevi', isim: 'Demevî', sembol: '💨', renk: '#e05a7a' },
              { id: 'balgami', isim: 'Balgamî', sembol: '💧', renk: '#4a9eda' },
              { id: 'sevdavi', isim: 'Sevdavî', sembol: '🌍', renk: '#7b5ea7' },
            ].map((m) => (
              <Link
                key={m.id}
                href={`/mizaclar/${m.id}`}
                className="flex items-center gap-2 p-3 rounded-xl text-sm font-medium transition-all hover:scale-[1.02]"
                style={{ background: 'var(--cream)', color: 'var(--foreground)', border: '1px solid var(--gold-light)' }}
              >
                <span>{m.sembol}</span>
                <span>{m.isim} →</span>
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
            Hangi namaz vakti sana en çok hitap ediyor?
          </p>
          <p className="text-sm opacity-60 mb-6" style={{ color: '#c8b87a' }}>
            Mizacını öğren, namazı daha derin yaşa.
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
