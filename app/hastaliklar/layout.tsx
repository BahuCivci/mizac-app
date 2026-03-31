import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mizaca Göre Hastalıklar · Safravi, Demevi, Balgami, Sovdavi',
  description: 'Her mizacın yatkın olduğu hastalıklar ve ağrı tipleri. İbn-i Sina geleneğiyle safravi, demevi, balgami ve sovdavi mizaçlarında görülen rahatsızlıklar ve çakra ilişkileri.',
  keywords: ['mizaç hastalık', 'safravi hastalıkları', 'balgami hastalıkları', 'sovdavi hastalıkları', 'demevi hastalıkları', 'mizaç ve sağlık'],
  alternates: { canonical: 'https://mizac.xyz/hastaliklar' },
};

const schema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Mizaca Göre Hastalıklar',
  description: 'Her mizacın yatkın olduğu hastalıklar ve ağrı tipleri. İbn-i Sina geleneğiyle safravi, demevi, balgami ve sovdavi mizaçlarında görülen rahatsızlıklar.',
  url: 'https://mizac.xyz/hastaliklar',
  publisher: { '@type': 'Organization', name: 'Mizaç', url: 'https://mizac.xyz' },
  inLanguage: 'tr',
  about: { '@type': 'MedicalCondition', name: 'Mizaç ve Sağlık' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      {children}
    </>
  );
}
