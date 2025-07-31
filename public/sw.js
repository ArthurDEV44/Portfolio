const CACHE_NAME = 'arthurjean-portfolio-pwa-v1.0';
const STATIC_CACHE = 'arthurjean-portfolio-static-v1.0';
const DYNAMIC_CACHE = 'arthurjean-portfolio-dynamic-v1.0';
const IMAGE_CACHE = 'arthurjean-portfolio-images-v1.0';

// Ressources critiques à pré-charger
const CRITICAL_ASSETS = [
  '/',
  '/contact',
  '/galerie',
  '/offline',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/manifest.json'
];

// Ressources statiques à mettre en cache
const STATIC_ASSETS = [
  '/favicon.ico',
  '/next.svg',
  '/file.svg',
  '/globe.svg'
];

// Patterns d'URL à gérer
const CACHE_STRATEGIES = {
  // Pages principales - NetworkFirst pour du contenu frais
  pages: /^https?:\/\/[^\/]+\/(?:contact|galerie)?(?:\/.*)?$/,
  
  // API - NetworkFirst avec fallback
  api: /^https?:\/\/[^\/]+\/api\//,
  
  // Assets statiques - CacheFirst
  static: /\.(js|css|woff2?|ttf|eot)$/,
  
  // Images - StaleWhileRevalidate
  images: /\.(png|jpg|jpeg|gif|svg|webp|avif)$/,
  
  // Fonts - CacheFirst longue durée
  fonts: /\.(woff2?|ttf|eot)$/
};

// Événement d'installation : Pré-chargement des ressources critiques
self.addEventListener('install', (event) => {
  console.log('[SW] Installation en cours...');
  
  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(CACHE_NAME);
        console.log('[SW] Mise en cache des ressources critiques');
        
        // Mise en cache des ressources critiques avec gestion d'erreur
        await Promise.allSettled(
          CRITICAL_ASSETS.map(async (url) => {
            try {
              const response = await fetch(url);
              if (response.ok) {
                await cache.put(url, response);
              }
            } catch (error) {
              console.warn(`[SW] Impossible de mettre en cache: ${url}`, error);
            }
          })
        );
        
        // Activation immédiate
        self.skipWaiting();
      } catch (error) {
        console.error('[SW] Erreur lors de l\'installation:', error);
      }
    })()
  );
});

// Événement d'activation : Nettoyage des anciens caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activation en cours...');
  
  event.waitUntil(
    (async () => {
      try {
        const cacheNames = await caches.keys();
        const validCaches = [CACHE_NAME, STATIC_CACHE, DYNAMIC_CACHE, IMAGE_CACHE];
        
        // Suppression des anciens caches
        await Promise.all(
          cacheNames
            .filter(cacheName => !validCaches.includes(cacheName))
            .map(cacheName => {
              console.log(`[SW] Suppression de l'ancien cache: ${cacheName}`);
              return caches.delete(cacheName);
            })
        );
        
        // Prise de contrôle immédiate
        await self.clients.claim();
        console.log('[SW] Service Worker activé et en contrôle');
      } catch (error) {
        console.error('[SW] Erreur lors de l\'activation:', error);
      }
    })()
  );
});

// Événement fetch : Stratégies de cache intelligentes
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Ignorer les requêtes non-HTTP
  if (!url.protocol.startsWith('http')) return;
  
  // Ignorer les requêtes Chrome Extensions
  if (url.protocol === 'chrome-extension:') return;
  
  event.respondWith(handleRequest(request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  
  try {
    // Stratégie pour les images
    if (CACHE_STRATEGIES.images.test(request.url)) {
      return await staleWhileRevalidate(request, IMAGE_CACHE);
    }
    
    // Stratégie pour les assets statiques
    if (CACHE_STRATEGIES.static.test(request.url) || CACHE_STRATEGIES.fonts.test(request.url)) {
      return await cacheFirst(request, STATIC_CACHE);
    }
    
    // Stratégie pour les pages API
    if (CACHE_STRATEGIES.api.test(request.url)) {
      return await networkFirst(request, DYNAMIC_CACHE, 3000);
    }
    
    // Stratégie pour les pages principales
    if (request.mode === 'navigate' || CACHE_STRATEGIES.pages.test(request.url)) {
      return await networkFirst(request, DYNAMIC_CACHE, 5000);
    }
    
    // Stratégie par défaut
    return await networkFirst(request, DYNAMIC_CACHE);
    
  } catch (error) {
    console.error('[SW] Erreur lors du traitement de la requête:', error);
    
    // Fallback pour les documents
    if (request.mode === 'navigate') {
      return await handleNavigationFallback(request);
    }
    
    throw error;
  }
}

// Stratégie Cache First (pour assets statiques)
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  const networkResponse = await fetch(request);
  if (networkResponse.ok) {
    await cache.put(request, networkResponse.clone());
  }
  
  return networkResponse;
}

// Stratégie Network First (pour contenu dynamique)
async function networkFirst(request, cacheName, timeout = 5000) {
  const cache = await caches.open(cacheName);
  
  try {
    const networkResponse = await Promise.race([
      fetch(request),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout réseau')), timeout)
      )
    ]);
    
    if (networkResponse.ok) {
      await cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Réseau indisponible, utilisation du cache:', error.message);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    throw error;
  }
}

// Stratégie Stale While Revalidate (pour images)
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  const fetchPromise = fetch(request).then(response => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(() => null);
  
  return cachedResponse || await fetchPromise;
}

// Gestion des fallbacks de navigation
async function handleNavigationFallback(request) {
  try {
    // Essayer de servir la page hors-ligne personnalisée
    const offlineResponse = await caches.match('/offline');
    if (offlineResponse) {
      return offlineResponse;
    }
    
    // Fallback vers la page d'accueil si disponible
    const homeResponse = await caches.match('/');
    if (homeResponse) {
      return homeResponse;
    }
    
    // Dernier recours : page d'erreur générée
    return new Response(
      createOfflineHTML(),
      {
        status: 200,
        statusText: 'OK',
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      }
    );
  } catch (error) {
    console.error('[SW] Erreur dans handleNavigationFallback:', error);
    throw error;
  }
}

// Génération d'une page hors-ligne simple
function createOfflineHTML() {
  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Hors ligne - Arthur Jean Portfolio</title>
      <style>
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          display: flex; 
          align-items: center; 
          justify-content: center; 
          min-height: 100vh; 
          margin: 0;
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          color: white;
          text-align: center;
        }
        .container { max-width: 400px; padding: 2rem; }
        h1 { font-size: 2rem; margin-bottom: 1rem; }
        p { font-size: 1.1rem; line-height: 1.6; opacity: 0.9; }
        .subtitle { font-size: 0.9rem; margin-bottom: 1.5rem; opacity: 0.8; }
        button {
          background: rgba(255,255,255,0.2);
          border: 2px solid rgba(255,255,255,0.3);
          color: white;
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 1rem;
          cursor: pointer;
          margin-top: 1rem;
          transition: all 0.3s ease;
        }
        button:hover {
          background: rgba(255,255,255,0.3);
          transform: translateY(-2px);
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>💻 Vous êtes hors ligne</h1>
        <div class="subtitle">Arthur Jean - Développeur Full Stack</div>
        <p>Vérifiez votre connexion internet pour accéder au portfolio.</p>
        <button onclick="location.reload()">Réessayer</button>
      </div>
    </body>
    </html>
  `;
}

// Événement push : Notifications push
self.addEventListener('push', (event) => {
  console.log('[SW] Notification push reçue');
  
  if (!event.data) return;
  
  try {
    const data = event.data.json();
    const options = {
      body: data.body || 'Nouveau message d\'Arthur Jean Portfolio',
      icon: '/icon-192x192.png',
      badge: '/icon-192x192.png',
      tag: data.tag || 'arthurjean-portfolio-notification',
      requireInteraction: data.requireInteraction || false,
      vibrate: [200, 100, 200],
      data: {
        url: data.url || '/',
        timestamp: Date.now(),
        ...data.customData
      },
      actions: data.actions || [
        {
          action: 'open',
          title: 'Voir le message',
          icon: '/icon-192x192.png'
        },
        {
          action: 'close',
          title: 'Fermer'
        }
      ]
    };
    
    event.waitUntil(
      self.registration.showNotification(
        data.title || 'Arthur Jean Portfolio',
        options
      )
    );
  } catch (error) {
    console.error('[SW] Erreur lors du traitement de la notification push:', error);
  }
});

// Événement notificationclick : Gestion des clics sur notifications
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Clic sur notification:', event.action);
  
  event.notification.close();
  
  if (event.action === 'close') {
    return;
  }
  
  const urlToOpen = event.notification.data?.url || '/';
  
  event.waitUntil(
    (async () => {
      try {
        const windowClients = await self.clients.matchAll({
          type: 'window',
          includeUncontrolled: true
        });
        
        // Chercher une fenêtre existante avec l'URL
        for (const client of windowClients) {
          const clientUrl = new URL(client.url);
          const targetUrl = new URL(urlToOpen, self.location.origin);
          
          if (clientUrl.origin === targetUrl.origin) {
            await client.focus();
            if (client.url !== targetUrl.href) {
              return client.navigate(targetUrl.href);
            }
            return;
          }
        }
        
        // Ouvrir une nouvelle fenêtre
        if (self.clients.openWindow) {
          return self.clients.openWindow(urlToOpen);
        }
      } catch (error) {
        console.error('[SW] Erreur lors du clic sur notification:', error);
      }
    })()
  );
});

// Événement sync : Synchronisation en arrière-plan
self.addEventListener('sync', (event) => {
  console.log('[SW] Synchronisation en arrière-plan:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  try {
    console.log('[SW] Exécution de la synchronisation en arrière-plan');
    // Ici vous pouvez implémenter la logique de synchronisation
    // Par exemple : synchroniser les données hors ligne, envoyer des analytics, etc.
  } catch (error) {
    console.error('[SW] Erreur lors de la synchronisation:', error);
  }
}

// Gestion des erreurs globales
self.addEventListener('error', (event) => {
  console.error('[SW] Erreur du Service Worker:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('[SW] Rejet non géré dans le Service Worker:', event.reason);
  event.preventDefault();
});

// Événement beforeinstallprompt : Gestion de l'invite d'installation
self.addEventListener('beforeinstallprompt', (event) => {
  console.log('[SW] Invite d\'installation PWA détectée');
  // Vous pouvez personnaliser le moment d'affichage de l'invite
});

// Message de statut pour debugging
console.log('[SW] Service Worker Arthur Jean Portfolio PWA v1.0 initialisé avec succès 💻');
