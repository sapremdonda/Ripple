/* Ripple service worker.
   Bump CACHE when you change files so old copies are cleared. */
const CACHE = 'ripple-v5';
const ASSETS = [
  'index.html', 'tasks.html', 'focus.html', 'notes.html', 'habits.html',
  'tools.html', 'settings.html', 'type.html', 'changelog.html', 'insights.html',
  'styles.css', 'app.js', 'manifest.webmanifest', 'changelog.json',
  'favicon.svg', 'favicon-32.png', 'favicon-192.png',
  'apple-touch-icon.png', 'icon-512.png', 'maskable-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Never cache the live backend — always hit the network.
  if (url.pathname.startsWith('/.netlify/') || url.pathname.startsWith('/api/')) return;

  // Let other cross-origin requests (fonts, quotes API) go straight to the network.
  if (url.origin !== location.origin) return;

  // Network-first: fresh when online, cached fallback when offline.
  e.respondWith(
    fetch(req)
      .then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); return res; })
      .catch(() => caches.match(req).then(c => c || caches.match('index.html')))
  );
});
