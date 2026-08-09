/**
 * ✦ (U+2726) glifi next/og içindeki satori tarafından çözülemiyor: dinamik font
 * indirme isteği 400 dönüyor ve görselde tofu kutusu (☒) render ediliyor.
 * Görsel üreten tüm dosyalarda (opengraph-image, icon, apple-icon) metin glifi
 * yerine bu inline SVG kullanılır — hiçbir fonta ihtiyaç duymaz.
 *
 * Sayfalarda (normal DOM) ✦ karakteri sorunsuz, orada değiştirmeye gerek yok.
 */
export function OgStar({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12 0 L14.4 9.6 L24 12 L14.4 14.4 L12 24 L9.6 14.4 L0 12 L9.6 9.6 Z" />
    </svg>
  );
}
