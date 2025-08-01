import { MetadataRoute } from 'next'
import { projects } from '@/data/portfolio'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://arthurjean.com'
  
  // Pages principales
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
  ]

  // Ajout dynamique des projets avec leurs URLs si disponibles
  const projectRoutes = projects
    .filter(project => project.urls && project.urls.length > 0)
    .map(project => ({
      url: project.urls![0], // URL principale du projet
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.6,
    }))

  return [...routes, ...projectRoutes]
}