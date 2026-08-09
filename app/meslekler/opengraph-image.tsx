import { ImageResponse } from 'next/og';

export const alt = 'Kariyer Rehberi | mizac.xyz';
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
        <div style={{ fontSize: 72, display: 'flex', marginBottom: 16 }}>💼</div>
        <div style={{ fontSize: 72, fontWeight: 900, color: '#c4973a', display: 'flex', marginBottom: 12 }}>
          Kariyer Rehberi
        </div>
        <div style={{ fontSize: 30, color: '#f5f0e8', display: 'flex', marginBottom: 40, opacity: 0.8 }}>
          Mizacına göre ideal meslek
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          {[
            { e: '🔥', label: 'Liderlik', c: '#e8832a' },
            { e: '💫', label: 'İletişim', c: '#e05a7a' },
            { e: '📊', label: 'Analiz', c: '#4a9eda' },
            { e: '🎨', label: 'Sanat', c: '#9a8060' },
          ].map((d) => (
            <div key={d.label} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
              padding: '16px 24px', borderRadius: 16,
              background: 'rgba(196, 151, 58, 0.1)',
              border: '1px solid rgba(196, 151, 58, 0.25)',
            }}>
              <div style={{ fontSize: 40, display: 'flex' }}>{d.e}</div>
              <div style={{ fontSize: 18, color: d.c, fontWeight: 700, display: 'flex' }}>{d.label}</div>
            </div>
          ))}
        </div>
        <div style={{
          position: 'absolute', bottom: 32,
          fontSize: 18, color: '#6b5230', display: 'flex',
        }}>
          mizac.xyz · Kariyer &amp; Mizaç
        </div>
      </div>
    ),
    { ...size }
  );
}
