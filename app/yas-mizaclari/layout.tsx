import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Yaş Mizaçları · Hayatın 4 Dönemi',
  description: 'Bebeklikten yaşlılığa her dönem farklı bir mizaçla yaşanır. Bebeklik→Balgamî, Çocukluk→Demevî, Gençlik→Safravî, Yaşlılık→Sevdavî. İbn-i Sina geleneğine dayalı.',
  alternates: { canonical: 'https://mizac.xyz/yas-mizaclari' },
  keywords: ['yaş mizaçları', 'bebeklik balgami', 'gençlik safravi', 'yaşlılık sevdavi', 'mizaç dönemleri', 'hayat evreleri mizaç'],
  openGraph: {
    title: 'Yaş Mizaçları · Hayatın 4 Dönemi',
    description: 'İnsan hayatının her dönemi farklı bir mizaçla yaşanır. Kendinizi, çocuklarınızı ve yaşlıları daha iyi anlayın.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
