import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Koku & Mizaç | mizac.xyz';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div style={{
        width: '100%', height: '100%',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(180deg, #0f0a04 0%, #1a1207 50%, #1a0a18 100%)',
        fontFamily: 'serif',
      }}>
        <div style={{ fontSize: 64, display: 'flex', marginBottom: 16 }}>✿</div>
        <div style={{ fontSize: 68, fontWeight: 900, color: '#c4973a', display: 'flex', marginBottom: 12 }}>
          Koku &amp; Mizaç
        </div>
        <div style={{ fontSize: 26, color: '#9a8060', display: 'flex', marginBottom: 48 }}>
          Aromaterapi ve buhur rehberi
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          {[
            { mizac: 'Safravî',  koku: 'Gül',   c: '#e05a7a', bg: '#2a0f18' },
            { mizac: 'Demevî',   koku: 'Misk',  c: '#c4973a', bg: '#2a1f08' },
            { mizac: 'Balgamî',  koku: 'Öd',    c: '#4a9eda', bg: '#0f1f2a' },
            { mizac: 'Sevdavî',  koku: 'Amber', c: '#9b72cf', bg: '#1a0f2a' },
          ].map((k) => (
            <div key={k.mizac} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
              padding: '20px 28px', borderRadius: 14,
              background: k.bg,
              border: `1px solid ${k.c}40`,
            }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: k.c, display: 'flex' }}>{k.mizac}</div>
              <div style={{ fontSize: 16, color: '#f5f0e8', opacity: 0.65, display: 'flex' }}>{k.koku}</div>
            </div>
          ))}
        </div>
        <div style={{
          position: 'absolute', bottom: 32,
          fontSize: 18, color: '#6b5230', display: 'flex',
        }}>
          mizac.xyz · Tibb-i Nebevî Geleneği
        </div>
      </div>
    ),
    { ...size }
  );
}
