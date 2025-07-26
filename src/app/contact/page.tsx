import { 
  ContactHeroSection,
  ContactFormSection
} from '@/components';
import { Metadata } from 'next';
import { personalInfo } from '@/data/portfolio';

// Configuration ISR - revalidation toutes les 24h
export const revalidate = 86400;

// Métadonnées SEO complètes
export const metadata: Metadata = {
  title: 'Contact - Discutons de votre projet',
  description: 'Contactez Arthur Jean, développeur Full Stack spécialisé en Next.js et React. Demandez un devis gratuit pour votre projet web ou application SaaS.',
  keywords: [
    'contact Arthur Jean',
    'devis développement web',
    'développeur freelance contact',
    'Next.js développeur contact',
    'projet web Nantes',
    'développement SaaS contact',
    'consultation développement',
    'freelance full stack contact'
  ],
  openGraph: {
    title: 'Contact - Arthur Jean | Développeur Full Stack',
    description: 'Discutons de votre projet ! Développeur spécialisé en Next.js, React et applications SaaS. Devis gratuit et réponse rapide.',
    type: 'website',
    locale: 'fr_FR',
    url: 'https://arthurjean.dev/contact',
    siteName: `${personalInfo.name} - Portfolio`,
    images: [
      {
        url: '/images/og-contact.jpg',
        width: 1200,
        height: 630,
        alt: 'Contactez Arthur Jean - Développeur Full Stack',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact - Arthur Jean | Développeur Full Stack',
    description: 'Discutons de votre projet ! Développeur spécialisé en Next.js, React et applications SaaS.',
    images: ['/images/og-contact.jpg'],
  },
  alternates: {
    canonical: 'https://arthurjean.dev/contact',
  },
};

// Données structurées JSON-LD pour la page contact
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "mainEntity": {
    "@type": "Person",
    "name": personalInfo.name,
    "jobTitle": personalInfo.title,
    "email": personalInfo.email,
    "telephone": personalInfo.phone,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": personalInfo.address,
      "addressLocality": "Nantes",
      "addressRegion": "Loire-Atlantique",
      "postalCode": "44200",
      "addressCountry": "FR"
    },
    "url": "https://arthurjean.dev",
    "sameAs": [
      "https://github.com/ArthurDEV44",
      "https://linkedin.com/in/arthurjean"
    ]
  },
  "breadcrumb": {
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Accueil",
        "item": "https://arthurjean.dev"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Contact",
        "item": "https://arthurjean.dev/contact"
      }
    ]
  }
};

export default function ContactPage() {
  return (
    <>
      {/* Données structurées JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <main className="min-h-screen bg-black">
        <ContactHeroSection />
        <ContactFormSection />
      </main>
    </>
  );
} 