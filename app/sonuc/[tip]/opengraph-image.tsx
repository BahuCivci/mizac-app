import { ImageResponse } from 'next/og';
import { OgStar } from '@/lib/og-star';
import { mizacProfiller, MizacTip } from '@/lib/mizac-data';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export function generateStaticParams() {
  return Object.keys(mizacProfiller).map((tip) => ({ tip }));
}

export default async function Image({ params }: { params: Promise<{ tip: string }> }) {
  const { tip } = await params;
  const profil = mizacProfiller[tip as MizacTip];
  if (!profil) return new Response('Not found', { status: 404 });

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
          background: `linear-gradient(135deg, ${profil.renkAcik} 0%, #fff9f0 60%, ${profil.renkAcik} 100%)`,
          fontFamily: 'serif',
          position: 'relative',
        }}
      >
        {/* Dekoratif çember */}
        <div
          style={{
            position: 'absolute',
            top: -80,
            right: -80,
            width: 360,
            height: 360,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${profil.renk}25 0%, transparent 70%)`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -60,
            left: -60,
            width: 280,
            height: 280,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${profil.renk}18 0%, transparent 70%)`,
          }}
        />

        {/* Üst etiket */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 20,
            background: profil.renk + '18',
            padding: '8px 24px',
            borderRadius: 100,
            border: `2px solid ${profil.renk}40`,
          }}
        >
          <OgStar size={18} color={profil.renk} />
          <span style={{ fontSize: 18, color: profil.renk, fontWeight: 700, marginLeft: 10 }}>Mizaç Testi Sonucu</span>
        </div>

        {/* Emoji */}
        <div style={{ fontSize: 110, display: 'flex', marginBottom: 12 }}>
          {profil.elementSembol}
        </div>

        {/* İsim */}
        <div style={{ fontSize: 96, fontWeight: 900, color: profil.renk, display: 'flex', marginBottom: 8 }}>
          {profil.isim}
        </div>

        {/* İngilizce + element */}
        <div style={{ fontSize: 32, color: '#666', display: 'flex', marginBottom: 24 }}>
          {profil.isimEn} · {profil.element}
        </div>

        {/* Kısa açıklama */}
        <div
          style={{
            fontSize: 22,
            color: '#555',
            maxWidth: 760,
            textAlign: 'center',
            lineHeight: 1.5,
            display: 'flex',
            marginBottom: 32,
            opacity: 0.85,
          }}
        >
          {profil.kisaAciklama}
        </div>

        {/* CTA */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            background: profil.renk,
            color: 'white',
            padding: '14px 36px',
            borderRadius: 100,
            fontSize: 22,
            fontWeight: 700,
          }}
        >
          Peki senin mizacın ne? → mizac.xyz
        </div>
      </div>
    ),
    { ...size }
  );
}
