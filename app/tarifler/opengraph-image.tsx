import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Şifalı Tarifler | mizac.xyz';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div style={{
        width: '100%', height: '100%',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(180deg, #1a1207 0%, #241508 60%, #1a1207 100%)',
        fontFamily: 'serif',
      }}>
        <div style={{ fontSize: 72, display: 'flex', marginBottom: 16 }}>🫙</div>
        <div style={{ fontSize: 72, fontWeight: 900, color: '#c4973a', display: 'flex', marginBottom: 12 }}>
          Şifalı Tarifler
        </div>
        <div style={{ fontSize: 28, color: '#f5f0e8', display: 'flex', marginBottom: 16, opacity: 0.8 }}>
          Mizaca göre beslenme ve bitkisel tarifler
        </div>
        <div style={{
          fontSize: 22, color: '#c4973a', display: 'flex', marginBottom: 40, opacity: 0.75,
          letterSpacing: 2,
        }}>
          Safravî · Demevî · Balgamî · Sevdavî
        </div>
        <div style={{ display: 'flex', gap: 20 }}>
          {[
            { e: '🌶️', label: 'Safravî', sub: 'Serinletici', c: '#e8832a' },
            { e: '🍓', label: 'Demevî', sub: 'Hafifletici', c: '#e05a7a' },
            { e: '🫚', label: 'Balgamî', sub: 'Isıtıcı', c: '#4a9eda' },
            { e: '🌰', label: 'Sevdavî', sub: 'Nemlendirici', c: '#9a8060' },
          ].map((t) => (
            <div key={t.label} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
              padding: '12px 18px', borderRadius: 14,
              background: 'rgba(196, 151, 58, 0.09)',
              border: '1px solid rgba(196, 151, 58, 0.22)',
            }}>
              <div style={{ fontSize: 34, display: 'flex' }}>{t.e}</div>
              <div style={{ fontSize: 16, color: t.c, fontWeight: 700, display: 'flex' }}>{t.label}</div>
              <div style={{ fontSize: 13, color: '#9a8060', display: 'flex' }}>{t.sub}</div>
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
