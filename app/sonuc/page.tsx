'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { mizacProfiller, MizacTip } from '@/lib/mizac-data';
import { Suspense, useState } from 'react';
import { useLang } from '@/lib/lang-context';
import { AdUnit } from '@/components/ad-unit';

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
