'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { sorular, MizacTip, mizacProfiller } from '@/lib/mizac-data';
import { useLang } from '@/lib/lang-context';
import Link from 'next/link';

function puanlariHesapla(secimler: (number | undefined)[]): Record<MizacTip, number> {
  const toplamlar: Record<MizacTip, number> = { safravi: 0, demevi: 0, balgami: 0, sevdavi: 0 };
  secimler.forEach((secim, soruIndex) => {
    if (secim === undefined) return;
    const puan = sorular[soruIndex].secenekler[secim].puan;
    (Object.keys(puan) as MizacTip[]).forEach((tip) => {
      toplamlar[tip] += puan[tip];
    });
  });
  return toplamlar;
}

export default function TestPage() {
  const router = useRouter();
  const [basladi, setBasladi] = useState(false);
  const [aktifSoru, setAktifSoru] = useState(0);
  const [seciliSecenekler, setSeciliSecenekler] = useState<(number | undefined)[]>([]);
  const [animasyon, setAnimasyon] = useState(false);
  const [oncekiSonuc, setOncekiSonuc] = useState<{ tip: MizacTip; tarih: number } | null>(null);

  const { lang } = useLang();

  useEffect(() => {
    try {
      const kayit = localStorage.getItem('mizac_sonuc');
      if (kayit) setOncekiSonuc(JSON.parse(kayit));
    } catch {}
  }, []);
  const soru = sorular[aktifSoru];
  const ilerleme = (aktifSoru / sorular.length) * 100;
  const tr = lang === 'tr';

  function secenekSec(index: number) {
    const yeniSecimler = [...seciliSecenekler];
    yeniSecimler[aktifSoru] = index;
    setSeciliSecenekler(yeniSecimler);

    setAnimasyon(true);
    setTimeout(() => {
      setAnimasyon(false);
      if (aktifSoru < sorular.length - 1) {
        setAktifSoru(aktifSoru + 1);
      } else {
        const puanlar = puanlariHesapla(yeniSecimler);
        const kazanan = (Object.keys(puanlar) as MizacTip[]).reduce((a, b) =>
          puanlar[a] > puanlar[b] ? a : b
        );
        const puanStr = encodeURIComponent(JSON.stringify(puanlar));
        router.push(`/sonuc?tip=${kazanan}&puanlar=${puanStr}`);
      }
    }, 400);
  }

  function geriGit() {
    if (aktifSoru > 0) {
      setAktifSoru(aktifSoru - 1);
    }
  }

  const oncekiProfil = oncekiSonuc ? mizacProfiller[oncekiSonuc.tip] : null;

  if (!basladi) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12" style={{ background: 'var(--background)' }}>
        <div className="w-full max-w-xl">
          {/* Intro */}
          <div className="rounded-3xl p-10 text-center mb-6" style={{ background: 'linear-gradient(180deg, #0f0a04 0%, #1a1207 100%)' }}>
            <div className="text-6xl mb-6">✦</div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] mb-3" style={{ color: '#c4973a' }}>
              {tr ? 'Mizaç Testi' : 'Temperament Test'}
            </p>
            <h1 className="text-3xl font-bold mb-4" style={{ color: '#e8d5b0' }}>
              {tr ? 'Kendini kaç yıldır yanlış okuyorsun?' : 'How long have you been misreading yourself?'}
            </h1>
            <p className="text-base leading-relaxed mb-8" style={{ color: '#9a8a6a' }}>
              {tr
                ? '50 soru, 8 dakika. İbn-i Sina\'nın kadim mizaç bilimine dayalı — sağlık, ilişki ve yaşam rehberin.'
                : '50 questions, 8 minutes. Based on Ibn Sina\'s ancient temperament science — your health, relationship and life guide.'}
            </p>
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { sayi: '50', etiket: tr ? 'Soru' : 'Questions' },
                { sayi: '~8', etiket: tr ? 'Dakika' : 'Minutes' },
                { sayi: '4', etiket: tr ? 'Mizaç' : 'Types' },
              ].map((item) => (
                <div key={item.etiket} className="rounded-2xl py-4" style={{ background: '#2a1f0a' }}>
                  <p className="text-2xl font-bold" style={{ color: '#c4973a' }}>{item.sayi}</p>
                  <p className="text-xs" style={{ color: '#9a8a6a' }}>{item.etiket}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => setBasladi(true)}
              className="w-full py-4 rounded-full font-bold text-lg text-white transition-all hover:scale-105 hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #8b5e1e, #c4973a)' }}
            >
              ✦ {tr ? 'Testi Başlat' : 'Start the Test'}
            </button>
          </div>
          {/* Önceki sonuç */}
          {oncekiProfil && (
            <div className="rounded-2xl p-4 flex items-center gap-3"
              style={{ background: oncekiProfil.renkAcik, border: `1.5px solid ${oncekiProfil.renk}40` }}>
              <span className="text-2xl">{oncekiProfil.elementSembol}</span>
              <div className="flex-1 text-sm">
                <span className="opacity-60">{tr ? 'Önceki sonucunuz:' : 'Previous result:'} </span>
                <span className="font-bold" style={{ color: oncekiProfil.renk }}>{tr ? oncekiProfil.isim : oncekiProfil.isimEn}</span>
              </div>
              <Link href={`/sonuc?tip=${oncekiSonuc!.tip}&puanlar=${encodeURIComponent(JSON.stringify({ safravi: 0, demevi: 0, balgami: 0, sevdavi: 0 }))}`}
                className="text-xs px-3 py-1.5 rounded-full font-semibold text-white shrink-0"
                style={{ background: oncekiProfil.renk }}>
                {tr ? 'Görüntüle' : 'View'}
              </Link>
            </div>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
      style={{ background: 'var(--background)' }}>

      {/* Önceki sonuç banner */}
      {oncekiProfil && aktifSoru === 0 && (
        <div
          className="w-full max-w-xl mb-4 rounded-2xl p-4 flex items-center gap-3"
          style={{ background: oncekiProfil.renkAcik, border: `1.5px solid ${oncekiProfil.renk}40` }}
        >
          <span className="text-2xl">{oncekiProfil.elementSembol}</span>
          <div className="flex-1 text-sm">
            <span className="opacity-60">{tr ? 'Önceki sonucunuz:' : 'Your previous result:'} </span>
            <span className="font-bold" style={{ color: oncekiProfil.renk }}>
              {tr ? oncekiProfil.isim : oncekiProfil.isimEn}
            </span>
          </div>
          <Link
            href={`/sonuc?tip=${oncekiSonuc!.tip}&puanlar=${encodeURIComponent(JSON.stringify({ safravi: 0, demevi: 0, balgami: 0, sevdavi: 0 }))}`}
            className="text-xs px-3 py-1.5 rounded-full font-semibold text-white flex-shrink-0"
            style={{ background: oncekiProfil.renk }}
          >
            {tr ? 'Görüntüle' : 'View'}
          </Link>
        </div>
      )}

      {/* Progress */}
      <div className="w-full max-w-xl mb-8">
        <div className="flex justify-between text-sm opacity-50 mb-2">
          <span>{tr ? 'Soru' : 'Question'} {aktifSoru + 1} / {sorular.length}</span>
          <span>%{Math.round(ilerleme)}</span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--gold-light)' }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${ilerleme}%`,
              background: 'linear-gradient(90deg, var(--earth), var(--gold))',
            }}
          />
        </div>
      </div>

      {/* Soru Kartı */}
      <div
        className="w-full max-w-xl rounded-3xl p-8 shadow-lg mb-6 transition-all duration-300"
        style={{
          background: 'var(--cream)',
          opacity: animasyon ? 0 : 1,
          transform: animasyon ? 'translateY(8px)' : 'translateY(0)',
        }}
      >
        <div className="text-3xl text-center mb-4" style={{ color: 'var(--gold)' }}>✦</div>
        <h2 className="text-xl font-bold text-center mb-8" style={{ color: 'var(--foreground)' }}>
          {tr ? soru.soru : soru.soruEn}
        </h2>

        <div className="flex flex-col gap-3">
          {soru.secenekler.map((s, i) => (
            <button
              key={i}
              onClick={() => secenekSec(i)}
              className="text-left px-5 py-4 rounded-xl border-2 transition-all hover:scale-[1.02] hover:shadow-md font-medium"
              style={{
                borderColor: seciliSecenekler[aktifSoru] === i ? 'var(--gold)' : 'var(--gold-light)',
                background: seciliSecenekler[aktifSoru] === i ? 'var(--gold-light)' : 'white',
                color: 'var(--foreground)',
              }}
            >
              <span className="mr-2 opacity-50">{['A', 'B', 'C', 'D'][i]})</span>
              {tr ? s.metin : s.metinEn}
            </button>
          ))}
        </div>
      </div>

      {/* Geri butonu */}
      {aktifSoru > 0 && (
        <button
          onClick={geriGit}
          className="opacity-50 hover:opacity-100 transition-opacity text-sm"
          style={{ color: 'var(--earth)' }}
        >
          {tr ? '← Önceki soru' : '← Previous question'}
        </button>
      )}
    </main>
  );
}
