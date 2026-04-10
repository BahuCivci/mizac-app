import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Koku & Mizaç · Aromaterapi ve Hılt Dengesi',
  description: 'İbn-i Sina geleneğinde koku terapisi: her mizaç için hangi esans, buhur ve bitki kokusu denge sağlar? Safravî, Demevî, Balgamî ve Sevdavî için koku reçeteleri.',
  keywords: ['koku mizaç', 'aromaterapi mizaç', 'buhur mizaç', 'koku terapisi islam', 'ibn-i sina koku', 'esans mizaç'],
  alternates: { canonical: 'https://mizac.xyz/koku-mizac' },
  openGraph: {
    title: 'Koku & Mizaç · Aromaterapi ve Hılt Dengesi',
    description: 'Her mizaç için şifa veren koku reçetesi. İbn-i Sina geleneğinde aromaterapi.',
    url: 'https://mizac.xyz/koku-mizac',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
