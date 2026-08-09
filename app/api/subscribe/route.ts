import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { mizacProfiller, MizacTip } from '@/lib/mizac-data';
import { rateLimit, istemciIp, gecerliEposta } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  // Limit yoksa bu uç herhangi bir adrese sınırsız "hoş geldin" maili
  // gönderttirebilir ve Resend audience'ını şişirebilir.
  if (!rateLimit(istemciIp(req), { limit: 5, windowMs: 60_000 })) {
    return NextResponse.json(
      { error: 'Çok fazla istek. Lütfen bir dakika bekleyin.' },
      { status: 429 }
    );
  }

  const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID || '';
  try {
    const { email, tip } = await req.json();

    if (!gecerliEposta(email)) {
      return NextResponse.json({ error: 'Geçersiz email' }, { status: 400 });
    }

    // Resend istemcisi doğrulamadan sonra kurulur: anahtar tanımlı değilse
    // constructor hata atıyor ve geçersiz girdiler 400 yerine 500 dönüyordu
    const resend = new Resend(process.env.RESEND_API_KEY);

    const profil = tip ? mizacProfiller[tip as MizacTip] : null;

    // Resend Audience'a ekle (hata olsa da email göndermeye devam et)
    if (AUDIENCE_ID) {
      try {
        await resend.contacts.create({
          email,
          audienceId: AUDIENCE_ID,
          unsubscribed: false,
          ...(profil ? { firstName: profil.isim } : {}),
        });
      } catch {
        // Zaten kayıtlı olabilir — devam et
      }
    }

    // Hoş geldin emaili gönder
    const isPdfWaitlist = tip?.startsWith('pdf-waitlist');
    const isimTR = profil ? profil.isim : 'Mizaç';
    const sembol = profil ? profil.elementSembol : '✦';
    const renk = profil ? profil.renk : '#c4973a';
    const aciklama = profil ? profil.kisaAciklama : 'Mizaç dünyasına hoş geldiniz.';
    const gucluYonler = profil ? profil.gucluYonler.slice(0, 4) : [];
    const beslenme = profil ? profil.beslenme.slice(0, 4) : [];

    const emailSubject = isPdfWaitlist
      ? `📄 PDF Rapor Listesine Eklendiniz!`
      : profil
      ? `${sembol} Mizaç Profiliniz: ${isimTR}`
      : `✦ Mizaç Bültenine Hoş Geldiniz!`;

    const htmlContent = isPdfWaitlist ? `
<!DOCTYPE html>
<html lang="tr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0f0a04;font-family:Georgia,serif;">
  <div style="max-width:600px;margin:0 auto;padding:32px 16px;">
    <div style="text-align:center;padding:40px 32px;background:#1a1207;border-radius:20px;margin-bottom:24px;">
      <div style="font-size:48px;margin-bottom:12px;">📄</div>
      <div style="font-size:12px;letter-spacing:3px;color:#c4973a;margin-bottom:8px;">PDF RAPOR LİSTESİ</div>
      <h1 style="font-size:28px;font-weight:900;color:#e8d5b0;margin:0 0 12px;">Listeye eklendiniz!</h1>
      <p style="color:#9a8a6a;font-size:15px;margin:0;line-height:1.6;">Derin Mizaç Raporu hazır olduğunda sizi ilk haberdar edeceğiz.</p>
    </div>
    <div style="background:#1a1207;border-radius:16px;padding:24px 28px;margin-bottom:16px;">
      <h2 style="color:#c4973a;font-size:16px;margin:0 0 12px;">Rapor şunları içerecek:</h2>
      ${['✦ 20+ sayfa kişisel mizaç profili', '✦ Organ–duygu haritanız', '✦ Haftalık sağlık protokolü', '✦ İlişki ve kariyer uyum analizi', "✦ Esmaü'l-Hüsna zikirleriniz"].map(i => `<p style="margin:6px 0;color:#e8d5b0;font-size:14px;">${i}</p>`).join('')}
    </div>
    <div style="text-align:center;padding:24px;background:#1a1207;border-radius:16px;margin-bottom:24px;">
      <p style="color:#9a8a6a;font-size:14px;margin:0 0 16px;">Mizaç profilinizi şimdiden inceleyin:</p>
      <a href="https://mizac.xyz/test" style="background:#c4973a;color:#0f0a04;text-decoration:none;padding:14px 32px;border-radius:100px;font-weight:700;font-size:15px;display:inline-block;">✦ Testi Yap</a>
    </div>
    <div style="text-align:center;border-top:1px solid #3d2c0e;padding-top:20px;">
      <p style="color:#6b5230;font-size:12px;margin:0;">✦ Mizaç · İbn-i Sina Geleneğine Dayalı Mizaç Rehberi</p>
    </div>
  </div>
</body>
</html>` : profil ? `
<!DOCTYPE html>
<html lang="tr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#faf7f2;font-family:Georgia,serif;">
  <div style="max-width:600px;margin:0 auto;padding:32px 16px;">
    <div style="text-align:center;padding:40px 32px;background:linear-gradient(135deg,${renk}22,#fff9f0);border-radius:20px;margin-bottom:24px;">
      <div style="font-size:64px;margin-bottom:12px;">${sembol}</div>
      <div style="font-size:12px;letter-spacing:3px;opacity:0.5;margin-bottom:8px;">MİZAÇ PROFİLİNİZ</div>
      <h1 style="font-size:42px;font-weight:900;color:${renk};margin:0 0 8px;">${isimTR}</h1>
      <p style="color:#666;font-size:16px;margin:0;line-height:1.6;">${aciklama}</p>
    </div>
    ${gucluYonler.length > 0 ? `
    <div style="background:#f0fdf4;border-radius:16px;padding:24px 28px;margin-bottom:16px;">
      <h2 style="color:#15803d;font-size:18px;margin:0 0 12px;">✓ Güçlü Yönleriniz</h2>
      ${gucluYonler.map(y => `<p style="margin:4px 0;color:#374151;font-size:14px;">· ${y}</p>`).join('')}
    </div>` : ''}
    ${beslenme.length > 0 ? `
    <div style="background:#fef9f0;border-radius:16px;padding:24px 28px;margin-bottom:16px;">
      <h2 style="color:#92400e;font-size:18px;margin:0 0 12px;">🍃 Beslenme Tavsiyeleri</h2>
      <div style="display:flex;flex-wrap:wrap;gap:8px;">
        ${beslenme.map(b => `<span style="background:${renk};color:white;padding:4px 12px;border-radius:100px;font-size:13px;">${b}</span>`).join('')}
      </div>
    </div>` : ''}
    <div style="text-align:center;background:linear-gradient(135deg,#f5e6c8,#fdf6e3);border-radius:16px;padding:32px;margin-bottom:24px;">
      <p style="color:#5c3d1e;font-size:16px;margin:0 0 16px;font-weight:600;">Detaylı profilinizi inceleyin</p>
      <a href="https://mizac.xyz/mizaclar/${tip || ''}" style="background:linear-gradient(135deg,#8b5e1e,#c4973a);color:white;text-decoration:none;padding:14px 32px;border-radius:100px;font-weight:700;font-size:16px;display:inline-block;">✦ Profilimi İncele</a>
    </div>
    <div style="text-align:center;margin-bottom:24px;">
      <p style="color:#666;font-size:14px;margin:0 0 12px;">Arkadaşlarına da söyle:</p>
      <a href="https://wa.me/?text=${encodeURIComponent(`Mizaç testimde ${isimTR} ${sembol} çıktım! Sen de dene 👇 https://mizac.xyz/test`)}" style="background:#25D366;color:white;text-decoration:none;padding:10px 24px;border-radius:100px;font-weight:600;font-size:14px;display:inline-block;">WhatsApp'ta Paylaş</a>
    </div>
    <div style="text-align:center;border-top:1px solid #e5d5b0;padding-top:20px;">
      <p style="color:#999;font-size:12px;margin:0;">✦ Mizaç · İbn-i Sina Geleneğine Dayalı Mizaç Rehberi</p>
      <p style="color:#bbb;font-size:11px;margin:4px 0 0;">Varlığın Tahlili · Zeynep Işık Büyükbay</p>
    </div>
  </div>
</body>
</html>` : `
<!DOCTYPE html>
<html lang="tr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0f0a04;font-family:Georgia,serif;">
  <div style="max-width:600px;margin:0 auto;padding:32px 16px;">
    <div style="text-align:center;padding:40px 32px;background:#1a1207;border-radius:20px;margin-bottom:24px;">
      <div style="font-size:48px;margin-bottom:12px;">✦</div>
      <div style="font-size:12px;letter-spacing:3px;color:#c4973a;margin-bottom:8px;">MİZAÇ BÜLTENİ</div>
      <h1 style="font-size:28px;font-weight:900;color:#e8d5b0;margin:0 0 12px;">Hoş geldiniz!</h1>
      <p style="color:#9a8a6a;font-size:15px;margin:0;line-height:1.6;">Her Pazartesi mizaç, sağlık ve bilinç hakkında özel içerikler gönderilecek.</p>
    </div>
    <div style="text-align:center;padding:24px;background:#1a1207;border-radius:16px;margin-bottom:24px;">
      <p style="color:#9a8a6a;font-size:14px;margin:0 0 16px;">Henüz mizaç testini yapmadıysanız:</p>
      <a href="https://mizac.xyz/test" style="background:#c4973a;color:#0f0a04;text-decoration:none;padding:14px 32px;border-radius:100px;font-weight:700;font-size:15px;display:inline-block;">✦ Ücretsiz Testi Başlat</a>
    </div>
    <div style="text-align:center;border-top:1px solid #3d2c0e;padding-top:20px;">
      <p style="color:#6b5230;font-size:12px;margin:0;">✦ Mizaç · İbn-i Sina Geleneğine Dayalı Mizaç Rehberi</p>
    </div>
  </div>
</body>
</html>`;

    await resend.emails.send({
      from: 'Mizaç <noreply@mizac.xyz>',
      to: email,
      subject: emailSubject,
      html: htmlContent.trim(),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Subscribe error:', err);
    return NextResponse.json({ error: 'Bir hata oluştu' }, { status: 500 });
  }
}
