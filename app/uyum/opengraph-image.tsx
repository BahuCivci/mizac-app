import { ImageResponse } from 'next/og';
import { OgStar } from '@/lib/og-star';

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
        <div style={{ fontSize: 64, display: 'flex', marginBottom: 20 }}>💞</div>
        <div style={{ fontSize: 72, fontWeight: 900, color: '#2c1810', display: 'flex', marginBottom: 12 }}>
          Mizaç Uyumu
        </div>
        <div style={{ fontSize: 32, color: '#8b6914', display: 'flex', marginBottom: 48, opacity: 0.8 }}>
          Hangi mizaçlar birbirleriyle uyumlu?
        </div>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          {[
            { e: '🔥', n: 'Safravî', c: '#c0392b' },
            { e: '💨', n: 'Demevî', c: '#2980b9' },
            { e: '💧', n: 'Balgamî', c: '#27ae60' },
            { e: '🌍', n: 'Sevdavî', c: '#8e44ad' },
          ].map((m, i, arr) => (
            <div key={m.n} style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{ fontSize: 48, display: 'flex' }}>{m.e}</div>
                <div style={{ fontSize: 18, color: m.c, fontWeight: 700, display: 'flex' }}>{m.n}</div>
              </div>
              {i < arr.length - 1 && (
                <div style={{ display: 'flex', opacity: 0.5 }}><OgStar size={28} color="#c4973a" /></div>
              )}
            </div>
          ))}
        </div>
        <div style={{
          position: 'absolute', bottom: 32,
          fontSize: 18, color: '#8b6914', opacity: 0.6, display: 'flex',
        }}>
          mizac.xyz · 16 Uyum Kombinasyonu
        </div>
      </div>
    ),
    { ...size }
  );
}
