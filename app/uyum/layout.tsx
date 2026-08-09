import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mizaç Uyumu · Hangi Mizaçlar Uyumlu?',
  description: 'Safravî, Demevî, Balgamî ve Sevdavî mizaçların birbirleriyle uyumu. İlişkide, arkadaşlıkta ve iş hayatında hangi mizaçlar iyi anlaşır?',
  alternates: { canonical: 'https://mizac.xyz/uyum' },
  keywords: ['mizaç uyumu', 'safravi demevi uyum', 'balgami sevdavi', 'mizaç ilişki', 'hangi mizaçlar uyumlu', 'dört mizaç uyum testi'],
  openGraph: {
    title: 'Mizaç Uyumu · Hangi Mizaçlar Uyumlu?',
    description: '4 mizaç tipinin birbirleriyle uyumu — ilişki, arkadaşlık ve iş hayatı için.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
