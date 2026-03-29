import { ImageResponse } from 'next/og';
import { mizacProfiller, MizacTip } from '@/lib/mizac-data';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export function generateStaticParams() {
  return Object.keys(mizacProfiller).map((id) => ({ id }));
}

export default async function OGImage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const profil = mizacProfiller[id as MizacTip];
  if (!profil) return new Response('Not found', { status: 404 });

  return new ImageResponse(
    (
      <div style={{
        width: '100%', height: '100%',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: `linear-gradient(135deg, ${profil.renkAcik} 0%, #ffffff 100%)`,
        fontFamily: 'serif', position: 'relative',
      }}>
        <div style={{ fontSize: 100, display: 'flex' }}>{profil.elementSembol}</div>

        <div style={{ fontSize: 88, fontWeight: 900, color: profil.renk, display: 'flex', marginBottom: 8 }}>
          {profil.isim}
        </div>

        <div style={{ fontSize: 36, color: '#666', display: 'flex', marginBottom: 32 }}>
          {profil.isimEn} · {profil.element}
        </div>

        <div style={{
          fontSize: 24, color: '#444', maxWidth: 800,
          textAlign: 'center', lineHeight: 1.5, opacity: 0.8,
          display: 'flex',
        }}>
          {profil.kisaAciklama}
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 36 }}>
          {profil.anahtarKelimeler.slice(0, 4).map((k) => (
            <div key={k} style={{
              padding: '8px 20px', borderRadius: 999,
              background: profil.renk, color: 'white',
              fontSize: 18, fontWeight: 700, display: 'flex',
            }}>
              {k}
            </div>
          ))}
        </div>

        <div style={{
          position: 'absolute', bottom: 32,
          fontSize: 18, color: '#999', display: 'flex',
        }}>
          mizac-app.vercel.app
        </div>
      </div>
    ),
    { ...size }
  );
}
