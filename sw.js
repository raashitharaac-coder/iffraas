// Birthday Surprise Website - Service Worker
// Provides caching, offline support, and performance optimization

const CACHE_NAME = 'birthday-surprise-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🎂</text></svg>'
];

// Install Event - Cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(ASSETS_TO_CACHE).catch((error) => {
          console.warn('Cache installation warning:', error);
        });
      })
      .catch((error) => {
        console.warn('Service Worker install error:', error);
      })
  );
  self.skipWaiting();
});

// Activate Event - Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event - Serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Handle security form submissions
  if (event.request.url.includes('securityForm')) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Cache-first strategy for static assets
  if (event.request.url.includes('assets')) {
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          return response || fetch(event.request)
            .then((fetchResponse) => {
              // Cache new assets
              if (fetchResponse && fetchResponse.status === 200) {
                const clonedResponse = fetchResponse.clone();
                caches.open(CACHE_NAME).then((cache) => {
                  cache.put(event.request, clonedResponse);
                });
              }
              return fetchResponse;
            });
        })
        .catch(() => {
          // Return offline page or placeholder
          return new Response('Asset not available offline.', {
            status: 404,
            statusText: 'Not Found',
          });
        })
    );
    return;
  }

  // Network-first strategy for HTML and critical resources
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache successful responses
        if (response && response.status === 200) {
          const clonedResponse = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clonedResponse);
          });
        }
        return response;
      })
      .catch(() => {
        // Fall back to cached version
        return caches.match(event.request)
          .then((response) => {
            return response || new Response('Resource not available offline.', {
              status: 503,
              statusText: 'Service Unavailable',
            });
          });
      })
  );
});

// Message handling for cache management
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.delete(CACHE_NAME);
  }
});
