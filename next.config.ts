import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // Utilisation de l'option standalone pour le déploiement
  output: 'standalone',
  
  // Optimisations de performance
  experimental: {
    optimizePackageImports: ["@/components"],
  },

  // Optimisations d'images
  images: {
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.vercel.app',
      },
      {
        protocol: 'https',
        hostname: 'www.azuna.pro',
      },
      {
        protocol: 'https',
        hostname: 'ausommetdechezvous.com',
      },
      {
        protocol: 'https',
        hostname: 'atreeyn.com',
      },
    ],
  },

  // Optimisations de compilation
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // Headers de sécurité et performance
  async headers() {
    return [
      {
        // En-têtes spécifiques pour le fichier Service Worker
        source: '/sw.js',
        headers: [
          { key: 'Content-Type', value: 'application/javascript; charset=utf-8' },
          { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
        ],
      },
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ]
  },

  // Configuration pour ISR
  generateBuildId: async () => {
    return "build-" + Date.now()
  },

  // ESLint configuration
  eslint: {
    ignoreDuringBuilds: true,
  },

  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: true,
  },
}

export default nextConfig
