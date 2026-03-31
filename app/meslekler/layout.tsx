import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mizaç ve Kariyer · Hangi Meslek Hangi Mizaca Uygun?',
  description: 'Safravî, Demevî, Balgamî ve Sevdavî mizaçlarına göre kariyer rehberi. Hangi meslekler hangi mizaca uygun? İbn-i Sina geleneğine dayalı kariyer analizi.',
  keywords: ['mizaç meslek', 'safravi kariyer', 'demevi meslek', 'balgami iş', 'sevdavi kariyer', 'mizaca göre meslek'],
  alternates: { canonical: 'https://mizac.xyz/meslekler' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
