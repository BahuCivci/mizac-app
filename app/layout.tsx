import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { LangProvider } from "@/lib/lang-context";
import { LangToggle } from "@/components/lang-toggle";

// AdSense client ID — ca-pub-XXXXXXXXXXXXXXXX ile değiştirin
const ADSENSE_CLIENT = 'ca-pub-XXXXXXXXXXXXXXXX';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = 'https://mizac.app'; // domain değişince buraya yaz

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
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Mizaç Testi' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mizaç · Mizacını Keşfet',
    description: 'İbn-i Sina geleneğine dayalı 50 soruluk mizaç testi.',
    images: ['/og-image.png'],
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
      <body className="min-h-full flex flex-col">
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
          <LangProvider>
            <LangToggle />
            {children}
          </LangProvider>
        </body>
    </html>
  );
}
