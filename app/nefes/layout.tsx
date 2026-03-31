import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mizaca Göre Nefes Egzersizleri · Safravi, Demevi, Balgami, Sovdavi',
  description: 'Her mizacın dengeye kavuştuğu nefes teknikleri. Safravi için soğutucu, balgami için ısıtıcı, demevi ve sovdavi için dengeleyen nefes egzersizleri. İbn-i Sina geleneği.',
  keywords: ['mizaç nefes', 'nefes egzersizi', 'safravi nefes', 'balgami nefes', 'mizaç terapi', 'nefes şifa'],
  alternates: { canonical: 'https://mizac.xyz/nefes' },
};

const schema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'Mizacına Göre Nefes Egzersizleri',
  description: 'Her mizaç tipine özel nefes teknikleri. Safravi için soğutucu, balgami için ısıtıcı, demevi için dengeleyici, sovdavi için topraklayıcı.',
  url: 'https://mizac.xyz/nefes',
  publisher: { '@type': 'Organization', name: 'Mizaç', url: 'https://mizac.xyz' },
  inLanguage: 'tr',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      {children}
    </>
  );
}
