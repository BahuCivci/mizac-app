import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nur Mizacı · İtidal ve Kemale Erişmek',
  description: 'Nur mizacı; dört temel mizacın ötesinde, dengeli ve kemale ermiş haldir. Hz. Peygamber örneğinde 8 yol ile Nur mizacına ulaşmak mümkündür.',
  keywords: ['nur mizacı', 'itidal mizaç', 'mizaç terbiyesi', 'dört mizaç ötesi', 'kemal mizaç', 'hz peygamber mizaç'],
  openGraph: {
    title: 'Nur Mizacı · İtidal ve Kemale Erişmek',
    description: '4 mizacın ötesinde, dengeli ve kemale ermiş hal. Nur mizacına ulaşmanın 8 yolu.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
