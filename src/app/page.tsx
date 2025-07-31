import { 
  HeroSection, 
  AboutSection,
  ProjectsSection,
  ContactSection 
} from '@/components';
import { Metadata } from 'next';
import { personalInfo, projects, skills } from '@/data/portfolio';

// Configuration ISR - revalidation toutes les 24h selon les préférences de l'utilisateur
export const revalidate = 86400;

// Métadonnées SEO spécifiques à la page d'accueil
export const metadata: Metadata = {
  title: `${personalInfo.name} - ${personalInfo.title} | Portfolio & Projets`,
  description: `Découvrez le portfolio de ${personalInfo.name}, développeur Full Stack spécialisé en Next.js, React, Angular et Node.js. Plus de 3 ans d'expérience dans le développement d'applications SaaS et sites web performants.`,
  keywords: [
    'Arthur Jean portfolio',
    'développeur full stack portfolio',
    'projets Next.js',
    'applications React',
    'développeur Angular Nantes',
    'portfolio développeur freelance',
    'création site web Nantes',
    'développement SaaS',
    'consultant technique',
    'architecte logiciel',
    'freelance web development'
  ],
  openGraph: {
    title: `${personalInfo.name} - ${personalInfo.title} | Portfolio`,
    description: `Découvrez mes projets et compétences en développement Full Stack. Spécialisé en Next.js, React, Angular et architectures modernes.`,
    type: 'website',
    locale: 'fr_FR',
    url: 'https://arthurjean.dev',
    siteName: `${personalInfo.name} - Portfolio`,
    images: [
      {
        url: '/images/og-home.jpg',
        width: 1200,
        height: 630,
        alt: `${personalInfo.name} - Portfolio développeur Full Stack`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${personalInfo.name} - Portfolio développeur Full Stack`,
    description: 'Découvrez mes projets et compétences en développement web moderne.',
    images: ['/images/og-home.jpg'],
  },
  alternates: {
    canonical: 'https://arthurjean.dev',
  },
};

// Données structurées pour la page d'accueil
const homeJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "mainEntity": {
    "@type": "Person",
    "@id": "https://arthurjean.dev/#person",
    "name": personalInfo.name,
    "jobTitle": personalInfo.title,
    "description": personalInfo.bio,
    "url": "https://arthurjean.dev",
    "hasOccupation": {
      "@type": "Occupation",
      "name": "Développeur Full Stack",
      "description": "Développement d'applications web modernes et performantes"
    },
    "knowsAbout": skills.slice(0, 10).map(skill => skill.name),
    "creator": projects.map(project => ({
      "@type": "SoftwareApplication",
      "name": project.title,
      "description": project.description,
      "applicationCategory": "WebApplication",
      "operatingSystem": "Web",
      "url": project.urls && project.urls.length > 0 ? project.urls[0] : undefined
    })).filter(p => p.url)
  },
  "breadcrumb": {
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Accueil",
        "item": "https://arthurjean.dev"
      }
    ]
  }
};

export default function Home() {
  return (
    <>
      {/* Données structurées JSON-LD pour la page d'accueil */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd) }}
      />
      
      <main className="min-h-screen bg-black">
        <HeroSection />
        <AboutSection />
        <ProjectsSection />
        <ContactSection />
      </main>
    </>
  );
}
