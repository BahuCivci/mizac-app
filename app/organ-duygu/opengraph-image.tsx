import { ImageResponse } from 'next/og';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div style={{
        width: '100%', height: '100%',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg, #fdf6e3 0%, #f0f4ff 50%, #fdf6e3 100%)',
        fontFamily: 'serif',
      }}>
        <div style={{ fontSize: 72, display: 'flex', marginBottom: 16 }}>🫀</div>
        <div style={{ fontSize: 68, fontWeight: 900, color: '#2c1810', display: 'flex', marginBottom: 12 }}>
          Organ & Duygu Haritası
        </div>
        <div style={{ fontSize: 28, color: '#8b6914', display: 'flex', marginBottom: 48, opacity: 0.8 }}>
          İslam Tıbbında Beden-Ruh Bağlantısı
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          {[
            { organ: 'Kalp', duygu: 'Sevgi', icon: '❤️', c: '#e05a7a' },
            { organ: 'Karaciğer', duygu: 'Öfke', icon: '🟤', c: '#8b5e1e' },
            { organ: 'Dalak', duygu: 'Hüzün', icon: '🟣', c: '#7b5ea7' },
            { organ: 'Akciğer', duygu: 'Keder', icon: '💙', c: '#4a9eda' },
            { organ: 'Beyin', duygu: 'Korku', icon: '🧠', c: '#6b8e5e' },
          ].map((o) => (
            <div key={o.organ} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
              padding: '12px 16px', borderRadius: 14, background: 'white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            }}>
              <div style={{ fontSize: 32, display: 'flex' }}>{o.icon}</div>
              <div style={{ fontSize: 16, color: o.c, fontWeight: 700, display: 'flex' }}>{o.organ}</div>
              <div style={{ fontSize: 13, color: '#6b7280', display: 'flex' }}>{o.duygu}</div>
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
