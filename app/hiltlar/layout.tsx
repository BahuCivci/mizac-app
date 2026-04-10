import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hıltlar · 4 Beden Sıvısı ve Mizaç Temeli',
  description: 'Kan, safra, balgam ve sevda hıltları nedir? İbn-i Sina\'nın dört hılt teorisi, her hıltın özellikleri, rengi, tadı, organı ve mizaçla ilişkisi.',
  keywords: ['hılt nedir', 'dört hılt', 'kan hıltı', 'safra hıltı', 'balgam hıltı', 'sevda hıltı', 'ibn-i sina hılt teorisi', 'humour theory'],
  alternates: { canonical: 'https://mizac.xyz/hiltlar' },
  openGraph: {
    title: 'Hıltlar · 4 Beden Sıvısı',
    description: 'İbn-i Sina\'nın mizaç biliminin temeli: kan, safra, balgam ve sevda hıltları.',
    url: 'https://mizac.xyz/hiltlar',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
