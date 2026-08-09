import { ImageResponse } from 'next/og';
import { OgStar } from '@/lib/og-star';

export const alt = 'Esma & Şifa | mizac.xyz';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div style={{
        width: '100%', height: '100%',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg, #1a0a2e 0%, #2d1457 50%, #1a1207 100%)',
        fontFamily: 'serif',
      }}>
        {/* Burada Arapça "الأسماء الحسنى" vardı; satori bu script için font
            çözemeyip (lookupType 5 / substFormat 3) görseli tamamen boş
            döndürüyordu. Arapça geri istenirse satori'nin desteklediği bir
            font dosyası ImageResponse'un fonts seçeneğiyle verilmeli. */}
        <div style={{ display: 'flex', marginBottom: 20, opacity: 0.9 }}>
          <OgStar size={64} color="#c4973a" />
        </div>
        <div style={{ fontSize: 72, fontWeight: 900, color: '#f5f0e8', display: 'flex', marginBottom: 12 }}>
          Esma-i Hüsna & Şifa
        </div>
        <div style={{ fontSize: 28, color: '#c4973a', display: 'flex', marginBottom: 40, opacity: 0.85 }}>
          Allah'ın isimleri ve mizaç dengesi
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          {['Er-Râfî', 'El-Muîn', 'Eş-Şâfî', 'El-Latîf'].map((name) => (
            <div key={name} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '10px 20px', borderRadius: 12,
              border: '1px solid #c4973a', color: '#c4973a', fontSize: 22,
              background: 'rgba(196,151,58,0.08)',
            }}>
              {name}
            </div>
          ))}
        </div>
        <div style={{
          position: 'absolute', bottom: 32,
          fontSize: 18, color: '#9a8060', opacity: 0.7, display: 'flex',
        }}>
          mizac.xyz · Manevi Tıp
        </div>
      </div>
    ),
    { ...size }
  );
}
