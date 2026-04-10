import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mevsimler & Mizaç · Her Mevsim Bir Hılt',
  description: 'İbn-i Sina\'ya göre her mevsim farklı bir hıltı aktifleştirir. İlkbahar kan, yaz safra, sonbahar sevda, kış balgam mevsimidir. Mizacınıza göre mevsimsel sağlık önerileri.',
  keywords: ['mevsim mizaç', 'mevsim hılt', 'ilkbahar demevi', 'yaz safravi', 'sonbahar sevdavi', 'kış balgami', 'ibn-i sina mevsim'],
  alternates: { canonical: 'https://mizac.xyz/mevsim-mizac' },
  openGraph: {
    title: 'Mevsimler & Mizaç · Her Mevsim Bir Hılt',
    description: 'İbn-i Sina\'ya göre mevsimler ve hılt döngüsü. Mizacınıza göre mevsimsel denge.',
    url: 'https://mizac.xyz/mevsim-mizac',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
