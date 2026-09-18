import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'İletişim · Mizaç',
  description: 'Mizaç.xyz ile iletişim: rapor desteği, gizlilik ve veri talepleri, geri bildirim.',
  alternates: { canonical: 'https://mizac.xyz/iletisim' },
  openGraph: {
    title: 'İletişim · Mizaç',
    description: 'Rapor desteği, gizlilik talepleri ve geri bildirim için bize yazın.',
    url: 'https://mizac.xyz/iletisim',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
