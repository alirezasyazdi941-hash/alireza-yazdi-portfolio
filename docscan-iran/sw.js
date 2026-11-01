/* generated */
const CACHE = 'docscan-1b4b98bb19';
const CORE = ["./app.js","./apple-touch-icon.png","./favicon-48.png","./icon-192.png","./icon-512.png","./icon-maskable-512.png","./","./manifest.webmanifest","./style.css","./vazirmatn-arabic-300-normal.woff2","./vazirmatn-arabic-400-normal.woff2","./vazirmatn-arabic-500-normal.woff2","./vazirmatn-arabic-600-normal.woff2","./vazirmatn-arabic-700-normal.woff2","./vazirmatn-arabic-800-normal.woff2","./vazirmatn-arabic-900-normal.woff2","./vazirmatn-latin-400-normal.woff2","./vazirmatn-latin-700-normal.woff2"];
const BIG = ["./opencv.js"];
self.addEventListener('install', (e) => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    await c.addAll(CORE);
    await Promise.all(BIG.map((u) => c.add(u).catch(() => {})));
    await self.skipWaiting();
  })());
});
self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k !== CACHE && k.startsWith('docscan-')) await caches.delete(k);
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith((async () => {
    const c = await caches.open(CACHE);
    const hit = await c.match(req, {ignoreSearch: true});
    if (hit) return hit;
    try {
      const res = await fetch(req);
      if (res.ok) c.put(req, res.clone());
      return res;
    } catch (err) {
      if (req.mode === 'navigate') return (await c.match('./')) || Response.error();
      throw err;
    }
  })());
});
