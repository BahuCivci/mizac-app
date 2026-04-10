import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div style={{
        width: '100%', height: '100%',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg, #1e1b4b 0%, #2d1b69 50%, #0f0a04 100%)',
        fontFamily: 'serif',
      }}>
        <div style={{ fontSize: 80, display: 'flex', marginBottom: 16 }}>🌙</div>
        <div style={{ fontSize: 72, fontWeight: 900, color: '#c4b5fd', display: 'flex', marginBottom: 12 }}>
          Rüya & Mizaç
        </div>
        <div style={{ fontSize: 30, color: '#a78bfa', display: 'flex', marginBottom: 12, opacity: 0.85 }}>
          Hıltlar Gece Ne Anlatır?
        </div>
        <div style={{ fontSize: 22, color: '#8b6914', display: 'flex', marginBottom: 40, opacity: 0.7 }}>
          Dreams & Temperament
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          {[
            { e: '🔥', n: 'Safravî', dream: 'Ateş · Çatışma', c: '#e8832a' },
            { e: '💨', n: 'Demevî', dream: 'Neşe · Renk', c: '#e05a7a' },
            { e: '💧', n: 'Balgamî', dream: 'Su · Sakinlik', c: '#4a9eda' },
            { e: '🌍', n: 'Sevdavî', dream: 'Sembol · Derinlik', c: '#a78bfa' },
          ].map((m) => (
            <div key={m.n} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
              padding: '12px 18px', borderRadius: 14,
              background: 'rgba(255,255,255,0.06)',
            }}>
              <div style={{ fontSize: 36, display: 'flex' }}>{m.e}</div>
              <div style={{ fontSize: 16, color: m.c, fontWeight: 700, display: 'flex' }}>{m.n}</div>
              <div style={{ fontSize: 13, color: '#a78bfa', opacity: 0.7, display: 'flex' }}>{m.dream}</div>
            </div>
          ))}
        </div>
        <div style={{
          position: 'absolute', bottom: 32,
          fontSize: 18, color: '#6d28d9', opacity: 0.6, display: 'flex',
        }}>
          mizac.xyz · İbn-i Sina Geleneği
        </div>
      </div>
    ),
    { ...size }
  );
}
