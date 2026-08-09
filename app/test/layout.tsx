import type { Metadata } from 'next';
import { SORU_SAYISI } from '@/lib/mizac-data';

export const metadata: Metadata = {
  title: `Mizaç Testi · ${SORU_SAYISI} Soruluk Ücretsiz Test`,
  description: `İbn-i Sina geleneğine dayalı ${SORU_SAYISI} soruluk mizaç testi. Safravî, Demevî, Balgamî ve Sevdavî mizaç tiplerinden hangisi olduğunuzu öğrenin. Ücretsiz.`,
  keywords: ['mizaç testi', 'mizac testi', '4 mizaç testi', 'ibn-i sina testi', 'temperament test', 'kişilik testi ücretsiz'],
  alternates: { canonical: 'https://mizac.xyz/test' },
};

const quizSchema = {
  '@context': 'https://schema.org',
  '@type': 'Quiz',
  name: 'Mizaç Testi',
  description: `İbn-i Sina'nın dört mizaç teorisine dayalı ${SORU_SAYISI} soruluk mizaç belirleme testi.`,
  url: 'https://mizac.xyz/test',
  educationalLevel: 'beginner',
  inLanguage: ['tr', 'en'],
  about: {
    '@type': 'Thing',
    name: 'Mizaç',
    description: 'İbn-i Sina geleneğine dayalı dört temel mizaç tipi: Safravî, Demevî, Balgamî, Sevdavî',
  },
  provider: {
    '@type': 'Organization',
    name: 'Mizaç',
    url: 'https://mizac.xyz',
  },
};

export default function TestLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(quizSchema) }}
      />
      {children}
    </>
  );
}
