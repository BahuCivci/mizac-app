import { blogYazilari } from '@/lib/blog-data';

const siteUrl = 'https://mizac.xyz';

export async function GET() {
  const items = blogYazilari
    .sort((a, b) => new Date(b.tarih).getTime() - new Date(a.tarih).getTime())
    .map((yazi) => {
      const url = `${siteUrl}/blog/${yazi.slug}`;
      const paragraphs = yazi.icerik
        .filter((b) => b.tip === 'p')
        .map((b) => `<p>${b.metin}</p>`)
        .join('');

      return `
    <item>
      <title><![CDATA[${yazi.baslik}]]></title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(yazi.tarih).toUTCString()}</pubDate>
      <description><![CDATA[${yazi.ozet}]]></description>
      <content:encoded><![CDATA[${paragraphs}]]></content:encoded>
      <category><![CDATA[${yazi.etiketler.join(', ')}]]></category>
    </item>`.trim();
    })
    .join('\n    ');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Mizaç Blog · İbn-i Sina Geleneği</title>
    <link>${siteUrl}/blog</link>
    <description>Safravî, Demevî, Balgamî ve Sevdavî mizaç tipleri hakkında yazılar. Mizaç, sağlık, ilişki ve bilinç.</description>
    <language>tr</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/rss" rel="self" type="application/rss+xml"/>
    <image>
      <url>${siteUrl}/icon-192.png</url>
      <title>Mizaç</title>
      <link>${siteUrl}</link>
    </image>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  });
}
