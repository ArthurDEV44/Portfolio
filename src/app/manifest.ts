import type { MetadataRoute } from 'next'
import { personalInfo } from '@/data/portfolio'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${personalInfo.name} - Portfolio`,
    short_name: personalInfo.name,
    description: personalInfo.bio,
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#0ea5e9',
    lang: 'fr',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/icon-192x192-maskable.png', 
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512', 
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/icon-512x512-maskable.png',
        sizes: '512x512',
        type: 'image/png', 
        purpose: 'maskable'
      }
    ],
    categories: ['productivity', 'business', 'developer']
  }
}