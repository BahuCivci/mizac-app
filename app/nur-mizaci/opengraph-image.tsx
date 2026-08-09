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
        background: 'linear-gradient(135deg, #faf5ff 0%, #e9d5ff 50%, #fdf4e3 100%)',
        fontFamily: 'serif',
      }}>
        <div style={{ fontSize: 80, display: 'flex', marginBottom: 16 }}>✨</div>
        <div style={{ fontSize: 72, fontWeight: 900, color: '#6d28d9', display: 'flex', marginBottom: 12 }}>
          Nur Mizacı
        </div>
        <div style={{ fontSize: 32, color: '#7c3aed', display: 'flex', marginBottom: 12, opacity: 0.8 }}>
          4 Mizacın Ötesi · Kemale Ermiş Hal
        </div>
        <div style={{ fontSize: 24, color: '#8b6914', display: 'flex', marginBottom: 40, opacity: 0.7 }}>
          The Luminous Temperament
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          {['Denge', 'Olgunluk', 'Farkındalık', 'İlâhî Nur'].map((k) => (
            <div key={k} style={{
              display: 'flex', padding: '8px 20px',
              borderRadius: 24, background: '#ede9fe',
              fontSize: 20, color: '#6d28d9', fontWeight: 600,
            }}>
              {k}
            </div>
          ))}
        </div>
        <div style={{
          position: 'absolute', bottom: 32,
          fontSize: 18, color: '#6d28d9', opacity: 0.5, display: 'flex',
        }}>
          mizac.xyz · 8 Yol ile Nur Mizacına Ulaşmak
        </div>
      </div>
    ),
    { ...size }
  );
}
