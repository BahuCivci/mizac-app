'use client';

import Link from 'next/link';
import { useLang } from '@/lib/lang-context';

export default function OdemeBasariliPage() {
  const { lang } = useLang();
  const tr = lang === 'tr';

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-16" style={{ background: 'var(--background)' }}>
      <div className="max-w-md w-full text-center">

        {/* Başarı ikonu */}
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: '#16a34a22', border: '1.5px solid #16a34a44' }}
        >
          <span className="text-3xl">✓</span>
        </div>

        {/* Başlık */}
        <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#c4973a', letterSpacing: '0.25em' }}>
          {tr ? 'Ödeme Başarılı' : 'Payment Successful'}
        </p>
        <h1 className="text-3xl font-bold mb-4" style={{ color: '#f5f0e8', fontFamily: 'Georgia, serif' }}>
          {tr ? 'Raporunuz Yolda!' : 'Your Report Is On Its Way!'}
        </h1>
        <p className="text-base leading-relaxed mb-8" style={{ color: '#9a8060' }}>
          {tr
            ? 'Derin Mizaç Raporu birkaç dakika içinde email adresinize gönderilecek. Gelen kutunuzu ve spam klasörünüzü kontrol edin.'
            : 'Your Deep Temperament Report will be emailed within a few minutes. Check your inbox and spam folder.'}
        </p>

        {/* Rapor içerik özeti */}
        <div
          className="rounded-2xl p-6 mb-8 text-left"
          style={{ background: '#0f0a04', border: '1px solid #3d2c0e' }}
        >
          <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#c4973a', letterSpacing: '0.2em' }}>
            {tr ? 'Raporunuz İçeriyor' : 'Your Report Includes'}
          </p>
          {[
            tr ? '✦ Organ–duygu haritanız' : '✦ Your organ–emotion map',
            tr ? '✦ Haftalık sağlık protokolü' : '✦ Weekly health protocol',
            tr ? '✦ İlişki ve kariyer uyum analizi' : '✦ Relationship & career compatibility',
            tr ? "✦ Esmaü'l-Hüsna zikirleriniz" : '✦ Your personal divine names',
            tr ? '✦ Beslenme ve detoks takvimi' : '✦ Nutrition & detox calendar',
            tr ? '✦ Sahabi örneği ve mevsimsel rehber' : '✦ Historical example & seasonal guide',
          ].map((item) => (
            <p key={item} className="text-sm mb-2" style={{ color: '#9a8060', lineHeight: 1.8 }}>{item}</p>
          ))}
        </div>

        {/* Destek notu */}
        <p className="text-xs mb-8" style={{ color: '#6b5230' }}>
          {tr
            ? 'Email gelmezse: '
            : 'If email doesn\'t arrive: '}
          <a href="mailto:destek@mizac.xyz" style={{ color: '#c4973a' }}>destek@mizac.xyz</a>
        </p>

        {/* Butonlar */}
        <div className="flex flex-col gap-3">
          <Link
            href="/mizaclar"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold text-sm text-white transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #7c4a1e, #c4973a)' }}
          >
            {tr ? '4 Mizacı Keşfet' : 'Explore 4 Temperaments'}
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 rounded-full text-sm transition-all hover:opacity-80"
            style={{ color: '#9a8060' }}
          >
            {tr ? 'Ana Sayfaya Dön' : 'Back to Home'}
          </Link>
        </div>

      </div>
    </main>
  );
}
