const CACHE_NAME = 'racoon-cache-v2';
const urlsToCache = [
  'https://cdn.jsdelivr.net/npm/@picocss/pico/css/pico.classless.min.css',
  'assets/logo.png',
  'js/modal.js',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Cache hit - return the response from the cache
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  );
});

// Add an event listener for the 'fetch' event to intercept network requests and serve cached responses when available.

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Cache hit - return the response from the cache
      if (response) {
        return response;
      }
      // No match in the cache, fetch from the network
      return fetch(event.request);
    })
  );
});
