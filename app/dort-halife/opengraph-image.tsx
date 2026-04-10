import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = "Dört Halife'nin Mizacı | mizac.xyz";
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
        <div style={{ fontSize: 72, display: 'flex', marginBottom: 16 }}>🕌</div>
        <div style={{ fontSize: 72, fontWeight: 900, color: '#c4973a', display: 'flex', marginBottom: 12 }}>
          Dört Halife
        </div>
        <div style={{ fontSize: 26, color: '#f5f0e8', display: 'flex', marginBottom: 16, opacity: 0.85 }}>
          Hz. Ebu Bekir · Hz. Ömer · Hz. Osman · Hz. Ali
        </div>
        <div style={{
          fontSize: 22, color: '#9a8060', display: 'flex', marginBottom: 40, opacity: 0.8,
          padding: '10px 28px', borderRadius: 12,
          background: 'rgba(196, 151, 58, 0.08)',
          border: '1px solid rgba(196, 151, 58, 0.2)',
        }}>
          Mizaç perspektifinden İslam tarihi
        </div>
        <div style={{ display: 'flex', gap: 28 }}>
          {[
            { name: 'Ebu Bekir', c: '#4a9eda' },
            { name: 'Ömer', c: '#e8832a' },
            { name: 'Osman', c: '#e05a7a' },
            { name: 'Ali', c: '#c4973a' },
          ].map((h) => (
            <div key={h.name} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '12px 22px', borderRadius: 14,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(196, 151, 58, 0.2)',
            }}>
              <div style={{ fontSize: 18, color: h.c, fontWeight: 700, display: 'flex' }}>Hz. {h.name}</div>
            </div>
          ))}
        </div>
        <div style={{
          position: 'absolute', bottom: 32,
          fontSize: 18, color: '#6b5230', display: 'flex',
        }}>
          mizac.xyz · İslam Tarihi
        </div>
      </div>
    ),
    { ...size }
  );
}
