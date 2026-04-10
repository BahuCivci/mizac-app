import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Şifalı Bitkiler ve Mizaç · Her Mizaç İçin Bitki Rehberi',
  description: 'Safravî, Demevî, Balgamî ve Sevdavî mizaçlar için şifalı bitkiler ve baharatlar. İbn-i Sina geleneğiyle hangi bitkiler hangi mizaca şifa verir?',
  keywords: ['mizaç bitkiler', 'safravi bitkiler', 'balgami bitkiler', 'şifalı bitkiler mizaç', 'ibn-i sina bitkisel tedavi', 'mizaca göre bitki'],
  alternates: { canonical: 'https://mizac.xyz/bitkiler' },
  openGraph: {
    title: 'Şifalı Bitkiler ve Mizaç',
    description: 'Her mizaç tipi için önerilen ve kaçınılacak şifalı bitkiler.',
    url: 'https://mizac.xyz/bitkiler',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
