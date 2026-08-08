import { GeistMono } from "geist/font/mono";
import { GeistPixelCircle, GeistPixelGrid } from "geist/font/pixel";
import { GeistSans } from "geist/font/sans";
import type { Metadata, Viewport } from "next";
import { Hanken_Grotesk, Instrument_Serif, Petemoss } from "next/font/google";

import { siteConfig } from "@/lib/site.config";

import "./globals.css";
import { Providers } from "./providers";

const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-hanken-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const petemoss = Petemoss({
  variable: "--font-signature",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0c173f" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={siteConfig.language} suppressHydrationWarning>
      <head>
        {/* Prevent flash of wrong theme */}
        <script
          // oxlint-disable-next-line react/no-danger -- inline script for theme flash prevention
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem('theme')==='dark')document.documentElement.classList.add('dark');document.documentElement.dataset.grid=localStorage.getItem('grid-mode')==='off'?'off':'on'}catch(e){}`,
          }}
        />
        {/* Mastodon profile verification (rel=me, IndieWeb-style). Lets
            mastodon.social tick the Portfolio field green on @arthurjdev. */}
        <link rel="me" href={siteConfig.links.mastodon} />
      </head>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} ${GeistPixelGrid.variable} ${GeistPixelCircle.variable} ${hankenGrotesk.variable} ${instrumentSerif.variable} ${petemoss.variable} antialiased`}
      >
        <a
          href="#main-content"
          className="focus:bg-primary focus:text-primary-foreground focus:ring-ring sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:rounded-md focus:px-4 focus:py-2 focus:ring-2 focus:outline-none"
        >
          Skip to main content
        </a>

        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
