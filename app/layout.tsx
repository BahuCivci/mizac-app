import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { LangProvider } from "@/lib/lang-context";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Analytics } from "@vercel/analytics/react";
import { PWARegister } from "@/components/pwa-register";

const GA_ID = 'G-N8NNVEMSEQ';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = 'https://mizac.xyz';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Mizaç · Mizacını Keşfet',
    template: '%s · Mizaç',
  },
  description:
    'İbn-i Sina geleneğine dayalı 50 soruluk mizaç testi. Safravî, Demevî, Balgamî ve Sevdavî mizaç tiplerinden hangisi sensin? Ücretsiz, bilimsel tabanlı.',
  keywords: [
    'mizaç testi', 'mizaç nedir', 'safravi', 'demevi', 'balgami', 'sevdavi',
    'ibn-i sina', 'dört mizaç', 'humour test', 'temperament test',
    'choleric', 'sanguine', 'phlegmatic', 'melancholic',
  ],
  authors: [{ name: 'Mizaç App' }],
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    alternateLocale: 'en_US',
    url: siteUrl,
    siteName: 'Mizaç',
    title: 'Mizaç · Mizacını Keşfet',
    description: 'İbn-i Sina geleneğine dayalı 50 soruluk mizaç testi. Hangi elementi taşıyorsun?',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Mizaç Testi' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mizaç · Mizacını Keşfet',
    description: 'İbn-i Sina geleneğine dayalı 50 soruluk mizaç testi.',
    images: ['/opengraph-image'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  alternates: {
    canonical: siteUrl,
  },
};

const siteSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      name: 'Mizaç',
      url: siteUrl,
      description: 'İbn-i Sina geleneğine dayalı 50 soruluk mizaç testi.',
      inLanguage: ['tr', 'en'],
      potentialAction: {
        '@type': 'SearchAction',
        target: `${siteUrl}/blog?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'Organization',
      '@id': `${siteUrl}/#organization`,
      name: 'Mizaç',
      url: siteUrl,
      description: 'İbn-i Sina geleneğine dayalı mizaç testi, sağlık rehberi ve ilişki uyum analizi.',
      sameAs: ['https://twitter.com/mizac_xyz'],
    },
    {
      '@type': 'WebApplication',
      '@id': `${siteUrl}/#webapp`,
      name: 'Mizaç Testi',
      url: `${siteUrl}/test`,
      applicationCategory: 'HealthApplication',
      applicationSubCategory: 'PersonalityTest',
      operatingSystem: 'All',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'TRY' },
      description: 'İbn-i Sina geleneğine dayalı 50 soruluk ücretsiz mizaç testi.',
      inLanguage: ['tr', 'en'],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* iPhone PWA meta tag'leri */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Mizaç" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#c4973a" />
        <link rel="alternate" type="application/rss+xml" title="Mizaç Blog RSS" href={`${siteUrl}/rss`} />
        <link rel="alternate" hrefLang="tr" href={siteUrl} />
        <link rel="alternate" hrefLang="en" href={siteUrl} />
        <link rel="alternate" hrefLang="x-default" href={siteUrl} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteSchema) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
          </Script>
          {/* AdSense — ADSENSE_CLIENT gerçek ID ile güncellendikten sonra etkinleştirin */}
          {/* <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          /> */}
          <LangProvider>
            <Header />
            {children}
            <Footer />
          </LangProvider>
          <Analytics />
          <PWARegister />
        </body>
    </html>
  );
}
