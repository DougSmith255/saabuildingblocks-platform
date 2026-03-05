// Smart Agent Alliance Service Worker
// v3: Profile image fallback fix + cache refresh
const CACHE_NAME = 'saa-cache-v3';
const OFFLINE_URL = '/offline.html';

// Assets to cache on install
const PRECACHE_ASSETS = [
  '/',
  '/agent-portal',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/offline.html'
];

// Install event - precache essential assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
  // Activate immediately
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  // Take control of all pages immediately
  self.clients.claim();
});

// Fetch event - network first, fallback to cache
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) return;

  // Skip API requests and Cloudflare Images
  if (event.request.url.includes('/api/') ||
      event.request.url.includes('imagedelivery.net')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Clone the response before caching
        const responseClone = response.clone();

        // Cache successful responses
        if (response.status === 200) {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }

        return response;
      })
      .catch(() => {
        // Network failed, try cache
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }

          // If it's a navigation request, show offline page
          if (event.request.mode === 'navigate') {
            return caches.match(OFFLINE_URL);
          }

          // Return a simple offline response for other requests
          return new Response('Offline', {
            status: 503,
            statusText: 'Service Unavailable'
          });
        });
      })
  );
});
