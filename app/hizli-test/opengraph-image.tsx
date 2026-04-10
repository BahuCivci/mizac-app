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
          position: 'absolute', top: -80, right: -80,
          width: 400, height: 400, borderRadius: '50%',
          background: '#c4973a', opacity: 0.06,
        }} />

        {/* Tag */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: '#c4973a18', border: '1.5px solid #c4973a40',
          padding: '8px 24px', borderRadius: 100, marginBottom: 32,
        }}>
          <span style={{ fontSize: 16, color: '#c4973a', letterSpacing: '0.25em', fontWeight: 700 }}>
            ⚡ HIZLI MİZAÇ TESTİ
          </span>
        </div>

        {/* Emojis */}
        <div style={{ display: 'flex', gap: 24, fontSize: 72, marginBottom: 28 }}>
          <span>🔥</span><span>💧</span><span>🌊</span><span>🌍</span>
        </div>

        {/* Title */}
        <div style={{
          fontSize: 68, fontWeight: 900, color: '#e8d5b0',
          textAlign: 'center', lineHeight: 1.15, marginBottom: 20,
        }}>
          10 Soruda Mizacını Öğren
        </div>

        {/* Subtitle */}
        <div style={{ fontSize: 28, color: '#9a8a6a', textAlign: 'center', marginBottom: 40 }}>
          Safravî · Demevî · Balgamî · Sevdavî — hangisisin?
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 40 }}>
          {[['10', 'Soru'], ['2', 'Dakika'], ['4', 'Mizaç Tipi']].map(([sayi, etiket]) => (
            <div key={etiket} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              background: '#2a1f0a', padding: '16px 28px', borderRadius: 16,
            }}>
              <span style={{ fontSize: 36, fontWeight: 900, color: '#c4973a' }}>{sayi}</span>
              <span style={{ fontSize: 16, color: '#9a8a6a' }}>{etiket}</span>
            </div>
          ))}
        </div>

        {/* Domain */}
        <div style={{
          position: 'absolute', bottom: 36,
          fontSize: 18, color: '#6b5230', letterSpacing: '0.1em',
        }}>
          mizac.xyz/hizli-test
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
