// ============================================================
// SERVICE WORKER - MenControl Pro v1.0.3
// Cache name phải khớp với AppVersion.VERSION trong version.js
// Mỗi khi tăng version → SW cũ bị xóa → cache mới được tạo
// ============================================================

const VERSION    = '1.0.3';
const CACHE_NAME = `mencontrol-v${VERSION}`;

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './css/style.css',
  './js/version.js',
  './js/auth.js',
  './js/storage.js',
  './js/kegel-timer.js',
  './js/simulation.js',
  './js/app.js',
  './manifest.json'
];

// ── Install: cache tất cả assets ──
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS_TO_CACHE))
      .then(() => self.skipWaiting())
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
  // Bỏ qua các request không phải GET
  if (event.request.method !== 'GET') return;

  // Bỏ qua cross-origin requests (fonts, APIs...)
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Cache lại response mới nhất
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone));
        }
        return response;
      })
      .catch(() => {
        // Offline: dùng cache
        return caches.match(event.request)
          .then(cached => cached || caches.match('./index.html'));
      })
  );
});

// ── Message: nhận lệnh skipWaiting từ client ──
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
