import type { Metadata } from 'next';
import Link from 'next/link';
import { mizacProfiller, MizacTip } from '@/lib/mizac-data';
import { notFound } from 'next/navigation';
import MizacDetayClient from './client';

export function generateStaticParams() {
  return Object.keys(mizacProfiller).map((id) => ({ id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const profil = mizacProfiller[id as MizacTip];
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

export default async function MizacDetayPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const profil = mizacProfiller[id as MizacTip];
  if (!profil) notFound();
  return <MizacDetayClient profil={profil} />;
}
