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
        fontFamily: 'serif', position: 'relative',
      }}>
        <div style={{ display: 'flex', marginBottom: 24 }}><OgStar size={80} color="#c4973a" /></div>
        <div style={{ fontSize: 56, fontWeight: 900, color: '#2c1810', display: 'flex', marginBottom: 16 }}>
          Mizacını Keşfet
        </div>
        <div style={{ fontSize: 28, color: '#8b6914', display: 'flex', opacity: 0.8 }}>
          Sonucunu arkadaşlarınla paylaş!
        </div>
        <div style={{
          position: 'absolute', bottom: 32,
          fontSize: 18, color: '#999', display: 'flex',
        }}>
          mizac.xyz
        </div>
      </div>
    ),
    { ...size }
  );
}
