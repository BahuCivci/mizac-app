import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Yaş Mizaçları | mizac.xyz';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div style={{
        width: '100%', height: '100%',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f0a04 0%, #1a1207 50%, #1e1509 100%)',
        fontFamily: 'serif',
      }}>
        <div style={{ fontSize: 72, display: 'flex', marginBottom: 16 }}>⏳</div>
        <div style={{ fontSize: 72, fontWeight: 900, color: '#c4973a', display: 'flex', marginBottom: 12 }}>
          Yaş Mizaçları
        </div>
        <div style={{ fontSize: 30, color: '#f5f0e8', display: 'flex', marginBottom: 40, opacity: 0.8 }}>
          Hayatın her evresinde mizaç
        </div>
        <div style={{ display: 'flex', gap: 20, alignItems: 'stretch' }}>
          {[
            { e: '🌸', stage: 'Çocukluk', mizac: 'Demevî', c: '#e05a7a' },
            { e: '🔥', stage: 'Gençlik', mizac: 'Safravî', c: '#e8832a' },
            { e: '🌊', stage: 'Olgunluk', mizac: 'Balgamî', c: '#4a9eda' },
            { e: '🍂', stage: 'Yaşlılık', mizac: 'Sevdavî', c: '#9a8060' },
          ].map((s, i) => (
            <div key={s.stage} style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                padding: '14px 20px', borderRadius: 16,
                background: 'rgba(196, 151, 58, 0.09)',
                border: '1px solid rgba(196, 151, 58, 0.22)',
              }}>
                <div style={{ fontSize: 36, display: 'flex' }}>{s.e}</div>
                <div style={{ fontSize: 16, color: '#f5f0e8', fontWeight: 700, display: 'flex' }}>{s.stage}</div>
                <div style={{ fontSize: 14, color: s.c, display: 'flex' }}>{s.mizac}</div>
              </div>
              {i < 3 && (
                <div style={{ fontSize: 24, color: '#c4973a', display: 'flex', opacity: 0.4 }}>→</div>
              )}
            </div>
          ))}
        </div>
        <div style={{
          position: 'absolute', bottom: 32,
          fontSize: 18, color: '#6b5230', display: 'flex',
        }}>
          mizac.xyz · Yaşam Dönemleri
        </div>
      </div>
    ),
    { ...size }
  );
}
