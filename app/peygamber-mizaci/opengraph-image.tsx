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
        background: 'linear-gradient(180deg, #0f0a04 0%, #1a1207 60%, #2a1e0a 100%)',
        fontFamily: 'serif',
      }}>
        <div style={{ fontSize: 80, display: 'flex', marginBottom: 16 }}>🌙</div>
        <div style={{ fontSize: 64, fontWeight: 900, color: '#c4973a', display: 'flex', marginBottom: 12, textAlign: 'center' }}>
          Hz. Peygamber&#39;in Mizacı
        </div>
        <div style={{ fontSize: 28, color: '#a08030', display: 'flex', marginBottom: 40, opacity: 0.85 }}>
          Nebevî Denge · Mutedil Mizaç
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          {[
            { label: 'Çörekotu', icon: '🌱' },
            { label: 'Bal', icon: '🍯' },
            { label: 'Zeytinyağı', icon: '🫒' },
            { label: 'Hacamat', icon: '⚕️' },
          ].map((item) => (
            <div key={item.label} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
              padding: '12px 18px', borderRadius: 14,
              background: 'rgba(196, 151, 58, 0.12)',
              border: '1px solid rgba(196, 151, 58, 0.3)',
            }}>
              <div style={{ fontSize: 32, display: 'flex' }}>{item.icon}</div>
              <div style={{ fontSize: 16, color: '#c4973a', display: 'flex' }}>{item.label}</div>
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
