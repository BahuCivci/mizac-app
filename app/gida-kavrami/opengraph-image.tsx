import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Gıda Kavramı | mizac.xyz';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div style={{
        width: '100%', height: '100%',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg, #2a1a07 0%, #3d2410 50%, #1a1207 100%)',
        fontFamily: 'serif',
      }}>
        <div style={{ fontSize: 80, display: 'flex', marginBottom: 16 }}>🌾</div>
        <div style={{ fontSize: 72, fontWeight: 900, color: '#f5f0e8', display: 'flex', marginBottom: 12 }}>
          Gıda Kavramı
        </div>
        <div style={{ fontSize: 28, color: '#c4973a', display: 'flex', marginBottom: 40, opacity: 0.85 }}>
          İbn-i Sina'nın beslenme ilkeleri
        </div>
        <div style={{ display: 'flex', gap: 20 }}>
          {[
            { label: 'Sıcak', color: '#e8832a', bg: 'rgba(232,131,42,0.12)' },
            { label: 'Soğuk', color: '#4a9eda', bg: 'rgba(74,158,218,0.12)' },
            { label: 'Islak', color: '#5abf8a', bg: 'rgba(90,191,138,0.12)' },
            { label: 'Kuru',  color: '#c4973a', bg: 'rgba(196,151,58,0.12)' },
          ].map((q) => (
            <div key={q.label} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '12px 28px', borderRadius: 14,
              border: `1px solid ${q.color}`, color: q.color,
              fontSize: 26, fontWeight: 700, background: q.bg,
            }}>
              {q.label}
            </div>
          ))}
        </div>
        <div style={{
          position: 'absolute', bottom: 32,
          fontSize: 18, color: '#9a8060', opacity: 0.7, display: 'flex',
        }}>
          mizac.xyz · Tıbb-ı Nebevî
        </div>
      </div>
    ),
    { ...size }
  );
}
