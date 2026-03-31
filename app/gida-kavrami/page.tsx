'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShareBar } from '@/components/share-bar';
import { EmailCapture } from '@/components/email-capture';

const gidaTurleri = [
  {
    numara: '01',
    isim: 'Görsel Gıda',
    ikon: '👁️',
    renk: '#7c3aed',
    bg: '#faf5ff',
    border: '#ddd6fe',
    soru: 'Bugün ne kadar ekrana baktın?',
    gercek: 'Gözün gördüğü her şey seni değiştiriyor. Yeşile bakmak gerçekten şifa — bu bir mecaz değil, fizyolojik bir gerçek.',
    detay: 'İslam tıbbında yeşile bakmak, ufka bakmak, anne-babaya bakmak "şifa" sayılır. Hafıza zayıflığı için ufka bakma tavsiyesi bu yüzden verilir. Ekrana uzun süre bakmak ise tersini yapar — retinayı yorar, beyin dalgalarını bozar, uyku döngüsünü kırar.',
    iyi: ['Yeşile, ufka, gökyüzüne bakmak', 'Güneş batışını izlemek', 'Çocuk yüzüne bakmak', 'Kâbe\'ye bakmak'],
    kotu: ['6 saat ekran — her gün', 'Kötü haber akışı', 'Şiddet içerikli görüntüler'],
    viral: 'Instagram\'ı açtığında aldığın görsel gıda ne yapıyor sana? Besleniyor musun, zehirleniyor musun?',
  },
  {
    numara: '02',
    isim: 'İşitsel Gıda',
    ikon: '👂',
    renk: '#1d4ed8',
    bg: '#eff6ff',
    border: '#bfdbfe',
    soru: 'Bugün ne dinledin?',
    gercek: 'Kulaklarından geçen her ses sinir sisteminizi şekillendiriyor. Müzik beyin kimyasını değiştirir — bu metafor değil, ölçülebilir bir gerçek.',
    detay: 'Enstrümantal müzik beyin dalgalarını düzenler. Kur\'an tilaveti kalp atışını stabilize eder. Doğa sesleri parasempatik sistemi aktive eder — stres hormonlarını düşürür. Buna karşın yüksek bas müzik kortizol artışına yol açar. Güzel söz serotonin, kaba söz kortizol salgılatır.',
    iyi: ['Kuş sesleri, nehir sesi', 'Enstrümantal klasik müzik', 'Kur\'an tilaveti', 'Sessizlik'],
    kotu: ['Sürekli gürültü', 'Yüksek bas ritim', 'Tartışma sesleri', 'Haber sesi fon müziği'],
    viral: 'Sabah uyandığında ilk duyduğun ses ne? O ses o günün tonunu belirliyor.',
  },
  {
    numara: '03',
    isim: 'Kokusal Gıda',
    ikon: '🌸',
    renk: '#be185d',
    bg: '#fdf2f8',
    border: '#fbcfe8',
    soru: 'Son ne zaman güzel bir koku aldın?',
    gercek: 'Koku, hafızayla doğrudan bağlantılıdır — eski anıları saniyeler içinde canlandırır. Ama aynı zamanda anlık kimyayı da değiştiriyor.',
    detay: 'Lavanta kortizolü düşürür. Gül kalbi açar, mizacı ısıtır. Nane odaklanmayı artırır. Günlük (frankincense) zihni açar. Çörek otu bağışıklığı güçlendirir. Kötü koku ise tersini yapar — bilinçsizce savunma moduna geçersin. Kokuyu aldığında içe çekerken eğilip doğrulmak etkisini katlayarak artırır.',
    iyi: ['Lavanta (uyku öncesi)', 'Gül suyu', 'Taze nane', 'Günlük tütsü', 'Çörek otu yağı'],
    kotu: ['Kimyasal parfüm', 'Sigara dumanı', 'Tıkanan hava'],
    viral: 'Eski bir kokuyu kokladığında neden birden o yıla dönersin? Çünkü koku beyinde en son silinen şeydir.',
  },
  {
    numara: '04',
    isim: 'Tensel Gıda',
    ikon: '🤲',
    renk: '#b45309',
    bg: '#fffbeb',
    border: '#fde68a',
    soru: 'Ne zaman son kez bir şeye dokundun — ya da bir şey sana dokundu?',
    gercek: 'Dokunmak bir lüks değil, biyolojik bir ihtiyaç. Dokunuşsuz büyüyen bebekler gelişemiyor. Dokunuşsuz yaşayan yetişkinler de bir şekilde kuruyuyor.',
    detay: 'Sevgi dolu bir dokunuş oksitosin salgılatır — bağlanma hormonu. Kaba bir temas kortizol yükseltir. Güneşin cilde teması D vitamini üretir. Toprağa çıplak basmak vücuttaki statik elektriği boşaltır, sinir sistemini sakinleştirir — buna "earthing" deniyor.',
    iyi: ['Sevgi dolu kucak', 'Sabah güneşi', 'Yürüyüş — toprağa basmak', 'Su ile temas', 'Masaj'],
    kotu: ['Dokunuşsuzluk', 'Soğuk, steril ortamlar', 'Sürekli yapay ışık'],
    viral: 'Bugün kimseyle gerçek bir temas yaşamadıysan, beden aç demektir. Telefon ekranı temas sayılmaz.',
  },
  {
    numara: '05',
    isim: 'Duygusal Gıda',
    ikon: '💫',
    renk: '#047857',
    bg: '#ecfdf5',
    border: '#a7f3d0',
    soru: 'Bu hafta en çok hangi duyguyu yaşadın?',
    gercek: 'Duygular bedenin iç kimyasını doğrudan değiştirir. Sevilmemek kilo aldırır. Kıskançlık kaşındırır. Kronik öfke mideyi yakar. Bu bir metafor değil, biyokimyasal bir gerçek.',
    detay: 'Duygusal gıda en hızlı etki eden ve en uzun süre kalıcı olan türdür. Minnet ve şükran bağışıklık sistemini güçlendirir. Sevilmek ve takdir görmek hormonal dengeyi sağlar. Kronik ilgisizlik hissi metabolizmayı yavaşlatır. Bu yüzden ilişkiler, toplantılar, konuşmalar — hepsi seni besler ya da zehirler.',
    iyi: ['Sevildiğini hissetmek', 'Takdir görmek', 'Minnet etmek', 'Affetmek', 'Güvende hissetmek'],
    kotu: ['Kronik ilgisizlik', 'Sürekli eleştiri', 'Kıskançlık', 'Ayrılık acısı', 'Bastırılmış öfke'],
    viral: 'Bir ilişki ya da iş yeri seni besliyor mu yoksa zehirliyor mu? Beden cevabı biliyor — sen sorman yeter.',
  },
  {
    numara: '06',
    isim: 'Ağızdan Alınan Gıda',
    ikon: '🍊',
    renk: '#c2410c',
    bg: '#fff7ed',
    border: '#fed7aa',
    soru: 'Bu mevsimde ne yiyorsun?',
    gercek: 'Ağızdan alınan gıda tek gıda değil — ama mizaç üzerinde en somut etkiyi yapan türdür. Mevsimde yetişeni yemek tesadüf değil, kadim bir denge sistemidir.',
    detay: 'İbn-i Sina\'ya göre Allah her mevsimde o mevsimi dengeleyen gıdaları gönderir. Yazın kavun ve karpuz çıkar çünkü vücudu soğutur. Kışın zencefil ve tarçın çıkar çünkü ısıtır. Çok su içmek balgamı artırır, unutkanlığa yol açar. Sirke sinirlilik yapar. Türk kahvesi kalbi uyarır. Her gıdanın bir mizacı var — ve mizacınla çakışmayan gıdayı yediğinde beden konuşmaya başlar.',
    iyi: ['Mevsim meyveleri', 'Zencefil & tarçın (kış)', 'Kavun & karpuz (yaz)', 'Baharat — dengeli'],
    kotu: ['Mevsim dışı yemek', 'Aşırı su', 'Sürekli sirke', 'Mizacına ters gıdalar'],
    viral: 'Kış aylarında soğuk meyve suyu içersen mevsime değil, modaya uyuyorsun. İbn-i Sina bunu 1000 yıl önce yazdı.',
  },
];

const musliOrnekler = [
  { gida: 'Kuru Hurma', musli: 'Tereyağı', sebep: 'Hz. Peygamber\'in sünneti. Hurmanın ısıtıcı etkisini tereyağı dengeleyerek sindirime kolaylık sağlar.' },
  { gida: 'Kuzu Eti', musli: 'Acur / Salatalık', sebep: 'Etin sıcak-kuru yapısını soğuk-ıslak salatalık dengeler. Mide rahatsızlığını önler.' },
  { gida: 'Yoğurt', musli: 'Kuru Nane', sebep: 'Yoğurdun soğukluğunu nane ısıtır. Şişkinlik ve gaz oluşumunu önler.' },
  { gida: 'Soğan', musli: 'Limon Suyu', sebep: 'Soğanın ısıtıcı etkisini limon dengeler. Ağız kokusu azalır, sindirim kolaylaşır.' },
  { gida: 'Balık', musli: 'Zencefil', sebep: 'Balığın soğuk-ıslak yapısını zencefil ısıtır. Balgam artışını önler.' },
  { gida: 'Greyfurt', musli: 'Bal', sebep: 'Greyfurtun soğukluğunu balın sıcaklığı dengeler. Bağışıklığı güçlendirir.' },
];

const mevsimGida = [
  { mevsim: 'Kış', ikon: '❄️', gidaMizaci: 'Sıcak & Kuru', ornekler: 'Zencefil, tarçın, karanfil, kırmızı et, mercimek', sebep: 'Soğuğu ısıtmak, bağışıklığı güçlendirmek, enerji vermek.' },
  { mevsim: 'İlkbahar', ikon: '🌸', gidaMizaci: 'Soğuk & Islak', ornekler: 'Kiraz, çilek, yeşil yapraklılar, marul', sebep: 'Kışın biriken kanı sulandırmak, kan oluşumunu dengelemek.' },
  { mevsim: 'Yaz', ikon: '☀️', gidaMizaci: 'Soğuk & Islak', ornekler: 'Kavun, karpuz, salatalık, yoğurt, nane', sebep: 'Vücut ısısını düşürmek, sıvı dengesini korumak.' },
  { mevsim: 'Sonbahar', ikon: '🍂', gidaMizaci: 'Sıcak & Kuru', ornekler: 'Kabak, balkabağı, elma, nar, bal', sebep: 'Kışa hazırlık — bağışıklığı oluşturmak, mineralleri depolamak.' },
];

export default function GidaKavramiPage() {
  const [aktif, setAktif] = useState(0);
  const [sekme, setSekme] = useState<'gidalar' | 'musli' | 'mevsim'>('gidalar');
  const secili = gidaTurleri[aktif];

  return (
    <main className="min-h-screen bg-white">

      {/* Hero */}
      <section className="py-20 px-4 text-center" style={{ background: 'linear-gradient(180deg, #0f0a04 0%, #1a1207 100%)' }}>
        <div className="max-w-2xl mx-auto">
          <p className="text-xs tracking-widest uppercase mb-6" style={{ color: '#c4973a' }}>İbn-i Sina · Gıda Bilimi</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Dün kaç şey<br />
            <span style={{ color: '#c4973a' }}>yedin?</span>
          </h1>
          <p className="text-xl font-semibold mb-4" style={{ color: '#e8d5a3' }}>
            Sadece tabağındaki değil.
          </p>
          <p className="text-lg leading-relaxed mb-8" style={{ color: '#9a8060' }}>
            Gördüğün, duyduğun, kokladığın, dokunduğun, hissettiğin her şey —
            bedenine bir şeyler bırakıyor. İbn-i Sina bunu 6 kategoride yazdı.
          </p>
          <div className="inline-block rounded-2xl px-6 py-3" style={{ background: 'rgba(196, 151, 58, 0.1)', border: '1px solid rgba(196, 151, 58, 0.3)' }}>
            <p className="text-sm font-medium" style={{ color: '#c4973a' }}>
              ↓ Altısını da incele — her birinde kendini bulacaksın.
            </p>
          </div>
        </div>
      </section>

      {/* Tanım */}
      <section className="py-12 px-4" style={{ background: '#fef9f0' }}>
        <div className="max-w-2xl mx-auto text-center">
          <div className="rounded-3xl p-8" style={{ background: 'white', border: '1px solid #e8d5b0' }}>
            <div className="text-4xl mb-4">📖</div>
            <h2 className="text-xl font-bold mb-3" style={{ color: '#3d2c0e' }}>Gıda nedir?</h2>
            <p className="leading-relaxed mb-4" style={{ color: '#5c3d1e' }}>
              Gıda; insana dışarıdan giren ve onu değiştiren her şeydir. Soyut ya da somut, görünen ya da görünmeyen.
            </p>
            <p className="text-sm italic" style={{ color: '#9a8060' }}>
              &ldquo;Portakal yediğinde C vitamini alıyorsun. Lavanta kokladığında uyku gelmesi de lavantadan gıda aldığın anlamına gelir.&rdquo;
            </p>
            <p className="text-xs mt-2" style={{ color: '#c4a96a' }}>— Zeynep Işık Büyükbay, Varlığın Tahlili</p>
          </div>
        </div>
      </section>

      {/* Sekmeler */}
      <section className="py-4 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center gap-2 mb-10">
            {[
              { id: 'gidalar', label: '🌿 6 Çeşit Gıda' },
              { id: 'musli', label: '⚖️ Müslih' },
              { id: 'mevsim', label: '🍂 Mevsim & Gıda' },
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => setSekme(s.id as 'gidalar' | 'musli' | 'mevsim')}
                className="px-5 py-2.5 rounded-full font-semibold text-sm transition-all"
                style={{
                  background: sekme === s.id ? '#1a1207' : 'white',
                  color: sekme === s.id ? '#c4973a' : '#5c3d1e',
                  border: `1px solid ${sekme === s.id ? '#1a1207' : '#e8d5b0'}`,
                }}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* 6 Çeşit Gıda */}
          {sekme === 'gidalar' && (
            <div>
              {/* Numara seçici */}
              <div className="flex gap-3 overflow-x-auto pb-3 mb-8 justify-center flex-wrap">
                {gidaTurleri.map((g, idx) => (
                  <button
                    key={g.isim}
                    onClick={() => setAktif(idx)}
                    className="rounded-2xl px-4 py-3 transition-all shrink-0 text-center"
                    style={{
                      background: aktif === idx ? g.renk : 'white',
                      color: aktif === idx ? 'white' : '#5c3d1e',
                      border: `1px solid ${aktif === idx ? g.renk : '#e8d5b0'}`,
                    }}
                  >
                    <div className="text-xl mb-1">{g.ikon}</div>
                    <div className="text-xs font-bold">{g.isim}</div>
                  </button>
                ))}
              </div>

              {/* Detay kartı */}
              <div className="rounded-3xl p-8" style={{ background: secili.bg, border: `1px solid ${secili.border}` }}>
                {/* Soru */}
                <div className="mb-6 text-center">
                  <span className="text-xs font-bold tracking-widest uppercase" style={{ color: secili.renk }}>
                    Kendine sor
                  </span>
                  <p className="text-2xl font-bold mt-2" style={{ color: '#3d2c0e' }}>
                    {secili.soru}
                  </p>
                </div>

                {/* Gerçek */}
                <div className="rounded-2xl p-5 mb-5 border-l-4" style={{ background: 'white', borderLeftColor: secili.renk }}>
                  <p className="font-semibold leading-relaxed" style={{ color: '#3d2c0e' }}>
                    {secili.gercek}
                  </p>
                </div>

                <p className="text-sm leading-relaxed mb-6" style={{ color: '#5c3d1e' }}>
                  {secili.detay}
                </p>

                {/* İyi / Kötü */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="rounded-xl p-4" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                    <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#15803d' }}>Besleyen</p>
                    {secili.iyi.map((i) => (
                      <p key={i} className="text-sm mb-1" style={{ color: '#15803d' }}>✓ {i}</p>
                    ))}
                  </div>
                  <div className="rounded-xl p-4" style={{ background: '#fff1f2', border: '1px solid #fecdd3' }}>
                    <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#be123c' }}>Zehirleyen</p>
                    {secili.kotu.map((k) => (
                      <p key={k} className="text-sm mb-1" style={{ color: '#be123c' }}>✗ {k}</p>
                    ))}
                  </div>
                </div>

                {/* Viral quote */}
                <div className="rounded-2xl p-5 text-center" style={{ background: '#1a1207' }}>
                  <p className="italic font-medium" style={{ color: '#e8d5a3' }}>
                    &ldquo;{secili.viral}&rdquo;
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Müslih */}
          {sekme === 'musli' && (
            <div>
              <div className="rounded-3xl p-8 mb-8 max-w-2xl mx-auto" style={{ background: '#fef9f0', border: '1px solid #e8d5b0' }}>
                <h2 className="text-xl font-bold mb-3" style={{ color: '#3d2c0e' }}>Müslih nedir?</h2>
                <p className="leading-relaxed text-sm mb-4" style={{ color: '#5c3d1e' }}>
                  Her gıdanın bir mizacı var. Ama bazı gıdalar çok ısıtır, bazısı çok soğutur — yan etkisi olur.
                  Müslih, o gıdanın yanına konan ve dengeyi sağlayan eşlidir.
                </p>
                <div className="rounded-xl p-4 text-center" style={{ background: 'white', border: '1px solid #e8d5b0' }}>
                  <p className="font-bold mb-1" style={{ color: '#3d2c0e' }}>
                    Hz. Peygamber (S.A.V.):
                  </p>
                  <p className="text-sm italic" style={{ color: '#7c4a1e' }}>
                    &ldquo;Kuru hurma yerseniz tereyağı da tüketin.&rdquo;
                  </p>
                  <p className="text-xs mt-2" style={{ color: '#9a8060' }}>
                    Bu bir diyet tavsiyesi değildi — tıbbi bir denge bilimiydi.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {musliOrnekler.map((item) => (
                  <div key={item.gida} className="rounded-2xl p-5" style={{ background: 'white', border: '1px solid #e8d5b0' }}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="rounded-xl px-4 py-2 text-sm font-bold" style={{ background: '#fef9f0', color: '#7c4a1e', border: '1px solid #e8d5b0' }}>
                        {item.gida}
                      </div>
                      <span style={{ color: '#c4973a', fontWeight: 'bold' }}>+</span>
                      <div className="rounded-xl px-4 py-2 text-sm font-bold" style={{ background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0' }}>
                        {item.musli}
                      </div>
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: '#7a6040' }}>{item.sebep}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mevsim */}
          {sekme === 'mevsim' && (
            <div>
              <div className="text-center mb-8">
                <p className="font-semibold mb-2" style={{ color: '#3d2c0e' }}>
                  Allah her mevsimde o mevsimi dengeleyen gıdaları gönderir.
                </p>
                <p className="text-sm" style={{ color: '#9a8060' }}>
                  Mevsiminde yetişeni yemek moda değil — kadim bir denge bilimidir.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {mevsimGida.map((m) => (
                  <div key={m.mevsim} className="rounded-2xl p-6" style={{ background: 'white', border: '1px solid #e8d5b0' }}>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-3xl">{m.ikon}</span>
                      <div>
                        <h3 className="text-lg font-bold" style={{ color: '#3d2c0e' }}>{m.mevsim}</h3>
                        <span className="text-xs font-semibold" style={{ color: '#c4973a' }}>{m.gidaMizaci}</span>
                      </div>
                    </div>
                    <p className="text-sm mb-3" style={{ color: '#5c3d1e' }}>
                      <span className="font-semibold">Örnekler:</span> {m.ornekler}
                    </p>
                    <div className="rounded-xl p-3 text-xs" style={{ background: '#fef9f0', color: '#7a6040' }}>
                      {m.sebep}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-2xl p-5 text-center" style={{ background: '#1a1207' }}>
                <p className="font-bold text-white mb-1">Prensip</p>
                <p className="text-sm" style={{ color: '#9a8060' }}>
                  Mevsimin zıt mizaçlı gıdalarıyla beslenmek, bedeni dengeye getirir.
                  Yaz sıcağında soğuk gıdalar, kış soğuğunda sıcak gıdalar.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Viral summary */}
      <section className="py-16 px-4" style={{ background: '#1a1207' }}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Her şey seni besler ya da zehirler.
          </h2>
          <p className="mb-10" style={{ color: '#9a8060' }}>
            Bunu bilmek, hayatına farklı bakmak demek.
          </p>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {gidaTurleri.map((g) => (
              <button
                key={g.isim}
                onClick={() => { setSekme('gidalar'); setAktif(gidaTurleri.indexOf(g)); window.scrollTo({ top: 500, behavior: 'smooth' }); }}
                className="rounded-2xl p-4 text-center transition-all hover:scale-105"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <div className="text-2xl mb-1">{g.ikon}</div>
                <div className="text-xs font-bold" style={{ color: '#c4973a' }}>{g.isim.split(' ')[0]}</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Email capture */}
      <section className="py-4 px-4">
        <div className="max-w-2xl mx-auto">
          <EmailCapture
            title="Haftalık beslenme ve denge rehberi"
            subtitle="Mizacına göre ne yemeli, ne dinlemeli, ne hissetmeli — her Pazartesi."
            cta="Gönder"
          />
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 text-center" style={{ background: '#fef9f0' }}>
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-center mb-8">
            <ShareBar
              title="6 Çeşit Gıda — Gördüğün, Duyduğun, Hissettiğin Her Şey"
              description="Gıda sadece tabağındaki değil. İbn-i Sina'nın 1000 yıllık bilim anlayışı."
              url="https://mizac.xyz/gida-kavrami"
            />
          </div>
          <h2 className="text-2xl font-bold mb-3" style={{ color: '#3d2c0e' }}>
            Hangi gıdalar sana iyi geliyor?
          </h2>
          <p className="mb-8" style={{ color: '#9a8060' }}>
            Önce mizacını öğren — sonra bedenini neyin beslediğini, neyin zehirlediğini anlarsın.
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
              href="/tarifler"
              className="px-8 py-3 rounded-full font-semibold border-2 hover:scale-105 transition-all"
              style={{ borderColor: '#c4973a', color: '#7c4a1e' }}
            >
              Mizaca Özel Tarifler →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
