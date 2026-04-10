import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Namaz Vakitleri & Mizaç · Her Vakit Bir Hılt',
  description: 'Beş vakit namazın mizaç ve hılt teorisiyle ilişkisi. Sabah, öğle, ikindi, akşam, yatsı vakitlerinde hangi hılt aktiftir? İbn-i Sina geleneğinde namaz ve denge.',
  keywords: ['namaz vakitleri mizaç', 'namaz hılt', 'sabah namazı mizaç', 'namaz ritmi', 'islam tıbbı namaz', 'beş vakit hılt'],
  alternates: { canonical: 'https://mizac.xyz/namaz-mizac' },
  openGraph: {
    title: 'Namaz Vakitleri & Mizaç',
    description: 'Beş vakit namazın hılt teorisiyle ilişkisi ve mizaç dengesi.',
    url: 'https://mizac.xyz/namaz-mizac',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
