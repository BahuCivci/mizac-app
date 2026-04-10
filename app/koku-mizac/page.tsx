import Link from 'next/link';

const mizacKoku = [
  {
    mizac: 'Safravî',
    mizacId: 'safravi',
    sembol: '🔥',
    renk: '#e8832a',
    renkAcik: '#fef6ed',
    nitelik: 'Sıcak & Kuru',
    ozet: 'Safravî için serinletici ve sakinleştirici kokular önerilir. Isıtıcı ve keskin kokular öfkeyi artırır, hafif ve soğutucular hıltı dengeler.',
    sifaKokular: [
      { isim: 'Gül', tip: 'Çiçek', etki: 'Kalpte safrayı serinletir. Sinir sistemini yatıştırır.', kullanim: 'Gül suyu, gül yağı, taze gül' },
      { isim: 'Nane', tip: 'Ot', etki: 'Serinletici ve ferahlatıcı. Öfke anında etkili.', kullanim: 'Buhar, taze bitki, çay' },
      { isim: 'Sandal ağacı', tip: 'Ağaç', etki: 'Topraklayıcı ve sakinleştirici. Öfkeyi soğutur.', kullanim: 'Buhur, yağ' },
      { isim: 'Limon', tip: 'Narenciye', etki: 'Serinletici ve zihin açıcı.', kullanim: 'Taze sıkım, difüzör' },
      { isim: 'Lavanta', tip: 'Çiçek', etki: 'Sinir sistemini yatıştırır. Uykuya yardımcı.', kullanim: 'Yastık, difüzör, banyo' },
    ],
    kacinilacaklar: [
      'Karanfil ve tarçın kokusu — ısıtıcı, safrâyı artırır',
      'Zencefil esansı — ateşi körükler',
      'Keskin ve boğucu misk kokuları',
    ],
    buhur: 'Sandal ağacı veya gül buhuru — akşam namazından sonra ideal.',
  },
  {
    mizac: 'Demevî',
    mizacId: 'demevi',
    sembol: '💨',
    renk: '#e05a7a',
    renkAcik: '#fdf0f3',
    nitelik: 'Sıcak & Nemli',
    ozet: 'Demevî için hafif kurutucu ve dengeleyen kokular uygundur. Tatlımsı çiçek kokuları enerjilerini besler, nem artırıcı ağır kokular ise dengesizlik yaratır.',
    sifaKokular: [
      { isim: 'Biberiye', tip: 'Ot', etki: 'Zihin açıcı, hafif kurutucu. Odaklanmaya yardımcı.', kullanim: 'Difüzör, taze bitki' },
      { isim: 'Bergamot', tip: 'Narenciye', etki: 'Neşelendirici ve dengeleyici. Demevî için mükemmel.', kullanim: 'Difüzör, parfüm bazı' },
      { isim: 'Rezene', tip: 'Tohum', etki: 'Sindirimi destekler, nemli yapıyı dengeler.', kullanim: 'Çay, buhur' },
      { isim: 'Okaliptüs', tip: 'Ağaç', etki: 'Serinletici ve ferahlatıcı. Solunum yolu açıcı.', kullanim: 'Buhar, difüzör' },
      { isim: 'Limon otu', tip: 'Ot', etki: 'Sakinleştirici ama enerjik. Dengeleyici.', kullanim: 'Çay, difüzör' },
    ],
    kacinilacaklar: [
      'Çok ağır çiçek kokuları — nemi artırır',
      'Misk ve amber — çok uyarıcı',
      'Kapalı ve az havalandırılmış koku ortamları',
    ],
    buhur: 'Bergamot veya rezene buhuru — sabah uyandırıcı ve gün boyu dengeleyici.',
  },
  {
    mizac: 'Balgamî',
    mizacId: 'balgami',
    sembol: '💧',
    renk: '#4a9eda',
    renkAcik: '#eef6fc',
    nitelik: 'Soğuk & Nemli',
    ozet: 'Balgamî için ısıtıcı, uyandırıcı ve kurutucu kokular şifadır. Ağır ve soğutucu kokular balgam birikimini artırır.',
    sifaKokular: [
      { isim: 'Zencefil', tip: 'Kök', etki: 'Güçlü ısıtıcı. Balgamı eritir, metabolizmayı uyarır.', kullanim: 'Taze, yağ, çay buharı' },
      { isim: 'Karabiber', tip: 'Baharat', etki: 'Keskin ve ısıtıcı. Dolaşımı hızlandırır.', kullanim: 'Buhur, taze öğütme' },
      { isim: 'Ökaliptüs', tip: 'Ağaç', etki: 'Solunum açıcı, balgamı kurutur.', kullanim: 'Buhar, difüzör' },
      { isim: 'Çam', tip: 'İğneyapraklı', etki: 'Ferahlatıcı ve ısıtıcı. Akciğer güçlendirici.', kullanim: 'Difüzör, açık hava' },
      { isim: 'Kekik', tip: 'Ot', etki: 'Antibakteriyal ve balgam kurutucu. Solunum için güçlü.', kullanim: 'Buhur, çay' },
    ],
    kacinilacaklar: [
      'Papatya — soğutucu etki balgamı artırır',
      'Ağır çiçek kokuları — nem ve uyku getirir',
      'Kapalı ve nemli ortam kokuları',
    ],
    buhur: 'Kekik veya zencefil buhuru — sabah namazından önce uyandırıcı.',
  },
  {
    mizac: 'Sevdavî',
    mizacId: 'sevdavi',
    sembol: '🌍',
    renk: '#7b5ea7',
    renkAcik: '#f3f0f8',
    nitelik: 'Soğuk & Kuru',
    ozet: 'Sevdavî için ısıtıcı, nemlendirici ve ruh hali yükseltici kokular en büyük şifadır. İbn-i Sina sevdavî tedavisinde kokuyu birincil araç olarak kullanmıştır.',
    sifaKokular: [
      { isim: 'Gül', tip: 'Çiçek', etki: 'Kalbi ısıtır, ruhu besler. Vesvese ve melankoliye karşı en güçlü.', kullanim: 'Gül suyu, buhur, gül yağı' },
      { isim: 'Lavanta', tip: 'Çiçek', etki: 'Kaygıyı azaltır, uykuyu düzenler. Sevda hıltına karşı.', kullanim: 'Yastık, difüzör, banyoya damlat' },
      { isim: 'Amber', tip: 'Reçine', etki: 'Isıtıcı ve nemlendirici. Sevdavî\'nin kuruluğunu dengeler.', kullanim: 'Buhur' },
      { isim: 'Bergamot', tip: 'Narenciye', etki: 'Ruh hali yükseltici. Modern aromaterapi de onaylar.', kullanim: 'Difüzör, banyoya damlat' },
      { isim: 'Sandal ağacı', tip: 'Ağaç', etki: 'Meditatif ve derinleştirici. Kaygı giderici.', kullanim: 'Buhur, yağ' },
    ],
    kacinilacaklar: [
      'Kuru ve keskin kokular — sevdayı artırır',
      'Boğucu ve kapalı mekân kokuları',
      'Kokunun hiç olmadığı ortamlar — sevdavîye yalnızlık gibi gelir',
    ],
    buhur: 'Gül veya amber buhuru — akşam namazından sonra, gece uyumadan önce.',
  },
];

const evrenselKokular = [
  { isim: 'Gül Suyu', etki: 'Hz. Peygamber\'in en sevdiği koku. Tüm mizaçlar için kalp ve ruh dengeleyici.', icon: '🌹' },
  { isim: 'Misk (Musk)', etki: 'Cennet kokusu olarak anılır. Ruh arındırıcı ve bütün edici etki.', icon: '✨' },
  { isim: 'Ud Buhuru', etki: 'İslam dünyasının en kadim buhuru. Ruhsal derinleşme ve iç huzur.', icon: '🪵' },
  { isim: 'Amber', etki: 'Isıtıcı ve nemlendirici. Özellikle kış aylarında tüm mizaçlara yararlı.', icon: '🟡' },
];

export default function KokuMizacPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Koku & Mizaç · Aromaterapi ve Hılt Dengesi',
    description: 'Her mizaç için şifa veren koku reçetesi.',
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
          <span>Koku & Mizaç</span>
        </div>

        {/* Hero */}
        <div
          className="rounded-2xl p-8 mb-10 text-center"
          style={{ background: 'linear-gradient(135deg, #fef9f0, #fff8ee)', border: '1.5px solid var(--gold-light)' }}
        >
          <div className="text-6xl mb-4">🌸</div>
          <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>
            Koku & Mizaç
          </h1>
          <p className="text-lg opacity-70 max-w-xl mx-auto leading-relaxed">
            İbn-i Sina&#39;ya göre koku, burnun beyin ile kurduğu en hızlı bağlantıdır. Doğru koku doğrudan hılt dengesini etkiler.
          </p>
        </div>

        {/* Ibn Sina note */}
        <div
          className="rounded-2xl p-5 mb-10 text-sm leading-relaxed italic border-l-4"
          style={{ background: 'var(--cream)', borderColor: 'var(--gold)', opacity: 0.85 }}
        >
          İbn-i Sina, koku reseptörlerinin beyin ve limbik sistemle doğrudan bağlantısından yüzyıllar önce haberdar olarak, güzel koku tedavisini (koku terapisi) özellikle sevdavî hastalara birincil müdahale olarak uygulamıştır. Hz. Peygamber de &#34;Güzel koku ruhu dinlendirir&#34; buyurmuştur.
        </div>

        {/* Universal scents */}
        <h2 className="text-2xl font-bold mb-5" style={{ color: 'var(--foreground)' }}>
          Tüm Mizaçlar İçin Şifalı Kokular
        </h2>
        <div className="grid sm:grid-cols-2 gap-4 mb-12">
          {evrenselKokular.map((k) => (
            <div
              key={k.isim}
              className="rounded-2xl p-4 flex gap-3"
              style={{ background: 'var(--card)', border: '1px solid var(--gold-light)' }}
            >
              <div className="text-2xl">{k.icon}</div>
              <div>
                <p className="font-bold text-sm" style={{ color: 'var(--earth)' }}>{k.isim}</p>
                <p className="text-xs opacity-65 leading-relaxed mt-0.5">{k.etki}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Per temperament */}
        <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--foreground)' }}>
          Mizaca Göre Koku Reçetesi
        </h2>
        <div className="space-y-8 mb-12">
          {mizacKoku.map((m) => (
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
                    <h4 className="text-xs font-bold opacity-50 mb-3">ŞİFALI KOKULAR</h4>
                    <div className="space-y-3">
                      {m.sifaKokular.map((k) => (
                        <div key={k.isim}>
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{k.isim}</span>
                            <span
                              className="text-xs px-1.5 py-0.5 rounded-full"
                              style={{ background: `${m.renk}15`, color: m.renk }}
                            >
                              {k.tip}
                            </span>
                          </div>
                          <p className="text-xs opacity-65 leading-relaxed">{k.etki}</p>
                          <p className="text-xs opacity-45 italic">{k.kullanim}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold opacity-50 mb-3">KAÇINILACAKLAR</h4>
                    <ul className="space-y-1.5 mb-4">
                      {m.kacinilacaklar.map((k) => (
                        <li key={k} className="flex items-start gap-2 text-sm opacity-75">
                          <span className="opacity-40 mt-0.5">◦</span>
                          {k}
                        </li>
                      ))}
                    </ul>
                    <div
                      className="rounded-xl p-3 text-sm"
                      style={{ background: m.renkAcik }}
                    >
                      <span className="font-semibold text-xs" style={{ color: m.renk }}>Buhur: </span>
                      <span className="text-xs opacity-75">{m.buhur}</span>
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

        {/* Practical guide */}
        <div
          className="rounded-2xl p-6 mb-8"
          style={{ background: 'linear-gradient(135deg, #fef9f0, #fff8ee)', border: '1.5px solid var(--gold-light)' }}
        >
          <h2 className="font-bold text-lg mb-4" style={{ color: 'var(--earth)' }}>
            ✦ Koku Terapisi Nasıl Uygulanır?
          </h2>
          <ul className="space-y-2">
            {[
              'Buhur yakın: odayı havalandırdıktan sonra 10-15 dakika buhur yak, mekânı başka kokulardan arındır.',
              'Gül suyu günlük ritüel: yüze veya ellere hafifçe sürmek reseptörleri uyarır.',
              'Uyku öncesi koku terapisi en etkili — beyin uyku sırasında kokuları işler.',
              'Difüzör kullanırken yoğunluğu düşük tut — yüksek konsantrasyon baş ağrısı yapar.',
              'Koku terapisinde sabır gerekir: 2-3 haftalık düzenli uygulama fark yaratır.',
              'Hz. Peygamber kokuyu reddedilmez bir hediye olarak kabul etmiştir.',
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
            Hangi koku seni dengeler?
          </p>
          <p className="text-sm opacity-60 mb-6" style={{ color: '#c8b87a' }}>
            Mizacını öğren, doğru kokuyu bul.
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
