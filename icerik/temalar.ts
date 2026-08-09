/**
 * İçerik sütunları, platform kadansı ve etiketler.
 *
 * Buradaki ayarları değiştirip `npm run icerik` demek yeterli — takvim ve
 * görseller yeniden üretilir. Post metinleri elle yazılmaz, uygulamanın
 * kendi verisinden türetilir (bkz. kaynak.ts).
 */

export type Platform = 'instagram' | 'tiktok' | 'youtube';

export type Bicim =
  | 'karusel'   // Instagram 5 kareli kaydırmalı
  | 'kare'      // Instagram tek görsel (alıntı kartı)
  | 'reels'     // Instagram dikey video
  | 'tiktok'    // TikTok dikey video
  | 'shorts'    // YouTube Shorts
  | 'uzun';     // YouTube uzun video

export type SutunId =
  | 'profil' | 'beslenme' | 'saglik' | 'uyum' | 'test'
  | 'manevi' | 'gunluk' | 'cocuk' | 'kariyer' | 'blog';

export const SUTUNLAR: Record<SutunId, { ad: string; aciklama: string }> = {
  profil:   { ad: 'Mizaç Tanıtımı', aciklama: 'Dört mizacın özü, güçlü ve zayıf yönleri' },
  beslenme: { ad: 'Beslenme',       aciklama: 'Mizaca göre yenmesi ve kaçınılması gerekenler' },
  saglik:   { ad: 'Sağlık',         aciklama: 'Mizacın hastalık eğilimleri ve ağrı tipi' },
  uyum:     { ad: 'İlişki Uyumu',   aciklama: 'Mizaç çiftlerinin uyum haritası' },
  test:     { ad: 'Test Sorusu',    aciklama: 'Etkileşim için "hangisi sensin?" soruları' },
  manevi:   { ad: 'Maneviyat',      aciklama: 'Esmaü\'l-Hüsna ve halife örnekleri' },
  gunluk:   { ad: 'Günlük Ritim',   aciklama: 'Mizacın vakti, mevsimi, renkleri' },
  cocuk:    { ad: 'Çocuk Mizacı',   aciklama: 'Ebeveynlere yönelik içerik' },
  kariyer:  { ad: 'Kariyer',        aciklama: 'Mizaca uygun meslekler' },
  blog:     { ad: 'Derinlemesine',  aciklama: 'Blog yazılarından uzun form içerik' },
};

/** Haftalık yayın planı. Gün: 0=Pazar … 6=Cumartesi */
export const KADANS: { gun: number; platform: Platform; bicim: Bicim; sutun?: SutunId }[] = [
  { gun: 1, platform: 'instagram', bicim: 'karusel' },              // Pazartesi
  { gun: 2, platform: 'tiktok',    bicim: 'tiktok', sutun: 'test' }, // Salı — etkileşim
  { gun: 3, platform: 'instagram', bicim: 'kare' },                  // Çarşamba
  { gun: 4, platform: 'youtube',   bicim: 'shorts' },                // Perşembe
  { gun: 5, platform: 'instagram', bicim: 'reels' },                 // Cuma
  { gun: 5, platform: 'tiktok',    bicim: 'tiktok' },                // Cuma
  { gun: 6, platform: 'instagram', bicim: 'karusel', sutun: 'uyum' },// Cumartesi
  { gun: 0, platform: 'tiktok',    bicim: 'tiktok' },                // Pazar
];

/** Ayda bir uzun YouTube videosu — ayın ilk Pazar'ı */
export const AYLIK_UZUN: { platform: Platform; bicim: Bicim } = { platform: 'youtube', bicim: 'uzun' };

export const ETIKETLER: Record<Platform, string[]> = {
  instagram: ['#mizaç', '#mizaçtesti', '#tıbbınebevi', '#ibnisina', '#safravi', '#demevi', '#balgami', '#sevdavi', '#kişilikanalizi', '#sağlıklıyaşam'],
  tiktok:    ['#mizaç', '#mizaçtesti', '#kişilik', '#burçdeğil', '#tıbbınebevi', '#keşfet'],
  youtube:   ['#mizaç', '#mizaçtesti', '#ibnisina', '#kişilikanalizi'],
};

export const CTA: Record<Platform, string> = {
  instagram: 'Kendi mizacını öğren → profildeki bağlantı (mizac.xyz)',
  tiktok:    'Testi biyografideki bağlantıdan yapabilirsin — mizac.xyz',
  youtube:   'Ücretsiz mizaç testi: mizac.xyz',
};

/** Görsel ölçüleri (piksel) */
export const OLCU: Record<Bicim, { g: number; y: number }> = {
  karusel: { g: 1080, y: 1350 },
  kare:    { g: 1080, y: 1350 },
  reels:   { g: 1080, y: 1920 },
  tiktok:  { g: 1080, y: 1920 },
  shorts:  { g: 1080, y: 1920 },
  uzun:    { g: 1280, y: 720 },
};

/** Video biçimleri — görsel yerine senaryo üretilir */
export const VIDEO_BICIMLERI: Bicim[] = ['reels', 'tiktok', 'shorts', 'uzun'];
