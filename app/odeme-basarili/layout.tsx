import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ödeme Başarılı · Mizaç',
  description: 'Derin Mizaç Raporunuz hazırlanıyor. Email adresinize gönderildi.',
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
