import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dört Halifenin Mizacı · Hz. Ebubekir, Ömer, Osman, Ali',
  description: 'Hz. Ebubekir (Demevî), Hz. Ömer (Safravî), Hz. Osman (Balgamî) ve Hz. Ali (Sevdavî) — dört halifenin mizaç analizi. İbn-i Sina geleneğiyle İslam tarihi.',
  keywords: ['dört halife mizaç', 'hz ömer mizacı', 'hz ali mizacı', 'sahabe mizaç', 'ebubekir demevi', 'ali sevdavi'],
  alternates: { canonical: 'https://mizac.xyz/dort-halife' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
