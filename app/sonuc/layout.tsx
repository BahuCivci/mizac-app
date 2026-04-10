import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mizaç Test Sonucu · Safravî, Demevî, Balgamî, Sevdavî',
  description: 'İbn-i Sina geleneğine dayalı mizaç testi sonucunuz. Detaylı profil, sağlık tavsiyeleri ve uyum haritanız.',
  alternates: { canonical: 'https://mizac.xyz/sonuc' },
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
