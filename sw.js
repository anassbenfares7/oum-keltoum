const CACHE_NAME = 'oum-keltoum-v1.0';
const STATIC_CACHE = 'oum-keltoum-static-v1.0';
const IMAGE_CACHE = 'oum-keltoum-images-v1.0';
const FONT_CACHE = 'oum-keltoum-fonts-v1.0';

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/about.html',
  '/menu.html',
  '/reservation.html',
  '/contact.html',
  '/offline.html',
  '/assets/css/style.min.css',
  '/assets/css/style.css',
  '/assets/css/reservation.min.css',
  '/assets/css/menu-lightbox.min.css',
  '/assets/js/script.js',
  '/webp-support.js',
  '/components/nav-desktop.html',
  '/components/nav-mobile.html',
  '/components/footer.html',
  '/components/noscript-nav.html'
];

// CDN assets that should be cached
const CDN_ASSETS = [
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js',
  'https://code.jquery.com/jquery-3.7.1.min.js',
  'https://unpkg.com/aos@next/dist/aos.css',
  'https://unpkg.com/aos@next/dist/aos.js'
];

// Install event - cache core assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => caches.open(FONT_CACHE))
      .then(cache => cache.addAll(CDN_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Handle skip waiting message
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== STATIC_CACHE &&
              cacheName !== IMAGE_CACHE &&
              cacheName !== FONT_CACHE &&
              cacheName.startsWith('oum-keltoum-')) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache when possible
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Handle different types of requests
  if (event.request.method === 'GET') {

    // HTML pages - try network first, then cache
    if (url.pathname.endsWith('.html') || url.pathname === '/') {
      event.respondWith(
        fetch(event.request)
          .then(response => {
            // Clone the response before caching
            const responseClone = response.clone();
            caches.open(STATIC_CACHE).then(cache => {
              cache.put(event.request, responseClone);
            });
            return response;
          })
          .catch(() => {
            return caches.match(event.request);
          })
      );
      return;
    }

    // CSS and JS files - cache first, then network
    if (url.pathname.endsWith('.css') || url.pathname.endsWith('.js')) {
      event.respondWith(
        caches.match(event.request)
          .then(response => {
            return response || fetch(event.request).then(response => {
              const responseClone = response.clone();
              caches.open(STATIC_CACHE).then(cache => {
                cache.put(event.request, responseClone);
              });
              return response;
            });
          })
      );
      return;
    }

    // Images - cache first with network fallback (including WebP)
    if (url.pathname.match(/\.(jpg|jpeg|png|gif|svg|webp|ico)$/)) {
      event.respondWith(
        caches.match(event.request)
          .then(response => {
            return response || fetch(event.request).then(response => {
              const responseClone = response.clone();
              caches.open(IMAGE_CACHE).then(cache => {
                cache.put(event.request, responseClone);
              });
              return response;
            });
          })
      );
      return;
    }

    // Font files - cache first
    if (url.pathname.match(/\.(woff|woff2|ttf|otf|eot)$/)) {
      event.respondWith(
        caches.match(event.request)
          .then(response => {
            return response || fetch(event.request).then(response => {
              const responseClone = response.clone();
              caches.open(FONT_CACHE).then(cache => {
                cache.put(event.request, responseClone);
              });
              return response;
            });
          })
      );
      return;
    }

    // CDN requests - cache first
    if (url.hostname.includes('cdnjs.cloudflare.com') ||
        url.hostname.includes('cdn.jsdelivr.net') ||
        url.hostname.includes('code.jquery.com') ||
        url.hostname.includes('unpkg.com')) {
      event.respondWith(
        caches.match(event.request)
          .then(response => {
            return response || fetch(event.request).then(response => {
              const responseClone = response.clone();
              caches.open(FONT_CACHE).then(cache => {
                cache.put(event.request, responseClone);
              });
              return response;
            });
          })
      );
      return;
    }
  }

  // For all other requests, use network-first strategy with offline fallback
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Don't cache non-successful responses
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        const responseClone = response.clone();
        caches.open(STATIC_CACHE).then(cache => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        // First try to get from cache
        return caches.match(event.request)
          .then(cachedResponse => {
            if (cachedResponse) {
              return cachedResponse;
            }

            // If it's a navigation request, show offline page
            if (event.request.mode === 'navigate') {
              return caches.match('/offline.html');
            }

            // For other failed requests, return a basic offline response
            return new Response('Hors ligne - Veuillez vérifier votre connexion', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/plain'
              })
            });
          });
      })
  );
});

// Background sync for offline functionality
self.addEventListener('sync', event => {
  if (event.tag === 'sync-forms') {
    event.waitUntil(
      // Handle offline form submissions
      syncForms()
    );
  }
});

// Handle push notifications (if needed in the future)
self.addEventListener('push', event => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/assets/images/banner-img.png',
      badge: '/assets/images/banner-img.png',
      vibrate: [100, 50, 100],
      data: {
        url: data.url || '/'
      }
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.notification.data && event.notification.data.url) {
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    );
  }
});

// Helper function for form synchronization
async function syncForms() {
  // Get stored forms from IndexedDB
  // Send them to the server
  // Clear stored forms
  return Promise.resolve();
}

// Cache cleanup function
async function cleanupCache() {
  const cacheNames = await caches.keys();
  const currentCaches = [STATIC_CACHE, IMAGE_CACHE, FONT_CACHE];

  return Promise.all(
    cacheNames.map(cacheName => {
      if (!currentCaches.includes(cacheName)) {
        return caches.delete(cacheName);
      }
    })
  );
}