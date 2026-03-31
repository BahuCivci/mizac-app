import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Varlığın Mizacı · Renkler, Kumaşlar, Metaller, Mekânlar',
  description: 'Her şeyin bir mizacı var. Renkler, kumaşlar, metaller, mevsimler, mekânlar ve günün vakitleri — İbn-i Sina geleneğiyle varlığın mizaç haritası.',
  keywords: ['renklerin mizacı', 'kumaş mizacı', 'metallerin mizacı', 'mekân mizacı', 'mizaç renk', 'varlığın mizacı'],
  alternates: { canonical: 'https://mizac.xyz/varligin-mizaci' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
