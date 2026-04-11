import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Mizaç · Mizacını Keşfet',
    short_name: 'Mizaç',
    description: 'İbn-i Sina geleneğine dayalı 50 soruluk mizaç testi. Safravî, Demevî, Balgamî veya Sevdavî misin?',
    start_url: '/',
    display: 'standalone',
    background_color: '#faf7f2',
    theme_color: '#c4973a',
    orientation: 'portrait',
    categories: ['education', 'lifestyle', 'health'],
    lang: 'tr',
    icons: [
      {
        src: '/icon',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
    shortcuts: [
      {
        name: 'Testi Başlat',
        short_name: 'Test',
        description: '50 soruluk mizaç testini başlat',
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
