'use client';

import { useEffect, useRef } from 'react';
import { ADSENSE_ID, REKLAM_ACIK } from '@/lib/reklam';

/**
 * Tek bir AdSense birimi.
 *
 * YER KAPLAMA ÖNCEDEN AYRILIYOR
 * Reklam geldiğinde sayfa zıplarsa hem okuma bozuluyor hem Core Web Vitals'ta
 * CLS cezası yiyoruz — ve o ceza arama sıralamasına yansıyor, yani reklamdan
 * kazandığını trafikten kaybediyorsun. Bu yüzden kutunun yüksekliği reklam
 * yüklenmeden önce ayrılıyor.
 *
 * "Reklam" ETİKETİ KASITLI
 * İçerikle reklamın karışması hem okuyucuya karşı dürüst değil hem de
 * AdSense'in kendi politikasına aykırı; ayırt edilmesi gerekiyor.
 */
export default function Reklam({ slot, className = '' }: { slot: string; className?: string }) {
  const basildi = useRef(false);

  useEffect(() => {
    if (!REKLAM_ACIK || !slot || basildi.current) return;
    // React StrictMode geliştirmede efekti iki kez çalıştırıyor; ikinci push
    // "already have ads in them" hatası veriyor.
    basildi.current = true;
    try {
      const w = window as unknown as { adsbygoogle?: unknown[] };
      (w.adsbygoogle = w.adsbygoogle || []).push({});
    } catch {
      // Reklam engelleyici ya da betik gelmemiş olabilir; sayfa çalışmaya
      // devam etmeli.
    }
  }, [slot]);

  if (!REKLAM_ACIK || !slot) return null;

  return (
    <aside className={`my-8 ${className}`}>
      <p
        className="text-[10px] uppercase tracking-[0.2em] mb-1 opacity-40"
        style={{ color: 'var(--foreground)' }}
      >
        Reklam
      </p>
      <div style={{ minHeight: 280 }}>
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client={ADSENSE_ID}
          data-ad-slot={slot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    </aside>
  );
}
