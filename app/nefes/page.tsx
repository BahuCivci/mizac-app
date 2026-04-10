'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShareBar } from '@/components/share-bar';
import { EmailCapture } from '@/components/email-capture';

const nefesler = [
  {
    id: 'safravi',
    isim: 'Safravî',
    element: '🔥',
    renk: '#c05c1a',
    bg: '#fff8f0',
    border: '#f5c09a',
    amac: 'Soğutma & Sakinleştirme',
    hook: 'Öfken varken derin nefes al derler. Bu sadece pozitif düşünce değil — doğrudan safra kesesine sinyal göndermek.',
    teknikler: [
      {
        isim: 'Soğutucu Nefes (Sitali)',
        sure: '5–10 dakika',
        ne: 'Dili "u" şeklinde bükerek nefes almak — sanki pipetten içer gibi. Vücudu dakikalar içinde serinletir.',
        adimlar: [
          'Dili hafifçe "u" şeklinde bükerek ağzın dışına çıkar.',
          'Bu şekil üzerinden serin hava içeri çek (4 saniye).',
          'Ağzı kapat, nefesi tut (4 saniye).',
          'Burnundan yavaşça ver (6–8 saniye).',
        ],
        fayda: 'Mide asidini ve öfkeyi sakinleştirir. Bahar alerjisinde rahatlatır.',
      },
      {
        isim: 'Tam Diyaframik Nefes',
        sure: '10 dakika',
        ne: 'Göğüs değil, karın. Çoğu insan sığ nefes alır — bu safra kesesini kronik gerim altında tutar.',
        adimlar: [
          'Sırt üstü yat, bir elini karnına koy.',
          'Burnundan 4 saniye nefes al — karın şişsin, göğüs oynamamalı.',
          'Ağzından 8 saniye yavaşça ver.',
          'Her nefeste karnın elini kaldırıp indiriyor olmalı.',
        ],
        fayda: 'Sindirim sistemini gevşetir, safra kesesini ve karaciğeri sakinleştirir.',
      },
      {
        isim: 'Öfke Boşaltma Nefesi',
        sure: '3–5 dakika',
        ne: '"Haaah" sesini bilirsin — birinin sinirlenirken içini çekişi. Bu onu bilinçli ve kontrollü yapmak.',
        adimlar: [
          'Otur, omurganı dik tut.',
          'Burnundan hızlı ve derin bir nefes al.',
          'Ağzından "haaah" sesiyle güçlüce ver — omuzları ve çeneyi bırak.',
          '7 kez tekrarla.',
        ],
        fayda: 'Birikmiş öfkeyi ve safra gerginliğini anında boşaltır.',
      },
    ],
    ipucu: 'Sabah aç karnına 10 dakika soğutucu nefes — gün boyu mide yanmasını belirgin biçimde azaltır.',
  },
  {
    id: 'demevi',
    isim: 'Demevî',
    element: '💧',
    renk: '#be185d',
    bg: '#fff5f9',
    border: '#f9a8d4',
    amac: 'Dengeleme & Ritim',
    hook: 'Başın zonklayınca ya da kalbinde çarpıntı olunca — beden sana ritmini kaybettiğini söylüyor. Nefes ritmi yeniden kurar.',
    teknikler: [
      {
        isim: 'Box Breathing (4-4-4-4)',
        sure: '5–10 dakika',
        ne: 'Navy SEAL\'lerin kullandığı teknik. Kalp atışını ve kan basıncını dakikalar içinde düzenler.',
        adimlar: [
          '4 sayarak burnundan nefes al.',
          '4 sayarak tut.',
          '4 sayarak ağzından ver.',
          '4 sayarak bekle. Tekrarla.',
        ],
        fayda: 'Kalp atışını düzenler, aşırı coşkuyu sakinleştirir, migreni hafifletir.',
      },
      {
        isim: 'Alternate Nostril (Nadi Shodhana)',
        sure: '5–7 dakika',
        ne: 'Sol-sağ beyin arasındaki dengeyi kurar. Demevî mizacın aşırı duygu salınımını stabilize eder.',
        adimlar: [
          'Sağ baş parmakla sağ burun deliğini kapat.',
          'Soldan 4 sayarak al.',
          'İki deliği de kapat, 4 sayarak tut.',
          'Sol tarafı aç, 4 sayarak ver. Sonra tersini yap.',
        ],
        fayda: 'Sol-sağ beyin dengesini kurar, duygusal iniş-çıkışları dengeler.',
      },
      {
        isim: 'Yavaş Derin Nefes',
        sure: '10 dakika',
        ne: 'Dakikada 6 nefes — kalp ritmi değişkenliğini en üst düzeye çıkaran frekans. Bilimsel olarak kanıtlanmış.',
        adimlar: [
          'Otur ya da yat.',
          '5 saniye burnundan nefes al.',
          '5 saniye burnundan ver.',
          'Dakikada tam 6 nefes olacak. Tekrarla.',
        ],
        fayda: 'Kalp-beyin koherensini artırır, karaciğer üzerindeki stresi azaltır.',
      },
    ],
    ipucu: 'Baş ağrısı veya çarpıntı hissedince Box Breathing yap. 5 dakikada gerilim belirgin biçimde azalır.',
  },
  {
    id: 'balgami',
    isim: 'Balgamî',
    element: '🌊',
    renk: '#1e6fb5',
    bg: '#f0f8ff',
    border: '#93c5fd',
    amac: 'Isıtma & Canlandırma',
    hook: 'Sabah kalkamıyor, akciğerlerin ağır hissediyorsa — beden ateş istiyor. Nefes o ateşi yakar.',
    teknikler: [
      {
        isim: 'Ateş Nefesi (Kapalabhati)',
        sure: '5 dakika',
        ne: 'Kısa, güçlü, hızlı nefes verişler. Akciğerleri pompa gibi çalıştırır — balgamı çözer, metabolizmayı uyarır.',
        adimlar: [
          'Otur, omurganı dik tut.',
          'Kısa, güçlü nefesler ver — saniyede 1-2 kez, aktif çıkış.',
          'Alış pasif olsun, veriş güçlü.',
          '30 tekrar, 1 dakika derin nefes. 3 tur yap.',
        ],
        fayda: 'Akciğerleri temizler, metabolizmayı hızlandırır, sabah ağırlığını kaldırır.',
      },
      {
        isim: 'Balinara Nefes (Brahmari)',
        sure: '5 dakika',
        ne: '"Mmmmm" sesi titreşimle sinüsleri açar. Balgamî mizacın en yaygın şikâyeti olan kronik sinüzitin doğal çözümü.',
        adimlar: [
          'Gözleri kapat, kulaklarını parmaklarınla tıka.',
          'Burnundan derin nefes al.',
          'Verirken "Mmmmm" sesi çıkar — titreşimi kafanda hisset.',
          '7–10 kez tekrarla.',
        ],
        fayda: 'Sinüsleri açar, mukusu çözer, boğaz çakrasını aktive eder.',
      },
      {
        isim: 'Yürüyüş Nefesi',
        sure: '10 dakika',
        ne: 'Hareketsizlik balgamı artırır. Nefesi adımlarla senkronize etmek akciğerleri zorla çalıştırır.',
        adimlar: [
          'Dışarı çık, yürümeye başla.',
          'Her iki adımda bir burnundan güçlü nefes al.',
          'Bir adımda ağzından ver.',
          'Kolları salla. Ritimle devam et.',
        ],
        fayda: 'Tüm vücudu ısıtır, lenf dolaşımını harekete geçirir, ağırlık hissini kaldırır.',
      },
    ],
    ipucu: 'Sabah uyanır uyanmaz 3 dakika Ateş Nefesi — balgamî mizacın en büyük sorunu olan yavaş açılma böyle çözülür.',
  },
  {
    id: 'sovdavi',
    isim: 'Sovdavî',
    element: '🌍',
    renk: '#44403c',
    bg: '#fafaf9',
    border: '#c8c4bc',
    amac: 'Topraklama & Isınma',
    hook: 'Akıl durmuyor, kemikler sızlıyor, uyku gelmiyor — sinir sistemi aşırı yüklenmiş. Nefes onu sıfırlıyor.',
    teknikler: [
      {
        isim: '4-7-8 Nefesi',
        sure: '5–10 dakika',
        ne: 'Dr. Andrew Weil\'in "doğal sakinleştirici" dediği teknik. Sovdavî mizacın kronik uykusuzluğu için en güçlü araç.',
        adimlar: [
          'Otur ya da yat, ağzını kapat.',
          '4 sayarak burnundan al.',
          '7 sayarak tut.',
          '8 sayarak ağzından "whoosh" sesiyle ver.',
          '4 kez tekrarla.',
        ],
        fayda: 'Sinir sistemini sakinleştirir, kronik kaygıyı ve uykusuzluğu azaltır.',
      },
      {
        isim: 'Topraklama Nefesi',
        sure: '10 dakika',
        ne: 'Çıplak ayak, toprak, yavaş nefes — üçü bir arada sovdavî sinir sisteminin en derin çözümü.',
        adimlar: [
          'Çıplak ayakla yere ya da toprağa bas.',
          'Gözleri kapat, toprağı hisset.',
          'Burnundan 5 sayarak al.',
          'Ağzından 10 sayarak ver.',
          'Her nefeste köklerinin derinleştiğini hayal et.',
        ],
        fayda: 'İskelet sistemini rahatlatır, vesvese ve kaygıyı dağıtır, zemin hissini güçlendirir.',
      },
      {
        isim: 'Isıtma Nefesi (Ujjayi)',
        sure: '5–7 dakika',
        ne: 'Boğazı hafifçe daraltarak "deniz sesi" çıkarmak — içeriden ısınmayı sağlar. Kronik soğukluk ve uyuşma için.',
        adimlar: [
          'Ağzını kapat.',
          'Burnundan alırken boğazı hafifçe daralt — deniz sesi gibi.',
          'Aynı şekilde burnundan ver.',
          'Nefes yavaş, derin ve ısıtıcı olmalı. 10 dakika sürdür.',
        ],
        fayda: 'Vücut ısısını artırır, kronik soğukluğu ve uyuşmaları azaltır.',
      },
    ],
    ipucu: 'Yatmadan önce 4-7-8 nefesi yap. Sovdavî mizacın en büyük sorunu olan uyku kalitesi çarpıcı biçimde iyileşir.',
  },
];

export default function NefesPage() {
  const [aktif, setAktif] = useState('safravi');
  const [acikTeknik, setAcikTeknik] = useState<number | null>(0);
  const secili = nefesler.find(n => n.id === aktif)!;

  return (
    <main className="min-h-screen bg-white">

      {/* Hero */}
      <section className="py-20 px-4 text-center" style={{ background: 'linear-gradient(180deg, #0f0a04 0%, #1a1207 100%)' }}>
        <div className="max-w-2xl mx-auto">
          <p className="text-xs tracking-widest uppercase mb-6" style={{ color: '#c4973a' }}>İbn-i Sina · Nefes Bilimi</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Şu an ağzınla mı<br />
            <span style={{ color: '#c4973a' }}>burnunla mı nefes alıyorsun?</span>
          </h1>
          <p className="text-lg leading-relaxed mb-6" style={{ color: '#9a8060' }}>
            Bu soruyu çoğu insan hiç sormaz. Ama İbn-i Sina&apos;ya göre
            burnun nefesi filtreleyen, ısıtan ve beyne hazırlayan organdır.
            Ve her mizacın doğru nefes tekniği farklıdır.
          </p>
          <div className="inline-block rounded-2xl px-6 py-3" style={{ background: 'rgba(196, 151, 58, 0.1)', border: '1px solid rgba(196, 151, 58, 0.3)' }}>
            <p className="text-sm font-medium" style={{ color: '#c4973a' }}>
              ↓ Mizacını seç — sana özel 3 teknik
            </p>
          </div>
        </div>
      </section>

      {/* 4 ilke — kısa, tok */}
      <section className="py-10 px-4" style={{ background: '#fef9f0' }}>
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { ikon: '🌅', baslik: 'En iyi zaman', aciklama: 'Sabah ilk nefes günün dengesini kurar.' },
              { ikon: '🪴', baslik: 'Doğada yap', aciklama: 'Dışarıdaki bir nefes, içerideki beşe bedeldir.' },
              { ikon: '👃', baslik: 'Burnu kullan', aciklama: 'Filtre, ısıtma, beyne hazırlık — hepsi burunda.' },
              { ikon: '🎯', baslik: 'Az ama derin', aciklama: '5 dakika bilinçli, 30 dakika dağınıktan güçlüdür.' },
            ].map((i) => (
              <div key={i.baslik} className="rounded-2xl p-4 text-center" style={{ background: 'white', border: '1px solid #e8d5b0' }}>
                <div className="text-2xl mb-2">{i.ikon}</div>
                <div className="font-bold text-sm mb-1" style={{ color: '#3d2c0e' }}>{i.baslik}</div>
                <div className="text-xs leading-relaxed" style={{ color: '#9a8060' }}>{i.aciklama}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mizaç seçici */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-2" style={{ color: '#3d2c0e' }}>
            Mizacına göre nefes
          </h2>
          <p className="text-center text-sm mb-8" style={{ color: '#9a8060' }}>
            Yanlış teknik dengesizliği artırır — doğruyu bul.
          </p>

          <div className="flex gap-3 justify-center flex-wrap mb-8" role="tablist">
            {nefesler.map((n) => (
              <button
                key={n.id}
                role="tab"
                aria-selected={aktif === n.id}
                onClick={() => { setAktif(n.id); setAcikTeknik(0); }}
                className="px-5 py-2.5 rounded-full font-semibold text-sm transition-all"
                style={{
                  background: aktif === n.id ? n.renk : 'white',
                  color: aktif === n.id ? 'white' : '#5c3d1e',
                  border: `1px solid ${aktif === n.id ? n.renk : '#e8d5b0'}`,
                }}
              >
                {n.element} {n.isim}
              </button>
            ))}
          </div>

          {/* Detay */}
          <div className="rounded-3xl p-8" style={{ background: secili.bg, border: `1px solid ${secili.border}` }}>
            {/* Hook */}
            <div className="rounded-2xl p-5 mb-6 border-l-4" style={{ background: 'white', borderLeftColor: secili.renk }}>
              <p className="font-semibold leading-relaxed" style={{ color: '#3d2c0e' }}>
                {secili.hook}
              </p>
              <p className="text-xs mt-2 font-semibold" style={{ color: secili.renk }}>
                Amaç: {secili.amac}
              </p>
            </div>

            {/* Teknikler accordion */}
            <div className="space-y-3">
              {secili.teknikler.map((teknik, idx) => (
                <div key={teknik.isim} className="rounded-2xl overflow-hidden" style={{ background: 'white' }}>
                  <button
                    onClick={() => setAcikTeknik(acikTeknik === idx ? null : idx)}
                    className="w-full px-5 py-4 flex items-start justify-between text-left"
                  >
                    <div className="flex-1 pr-4">
                      <div className="font-bold" style={{ color: secili.renk }}>{teknik.isim}</div>
                      <div className="text-xs mt-0.5" style={{ color: '#9a8060' }}>{teknik.sure} · {teknik.ne}</div>
                    </div>
                    <span className="text-sm shrink-0 mt-0.5" style={{ color: '#9a8060' }}>
                      {acikTeknik === idx ? '▲' : '▼'}
                    </span>
                  </button>
                  {acikTeknik === idx && (
                    <div className="px-5 pb-5 border-t" style={{ borderColor: `${secili.border}` }}>
                      <ol className="space-y-2 mt-4 mb-4">
                        {teknik.adimlar.map((adim, i) => (
                          <li key={i} className="flex gap-3 text-sm" style={{ color: '#5c3d1e' }}>
                            <span
                              className="w-6 h-6 rounded-full text-white text-xs flex items-center justify-center shrink-0 mt-0.5 font-bold"
                              style={{ background: secili.renk }}
                            >
                              {i + 1}
                            </span>
                            {adim}
                          </li>
                        ))}
                      </ol>
                      <div className="rounded-xl p-3" style={{ background: secili.bg, border: `1px solid ${secili.border}` }}>
                        <span className="font-semibold text-sm" style={{ color: secili.renk }}>Faydası: </span>
                        <span className="text-sm" style={{ color: '#5c3d1e' }}>{teknik.fayda}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* İpucu */}
            <div className="mt-5 rounded-2xl p-4 text-white" style={{ background: secili.renk }}>
              <span className="font-bold text-sm">💡 </span>
              <span className="text-sm opacity-90">{secili.ipucu}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Koku + Nefes */}
      <section className="py-12 px-4" style={{ background: '#1a1207' }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-center text-white mb-2">Kokuyla desteklenmiş nefes</h2>
          <p className="text-center text-sm mb-8" style={{ color: '#9a8060' }}>
            Nefes alırken kokuya doğru eğil, içine çekerken doğrul — etkisi katlanır.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { koku: '🌿 Lavanta', etki: 'Uykuyu derinleştirir', mizac: 'Sovdavî · Safravî' },
              { koku: '🌹 Gül', etki: 'Kalbi açar, ısıtır', mizac: 'Balgamî · Sovdavî' },
              { koku: '🍃 Nane', etki: 'Soğutur, netleştirir', mizac: 'Safravî · Demevî' },
              { koku: '🕯️ Günlük', etki: 'Zihni açar, odaklar', mizac: 'Tüm mizaçlar' },
            ].map((k) => (
              <div key={k.koku} className="rounded-2xl p-4 text-center" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="font-bold text-white mb-1 text-sm">{k.koku}</div>
                <div className="text-xs mb-2" style={{ color: '#9a8060' }}>{k.etki}</div>
                <div className="text-xs italic" style={{ color: '#6b5230' }}>{k.mizac}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Email capture */}
      <section className="py-4 px-4">
        <div className="max-w-2xl mx-auto">
          <EmailCapture
            title="Haftalık nefes ve denge pratiği"
            subtitle="Mizacına göre sabah rutini — her Pazartesi, ücretsiz."
            cta="Gönder"
          />
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 text-center" style={{ background: '#fef9f0' }}>
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-center mb-8">
            <ShareBar
              title="Mizacına Göre Nefes Egzersizleri"
              description="Safravî soğutur, balgamî ısıtır. Doğru nefes tekniği mizacına göre değişir."
              url="https://mizac.xyz/nefes"
            />
          </div>
          <h2 className="text-2xl font-bold mb-3" style={{ color: '#3d2c0e' }}>
            Mizacını bilmeden nefes seçme.
          </h2>
          <p className="mb-8" style={{ color: '#9a8060' }}>
            Yanlış teknik dengesizliği artırabilir. Önce mizacını öğren.
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
              href="/hastaliklar"
              className="px-8 py-3 rounded-full font-semibold border-2 hover:scale-105 transition-all"
              style={{ borderColor: '#c4973a', color: '#7c4a1e' }}
            >
              Hastalık & Mizaç →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
