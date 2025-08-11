import { 
  TarifsHeroSection,
  TarifsOffersSection,
  TarifsServicesSection,
  TarifsFooterSection
} from '@/components';
import { Metadata } from 'next';
import { personalInfo } from '@/data/portfolio';

// Configuration ISR - revalidation toutes les 24h
export const revalidate = 86400;

// Métadonnées SEO complètes
export const metadata: Metadata = {
  title: 'Tarifs - Grille tarifaire développeur web',
  description: 'Découvrez ma grille tarifaire pour le développement web, sites vitrines, e-commerce et applications SaaS. Tarifs transparents et solutions sur mesure.',
  keywords: [
    'tarifs développeur web',
    'grille tarifaire développement',
    'prix site vitrine',
    'tarif e-commerce',
    'développeur freelance prix',
    'devis développement web',
    'tarif Next.js React',
    'prix application SaaS',
    'développement web Nantes',
    'consultant technique tarifs'
  ],
  openGraph: {
    title: 'Tarifs - Arthur Jean | Développeur Full Stack',
    description: 'Grille tarifaire transparente pour vos projets web. Solutions sur mesure adaptées à votre vision technologique.',
    type: 'website',
    locale: 'fr_FR',
    url: 'https://arthurjean.com/tarifs',
    siteName: `${personalInfo.name} - Portfolio`,
    images: [
      {
        url: '/images/og-tarifs.jpg',
        width: 1200,
        height: 630,
        alt: 'Grille tarifaire Arthur Jean - Développeur Full Stack',
      },
    ],
  },
  alternates: {
    canonical: 'https://arthurjean.com/tarifs',
  },
};

// Données structurées JSON-LD pour la page tarifs
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Grille Tarifaire - Développeur Web",
  "description": "Tarifs indicatifs pour le développement web, sites vitrines et applications SaaS",
  "url": "https://arthurjean.com/tarifs",
  "mainEntity": {
    "@type": "Service",
    "name": "Développement Web Freelance",
    "provider": {
      "@type": "Person",
      "name": personalInfo.name,
      "jobTitle": personalInfo.title
    },
    "areaServed": "France",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Services de développement web",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Mini Site Vitrine"
          },
          "priceRange": "800€ - 1200€"
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Site Vitrine Premium"
          },
          "priceRange": "2500€ - 4500€"
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "E-commerce Refonte"
          },
          "priceRange": "2000€ - 4000€"
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "E-commerce Enterprise"
          },
          "priceRange": "5000€ - 12000€"
        }
      ]
    }
  },
  "breadcrumb": {
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Accueil",
        "item": "https://arthurjean.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Tarifs",
        "item": "https://arthurjean.com/tarifs"
      }
    ]
  }
};

export default function TarifsPage() {
  return (
    <>
      {/* Données structurées JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <main className="bg-black relative overflow-hidden">
        <TarifsHeroSection />
        <TarifsOffersSection />
        <TarifsServicesSection />
        <TarifsFooterSection />
      </main>
    </>
  );
}
