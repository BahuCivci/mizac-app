import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Nefes Egzersizleri | mizac.xyz';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div style={{
        width: '100%', height: '100%',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg, #07101a 0%, #0d1e2d 50%, #1a1207 100%)',
        fontFamily: 'serif',
      }}>
        <div style={{ display: 'flex', position: 'relative', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
          {[100, 70, 44].map((s, i) => (
            <div key={i} style={{
              position: 'absolute', width: s, height: s,
              borderRadius: '50%', border: `${2 - i * 0.5}px solid`,
              borderColor: `rgba(74,158,218,${0.3 + i * 0.2})`,
              display: 'flex',
            }} />
          ))}
          <div style={{ width: 100, height: 100, display: 'flex' }} />
        </div>
        <div style={{ fontSize: 72, fontWeight: 900, color: '#f5f0e8', display: 'flex', marginBottom: 12 }}>
          Nefes Egzersizleri
        </div>
        <div style={{ fontSize: 28, color: '#4a9eda', display: 'flex', marginBottom: 32, opacity: 0.85 }}>
          Mizaca göre nefes ve zihin pratikleri
        </div>
        <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
          {['Nefes Al', 'Tut', 'Ver'].map((step, i) => (
            <div key={step} style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
              <div style={{
                fontSize: 24, fontWeight: 700,
                color: i === 1 ? '#c4973a' : '#4a9eda', display: 'flex',
              }}>
                {step}
              </div>
              {i < 2 && <div style={{ fontSize: 24, color: '#9a8060', opacity: 0.5, display: 'flex' }}>·</div>}
            </div>
          ))}
        </div>
        <div style={{
          position: 'absolute', bottom: 32,
          fontSize: 18, color: '#9a8060', opacity: 0.7, display: 'flex',
        }}>
          mizac.xyz · Ruh & Beden Dengesi
        </div>
      </div>
    ),
    { ...size }
  );
}
