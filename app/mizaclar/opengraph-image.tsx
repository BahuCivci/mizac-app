import { ImageResponse } from 'next/og';
import { OgStar } from '@/lib/og-star';

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
        <div style={{ display: 'flex', marginBottom: 16 }}><OgStar size={56} color="#c4973a" /></div>
        <div style={{ fontSize: 72, fontWeight: 900, color: '#2c1810', display: 'flex', marginBottom: 12 }}>
          4 Mizaç Tipi
        </div>
        <div style={{ fontSize: 30, color: '#8b6914', display: 'flex', marginBottom: 48, opacity: 0.8 }}>
          İbn-i Sina · Safravî · Demevî · Balgamî · Sevdavî
        </div>
        <div style={{ display: 'flex', gap: 32 }}>
          {[
            { emoji: '🔥', isim: 'Safravî', el: 'Ateş', renk: '#c0392b', bg: '#fef6ed' },
            { emoji: '💨', isim: 'Demevî', el: 'Hava', renk: '#2980b9', bg: '#fdf0f3' },
            { emoji: '💧', isim: 'Balgamî', el: 'Su', renk: '#27ae60', bg: '#eef6fc' },
            { emoji: '🌍', isim: 'Sevdavî', el: 'Toprak', renk: '#8e44ad', bg: '#f3f0f8' },
          ].map((m) => (
            <div key={m.isim} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
              padding: '20px 24px', borderRadius: 20, background: m.bg,
            }}>
              <div style={{ fontSize: 52, display: 'flex' }}>{m.emoji}</div>
              <div style={{ fontSize: 22, color: m.renk, fontWeight: 800, display: 'flex' }}>{m.isim}</div>
              <div style={{ fontSize: 16, color: '#8b6914', opacity: 0.7, display: 'flex' }}>{m.el}</div>
            </div>
          ))}
        </div>
        <div style={{
          position: 'absolute', bottom: 32,
          fontSize: 18, color: '#8b6914', opacity: 0.6, display: 'flex',
        }}>
          mizac.xyz · Mizaç Profilleri
        </div>
      </div>
    ),
    { ...size }
  );
}
