import { ImageResponse } from 'next/og';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0f0a04 0%, #1a1207 60%, #0f0a04 100%)',
          padding: '60px 80px',
          position: 'relative',
        }}
      >
        {/* Glow */}
        <div style={{
          position: 'absolute', top: -60, left: -60,
          width: 350, height: 350, borderRadius: '50%',
          background: '#c4973a', opacity: 0.05,
        }} />

        {/* Badge */}
        <div style={{
          display: 'flex', alignItems: 'center',
          background: '#c4973a18', border: '1.5px solid #c4973a40',
          padding: '8px 24px', borderRadius: 100, marginBottom: 32,
        }}>
          <span style={{ fontSize: 16, color: '#c4973a', letterSpacing: '0.25em', fontWeight: 700 }}>
            ✦ MİZAÇ TESTİ
          </span>
        </div>

        {/* Elements */}
        <div style={{ display: 'flex', gap: 20, fontSize: 64, marginBottom: 24 }}>
          <span>🔥</span><span>💨</span><span>💧</span><span>🌍</span>
        </div>

        {/* Title */}
        <div style={{
          fontSize: 72, fontWeight: 900, color: '#e8d5b0',
          textAlign: 'center', lineHeight: 1.1, marginBottom: 16,
        }}>
          Kendini kaç yıldır yanlış okuyorsun?
        </div>

        {/* Subtitle */}
        <div style={{ fontSize: 26, color: '#9a8a6a', textAlign: 'center', marginBottom: 44 }}>
          İbn-i Sina geleneğine dayalı 50 soruluk ücretsiz test
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 32 }}>
          {[['50', 'Soru'], ['~8', 'Dakika'], ['4', 'Mizaç Tipi'], ['Ücretsiz', '']].map(([sayi, etiket]) => (
            <div key={sayi} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              background: '#2a1f0a', padding: '14px 24px', borderRadius: 14,
            }}>
              <span style={{ fontSize: 32, fontWeight: 900, color: '#c4973a' }}>{sayi}</span>
              {etiket && <span style={{ fontSize: 14, color: '#9a8a6a' }}>{etiket}</span>}
            </div>
          ))}
        </div>

        {/* Domain */}
        <div style={{
          position: 'absolute', bottom: 36,
          fontSize: 18, color: '#6b5230', letterSpacing: '0.1em',
        }}>
          mizac.xyz/test
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
