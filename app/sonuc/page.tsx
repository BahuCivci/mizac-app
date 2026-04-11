'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { mizacProfiller, MizacTip } from '@/lib/mizac-data';
import { Suspense, useState, useEffect } from 'react';
import { useLang } from '@/lib/lang-context';
import { blogYazilari } from '@/lib/blog-data';

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

function generateStoryCard(profil: (typeof mizacProfiller)[MizacTip], tr: boolean): Promise<Blob> {
  return new Promise((resolve) => {
    const W = 1080, H = 1920;
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d')!;

    // Arka plan gradient
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, profil.renkAcik);
    bg.addColorStop(0.5, '#ffffff');
    bg.addColorStop(1, profil.renkAcik);
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Dekoratif büyük çember (arka)
    ctx.beginPath();
    ctx.arc(W * 0.85, H * 0.15, 380, 0, Math.PI * 2);
    ctx.fillStyle = profil.renk + '12';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(W * 0.1, H * 0.8, 280, 0, Math.PI * 2);
    ctx.fillStyle = profil.renk + '10';
    ctx.fill();

    // Üst branding çizgisi
    ctx.fillStyle = profil.renk;
    ctx.fillRect(80, 110, 920, 5);

    // ✦ MIZAÇ branding
    ctx.fillStyle = profil.renk;
    ctx.font = 'bold 52px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('✦  M İ Z A Ç', W / 2, 90);

    // Alt branding çizgisi
    ctx.fillRect(80, 105, 920, 5);

    // Element sembolü (emoji büyük)
    ctx.font = '280px serif';
    ctx.textAlign = 'center';
    ctx.fillText(profil.elementSembol, W / 2, 620);

    // Mizaç adı (TR)
    ctx.fillStyle = profil.renk;
    ctx.font = 'bold 148px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText(tr ? profil.isim : profil.isimEn, W / 2, 820);

    // İkincil isim
    ctx.fillStyle = '#00000060';
    ctx.font = '56px Georgia, serif';
    ctx.fillText(tr ? profil.isimEn : profil.isim, W / 2, 910);

    // Element çizgisi
    ctx.fillStyle = profil.renk + '40';
    ctx.fillRect(240, 960, 600, 3);

    // Element · Sıcaklık
    ctx.fillStyle = '#00000070';
    ctx.font = '48px Georgia, serif';
    ctx.fillText(`${tr ? profil.element : profil.elementEn}  ·  ${profil.sicaklik} & ${profil.nem}`, W / 2, 1040);

    // Anahtar kelimeler (pill şeklinde)
    const kelimeler = (tr ? profil.anahtarKelimeler : profil.anahtarKelimelerEn).slice(0, 4);
    const pillH = 72, pillR = 36, gap = 20;
    const pillWidths = kelimeler.map((k) => {
      ctx.font = 'bold 36px Arial, sans-serif';
      return ctx.measureText(k).width + 60;
    });
    const totalPillW = pillWidths.reduce((a, b) => a + b, 0) + gap * (kelimeler.length - 1);
    let px = (W - totalPillW) / 2;
    const py = 1130;
    kelimeler.forEach((k, i) => {
      const pw = pillWidths[i];
      ctx.beginPath();
      ctx.roundRect(px, py, pw, pillH, pillR);
      ctx.fillStyle = profil.renk;
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 36px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(k, px + pw / 2, py + 46);
      px += pw + gap;
    });

    // Kısa açıklama
    const aciklama = tr ? profil.kisaAciklama : profil.kisaAciklamaEn;
    ctx.fillStyle = '#00000080';
    ctx.font = '44px Georgia, serif';
    ctx.textAlign = 'center';
    // Word wrap
    const words = aciklama.split(' ');
    let line = '', lineY = 1310;
    for (const word of words) {
      const test = line + word + ' ';
      if (ctx.measureText(test).width > 860 && line) {
        ctx.fillText(line.trim(), W / 2, lineY);
        line = word + ' ';
        lineY += 64;
      } else {
        line = test;
      }
    }
    ctx.fillText(line.trim(), W / 2, lineY);

    // Ayırıcı
    ctx.fillStyle = profil.renk + '30';
    ctx.fillRect(200, 1600, 680, 3);

    // CTA
    ctx.fillStyle = '#00000060';
    ctx.font = '44px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText(tr ? 'Senin mizacın ne?' : 'What is your temperament?', W / 2, 1680);

    // URL
    ctx.fillStyle = profil.renk;
    ctx.font = 'bold 48px Arial, sans-serif';
    ctx.fillText('mizac.xyz', W / 2, 1760);

    // Alt çizgi
    ctx.fillStyle = profil.renk;
    ctx.fillRect(80, 1810, 920, 5);

    canvas.toBlob((blob) => resolve(blob!), 'image/png');
  });
}

function EmailCapture({ tip, profil, tr }: { tip: MizacTip; profil: (typeof mizacProfiller)[MizacTip]; tr: boolean }) {
  const [email, setEmail] = useState('');
  const [durum, setDurum] = useState<'bos' | 'yukleniyor' | 'tamam' | 'hata'>('bos');

  async function gonder(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setDurum('yukleniyor');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, tip }),
      });
      setDurum(res.ok ? 'tamam' : 'hata');
    } catch {
      setDurum('hata');
    }
  }

  if (durum === 'tamam') {
    return (
      <div className="rounded-2xl p-6 mb-6 text-center" style={{ background: profil.renkAcik, border: `1.5px solid ${profil.renk}40` }}>
        <div className="text-3xl mb-2">📬</div>
        <p className="font-bold" style={{ color: profil.renk }}>
          {tr ? 'Profiliniz gönderildi!' : 'Profile sent!'}
        </p>
        <p className="text-sm opacity-60 mt-1">
          {tr ? 'Gelen kutunuzu kontrol edin.' : 'Check your inbox.'}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl p-6 mb-6" style={{ background: profil.renkAcik, border: `1.5px solid ${profil.renk}40` }}>
      <div className="text-2xl mb-2">{profil.elementSembol}</div>
      <h3 className="font-bold text-base mb-1" style={{ color: profil.renk }}>
        {tr ? 'Profilinizi kaybedin mi?' : 'Keep your profile'}
      </h3>
      <p className="text-sm opacity-70 mb-4">
        {tr
          ? `Mizacınızı emaile alalım — sağlık tavsiyeleri, beslenme rehberi ve her Pazartesi yeni içerik.`
          : `Get your profile by email — health tips, nutrition guide, and new content every Monday.`}
      </p>
      <form onSubmit={gonder} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={tr ? 'email@adresiniz.com' : 'your@email.com'}
          required
          className="flex-1 px-4 py-2.5 rounded-full text-sm border outline-none"
          style={{ borderColor: `${profil.renk}60`, background: 'white' }}
        />
        <button
          type="submit"
          disabled={durum === 'yukleniyor'}
          className="px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-all hover:scale-105 disabled:opacity-60 shrink-0"
          style={{ background: profil.renk }}
        >
          {durum === 'yukleniyor' ? '⏳' : (tr ? 'Gönder' : 'Send')}
        </button>
      </form>
      {durum === 'hata' && (
        <p className="text-xs text-red-500 mt-2">{tr ? 'Bir hata oluştu, tekrar deneyin.' : 'An error occurred, please try again.'}</p>
      )}
    </div>
  );
}

function ShareButtons({ tip, profil, tr }: { tip: MizacTip; profil: (typeof mizacProfiller)[MizacTip]; tr: boolean }) {
  const [copied, setCopied] = useState(false);
  const [kartYukleniyor, setKartYukleniyor] = useState(false);

  const shareText = tr
    ? `Mizaç testimde ${profil.isim} ${profil.elementSembol} çıktım! Sen de öğren 👇`
    : `I got ${profil.isimEn} ${profil.elementSembol} on the temperament test! Find yours 👇`;

  const shareUrl = `https://mizac.xyz/sonuc/${tip}`;

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

  async function handleStoryIndir() {
    setKartYukleniyor(true);
    try {
      const blob = await generateStoryCard(profil, tr);
      const isim = tr ? profil.isim : profil.isimEn;

      // Web Share API ile dosya paylaşımı (mobil)
      if (navigator.canShare?.({ files: [new File([blob], 'mizac.png', { type: 'image/png' })] })) {
        await navigator.share({
          files: [new File([blob], `mizac-${isim}.png`, { type: 'image/png' })],
          title: `Mizaç: ${isim}`,
        });
      } else {
        // Desktop: direkt indir
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `mizac-${isim}.png`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch {}
    setKartYukleniyor(false);
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
        {/* Story Kartı İndir */}
        <button
          onClick={handleStoryIndir}
          disabled={kartYukleniyor}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-all hover:scale-105 disabled:opacity-60"
          style={{ background: `linear-gradient(135deg, ${profil.renk}, ${profil.renk}cc)` }}
        >
          {kartYukleniyor ? '⏳' : '📸'} {tr ? 'Story Kartı' : 'Story Card'}
        </button>

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

function PdfSatinAl({ tip, renk, tr }: { tip: MizacTip; renk: string; tr: boolean }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleClick() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/lemonsqueezy/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tip }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(tr ? 'Bir hata oluştu, tekrar deneyin.' : 'Something went wrong, please try again.');
        setLoading(false);
      }
    } catch {
      setError(tr ? 'Bağlantı hatası, tekrar deneyin.' : 'Connection error, please try again.');
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={loading}
        className="w-full py-4 rounded-full text-base font-bold text-white transition-all hover:opacity-90 disabled:opacity-60"
        style={{ background: `linear-gradient(135deg, #7c4a1e, ${renk})` }}
      >
        {loading ? (tr ? 'Yönlendiriliyor...' : 'Redirecting...') : (tr ? '✦ Satın Al — ₺99' : '✦ Buy Now — ₺99')}
      </button>
      {error && <p className="text-xs text-center mt-2" style={{ color: '#e57373' }}>{error}</p>}
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

  const mirrorCopy: Record<MizacTip, string> = {
    safravi: 'Beklemek seni öldürür. "Neden kimse hızlı hareket etmiyor?" diye düşünürsün — ve haklısın. Çevrendeki yavaşlık seni yorar çünkü sen bir şeyi görüyorsun: ne yapılması gerektiğini. Bu berraklık hem gücün hem de ağırlığın.',
    demevi: 'Odaya girince bir şey değişir. İnsanlar sana çekilir — sen farkında bile olmazsın. Ama akşam yalnız kaldığında o sevinç nerede? Demevi mizaç: görünürde neşeli, içinde işlenmemiş duygular.',
    balgami: 'Kimse seni acele ettiremez. Bu bir zayıflık değil — bu bir güç. Ama bazen sen de soruyorsun: "Neden hiçbir şey beni heyecanlandırmıyor?" Balgami mizaç: sakin dışarıda, karmaşık içeride.',
    sevdavi: 'Her şeyi hissediyorsun — fazla hissediyorsun. Bir müzik seni ağlatabilir. Yanlış bir söz günlerce aklında kalır. Bu hassasiyet seni hem derinlikli hem de yorgun kılar.',
  };

  // Sonucu localStorage'a kaydet
  useEffect(() => {
    if (tip && puanlarStr) {
      localStorage.setItem('mizac_sonuc', JSON.stringify({ tip, puanlar, tarih: Date.now() }));
    }
  }, [tip, puanlarStr]);

  return (
    <main className="min-h-screen px-4 py-16" style={{ background: 'var(--background)' }}>
      <div className="max-w-2xl mx-auto">

        {/* Başlık — Dramatik Açılış */}
        <div
          className="rounded-3xl p-10 text-center mb-8"
          style={{ background: 'linear-gradient(180deg, #0f0a04 0%, #1a1207 100%)' }}
        >
          <p className="text-xs font-medium uppercase tracking-[0.3em] mb-6" style={{ color: profil.renk }}>
            {tr ? 'Mizaç Testi Sonucu' : 'Temperament Test Result'}
          </p>
          <div className="text-9xl mb-6">{profil.elementSembol}</div>
          <p className="text-sm font-medium mb-2 uppercase tracking-widest" style={{ color: '#9a8a6a' }}>
            {tr ? 'Sen' : 'You are'}
          </p>
          <h1 className="text-6xl font-bold mb-3" style={{ color: profil.renk }}>
            {tr ? profil.isim : profil.isimEn}
          </h1>
          <p className="text-base mb-6" style={{ color: '#5a4a2a' }}>{profil.element} · {profil.elementEn}</p>
          <p className="text-lg leading-relaxed max-w-md mx-auto mb-8" style={{ color: '#c8b87a' }}>
            {tr ? profil.kisaAciklama : profil.kisaAciklamaEn}
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {(tr ? profil.anahtarKelimeler : profil.anahtarKelimelerEn).map((kelime) => (
              <span
                key={kelime}
                className="px-4 py-1.5 rounded-full text-sm font-medium"
                style={{ background: profil.renk + '25', color: profil.renk, border: `1px solid ${profil.renk}50` }}
              >
                {kelime}
              </span>
            ))}
          </div>
        </div>

        {/* Kalıcı Link */}
        <Link
          href={`/sonuc/${tip}`}
          className="flex items-center gap-3 rounded-2xl p-4 mb-6 transition-all hover:opacity-90"
          style={{ background: '#1a1207', border: '1px solid #c4973a20' }}
        >
          <span className="text-xl">🔗</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold" style={{ color: '#c4973a' }}>
              {tr ? 'Bu sonucu kaydet' : 'Save this result'}
            </p>
            <p className="text-xs truncate" style={{ color: '#4a3520' }}>
              mizac.xyz/sonuc/{tip}
            </p>
          </div>
          <span
            className="text-xs px-3 py-1.5 rounded-full font-semibold text-white shrink-0"
            style={{ background: '#c4973a' }}
          >
            {tr ? 'Kalıcı Sayfa →' : 'Permalink →'}
          </span>
        </Link>

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
              className="text-xs px-3 py-1.5 rounded-full font-semibold text-white shrink-0"
              style={{ background: ikinciProfil.renk }}
            >
              {tr ? 'İncele' : 'Explore'}
            </Link>
          </div>
        )}

        {/* Ayna Bölümü */}
        <div className="rounded-3xl p-8 mb-6" style={{ background: '#1a1207' }}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: profil.renk }}>
            {tr ? '✦ Seni tanıyoruz' : '✦ We know you'}
          </p>
          <p className="text-xl font-serif leading-relaxed italic" style={{ color: '#e8d5b0' }}>
            &ldquo;{mirrorCopy[tip]}&rdquo;
          </p>
        </div>

        {/* Email Capture */}
        <EmailCapture tip={tip} profil={profil} tr={tr} />

        {/* Viral: Arkadaşını Test Et */}
        <div className="rounded-3xl p-8 mb-6" style={{ background: profil.renkAcik, border: `2px solid ${profil.renk}30` }}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: profil.renk }}>
            {tr ? '✦ Arkadaşını test et' : '✦ Test your friend'}
          </p>
          <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>
            {tr ? 'Arkadaşının mizacını tahmin edebilir misin?' : 'Can you guess your friend\'s temperament?'}
          </h3>
          <p className="text-sm leading-relaxed mb-5 opacity-70">
            {tr
              ? `Sen ${profil.isim} çıktın. Peki ya onlar? Testi gönder, sonucu birlikte karşılaştırın.`
              : `You got ${profil.isimEn}. What about them? Send the test, compare results together.`}
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={`https://wa.me/?text=${encodeURIComponent((tr
                ? `Mizaç testinde ${profil.isim} ${profil.elementSembol} çıktım! Sen ne çıkarsın? 👇\nhttps://mizac.xyz/test?utm_source=whatsapp&utm_medium=share&utm_campaign=result_${tip}`
                : `I got ${profil.isimEn} ${profil.elementSembol} on the temperament test! What would you get? 👇\nhttps://mizac.xyz/test?utm_source=whatsapp&utm_medium=share&utm_campaign=result_${tip}`))}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center py-3 rounded-full font-semibold text-white text-sm transition-all hover:opacity-90"
              style={{ background: '#25D366' }}
            >
              WhatsApp&apos;tan Gönder
            </a>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent((tr
                ? `Mizaç testinde ${profil.isim} ${profil.elementSembol} çıktım. Sen ne çıkarsın? @mizac_xyz`
                : `I got ${profil.isimEn} ${profil.elementSembol} on the temperament test. What about you?`))}&url=${encodeURIComponent(`https://mizac.xyz/test?utm_source=twitter&utm_medium=share&utm_campaign=result_${tip}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center py-3 rounded-full font-semibold text-white text-sm transition-all hover:opacity-90"
              style={{ background: '#000' }}
            >
              𝕏 Twitter&apos;da Paylaş
            </a>
          </div>
        </div>

        {/* Uyum Haritası */}
        {(() => {
          const order: MizacTip[] = ['safravi', 'demevi', 'balgami', 'sevdavi'];
          return (
            <div className="rounded-2xl p-6 mb-6" style={{ background: 'var(--cream)' }}>
              <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: profil.renk }}>
                {tr ? 'Mizaç Uyumu' : 'Temperament Compatibility'}
              </p>
              <h3 className="font-bold text-lg mb-4" style={{ color: 'var(--foreground)' }}>
                {tr
                  ? `${profil.elementSembol} ${profil.isim} hangi mizaçlarla uyumlu?`
                  : `Who is ${profil.isimEn} most compatible with?`}
              </h3>
              <div className="space-y-2 mb-3">
                {uyumHaritasi[tip].slice(0, 3).map(({ tip: digerTip, puan }) => {
                  const diger = mizacProfiller[digerTip];
                  const [x, y] = [tip, digerTip].sort((a, b) => order.indexOf(a) - order.indexOf(b));
                  const slug = `${x}-vs-${y}`;
                  const renkHex = puan >= 80 ? '#16a34a' : puan >= 60 ? '#2563eb' : puan >= 45 ? '#d97706' : '#dc2626';
                  return (
                    <Link key={digerTip} href={`/karsilastir/${slug}`}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white hover:shadow-sm transition-all border"
                      style={{ borderColor: diger.renk + '30' }}>
                      <span className="text-2xl shrink-0">{diger.elementSembol}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm" style={{ color: diger.renk }}>{tr ? diger.isim : diger.isimEn}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-sm font-bold" style={{ color: renkHex }}>%{puan}</span>
                        <div className="h-1 w-14 rounded-full mt-1" style={{ background: '#e5d5b0' }}>
                          <div className="h-1 rounded-full" style={{ width: `${puan}%`, background: renkHex }} />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
              <Link href="/karsilastir"
                className="block text-center text-xs transition-opacity hover:opacity-100 opacity-50"
                style={{ color: 'var(--earth)' }}>
                {tr ? 'Tüm uyum kombinasyonlarını gör →' : 'See all compatibility combinations →'}
              </Link>
            </div>
          );
        })()}

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
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
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

        {/* Topluluk */}
        <div className="rounded-2xl p-5 mb-6 flex gap-4 items-center" style={{ background: '#25D366' + '18', border: '1px solid #25D36640' }}>
          <div className="text-3xl shrink-0">💬</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold mb-0.5" style={{ color: '#128C7E' }}>
              {tr ? 'Mizaç Topluluğuna Katıl' : 'Join the Mizaç Community'}
            </p>
            <p className="text-xs opacity-70">
              {tr ? 'WhatsApp grubunda mizacını keşfedenlerle tanış.' : 'Meet others exploring their temperament on WhatsApp.'}
            </p>
          </div>
          <a
            href="https://chat.whatsapp.com/JgAiXSGm0wW7z0pQERCaaI"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 px-4 py-2 rounded-full text-white text-sm font-bold transition-all hover:opacity-90"
            style={{ background: '#25D366' }}
          >
            {tr ? 'Katıl' : 'Join'}
          </a>
        </div>

        {/* Kitap */}
        <div className="rounded-2xl p-5 mb-6 flex gap-4 items-center bg-amber-50 border border-amber-200">
          <div className="text-4xl shrink-0">📖</div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-amber-700 uppercase tracking-widest mb-0.5">
              {tr ? 'Bu bilgilerin kaynağı' : 'Source of this knowledge'}
            </p>
            <p className="font-bold text-stone-800 text-sm leading-snug">Varlığın Tahlili</p>
            <p className="text-stone-500 text-xs">Zeynep Işık Büyükbay</p>
          </div>
          <a
            href="https://www.idefix.com/arama?q=varl%C4%B1%C4%9F%C4%B1n+tahlili"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 px-4 py-2 rounded-full text-xs font-bold text-white bg-amber-600 hover:bg-amber-500 transition-colors"
          >
            {tr ? 'Kitabı Bul' : 'Find Book'}
          </a>
        </div>

        {/* PDF Upsell */}
        <div
          className="rounded-3xl p-8 mb-6"
          style={{ background: 'linear-gradient(135deg, #1a1207, #0f0a04)', border: `1.5px solid ${profil.renk}30` }}
        >
          <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: profil.renk }}>
            {tr ? '₺99 · PDF Rapor' : '₺99 · PDF Report'}
          </p>
          <h3 className="text-xl font-bold mb-2 text-white">
            {tr ? 'Derin Mizaç Raporu' : 'Deep Temperament Report'}
          </h3>
          <p className="text-sm mb-5" style={{ color: '#9a8a6a' }}>
            {tr
              ? `${profil.isim} mizacınıza özel, 20+ sayfalık kapsamlı PDF analiz.`
              : `20+ page comprehensive PDF analysis tailored to your ${profil.isimEn} temperament.`}
          </p>
          <ul className="space-y-2 mb-6">
            {(tr
              ? ['✦ Organ–duygu haritanız', '✦ Haftalık sağlık protokolü', '✦ İlişki ve kariyer uyum analizi', "✦ Esmaü'l-Hüsna zikirleriniz", '✦ Beslenme ve detoks takvimi']
              : ['✦ Your organ–emotion map', '✦ Weekly health protocol', '✦ Relationship & career compatibility', '✦ Your personal divine names', '✦ Nutrition & detox calendar']
            ).map((item) => (
              <li key={item} className="text-sm" style={{ color: '#c4973a' }}>{item}</li>
            ))}
          </ul>
          <PdfSatinAl tip={tip} renk={profil.renk} tr={tr} />
        </div>

        {/* SSS Linki */}
        <Link
          href="/sss"
          className="flex items-center gap-4 rounded-2xl p-5 mb-6 transition-all hover:opacity-90"
          style={{ background: 'var(--cream)', border: '1.5px solid var(--gold-light)' }}
        >
          <div className="text-3xl shrink-0">❓</div>
          <div className="flex-1">
            <p className="font-bold text-sm mb-0.5" style={{ color: 'var(--earth)' }}>
              {tr ? 'Mizaç hakkında merak ettiklerin' : 'Everything you wondered about temperament'}
            </p>
            <p className="text-xs opacity-60">
              {tr ? 'Sık sorulan sorular · Sağlık · Uyum · Beslenme' : 'FAQ · Health · Compatibility · Nutrition'}
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full text-white shrink-0" style={{ background: 'var(--gold)' }}>
            {tr ? 'SSS →' : 'FAQ →'}
          </span>
        </Link>

        {/* Yeni İçerik Keşfet */}
        <div className="rounded-2xl p-6 mb-6" style={{ background: 'var(--cream)' }}>
          <h2 className="font-bold mb-1" style={{ color: 'var(--foreground)' }}>
            {tr ? '📚 Mizacınla Keşfedeceklerın' : '📚 Explore With Your Temperament'}
          </h2>
          <p className="text-sm opacity-60 mb-4">
            {tr ? 'Mizacına göre özelleştirilmiş içerikler.' : 'Content personalized for your temperament.'}
          </p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { href: '/hastaliklar', ikon: '🫀', tr: 'Hastalık Haritası', en: 'Health Map' },
              { href: '/esma-sifa', ikon: '📿', tr: "Esmaü'l-Hüsna", en: 'Divine Names' },
              { href: '/nefes', ikon: '🌬️', tr: 'Nefes Egzersizleri', en: 'Breathing' },
              { href: '/gida-kavrami', ikon: '🍊', tr: 'Gıda Kavramı', en: 'Nourishment' },
              { href: '/meslekler', ikon: '💼', tr: 'Kariyer Rehberi', en: 'Careers' },
              { href: '/blog', ikon: '✦', tr: 'Mizaç Blog', en: 'Blog' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 rounded-xl p-3 bg-white hover:shadow-sm transition-all text-sm font-medium"
                style={{ color: 'var(--earth)' }}
              >
                <span className="text-lg">{item.ikon}</span>
                <span>{tr ? item.tr : item.en}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* İlgili Blog Yazıları */}
        {(() => {
          const ilgiliYazilar = blogYazilari.filter((y) => y.ilgiliMizac === tip).slice(0, 3);
          if (ilgiliYazilar.length === 0) return null;
          return (
            <div className="rounded-2xl p-6 mb-6" style={{ background: 'var(--cream)' }}>
              <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: profil.renk }}>
                ✦ {tr ? 'Senin İçin Yazılar' : 'Articles For You'}
              </p>
              <h3 className="font-bold text-lg mb-4" style={{ color: 'var(--foreground)' }}>
                {tr ? `${profil.elementSembol} ${profil.isim} hakkında` : `About ${profil.isimEn}`}
              </h3>
              <div className="space-y-2">
                {ilgiliYazilar.map((yazi) => (
                  <a
                    key={yazi.slug}
                    href={`/blog/${yazi.slug}`}
                    className="flex items-center gap-3 rounded-xl p-3 bg-white hover:shadow-sm transition-all border"
                    style={{ borderColor: profil.renk + '20' }}
                  >
                    <span className="text-xl shrink-0">{profil.elementSembol}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate" style={{ color: 'var(--foreground)' }}>{yazi.baslik}</p>
                      <p className="text-xs opacity-50 mt-0.5">{yazi.okumaSuresi} dk okuma</p>
                    </div>
                    <span className="text-xs opacity-40 shrink-0">→</span>
                  </a>
                ))}
              </div>
            </div>
          );
        })()}

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
