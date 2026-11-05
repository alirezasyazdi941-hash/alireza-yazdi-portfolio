/* ZipView service worker (Alireza Yazdi build): serves files of an opened .zip from the ZipView page.
   URL shape: <scope>_v/<sessionId>/<path inside zip>. Nothing is cached or sent over the network. */
'use strict';
const BASE = new URL('./_v/', self.registration.scope).pathname;
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

async function owner() {
  const all = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
  return all.find((c) => !new URL(c.url).pathname.startsWith(BASE)) || null;
}
function ask(client, msg) {
  return new Promise((resolve) => {
    const ch = new MessageChannel(); const t = setTimeout(() => resolve(null), 20000);
    ch.port1.onmessage = (ev) => { clearTimeout(t); resolve(ev.data); };
    client.postMessage(msg, [ch.port2]);
  });
}
self.addEventListener('fetch', (e) => {
  const req = e.request; if (req.method !== 'GET') return;
  const url = new URL(req.url); if (url.origin !== location.origin) return;
  let path = url.pathname, sid = null;
  if (path.startsWith(BASE)) { const rest = path.slice(BASE.length), i = rest.indexOf('/'); sid = rest.slice(0, i); path = rest.slice(i + 1); }
  else if (req.referrer) {
    // site built with absolute paths ("/assets/x.js"): remap using the page that asked for it
    const r = new URL(req.referrer);
    if (r.origin === location.origin && r.pathname.startsWith(BASE)) { const rest = r.pathname.slice(BASE.length); sid = rest.slice(0, rest.indexOf('/')); path = path.replace(/^\//, ''); }
  }
  if (!sid) return;
  e.respondWith((async () => {
    const c = await owner();
    if (!c) return new Response('ZipView page is closed. Reopen it and choose the zip again.', { status: 503 });
    const r = await ask(c, { type: 'get', sid, path: decodeURIComponent(path) });
    if (!r || !r.ok) return new Response((r && r.error) || 'Not found in zip', { status: 404 });
    return new Response(r.body, { status: 200, headers: { 'Content-Type': r.mime, 'Cache-Control': 'no-store' } });
  })());
});
