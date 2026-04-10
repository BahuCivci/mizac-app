import { ImageResponse } from 'next/og';
import { getBlogYazisi } from '@/lib/blog-data';
import { mizacProfiller, MizacTip } from '@/lib/mizac-data';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: { slug: string } }) {
  const yazi = getBlogYazisi(params.slug);
  const profil = yazi?.ilgiliMizac ? mizacProfiller[yazi.ilgiliMizac as MizacTip] : null;

  const bg = profil
    ? `linear-gradient(135deg, #0f0a04 0%, #1a1207 60%, #0f0a04 100%)`
    : `linear-gradient(135deg, #0f0a04 0%, #1a1207 100%)`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: bg,
          padding: '60px 72px',
          position: 'relative',
        }}
      >
        {/* Glow circle */}
        {profil && (
          <div
            style={{
              position: 'absolute',
              top: -100,
              right: -100,
              width: 500,
              height: 500,
              borderRadius: '50%',
              background: profil.renk,
              opacity: 0.07,
            }}
          />
        )}

        {/* Top: blog tag + symbol */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: '#c4973a18',
              border: '1.5px solid #c4973a40',
              padding: '8px 20px',
              borderRadius: 100,
            }}
          >
            <span style={{ fontSize: 18, color: '#c4973a' }}>✦</span>
            <span style={{ fontSize: 16, color: '#c4973a', letterSpacing: '0.2em', fontWeight: 700 }}>
              MİZAÇ BLOG
            </span>
          </div>
          {profil && (
            <span style={{ fontSize: 32, marginLeft: 8 }}>{profil.elementSembol}</span>
          )}
        </div>

        {/* Middle: title */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            flex: 1,
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              fontSize: yazi && yazi.baslik.length > 60 ? 44 : 52,
              fontWeight: 900,
              color: '#e8d5b0',
              lineHeight: 1.25,
              maxWidth: 900,
            }}
          >
            {yazi?.baslik ?? 'Mizaç Blog'}
          </div>
          {yazi && (
            <div style={{ fontSize: 22, color: '#9a8a6a', maxWidth: 800, lineHeight: 1.5 }}>
              {yazi.ozet.length > 120 ? yazi.ozet.slice(0, 120) + '...' : yazi.ozet}
            </div>
          )}
        </div>

        {/* Bottom: tags + domain */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 8 }}>
            {yazi?.etiketler.slice(0, 3).map((e) => (
              <div
                key={e}
                style={{
                  background: profil ? profil.renk + '30' : '#c4973a30',
                  color: profil ? profil.renk : '#c4973a',
                  padding: '6px 14px',
                  borderRadius: 100,
                  fontSize: 16,
                  fontWeight: 600,
                }}
              >
                {e}
              </div>
            ))}
          </div>
          <div style={{ fontSize: 20, color: '#6b5230', letterSpacing: '0.1em' }}>
            mizac.xyz/blog
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
