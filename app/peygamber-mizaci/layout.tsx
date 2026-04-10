import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hz. Peygamber\'in Mizacı · İslam Tıbbında Nebevî Denge',
  description: 'Hz. Muhammed\'in (s.a.v.) mizacı nasıldı? İslam âlimlerine ve İbn-i Sina geleneğine göre nebevî denge, sağlık alışkanlıkları ve ahlaki özellikler.',
  keywords: ['peygamber mizacı', 'hz muhammed mizacı', 'nebevi tıp', 'islam tıbbı mizaç', 'ibn-i sina peygamber', 'nebevi denge'],
  alternates: { canonical: 'https://mizac.xyz/peygamber-mizaci' },
  openGraph: {
    title: 'Hz. Peygamber\'in Mizacı',
    description: 'İslam âlimlerine göre Hz. Peygamber\'in mizacı ve nebevî denge anlayışı.',
    url: 'https://mizac.xyz/peygamber-mizaci',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
