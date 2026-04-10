import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hakkında · Mizaç Nedir, Nasıl Çalışır?',
  description: 'Mizaç.xyz hakkında: İbn-i Sina geleneğine dayalı mizaç testi nasıl çalışır, kimler için tasarlandı ve referanslar.',
  alternates: { canonical: 'https://mizac.xyz/hakkinda' },
  openGraph: {
    title: 'Hakkında · Mizaç',
    description: 'İbn-i Sina geleneğine dayalı mizaç testi ve referanslar.',
    url: 'https://mizac.xyz/hakkinda',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
