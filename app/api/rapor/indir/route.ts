import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { renderToBuffer } from '@react-pdf/renderer';
import { MizacRaporuPDF } from '@/lib/pdf/MizacRaporu';
import { MizacTip, mizacProfiller } from '@/lib/mizac-data';
import React from 'react';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60; // Vercel Pro: 60s timeout

interface JwtPayload {
  tip: MizacTip;
  email: string;
  orderId: string;
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');

  if (!token) {
    return NextResponse.json({ error: 'Token gerekli' }, { status: 400 });
  }

  let payload: JwtPayload;
  try {
    payload = jwt.verify(token, process.env.PDF_JWT_SECRET!) as JwtPayload;
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
