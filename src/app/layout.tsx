import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { personalInfo, socialLinks } from "@/data/portfolio";
import Navbar from "@/components/sections/Navbar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Métadonnées SEO complètes selon les préférences de l'utilisateur
export const metadata: Metadata = {
  title: {
    default: `${personalInfo.name} - ${personalInfo.title}`,
    template: `%s | ${personalInfo.name}`
  },
  description: personalInfo.bio,
  keywords: [
    "Arthur Jean",
    "Développeur SaaS",
    "Full-Stack",
    "React",
    "Next.js",
    "TypeScript",
    "Node.js",
    "PostgreSQL",
    "Portfolio",
    "Freelance",
    "Développement web",
    "Applications SaaS",
    "Frontend",
    "Backend",
    "France"
  ],
  authors: [{ name: personalInfo.name, url: socialLinks.github }],
  creator: personalInfo.name,
  publisher: personalInfo.name,
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
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://arthurjean.dev",
    siteName: `${personalInfo.name} - Portfolio`,
    title: `${personalInfo.name} - ${personalInfo.title}`,
    description: personalInfo.bio,
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: `${personalInfo.name} - Portfolio`,
      },
    ],
  },
  alternates: {
    canonical: "https://arthurjean.dev",
  },
  verification: {
    google: "verification-code-here",
  },
  category: "technology",
};

// Données structurées JSON-LD pour améliorer le SEO
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: personalInfo.name,
  jobTitle: personalInfo.title,
  description: personalInfo.bio,
  url: "https://arthurjean.dev",
  email: personalInfo.email,
  address: {
    "@type": "PostalAddress",
    addressCountry: "FR",
    addressRegion: personalInfo.location,
  },
  sameAs: [
    socialLinks.github,
    socialLinks.linkedin,
    socialLinks.instagram,
  ],
  knowsAbout: [
    "React",
    "Next.js",
    "TypeScript",
    "Node.js",
    "PostgreSQL",
    "MongoDB",
    "AWS",
    "SaaS Development",
    "Full Stack Development",
    "Web Development"
  ],
  alumniOf: {
    "@type": "EducationalOrganization",
    name: "Formation développement web"
  },
  worksFor: {
    "@type": "Organization",
    name: "Freelance"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        {/* Données structurées JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Preconnect pour améliorer les performances */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}
