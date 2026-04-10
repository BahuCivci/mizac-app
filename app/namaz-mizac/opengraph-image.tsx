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
        background: 'linear-gradient(180deg, #0f0a04 0%, #1a1207 100%)',
        fontFamily: 'serif',
      }}>
        <div style={{ fontSize: 72, display: 'flex', marginBottom: 16 }}>🕌</div>
        <div style={{ fontSize: 68, fontWeight: 900, color: '#c4973a', display: 'flex', marginBottom: 12 }}>
          Namaz Vakitleri & Mizaç
        </div>
        <div style={{ fontSize: 28, color: '#a08030', display: 'flex', marginBottom: 40, opacity: 0.8 }}>
          Her Vakit Bir Hılt
        </div>
        <div style={{ display: 'flex', gap: 28 }}>
          {[
            { vakit: 'Sabah', icon: '🌅', hilt: 'Kan', c: '#e05a7a' },
            { vakit: 'Öğle', icon: '☀️', hilt: 'Safra', c: '#e8832a' },
            { vakit: 'İkindi', icon: '🌤️', hilt: 'Geçiş', c: '#6b8e5e' },
            { vakit: 'Akşam', icon: '🌆', hilt: 'Sevda', c: '#7b5ea7' },
            { vakit: 'Yatsı', icon: '🌙', hilt: 'Balgam', c: '#4a9eda' },
          ].map((v) => (
            <div key={v.vakit} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
              padding: '14px 16px', borderRadius: 14,
              background: 'rgba(255,255,255,0.06)',
            }}>
              <div style={{ fontSize: 36, display: 'flex' }}>{v.icon}</div>
              <div style={{ fontSize: 15, color: '#c4973a', display: 'flex' }}>{v.vakit}</div>
              <div style={{ fontSize: 13, color: v.c, display: 'flex' }}>{v.hilt}</div>
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
