import { NextRequest, NextResponse } from 'next/server';
import { MizacTip, mizacProfiller } from '@/lib/mizac-data';

export const runtime = 'nodejs';

const siteUrl = 'https://mizac.xyz';

// Basit in-memory rate limiter: IP başına 5 istek / 60 saniye
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (entry.count >= 5) return false;
  entry.count++;
  return true;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: 'Çok fazla istek. Lütfen bir dakika bekleyin.' }, { status: 429 });
  }

  try {
    const { tip } = await req.json() as { tip: MizacTip };

    if (!tip || !mizacProfiller[tip]) {
      return NextResponse.json({ error: 'Geçersiz mizaç tipi' }, { status: 400 });
    }

    const variantId = process.env.LEMONSQUEEZY_VARIANT_ID!;
    const apiKey = process.env.LEMONSQUEEZY_API_KEY!;
    const storeId = process.env.LEMONSQUEEZY_STORE_ID!;

    const profil = mizacProfiller[tip];

    const body = {
      data: {
        type: 'checkouts',
        attributes: {
          custom_price: 9900, // ₺99 in kuruş
          product_options: {
            name: `Derin Mizaç Raporu — ${profil.isim}`,
            description: `${profil.isim} mizacınıza özel 20+ sayfalık kapsamlı PDF analiz raporu`,
            redirect_url: `${siteUrl}/odeme-basarili`,
            receipt_link_url: `${siteUrl}/odeme-basarili`,
          },
          checkout_options: {
            embed: false,
            media: false,
            desc: true,
          },
          checkout_data: {
            custom: {
              tip,
            },
          },
          expires_at: null,
          preview: false,
        },
        relationships: {
          store: {
            data: { type: 'stores', id: storeId },
          },
          variant: {
            data: { type: 'variants', id: variantId },
          },
        },
      },
    };

    const res = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('LemonSqueezy checkout error:', err);
      return NextResponse.json({ error: 'Ödeme başlatılamadı' }, { status: 500 });
    }

    const data = await res.json();
    const checkoutUrl = data?.data?.attributes?.url;

    if (!checkoutUrl) {
      return NextResponse.json({ error: 'Ödeme linki alınamadı' }, { status: 500 });
    }

    return NextResponse.json({ url: checkoutUrl });
  } catch (err) {
    console.error('LemonSqueezy checkout error:', err);
    return NextResponse.json({ error: 'Ödeme başlatılamadı' }, { status: 500 });
  }
}
