import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MizacTip } from '@/lib/mizac-data';
import { getAllMizacIds, getMizacProfile } from '@/lib/cms';
import MizacDetayClient from './client';

export async function generateStaticParams() {
  const ids = await getAllMizacIds();
  return ids.map((id) => ({ id }));
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const { id } = params;
  const profil = await getMizacProfile(id as MizacTip);
  if (!profil) return {};
  return {
    title: `${profil.isim} Mizacı`,
    description: profil.kisaAciklama,
    openGraph: {
      title: `${profil.isim} ${profil.elementSembol} · Mizaç`,
      description: profil.kisaAciklama,
    },
    alternates: { canonical: `/mizaclar/${id}` },
  };
}

export default async function MizacDetayPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const profil = await getMizacProfile(id as MizacTip);
  if (!profil) notFound();
  return <MizacDetayClient profil={profil} tip={id as MizacTip} />;
}
