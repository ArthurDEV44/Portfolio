import type { Metadata } from "next";
import { Geist, Geist_Mono, JetBrains_Mono } from "next/font/google";
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

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// Métadonnées SEO complètes optimisées
export const metadata: Metadata = {
  metadataBase: new URL('https://arthurjean.com'),
  title: {
    default: `${personalInfo.name} - ${personalInfo.title} | Portfolio`,
    template: `%s | ${personalInfo.name} - Développeur Full Stack`
  },
  description: personalInfo.bio,
  keywords: [
    "Arthur Jean",
    "Développeur Full Stack",
    "Développeur SaaS",
    "Next.js",
    "React",
    "Angular",
    "TypeScript",
    "Node.js",
    "Fastify",
    "PostgreSQL",
    "Prisma",
    "TailwindCSS",
    "Portfolio",
    "Freelance",
    "Développement web",
    "Applications SaaS",
    "Frontend",
    "Backend",
    "Clean Architecture",
    "DevOps",
    "Docker",
    "GitHub Actions",
    "Nantes",
    "France",
    "Développeur Nantes",
    "Consultant technique",
    "Architecte logiciel"
  ],
  authors: [{ name: personalInfo.name, url: socialLinks.github }],
  creator: personalInfo.name,
  publisher: personalInfo.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://arthurjean.com",
    siteName: `${personalInfo.name} - Portfolio`,
    title: `${personalInfo.name} - ${personalInfo.title}`,
    description: personalInfo.bio,
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: `${personalInfo.name} - Portfolio Développeur Full Stack`,
        type: "image/jpeg"
      },
      {
        url: "/images/avatar.png",
        width: 400,
        height: 400,
        alt: `${personalInfo.name} - Photo de profil`,
        type: "image/png"
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${personalInfo.name} - ${personalInfo.title}`,
    description: personalInfo.bio,
    images: ["/images/og-image.jpg"],
    creator: `@${personalInfo.name.replace(' ', '')}`,
  },
  alternates: {
    canonical: "https://arthurjean.com",
    types: {
      'application/rss+xml': 'https://arthurjean.com/feed.xml',
    }
  },
  verification: {
    google: "verification-code-here",
    yandex: "verification-code-here",
    yahoo: "verification-code-here",
  },
  category: "technology",
  classification: "Développeur Full Stack, Portfolio",
  referrer: "origin-when-cross-origin",
};

// Données structurées JSON-LD enrichies pour améliorer le SEO
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://arthurjean.com/#person",
  name: personalInfo.name,
  alternateName: ["Arthur Jean", "ArthurDEV44"],
  jobTitle: personalInfo.title,
  description: personalInfo.bio,
  url: "https://arthurjean.com",
  email: personalInfo.email,
  telephone: personalInfo.phone,
  image: {
    "@type": "ImageObject",
    url: "https://arthurjean.com/images/avatar.png",
    width: 400,
    height: 400
  },
  address: {
    "@type": "PostalAddress",
    streetAddress: personalInfo.address,
    addressLocality: "Nantes",
    addressRegion: "Pays de la Loire",
    postalCode: "44200",
    addressCountry: "FR"
  },
  sameAs: [
    socialLinks.github,
    socialLinks.linkedin,
    socialLinks.instagram,
    "https://arthurjean.com"
  ],
  knowsAbout: [
    {
      "@type": "Thing",
      name: "Développement Full Stack"
    },
    {
      "@type": "Thing", 
      name: "Next.js"
    },
    {
      "@type": "Thing",
      name: "React"
    },
    {
      "@type": "Thing",
      name: "Angular"
    },
    {
      "@type": "Thing",
      name: "TypeScript"
    },
    {
      "@type": "Thing",
      name: "Node.js"
    },
    {
      "@type": "Thing",
      name: "Fastify"
    },
    {
      "@type": "Thing",
      name: "PostgreSQL"
    },
    {
      "@type": "Thing",
      name: "Prisma"
    },
    {
      "@type": "Thing",
      name: "Docker"
    },
    {
      "@type": "Thing",
      name: "Clean Architecture"
    },
    {
      "@type": "Thing",
      name: "DevOps"
    },
    {
      "@type": "Thing",
      name: "SaaS Development"
    }
  ],
  hasOccupation: {
    "@type": "Occupation",
    name: "Développeur Full Stack",
    occupationLocation: {
      "@type": "City",
      name: "Nantes, France"
    },
    skills: ["JavaScript", "TypeScript", "React", "Angular", "Node.js", "PostgreSQL", "Docker"]
  },
  alumniOf: [
    {
      "@type": "EducationalOrganization",
      name: "3W Academy",
      description: "Formation développement web Full Stack"
    }
  ],
  worksFor: {
    "@type": "Organization",
    name: "Freelance",
    description: "Développeur Full Stack indépendant"
  },
  award: ["Titre RNCP Bac+4 Développeur/Concepteur Web", "Titre RNCP Bac+2 Développeur Full Stack"],
  memberOf: {
    "@type": "Organization",
    name: "Communauté des développeurs français"
  }
};

// Schema supplémentaire pour le site web
const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://arthurjean.com/#website",
  url: "https://arthurjean.com",
  name: `${personalInfo.name} - Portfolio`,
  description: personalInfo.bio,
  publisher: {
    "@id": "https://arthurjean.com/#person"
  },
  potentialAction: {
    "@type": "SearchAction",
    target: "https://arthurjean.com/contact",
    "query-input": "required name=search_term_string"
  },
  inLanguage: "fr-FR",
  copyrightYear: new Date().getFullYear(),
  copyrightHolder: {
    "@id": "https://arthurjean.com/#person"
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        {/* Preconnect pour améliorer les performances */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* DNS Prefetch pour les domaines externes */}
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        {/* Preload des ressources critiques */}
        <link rel="preload" href="/images/avatar.png" as="image" type="image/png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}
