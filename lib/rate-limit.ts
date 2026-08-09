/**
 * Basit bellek içi IP rate limit.
 *
 * Sınırı: Vercel'de her serverless instance kendi Map'ini tutar, yani gerçek
 * limit instance sayısıyla çarpılır. Kötüye kullanımı tamamen engellemez ama
 * tek bir kaynaktan gelen seri istekleri keser. Kalıcı çözüm gerekirse
 * Upstash/Redis tabanlı bir limiter'a geçilmeli.
 */
const kovalar = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(
  anahtar: string,
  { limit = 5, windowMs = 60_000 }: { limit?: number; windowMs?: number } = {}
): boolean {
  const now = Date.now();
  const entry = kovalar.get(anahtar);

  if (!entry || now > entry.resetAt) {
    kovalar.set(anahtar, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.count >= limit) return false;
  entry.count++;
  return true;
}

/** x-forwarded-for'dan istemci IP'sini çıkarır. */
export function istemciIp(req: { headers: { get(name: string): string | null } }): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
}

/** Basit ama includes('@')'ten anlamlı ölçüde sıkı e-posta kontrolü. */
export function gecerliEposta(deger: unknown): deger is string {
  if (typeof deger !== 'string') return false;
  if (deger.length > 254) return false;
  return /^[^\s@]+@[^\s@.]+\.[^\s@]{2,}$/.test(deger);
}
