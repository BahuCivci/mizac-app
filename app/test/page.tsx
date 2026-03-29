'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { sorular, MizacTip } from '@/lib/mizac-data';
import { useLang } from '@/lib/lang-context';

export default function TestPage() {
  const router = useRouter();
  const [aktifSoru, setAktifSoru] = useState(0);
  const [puanlar, setPuanlar] = useState<Record<MizacTip, number>>({
    safravi: 0, demevi: 0, balgami: 0, sevdavi: 0,
  });
  const [seciliSecenekler, setSeciliSecenekler] = useState<number[]>([]);
  const [animasyon, setAnimasyon] = useState(false);

  const { lang } = useLang();
  const soru = sorular[aktifSoru];
  const ilerleme = ((aktifSoru) / sorular.length) * 100;

  function secenekSec(index: number, secenekPuan: Record<MizacTip, number>) {
    const yeniSecimler = [...seciliSecenekler];
    yeniSecimler[aktifSoru] = index;
    setSeciliSecenekler(yeniSecimler);

    const yeniPuanlar = { ...puanlar };
    (Object.keys(secenekPuan) as MizacTip[]).forEach((tip) => {
      yeniPuanlar[tip] += secenekPuan[tip];
    });
    setPuanlar(yeniPuanlar);

    setAnimasyon(true);
    setTimeout(() => {
      setAnimasyon(false);
      if (aktifSoru < sorular.length - 1) {
        setAktifSoru(aktifSoru + 1);
      } else {
        const kazanan = (Object.keys(yeniPuanlar) as MizacTip[]).reduce((a, b) =>
          yeniPuanlar[a] > yeniPuanlar[b] ? a : b
        );
        const puanStr = encodeURIComponent(JSON.stringify(yeniPuanlar));
        router.push(`/sonuc?tip=${kazanan}&puanlar=${puanStr}`);
      }
    }, 400);
  }

  function geriGit() {
    if (aktifSoru > 0) {
      setAktifSoru(aktifSoru - 1);
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
      style={{ background: 'var(--background)' }}>

      {/* Progress */}
      <div className="w-full max-w-xl mb-8">
        <div className="flex justify-between text-sm opacity-50 mb-2">
          <span>Soru {aktifSoru + 1} / {sorular.length}</span>
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
          {lang === 'tr' ? soru.soru : soru.soruEn}
        </h2>

        <div className="flex flex-col gap-3">
          {soru.secenekler.map((s, i) => (
            <button
              key={i}
              onClick={() => secenekSec(i, s.puan)}
              className="text-left px-5 py-4 rounded-xl border-2 transition-all hover:scale-[1.02] hover:shadow-md font-medium"
              style={{
                borderColor: seciliSecenekler[aktifSoru] === i ? 'var(--gold)' : 'var(--gold-light)',
                background: seciliSecenekler[aktifSoru] === i ? 'var(--gold-light)' : 'white',
                color: 'var(--foreground)',
              }}
            >
              <span className="mr-2 opacity-50">{['A', 'B', 'C', 'D'][i]})</span>
              {lang === 'tr' ? s.metin : s.metinEn}
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
          {lang === 'tr' ? '← Önceki soru' : '← Previous question'}
        </button>
      )}
    </main>
  );
}
