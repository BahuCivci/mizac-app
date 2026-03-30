'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { mizacProfiller, MizacTip } from '@/lib/mizac-data';
import { Suspense, useState, useEffect } from 'react';
import { useLang } from '@/lib/lang-context';
import { AdUnit } from '@/components/ad-unit';

const uyumHaritasi: Record<MizacTip, { tip: MizacTip; puan: number }[]> = {
  safravi: [
    { tip: 'balgami', puan: 92 },
    { tip: 'demevi', puan: 68 },
    { tip: 'safravi', puan: 55 },
    { tip: 'sevdavi', puan: 38 },
  ],
  demevi: [
    { tip: 'sevdavi', puan: 90 },
    { tip: 'safravi', puan: 72 },
    { tip: 'demevi', puan: 65 },
    { tip: 'balgami', puan: 48 },
  ],
  balgami: [
    { tip: 'safravi', puan: 92 },
    { tip: 'sevdavi', puan: 76 },
    { tip: 'balgami', puan: 68 },
    { tip: 'demevi', puan: 50 },
  ],
  sevdavi: [
    { tip: 'demevi', puan: 90 },
    { tip: 'balgami', puan: 74 },
    { tip: 'sevdavi', puan: 62 },
    { tip: 'safravi', puan: 42 },
  ],
};

const unluler: Record<MizacTip, { isim: string; aciklama: string; aciklamaEn: string }[]> = {
  safravi: [
    { isim: 'İbn-i Sina', aciklama: 'Tıbbın babası, kararlı ve üretken', aciklamaEn: 'Father of medicine, decisive and productive' },
    { isim: 'Hz. Ömer', aciklama: 'Adaletli ve güçlü lider', aciklamaEn: 'Just and powerful leader' },
    { isim: 'Steve Jobs', aciklama: 'Vizyoner girişimci, mükemmeliyetçi', aciklamaEn: 'Visionary entrepreneur, perfectionist' },
  ],
  demevi: [
    { isim: 'Hz. Mevlânâ', aciklama: 'Neşeli, sevgi dolu, ilham veren', aciklamaEn: 'Joyful, loving, inspiring' },
    { isim: 'Leonardo da Vinci', aciklama: 'Yaratıcı dahi, çok yönlü sanatçı', aciklamaEn: 'Creative genius, versatile artist' },
    { isim: 'Mozart', aciklama: 'Coşkulu ve üretken müzisyen', aciklamaEn: 'Enthusiastic and prolific musician' },
  ],
  balgami: [
    { isim: 'Hz. İbrahim (a.s.)', aciklama: 'Sabırlı, tevekkül ehli, sakin', aciklamaEn: 'Patient, reliant on God, calm' },
    { isim: 'Gandhi', aciklama: 'Barışçıl, sabırlı, uzlaşmacı', aciklamaEn: 'Peaceful, patient, conciliatory' },
    { isim: 'Albert Einstein', aciklama: 'Derin düşünür, sakin ve meraklı', aciklamaEn: 'Deep thinker, calm and curious' },
  ],
  sevdavi: [
    { isim: 'Beethoven', aciklama: 'Derin duygusal müzik dehası', aciklamaEn: 'Deep emotional musical genius' },
    { isim: 'Hz. Adem (a.s.)', aciklama: 'Topraktan yaratılmış, yeryüzünün halifesi', aciklamaEn: 'Created from earth, vicegerent of the world' },
    { isim: 'Kafka', aciklama: 'Derin düşünceli, melankolik yazar', aciklamaEn: 'Deep-thinking, melancholic writer' },
  ],
};

function ShareButtons({ tip, profil, tr }: { tip: MizacTip; profil: (typeof mizacProfiller)[MizacTip]; tr: boolean }) {
  const [copied, setCopied] = useState(false);

  const shareText = tr
    ? `Mizaç testimde ${profil.isim} ${profil.elementSembol} çıktım! Sen de öğren 👇`
    : `I got ${profil.isimEn} ${profil.elementSembol} on the temperament test! Find yours 👇`;

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  async function handleNativeShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title: `Mizaç: ${profil.isim}`, text: shareText, url: shareUrl });
      } catch {}
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText + '\n' + shareUrl)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;

  return (
    <div className="rounded-2xl p-6 mb-6 text-center" style={{ background: `linear-gradient(135deg, ${profil.renkAcik}, white)` }}>
      <p className="text-sm font-semibold mb-1 opacity-60 uppercase tracking-widest">
        {tr ? 'Sonucunu Paylaş' : 'Share Your Result'}
      </p>
      <p className="font-bold text-lg mb-5" style={{ color: profil.renk }}>
        {profil.elementSembol} {tr ? profil.isim : profil.isimEn}
      </p>

      <div className="flex flex-wrap justify-center gap-3">
        {/* Native Share (mobil) */}
        <button
          onClick={handleNativeShare}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-all hover:scale-105"
          style={{ background: profil.renk }}
        >
          ↑ {tr ? 'Paylaş' : 'Share'}
        </button>

        {/* WhatsApp */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-all hover:scale-105"
          style={{ background: '#25D366' }}
        >
          WhatsApp
        </a>

        {/* X / Twitter */}
        <a
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-all hover:scale-105"
          style={{ background: '#000' }}
        >
          𝕏 Twitter
        </a>

        {/* Kopyala */}
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all hover:scale-105 border-2"
          style={{ borderColor: profil.renk, color: profil.renk }}
        >
          {copied ? (tr ? '✓ Kopyalandı!' : '✓ Copied!') : (tr ? '🔗 Linki Kopyala' : '🔗 Copy Link')}
        </button>
      </div>
    </div>
  );
}

function SonucIcerik() {
  const params = useSearchParams();
  const tip = params.get('tip') as MizacTip;
  const puanlarStr = params.get('puanlar');

  const { lang } = useLang();
  const profil = mizacProfiller[tip];
  if (!profil) return null;
  const tr = lang === 'tr';

  let puanlar: Record<MizacTip, number> = { safravi: 0, demevi: 0, balgami: 0, sevdavi: 0 };
  try {
    if (puanlarStr) puanlar = JSON.parse(decodeURIComponent(puanlarStr));
  } catch {}

  const toplamPuan = Object.values(puanlar).reduce((a, b) => a + b, 0);
  const sirali = (Object.entries(puanlar) as [MizacTip, number][])
    .sort(([, a], [, b]) => b - a);

  const ikinciTip = sirali[1]?.[0] as MizacTip;
  const ikinciProfil = mizacProfiller[ikinciTip];

  // Sonucu localStorage'a kaydet
  useEffect(() => {
    if (tip && puanlarStr) {
      localStorage.setItem('mizac_sonuc', JSON.stringify({ tip, puanlar, tarih: Date.now() }));
    }
  }, [tip, puanlarStr]);

  return (
    <main className="min-h-screen px-4 py-16" style={{ background: 'var(--background)' }}>
      <div className="max-w-2xl mx-auto">

        {/* Başlık */}
        <div
          className="rounded-3xl p-10 text-center mb-8"
          style={{ background: `linear-gradient(135deg, ${profil.renkAcik}, white)` }}
        >
          <div className="text-7xl mb-4">{profil.elementSembol}</div>
          <p className="text-sm font-medium opacity-50 mb-1 uppercase tracking-widest">
            {tr ? 'Mizacınız' : 'Your Temperament'}
          </p>
          <h1 className="text-5xl font-bold mb-2" style={{ color: profil.renk }}>
            {tr ? profil.isim : profil.isimEn}
          </h1>
          <p className="text-xl opacity-60 mb-4">{profil.element} · {profil.elementEn}</p>
          <p className="text-lg leading-relaxed opacity-80 max-w-md mx-auto">
            {tr ? profil.kisaAciklama : profil.kisaAciklamaEn}
          </p>
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {(tr ? profil.anahtarKelimeler : profil.anahtarKelimelerEn).map((kelime) => (
              <span
                key={kelime}
                className="px-3 py-1 rounded-full text-sm font-medium text-white"
                style={{ background: profil.renk }}
              >
                {kelime}
              </span>
            ))}
          </div>
        </div>

        {/* İkinci Mizaç */}
        {ikinciProfil && (
          <div
            className="rounded-2xl p-5 mb-6 flex items-center gap-4"
            style={{ background: ikinciProfil.renkAcik, border: `1.5px solid ${ikinciProfil.renk}40` }}
          >
            <div className="text-4xl">{ikinciProfil.elementSembol}</div>
            <div className="flex-1">
              <p className="text-xs font-semibold opacity-50 uppercase tracking-widest mb-0.5">
                {tr ? 'İkinci Mizacınız' : 'Your Secondary Temperament'}
              </p>
              <p className="font-bold text-lg" style={{ color: ikinciProfil.renk }}>
                {tr ? ikinciProfil.isim : ikinciProfil.isimEn}
              </p>
              <p className="text-sm opacity-70 leading-snug mt-1">
                {tr
                  ? `${profil.isim} baskın mizacınız olmakla birlikte ${ikinciProfil.isim} özelliklerini de taşıyorsunuz. Bu "kayma" doğaldır.`
                  : `While ${profil.isimEn} is your dominant temperament, you also carry traits of ${ikinciProfil.isimEn}. This "drift" is natural.`}
              </p>
            </div>
            <Link
              href={`/mizaclar/${ikinciTip}`}
              className="text-xs px-3 py-1.5 rounded-full font-semibold text-white flex-shrink-0"
              style={{ background: ikinciProfil.renk }}
            >
              {tr ? 'İncele' : 'Explore'}
            </Link>
          </div>
        )}

        {/* Paylaş */}
        <ShareButtons tip={tip} profil={profil} tr={tr} />

        {/* Puan dağılımı */}
        <div className="rounded-2xl p-6 mb-6" style={{ background: 'var(--cream)' }}>
          <h2 className="font-bold mb-4" style={{ color: 'var(--foreground)' }}>
            {tr ? 'Mizaç Dağılımınız' : 'Your Temperament Distribution'}
          </h2>
          {sirali.map(([mizacTip, puan]) => {
            const p = mizacProfiller[mizacTip];
            const yuzde = toplamPuan > 0 ? Math.round((puan / toplamPuan) * 100) : 0;
            return (
              <div key={mizacTip} className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">{tr ? p.isim : p.isimEn} {p.elementSembol}</span>
                  <span className="opacity-60">%{yuzde}</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: '#e5e7eb' }}>
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{ width: `${yuzde}%`, background: p.renk }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Güçlü / Zayıf yönler */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="rounded-2xl p-6" style={{ background: '#f0fdf4' }}>
            <h3 className="font-bold mb-3 text-green-700">{tr ? '✓ Güçlü Yönler' : '✓ Strengths'}</h3>
            <ul className="space-y-1">
              {(tr ? profil.gucluYonler : profil.gucluYonlerEn).map((y) => (
                <li key={y} className="text-sm opacity-80">· {y}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl p-6" style={{ background: '#fff7ed' }}>
            <h3 className="font-bold mb-3 text-orange-700">{tr ? '△ Gelişim Alanları' : '△ Areas for Growth'}</h3>
            <ul className="space-y-1">
              {(tr ? profil.zayifYonler : profil.zayifYonlerEn).map((y) => (
                <li key={y} className="text-sm opacity-80">· {y}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Beslenme */}
        <div className="rounded-2xl p-6 mb-6" style={{ background: 'var(--cream)' }}>
          <h3 className="font-bold mb-3" style={{ color: 'var(--earth)' }}>{tr ? '🍃 Beslenme Tavsiyeleri' : '🍃 Nutrition Tips'}</h3>
          <div className="flex flex-wrap gap-2">
            {(tr ? profil.beslenme : profil.beslenmeEn).map((b) => (
              <span key={b} className="text-sm px-3 py-1 rounded-full bg-white border"
                style={{ borderColor: 'var(--gold-light)' }}>
                {b}
              </span>
            ))}
          </div>
        </div>

        {/* İlişki */}
        <div className="rounded-2xl p-6 mb-8" style={{ background: 'var(--cream)' }}>
          <h3 className="font-bold mb-2" style={{ color: 'var(--earth)' }}>{tr ? '💛 İlişkiler' : '💛 Relationships'}</h3>
          <p className="text-sm leading-relaxed opacity-80">{tr ? profil.iliski : profil.iliskiEn}</p>
        </div>

        {/* Uyumlu Mizaçlar */}
        <div className="rounded-2xl p-6 mb-6" style={{ background: 'var(--cream)' }}>
          <h2 className="font-bold mb-4" style={{ color: 'var(--foreground)' }}>
            {tr ? '💞 Mizaç Uyumu' : '💞 Temperament Compatibility'}
          </h2>
          <p className="text-sm opacity-60 mb-4">
            {tr
              ? 'Zıt mizaçlar birbirini dengeler; benzer mizaçlar daha iyi anlaşır.'
              : 'Opposite temperaments balance each other; similar ones understand better.'}
          </p>
          <div className="space-y-3">
            {uyumHaritasi[tip].map(({ tip: uyumTip, puan }) => {
              const p = mizacProfiller[uyumTip];
              return (
                <div key={uyumTip} className="flex items-center gap-3">
                  <span className="text-xl w-8 text-center">{p.elementSembol}</span>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{tr ? p.isim : p.isimEn}</span>
                      <span className="opacity-60">%{puan}</span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: '#e5e7eb' }}>
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${puan}%`, background: p.renk }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Ünlü Örnekler */}
        <div className="rounded-2xl p-6 mb-6" style={{ background: 'var(--cream)' }}>
          <h2 className="font-bold mb-4" style={{ color: 'var(--foreground)' }}>
            {tr ? '🌟 Sizinle Aynı Mizaçta Ünlüler' : '🌟 Famous People With Your Temperament'}
          </h2>
          <div className="space-y-3">
            {unluler[tip].map((kisi) => (
              <div key={kisi.isim} className="flex items-center gap-3 rounded-xl p-3 bg-white">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                  style={{ background: profil.renk }}
                >
                  {kisi.isim[0]}
                </div>
                <div>
                  <p className="font-semibold text-sm">{kisi.isim}</p>
                  <p className="text-xs opacity-60">{tr ? kisi.aciklama : kisi.aciklamaEn}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reklam */}
        <AdUnit slot="1234567890" format="horizontal" className="mb-6 rounded-xl overflow-hidden" />

        {/* Butonlar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={`/mizaclar/${tip}`}
            className="text-center px-6 py-3 rounded-full font-semibold transition-all hover:scale-105 text-white"
            style={{ background: profil.renk }}
          >
            {tr ? 'Detaylı Profili Gör' : 'View Detailed Profile'}
          </Link>
          <Link
            href="/test"
            className="text-center px-6 py-3 rounded-full font-semibold border-2 transition-all hover:scale-105"
            style={{ borderColor: 'var(--gold)', color: 'var(--earth)' }}
          >
            {tr ? 'Testi Tekrarla' : 'Retake the Test'}
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function SonucPage() {
  return (
    <Suspense>
      <SonucIcerik />
    </Suspense>
  );
}
