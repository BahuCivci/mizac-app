/**
 * Ortama göre açılıp kapanan özellikler.
 *
 * Danışman, modele erişebildiği ortamda çalışır. Model şu an üniversite
 * sunucusunda, iç ağda özel bir adreste — Vercel oraya ulaşamaz.
 * Bayrak olmadan footer'daki, ana sayfadaki ve sitemap'teki linkler üretimde
 * çalışmayan bir sayfaya götürür; kullanıcı tıklar ve hata alır.
 *
 * Açmak için: `NEXT_PUBLIC_MIZAC_DANISMAN=acik`
 * Bunu yalnızca modele gerçekten ulaşılabilen bir ortamda ver — ya BT tünel
 * izni verdiğinde ya da `MIZAC_SAGLAYICI=claude` ile Claude API'ye geçildiğinde.
 *
 * `NEXT_PUBLIC_` öneki zorunlu: footer ve ana sayfa istemci bileşeni, bayrağı
 * tarayıcıda okuyabilmeleri gerekiyor.
 */
export const DANISMAN_ACIK = process.env.NEXT_PUBLIC_MIZAC_DANISMAN === 'acik';

/**
 * Danışmanın 3B yüzü — GLB dosyasının adresi.
 *
 * Verilmezse sayfa soyut varlığa (halkalar) düşer. Yüzü isteğe bağlı tutmanın
 * sebebi, model dosyasının 5-10 MB olması: gelmezse ya da yavaş gelirse
 * danışman yine de kullanılabilir kalmalı.
 *
 * Dosya kendi Blob depomuzdan sunulmalı. Üçüncü parti bir CDN'e bağlamak, o
 * servis kapandığında ya da adresi değiştirdiğinde yüzün kaybolması demek.
 *
 * Açmak için: `NEXT_PUBLIC_MIZAC_YUZ=https://.../danisman.glb`
 */
export const DANISMAN_YUZ = process.env.NEXT_PUBLIC_MIZAC_YUZ ?? '';
