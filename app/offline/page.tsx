import { Metadata } from 'next';

// Service worker fallback sayfası — arama sonuçlarında çıkmamalı
export const metadata: Metadata = {
  title: 'Çevrimdışı | Mizaç',
  robots: { index: false, follow: false },
};

export default function OfflinePage() {
  return (
    <main className="flex flex-col items-center justify-center flex-1 text-center px-6 py-24">
      <div className="text-5xl mb-6">✦</div>
      <h1 className="text-2xl font-semibold mb-3">İnternet bağlantısı yok</h1>
      <p className="text-gray-500 max-w-sm">
        Bağlantınız kesildi. İnternete tekrar bağlandığınızda mizaç testini
        doldurabilirsiniz.
      </p>
      {/* Bilerek <a>: Link client-side gezinir ve service worker'ın önbelleğe
          aldığı offline sayfada kalır. Tam sayfa yüklemesi ağı yeniden dener. */}
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
      <a
        href="/"
        className="mt-8 px-6 py-3 bg-amber-600 text-white rounded-xl font-medium"
      >
        Tekrar dene
      </a>
    </main>
  );
}
