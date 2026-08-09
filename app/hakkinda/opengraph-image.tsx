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
        <div style={{ display: 'flex', marginBottom: 16 }}><OgStar size={72} color="#c4973a" /></div>
        <div style={{ fontSize: 72, fontWeight: 900, color: '#2c1810', display: 'flex', marginBottom: 16 }}>
          mizac.xyz Hakkında
        </div>
        <div style={{ fontSize: 28, color: '#8b6914', display: 'flex', marginBottom: 12, opacity: 0.8, textAlign: 'center' }}>
          İbn-i Sina Geleneğine Dayalı Mizaç Rehberi
        </div>
        <div style={{ fontSize: 22, color: '#8b6914', display: 'flex', opacity: 0.6 }}>
          Varlığın Tahlili · Zeynep Işık Büyükbay
        </div>
        <div style={{
          position: 'absolute', bottom: 32,
          fontSize: 18, color: '#8b6914', opacity: 0.5, display: 'flex',
        }}>
          mizac.xyz · Safravî · Demevî · Balgamî · Sevdavî
        </div>
      </div>
    ),
    { ...size }
  );
}
