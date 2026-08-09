import { ImageResponse } from 'next/og';

export const alt = 'Mevsim & Mizaç | mizac.xyz';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div style={{
        width: '100%', height: '100%',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: '#1a1207',
        fontFamily: 'serif',
      }}>
        <div style={{ fontSize: 68, fontWeight: 900, color: '#c4973a', display: 'flex', marginBottom: 12 }}>
          Mevsim &amp; Mizaç
        </div>
        <div style={{ fontSize: 26, color: '#9a8060', display: 'flex', marginBottom: 48 }}>
          Her mevsim bir hılt, her hılt bir denge
        </div>
        <div style={{ display: 'flex', gap: 20 }}>
          {[
            { mevsim: 'İlkbahar', hilt: 'Kan',    bg: '#1e3a1e', border: '#4a8c3f', color: '#7ec876' },
            { mevsim: 'Yaz',      hilt: 'Safra',  bg: '#3a2010', border: '#c4650a', color: '#f09040' },
            { mevsim: 'Sonbahar', hilt: 'Sevda',  bg: '#3a1010', border: '#c43a3a', color: '#e07070' },
            { mevsim: 'Kış',      hilt: 'Balgam', bg: '#10203a', border: '#2a6ab4', color: '#5aa0e0' },
          ].map((s) => (
            <div key={s.mevsim} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
              padding: '24px 32px', borderRadius: 16,
              background: s.bg,
              border: `2px solid ${s.border}`,
            }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: s.color, display: 'flex' }}>{s.mevsim}</div>
              <div style={{ fontSize: 16, color: '#f5f0e8', opacity: 0.7, display: 'flex' }}>{s.hilt}</div>
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
