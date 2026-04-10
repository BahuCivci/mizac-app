import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '4 Mizaç Tipi · Safravî, Demevî, Balgamî, Sevdavî',
  description: 'İbn-i Sina geleneğine göre dört temel mizaç tipi: Safravî (ateş), Demevî (hava), Balgamî (su) ve Sevdavî (toprak). Her mizacın özellikleri, sağlık ve ilişki rehberi.',
  keywords: ['dört mizaç', 'safravi nedir', 'demevi nedir', 'balgami nedir', 'sevdavi nedir', 'mizaç tipleri', 'humour theory'],
  alternates: { canonical: 'https://mizac.xyz/mizaclar' },
  openGraph: {
    title: '4 Mizaç Tipi · İbn-i Sina Geleneği',
    description: 'Safravî, Demevî, Balgamî ve Sevdavî — dört temel mizaç tipinin kapsamlı rehberi.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
