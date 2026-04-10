import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { Resend } from 'resend';
import jwt from 'jsonwebtoken';
import { MizacTip, MizacProfil, mizacProfiller } from '@/lib/mizac-data';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const resend = new Resend(process.env.RESEND_API_KEY);
const siteUrl = 'https://mizac.xyz';

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const sig = req.headers.get('stripe-signature');

  if (!sig) {
    return NextResponse.json({ error: 'Signature eksik' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error('Webhook signature hatası:', err);
    return NextResponse.json({ error: 'Geçersiz imza' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const tip = session.metadata?.tip as MizacTip;
    const email = session.customer_details?.email;

    if (!tip || !email || !mizacProfiller[tip]) {
      console.error('Eksik metadata:', { tip, email });
      return NextResponse.json({ received: true });
    }

    const profil = mizacProfiller[tip];

    // JWT token — 7 gün geçerli
    const token = jwt.sign(
      { tip, email, sessionId: session.id },
      process.env.PDF_JWT_SECRET!,
      { expiresIn: '7d' }
    );

    const downloadUrl = `${siteUrl}/api/rapor/indir?token=${token}`;

    try {
      await resend.emails.send({
        from: 'Mizaç <noreply@mizac.xyz>',
        to: email,
        subject: `✦ Derin Mizaç Raporunuz Hazır — ${profil.isim} Mizacı`,
        html: emailSablonu({ profil, downloadUrl, token }),
      });
    } catch (emailErr) {
      console.error('Email gönderilemedi:', emailErr);
      // Webhook başarılı sayılır, email hatası kritik değil
    }
  }

  return NextResponse.json({ received: true });
}

function emailSablonu({
  profil,
  downloadUrl,
}: {
  profil: MizacProfil;
  downloadUrl: string;
  token: string;
}) {
  return `
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Derin Mizaç Raporunuz Hazır</title>
</head>
<body style="margin:0;padding:0;background:#f5f0e8;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0e8;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#1a1207;border-radius:16px;overflow:hidden;max-width:600px;">

          <!-- Kapak -->
          <tr>
            <td style="background:linear-gradient(180deg,#1a1207,#0f0a04);padding:48px 40px 32px;text-align:center;border-bottom:1px solid #3d2c0e;">
              <p style="color:#c4973a;font-size:12px;letter-spacing:0.3em;text-transform:uppercase;margin:0 0 12px;">mizac.xyz</p>
              <h1 style="color:#f5f0e8;font-size:32px;margin:0 0 8px;">✦ Derin Mizaç Raporu</h1>
              <p style="color:${profil.renk};font-size:20px;font-weight:bold;margin:0 0 4px;">${profil.isim} Mizacı</p>
              <p style="color:#9a8060;font-size:14px;margin:0;">${profil.kisaAciklama}</p>
            </td>
          </tr>

          <!-- Mesaj -->
          <tr>
            <td style="padding:32px 40px;">
              <p style="color:#e8d5b0;font-size:16px;line-height:1.7;margin:0 0 16px;">
                Merhaba,
              </p>
              <p style="color:#9a8060;font-size:15px;line-height:1.7;margin:0 0 24px;">
                <strong style="color:#e8d5b0;">${profil.isim}</strong> mizacınıza özel
                <strong style="color:#c4973a;">20+ sayfalık Derin Mizaç Raporu</strong> hazır.
                Aşağıdaki butona tıklayarak raporunuzu indirebilirsiniz.
              </p>

              <!-- İçerik listesi -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f0a04;border-radius:12px;padding:20px;margin-bottom:28px;">
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="color:#c4973a;font-size:11px;letter-spacing:0.25em;text-transform:uppercase;margin:0 0 12px;">Rapor İçeriği</p>
                    <p style="color:#9a8060;font-size:13px;line-height:2;margin:0;">
                      ✦ Organ–duygu haritanız<br>
                      ✦ Haftalık sağlık protokolü<br>
                      ✦ İlişki ve kariyer uyum analizi<br>
                      ✦ Esmaü'l-Hüsna zikirleriniz<br>
                      ✦ Beslenme ve detoks takvimi<br>
                      ✦ Mevsimsel yaşam rehberi
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Download butonu -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding-bottom:24px;">
                    <a href="${downloadUrl}"
                       style="display:inline-block;background:linear-gradient(135deg,#7c4a1e,#c4973a);color:white;text-decoration:none;padding:16px 40px;border-radius:50px;font-size:16px;font-weight:bold;letter-spacing:0.05em;">
                      ✦ Raporu İndir (PDF)
                    </a>
                  </td>
                </tr>
              </table>

              <p style="color:#6b5230;font-size:12px;text-align:center;margin:0 0 8px;">
                Bu link <strong style="color:#9a8060;">7 gün</strong> geçerlidir.
              </p>
              <p style="color:#6b5230;font-size:12px;text-align:center;margin:0;">
                Sorun yaşarsanız bu e-postayı yanıtlayın.
              </p>
            </td>
          </tr>

          <!-- Alt bilgi -->
          <tr>
            <td style="padding:20px 40px 32px;border-top:1px solid #3d2c0e;text-align:center;">
              <p style="color:#6b5230;font-size:11px;margin:0;">
                © 2026 mizac.xyz · İbn-i Sina geleneğine dayalı
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
