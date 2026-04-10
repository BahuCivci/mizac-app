import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Organ & Duygu Haritası · İslam Tıbbında Beden-Ruh Bağlantısı',
  description: 'Kalp, karaciğer, dalak, akciğer ve her organın hangi duyguyu taşıdığı. İbn-i Sina\'ya göre organ-duygu haritası ve mizaçla ilişkisi.',
  keywords: ['organ duygu haritası', 'kalp duygu islam', 'karaciğer öfke', 'dalak hüzün', 'ibn-i sina organ', 'beden ruh bağlantısı'],
  alternates: { canonical: 'https://mizac.xyz/organ-duygu' },
  openGraph: {
    title: 'Organ & Duygu Haritası',
    description: 'İslam tıbbında her organ hangi duyguyu taşır? Beden-ruh haritası.',
    url: 'https://mizac.xyz/organ-duygu',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
