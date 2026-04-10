import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Varlığın Mizacı | mizac.xyz';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div style={{
        width: '100%', height: '100%',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg, #07071a 0%, #0d0d2d 50%, #1a1207 100%)',
        fontFamily: 'serif',
      }}>
        <div style={{ fontSize: 72, fontWeight: 900, color: '#f5f0e8', display: 'flex', marginBottom: 12 }}>
          Varlığın Mizacı
        </div>
        <div style={{ fontSize: 28, color: '#c4973a', display: 'flex', marginBottom: 40, opacity: 0.85 }}>
          Evrenin dört unsuru: Ateş · Hava · Su · Toprak
        </div>
        <div style={{ display: 'flex', gap: 20 }}>
          {[
            { emoji: '🔥', label: 'Ateş',  color: '#e8832a', bg: 'rgba(232,131,42,0.10)' },
            { emoji: '🌬',  label: 'Hava',  color: '#4a9eda', bg: 'rgba(74,158,218,0.10)' },
            { emoji: '💧', label: 'Su',    color: '#5abf8a', bg: 'rgba(90,191,138,0.10)' },
            { emoji: '🌍', label: 'Toprak', color: '#c4973a', bg: 'rgba(196,151,58,0.10)' },
          ].map((el) => (
            <div key={el.label} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
              padding: '16px 28px', borderRadius: 16,
              border: `1px solid ${el.color}`, background: el.bg,
            }}>
              <div style={{ fontSize: 40, display: 'flex' }}>{el.emoji}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: el.color, display: 'flex' }}>{el.label}</div>
            </div>
          ))}
        </div>
        <div style={{
          position: 'absolute', bottom: 32,
          fontSize: 18, color: '#9a8060', opacity: 0.7, display: 'flex',
        }}>
          mizac.xyz · Kozmik Mizaç Felsefesi
        </div>
      </div>
    ),
    { ...size }
  );
}
