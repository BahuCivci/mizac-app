import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div style={{
        width: '100%', height: '100%',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg, #fdf6e3 0%, #f5e6c8 100%)',
        fontFamily: 'serif',
      }}>
        <div style={{ fontSize: 64, display: 'flex', marginBottom: 16 }}>🫀</div>
        <div style={{ fontSize: 72, fontWeight: 900, color: '#2c1810', display: 'flex', marginBottom: 12 }}>
          Dört Hılt
        </div>
        <div style={{ fontSize: 28, color: '#8b6914', display: 'flex', marginBottom: 48, opacity: 0.8 }}>
          İbn-i Sina&#39;nın Beden Sıvıları Teorisi
        </div>
        <div style={{ display: 'flex', gap: 32 }}>
          {[
            { e: '💧', n: 'Kan', sub: 'Sıcak · Nemli', c: '#e05a7a' },
            { e: '🔥', n: 'Safra', sub: 'Sıcak · Kuru', c: '#e8832a' },
            { e: '💦', n: 'Balgam', sub: 'Soğuk · Nemli', c: '#4a9eda' },
            { e: '🌑', n: 'Sevda', sub: 'Soğuk · Kuru', c: '#7b5ea7' },
          ].map((h) => (
            <div key={h.n} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <div style={{ fontSize: 48, display: 'flex' }}>{h.e}</div>
              <div style={{ fontSize: 22, color: h.c, fontWeight: 700, display: 'flex' }}>{h.n}</div>
              <div style={{ fontSize: 16, color: '#8b6914', opacity: 0.7, display: 'flex' }}>{h.sub}</div>
            </div>
          ))}
        </div>
        <div style={{
          position: 'absolute', bottom: 32,
          fontSize: 18, color: '#8b6914', opacity: 0.6, display: 'flex',
        }}>
          mizac.xyz · İbn-i Sina Geleneği
        </div>
      </div>
    ),
    { ...size }
  );
}
