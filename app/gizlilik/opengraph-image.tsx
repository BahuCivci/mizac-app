import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Gizlilik Politikası | mizac.xyz';
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
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20,
          padding: '48px 80px', borderRadius: 20,
          border: '1px solid #3d2c0e',
          background: 'rgba(255,255,255,0.03)',
        }}>
          <div style={{ fontSize: 52, fontWeight: 900, color: '#c4973a', display: 'flex', letterSpacing: 2 }}>
            ✦ Mizaç
          </div>
          <div style={{ width: 120, height: 1, background: '#3d2c0e', display: 'flex' }} />
          <div style={{ fontSize: 40, fontWeight: 700, color: '#f5f0e8', display: 'flex' }}>
            Gizlilik Politikası
          </div>
          <div style={{ fontSize: 20, color: '#9a8060', display: 'flex', textAlign: 'center' }}>
            mizac.xyz · Kullanıcı verileriniz güvende
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
