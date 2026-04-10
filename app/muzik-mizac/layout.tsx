import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Müzik & Mizaç · İbn-i Sina\'da Müzik Terapisi',
  description: 'İbn-i Sina\'ya göre müzik bir ilaçtır. Safravî, Demevî, Balgamî ve Sevdavî mizaçlar için hangi makam, hangi ritim şifa verir? Müzik ve hılt teorisi.',
  keywords: ['müzik mizaç', 'müzik terapi islam', 'ibn-i sina müzik', 'makam şifa', 'müzik hılt', 'mizaca göre müzik'],
  alternates: { canonical: 'https://mizac.xyz/muzik-mizac' },
  openGraph: {
    title: 'Müzik & Mizaç · İbn-i Sina\'da Müzik Terapisi',
    description: 'Müzik bir ilaçtır. Her mizaç için şifa veren makam ve ritim.',
    url: 'https://mizac.xyz/muzik-mizac',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
