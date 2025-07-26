const CACHE_NAME = 'v1';
const ASSETS_TO_CACHE = [
  '/', // Page d'accueil
  '/icon-192x192.png', // Icône
  '/manifest.webmanifest', // Manifest PWA
  '/offline.html', // Page hors-ligne
];

// Événement "install" : Pré-chargement des ressources
self.addEventListener('install', (event) => {
  console.log('Service Worker installé');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Mise en cache des ressources');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Événement "activate" : Suppression des anciens caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activé');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log(`Suppression de l'ancien cache : ${cacheName}`);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Événement "fetch" : Interception des requêtes réseau
self.addEventListener('fetch', (event) => {
  event.respondWith(
    (async () => {
      try {
        // Vérifie si la ressource est dans le cache
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }

        // Effectue une requête réseau
        const networkResponse = await fetch(event.request);

        // Gestion des redirections pour Safari
        if (networkResponse.redirected) {
          const clonedResponse = networkResponse.clone();
          return new Response(clonedResponse.body, {
            status: clonedResponse.status,
            statusText: clonedResponse.statusText,
            headers: clonedResponse.headers,
          });
        }

        // Met en cache les réponses valides
        const cache = await caches.open(CACHE_NAME);
        cache.put(event.request, networkResponse.clone());
        return networkResponse;
      } catch (error) {
        console.error('Échec de la requête réseau : ', error);

        // Retourne la page hors-ligne pour les documents
        if (event.request.destination === 'document') {
          return caches.match('/offline.html');
        }

        throw error;
      }
    })()
  );
});

// Événement "push" : Notifications push
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    event.waitUntil(
      self.registration.showNotification(data.title, {
        body: data.body,
        icon: '/icon-192x192.png',
        badge: '/badge-icon.png',
      })
    );
  }
});

// Événement "notificationclick" : Gestion des clics sur les notifications
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});

// Gestion des erreurs du Service Worker
self.addEventListener('error', (event) => {
  console.error('Erreur du Service Worker :', event);
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('Rejet non géré dans le Service Worker :', event);
});
