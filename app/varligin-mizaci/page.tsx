'use client';

import { useLang } from '@/lib/lang-context';
import Link from 'next/link';
import { useState } from 'react';
import { ShareBar } from '@/components/share-bar';
import { EmailCapture } from '@/components/email-capture';

const kategoriler = [
  {
    id: 'mevsimler',
    baslik: 'Mevsimlerin Mizacı',
    baslikEn: 'Temperament of Seasons',
    ikon: '🌿',
    items: [
      { isim: 'İlkbahar', isimEn: 'Spring', mizac: 'Demevî', mizacEn: 'Sanguine', sembol: '💨', renk: '#2980b9', aciklama: 'Sıcak ve nemli. Yeniden doğuş, canlılık, sosyal enerji.', aciklamaEn: 'Hot and wet. Rebirth, vitality, social energy.' },
      { isim: 'Yaz', isimEn: 'Summer', mizac: 'Safravî', mizacEn: 'Choleric', sembol: '🔥', renk: '#c0392b', aciklama: 'Sıcak ve kuru. Yüksek enerji, üretkenlik, liderlik.', aciklamaEn: 'Hot and dry. High energy, productivity, leadership.' },
      { isim: 'Sonbahar', isimEn: 'Autumn', mizac: 'Sevdavî', mizacEn: 'Melancholic', sembol: '🌍', renk: '#7d3c98', aciklama: 'Soğuk ve kuru. Derinlik, içe dönüş, nostalji.', aciklamaEn: 'Cold and dry. Depth, inwardness, nostalgia.' },
      { isim: 'Kış', isimEn: 'Winter', mizac: 'Balgamî', mizacEn: 'Phlegmatic', sembol: '💧', renk: '#27ae60', aciklama: 'Soğuk ve nemli. Dinlenme, sabır, içe çekilme.', aciklamaEn: 'Cold and wet. Rest, patience, withdrawal.' },
    ],
  },
  {
    id: 'gunvakitleri',
    baslik: 'Günün Vakitlerinin Mizacı',
    baslikEn: 'Temperament of Times of Day',
    ikon: '🕐',
    items: [
      { isim: 'Sabah', isimEn: 'Morning', mizac: 'Demevî', mizacEn: 'Sanguine', sembol: '💨', renk: '#2980b9', aciklama: 'Taze, sosyal, enerjik. Yeni başlangıçlar için en uygun vakit.', aciklamaEn: 'Fresh, social, energetic. Best time for new beginnings.' },
      { isim: 'Öğle', isimEn: 'Midday', mizac: 'Safravî', mizacEn: 'Choleric', sembol: '🔥', renk: '#c0392b', aciklama: 'Güçlü, üretken, kararlı. Zor kararlar ve fiziksel aktivite için ideal.', aciklamaEn: 'Strong, productive, decisive. Ideal for difficult decisions and physical activity.' },
      { isim: 'Akşam', isimEn: 'Evening', mizac: 'Sevdavî', mizacEn: 'Melancholic', sembol: '🌍', renk: '#7d3c98', aciklama: 'Derin, düşünceli, melankolik. Yaratıcı çalışma ve muhasebe için.', aciklamaEn: 'Deep, thoughtful, melancholic. For creative work and self-reflection.' },
      { isim: 'Gece', isimEn: 'Night', mizac: 'Balgamî', mizacEn: 'Phlegmatic', sembol: '💧', renk: '#27ae60', aciklama: 'Sakin, pasif, dinlendirici. Uyku ve ibadet için en uygun vakit.', aciklamaEn: 'Calm, passive, restorative. Best time for sleep and worship.' },
    ],
  },
  {
    id: 'renkler',
    baslik: 'Renklerin Mizacı',
    baslikEn: 'Temperament of Colors',
    ikon: '🎨',
    items: [
      { isim: 'Kırmızı / Turuncu / Sarı', isimEn: 'Red / Orange / Yellow', mizac: 'Safravî & Demevî', mizacEn: 'Choleric & Sanguine', sembol: '🔥', renk: '#c0392b', aciklama: 'Sıcak renkler. Enerji, heyecan, iştah açar. Safravîler için aşırı uyarıcı olabilir.', aciklamaEn: 'Warm colors. Energy, excitement, appetite stimulating. May be overly stimulating for Cholerics.' },
      { isim: 'Mavi / Gri / Siyah', isimEn: 'Blue / Gray / Black', mizac: 'Sevdavî & Balgamî', mizacEn: 'Melancholic & Phlegmatic', sembol: '💧', renk: '#2980b9', aciklama: 'Soğuk renkler. Sakinlik, derinlik, konsantrasyon. Safravîlere iyi gelir, Sevdavîleri depresyona sürükleyebilir.', aciklamaEn: 'Cool colors. Calm, depth, concentration. Good for Cholerics, may push Melancholics toward depression.' },
      { isim: 'Yeşil / Beyaz', isimEn: 'Green / White', mizac: 'Mutedil', mizacEn: 'Balanced', sembol: '✦', renk: '#27ae60', aciklama: 'Denge renkleri. Tüm mizaçlara iyi gelir, şifa ve denge için önerilir.', aciklamaEn: 'Balance colors. Good for all temperaments, recommended for healing and balance.' },
      { isim: 'Mor / Eflatun', isimEn: 'Purple / Lavender', mizac: 'Sevdavî', mizacEn: 'Melancholic', sembol: '🌍', renk: '#7d3c98', aciklama: 'Ruhani ve derin. Maneviyat ve yaratıcılık için güçlü ama Sevdavîde aşırı melankoliye yol açabilir.', aciklamaEn: 'Spiritual and deep. Powerful for spirituality and creativity, but may lead to excessive melancholy in Melancholics.' },
    ],
  },
  {
    id: 'kumaslar',
    baslik: 'Kumaşların Mizacı',
    baslikEn: 'Temperament of Fabrics',
    ikon: '🧵',
    items: [
      { isim: 'İpek', isimEn: 'Silk', mizac: 'Çok Sıcak', mizacEn: 'Very Hot', sembol: '🔥', renk: '#c0392b', aciklama: 'Son derece ısıtıcı. Kadınlar için faydalı; erkekler için aşırı ısınmaya yol açar. (Dinen erkeklere yasak)', aciklamaEn: 'Extremely warming. Beneficial for women; causes excessive heat for men. (Forbidden for men in Islam)' },
      { isim: 'Yün', isimEn: 'Wool', mizac: 'Sıcak', mizacEn: 'Hot', sembol: '💨', renk: '#2980b9', aciklama: 'Isıtıcı, koruyucu. Soğuk mizaçlar (Balgamî, Sevdavî) için çok faydalı.', aciklamaEn: 'Warming, protective. Very beneficial for cold temperaments (Phlegmatic, Melancholic).' },
      { isim: 'Pamuk / Keten', isimEn: 'Cotton / Linen', mizac: 'Soğuk', mizacEn: 'Cool', sembol: '🌍', renk: '#7d3c98', aciklama: 'Serinletici, nefes alır. Sıcak mizaçlar (Safravî, Demevî) için ideal. Yazın tercih edilmeli.', aciklamaEn: 'Cooling, breathable. Ideal for hot temperaments (Choleric, Sanguine). Should be preferred in summer.' },
      { isim: 'Naylon / Akrilik / Polyester', isimEn: 'Nylon / Acrylic / Polyester', mizac: 'Çok Soğuk', mizacEn: 'Very Cold', sembol: '💧', renk: '#27ae60', aciklama: 'Yapay ve soğutucu. Tüm mizaçlar için olumsuz etkileri olabilir; özellikle Balgamî ve Sevdavîlerde sorun yaratır.', aciklamaEn: 'Artificial and cooling. May have negative effects for all temperaments; especially problematic for Phlegmatic and Melancholic.' },
    ],
  },
  {
    id: 'metaller',
    baslik: 'Metallerin Mizacı',
    baslikEn: 'Temperament of Metals',
    ikon: '⚙️',
    items: [
      { isim: 'Altın', isimEn: 'Gold', mizac: 'Çok Sıcak', mizacEn: 'Very Hot', sembol: '🔥', renk: '#c0392b', aciklama: 'En sıcak metal. Sıcak mizaçlar için dengeli kullanılmalı. (Dinen erkeklere takı olarak yasak)', aciklamaEn: 'The hottest metal. Should be used in moderation for hot temperaments. (Forbidden as jewelry for men in Islam)' },
      { isim: 'Gümüş', isimEn: 'Silver', mizac: 'Mutedil-Sıcak', mizacEn: 'Moderately Hot', sembol: '💨', renk: '#2980b9', aciklama: 'Dengeli ve şifalı. Tüm mizaçlara faydalı; özellikle balgamî hastalıklar için önerilir.', aciklamaEn: 'Balanced and healing. Beneficial for all temperaments; especially recommended for phlegmatic ailments.' },
      { isim: 'Bakır', isimEn: 'Copper', mizac: 'Sıcak', mizacEn: 'Hot', sembol: '🌍', renk: '#7d3c98', aciklama: 'Isıtıcı ve iyileştirici. Soğuk mizaç hastalıklarında faydalıdır.', aciklamaEn: 'Warming and healing. Beneficial in cold temperament ailments.' },
      { isim: 'Alüminyum / Kurşun', isimEn: 'Aluminum / Lead', mizac: 'Soğuk', mizacEn: 'Cold', sembol: '💧', renk: '#27ae60', aciklama: 'Soğutucu metaller. Soğuk mizaçlarda kullanımdan kaçınılmalı.', aciklamaEn: 'Cooling metals. Should be avoided in cold temperaments.' },
    ],
  },
  {
    id: 'mekanlar',
    baslik: 'Mekânların Mizacı',
    baslikEn: 'Temperament of Spaces',
    ikon: '🏛️',
    items: [
      { isim: 'İş Yeri / Pazar', isimEn: 'Workplace / Market', mizac: 'Safravî', mizacEn: 'Choleric', sembol: '🔥', renk: '#c0392b', aciklama: 'Sıcak ve kuru. Rekabetçi, üretken, karar odaklı enerji.', aciklamaEn: 'Hot and dry. Competitive, productive, decision-focused energy.' },
      { isim: 'Cami / Tekke / İbadet Mekânı', isimEn: 'Mosque / Sufi Lodge / Place of Worship', mizac: 'Demevî', mizacEn: 'Sanguine', sembol: '💨', renk: '#2980b9', aciklama: 'Sıcak ve nemli. Manevi topluluk, sevgi, cömertlik enerjisi.', aciklamaEn: 'Hot and wet. Spiritual community, love, generosity energy.' },
      { isim: 'Okul / Kütüphane / Araştırma', isimEn: 'School / Library / Research', mizac: 'Balgamî', mizacEn: 'Phlegmatic', sembol: '💧', renk: '#27ae60', aciklama: 'Soğuk ve nemli. Sistematik öğrenme, sabır, bilgi biriktirme enerjisi.', aciklamaEn: 'Cold and wet. Systematic learning, patience, knowledge accumulation energy.' },
      { isim: 'Beton Yapılar / Şehir', isimEn: 'Concrete Buildings / City', mizac: 'Sevdavî', mizacEn: 'Melancholic', sembol: '🌍', renk: '#7d3c98', aciklama: 'Soğuk ve kuru. Yoğun şehir hayatı, izolasyon, derinleşme enerjisi. Dengelenmesi gerekir.', aciklamaEn: 'Cold and dry. Intense city life, isolation, deepening energy. Needs to be balanced.' },
    ],
  },
  {
    id: 'dogaltaslar',
    baslik: 'Doğal Taşların Mizacı',
    baslikEn: 'Temperament of Natural Stones',
    ikon: '💎',
    items: [
      { isim: 'Pembe Kuvars', isimEn: 'Rose Quartz', mizac: 'Demevî', mizacEn: 'Sanguine', sembol: '💨', renk: '#2980b9', aciklama: 'Sıcak ve nemli. Kalp çakrasını açar, sevgi ve ilişkileri güçlendirir.', aciklamaEn: 'Hot and wet. Opens the heart chakra, strengthens love and relationships.' },
      { isim: 'Ametist', isimEn: 'Amethyst', mizac: 'Demevî-Sıcak', mizacEn: 'Sanguine-Warm', sembol: '💨', renk: '#7d3c98', aciklama: 'Ruhani koruma, maneviyat, sezgi güçlendirir. Tüm mizaçlara faydalı.', aciklamaEn: 'Spiritual protection, spirituality, strengthens intuition. Beneficial for all temperaments.' },
      { isim: 'Dumanlı Kuvars', isimEn: 'Smoky Quartz', mizac: 'Balgamî', mizacEn: 'Phlegmatic', sembol: '💧', renk: '#27ae60', aciklama: 'Soğuk ve kuru. Güven, zemin, stres azaltıcı. Yüksek kaygılı mizaçlar için önerilir.', aciklamaEn: 'Cold and dry. Trust, grounding, stress-reducing. Recommended for high-anxiety temperaments.' },
      { isim: 'Kırmızı Akik / Karneol', isimEn: 'Red Agate / Carnelian', mizac: 'Safravî', mizacEn: 'Choleric', sembol: '🔥', renk: '#c0392b', aciklama: 'Sıcak ve kuru. Enerji, motivasyon, güç verir. Safravî için dengeli kullanılmalı.', aciklamaEn: 'Hot and dry. Gives energy, motivation, strength. Should be used in moderation for Cholerics.' },
    ],
  },
  {
    id: 'duygular',
    baslik: 'Duyguların Mizacı',
    baslikEn: 'Temperament of Emotions',
    ikon: '💛',
    items: [
      { isim: 'Öfke / Tutku / Hırs', isimEn: 'Anger / Passion / Ambition', mizac: 'Safravî', mizacEn: 'Choleric', sembol: '🔥', renk: '#c0392b', aciklama: 'Ateş duygular. Yönetilirse güç, yönetilemezse yıkım.', aciklamaEn: 'Fire emotions. When managed: power; when unmanaged: destruction.' },
      { isim: 'Neşe / Sevgi / Heyecan', isimEn: 'Joy / Love / Excitement', mizac: 'Demevî', mizacEn: 'Sanguine', sembol: '💨', renk: '#2980b9', aciklama: 'Hava duyguları. Bağlantı, cömertlik, sosyal enerji.', aciklamaEn: 'Air emotions. Connection, generosity, social energy.' },
      { isim: 'Korku / Kaygı / Şüphe', isimEn: 'Fear / Anxiety / Suspicion', mizac: 'Sevdavî', mizacEn: 'Melancholic', sembol: '🌍', renk: '#7d3c98', aciklama: 'Toprak duyguları. Aşırıya kaçarsa felç edici; dengelenirse koruyucu.', aciklamaEn: 'Earth emotions. When excessive: paralyzing; when balanced: protective.' },
      { isim: 'Huzur / Sabır / Rıza', isimEn: 'Contentment / Patience / Acceptance', mizac: 'Balgamî', mizacEn: 'Phlegmatic', sembol: '💧', renk: '#27ae60', aciklama: 'Su duyguları. İstikrar ve derinlik; ama durağanlığa da yol açabilir.', aciklamaEn: 'Water emotions. Stability and depth; but can also lead to stagnation.' },
    ],
  },
];

export default function VarliginMizaciPage() {
  const { lang } = useLang();
  const tr = lang === 'tr';
  const [aktifKategori, setAktifKategori] = useState('mevsimler');

  const aktif = kategoriler.find(k => k.id === aktifKategori)!;

  return (
    <main className="min-h-screen" style={{ background: 'var(--background)' }}>

      {/* Hero */}
      <section className="py-20 px-4 text-center" style={{ background: 'linear-gradient(180deg, #0f0a04 0%, #1a1207 100%)' }}>
        <div className="max-w-2xl mx-auto">
          <p className="text-xs tracking-widest uppercase mb-6" style={{ color: '#c4973a' }}>
            {tr ? 'İbn-i Sina · Varlık Felsefesi' : 'Ibn Sina · Philosophy of Existence'}
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            {tr ? (
              <>Giydiğin kıyafetin<br /><span style={{ color: '#c4973a' }}>bir mizacı var.</span></>
            ) : (
              <>The clothes you wear<br /><span style={{ color: '#c4973a' }}>have a temperament.</span></>
            )}
          </h1>
          <p className="text-lg leading-relaxed mb-4" style={{ color: '#9a8060' }}>
            {tr
              ? 'Sarı duvarlar seni huzursuz ediyor ama bilmiyorsun neden. İpek gömlek seni bunaltıyor. Kış seni bunaltıyor, yaz seni canlandırıyor — bunlar tesadüf değil.'
              : 'Yellow walls make you restless but you don\'t know why. Silk shirts suffocate you. Winter depresses you, summer energizes you — these are not coincidences.'}
          </p>
          <p className="text-sm" style={{ color: '#6b5230' }}>
            {tr
              ? 'Mevsimler, renkler, kumaşlar, metaller, mekânlar — her şeyin bir mizacı var.'
              : 'Seasons, colors, fabrics, metals, spaces — everything has a temperament.'}
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-12">

        {/* Kategori seçici */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {kategoriler.map(k => (
            <button
              key={k.id}
              onClick={() => setAktifKategori(k.id)}
              className="px-3 py-1.5 rounded-full text-sm font-semibold transition-all"
              style={{
                background: aktifKategori === k.id ? 'var(--earth)' : 'var(--cream)',
                color: aktifKategori === k.id ? 'white' : 'var(--earth)',
                border: '1.5px solid var(--gold-light)',
              }}
            >
              {k.ikon} {tr ? k.baslik : k.baslikEn}
            </button>
          ))}
        </div>

        {/* Aktif kategori içeriği */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          {aktif.items.map((item, i) => (
            <div key={i} className="rounded-2xl p-5 border" style={{ background: item.renk + '12', borderColor: item.renk + '30' }}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{item.sembol}</span>
                <div>
                  <p className="font-bold text-sm" style={{ color: item.renk }}>{tr ? item.isim : item.isimEn}</p>
                  <p className="text-xs opacity-50">{tr ? item.mizac : item.mizacEn}</p>
                </div>
              </div>
              <p className="text-sm opacity-75 leading-relaxed">{tr ? item.aciklama : item.aciklamaEn}</p>
            </div>
          ))}
        </div>

        {/* Email capture */}
        <div className="mt-10">
          <EmailCapture
            title={tr ? 'Hayatındaki her şeyin mizacını öğren' : 'Learn the temperament of everything in your life'}
            subtitle={tr ? 'Her Pazartesi — renkler, mekânlar, mevsimler ve denge rehberi. Ücretsiz.' : 'Every Monday — colors, spaces, seasons and balance guide. Free.'}
            cta={tr ? 'Gönder' : 'Send'}
          />
        </div>

        {/* Share */}
        <div className="flex justify-center mt-8 mb-4">
          <ShareBar
            title="Varlığın Mizacı — mizac.xyz"
            description="Renkler, kumaşlar, metaller, mekânlar, mevsimler — her şeyin bir mizacı var."
            url="https://mizac.xyz/varligin-mizaci"
          />
        </div>

        {/* CTA */}
        <div className="rounded-3xl p-8 text-center" style={{ background: 'linear-gradient(135deg, var(--cream), var(--gold-light))' }}>
          <div className="text-3xl mb-3">✦</div>
          <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>
            {tr ? 'Kendi mizacını keşfet' : 'Discover your own temperament'}
          </h2>
          <p className="opacity-60 text-sm mb-5">{tr ? '50 soruluk ücretsiz test' : '50-question free test'}</p>
          <Link href="/test" className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-bold transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg, var(--earth), var(--gold))' }}>
            ✦ {tr ? 'Testi Başlat' : 'Start Test'}
          </Link>
        </div>

        <p className="text-center text-xs opacity-30 mt-8">Varlığın Tahlili · Zeynep Işık Büyükbay</p>
      </div>
    </main>
  );
}
