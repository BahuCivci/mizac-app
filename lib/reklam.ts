/**
 * Reklam ayarları.
 *
 * NEDEN BAYRAK ARKASINDA
 * AdSense yayıncı kimliği olmadan `<ins>` etiketi basmak boş bir kutu ve
 * konsolda hata demek. Kimlik verilene kadar hiçbir şey çizilmiyor, betik de
 * yüklenmiyor — onay gelmeden site yavaşlamasın.
 *
 * Açmak için (AdSense onayı geldikten sonra):
 *   NEXT_PUBLIC_ADSENSE_ID=ca-pub-XXXXXXXXXXXXXXXX
 *   NEXT_PUBLIC_ADSENSE_SLOT_MAKALE=1234567890
 *
 * NEREYE KONMAZ — bilinçli karar
 * Test, sonuç, danışman ve ödeme sayfalarında reklam YOK. Oralar ₺99'luk
 * raporun satış yolu; reklam aynı dikkat için yarışıyor ve bin sayfa
 * görüntülemenin getirdiği para tek bir satışın çok altında. Reklamı yalnız
 * gezinilen sayfalara (blog, bilgi sayfaları) koymak, satışı yemeden
 * artan trafiği paraya çeviriyor.
 */
export const ADSENSE_ID = process.env.NEXT_PUBLIC_ADSENSE_ID ?? '';
export const ADSENSE_SLOT_MAKALE = process.env.NEXT_PUBLIC_ADSENSE_SLOT_MAKALE ?? '';
export const REKLAM_ACIK = ADSENSE_ID.startsWith('ca-pub-');
