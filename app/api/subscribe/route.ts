import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { mizacProfiller, MizacTip } from '@/lib/mizac-data';

const resend = new Resend(process.env.RESEND_API_KEY);
const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID || '';

export async function POST(req: NextRequest) {
  try {
    const { email, tip } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Geçersiz email' }, { status: 400 });
    }

    const profil = tip ? mizacProfiller[tip as MizacTip] : null;

    // Resend Audience'a ekle
    if (AUDIENCE_ID) {
      await resend.contacts.create({
        email,
        audienceId: AUDIENCE_ID,
        unsubscribed: false,
        ...(profil ? { firstName: profil.isim } : {}),
      });
    }

    // Hoş geldin emaili gönder
    const isimTR = profil ? profil.isim : 'Mizaç';
    const sembol = profil ? profil.elementSembol : '✦';
    const renk = profil ? profil.renk : '#c4973a';
    const aciklama = profil ? profil.kisaAciklama : 'Mizaç dünyasına hoş geldiniz.';
    const gucluYonler = profil ? profil.gucluYonler.slice(0, 4) : [];
    const beslenme = profil ? profil.beslenme.slice(0, 4) : [];

    await resend.emails.send({
      from: 'Mizaç <noreply@mizac.xyz>',
      to: email,
      subject: `${sembol} Mizaç Profiliniz: ${isimTR}`,
      html: `
<!DOCTYPE html>
<html lang="tr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#faf7f2;font-family:Georgia,serif;">
  <div style="max-width:600px;margin:0 auto;padding:32px 16px;">

    <!-- Header -->
    <div style="text-align:center;padding:40px 32px;background:linear-gradient(135deg,${renk}22,#fff9f0);border-radius:20px;margin-bottom:24px;">
      <div style="font-size:64px;margin-bottom:12px;">${sembol}</div>
      <div style="font-size:12px;letter-spacing:3px;opacity:0.5;margin-bottom:8px;">MİZAÇ PROFİLİNİZ</div>
      <h1 style="font-size:42px;font-weight:900;color:${renk};margin:0 0 8px;">${isimTR}</h1>
      <p style="color:#666;font-size:16px;margin:0;line-height:1.6;">${aciklama}</p>
    </div>

    ${gucluYonler.length > 0 ? `
    <!-- Güçlü Yönler -->
    <div style="background:#f0fdf4;border-radius:16px;padding:24px 28px;margin-bottom:16px;">
      <h2 style="color:#15803d;font-size:18px;margin:0 0 12px;">✓ Güçlü Yönleriniz</h2>
      ${gucluYonler.map(y => `<p style="margin:4px 0;color:#374151;font-size:14px;">· ${y}</p>`).join('')}
    </div>
    ` : ''}

    ${beslenme.length > 0 ? `
    <!-- Beslenme -->
    <div style="background:#fef9f0;border-radius:16px;padding:24px 28px;margin-bottom:16px;">
      <h2 style="color:#92400e;font-size:18px;margin:0 0 12px;">🍃 Beslenme Tavsiyeleri</h2>
      <div style="display:flex;flex-wrap:wrap;gap:8px;">
        ${beslenme.map(b => `<span style="background:${renk};color:white;padding:4px 12px;border-radius:100px;font-size:13px;">${b}</span>`).join('')}
      </div>
    </div>
    ` : ''}

    <!-- CTA -->
    <div style="text-align:center;background:linear-gradient(135deg,#f5e6c8,#fdf6e3);border-radius:16px;padding:32px;margin-bottom:24px;">
      <p style="color:#5c3d1e;font-size:16px;margin:0 0 16px;font-weight:600;">Detaylı profilinizi inceleyin</p>
      <a href="https://mizac.xyz/mizaclar/${tip || ''}"
         style="background:linear-gradient(135deg,#8b5e1e,#c4973a);color:white;text-decoration:none;padding:14px 32px;border-radius:100px;font-weight:700;font-size:16px;display:inline-block;">
        ✦ Profilimi İncele
      </a>
    </div>

    <!-- Paylaş -->
    <div style="text-align:center;margin-bottom:24px;">
      <p style="color:#666;font-size:14px;margin:0 0 12px;">Arkadaşlarına da söyle:</p>
      <a href="https://wa.me/?text=${encodeURIComponent(`Mizaç testimde ${isimTR} ${sembol} çıktım! Sen de dene 👇 https://mizac.xyz/test`)}"
         style="background:#25D366;color:white;text-decoration:none;padding:10px 24px;border-radius:100px;font-weight:600;font-size:14px;display:inline-block;">
        WhatsApp'ta Paylaş
      </a>
    </div>

    <!-- Footer -->
    <div style="text-align:center;border-top:1px solid #e5d5b0;padding-top:20px;">
      <p style="color:#999;font-size:12px;margin:0;">✦ Mizaç · İbn-i Sina Geleneğine Dayalı Mizaç Rehberi</p>
      <p style="color:#bbb;font-size:11px;margin:4px 0 0;">Varlığın Tahlili · Zeynep Işık Büyükbay</p>
    </div>

  </div>
</body>
</html>
      `.trim(),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Subscribe error:', err);
    return NextResponse.json({ error: 'Bir hata oluştu' }, { status: 500 });
  }
}
