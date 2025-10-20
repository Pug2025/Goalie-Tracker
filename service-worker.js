const CACHE = 'tt-v3200';
const ASSETS = [
  './',
  './index.html',
  './manifest.json'
  // If you add icons later: './icon-192.png','./icon-512.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k!==CACHE).map(k => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  // Cache-first for same-origin GET requests
  if (req.method === 'GET' && new URL(req.url).origin === location.origin) {
    e.respondWith(
      caches.match(req).then(cached => cached || fetch(req).then(r => {
        // Optionally update cache
        return r;
      }))
    );
  }
});
