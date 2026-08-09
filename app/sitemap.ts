import { MetadataRoute } from 'next';
import { mizacProfiller } from '@/lib/mizac-data';
import { blogYazilari } from '@/lib/blog-data';
import { kombinasyonlar } from '@/lib/uyum-data';

const siteUrl = 'https://mizac.xyz';

export default function sitemap(): MetadataRoute.Sitemap {
  const mizacPages = Object.keys(mizacProfiller).map((id) => ({
    url: `${siteUrl}/mizaclar/${id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  const blogPages = blogYazilari.map((y) => ({
    url: `${siteUrl}/blog/${y.slug}`,
    lastModified: new Date(y.tarih),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // 6 uyum karşılaştırma sayfası — statik üretiliyor ve indekslenebilir
  const karsilastirPages = kombinasyonlar.map((k) => ({
    url: `${siteUrl}/karsilastir/${k.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const sonucPages = Object.keys(mizacProfiller).map((tip) => ({
    url: `${siteUrl}/sonuc/${tip}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [
    { url: siteUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${siteUrl}/test`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${siteUrl}/hizli-test`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${siteUrl}/mizaclar`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${siteUrl}/cocuk-mizaci`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${siteUrl}/yas-mizaclari`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/nur-mizaci`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/uyum`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${siteUrl}/tarifler`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${siteUrl}/sss`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    // Alt sayfalar yukarıdaki karsilastirPages'ten üretiliyor
    { url: `${siteUrl}/karsilastir`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${siteUrl}/dort-halife`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/meslekler`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/varligin-mizaci`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/hastaliklar`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/esma-sifa`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/nefes`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/gida-kavrami`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/hiltlar`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${siteUrl}/bitkiler`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${siteUrl}/peygamber-mizaci`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${siteUrl}/namaz-mizac`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/ruya-mizac`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/organ-duygu`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/mevsim-mizac`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${siteUrl}/muzik-mizac`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/koku-mizac`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/hakkinda`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.4 },
    { url: `${siteUrl}/gizlilik`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.2 },
    ...mizacPages,
    ...blogPages,
    ...karsilastirPages,
    ...sonucPages,
  ];
}
