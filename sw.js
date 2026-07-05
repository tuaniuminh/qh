// ============================================================
// SERVICE WORKER - MenControl Pro v1.0.5
// Dùng đường dẫn TƯƠNG ĐỐI (./...) để hoạt động trên GitHub Pages
// ============================================================

const VERSION    = '1.0.5';
const CACHE_NAME = `mencontrol-v${VERSION}`;

// Dùng đường dẫn tương đối (self.location.pathname lấy base path tự động)
const BASE = self.registration.scope;

const ASSETS_TO_CACHE = [
  BASE,
  BASE + 'index.html',
  BASE + 'css/style.css',
  BASE + 'js/version.js',
  BASE + 'js/auth.js',
  BASE + 'js/storage.js',
  BASE + 'js/kegel-timer.js',
  BASE + 'js/simulation.js',
  BASE + 'js/app.js',
  BASE + 'manifest.json',
  BASE + 'assets/icons/icon-192.png',
  BASE + 'assets/icons/icon-512.png'
];

// ── Install ──
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS_TO_CACHE))
      .then(() => self.skipWaiting())
      .catch(err => {
        console.warn('[SW] Cache addAll error (non-fatal):', err);
        return self.skipWaiting();
      })
  );
});

// ── Activate: xóa cache cũ ──
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key.startsWith('mencontrol-') && key !== CACHE_NAME)
          .map(key => {
            console.log('[SW] Xóa cache cũ:', key);
            return caches.delete(key);
          })
      )
    ).then(() => self.clients.claim())
  );
});

// ── Fetch: Network first, fallback to cache ──
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  // Bỏ qua cross-origin (fonts, CDN...)
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() =>
        caches.match(event.request).then(cached =>
          cached || caches.match(BASE + 'index.html')
        )
      )
  );
});

// ── Message ──
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
