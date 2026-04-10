import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { MizacTip, mizacProfiller } from '@/lib/mizac-data';

export const runtime = 'nodejs';

const siteUrl = 'https://mizac.xyz';

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  try {
    const { tip } = await req.json() as { tip: MizacTip };

    if (!tip || !mizacProfiller[tip]) {
      return NextResponse.json({ error: 'Geçersiz mizaç tipi' }, { status: 400 });
    }

    const profil = mizacProfiller[tip];

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      currency: 'try',
      line_items: [
        {
          price_data: {
            currency: 'try',
            unit_amount: 9900, // ₺99 = 9900 kuruş
            product_data: {
              name: `Derin Mizaç Raporu — ${profil.isim}`,
              description: `${profil.isim} mizacınıza özel 20+ sayfalık kapsamlı PDF analiz raporu`,
              images: [`${siteUrl}/opengraph-image`],
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        tip,
        isim: profil.isim,
      },
      success_url: `${siteUrl}/odeme-basarili?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/sonuc?tip=${tip}`,
      locale: 'tr',
      payment_method_types: ['card'],
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('Stripe checkout error:', err);
    return NextResponse.json({ error: 'Ödeme başlatılamadı' }, { status: 500 });
  }
}
