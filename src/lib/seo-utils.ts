import { Metadata } from 'next'
import { personalInfo } from '@/data/portfolio'

// Utilitaires pour générer des métadonnées SEO cohérentes

export interface SEOConfig {
  title: string
  description: string
  keywords?: string[]
  ogImage?: string
  canonical?: string
  noindex?: boolean
}

export function generateMetadata(config: SEOConfig): Metadata {
  const {
    title,
    description,
    keywords = [],
    ogImage = '/images/og-image.jpg',
    canonical,
    noindex = false
  } = config

  const fullTitle = title.includes(personalInfo.name) 
    ? title 
    : `${title} | ${personalInfo.name} - ${personalInfo.title}`

  return {
    title: fullTitle,
    description,
    keywords: [
      ...keywords,
      personalInfo.name,
      'développeur full stack',
      'Next.js',
      'React',
      'TypeScript',
      'Nantes'
    ],
    robots: {
      index: !noindex,
      follow: !noindex,
      googleBot: {
        index: !noindex,
        follow: !noindex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title: fullTitle,
      description,
      type: 'website',
      locale: 'fr_FR',
      url: canonical || 'https://arthurjean.com',
      siteName: `${personalInfo.name} - Portfolio`,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: canonical || 'https://arthurjean.com',
    },
  }
}

// Générateur de données structurées pour les projets
export function generateProjectJsonLd(project: {
  title: string
  description: string
  technologies: string[]
  urls?: string[]
  imageUrl: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": project.title,
    "description": project.description,
    "applicationCategory": "WebApplication",
    "operatingSystem": "Web",
    "creator": {
      "@type": "Person",
      "name": personalInfo.name,
      "@id": "https://arthurjean.com/#person"
    },
    "programmingLanguage": project.technologies,
    "url": project.urls && project.urls.length > 0 ? project.urls[0] : undefined,
    "screenshot": {
      "@type": "ImageObject",
      "url": `https://arthurjean.com${project.imageUrl}`,
      "description": `Capture d'écran de ${project.title}`
    },
    "offers": {
      "@type": "Offer",
      "availability": "https://schema.org/InStock",
      "price": "0",
      "priceCurrency": "EUR"
    }
  }
}

// Générateur de breadcrumbs
export function generateBreadcrumbJsonLd(breadcrumbs: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  }
}