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
        background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #fdf6e3 100%)',
        fontFamily: 'serif',
      }}>
        <div style={{ fontSize: 80, display: 'flex', marginBottom: 16 }}>🌿</div>
        <div style={{ fontSize: 72, fontWeight: 900, color: '#14532d', display: 'flex', marginBottom: 12 }}>
          Şifalı Bitkiler
        </div>
        <div style={{ fontSize: 30, color: '#166534', display: 'flex', marginBottom: 12, opacity: 0.8 }}>
          Mizacına Göre Bitki Rehberi
        </div>
        <div style={{ fontSize: 22, color: '#8b6914', display: 'flex', marginBottom: 40, opacity: 0.7 }}>
          Hangi bitki seni dengeler, hangi bitki bozar?
        </div>
        <div style={{ display: 'flex', gap: 20 }}>
          {[
            { e: '🔥', n: 'Safravî', herb: 'Nane · Gül', c: '#e8832a' },
            { e: '💨', n: 'Demevî', herb: 'Adaçayı · Kekik', c: '#e05a7a' },
            { e: '💧', n: 'Balgamî', herb: 'Zencefil · Tarçın', c: '#4a9eda' },
            { e: '🌍', n: 'Sevdavî', herb: 'Safran · Lavanta', c: '#7b5ea7' },
          ].map((m) => (
            <div key={m.n} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
              padding: '12px 16px', borderRadius: 16, background: 'white',
            }}>
              <div style={{ fontSize: 32, display: 'flex' }}>{m.e}</div>
              <div style={{ fontSize: 16, color: m.c, fontWeight: 700, display: 'flex' }}>{m.n}</div>
              <div style={{ fontSize: 13, color: '#6b7280', display: 'flex' }}>{m.herb}</div>
            </div>
          ))}
        </div>
        <div style={{
          position: 'absolute', bottom: 32,
          fontSize: 18, color: '#166534', opacity: 0.5, display: 'flex',
        }}>
          mizac.xyz · İbn-i Sina Geleneği
        </div>
      </div>
    ),
    { ...size }
  );
}
