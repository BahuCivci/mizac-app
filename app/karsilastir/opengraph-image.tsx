import { ImageResponse } from 'next/og';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div style={{
        width: '100%', height: '100%',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg, #fdf6e3 0%, #f5e6c8 100%)',
        fontFamily: 'serif',
      }}>
        <div style={{ fontSize: 64, display: 'flex', marginBottom: 16 }}>⚡</div>
        <div style={{ fontSize: 68, fontWeight: 900, color: '#2c1810', display: 'flex', marginBottom: 12 }}>
          Mizaç Karşılaştırması
        </div>
        <div style={{ fontSize: 28, color: '#8b6914', display: 'flex', marginBottom: 48, opacity: 0.8 }}>
          6 Kombinasyon · Uyum & Çatışma
        </div>
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          {[
            { e: '🔥', n: 'Safravî', c: '#c0392b' },
            { e: '💨', n: 'Demevî', c: '#2980b9' },
          ].map((m) => (
            <div key={m.n} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <div style={{ fontSize: 56, display: 'flex' }}>{m.e}</div>
              <div style={{ fontSize: 20, color: m.c, fontWeight: 700, display: 'flex' }}>{m.n}</div>
            </div>
          ))}
          <div style={{ fontSize: 40, color: '#c4973a', display: 'flex', margin: '0 8px' }}>VS</div>
          {[
            { e: '💧', n: 'Balgamî', c: '#27ae60' },
            { e: '🌍', n: 'Sevdavî', c: '#8e44ad' },
          ].map((m) => (
            <div key={m.n} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <div style={{ fontSize: 56, display: 'flex' }}>{m.e}</div>
              <div style={{ fontSize: 20, color: m.c, fontWeight: 700, display: 'flex' }}>{m.n}</div>
            </div>
          ))}
        </div>
        <div style={{
          position: 'absolute', bottom: 32,
          fontSize: 18, color: '#8b6914', opacity: 0.6, display: 'flex',
        }}>
          mizac.xyz · İlişki & Uyum Haritası
        </div>
      </div>
    ),
    { ...size }
  );
}
