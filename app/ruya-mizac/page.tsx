import Link from 'next/link';

const mizacRuyalar = [
  {
    mizac: 'Safravî',
    mizacId: 'safravi',
    sembol: '🔥',
    renk: '#e8832a',
    renkAcik: '#fef6ed',
    ruyaTipi: 'Ateşli, Çatışmalı Rüyalar',
    aciklama: 'Safravî kişiler yoğun, renkli ve çoğunlukla çatışma dolu rüyalar görür. Safra hıltının ısısı, rüya dünyasını da ateşli kılar.',
    tipikRuyalar: [
      'Ateş, yangın, savaş sahneleri',
      'Yüksek yerlerde olma, uçma veya düşme',
      'Yarışma ve kazanma sahneleri',
      'Kızgın hayvanlarla karşılaşma (aslan, boğa)',
      'Güneş, çöl ve sıcak manzaralar',
      'Liderlik, hakimiyet kurma',
    ],
    yorumIpucu: 'Sık tekrar eden ateş rüyaları, bedenin fazla ısı taşıdığının işareti olabilir. Serinletici bitkiler (nane, gül suyu) deneyin.',
    uyku: 'Safravî kişiler geç uyur, erken kalkar. Uykuya dalmakta güçlük çekebilir. Serin ortam ve lavanta uykuya yardımcı olur.',
    sunn: 'Kötü rüya görüldüğünde sol tarafa tükürmek ve "Eûzü billâhi mineşşeytânirracîm" demek sünnettir.',
  },
  {
    mizac: 'Demevî',
    mizacId: 'demevi',
    sembol: '💨',
    renk: '#e05a7a',
    renkAcik: '#fdf0f3',
    ruyaTipi: 'Neşeli, Sosyal Rüyalar',
    aciklama: 'Demevî kişiler genellikle renkli, neşeli ve sosyal rüyalar görür. Kan hıltının enerjisi rüyalara da yansır.',
    tipikRuyalar: [
      'Şenlikler, kutlamalar, dans',
      'Sevilen kişilerle buluşmalar',
      'Uçma, özgürce koşma',
      'Renkli bahçeler, çiçekler',
      'Müzik ve sanat',
      'Aşk ve romantik sahneler',
    ],
    yorumIpucu: 'Demevî rüyaları genellikle olumludur. Kabus görüyorsanız, gün içindeki fazla uyarılmışlık veya geç saate kadar ekran bakma nedeni olabilir.',
    uyku: 'Demevî kişiler iyi uyur ama düzensiz saatlerde. Sabah zor kalkarlar. Düzenli uyku saati ve sabah namazı ritmi faydalıdır.',
    sunn: 'Hz. Peygamber güzel rüyayı Allah\'tan, kötü rüyayı şeytandan saymış; güzel rüyayı sevdiğine anlatmayı tavsiye etmiştir.',
  },
  {
    mizac: 'Balgamî',
    mizacId: 'balgami',
    sembol: '💧',
    renk: '#4a9eda',
    renkAcik: '#eef6fc',
    ruyaTipi: 'Sakin, Su ve Derinlik Rüyaları',
    aciklama: 'Balgamî kişiler sakin ve tekrar eden rüyalar görür. Su, deniz ve yavaş akan sahneler sıktır. Uzun ve derin uyurlar.',
    tipikRuyalar: [
      'Deniz, nehir, yağmur sahneleri',
      'Ağır adımlarla yürümek, zorla hareket etmek',
      'Kapalı ve güvenli mekanlar',
      'Aile ve ev ortamı',
      'Yavaş akan, mistik doğa sahneleri',
      'Derinlere dalma veya batma',
    ],
    yorumIpucu: 'Çok fazla uyku ve ağır rüyalar, balgam hıltının fazla olduğuna işaret edebilir. Sabah erken kalkış ve ısıtıcı baharatlar dengeyi sağlar.',
    uyku: 'Balgamî kişiler çok uyumaya eğilimlidir. Gerekenden fazla uyku balgamı artırır. 7-8 saat idealdir; öğle uykusu 20 dakikayla sınırlı tutulmalı.',
    sunn: 'Hz. Peygamber "sabah namazından sonra uyuma" tavsiyesi, balgam birikimini önlemeyle de açıklanmıştır.',
  },
  {
    mizac: 'Sevdavî',
    mizacId: 'sevdavi',
    sembol: '🌍',
    renk: '#7b5ea7',
    renkAcik: '#f3f0f8',
    ruyaTipi: 'Derin, Sembolik, Kaygılı Rüyalar',
    aciklama: 'Sevdavî kişiler en derin ve sembolik rüyaları görür. Kaygı, kayıp ve karanlık temalar yaygındır. Rüyaları uzun süre akıllarında kalır.',
    tipikRuyalar: [
      'Kayıp, ayrılık, vedalaşma',
      'Karanlık, labirent, koşamama',
      'Ölüm veya ölüme yakın sahneler',
      'Geçmiş veya nostaljik mekanlar',
      'Sembolik figürler ve gizemli kişiler',
      'Kaygı ve tehlike dolu peşinden koşma sahneleri',
    ],
    yorumIpucu: 'Tekrar eden kabus ve kaygılı rüyalar, sevda hıltının yoğunlaştığının işareti olabilir. Safran çayı, gül suyu ve gündüz güneş ışığına maruz kalmak yardımcı olur.',
    uyku: 'Sevdavî kişiler uykuya geç dalar, gece sık uyanabilir. Düzenli uyku ritmi ve yatmadan önce sıcak bir içecek çok faydalıdır.',
    sunn: 'İbn-i Sina: "Rüyayı değiştiren hıltı değiştirmektir." Uyku öncesi zihni sakinleştiren bitkisel çaylar tavsiye ederdi.',
  },
];

const ruyaTeorisİbn = [
  {
    tip: 'Gerçek Rüya (Rüya-yı Sadıka)',
    aciklama: 'Peygamber\'den veya evliadan gelen ilham. Açık, net, güzel hissettiren. İbn-i Sina\'ya göre bedeni dengeliyken ve ruh arındığında görülür.',
    icon: '✨',
  },
  {
    tip: 'Nefis Rüyası (Hülm)',
    aciklama: 'Gün içindeki düşünce, arzu ve korkulara dayalı. En yaygın rüya türü. Mizaca göre şekillenir.',
    icon: '🧠',
  },
  {
    tip: 'Hılt Rüyası',
    aciklama: 'Beden sıvılarının fazlalığından kaynaklanan rüyalar. Ateş-yangın safrayı, su-deniz balgamı, karanlık sevdayı, renk-şenlik kanı gösterir.',
    icon: '🫀',
  },
  {
    tip: 'Şeytanî Rüya',
    aciklama: 'Korku, kaygı ve kötü hisler bırakan rüyalar. Hz. Peygamber sol yanına tükürüp "Eûzü…" okumayı tavsiye etmiştir.',
    icon: '🌑',
  },
];

export default function RuyaMizacPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Rüya & Mizaç · Hılt Teorisinde Rüyaların Anlamı',
    description: 'Mizacınız rüyalarınızı nasıl şekillendirir?',
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
          <span>Rüya & Mizaç</span>
        </div>

        {/* Hero */}
        <div
          className="rounded-2xl p-8 mb-10 text-center"
          style={{ background: 'linear-gradient(135deg, #f3f0f8, #fef9f0)', border: '1.5px solid var(--gold-light)' }}
        >
          <div className="text-6xl mb-4">🌙</div>
          <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>
            Rüya & Mizaç
          </h1>
          <p className="text-lg opacity-70 max-w-xl mx-auto leading-relaxed">
            İbn-i Sina&#39;ya göre rüyalar rastlantısal değildir — bedenin hılt dengesini, ruhun halini ve günlük yaşamın izlerini taşır.
          </p>
        </div>

        {/* Ibn Sina dream theory */}
        <h2 className="text-2xl font-bold mb-5" style={{ color: 'var(--foreground)' }}>
          Rüya Teorisi: İbn-i Sina&#39;ya Göre
        </h2>
        <div className="grid sm:grid-cols-2 gap-4 mb-12">
          {ruyaTeorisİbn.map((r) => (
            <div
              key={r.tip}
              className="rounded-2xl p-5"
              style={{ background: 'var(--card)', border: '1px solid var(--gold-light)' }}
            >
              <div className="text-2xl mb-2">{r.icon}</div>
              <h3 className="font-bold text-sm mb-2" style={{ color: 'var(--earth)' }}>{r.tip}</h3>
              <p className="text-xs opacity-70 leading-relaxed">{r.aciklama}</p>
            </div>
          ))}
        </div>

        {/* Per-temperament sections */}
        <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--foreground)' }}>
          Mizaca Göre Rüya Örüntüleri
        </h2>
        <div className="space-y-8 mb-12">
          {mizacRuyalar.map((m) => (
            <div
              key={m.mizacId}
              className="rounded-2xl overflow-hidden"
              style={{ border: `1.5px solid ${m.renk}25` }}
            >
              {/* Header */}
              <div className="p-5" style={{ background: m.renkAcik }}>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-4xl">{m.sembol}</span>
                  <div>
                    <h3 className="text-xl font-bold" style={{ color: m.renk }}>{m.mizac} Mizacı</h3>
                    <p className="text-sm font-medium opacity-70">{m.ruyaTipi}</p>
                  </div>
                </div>
                <p className="text-sm opacity-75 leading-relaxed">{m.aciklama}</p>
              </div>

              <div className="p-5" style={{ background: 'var(--card)' }}>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <h4 className="text-xs font-bold opacity-50 mb-3">TİPİK RÜYALAR</h4>
                    <ul className="space-y-1.5">
                      {m.tipikRuyalar.map((r) => (
                        <li key={r} className="flex items-start gap-2 text-sm opacity-80">
                          <span style={{ color: m.renk }}>✦</span>
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xs font-bold opacity-50 mb-2">YORUM İPUCU</h4>
                      <p className="text-sm opacity-75 leading-relaxed">{m.yorumIpucu}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold opacity-50 mb-2">UYKU TARZI</h4>
                      <p className="text-sm opacity-75 leading-relaxed">{m.uyku}</p>
                    </div>
                    <div
                      className="text-xs italic opacity-60 border-l-2 pl-3 leading-relaxed"
                      style={{ borderColor: m.renk }}
                    >
                      {m.sunn}
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
            ✦ Rüya Kalitesini Artırmak İçin
          </h2>
          <ul className="space-y-2">
            {[
              'Yatmadan 1-2 saat önce yemek yemeyi bırakın',
              'Ekran ışığını azaltın — mavi ışık melatonini baskılar',
              'Abdestli uyumak sünnettir ve zihin sakinleşmesine yardımcı olur',
              'Yatarken sağ tarafınıza yatın — karaciğeri ve kalbi rahatlatır',
              'Kafanızı güneye veya kıbleye yönlendirmek tercih edilir',
              'Lavanta veya gül suyu kokusu sakinleştirici etki yapar',
              'Rüya defteri tutmak farkındalığı artırır',
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
            Rüyalarını tanımak için önce mizacını tanı
          </p>
          <p className="text-sm opacity-60 mb-6" style={{ color: '#c8b87a' }}>
            Hangi hılt sende baskın? Rüyalarındaki örüntüleri anlamlandır.
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
