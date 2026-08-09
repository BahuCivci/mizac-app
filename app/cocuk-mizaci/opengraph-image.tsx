import { ImageResponse } from 'next/og';

export const alt = 'Çocuk Mizacı | mizac.xyz';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div style={{
        width: '100%', height: '100%',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(180deg, #1a1207 0%, #2a1a08 60%, #1a1207 100%)',
        fontFamily: 'serif',
      }}>
        <div style={{ fontSize: 72, display: 'flex', marginBottom: 16 }}>👶</div>
        <div style={{ fontSize: 72, fontWeight: 900, color: '#c4973a', display: 'flex', marginBottom: 12 }}>
          Çocuk Mizacı
        </div>
        <div style={{ fontSize: 30, color: '#f5f0e8', display: 'flex', marginBottom: 40, opacity: 0.8 }}>
          Çocuğunuzun doğasını keşfedin
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          {[
            { e: '🌟', n: 'Safravî', c: '#e8832a' },
            { e: '🌸', n: 'Demevî', c: '#e05a7a' },
            { e: '🌊', n: 'Balgamî', c: '#4a9eda' },
            { e: '🍂', n: 'Sevdavî', c: '#9a8060' },
          ].map((m) => (
            <div key={m.n} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
              padding: '14px 20px', borderRadius: 16,
              background: 'rgba(196, 151, 58, 0.1)',
              border: '1px solid rgba(196, 151, 58, 0.25)',
            }}>
              <div style={{ fontSize: 36, display: 'flex' }}>{m.e}</div>
              <div style={{ fontSize: 17, color: m.c, fontWeight: 700, display: 'flex' }}>{m.n}</div>
            </div>
          ))}
        </div>
        <div style={{
          position: 'absolute', bottom: 32,
          fontSize: 18, color: '#6b5230', display: 'flex',
        }}>
          mizac.xyz · Çocuk Gelişimi
        </div>
      </div>
    ),
    { ...size }
  );
}
