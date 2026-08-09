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
        background: 'linear-gradient(180deg, #1c1917 0%, #292524 100%)',
        fontFamily: 'serif',
      }}>
        <div style={{ fontSize: 56, display: 'flex', marginBottom: 20 }}>❓</div>
        <div style={{ fontSize: 72, fontWeight: 900, color: '#c4973a', display: 'flex', marginBottom: 16, textAlign: 'center' }}>
          Sık Sorulan Sorular
        </div>
        <div style={{ fontSize: 32, color: '#a8a29e', display: 'flex', marginBottom: 40 }}>
          Mizaç hakkında her şey
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          {['Hıltlar', 'Bitkiler', 'Rüya', 'Namaz', 'Uyum'].map((k) => (
            <div key={k} style={{
              display: 'flex', padding: '8px 20px',
              borderRadius: 24, background: '#3d2c0e',
              fontSize: 22, color: '#c4973a',
            }}>
              {k}
            </div>
          ))}
        </div>
        <div style={{
          position: 'absolute', bottom: 32,
          fontSize: 18, color: '#6b5230', display: 'flex',
        }}>
          mizac.xyz · İbn-i Sina Geleneği
        </div>
      </div>
    ),
    { ...size }
  );
}
