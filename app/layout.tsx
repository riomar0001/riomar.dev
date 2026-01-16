import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://riomar.dev"),
  title: {
    default: "Mario Jr Inguit | Full Stack Developer",
    template: "%s | Mario Jr Inguit",
  },
  description:
    "Full-stack developer crafting elegant digital experiences. Building modern web applications with clean code and thoughtful design.",
  keywords: [
    "Mario Jr Inguit",
    "Full Stack Developer",
    "Web Developer",
    "React",
    "Next.js",
    "TypeScript",
    "Portfolio",
  ],
  authors: [{ name: "Mario Jr Inguit", url: "https://riomar.dev" }],
  creator: "Mario Jr Inguit",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://riomar.dev",
    siteName: "Mario Jr Inguit",
    title: "Mario Jr Inguit | Full Stack Developer",
    description:
      "Full-stack developer crafting elegant digital experiences. Building modern web applications with clean code and thoughtful design.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mario Jr Inguit | Full Stack Developer",
    description:
      "Full-stack developer crafting elegant digital experiences. Building modern web applications with clean code and thoughtful design.",
    creator: "@riomar",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
