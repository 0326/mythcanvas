/* MythCanvas Service Worker — 安全离线壳
 * 策略：
 * - 导航请求：网络优先，失败回退缓存（app shell 感）
 * - API/媒体：网络优先，绝不返回陈旧生成的壁纸
 * - 静态壳：预缓存 favicon / manifest
 */
const SHELL = '/';
const PRECACHE = ['/', '/favicon.svg', '/manifest.webmanifest'];
const CACHE = 'mythcanvas-shell-v2';

self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(CACHE).then((cache) => cache.addAll(PRECACHE)).catch(() => {}),
      self.skipWaiting(),
    ])
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))),
      self.clients.claim(),
    ])
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET') return;
  // API 与媒体：网络优先，不缓存动态内容
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/media/')) return;

  // 导航：网络优先，离线回退壳
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(SHELL))
    );
    return;
  }

  // 其他：缓存优先，后台更新
  event.respondWith(
    (async () => {
      const cached = await caches.match(event.request);
      const refresh = fetch(event.request).then(async (response) => {
        const cacheControl = response.headers.get('cache-control') ?? '';
        if (
          response.status === 200
          && url.origin === self.location.origin
          && !cacheControl.includes('no-store')
        ) {
          const cache = await caches.open(CACHE);
          await cache.put(event.request, response.clone());
        }
        return response;
      });

      if (cached) {
        event.waitUntil(refresh.then(() => undefined).catch(() => undefined));
        return cached;
      }

      return refresh;
    })()
  );
});
