'use strict';
// End-to-end smoke test: serves the site statically and drives it with Chromium.
const http = require('http'), fs = require('fs'), path = require('path'), assert = require('assert');
const { chromium } = require('playwright');
const ROOT = path.resolve(__dirname, '..');
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2', '.woff': 'font/woff', '.webmanifest': 'application/manifest+json', '.ico': 'image/x-icon' };
const srv = http.createServer((q, r) => {
  let p = decodeURIComponent(new URL(q.url, 'http://x').pathname); if (p.endsWith('/')) p += 'index.html';
  const f = path.join(ROOT, p); if (!f.startsWith(ROOT)) { r.writeHead(403); return r.end(); }
  fs.readFile(f, (e, b) => { if (e) { r.writeHead(404); return r.end('nf'); } r.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' }); r.end(b); });
});
const ok = (m) => console.log('  ✔', m);
(async () => {
  await new Promise((r) => srv.listen(0, r)); const base = 'http://localhost:' + srv.address().port + '/';
  const br = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const errors = [];
  const ctx = await br.newContext({ viewport: { width: 1360, height: 860 } });
  const pg = await ctx.newPage();
  pg.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  pg.on('console', (m) => { if (m.type() === 'error' && !/favicon|Failed to load resource/.test(m.text())) errors.push('console: ' + m.text()); });
  pg.on('requestfailed', (r) => { if (!/accounts\.google\.com\/gsi\/client/.test(r.url())) errors.push('reqfail: ' + r.url()); }); // optional Google sign-in script in Universal Code Hub (offline sandbox)
  await pg.goto(base); await pg.waitForSelector('#grid .app');
  assert.strictEqual(await pg.locator("#grid .app").count(), 14); ok('home screen shows 14 project apps');
  assert.strictEqual(await pg.locator('#dock .app').count(), 3); ok('dock: About, GitHub, Email');
  const gl = await pg.evaluate(() => ({ ready: !!window.__galaxyReady, fallback: document.documentElement.classList.contains('no-webgl') }));
  assert(gl.ready || gl.fallback); ok(gl.ready ? 'WebGL galaxy rendering' : 'galaxy fell back to CSS (no WebGL in this browser)');
  await pg.screenshot({ path: '/tmp/claude-0/portfolio-desktop.png' });

  for (const id of ['alireza-path', 'docscan-iran', 'storyframe', 'research-os', 'void-cinema', 'webgl-studio', 'uni-command', 'ai-lab', 'academic-intelligence', 'ali-english-academy', 'ghahar', 'reality-forge', 'site-os', 'universal-code-hub']) {
    await pg.locator(`#grid .app[data-id="${id}"]`).dispatchEvent("click");
    const fr = await pg.waitForSelector('#wbody iframe', { state: 'attached' }); const frame = await fr.contentFrame();
    await frame.waitForLoadState('load'); await pg.waitForFunction(() => document.getElementById('loading').classList.contains('done'));
    await pg.waitForTimeout(id === 'docscan-iran' ? 2500 : 1200);
    const len = await frame.evaluate(() => document.body.innerText.trim().length);
    assert(len > 40, id + ' rendered too little text: ' + len); ok(id + ' loads inside the phone (' + len + ' chars of content)');
    await pg.screenshot({ path: `/tmp/claude-0/portfolio-${id}.png` });
    await pg.locator("#indicator").dispatchEvent("click"); await pg.waitForSelector('#win', { state: 'hidden' });
    assert.strictEqual(await pg.locator('#wbody iframe').count(), 0);
  }
  ok('home indicator closes each app and frees the iframe');

  await pg.locator("#dock .app[data-id=about]").dispatchEvent("click"); await pg.waitForSelector('.about-card');
  assert((await pg.textContent('.about-card')).includes('Alireza Yazdi')); await pg.screenshot({ path: '/tmp/claude-0/portfolio-about.png' }); ok('About panel shows the name');
  await pg.keyboard.press('Escape'); await pg.waitForSelector('#win', { state: 'hidden' });

  await pg.click('#lang'); assert.strictEqual(await pg.getAttribute('html', 'dir'), 'rtl');
  assert((await pg.textContent('#name')).includes('علیرضا یزدی')); ok('Persian mode: RTL and Persian name'); await pg.click('#lang');

  const m = await br.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const mp = await m.newPage(); mp.on('pageerror', (e) => errors.push('mobile pageerror: ' + e.message));
  await mp.goto(base); await mp.waitForSelector('#grid .app');
  const over = await mp.evaluate(() => document.documentElement.scrollWidth - innerWidth); assert(over <= 1, 'horizontal overflow ' + over); ok('mobile: no horizontal overflow');
  await mp.screenshot({ path: '/tmp/claude-0/portfolio-mobile.png' });

  assert.deepStrictEqual(errors, [], 'errors:\n' + errors.join('\n')); ok('no page errors, console errors or failed requests');
  console.log('\nAll site tests passed'); await br.close(); srv.close(); process.exit(0);
})().catch((e) => { console.error('FAIL', e.message); process.exit(1); });
