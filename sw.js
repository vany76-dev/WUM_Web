// Service worker WUM — compatible avec le sous-chemin /WUM_Web/ de GitHub Pages.
// Les chemins sont résolus à partir du scope d'enregistrement (self.registration.scope).
const CACHE_PREFIX = 'wum-cache-';
const CACHE_NAME = CACHE_PREFIX + 'v7';

const ASSETS = [
  './',
  'index.html',
  'a-propos.html',
  'mission.html',
  'vision.html',
  'revetement-mental.html',
  'RM_Club.html',
  'activites.html',
  'formations.html',
  'ressources.html',
  'partenaires.html',
  'rejoindre.html',
  'contact.html',
  'css/style.css',
  'css/revetement-mental.css',
  'js/config.js',
  'js/app.js',
  'manifest.json',
  'LOGO_WUM_PNG-01.png'
];

const url = (chemin) => new URL(chemin, self.registration.scope).href;

// Chaque ressource est mise en cache séparément : une ressource absente
// ne fait pas échouer l'installation (contrairement à cache.addAll).
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => Promise.all(ASSETS.map(chemin =>
        cache.add(url(chemin)).catch(err => console.warn('[WUM SW] Non mis en cache :', chemin, err))
      )))
      .then(() => self.skipWaiting())
  );
});

// Supprime uniquement les anciens caches WUM.
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys
        .filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
        .map(key => caches.delete(key)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const requete = e.request;
  if (requete.method !== 'GET') return;
  if (new URL(requete.url).origin !== self.location.origin) return;

  // Pages : réseau d'abord, puis cache, puis accueil si hors ligne.
  if (requete.mode === 'navigate') {
    e.respondWith(
      fetch(requete)
        .then(reponse => {
          if (reponse.ok) {
            const copie = reponse.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(requete, copie));
          }
          return reponse;
        })
        .catch(() => caches.match(requete).then(r => r || caches.match(url('index.html'))))
    );
    return;
  }

  // Autres ressources : cache d'abord, sinon réseau.
  e.respondWith(caches.match(requete).then(reponse => reponse || fetch(requete)));
});
