const CACHE_NAME = 'mizac-v1';

// Offline fallback sayfası ve temel statik varlıklar
const PRECACHE_URLS = [
  '/',
  '/test',
  '/mizaclar',
  '/offline',
];

// Install: temel URL'leri önceden önbellekle
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      // addAll all-or-nothing'dir: tek bir URL hata verirse install tamamen
      // başarısız olur ve SW hiç aktifleşmez. Tek tek ekle, hataları yut.
      Promise.all(
        PRECACHE_URLS.map((url) =>
          cache.add(url).catch(() => {
            /* bu URL önbelleğe alınamadı, kurulum yine de sürsün */
          })
        )
      )
    )
  );
  self.skipWaiting();
});

// Activate: eski cache'leri temizle
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch stratejisi:
// - API istekleri: network-only (cache yok)
// - Navigasyon: network-first, offline'da cache
// - Statik varlıklar: cache-first
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Sadece GET önbelleklenebilir; cache.put POST/PUT ile exception atar
  if (request.method !== 'GET') return;

  // Farklı origin'leri (analytics, fonts) geç
  if (url.origin !== self.location.origin) return;

  // API istekleri: direkt network'e gönder
  if (url.pathname.startsWith('/api/')) return;

  // Navigasyon (HTML sayfaları): network-first
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Sadece gerçekten başarılı yanıtı cache'e yaz — yoksa 404/500
          // sayfaları önbelleğe girer ve offline'da onlar servis edilir
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() =>
          // Network yoksa cache'den dön, o da yoksa offline sayfası
          caches.match(request).then((cached) => cached || caches.match('/offline'))
        )
    );
    return;
  }

  // Statik varlıklar (_next/static, görseller): cache-first
  if (
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/icons/') ||
    /\.(png|jpg|jpeg|svg|ico|webp|woff2?)$/.test(url.pathname)
  ) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((response) => {
            if (response.ok) {
              const clone = response.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
            }
            return response;
          })
      )
    );
  }
});
