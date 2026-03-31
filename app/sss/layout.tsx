import type { Metadata } from 'next';

const schema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Mizaç testi nedir?',
      acceptedAnswer: { '@type': 'Answer', text: 'Mizaç testi, İbn-i Sina\'nın geliştirdiği dört mizaç teorisine (Safravî, Demevî, Balgamî, Sevdavî) dayalı olarak kişinin doğal karakter yapısını belirlemeye yarayan bir testtir.' },
    },
    {
      '@type': 'Question',
      name: 'Safravî mizaç ne demek?',
      acceptedAnswer: { '@type': 'Answer', text: 'Safravî mizaç, ateş elementi ile ilişkilendirilir. Sıcak ve kuru yapıda olan bu mizaç; liderlik, kararlılık, enerji ve adalet duygusuyla öne çıkar. Mide ve safra kesesi hassasiyetine yatkındır.' },
    },
    {
      '@type': 'Question',
      name: 'Balgamî ve Safravî uyumlu mu?',
      acceptedAnswer: { '@type': 'Answer', text: 'Evet, Balgamî ve Safravî %92 uyum oranıyla en güçlü zıt çekimli mizaç çiftidir. Safravî\'nin ateşini Balgamî\'nin suyu dengeler; biri liderlik ederken diğeri güvenilirlik sağlar.' },
    },
    {
      '@type': 'Question',
      name: 'Mizaç hayat boyunca değişir mi?',
      acceptedAnswer: { '@type': 'Answer', text: 'İbn-i Sina\'ya göre ana mizaç değişmez ama yaş, hastalık, çevre ve alışkanlıklar mizacı yüzeysel olarak etkileyebilir. Nur mizacına ulaşmak ise tüm mizaçların dengeye kavuşmasıdır.' },
    },
    {
      '@type': 'Question',
      name: 'Hangi mizaç en iyisidir?',
      acceptedAnswer: { '@type': 'Answer', text: 'Hiçbir mizaç diğerinden üstün değildir. Her mizacın güçlü ve zayıf yönleri vardır. Amaç kendi mizacını tanımak ve ona göre yaşamı düzenlemektir.' },
    },
  ],
};

export const metadata: Metadata = {
  title: 'Sık Sorulan Sorular · Mizaç Testi SSS',
  description: 'Mizaç testi hakkında sık sorulan sorular. Safravî ne demek, balgamî demevî uyumu nasıl, mizaç değişir mi, hangi mizaç en iyisi? İbn-i Sina geleneğiyle cevaplar.',
  keywords: ['mizaç testi sss', 'safravi ne demek', 'balgami demevi uyumu', 'mizaç soruları', 'dört mizaç soruları'],
  alternates: { canonical: 'https://mizac.xyz/sss' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      {children}
    </>
  );
}
