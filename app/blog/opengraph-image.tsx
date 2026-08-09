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
        background: 'linear-gradient(180deg, #0f0a04 0%, #1a1207 100%)',
        fontFamily: 'serif',
      }}>
        <div style={{ fontSize: 64, display: 'flex', marginBottom: 16 }}>📖</div>
        <div style={{ fontSize: 72, fontWeight: 900, color: '#c4973a', display: 'flex', marginBottom: 12 }}>
          Mizaç Blog
        </div>
        <div style={{ fontSize: 30, color: '#a08030', display: 'flex', marginBottom: 40, opacity: 0.85 }}>
          İbn-i Sina Geleneğinde Bilgi & Yaşam
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          {['Hıltlar', 'Bitkiler', 'Rüya', 'Namaz', 'Burnout', 'Vesvese'].map((k) => (
            <div key={k} style={{
              display: 'flex', padding: '8px 18px',
              borderRadius: 24, background: 'rgba(196, 151, 58, 0.15)',
              border: '1px solid rgba(196, 151, 58, 0.3)',
              fontSize: 20, color: '#c4973a',
            }}>
              {k}
            </div>
          ))}
        </div>
        <div style={{
          position: 'absolute', bottom: 32,
          fontSize: 18, color: '#6b5230', display: 'flex',
        }}>
          mizac.xyz · 29 Makale
        </div>
      </div>
    ),
    { ...size }
  );
}
