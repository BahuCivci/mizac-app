import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Esmaü'l-Hüsna ile Şifa · Mizaca Göre Allah'ın İsimleri",
  description: "Allah'ın 99 ismi ve organ haritası. Safravi, demevi, balgami ve sovdavi mizaçlarına göre şifa olan Esmaü'l-Hüsna. İbn-i Sina geleneğiyle ruhsal-bedensel iyileşme.",
  keywords: ['esmaül hüsna şifa', 'mizaç esma', '99 isim şifa', 'allah isimleri hastalık', 'organ esma', 'mizaç dua'],
  alternates: { canonical: 'https://mizac.xyz/esma-sifa' },
};

const schema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: "Esmaü'l-Hüsna ile Şifa",
  description: "Allah'ın 99 ismi ve organ haritası. Mizaca göre şifa olan esmalar ve nasıl okunacakları.",
  url: 'https://mizac.xyz/esma-sifa',
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
