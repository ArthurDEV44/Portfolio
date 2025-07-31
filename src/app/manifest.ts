import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Arthur Jean - Développeur Full Stack',
    short_name: 'Arthur Jean',
    description: 'Portfolio d\'Arthur Jean, développeur Full Stack passionné par la performance, la durabilité et l\'innovation technologique. Spécialisé en Next.js, Angular et Node.js.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait-primary',
    background_color: '#ffffff',
    theme_color: '#3b82f6',
    categories: ['business', 'portfolio', 'technology'],
    lang: 'fr',
    dir: 'ltr',
    
    // Configuration d'affichage
    display_override: ['standalone', 'minimal-ui', 'browser'],
    
    // Icônes pour la PWA
    icons: [
      // Icônes standards disponibles
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any'
      },
      
      // Icônes maskables (à créer si nécessaire)
      {
        src: '/icon-192x192-maskable.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/icon-512x512-maskable.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable'
      }
    ],
    
    // Gestion du partage pour le portfolio
    share_target: {
      action: '/contact',
      method: 'GET',
      params: {
        title: 'title',
        text: 'text',
        url: 'url'
      }
    },
    
    // Configuration du launch
    launch_handler: {
      client_mode: 'focus-existing'
    },
    
    // Métadonnées supplémentaires
    related_applications: [],
    prefer_related_applications: false,
    
    // Écrans de démarrage
    screenshots: [
      {
        src: '/image.png',
        sizes: '1080x1920',
        type: 'image/png',
        form_factor: 'narrow'
      }
    ]
  };
}
