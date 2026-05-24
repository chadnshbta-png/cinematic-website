import type { Metadata, Viewport } from 'next';
import { Space_Mono } from 'next/font/google';
import './globals.css';

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'DSV — Built for the Future',
  description: 'DSV redefines what global logistics can be. 1,200 active routes. Zero compromise. Pure cinematic engineering.',
  keywords: ['global logistics', 'freight', 'DSV', 'supply chain', 'network intelligence'],
  openGraph: {
    title: 'DSV — Built for the Future',
    description: 'The pinnacle of logistics engineering. DSV Global Network.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#080808',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={spaceMono.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${spaceMono.className} bg-cinema-black text-cinema-white antialiased`}>
        {children}
      </body>
    </html>
  );
}
