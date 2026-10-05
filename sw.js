const CACHE_NAME = 'wum-cache-v2';
const ASSETS = [
  '/',
  '/index.html',
  '/vision.html',
  '/mission.html',
  '/activites.html',
  '/formations.html',
  '/ressources.html',
  '/rejoindre.html',
  '/css/style.css',
  '/js/config.js',
  '/js/app.js',
  '/manifest.json',
  '/LOGO_WUM_PNG-01.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => response || fetch(e.request)).catch(() => {
      if (e.request.headers.get('accept')?.includes('text/html')) {
        return caches.match('/index.html');
      }
    })
  );
});
