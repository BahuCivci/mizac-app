import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { renderToBuffer } from '@react-pdf/renderer';
import { MizacRaporuPDF } from '@/lib/pdf/MizacRaporu';
import { MizacTip, mizacProfiller } from '@/lib/mizac-data';
import { rateLimit, istemciIp } from '@/lib/rate-limit';
import React from 'react';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60; // Vercel Pro: 60s timeout

interface JwtPayload {
  tip: MizacTip;
  email: string;
  orderId: string;
}

/** 429 yanıtı — Retry-After ile birlikte */
function cokFazlaIstek(saniye: number) {
  return NextResponse.json(
    { error: 'Çok fazla indirme isteği. Lütfen biraz sonra tekrar deneyin.' },
    { status: 429, headers: { 'Retry-After': String(saniye) } }
  );
}

export async function GET(req: NextRequest) {
  // 1. katman: JWT doğrulamadan önce IP limiti — geçersiz token'la gelen
  // seri istekler doğrulama yolunu boşuna meşgul etmesin
  if (!rateLimit(`rapor-ip:${istemciIp(req)}`, { limit: 10, windowMs: 60_000 })) {
    return cokFazlaIstek(60);
  }

  const token = req.nextUrl.searchParams.get('token');

  if (!token) {
    return NextResponse.json({ error: 'Token gerekli' }, { status: 400 });
  }

  let payload: JwtPayload;
  try {
    // Algoritma sabitlenir; aksi halde token'ın kendi header'ındaki alg kabul edilir
    payload = jwt.verify(token, process.env.PDF_JWT_SECRET!, {
      algorithms: ['HS256'],
    }) as JwtPayload;
  } catch {
    return new NextResponse(
      `<!DOCTYPE html><html><body style="font-family:sans-serif;text-align:center;padding:60px;background:#1a1207;color:#f5f0e8;">
        <h1 style="color:#c4973a;">Bağlantı Süresi Doldu</h1>
        <p>Bu indirme linki 7 günlük süresini tamamladı.</p>
        <p>Yeniden indirme için <a href="mailto:destek@mizac.xyz" style="color:#c4973a;">destek@mizac.xyz</a> adresine e-posta gönderin.</p>
      </body></html>`,
      { status: 410, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    );
  }

  const profil = mizacProfiller[payload.tip];
  if (!profil) {
    return NextResponse.json({ error: 'Geçersiz mizaç tipi' }, { status: 400 });
  }

  // 2. katman: token başına limit. PDF render'ı maxDuration 60s'lik pahalı bir
  // iş; geçerli bir token 7 gün boyunca bunu sınırsız tetikleyebilmemeli.
  // Saatte 10, normal bir alıcının birkaç indirmesi için fazlasıyla yeterli.
  const tokenAnahtari = `rapor-token:${payload.orderId ?? payload.email}`;
  if (!rateLimit(tokenAnahtari, { limit: 10, windowMs: 60 * 60_000 })) {
    return cokFazlaIstek(600);
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pdfBuffer: Buffer = await (renderToBuffer as any)(
      React.createElement(MizacRaporuPDF, { profil })
    );
    const uint8 = new Uint8Array(pdfBuffer);

    return new NextResponse(uint8, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="mizac-raporu-${profil.id}.pdf"`,
        'Content-Length': String(uint8.byteLength),
        'Cache-Control': 'private, no-store',
      },
    });
  } catch (err) {
    console.error('PDF generation error:', err);
    return NextResponse.json({ error: 'PDF oluşturulamadı' }, { status: 500 });
  }
}
