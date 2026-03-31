import type { Metadata } from 'next';

const schema = {
  '@context': 'https://schema.org',
  '@type': 'Quiz',
  name: 'Hızlı Mizaç Testi — 10 Soru',
  description: '10 soruda mizacını öğren. Safravî, Demevî, Balgamî veya Sevdavî. İbn-i Sina geleneğine dayalı hızlı karakter testi.',
  url: 'https://mizac.xyz/hizli-test',
  educationalLevel: 'beginner',
  inLanguage: 'tr',
};

export const metadata: Metadata = {
  title: 'Hızlı Mizaç Testi · 10 Soruda Mizacını Öğren',
  description: '10 soruda mizacını öğren. Safravî, Demevî, Balgamî veya Sevdavî? İbn-i Sina\'nın 4 mizaç teorisine dayalı 2 dakikalık hızlı karakter testi.',
  keywords: ['hızlı mizaç testi', 'kısa mizaç testi', '10 soruluk test', 'mizaç neyim', 'karakter testi hızlı'],
  alternates: { canonical: 'https://mizac.xyz/hizli-test' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      {children}
    </>
  );
}
