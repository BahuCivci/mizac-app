import { MetadataRoute } from 'next';
import { SORU_SAYISI } from '@/lib/mizac-data';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Mizaç · Mizacını Keşfet',
    short_name: 'Mizaç',
    description: `İbn-i Sina geleneğine dayalı ${SORU_SAYISI} soruluk mizaç testi. Safravî, Demevî, Balgamî veya Sevdavî misin?`,
    start_url: '/',
    display: 'standalone',
    background_color: '#faf7f2',
    theme_color: '#c4973a',
    orientation: 'portrait',
    categories: ['education', 'lifestyle', 'health'],
    lang: 'tr',
    icons: [
      // Boyutlar gerçek çıktıyla eşleşmeli: app/icon.tsx 512x512,
      // app/apple-icon.tsx 180x180 üretir.
      {
        src: '/apple-icon',
        sizes: '180x180',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      // Aynı görsel maskable olarak da uygun: tam taşan gradient zemin,
      // sembol ortada ve güvenli alanın içinde.
      {
        src: '/icon',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    shortcuts: [
      {
        name: 'Testi Başlat',
        short_name: 'Test',
        description: `${SORU_SAYISI} soruluk mizaç testini başlat`,
        url: '/test',
      },
      {
        name: '4 Mizaç Tipi',
        short_name: 'Mizaçlar',
        url: '/mizaclar',
      },
    ],
  };
}
