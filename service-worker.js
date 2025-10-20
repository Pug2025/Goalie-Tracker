// Team Tracker — Offline Service Worker (v3.2.1)
const CACHE = 'team-tracker-v3211';
const ASSETS = [
  './',
  './index.html',
  './manifest.json'
  // Add './icon-192.png', './icon-512.png' here later if you upload them
];

// Install and cache the core files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting(); // activate immediately
});

// Remove old caches when activating a new version
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Serve cached files when offline
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return; // skip non-GET
  const url = new URL(req.url);

  // Only intercept requests for this same origin
  if (url.origin === location.origin) {
    event.respondWith(
      caches.match(req).then(cached => cached || fetch(req))
    );
  }
});
