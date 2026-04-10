import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Rüya & Mizaç · Hılt Teorisinde Rüyaların Anlamı',
  description: 'Mizacınız rüyalarınızı şekillendirir. Safravî, Demevî, Balgamî ve Sevdavî mizaçların rüya örüntüleri, semboller ve İbn-i Sina\'ya göre rüya yorumu.',
  keywords: ['rüya mizaç', 'rüya hılt', 'rüya yorumu islam', 'safravi rüya', 'sevdavi rüya', 'ibn-i sina rüya'],
  alternates: { canonical: 'https://mizac.xyz/ruya-mizac' },
  openGraph: {
    title: 'Rüya & Mizaç',
    description: 'Mizacınız rüyalarınızı nasıl şekillendirir? Dört hıltın rüya örüntüleri.',
    url: 'https://mizac.xyz/ruya-mizac',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
