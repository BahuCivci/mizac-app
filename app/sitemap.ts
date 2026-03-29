import { MetadataRoute } from 'next';
import { mizacProfiller } from '@/lib/mizac-data';

const siteUrl = 'https://mizac-app.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const mizacPages = Object.keys(mizacProfiller).map((id) => ({
    url: `${siteUrl}/mizaclar/${id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [
    { url: siteUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${siteUrl}/test`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${siteUrl}/mizaclar`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    ...mizacPages,
  ];
}
