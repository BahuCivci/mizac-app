import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Çocuğunuzun Mizacı · Varlığın Tahlili',
  description: 'Çocuğunuzun mizacını tanıyın: Safravî, Demevî, Balgamî ve Sevdavî çocukların bebeklik, çocukluk ve okul dönemleri. Ebeveynlere rehber bilgiler.',
  keywords: ['çocuk mizacı', 'bebeğimin mizacı', 'çocuk karakteri', 'mizaç ebeveyn', 'safravi çocuk', 'demevi çocuk', 'balgami çocuk', 'sevdavi çocuk'],
  openGraph: {
    title: 'Çocuğunuzun Mizacı',
    description: 'Her çocuk belirli bir mizaçla doğar. Mizacını tanıyan ebeveyn, çocuğunu hem daha iyi anlar hem de gelişimine doğru yönde destek olur.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
