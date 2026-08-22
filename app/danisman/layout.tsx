import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mizaç Danışmanı · Konuşarak Mizacını Bul',
  description:
    'Soru listesi doldurmadan, sohbet ederek mizacını bul. Safravî, demevî, balgamî ve sevdavî mizaçları konuşmandan okuyan yapay zekâ danışman.',
  alternates: { canonical: 'https://mizac.xyz/danisman' },
  keywords: [
    'mizaç danışmanı',
    'yapay zeka mizaç',
    'konuşarak mizaç bulma',
    'mizaç sohbeti',
    'tıbb-ı nebevi danışman',
    'safravi demevi balgami sevdavi',
  ],
  openGraph: {
    title: 'Mizaç Danışmanı · Konuşarak Mizacını Bul',
    description: 'Soru listesi yok — anlat, mizacını sohbetten okusun.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
