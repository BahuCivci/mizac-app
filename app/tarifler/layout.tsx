import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mizaca Özel Tarifler · Detoks ve Şifa Önerileri',
  description: 'Her mizaç tipine özel detoks tarifleri, şifalı çaylar ve sağlık önerileri. Safravî, Demevî, Balgamî ve Sevdavî mizaçlar için Varlığın Tahlili kitabından alınan tarifler.',
  alternates: { canonical: 'https://mizac.xyz/tarifler' },
  keywords: ['mizaç tarifleri', 'detoks tarifi', 'safravi detoks', 'demevi sağlık', 'balgami çay', 'sevdavi tarif', 'şifalı içecek', 'mizaç beslenme'],
  openGraph: {
    title: 'Mizaca Özel Tarifler · Detoks ve Şifa',
    description: 'Her mizaç için özel detoks, çay ve şifa tarifleri. Varlığın Tahlili kitabından.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
