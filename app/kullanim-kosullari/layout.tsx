/*
 * TASLAK — HUKUKÇU GÖZDEN GEÇİRMESİ GEREKİYOR
 *
 * Bu sayfadaki metin bir avukat tarafından yazılmadı. TikTok geliştirici
 * başvurusunun istediği "Terms of Service" adresini karşılamak ve LemonSqueezy
 * üzerinden alınan ödemeye bir sözleşme zemini vermek için hazırlanmış bir
 * taslaktır. Yayına almadan önce — özellikle cayma hakkı / iade (Mesafeli
 * Sözleşmeler Yönetmeliği atfı), sorumluluk sınırı, yaş sınırı ve yetkili
 * mahkeme maddeleri — bir hukukçuya okutulmalıdır.
 */
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kullanım Koşulları',
  description:
    'mizac.xyz kullanım koşulları. Mizaç testi, site içeriği, Mizaç Danışmanı ve ücretli rapor hizmetinin şartları; tıbbi tavsiye kapsamı, ödeme ve iade, sorumluluk sınırı.',
  keywords: ['kullanım koşulları', 'kullanım şartları', 'mizaç', 'mizac.xyz', 'hizmet şartları'],
  openGraph: {
    title: 'Kullanım Koşulları · Mizaç',
    description:
      'mizac.xyz hizmetlerinin kullanım koşulları: test, içerik, danışman sohbeti, ödeme ve iade, sorumluluk sınırı.',
    url: 'https://mizac.xyz/kullanim-kosullari',
  },
  alternates: { canonical: 'https://mizac.xyz/kullanim-kosullari' },
  robots: { index: true, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
