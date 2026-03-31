'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShareBar } from '@/components/share-bar';
import { EmailCapture } from '@/components/email-capture';

const mizaclar = [
  {
    id: 'safravi',
    isim: 'Safravî',
    element: '🔥',
    agriTipi: 'Yanma',
    agriKisa: 'Mide yanması, ayak yanması, cilt yanması',
    renk: '#c05c1a',
    bg: '#fff8f0',
    border: '#f5c09a',
    hilti: 'Safra (Öd Suyu)',
    organ: 'Mide · Safra Kesesi',
    aci: 'Öfkeni içine atıyorsun.',
    aciSonuc: 'Miden onu taşıyor. O mide yanması tesadüf değil — bastırdığın öfkenin ve pişmanlığın faturası.',
    hastaliklar: [
      { isim: 'Mide Yanması & Reflü', aciklama: 'Mide asidi fazlalığı — özellikle stres ve öfkeyle tetiklenir.' },
      { isim: 'Safra Kesesi Problemleri', aciklama: 'Taş, çamurlama, kronik ağrı. Hıltın toplandığı yer.' },
      { isim: 'Bahar Alerjisi', aciklama: 'Göz yaşarması, burun akıntısı — safravî mevsim hassasiyeti.' },
      { isim: 'Cilt Kaşıntısı & Sivilce', aciklama: 'Kalça ve bacakta yoğunlaşan cilt tepkileri.' },
      { isim: 'Gastrit', aciklama: 'Stresle tetiklenen mide iltihabı. Kronikleşme eğilimindedir.' },
      { isim: 'Diyabet', aciklama: 'Anatomik olarak safra suyundan, ruhsal olarak pişmanlıktan beslenir.' },
      { isim: 'Ayak Yanması & Kramlar', aciklama: 'Gece başlayan yanma ve kasılma — ateşin aşağı inmesi.' },
      { isim: 'Kaşıntı & Egzama', aciklama: 'Kıskançlık ve iç çatışmanın ciltteki yankısı.' },
    ],
    ruhsal: 'Safravî hıltı öfke ve pişmanlıkla artar. İçindeki ateşi söndürmek için önce öfkeyi görmek gerekir. Sinyalleri yok saydıkça miden daha yüksek sesle konuşmaya başlar.',
    oneri: 'Soğuk mizaçlı gıdalar (nane çayı, salatalık, karpuz). Derin diyafram nefesi. Öfkeyi adlandır — bastırma, dönüştür.',
  },
  {
    id: 'demevi',
    isim: 'Demevî',
    element: '💧',
    agriTipi: 'Zonklama',
    agriKisa: 'Migren, kalp çarpıntısı, nabız atan baş ağrısı',
    renk: '#be185d',
    bg: '#fff5f9',
    border: '#f9a8d4',
    hilti: 'Dem (Kan)',
    organ: 'Kalp · Karaciğer',
    aci: 'Her şeyi çok hissediyorsun.',
    aciSonuc: 'Kalbinin çarpıntısı, başının zonklaması — bu fazla enerji bedenden çıkmak istiyor. Sevinç bile seni yoruyor çünkü sınır tanımıyorsun.',
    hastaliklar: [
      { isim: 'Migren & Baş Ağrısı', aciklama: 'Zonklayan, nabız atan ağrılar — demevî mizacın en tanınan belirtisi.' },
      { isim: 'Kalp Çarpıntısı', aciklama: 'Aşırı heyecan, coşku veya kaygıyla gelen ritim bozuklukları.' },
      { isim: 'Yüksek Tansiyon', aciklama: 'Kan hıltı fazlalaştığında damarlar baskı altına girer.' },
      { isim: 'Karaciğer Hassasiyeti', aciklama: 'Kanın üretildiği yer — demevî mizaçta hassaslaşır.' },
      { isim: 'Hormonal Dengesizlik', aciklama: 'Miyom, düzensiz döngü — kan kalitesiyle doğrudan ilişkili.' },
      { isim: 'Akne & Çıban', aciklama: 'Kanın dışarı çıkma çabası olarak cilt üzerinden tezahür eder.' },
      { isim: 'Egzama', aciklama: 'Ayrılık ve ilgisizlik gibi duygusal tetikleyicilerle ortaya çıkar.' },
      { isim: 'Lenf Sistemi Sorunları', aciklama: 'Kan ve lenf dolaşımında sistemik tıkanmalar.' },
    ],
    ruhsal: 'Demevî hıltı aşırı sevinç ve heyecanla artar. Her duyguyu sonuna kadar yaşayan demevî, bedenin sınırlarını zorlar. Dinlenme, sınır koymak ve uyku düzeni bu mizaç için ilaç gibidir.',
    oneri: 'Hacamat. Soğuk-ılık duş. Uyku düzeni. Coşkunu besle ama sınırını bil. Duygusal yoğunluğun sonu nereye geliyor, fark et.',
  },
  {
    id: 'balgami',
    isim: 'Balgamî',
    element: '🌊',
    agriTipi: 'Tutulma',
    agriKisa: 'Eklem tutuklugu, nefes darlığı, genel ağırlık',
    renk: '#1e6fb5',
    bg: '#f0f8ff',
    border: '#93c5fd',
    hilti: 'Balgam (Mukus)',
    organ: 'Akciğerler · Eklemler',
    aci: 'Söyleyemediklerin var.',
    aciSonuc: 'Boğazın sıkışıyor, akciğerlerin tıkanıyor — çünkü söylenmemiş sözler bir yerde birikmek zorunda. Kendini ifade edemedikçe beden ifade ediyor.',
    hastaliklar: [
      { isim: 'Astım & Nefes Darlığı', aciklama: 'Akciğerlerde mukus birikimi — söylenmemiş sözlerin bedendeki hali.' },
      { isim: 'Eklem Ağrıları & Romatizma', aciklama: 'Sabahları şiddetlenen tutukluk — keder ve hareketsizlikle artar.' },
      { isim: 'Sinüzit & Kronik Burun', aciklama: 'Mukus sistemi sürekli aktif — nem ve soğuğa duyarlılık.' },
      { isim: 'Obezite & Kilo Alma', aciklama: 'Yavaş metabolizma ve su tutma — hareketsizlikle birleşince kıskaca girer.' },
      { isim: 'Zatürre & Bronşit', aciklama: 'Solunum yolu enfeksiyonları balgamî mizaçta tekrarlar.' },
      { isim: 'Bademcik Problemleri', aciklama: 'Sık iltihap ve şişlik — boğazdaki duygu tıkanması.' },
      { isim: 'Hazımsızlık & Şişkinlik', aciklama: 'Yavaş sindirim, ağırlık ve mide gerginliği.' },
      { isim: 'Demir Eksikliği', aciklama: 'Sürekli yorgunluk ve solukluk — enerji drenajı.' },
    ],
    ruhsal: 'Balgamî hıltı keder ve söylenmemiş duygularla artar. Akciğerler, bastırılan üzüntünün en sevdiği saklanma yeridir. Konuşmak, yazmak, ağlamak izin vermek — bu mizaç için şifadır.',
    oneri: 'Zencefil çayı, tarçın, karanfil. Sauna. Hareket — özellikle dışarıda. Bir şeyi birine söyle. Yazdığını okusun ya da okutma, sadece yaz.',
  },
  {
    id: 'sovdavi',
    isim: 'Sovdavî',
    element: '🌍',
    agriTipi: 'Sızı',
    agriKisa: 'Kemik sızısı, kronik yorgunluk, derin sinir ağrısı',
    renk: '#44403c',
    bg: '#fafaf9',
    border: '#c8c4bc',
    hilti: 'Sevda (Kara Safra)',
    organ: 'İskelet · Sinir Sistemi',
    aci: 'Aklın hiç durmuyor.',
    aciSonuc: 'Kemiklerin sızlıyor, sinirlerinde ateş var — çünkü durmayan bir zihin bedeni de dinlendiremiyor. Vesvese bir düşünce değil, bir hılt durumudur.',
    hastaliklar: [
      { isim: 'Kronik Kemik & İskelet Ağrıları', aciklama: 'Sevda hıltı kemik dokusunu oluşturur — sızı bu mizacın dili.' },
      { isim: 'Kronik Yorgunluk', aciklama: 'Dinlendirmeyen uyku, sabah kalkmakta güçlük.' },
      { isim: 'Uyuşma & Duyu Kaybı', aciklama: 'Ellerde, ayaklarda, sırtta sinirsel uyuşmalar.' },
      { isim: 'Melankoli & Kronik Kaygı', aciklama: 'Haz alamama, içe kapanma, karamsarlık eğilimi.' },
      { isim: 'Işık & Ses Hassasiyeti', aciklama: 'Gözlerin ışıktan, kulakların sesten yorulması.' },
      { isim: 'Tırnak & Saç Problemleri', aciklama: 'Kırılgan tırnaklar, saç dökülmesi — mineral eksikliği sinyali.' },
      { isim: 'Huzursuz Bacak Sendromu', aciklama: 'Gece başlayan bacak ağırlığı ve kramp.' },
      { isim: 'Sinir Sistemi Rahatsızlıkları', aciklama: 'Nöralji, sinir baskısı, sinirsel kökenli ağrılar.' },
    ],
    ruhsal: 'Sovdavî hıltı hüzün ve vesvese ile artar. Gülenemeyen, sevinemeyen, haz alamayan kişilerde bu hılt hakimdir. Güneş, hareket, müzik ve insanlarla temas — bu mizacın antidotu.',
    oneri: 'Güneş ışığı (sabah). Hafif egzersiz, yürüyüş. Sosyal temas — inziva bu mizacı besler, iyileştirmez. Müzik. Güzel bir şeye uzun süre bak.',
  },
];

const duygular = [
  {
    sen: 'Öfkeni içine atıyorsun',
    beden: 'Miden yanıyor. Safra kesenin sessizce taş yapıyor.',
    mizac: 'Safravî 🔥',
    bg: '#fff8f0',
    border: '#f5c09a',
    color: '#c05c1a',
  },
  {
    sen: 'Gözyaşlarını yutuyorsun',
    beden: 'Akciğerlerin tıkanıyor. Boğazın sıkışıyor. Bademciğin büyüyor.',
    mizac: 'Balgamî 🌊',
    bg: '#f0f8ff',
    border: '#93c5fd',
    color: '#1e6fb5',
  },
  {
    sen: 'Her şeyi sonuna kadar hissediyorsun',
    beden: 'Başın zonkluyor. Kalbinin ritmi kaçıyor. Karaciğerin yoruluyor.',
    mizac: 'Demevî 💧',
    bg: '#fff5f9',
    border: '#f9a8d4',
    color: '#be185d',
  },
  {
    sen: 'Aklın gece yarısı bile çalışıyor',
    beden: 'Kemiklerin sızlıyor. Sabah kalkmak için iraden gerekiyor.',
    mizac: 'Sovdavî 🌍',
    bg: '#fafaf9',
    border: '#c8c4bc',
    color: '#44403c',
  },
  {
    sen: 'Sevilmediğini, görülmediğini hissediyorsun',
    beden: 'Cildin tepki veriyor. Kilo alıyorsun. Egzaman çıkıyor.',
    mizac: 'Demevî 💧',
    bg: '#fff5f9',
    border: '#f9a8d4',
    color: '#be185d',
  },
  {
    sen: 'Söylemek istediğin şeyleri söyleyemiyorsun',
    beden: 'Bademciğin şişiyor. Boğazın kapanıyor. Sesi çıkamayan organ konuşuyor.',
    mizac: 'Balgamî 🌊',
    bg: '#f0f8ff',
    border: '#93c5fd',
    color: '#1e6fb5',
  },
];

export default function HastalıklarPage() {
  const [aktif, setAktif] = useState<string | null>(null);
  const secili = mizaclar.find(m => m.id === aktif);

  return (
    <main className="min-h-screen bg-white">

      {/* Hero */}
      <section className="py-20 px-4 text-center" style={{ background: 'linear-gradient(180deg, #0f0a04 0%, #1a1207 100%)' }}>
        <div className="max-w-2xl mx-auto">
          <p className="text-xs tracking-widest uppercase mb-6" style={{ color: '#c4973a' }}>İbn-i Sina · Beden ve Ruh</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Bedenin Konuşuyor.<br />
            <span style={{ color: '#c4973a' }}>Anlıyor musun?</span>
          </h1>
          <p className="text-lg leading-relaxed mb-8" style={{ color: '#9a8060' }}>
            Aynı stres, aynı üzüntü, aynı öfke — ama herkeste farklı bir yerde başlıyor.
            Bu tesadüf değil. Bedenin mizacının dilini konuşuyor.
          </p>
          <div className="inline-block rounded-2xl px-6 py-3" style={{ background: 'rgba(196, 151, 58, 0.1)', border: '1px solid rgba(196, 151, 58, 0.3)' }}>
            <p className="text-sm font-medium" style={{ color: '#c4973a' }}>
              ↓ Ağrın ne şekilde geliyor? Seç ve keşfet.
            </p>
          </div>
        </div>
      </section>

      {/* Self-ID — Ağrı tipi seçici */}
      <section className="py-14 px-4" style={{ background: '#fef9f0' }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="text-center text-2xl font-bold mb-2" style={{ color: '#3d2c0e' }}>
            Ağrın sana hangi dilde geliyor?
          </h2>
          <p className="text-center text-sm mb-10" style={{ color: '#9a8060' }}>
            Seç — ve bedenin neden öyle davrandığını öğren.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {mizaclar.map((m) => (
              <button
                key={m.id}
                onClick={() => setAktif(aktif === m.id ? null : m.id)}
                className="rounded-2xl p-5 text-center transition-all hover:scale-105 border-2"
                style={{
                  background: aktif === m.id ? m.bg : 'white',
                  borderColor: aktif === m.id ? m.border : '#e8d5b0',
                  boxShadow: aktif === m.id ? `0 4px 20px ${m.renk}20` : 'none',
                  transform: aktif === m.id ? 'scale(1.03)' : 'scale(1)',
                }}
              >
                <div className="text-3xl mb-2 text-center">{m.element}</div>
                <div className="text-xl font-black mb-1 text-center" style={{ color: aktif === m.id ? m.renk : '#3d2c0e' }}>
                  {m.agriTipi}
                </div>
                <div className="text-xs text-center" style={{ color: '#9a8060' }}>
                  {m.agriKisa}
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Revelation — seçildiğinde açılır */}
      {secili && (
        <section className="py-12 px-4" style={{ background: secili.bg }}>
          <div className="max-w-3xl mx-auto">

            {/* Açılış cümlesi — asıl çarpan yer */}
            <div className="text-center mb-10">
              <div className="text-5xl mb-4">{secili.element}</div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: secili.renk }}>
                Bu {secili.isim} mizacının sesi.
              </h2>
              <p className="text-lg font-semibold mb-2" style={{ color: '#3d2c0e' }}>
                "{secili.aci}"
              </p>
              <p className="text-base leading-relaxed max-w-xl mx-auto" style={{ color: '#5c3d1e' }}>
                {secili.aciSonuc}
              </p>
            </div>

            {/* Ruhsal bağlantı — öne al */}
            <div className="rounded-2xl p-6 mb-6 border-l-4" style={{ background: 'white', borderLeftColor: secili.renk }}>
              <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: secili.renk }}>
                Beden — Ruh Bağlantısı
              </p>
              <p className="leading-relaxed" style={{ color: '#3d2c0e' }}>
                {secili.ruhsal}
              </p>
              <p className="text-xs mt-3 italic" style={{ color: '#9a8060' }}>
                Hılt: {secili.hilti} · Hassas organ: {secili.organ}
              </p>
            </div>

            {/* Fiziksel belirtiler */}
            <h3 className="font-bold text-sm tracking-widest uppercase mb-4" style={{ color: secili.renk }}>
              Bu mizacın hassas noktaları
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {secili.hastaliklar.map((h) => (
                <div key={h.isim} className="rounded-xl p-4" style={{ background: 'white' }}>
                  <div className="font-bold text-sm mb-1" style={{ color: secili.renk }}>{h.isim}</div>
                  <div className="text-xs leading-relaxed" style={{ color: '#7a6040' }}>{h.aciklama}</div>
                </div>
              ))}
            </div>

            {/* Öneri şeridi */}
            <div className="rounded-2xl p-6 text-white" style={{ background: `linear-gradient(135deg, ${secili.renk}dd, ${secili.renk})` }}>
              <p className="text-xs font-bold tracking-widest uppercase opacity-70 mb-2">Ne yapabilirsin?</p>
              <p className="leading-relaxed">{secili.oneri}</p>
            </div>

          </div>
        </section>
      )}

      {/* Duygular → Hastalık — dark section */}
      <section className="py-16 px-4" style={{ background: '#1a1207' }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-white mb-2">
            Duygular Nerede Saklıyor Kendini?
          </h2>
          <p className="text-center text-sm mb-10" style={{ color: '#6b5230' }}>
            İbn-i Sina&apos;ya göre hastalık, bastırılmış duygunun bedendeki yankısıdır.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {duygular.map((item) => (
              <div
                key={item.sen}
                className="rounded-2xl p-5"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <p className="font-semibold mb-2" style={{ color: '#f5f0e8' }}>
                  &ldquo;{item.sen}…&rdquo;
                </p>
                <p className="text-sm leading-relaxed mb-3" style={{ color: '#9a8060' }}>
                  {item.beden}
                </p>
                <span className="text-xs font-bold" style={{ color: '#c4973a' }}>{item.mizac}</span>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-2xl p-6 text-center" style={{ background: 'rgba(196,151,58,0.08)', border: '1px solid rgba(196,151,58,0.2)' }}>
            <p className="font-bold text-white mb-1">Beden yalan söylemez.</p>
            <p className="text-sm" style={{ color: '#9a8060' }}>
              Ama sinyallerini çözmek için önce mizacını bilmen gerekiyor.
            </p>
          </div>
        </div>
      </section>

      {/* Email capture */}
      <section className="py-4 px-4">
        <div className="max-w-2xl mx-auto">
          <EmailCapture
            title="Mizacına özel haftalık şifa takvimi"
            subtitle="Her Pazartesi — bedenini anlamak için bir adım. Ücretsiz."
            cta="Gönder"
          />
        </div>
      </section>

      {/* Share + CTA */}
      <section className="py-16 px-4 text-center" style={{ background: '#fef9f0' }}>
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-center mb-8">
            <ShareBar
              title="Bedenin Konuşuyor — Mizaca Göre Hastalıklar"
              description="Ağrının şekli mizacının şifresidir. İbn-i Sina bunu 10 asır önce söyledi."
              url="https://mizac.xyz/hastaliklar"
            />
          </div>
          <h2 className="text-2xl font-bold mb-3" style={{ color: '#3d2c0e' }}>
            Mizacını bilmek, bedenini anlamaktır.
          </h2>
          <p className="mb-8" style={{ color: '#9a8060' }}>
            Hangi mizaç olduğunu bilmiyorsan, bedenin sinyallerini tesadüf sanmaya devam edersin.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/test"
              className="px-8 py-3 rounded-full font-bold text-white hover:scale-105 transition-all"
              style={{ background: 'linear-gradient(135deg, #7c4a1e, #c4973a)' }}
            >
              ✦ Mizaç Testini Yap
            </Link>
            <Link
              href="/esma-sifa"
              className="px-8 py-3 rounded-full font-semibold border-2 hover:scale-105 transition-all"
              style={{ borderColor: '#c4973a', color: '#7c4a1e' }}
            >
              Esmaü&apos;l-Hüsna ile Şifa →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
