import Link from 'next/link';

const organlar = [
  {
    organ: 'Kalp',
    arapca: 'Kalb (قلب)',
    icon: '❤️',
    renk: '#e05a7a',
    renkAcik: '#fdf0f3',
    hilt: 'Kan',
    mizac: 'Demevî',
    duygular: ['Sevgi', 'Sevinç', 'Merhamet', 'Nefret', 'Kıskançlık'],
    pozitifDuygu: 'Sevgi & Merhamet',
    negatifDuygu: 'Nefret & Kıskançlık',
    islamiYorum: 'Kur\'an\'da "Kalpler ancak Allah\'ın zikriyle tatmin olur" (Ra\'d 28). İslam geleneğinde kalp hem biyolojik organ hem de ruhun merkezi, iradenin kalesidir.',
    ibniSina: 'İbn-i Sina kalbi "hayatın kaynağı" olarak tanımlar. Kanın pompası olduğu kadar ruhun da evidir. Aşk ve nefret kalbi doğrudan etkiler ve hılt dengesini bozabilir.',
    denge: 'Kalbi dengede tutmak için: sevgi pratikleri, şükran, zikir, kalpten gelen bir işle meşguliyet. Nefret ve kıskançlıktan kaçınmak kalp hıltını temiz tutar.',
    fizikselBelirtiSi: ['Çarpıntı', 'Göğüs sıkışması', 'Baş ağrısı', 'Yorgunluk'],
  },
  {
    organ: 'Karaciğer',
    arapca: 'Kabd (كبد)',
    icon: '🟤',
    renk: '#8b5e1e',
    renkAcik: '#fdf5eb',
    hilt: 'Safra',
    mizac: 'Safravî',
    duygular: ['Öfke', 'Kararlılık', 'Cesaret', 'Hırs', 'Kızgınlık'],
    pozitifDuygu: 'Cesaret & Kararlılık',
    negatifDuygu: 'Öfke & Hırs',
    islamiYorum: 'Hadis-i şeriflerde "Öfkelenme" tavsiyesi karaciğer korumasıyla ilişkilendirilir. "İçinizde kızgınlık hissettiğinizde abdest alın" — soğuk su karaciğeri serinletir.',
    ibniSina: 'İbn-i Sina\'ya göre karaciğer safrayı üretir, kanı temizler ve "hayat ateşini" besler. Öfke safrayı bozar; dengesiz safra ise öfkeyi artırır — kısır bir döngü.',
    denge: 'Öfkeyi yönetmek, ekşi-soğutucu besinler (nar, limon, yoğurt), soğuk abdest ve affetme pratiği karaciğeri dengeler.',
    fizikselBelirtiSi: ['Sağ üst karın ağrısı', 'Sarılık', 'Sindirim sorunları', 'Baş ağrısı'],
  },
  {
    organ: 'Dalak',
    arapca: 'Tıhâl (طحال)',
    icon: '🟣',
    renk: '#7b5ea7',
    renkAcik: '#f3f0f8',
    hilt: 'Sevda',
    mizac: 'Sevdavî',
    duygular: ['Hüzün', 'Melankoli', 'Nostalji', 'Derin düşünce', 'Kaygı'],
    pozitifDuygu: 'Derin Düşünce & Sezgi',
    negatifDuygu: 'Hüzün & Kaygı',
    islamiYorum: 'İslam tıbbında dalak, sevda hıltının deposudur. "Hüzün imandan gelen bir kapıdır" anlayışı Sevdavî derinliğe işaret eder. Ağlamanın kalbi temizlediği hadislerde belirtilir.',
    ibniSina: 'Dalak sevdayı karaciğerden alır ve filtreler. Fazla sevda vücutta birikirse melankoli, kaygı, vesvese ve korku ortaya çıkar. Müzik, güzel koku ve arkadaşlık dalağı rahatlatır.',
    denge: 'Güzel koku (buhur), hafif egzersiz, sıcak ortam, neşeli arkadaşlık ve ılık-tatlı besinler sevda hıltını dengeler. Yalnızlık ve gece uyuşukluğundan kaçının.',
    fizikselBelirtiSi: ['Sol üst karın ağrısı', 'Yorgunluk', 'Düşük bağışıklık', 'Cilt problemleri'],
  },
  {
    organ: 'Akciğer',
    arapca: 'Ria (رئة)',
    icon: '💙',
    renk: '#4a9eda',
    renkAcik: '#eef6fc',
    hilt: 'Balgam',
    mizac: 'Balgamî',
    duygular: ['Keder', 'Üzüntü', 'Özgürlük özlemi', 'Sakinlik', 'Teslimiyet'],
    pozitifDuygu: 'Sakinlik & Teslimiyet',
    negatifDuygu: 'Keder & Kapanma',
    islamiYorum: '"Nefes" hem ruhsal hem bedensel olarak İslam\'da merkezi bir kavramdır. "Her nefes tesbih" anlayışı akciğerlerin kutsiyetini gösterir. Ağlamak ve derin iç çekmek akciğerleri boşaltır.',
    ibniSina: 'Akciğerler balgam hıltı ve "hayvanî ruh"la bağlantılıdır. Nefes ritmi duygu durumunu doğrudan etkiler; balgam fazlalığı donukluk, yavaşlama ve özgürlük yitimini getirir.',
    denge: 'Derin nefes egzersizi, açık hava, isıtıcı baharatlar (zencefil, tarçın) ve hareket akciğer balgamını temizler. Kapalı, nemli ortamlardan uzak durun.',
    fizikselBelirtiSi: ['Nefes darlığı', 'Sürekli öksürük', 'Göğüs ağırlığı', 'Sinüzit'],
  },
  {
    organ: 'Beyin',
    arapca: 'Dimağ (دماغ)',
    icon: '🧠',
    renk: '#6b8e5e',
    renkAcik: '#f0f5ee',
    hilt: 'Balgam / Kan',
    mizac: 'Balgamî & Demevî',
    duygular: ['Korku', 'Endişe', 'Merak', 'Aklî haz', 'Şüphe'],
    pozitifDuygu: 'Merak & Aklî Haz',
    negatifDuygu: 'Korku & Şüphe',
    islamiYorum: '"Aklını kullanmıyor musunuz?" sorusu Kur\'an\'da defalarca geçer. İslam\'da akıl, ruhun beyin aracılığıyla bedenle teması olarak yorumlanır.',
    ibniSina: 'İbn-i Sina beynin üç bölümünü tanımlar: ön (hayal), orta (akıl), arka (bellek). Her bölge farklı hıltla beslenir. Balgam fazlalığı hafıza zayıflığı, korku ve uyuşukluk getirir.',
    denge: 'Beyin için: uyku düzeni, zeytinyağı, balık, ceviz, buhur kokusu ve derin düşünce (tefekkür). Aşırı uyarılmışlık ve gürültüden koruyun.',
    fizikselBelirtiSi: ['Baş ağrısı', 'Hafıza sorunları', 'Konsantrasyon güçlüğü', 'Uyku bozukluğu'],
  },
  {
    organ: 'Mide',
    arapca: 'Mide (معدة)',
    icon: '🟡',
    renk: '#c4973a',
    renkAcik: '#fef9f0',
    hilt: 'Kan & Safra',
    mizac: 'Demevî & Safravî',
    duygular: ['Kaygı', 'Heyecan', 'İştahsızlık', 'Doyum', 'Rahatsızlık'],
    pozitifDuygu: 'Doyum & Rahatlama',
    negatifDuygu: 'Kaygı & Gerginlik',
    islamiYorum: '"Mideden dörtte birini yemek, dörtte birini su, dörtte birini nefes için bırak" Hz. Peygamber\'in öğüdüdür. Mide İslam tıbbında hastalıkların kaynağı olarak görülür.',
    ibniSina: 'İbn-i Sina\'nın en önemli ilkelerinden: "Her dert mide ile başlar." Sindirim hızı ve kalitesi, tüm hıltların üretimine etki eder. Keder iştahı, öfke sindirimi bozar.',
    denge: 'Mide için: az ve sık yemek, sıcak su, zencefil, nane çayı. Kaygı anında yememek; sakin ve şükranla yemek önerilir.',
    fizikselBelirtiSi: ['Mide yanması', 'Şişkinlik', 'Bulantı', 'Hazımsızlık'],
  },
];

const genelPratipler = [
  { metin: 'Her organın bir duygusu vardır — bedeni dinlemek ruhsal bilgeliktir.', icon: '👁️' },
  { metin: 'Tekrar eden fiziksel şikayetler, işlenmemiş duyguların işareti olabilir.', icon: '🔄' },
  { metin: 'İbn-i Sina\'ya göre en iyi ilaç; doğru beslenme, doğru hareket ve doğru düşüncedir.', icon: '⚕️' },
  { metin: 'Duygusal denge olmadan fiziksel denge geçici kalır.', icon: '⚖️' },
];

export default function OrganDuyguPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Organ & Duygu Haritası · İslam Tıbbında Beden-Ruh Bağlantısı',
    description: 'İbn-i Sina\'ya göre organ-duygu haritası.',
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
          <span>Organ & Duygu</span>
        </div>

        {/* Hero */}
        <div
          className="rounded-2xl p-8 mb-10 text-center"
          style={{ background: 'linear-gradient(135deg, #fef9f0, #fff8ee)', border: '1.5px solid var(--gold-light)' }}
        >
          <div className="text-6xl mb-4">🫀</div>
          <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>
            Organ & Duygu Haritası
          </h1>
          <p className="text-lg opacity-70 max-w-xl mx-auto leading-relaxed">
            İslam tıbbında beden ve ruh ayrı değildir. Her organın bir duygusu, her duygunun bir organı vardır. İbn-i Sina&#39;nın haritası.
          </p>
        </div>

        {/* General insights */}
        <div className="grid grid-cols-2 gap-3 mb-12">
          {genelPratipler.map((g) => (
            <div
              key={g.metin}
              className="rounded-2xl p-4 flex items-start gap-3"
              style={{ background: 'var(--card)', border: '1px solid var(--gold-light)' }}
            >
              <span className="text-xl">{g.icon}</span>
              <p className="text-xs opacity-75 leading-relaxed">{g.metin}</p>
            </div>
          ))}
        </div>

        {/* Organ map */}
        <div className="space-y-8 mb-12">
          {organlar.map((o) => (
            <div
              key={o.organ}
              className="rounded-2xl overflow-hidden"
              style={{ border: `1.5px solid ${o.renk}25` }}
            >
              {/* Header */}
              <div className="p-5 flex items-start gap-4" style={{ background: o.renkAcik }}>
                <div className="text-4xl">{o.icon}</div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h2 className="text-xl font-bold" style={{ color: o.renk }}>{o.organ}</h2>
                    <span className="text-xs opacity-50 font-arabic">{o.arapca}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <span
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{ background: `${o.renk}20`, color: o.renk }}
                    >
                      {o.hilt} Hıltı
                    </span>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{ background: `${o.renk}15`, color: o.renk }}
                    >
                      {o.mizac}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-5" style={{ background: 'var(--card)' }}>
                <div className="grid sm:grid-cols-2 gap-5">
                  {/* Emotions */}
                  <div>
                    <h3 className="text-xs font-bold opacity-50 mb-3">DUYGULAR</h3>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {o.duygular.map((d) => (
                        <span
                          key={d}
                          className="text-xs px-2 py-1 rounded-full"
                          style={{ background: o.renkAcik, color: o.renk }}
                        >
                          {d}
                        </span>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div
                        className="rounded-xl p-3 text-center"
                        style={{ background: `${o.renk}10` }}
                      >
                        <p className="text-xs opacity-50 mb-0.5">Olumlu</p>
                        <p className="text-xs font-bold" style={{ color: o.renk }}>{o.pozitifDuygu}</p>
                      </div>
                      <div
                        className="rounded-xl p-3 text-center"
                        style={{ background: '#ff000008' }}
                      >
                        <p className="text-xs opacity-50 mb-0.5">Olumsuz</p>
                        <p className="text-xs font-bold text-red-700 opacity-70">{o.negatifDuygu}</p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <h4 className="text-xs font-bold opacity-50 mb-2">FİZİKSEL BELİRTİLER</h4>
                      <div className="flex flex-wrap gap-1">
                        {o.fizikselBelirtiSi.map((b) => (
                          <span key={b} className="text-xs px-2 py-0.5 rounded-full opacity-60" style={{ background: 'var(--cream)' }}>{b}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Knowledge */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xs font-bold opacity-50 mb-2">İBN-İ SİNA</h4>
                      <p className="text-xs opacity-75 leading-relaxed">{o.ibniSina}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold opacity-50 mb-2">İSLAMÎ YORUM</h4>
                      <p className="text-xs opacity-75 leading-relaxed">{o.islamiYorum}</p>
                    </div>
                    <div
                      className="rounded-xl p-3 text-xs leading-relaxed"
                      style={{ background: o.renkAcik }}
                    >
                      <span className="font-bold" style={{ color: o.renk }}>Denge: </span>
                      <span className="opacity-75">{o.denge}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mizac connections */}
        <div
          className="rounded-2xl p-6 mb-8"
          style={{ background: 'var(--card)', border: '1.5px solid var(--gold-light)' }}
        >
          <h2 className="font-bold mb-4" style={{ color: 'var(--earth)' }}>Hangi Organ Sende Öne Çıkıyor?</h2>
          <p className="text-sm opacity-70 mb-4">Mizacın, baskın organını ve bağlı olduğu duyguları belirler. Kendi profilinden devam et.</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'safravi', isim: 'Safravî', sembol: '🔥', organ: 'Karaciğer' },
              { id: 'demevi', isim: 'Demevî', sembol: '💨', organ: 'Kalp' },
              { id: 'balgami', isim: 'Balgamî', sembol: '💧', organ: 'Akciğer & Beyin' },
              { id: 'sevdavi', isim: 'Sevdavî', sembol: '🌍', organ: 'Dalak' },
            ].map((m) => (
              <Link
                key={m.id}
                href={`/mizaclar/${m.id}`}
                className="p-3 rounded-xl text-sm transition-all hover:scale-[1.02]"
                style={{ background: 'var(--cream)', border: '1px solid var(--gold-light)' }}
              >
                <p className="font-bold" style={{ color: 'var(--foreground)' }}>{m.sembol} {m.isim}</p>
                <p className="text-xs opacity-50">{m.organ}</p>
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
            Bedenini okumak için mizacını bil
          </p>
          <p className="text-sm opacity-60 mb-6" style={{ color: '#c8b87a' }}>
            Organ-duygu haritanda nerede duruyorsun?
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
