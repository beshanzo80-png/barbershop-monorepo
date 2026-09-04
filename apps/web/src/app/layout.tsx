import type { Metadata, Viewport } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { Providers } from './providers';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  title: {
    default: 'Premium Barber - Profesyonel Erkek Kuaförü',
    template: '%s | Premium Barber',
  },
  description: 'Profesyonel erkek kuaförü randevu sistemi. Favori berberinizle kolayca randevu alın, sadakat puanları kazanın.',
  keywords: ['berber', 'kuaför', 'erkek kuaförü', 'randevu', 'saç kesimi', 'sakal tıraşı', 'İstanbul'],
  authors: [{ name: 'Premium Barber' }],
  creator: 'Premium Barber',
  publisher: 'Premium Barber',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: 'https://premiumbarber.com',
    siteName: 'Premium Barber',
    title: 'Premium Barber - Profesyonel Erkek Kuaförü',
    description: 'Profesyonel erkek kuaförü randevu sistemi',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Premium Barber',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Premium Barber',
    description: 'Profesyonel erkek kuaförü randevu sistemi',
    images: ['/og-image.png'],
  },
  icons: {
    icon: [
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/icons/icon-192.png',
    shortcut: '/icons/icon-96.png',
  },
  manifest: '/manifest.json',
  themeColor: '#D4A843',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Premium Barber',
  },
};

export const viewport: Viewport = {
  themeColor: '#D4A843',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://api.premiumbarber.com" />
      </head>
      <body className="font-sans antialiased bg-bg-primary text-text-primary">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}