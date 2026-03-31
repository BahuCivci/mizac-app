'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShareBar } from '@/components/share-bar';
import { EmailCapture } from '@/components/email-capture';

const organEsmalar = [
  { organ: 'Adaleler', esma: 'El-Kavî', anlam: 'Güç veren, kuvvetlendiren' },
  { organ: 'Akciğerler', esma: 'Er-Râzık', anlam: 'Rızkı veren, besleyen' },
  { organ: 'Atardamarlar', esma: 'El-Cebbâr', anlam: 'İradesiyle kıran, onaran' },
  { organ: 'Bacaklar', esma: "Er-Râfi'", anlam: 'Yükselten, kaldıran' },
  { organ: 'Bağırsaklar', esma: 'Es-Sabûr', anlam: 'Cezada acele etmeyen' },
  { organ: 'Böbrekler', esma: 'El-Hayy', anlam: 'Diri olan, hayat veren' },
  { organ: 'Burun', esma: 'El-Latîf · El-Ganî · Er-Rahîm', anlam: 'İnce işleyen · İhtiyaçsız · Merhametli' },
  { organ: 'Dizler', esma: "Er-Ra'ûf", anlam: 'Çok şefkatli olan' },
  { organ: 'Göz Damarları', esma: "El-Müteâl", anlam: 'Çok yüce olan' },
  { organ: 'Gözler', esma: 'En-Nûr · El-Basîr · El-Vehhâb', anlam: 'Nurlandıran · Gören · Çok bağışlayan' },
  { organ: 'Göz Siniri', esma: "Ez-Zâhir", anlam: 'Açıkça var olan, görünen' },
  { organ: 'Guatr', esma: 'El-Cebbâr', anlam: 'İradesiyle onaran, kıran' },
  { organ: 'İdrar Kesesi', esma: 'El-Hâdî · El-Vehhâb · En-Nûr · Er-Rezzâk · En-Nâfi · Es-Semî', anlam: 'Hidayet veren · Bağışlayan · Nurlandıran · Rızkı veren · Fayda veren · İşiten' },
];

const mizacEsmalar = [
  {
    id: 'safravi',
    isim: 'Safravî',
    element: '🔥',
    renk: '#c05c1a',
    bg: '#fff8f0',
    border: '#f5c09a',
    acilis: 'Öfkeni söndürmek için güç değil, af gerekiyor. Bu esmalar o kapıyı açıyor.',
    esmalar: [
      { esma: 'Ya Tevvâb', anlam: 'Tövbeleri kabul eden', sebep: 'Öfkeden doğan pişmanlığı dönüştürür — mide ve safra kesesine şifa verir.' },
      { esma: 'Ya Selîm', anlam: 'Esenlik veren', sebep: 'İç yangını söndürür, sindirim sistemini sakinleştirir.' },
      { esma: 'Ya Afüvv', anlam: 'Çok affeden', sebep: 'Öfke ve kin tutma eğilimini nazikçe çözer.' },
      { esma: 'Ya Gafûr', anlam: 'Çok bağışlayan', sebep: 'İç hesaplaşmayı kolaylaştırır, vicdanı dindirir.' },
      { esma: 'Ya Kaviyy', anlam: 'Güç veren', sebep: 'Ateş enerjisini dengeleyerek güce çevirir.' },
      { esma: 'Ya Metîn', anlam: 'Pek güçlü olan', sebep: 'Kontrolsüz enerjiyi istikrara kavuşturur.' },
    ],
  },
  {
    id: 'demevi',
    isim: 'Demevî',
    element: '💧',
    renk: '#be185d',
    bg: '#fff5f9',
    border: '#f9a8d4',
    acilis: 'Her şeyi o kadar hissediyorsun ki bazen beyin durdurulamıyor. Bu esmalar ritim kuruyor.',
    esmalar: [
      { esma: 'Ya Hasîb', anlam: 'Hesap gören', sebep: 'Aşırı coşku ve heyecanı dengeleyerek kan dolaşımını sakinleştirir.' },
      { esma: 'Ya Halîm', anlam: 'Yumuşak davranan', sebep: 'Kalp ve karaciğere yumuşaklık ve huzur getirir.' },
      { esma: 'Ya Vedûd', anlam: 'Seven, sevilen', sebep: 'Duygusal yoğunluğu sevgiye dönüştürür, kalbi besler.' },
      { esma: 'Ya Hafîz', anlam: 'Koruyan', sebep: 'Kan ve dolaşım sistemini korur.' },
      { esma: 'Ya Selâm', anlam: 'Esenlik kaynağı', sebep: 'Zihinsel ve bedensel huzuru pekiştirir.' },
      { esma: "Ya Bâri'", anlam: 'Her şeyi mükemmel yaratan', sebep: 'Yeniden dengelenmeye ve yaratıcılığa ilham verir.' },
    ],
  },
  {
    id: 'balgami',
    isim: 'Balgamî',
    element: '🌊',
    renk: '#1e6fb5',
    bg: '#f0f8ff',
    border: '#93c5fd',
    acilis: 'Söyleyemediklerin birikmeden önce bu esmalar ifade kapısını açıyor.',
    esmalar: [
      { esma: 'Ya Muksit', anlam: 'Adaletli olan', sebep: 'Vücuttaki su dengesini ve akış sistemini düzenler.' },
      { esma: 'Ya Sabûr', anlam: 'Sabreden', sebep: 'Ağır metabolizmayı destekler; bekleme kapasitesini güçlendirir.' },
      { esma: 'Ya Muhyî', anlam: 'Hayat veren, dirilten', sebep: 'Akciğerlere ve lenf sistemine canlılık kazandırır.' },
      { esma: 'Ya Hâdî', anlam: 'Hidayet veren', sebep: 'Boğaz çakrasını açar; ifade gücünü geliştirir.' },
      { esma: "Ya Hâkem", anlam: 'Hükmeden', sebep: 'İçsel karar alma gücünü pekiştirir.' },
      { esma: 'Ya Şekûr', anlam: 'Çok şükreden', sebep: 'Şükran duygusunu uyandırarak enerji akışını canlandırır.' },
    ],
  },
  {
    id: 'sovdavi',
    isim: 'Sovdavî',
    element: '🌍',
    renk: '#44403c',
    bg: '#fafaf9',
    border: '#c8c4bc',
    acilis: 'Aklındaki karanlık düşünceler bir düşünce değil, bir hılt durumudur. Bu esmalar ışık tutuyor.',
    esmalar: [
      { esma: 'Ya Hayy', anlam: 'Diri, canlı olan', sebep: 'Kronik yorgunluğa ve cansızlığa karşı yaşam enerjisi verir.' },
      { esma: "Ya Bâsid", anlam: 'Genişleten, açan', sebep: 'İçe kapanma eğilimini açılıma çevirir.' },
      { esma: "Er-Râşid", anlam: 'Doğruya ulaştıran', sebep: 'Derin analitik zihni aydınlatır, vesveseden kurtarır.' },
      { esma: 'Ya Mâlik el-Mülk', anlam: 'Mülkün gerçek sahibi', sebep: 'Kontrolü bırakma güçlüğünü aşmaya yardımcı olur.' },
      { esma: "Ya Sâni'", anlam: 'Her şeyi yapan, sanat yaratan', sebep: 'Yaratıcılığı canlandırır, rutinin dışına çıkarır.' },
      { esma: 'Ya Muksid', anlam: 'Doğru yolu gösteren', sebep: 'Karanlık düşüncelere yön verir, zihinsel ağırlığı hafifletir.' },
    ],
  },
];

export default function EsmaSifaPage() {
  const [aktifSekme, setAktifSekme] = useState<'organ' | 'mizac' | 'nasil'>('organ');
  const [aktifMizac, setAktifMizac] = useState('safravi');
  const seciliMizac = mizacEsmalar.find(m => m.id === aktifMizac)!;

  return (
    <main className="min-h-screen bg-white">

      {/* Hero */}
      <section className="py-20 px-4 text-center" style={{ background: 'linear-gradient(180deg, #0f1a0f 0%, #0d2010 100%)' }}>
        <div className="max-w-2xl mx-auto">
          <p className="text-xs tracking-widest uppercase mb-6" style={{ color: '#6ee7b7' }}>Esmaü&apos;l-Hüsna · Şifa Bilimi</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Her organının<br />
            <span style={{ color: '#6ee7b7' }}>bir ilâhî ismi var.</span>
          </h1>
          <p className="text-lg leading-relaxed mb-6" style={{ color: '#9abfa0' }}>
            Bunu bilmiyordun, değil mi? Gözlerin En-Nûr&apos;un aynasıdır.
            Akciğerlerin Er-Râzık&apos;ı çağırır. Dizlerin Er-Ra&apos;ûf&apos;u tanır.
          </p>
          <p className="text-base mb-8" style={{ color: '#6a8f70' }}>
            İbn-i Sina geleneğinde her hastalık, her organ ve her mizacın
            şifa bulduğu bir isim vardır. Bu sayfa o haritayı açıyor.
          </p>
          <div className="inline-block rounded-2xl px-6 py-3" style={{ background: 'rgba(110, 231, 183, 0.08)', border: '1px solid rgba(110, 231, 183, 0.2)' }}>
            <p className="text-sm font-medium" style={{ color: '#6ee7b7' }}>
              ↓ Organ haritasından başla — sonra mizacına geç.
            </p>
          </div>
        </div>
      </section>

      {/* Sekmeler */}
      <section className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center gap-2 mb-10">
            {[
              { id: 'organ', label: '🫁 Organ Haritası' },
              { id: 'mizac', label: '✨ Mizacıma Göre' },
              { id: 'nasil', label: '📿 Nasıl Okunur?' },
            ].map((sekme) => (
              <button
                key={sekme.id}
                onClick={() => setAktifSekme(sekme.id as 'organ' | 'mizac' | 'nasil')}
                className="px-5 py-2.5 rounded-full font-semibold text-sm transition-all"
                style={{
                  background: aktifSekme === sekme.id ? '#0d2010' : 'white',
                  color: aktifSekme === sekme.id ? '#6ee7b7' : '#3d4a3d',
                  border: `1px solid ${aktifSekme === sekme.id ? '#0d2010' : '#c8d9c8'}`,
                }}
              >
                {sekme.label}
              </button>
            ))}
          </div>

          {/* Organ Haritası */}
          {aktifSekme === 'organ' && (
            <div>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2" style={{ color: '#1a2e1a' }}>Hangi organın rahatsız?</h2>
                <p className="text-sm" style={{ color: '#6a8f70' }}>
                  Karşısındaki isimle dua et. Bu, eski tıbbın formülüdür.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {organEsmalar.map((item) => (
                  <div
                    key={item.organ}
                    className="rounded-2xl p-5"
                    style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold shrink-0"
                        style={{ background: '#dcfce7', color: '#15803d' }}
                      >
                        {item.organ.slice(0, 2)}
                      </div>
                      <div>
                        <div className="font-bold" style={{ color: '#1a2e1a' }}>{item.organ}</div>
                        <div className="font-semibold text-sm mt-0.5" style={{ color: '#15803d' }}>{item.esma}</div>
                        <div className="text-xs mt-1 italic" style={{ color: '#6a8f70' }}>{item.anlam}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 rounded-2xl p-5 text-center" style={{ background: '#0d2010', border: '1px solid rgba(110,231,183,0.15)' }}>
                <p className="font-semibold text-white mb-1">
                  Bu bilgi nereden geliyor?
                </p>
                <p className="text-sm" style={{ color: '#6a8f70' }}>
                  Zeynep Işık Büyükbay&apos;ın &quot;Varlığın Tahlili&quot; kitabından — İbn-i Sina geleneğini Türkçeye taşıyan eser.
                </p>
              </div>
            </div>
          )}

          {/* Mizaca Göre Esmalar */}
          {aktifSekme === 'mizac' && (
            <div>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2" style={{ color: '#1a2e1a' }}>
                  Mizacının şifa kapısı
                </h2>
                <p className="text-sm" style={{ color: '#6a8f70' }}>
                  Her mizacın dengeye kavuştuğu ilâhî isimler farklıdır.
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-3 mb-8">
                {mizacEsmalar.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setAktifMizac(m.id)}
                    className="px-5 py-2.5 rounded-full font-semibold text-sm transition-all"
                    style={{
                      background: aktifMizac === m.id ? m.renk : 'white',
                      color: aktifMizac === m.id ? 'white' : '#3d4a3d',
                      border: `1px solid ${aktifMizac === m.id ? m.renk : '#c8d9c8'}`,
                    }}
                  >
                    {m.element} {m.isim}
                  </button>
                ))}
              </div>

              <div className="rounded-3xl p-8" style={{ background: seciliMizac.bg, border: `1px solid ${seciliMizac.border}` }}>
                {/* Açılış */}
                <div className="rounded-2xl p-5 mb-6 border-l-4" style={{ background: 'white', borderLeftColor: seciliMizac.renk }}>
                  <p className="font-semibold leading-relaxed" style={{ color: '#1a2e1a' }}>
                    {seciliMizac.acilis}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {seciliMizac.esmalar.map((e) => (
                    <div key={e.esma} className="rounded-2xl p-5" style={{ background: 'white' }}>
                      <div className="text-xl font-bold mb-1" style={{ color: seciliMizac.renk }}>{e.esma}</div>
                      <div className="text-sm italic mb-2" style={{ color: '#6a8f70' }}>&ldquo;{e.anlam}&rdquo;</div>
                      <div className="text-xs leading-relaxed pt-2" style={{ borderTop: '1px solid #f0f0f0', color: '#5c3d1e' }}>
                        {e.sebep}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Nasıl Okunur */}
          {aktifSekme === 'nasil' && (
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2" style={{ color: '#1a2e1a' }}>Nasıl okunur?</h2>
                <p className="text-sm" style={{ color: '#6a8f70' }}>
                  Esma salt tekrar değil — bilinçli bir açılımdır.
                </p>
              </div>

              <div className="space-y-4 mb-10">
                {[
                  { adim: '1', baslik: 'Temizlen', aciklama: 'Abdest al ya da ellerini yıka. Temizlik, bedenin ve zihnin alma kapasitesini açar.' },
                  { adim: '2', baslik: 'Niyet et', aciklama: '"Ya Rabbi, bu isminle şifa dilerim" diye kalben niyet et. Niyet, esmanın yönünü belirler.' },
                  { adim: '3', baslik: 'Tekrarla', aciklama: 'Esmayı 33, 66 veya 99 kez oku. Nefes alırken içine çek, verirken söyle.' },
                  { adim: '4', baslik: 'Dua et', aciklama: 'Ardından içten bir dua yap. Esma duanın anahtarıdır — kapıyı açar, içeri girmen sana kalır.' },
                ].map((adim) => (
                  <div key={adim.adim} className="rounded-2xl p-6 flex gap-5" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shrink-0 text-white"
                      style={{ background: '#15803d' }}
                    >
                      {adim.adim}
                    </div>
                    <div>
                      <div className="font-bold mb-1" style={{ color: '#1a2e1a' }}>{adim.baslik}</div>
                      <div className="text-sm leading-relaxed" style={{ color: '#4a6a4a' }}>{adim.aciklama}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-3xl p-8 text-center" style={{ background: '#0d2010', border: '1px solid rgba(110,231,183,0.15)' }}>
                <div className="text-3xl mb-4">📿</div>
                <h3 className="font-bold text-white text-xl mb-4">Tesbih sayıları</h3>
                <div className="flex justify-center gap-8" style={{ color: '#6ee7b7' }}>
                  {[{ sayi: '33', etiket: 'Başlangıç' }, { sayi: '66', etiket: 'Orta' }, { sayi: '99', etiket: 'Tam döngü' }].map((t) => (
                    <div key={t.sayi} className="text-center">
                      <div className="text-3xl font-bold">{t.sayi}</div>
                      <div className="text-xs mt-1 opacity-60">{t.etiket}</div>
                    </div>
                  ))}
                </div>
                <p className="text-sm mt-5 leading-relaxed" style={{ color: '#6a8f70' }}>
                  Allah&apos;ın 99 ismi vardır. Her birini 99 kez okumak bir tam döngüdür.
                  Nefes alırken içine çek, nefes verirken söyle.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Email capture */}
      <section className="py-4 px-4">
        <div className="max-w-2xl mx-auto">
          <EmailCapture
            title="Haftalık esma ve şifa rehberi"
            subtitle="Her Pazartesi — mizacına göre o haftanın esması ve pratiği. Ücretsiz."
            cta="Gönder"
          />
        </div>
      </section>

      {/* Share + CTA */}
      <section className="py-16 px-4 text-center" style={{ background: '#0d2010' }}>
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-center mb-8">
            <ShareBar
              title="Her Organının Bir İlâhî İsmi Var — Esmaü'l-Hüsna ile Şifa"
              description="Allah'ın 99 ismi ve organ haritası. Mizacına göre şifa olan esmalar."
              url="https://mizac.xyz/esma-sifa"
            />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">
            Mizacını bilmeden esma seçme.
          </h2>
          <p className="mb-8" style={{ color: '#6a8f70' }}>
            Anahtarsız kapı aramak gibidir. Önce mizacını öğren, sonra şifa kapını aç.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/test"
              className="px-8 py-3 rounded-full font-bold text-white hover:scale-105 transition-all"
              style={{ background: 'linear-gradient(135deg, #15803d, #4ade80)' }}
            >
              ✦ Mizaç Testini Yap
            </Link>
            <Link
              href="/hastaliklar"
              className="px-8 py-3 rounded-full font-semibold border-2 hover:scale-105 transition-all"
              style={{ borderColor: '#6ee7b7', color: '#6ee7b7' }}
            >
              Hastalık & Mizaç →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
