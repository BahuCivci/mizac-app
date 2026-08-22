import { ImageResponse } from 'next/og';
import { OgStar } from '@/lib/og-star';

export const alt = 'Mizaç Danışmanı | mizac.xyz';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#1a1207',
          fontFamily: 'serif',
        }}
      >
        <div style={{ display: 'flex', marginBottom: 28 }}>
          <OgStar size={44} color="#c4973a" />
        </div>

        <div
          style={{
            fontSize: 68,
            fontWeight: 900,
            color: '#f5f0e8',
            display: 'flex',
            marginBottom: 14,
          }}
        >
          Mizaç Danışmanı
        </div>
        <div style={{ fontSize: 30, color: '#c4973a', display: 'flex', marginBottom: 40 }}>
          Soru listesi yok — konuşarak mizacını bul
        </div>

        {/* Sohbet balonları: sayfanın kendisi ne yapıyorsa görsel de onu anlatsın. */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, width: 720 }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div
              style={{
                display: 'flex',
                background: '#3d2c0e',
                color: '#f5f0e8',
                fontSize: 24,
                padding: '14px 24px',
                borderRadius: 22,
              }}
            >
              Temmuz benim için kâbus, klimasız duramıyorum
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div
              style={{
                display: 'flex',
                background: '#241a0b',
                color: '#e8dcc4',
                fontSize: 24,
                padding: '14px 24px',
                borderRadius: 22,
              }}
            >
              Peki sporda kolay terler misin?
            </div>
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: 32,
            fontSize: 20,
            color: '#9a8060',
            display: 'flex',
          }}
        >
          mizac.xyz
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
