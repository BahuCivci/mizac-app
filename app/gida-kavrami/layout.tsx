import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Gıda Kavramı · Altı Çeşit Beslenme ve Müslih | Mizaç",
  description: "İbn-i Sina'ya göre gıda sadece ağızdan alınan değildir. Görsel, işitsel, kokusal, tensel, duygusal ve oral — altı çeşit gıda ve müslih kavramıyla tam beslenme rehberi.",
  keywords: ['gıda kavramı', 'altı çeşit gıda', 'müslih', 'duygusal gıda', 'görsel gıda', 'ibn sina beslenme', 'mizaç gıda'],
  alternates: { canonical: 'https://mizac.xyz/gida-kavrami' },
};

const schema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Gıda Kavramı: Altı Çeşit Beslenme',
  description: "İbn-i Sina'ya göre 6 çeşit gıda: görsel, işitsel, kokusal, tensel, duygusal ve ağız yoluyla alınan. Müslih kavramı ve mevsimsel beslenme.",
  url: 'https://mizac.xyz/gida-kavrami',
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
