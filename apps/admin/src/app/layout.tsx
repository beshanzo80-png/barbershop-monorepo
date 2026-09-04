import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { AdminProviders } from './providers';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap', preload: true });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', display: 'swap', preload: true });

export const metadata: Metadata = {
  title: { default: 'Admin Panel - Premium Barber', template: '%s | Admin' },
  description: 'Premium Barber yönetim paneli',
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-sans antialiased bg-bg-primary text-text-primary">
        <AdminProviders>{children}</AdminProviders>
      </body>
    </html>
  );
}