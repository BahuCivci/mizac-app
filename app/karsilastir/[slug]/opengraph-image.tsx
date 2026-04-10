import { ImageResponse } from 'next/og';
import { mizacProfiller, MizacTip } from '@/lib/mizac-data';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const kombinasyonlar = [
  { slug: 'safravi-vs-demevi', a: 'safravi' as MizacTip, b: 'demevi' as MizacTip, puan: 68 },
  { slug: 'safravi-vs-balgami', a: 'safravi' as MizacTip, b: 'balgami' as MizacTip, puan: 92 },
  { slug: 'safravi-vs-sevdavi', a: 'safravi' as MizacTip, b: 'sevdavi' as MizacTip, puan: 38 },
  { slug: 'demevi-vs-balgami', a: 'demevi' as MizacTip, b: 'balgami' as MizacTip, puan: 48 },
  { slug: 'demevi-vs-sevdavi', a: 'demevi' as MizacTip, b: 'sevdavi' as MizacTip, puan: 90 },
  { slug: 'balgami-vs-sevdavi', a: 'balgami' as MizacTip, b: 'sevdavi' as MizacTip, puan: 76 },
];

export async function generateImageMetadata() {
  return kombinasyonlar.map((k) => ({
    id: k.slug,
    alt: `${k.a} vs ${k.b} uyum`,
    size,
    contentType,
  }));
}

export default function OGImage({ id }: { id: string }) {
  const kombo = kombinasyonlar.find((k) => k.slug === id) ?? kombinasyonlar[0];
  const a = mizacProfiller[kombo.a];
  const b = mizacProfiller[kombo.b];
  const puan = kombo.puan;

  const barColor = puan >= 85 ? '#16a34a' : puan >= 65 ? '#2563eb' : puan >= 50 ? '#d97706' : '#dc2626';

  return new ImageResponse(
    (
      <div style={{
        width: '100%', height: '100%',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg, #fdf6e3 0%, #f5e6c8 100%)',
        fontFamily: 'serif',
      }}>
        {/* Pair */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 40, marginBottom: 32 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <div style={{ fontSize: 72, display: 'flex' }}>{a.elementSembol}</div>
            <div style={{ fontSize: 28, color: a.renk, fontWeight: 800, display: 'flex' }}>{a.isim}</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{ fontSize: 40, color: '#c4973a', fontWeight: 900, display: 'flex' }}>VS</div>
            <div style={{
              fontSize: 52, fontWeight: 900, display: 'flex',
              color: barColor,
            }}>
              %{puan}
            </div>
            <div style={{ fontSize: 18, color: '#8b6914', display: 'flex', opacity: 0.7 }}>Uyum</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <div style={{ fontSize: 72, display: 'flex' }}>{b.elementSembol}</div>
            <div style={{ fontSize: 28, color: b.renk, fontWeight: 800, display: 'flex' }}>{b.isim}</div>
          </div>
        </div>

        {/* Uyum bar */}
        <div style={{ width: 500, height: 16, background: '#e5e7eb', borderRadius: 8, display: 'flex', overflow: 'hidden' }}>
          <div style={{ width: `${puan}%`, background: barColor, height: '100%', display: 'flex' }} />
        </div>

        <div style={{
          position: 'absolute', bottom: 32,
          fontSize: 18, color: '#8b6914', opacity: 0.6, display: 'flex',
        }}>
          mizac.xyz · Mizaç Uyum Haritası
        </div>
      </div>
    ),
    { ...size }
  );
}
