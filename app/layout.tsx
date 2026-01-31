import { ReactLenis } from 'lenis/react';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap'
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap'
});

export const metadata: Metadata = {
  metadataBase: new URL('https://riomar.dev'),
  title: {
    default: 'Mario Jr Inguito | Software Engineer',
    template: '%s | Mario Jr Inguito'
  },
  description: 'Full-stack developer crafting elegant digital experiences. Building modern web applications with clean code and thoughtful design.',
  keywords: ['Mario Jr Inguito', 'Software Engineer', 'Web Developer', 'React', 'Next.js', 'TypeScript', 'Redis', 'Portfolio'],
  authors: [{ name: 'Mario Jr Inguito', url: 'https://riomar.dev' }],
  creator: 'Mario Jr Inguito',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://riomar.dev',
    siteName: 'Mario Jr Inguito',
    title: 'Mario Jr Inguito | Software Engineer',
    description: 'Full-stack developer crafting elegant digital experiences. Building modern web applications with clean code and thoughtful design.'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mario Jr Inguito | Software Engineer',
    description: 'Full-stack developer crafting elegant digital experiences. Building modern web applications with clean code and thoughtful design.',
    creator: '@riomar'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  }
};

// Script to prevent flash of wrong theme
const themeScript = `
  (function() {
    try {
      const stored = localStorage.getItem('theme');
      if (stored === 'dark' || stored === 'light') {
        document.documentElement.classList.add(stored);
      } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.add('light');
      }
    } catch (e) {}
  })();
`;

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`} suppressHydrationWarning>
        <ReactLenis root />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
