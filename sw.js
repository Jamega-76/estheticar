const CACHE = 'estheticar-v2';
const ASSETS = [
  '/estheticar/',
  '/estheticar/index.html',
  '/estheticar/manifest.json',
  '/estheticar/icon-192.png',
  '/estheticar/icon-512.png',
  '/estheticar/apple-touch-icon.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => {
      // On ajoute les assets un par un pour éviter qu'une erreur bloque tout
      return Promise.allSettled(ASSETS.map(url => c.add(url)));
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).catch(() => caches.match('/estheticar/index.html')))
  );
});
