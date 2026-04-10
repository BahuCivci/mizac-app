import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Müzik & Mizaç | mizac.xyz';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div style={{
        width: '100%', height: '100%',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(180deg, #0f0a04 0%, #1a1207 60%, #1a0f2a 100%)',
        fontFamily: 'serif',
      }}>
        <div style={{ fontSize: 64, display: 'flex', marginBottom: 16 }}>♩</div>
        <div style={{ fontSize: 68, fontWeight: 900, color: '#c4973a', display: 'flex', marginBottom: 12 }}>
          Müzik &amp; Mizaç
        </div>
        <div style={{ fontSize: 26, color: '#9a8060', display: 'flex', marginBottom: 48 }}>
          İbn-i Sina&#39;nın müzik terapisi
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          {[
            { makam: 'Uşşak',  mizac: 'Demevî',   c: '#e05a7a' },
            { makam: 'Rast',   mizac: 'Balgamî',  c: '#4a9eda' },
            { makam: 'Hicaz',  mizac: 'Safravî',  c: '#e8832a' },
            { makam: 'Saba',   mizac: 'Sevdavî',  c: '#9b72cf' },
          ].map((m) => (
            <div key={m.makam} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
              padding: '20px 28px', borderRadius: 14,
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(196,151,58,0.25)',
            }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#c4973a', display: 'flex' }}>{m.makam}</div>
              <div style={{ fontSize: 16, color: m.c, display: 'flex' }}>{m.mizac}</div>
            </div>
          ))}
        </div>
        <div style={{
          position: 'absolute', bottom: 32,
          fontSize: 18, color: '#6b5230', display: 'flex',
        }}>
          mizac.xyz · İslam Tıbbı Geleneği
        </div>
      </div>
    ),
    { ...size }
  );
}
