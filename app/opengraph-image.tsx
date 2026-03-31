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
        fontFamily: 'serif', position: 'relative',
      }}>
        <div style={{ fontSize: 72, display: 'flex', marginBottom: 16 }}>✦</div>

        <div style={{ display: 'flex', marginBottom: 12 }}>
          <span style={{ fontSize: 80, fontWeight: 900, color: '#c9a84c' }}>Mizacını</span>
          <span style={{ fontSize: 80, fontWeight: 900, color: '#2c1810', marginLeft: 16 }}>Keşfet</span>
        </div>

        <div style={{ fontSize: 32, color: '#8b6914', display: 'flex', marginBottom: 48, opacity: 0.8 }}>
          Discover Your Temperament
        </div>

        <div style={{ display: 'flex', gap: 40 }}>
          {[
            { emoji: '🔥', isim: 'Safravî', renk: '#c0392b' },
            { emoji: '💨', isim: 'Demevî', renk: '#2980b9' },
            { emoji: '💧', isim: 'Balgamî', renk: '#27ae60' },
            { emoji: '🌿', isim: 'Sevdavî', renk: '#8e44ad' },
          ].map((m) => (
            <div key={m.isim} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <div style={{ fontSize: 52, display: 'flex' }}>{m.emoji}</div>
              <div style={{ fontSize: 18, color: m.renk, fontWeight: 700, display: 'flex' }}>{m.isim}</div>
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
