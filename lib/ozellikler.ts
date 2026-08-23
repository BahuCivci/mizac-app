/**
 * Ortama göre açılıp kapanan özellikler.
 *
 * Danışman, modele erişebildiği ortamda çalışır. Model şu an üniversite
 * sunucusunda ve özel bir adreste (192.168.1.40) — Vercel oraya ulaşamaz.
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
