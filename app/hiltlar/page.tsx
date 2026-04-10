import Link from 'next/link';

const hiltlar = [
  {
    id: 'kan',
    isim: 'Kan Hıltı',
    latince: 'Sanguis',
    mizac: 'Demevî',
    mizacId: 'demevi',
    element: 'Hava',
    sembol: '💨',
    renk: '#e05a7a',
    renkAcik: '#fdf0f3',
    nitelikler: ['Sıcak', 'Nemli'],
    mevsim: 'İlkbahar',
    organ: 'Kalp & Karaciğer',
    tat: 'Tatlı',
    koku: 'Güzel, tatlımsı',
    gorunu: 'Kırmızı, parlak',
    yasGrubu: 'Çocukluk & Gençlik',
    gunSaati: 'Sabah',
    olumluOzellikler: ['Neşeli ve iyimser', 'Sosyal ve çekici', 'Yaratıcı ve canlı', 'Bağışlayıcı ve merhametli', 'Hızlı uyum sağlar'],
    olumsuzOzellikler: ['Kararsız ve çabuk sıkılan', 'Disiplinsiz', 'Söz vermekte aceleci', 'Yüzeysel ilişkiler kurabilir'],
    saglik: 'Kan hıltı baskın olduğunda kalp çarpıntısı, baş ağrısı, yüz kızarması ve fazla enerji görülebilir. Kan aldırma (hacamat), aşırı sıcak-tatlı besinlerden kaçınma önerilir.',
    tavsiye: 'Soğuk ve kuru besinler, nar, ekşi meyveler, hafif egzersiz. Sıcak baharatlı yemeklerden ve tatlıdan kaçının.',
    aciklama: 'Kan hıltı, vücudun en değerli sıvısıdır. İbn-i Sina\'ya göre kalpte üretilir ve tüm organlara hayat taşır. Sağlıklı bir insanda dengeli kan hıltı neşe, canlılık ve sağlıklı bir ten rengi olarak kendini gösterir.',
  },
  {
    id: 'safra',
    isim: 'Safra Hıltı',
    latince: 'Cholera',
    mizac: 'Safravî',
    mizacId: 'safravi',
    element: 'Ateş',
    sembol: '🔥',
    renk: '#e8832a',
    renkAcik: '#fef6ed',
    nitelikler: ['Sıcak', 'Kuru'],
    mevsim: 'Yaz',
    organ: 'Safra Kesesi & Karaciğer',
    tat: 'Acı',
    koku: 'Keskin, yanık',
    gorunu: 'Sarı-turuncu, berrak',
    yasGrubu: 'Gençlik & Olgunluk',
    gunSaati: 'Öğle',
    olumluOzellikler: ['Kararlı ve liderlik vasfı yüksek', 'Hızlı düşünen ve etkili', 'Girişimci ve cesaretli', 'Adalet duygusu kuvvetli', 'Hedef odaklı'],
    olumsuzOzellikler: ['Öfkeli ve sabırsız', 'Kontrolcü ve inatçı', 'Sert eleştirmen', 'İnce bağırsakta sorun eğilimi'],
    saglik: 'Safra hıltı fazla olduğunda sinir bozuklukları, öfke nöbetleri, safra taşı, cilt döküntüleri ve mide yanması görülür. Soğutucu besinler ve serinletici bitkiler dengeyi sağlar.',
    tavsiye: 'Salatalık, yoğurt, nane, limon, soğuk sular. Baharatlı-yağlı yemeklerden, öfke tetikleyen durumlardan kaçının.',
    aciklama: 'Safra hıltı karaciğerde üretilir ve sindirime yardımcı olur. İbn-i Sina\'ya göre gereksiz safra safra kesesinde birikir; ateşli, dinamik ve kararlı kişilik yapısının temelini oluşturur.',
  },
  {
    id: 'balgam',
    isim: 'Balgam Hıltı',
    latince: 'Phlegma',
    mizac: 'Balgamî',
    mizacId: 'balgami',
    element: 'Su',
    sembol: '💧',
    renk: '#4a9eda',
    renkAcik: '#eef6fc',
    nitelikler: ['Soğuk', 'Nemli'],
    mevsim: 'Kış',
    organ: 'Akciğer & Beyin',
    tat: 'Tatsız / Hafif Tuzlu',
    koku: 'Nötr, nemli',
    gorunu: 'Beyaz, bulanık',
    yasGrubu: 'Olgunluk & İleri Yaş',
    gunSaati: 'Gece',
    olumluOzellikler: ['Sabırlı ve güvenilir', 'Analitik ve düşünceli', 'Sadık ve istikrarlı', 'Barış sever', 'Sistematik çalışır'],
    olumsuzOzellikler: ['Hareketsizliğe eğilimli', 'Değişime direnç', 'Ağır karar verme', 'İzolasyona kapanabilir'],
    saglik: 'Balgam hıltı fazla olduğunda ödem, üşüme, tembellik, uyku hali, soğuk algınlığı ve sinüzit görülür. Isıtıcı baharatlar ve hareket dengeleyi sağlar.',
    tavsiye: 'Zencefil, tarçın, karabiber, bal. Soğuk-nemli ortamlardan, ağır-yağlı yemeklerden kaçının. Düzenli egzersiz şart.',
    aciklama: 'Balgam hıltı, beyin ve akciğerlerle ilişkilidir. İbn-i Sina\'ya göre vücudun nemini korur, eklemleri yağlar. Fazlası sindirim sistemini yavaşlatır ve beden sıvılarını birikim yapar.',
  },
  {
    id: 'sevda',
    isim: 'Sevda Hıltı',
    latince: 'Melancholia',
    mizac: 'Sevdavî',
    mizacId: 'sevdavi',
    element: 'Toprak',
    sembol: '🌍',
    renk: '#7b5ea7',
    renkAcik: '#f3f0f8',
    nitelikler: ['Soğuk', 'Kuru'],
    mevsim: 'Sonbahar',
    organ: 'Dalak & Kemik',
    tat: 'Ekşi / Astrenjan',
    koku: 'Toprak, keskin',
    gorunu: 'Koyu, siyahımsı',
    yasGrubu: 'İleri Yaş',
    gunSaati: 'Akşam',
    olumluOzellikler: ['Derin düşünür ve filozofik', 'Sanatkâr ruh', 'Sadık ve vefalı', 'Mükemmeliyetçi ve titiz', 'Sezgisel'],
    olumsuzOzellikler: ['Kaygıya eğilimli', 'Melankolik ruh halleri', 'Eleştirel ve şüpheci', 'Sosyal geri çekilme'],
    saglik: 'Sevda hıltı fazla olduğunda depresyon, vesvese, uykusuzluk, karaciğer şişmesi, egzama ve korku nöbetleri görülür. Müzik, güzel koku ve ılık banyolar denge sağlar.',
    tavsiye: 'Bal, üzüm, sıcak çorbalar, lavanta, gül suyu. Soğuk-ekşi besinlerden, yalnızlıktan ve gece uyanık kalmaktan kaçının.',
    aciklama: 'Sevda hıltı dalakta üretilir ve karaciğere gönderilir. İbn-i Sina\'ya göre toprak elementine karşılık gelir; derinlik, sabır ve sezgisel zekânın kaynağıdır. Denge dışına çıkınca vesvese ve korku getirir.',
  },
];

const faq = [
  {
    s: 'Hılt nedir?',
    c: 'Hılt, İslam ve Antik Yunan tıbbında vücudun temel sıvılarını ifade eden kavramdır. İbn-i Sina\'ya göre dört hılt — kan, safra, balgam ve sevda — sağlık ve mizacın temelini oluşturur.',
  },
  {
    s: 'Hangi hıltın baskın olduğunu nasıl anlarım?',
    c: 'Mizaç testini yaparak baskın hıltınızı öğrenebilirsiniz. Mevsimsel belirtiler, beden yapısı, uyku düzeni ve duygusal örüntüler de ipucu verir.',
  },
  {
    s: 'Hılt teorisi modern tıpla bağdaşır mı?',
    c: 'Doğrudan bağdaşmaz; ancak modern psikosomatik tıp, epigenetik ve bağırsak-beyin ekseni araştırmaları, hılt teorisinin bazı gözlemlerini dolaylı olarak desteklemektedir.',
  },
];

export default function HiltlarPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((q) => ({
      '@type': 'Question',
      name: q.s,
      acceptedAnswer: { '@type': 'Answer', text: q.c },
    })),
  };

  return (
    <main className="min-h-screen px-4 py-16" style={{ background: 'var(--background)' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <div className="max-w-3xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm opacity-50 mb-8">
          <Link href="/" className="hover:opacity-100">Ana Sayfa</Link>
          <span>/</span>
          <span>Hıltlar</span>
        </div>

        {/* Hero */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">🫀</div>
          <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>
            Dört Hılt
          </h1>
          <p className="text-lg opacity-70 max-w-xl mx-auto leading-relaxed">
            İbn-i Sina&#39;nın mizaç biliminin temeli: kan, safra, balgam ve sevda. Her hılt bir elementi, bir mevsimi ve bir mizaç tipini temsil eder.
          </p>
        </div>

        {/* Overview grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-12">
          {hiltlar.map((h) => (
            <a
              key={h.id}
              href={`#${h.id}`}
              className="rounded-2xl p-4 text-center transition-all hover:scale-105"
              style={{ background: h.renkAcik, border: `1.5px solid ${h.renk}30` }}
            >
              <div className="text-3xl mb-1">{h.sembol}</div>
              <p className="font-bold text-sm" style={{ color: h.renk }}>{h.isim}</p>
              <p className="text-xs opacity-60">{h.mizac}</p>
            </a>
          ))}
        </div>

        {/* Four Elements diagram */}
        <div
          className="rounded-2xl p-6 mb-12 text-center"
          style={{ background: 'linear-gradient(135deg, #fef9f0, #fff8ee)' }}
        >
          <h2 className="font-bold text-lg mb-4" style={{ color: 'var(--earth)' }}>Nitelik Haritası</h2>
          <div className="grid grid-cols-2 gap-px bg-amber-200 rounded-xl overflow-hidden">
            <div className="p-4 text-center" style={{ background: '#fef6ed' }}>
              <p className="font-bold text-sm" style={{ color: '#e8832a' }}>🔥 Safra</p>
              <p className="text-xs opacity-70 mt-1">Sıcak · Kuru</p>
              <p className="text-xs opacity-50">Ateş · Yaz</p>
            </div>
            <div className="p-4 text-center" style={{ background: '#fdf0f3' }}>
              <p className="font-bold text-sm" style={{ color: '#e05a7a' }}>💨 Kan</p>
              <p className="text-xs opacity-70 mt-1">Sıcak · Nemli</p>
              <p className="text-xs opacity-50">Hava · İlkbahar</p>
            </div>
            <div className="p-4 text-center" style={{ background: '#f3f0f8' }}>
              <p className="font-bold text-sm" style={{ color: '#7b5ea7' }}>🌍 Sevda</p>
              <p className="text-xs opacity-70 mt-1">Soğuk · Kuru</p>
              <p className="text-xs opacity-50">Toprak · Sonbahar</p>
            </div>
            <div className="p-4 text-center" style={{ background: '#eef6fc' }}>
              <p className="font-bold text-sm" style={{ color: '#4a9eda' }}>💧 Balgam</p>
              <p className="text-xs opacity-70 mt-1">Soğuk · Nemli</p>
              <p className="text-xs opacity-50">Su · Kış</p>
            </div>
          </div>
          <p className="text-xs opacity-50 mt-3">Yatay eksen: Sıcaklık · Dikey eksen: Nem</p>
        </div>

        {/* Humors detail */}
        <div className="space-y-10">
          {hiltlar.map((h) => (
            <section
              key={h.id}
              id={h.id}
              className="rounded-2xl overflow-hidden"
              style={{ border: `1.5px solid ${h.renk}30` }}
            >
              {/* Header */}
              <div className="p-6" style={{ background: h.renkAcik }}>
                <div className="flex items-start gap-4">
                  <div className="text-5xl">{h.sembol}</div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h2 className="text-2xl font-bold" style={{ color: h.renk }}>{h.isim}</h2>
                      <span className="text-xs opacity-50 italic">({h.latince})</span>
                    </div>
                    <p className="text-sm opacity-70 mb-3">{h.aciklama}</p>
                    {/* Quick stats */}
                    <div className="flex flex-wrap gap-2">
                      {[
                        { label: 'Mizaç', value: h.mizac },
                        { label: 'Element', value: h.element },
                        { label: 'Mevsim', value: h.mevsim },
                        { label: 'Organ', value: h.organ },
                        { label: 'Nitelik', value: h.nitelikler.join(' · ') },
                        { label: 'Tat', value: h.tat },
                      ].map((s) => (
                        <div
                          key={s.label}
                          className="text-xs px-3 py-1.5 rounded-full"
                          style={{ background: `${h.renk}15`, color: h.renk }}
                        >
                          <span className="opacity-60">{s.label}: </span>
                          <span className="font-semibold">{s.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 grid sm:grid-cols-2 gap-6" style={{ background: 'var(--card)' }}>
                {/* Positive */}
                <div>
                  <h3 className="font-bold text-sm mb-3 opacity-70">Olumlu Özellikler</h3>
                  <ul className="space-y-1.5">
                    {h.olumluOzellikler.map((o) => (
                      <li key={o} className="flex items-start gap-2 text-sm opacity-80">
                        <span style={{ color: h.renk }}>✦</span>
                        {o}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Negative */}
                <div>
                  <h3 className="font-bold text-sm mb-3 opacity-70">Dikkat Edilecekler</h3>
                  <ul className="space-y-1.5">
                    {h.olumsuzOzellikler.map((o) => (
                      <li key={o} className="flex items-start gap-2 text-sm opacity-80">
                        <span className="opacity-40">◦</span>
                        {o}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Health */}
                <div className="sm:col-span-2">
                  <h3 className="font-bold text-sm mb-2 opacity-70">Sağlık & Denge</h3>
                  <p className="text-sm opacity-70 leading-relaxed mb-2">{h.saglik}</p>
                  <div
                    className="text-sm px-4 py-3 rounded-xl"
                    style={{ background: h.renkAcik }}
                  >
                    <span className="font-semibold" style={{ color: h.renk }}>Tavsiye: </span>
                    <span className="opacity-80">{h.tavsiye}</span>
                  </div>
                </div>

                {/* Link to mizac profile */}
                <div className="sm:col-span-2">
                  <Link
                    href={`/mizaclar/${h.mizacId}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full text-white transition-all hover:scale-105"
                    style={{ background: h.renk }}
                  >
                    {h.sembol} {h.mizac} Mizacını İncele →
                  </Link>
                </div>
              </div>
            </section>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--foreground)' }}>Sıkça Sorulan Sorular</h2>
          <div className="space-y-4">
            {faq.map((q) => (
              <div
                key={q.s}
                className="rounded-2xl p-5"
                style={{ background: 'var(--card)', border: '1px solid var(--gold-light)' }}
              >
                <h3 className="font-bold mb-2" style={{ color: 'var(--earth)' }}>{q.s}</h3>
                <p className="text-sm opacity-70 leading-relaxed">{q.c}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div
          className="rounded-2xl p-8 text-center mt-12"
          style={{ background: 'linear-gradient(180deg, #0f0a04 0%, #1a1207 100%)' }}
        >
          <p className="text-lg font-semibold mb-4" style={{ color: '#c8b87a' }}>
            Hangi hılt sende baskın?
          </p>
          <p className="text-sm opacity-60 mb-6" style={{ color: '#c8b87a' }}>
            Mizaç testini yaparak baskın hıltını ve kişilik profilini öğren.
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
