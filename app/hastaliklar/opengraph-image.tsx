import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Hastalıklar & Mizaç | mizac.xyz';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div style={{
        width: '100%', height: '100%',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg, #071a12 0%, #0d2d1e 50%, #1a1207 100%)',
        fontFamily: 'serif',
      }}>
        <div style={{ fontSize: 72, fontWeight: 900, color: '#f5f0e8', display: 'flex', marginBottom: 12 }}>
          Hastalıklar & Mizaç
        </div>
        <div style={{ fontSize: 28, color: '#5abf8a', display: 'flex', marginBottom: 40, opacity: 0.85 }}>
          Hılt dengesizliğinden kaynaklanan rahatsızlıklar
        </div>
        <div style={{ display: 'flex', gap: 20 }}>
          {[
            { label: 'Safra',  emoji: '🔴', color: '#e05a5a', bg: 'rgba(224,90,90,0.10)' },
            { label: 'Kan',    emoji: '🟡', color: '#e8b84b', bg: 'rgba(232,184,75,0.10)' },
            { label: 'Balgam', emoji: '🔵', color: '#4a9eda', bg: 'rgba(74,158,218,0.10)' },
            { label: 'Sevda',  emoji: '⚫', color: '#9a8060', bg: 'rgba(154,128,96,0.10)' },
          ].map((h) => (
            <div key={h.label} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
              padding: '14px 24px', borderRadius: 14,
              border: `1px solid ${h.color}`, background: h.bg,
            }}>
              <div style={{ fontSize: 36, display: 'flex' }}>{h.emoji}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: h.color, display: 'flex' }}>{h.label}</div>
            </div>
          ))}
        </div>
        <div style={{
          position: 'absolute', bottom: 32,
          fontSize: 18, color: '#9a8060', opacity: 0.7, display: 'flex',
        }}>
          mizac.xyz · Hılt Tıbbı
        </div>
      </div>
    ),
    { ...size }
  );
}
