/* Holographic console: module tiles, app windows (iframes), About panel, EN/FA toggle, ambient HUD canvases. No dependencies. */
(function () {
  'use strict';
  var D = window.PORTFOLIO, $ = function (id) { return document.getElementById(id); };
  var lang = 'en';
  try { var s = localStorage.getItem('ay-lang'); if (s === 'fa' || s === 'en') lang = s; } catch (e) {}
  var qs = new URLSearchParams(location.search); if (qs.get('lang') === 'fa' || qs.get('lang') === 'en') lang = qs.get('lang');

  var GLYPH = {
    path: '<path d="M4 19c4-1 3-6 8-6s4-7 8-8"/><circle cx="4" cy="19" r="1.6"/><circle cx="20" cy="5" r="1.6"/>',
    scan: '<path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3"/><path d="M8 9h8M8 12h8M8 15h5"/>',
    film: '<rect x="3.5" y="5" width="17" height="14" rx="2"/><path d="M8 5v14M16 5v14M3.5 9.5H8M16 9.5h4.5M3.5 14.5H8M16 14.5h4.5"/>',
    atom: '<circle cx="12" cy="12" r="1.6"/><ellipse cx="12" cy="12" rx="9" ry="3.8"/><ellipse cx="12" cy="12" rx="9" ry="3.8" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="9" ry="3.8" transform="rotate(120 12 12)"/>',
    reel: '<circle cx="12" cy="12" r="8.500"/><circle cx="12" cy="12" r="1.800"/><circle cx="12" cy="6.800" r="1.400"/><circle cx="12" cy="17.200" r="1.400"/><circle cx="6.800" cy="12" r="1.400"/><circle cx="17.200" cy="12" r="1.400"/>',
    cube: '<path d="M12 3 20 7.500v9L12 21 4 16.500v-9z"/><path d="m4 7.500 8 4.500 8-4.500M12 12v9"/>',
    cap: '<path d="m2.500 9 9.500-4.500L21.500 9 12 13.500z"/><path d="M6.500 11.200v4.500c0 1.300 2.500 2.800 5.500 2.800s5.500-1.500 5.500-2.800v-4.500M21.500 9v5.500"/>',
    user: '<circle cx="12" cy="8" r="3.6"/><path d="M5 20c1-4 4-5.5 7-5.5s6 1.5 7 5.5"/>',
    git: '<path d="M9 19c-4 1.3-4-2-6-2.5m12 4.5v-3a2.6 2.6 0 0 0-.7-2c2.800-.3 5.700-1.400 5.700-6.200A4.800 4.800 0 0 0 18.700 6.800 4.500 4.500 0 0 0 18.600 3.500S17.500 3.200 15 5a12 12 0 0 0-6 0C6.500 3.200 5.400 3.500 5.400 3.500a4.500 4.500 0 0 0-.1 3.300A4.800 4.800 0 0 0 4 10.300c0 4.800 2.900 5.900 5.700 6.200a2.600 2.600 0 0 0-.7 2v3"/>',
    mail: '<rect x="3" y="5.5" width="18" height="13" rx="2"/><path d="m4 7.500 8 6 8-6"/>'
  };
  function icon(g, h, label, extra) {
    var b = document.createElement(extra && extra.href ? 'a' : 'button'); b.className = 'app';
    if (extra && extra.href) { b.href = extra.href; if (extra.href.indexOf('http') === 0) { b.target = '_blank'; b.rel = 'noopener'; } } else b.type = 'button';
    var c1 = 'hsl(' + h[0] + ' 75% 58%)', c2 = 'hsl(' + h[1] + ' 80% 42%)';
    b.style.setProperty('--h', c1);
    b.innerHTML = '<div class="ico" style="background:linear-gradient(145deg,' + c1 + ',' + c2 + ')"><svg viewBox="0 0 24 24" aria-hidden="true">' + GLYPH[g] + '</svg></div><span></span>';
    b.querySelector('span').textContent = label; b.setAttribute('aria-label', label); return b;
  }
  var CATS = [['all', { en: 'All', fa: 'همه' }], ['ai', { en: 'AI', fa: 'هوش مصنوعی' }], ['research', { en: 'Research', fa: 'پژوهش' }], ['web', { en: 'Web', fa: 'وب' }], ['tools', { en: 'Tools', fa: 'ابزار' }]];
  var cat = 'all';

  var grid = $('grid'), dock = $('dock'), home = $('home'), win = $('win'), wbody = $('wbody'), loading = $('loading');
  var current = null;

  function t(o) { return o[lang]; }
  function ui(k) { return D.ui[lang][k]; }

  function build() {
    var w = $('widget'); w.textContent = '';
    var sm = document.createElement('small'); sm.textContent = ui('projects') + ' · ' + D.apps.length;
    var bb = document.createElement('b'); bb.textContent = lang === 'fa' ? D.profile.nameFa : D.profile.name;
    var pp = document.createElement('p'); pp.textContent = t(D.profile.role); w.append(sm, bb, pp);
    var cats = $('cats'); cats.textContent = '';
    CATS.forEach(function (c) {
      var b = document.createElement('button'); b.type = 'button'; b.className = 'cat' + (cat === c[0] ? ' on' : ''); b.textContent = c[1][lang]; b.dataset.cat = c[0];
      b.addEventListener('click', function () { cat = c[0]; build(); }); cats.appendChild(b);
    });
    grid.textContent = ''; dock.textContent = '';
    D.apps.filter(function (a) { return cat === 'all' || a.cat === cat; }).forEach(function (a) {
      var el = icon(a.glyph, a.hue, t(a.name)); el.dataset.id = a.id; el.classList.add('tile');
      var sm2 = document.createElement('small'); sm2.textContent = (a.tech || []).slice(0, 2).join(' · '); el.appendChild(sm2);
      el.addEventListener('click', function () { openApp(a, el); }); grid.appendChild(el);
    });
    var about = icon('user', [250, 210], ui('about')); about.dataset.id = 'about';
    about.addEventListener('click', function () { openAbout(about); });
    dock.appendChild(about);
    dock.appendChild(icon('git', [220, 240], ui('github'), { href: D.profile.github }));
    dock.appendChild(icon('mail', [200, 170], ui('mail'), { href: 'mailto:' + D.profile.email }));
  }

  function applyText() {
    var p = D.profile;
    document.documentElement.lang = lang; document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
    $('name').textContent = lang === 'fa' ? p.nameFa : p.name;
    document.querySelectorAll('[data-k]').forEach(function (e) { e.textContent = t(p[e.dataset.k]); });
    document.querySelectorAll('[data-u]').forEach(function (e) { e.textContent = ui(e.dataset.u); });
    $('ctaGit').href = p.github; $('mailLink').href = 'mailto:' + p.email; $('mailLink').textContent = p.email;
    $('winClose').setAttribute('aria-label', ui('close')); $('winFull').setAttribute('aria-label', ui('openFull')); loading.textContent = ui('loading');
    $('lang').textContent = lang === 'fa' ? 'FA · EN' : 'EN · فا';
    build();
    if (current && current.kind === 'about') renderAbout();
  }

  function showWindow(title) {
    $('winTitle').textContent = title; win.hidden = false; win.classList.remove('closing'); home.classList.add('away'); $('device').classList.add('open');
  }
  function openApp(a, origin) {
    current = { kind: 'app', app: a, origin: origin };
    showWindow(t(a.name));
    wbody.className = 'wbody'; wbody.textContent = ''; loading.className = 'loading'; loading.textContent = ui('loading'); wbody.appendChild(loading);
    var f = document.createElement('iframe'); f.title = t(a.name); f.loading = 'lazy';
    f.setAttribute('allow', 'camera; microphone; clipboard-write; fullscreen; autoplay');
    f.addEventListener('load', function () { loading.classList.add('done'); });
    f.src = a.path; wbody.appendChild(f);
    $('winFull').href = a.path; $('winFull').hidden = false; location.hash = a.id;
  }
  function renderAbout() {
    var p = D.profile, rtl = lang === 'fa';
    wbody.className = 'wbody about'; wbody.textContent = '';
    var c = document.createElement('div'); c.className = 'about-card'; if (rtl) c.dir = 'rtl';
    function el(tag, txt, cls) { var e = document.createElement(tag); if (txt) e.textContent = txt; if (cls) e.className = cls; return e; }
    c.appendChild(el('div', 'AY', 'avatar')); c.appendChild(el('h2', rtl ? p.nameFa : p.name));
    c.appendChild(el('p', t(p.role))); c.appendChild(el('p', t(p.affiliation)));
    c.appendChild(el('h3', ui('interests'))); var ch = el('div', '', 'chips'); t(p.interests).forEach(function (x) { ch.appendChild(el('span', x)); }); c.appendChild(ch);
    c.appendChild(el('h3', ui('projects')));
    D.apps.forEach(function (a) { var d = el('div', '', 'proj'); d.appendChild(el('b', t(a.name))); d.appendChild(el('small', a.tech.join(' · '))); c.appendChild(d); });
    c.appendChild(el('h3', ui('contact')));
    var m = el('p'); var ma = el('a', p.email); ma.href = 'mailto:' + p.email; m.appendChild(ma); c.appendChild(m);
    var g = el('p'); var ga = el('a', p.github.replace('https://', '')); ga.href = p.github; ga.target = '_blank'; ga.rel = 'noopener'; g.appendChild(ga); c.appendChild(g);
    wbody.appendChild(c);
  }
  function openAbout(origin) {
    current = { kind: 'about', origin: origin }; showWindow(ui('about')); renderAbout(); $('winFull').hidden = true; location.hash = 'about';
  }
  function closeWindow() {
    if (win.hidden) return;
    win.classList.add('closing'); home.classList.remove('away'); $('device').classList.remove('open');
    setTimeout(function () { win.hidden = true; wbody.textContent = ''; win.classList.remove('closing'); current = null; }, 240);
    if (location.hash) history.replaceState(null, '', location.pathname + location.search);
  }
  $('indicator').addEventListener('click', closeWindow); $('winClose').addEventListener('click', closeWindow);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeWindow(); });
  $('lang').addEventListener('click', function () { lang = lang === 'en' ? 'fa' : 'en'; try { localStorage.setItem('ay-lang', lang); } catch (e) {} applyText(); });


  /* ---------- ambient HUD canvases (decorative; no data is implied) ---------- */
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function fit(c) { var r = c.getBoundingClientRect(), d = Math.min(window.devicePixelRatio || 1, 2); c.width = Math.max(2, Math.round(r.width * d)); c.height = Math.max(2, Math.round(r.height * d)); return c.getContext('2d'); }
  var cv = { chart: $('cvChart'), wave: $('cvWave'), pyr: $('cvPyr'), sph: $('cvSph') }, ctx = {};
  function sizeAll() { for (var k in cv) if (cv[k]) ctx[k] = fit(cv[k]); }
  var PTS = [.08, .16, .12, .26, .2, .34, .3, .48, .42, .6, .56, .78, .9];
  function drawChart(g, W, H, p) {
    g.clearRect(0, 0, W, H); g.strokeStyle = '#46a9ff22'; g.lineWidth = 1;
    for (var i = 1; i < 6; i++) { g.beginPath(); g.moveTo(0, H * i / 6); g.lineTo(W, H * i / 6); g.stroke(); g.beginPath(); g.moveTo(W * i / 6, 0); g.lineTo(W * i / 6, H); g.stroke(); }
    g.strokeStyle = '#6fe3ff55'; g.lineWidth = 2; g.beginPath(); g.ellipse(W * .5, H * 1.55, W * .72, H * .85, 0, Math.PI * 1.08, Math.PI * 1.92); g.stroke();
    var n = Math.max(2, Math.floor(PTS.length * p)), x0 = W * .06, x1 = W * .94, yb = H * .86, yh = H * .62;
    g.strokeStyle = '#8fe9ff'; g.lineWidth = 2.2 * (W / 700 + .5); g.shadowColor = '#6fe3ff'; g.shadowBlur = 12; g.beginPath();
    for (var j = 0; j < n; j++) { var x = x0 + (x1 - x0) * j / (PTS.length - 1), y = yb - yh * PTS[j]; j ? g.lineTo(x, y) : g.moveTo(x, y); }
    g.stroke(); g.shadowBlur = 0;
    var lx = x0 + (x1 - x0) * (n - 1) / (PTS.length - 1), ly = yb - yh * PTS[n - 1]; g.fillStyle = '#fff'; g.beginPath(); g.arc(lx, ly, 4 * (W / 700 + .5), 0, 7); g.fill();
  }
  function drawWave(g, W, H, t) {
    g.clearRect(0, 0, W, H); g.fillStyle = '#6fe3ffcc';
    for (var x = 0; x < W; x += W / 46) for (var k = 0; k < 3; k++) { var y = H / 2 + Math.sin(x / W * 9 + t * 1.4 + k * .7) * H * (.18 + k * .06); g.globalAlpha = .9 - k * .25; g.fillRect(x, y, 2.2, 2.2); }
    g.globalAlpha = 1;
  }
  function rot(x, y, z, a, b) { var c = Math.cos(a), s = Math.sin(a), x1 = x * c + z * s, z1 = -x * s + z * c, c2 = Math.cos(b), s2 = Math.sin(b); return [x1, y * c2 - z1 * s2, y * s2 + z1 * c2]; }
  function drawPyr(g, W, H, t) {
    g.clearRect(0, 0, W, H); var V = [[0, -1, 0], [-1, .8, -1], [1, .8, -1], [1, .8, 1], [-1, .8, 1]], E = [[0, 1], [0, 2], [0, 3], [0, 4], [1, 2], [2, 3], [3, 4], [4, 1]], s = Math.min(W, H) * .3;
    var P = V.map(function (v) { var r = rot(v[0], v[1], v[2], t * .8, .35); return [W / 2 + r[0] * s, H / 2 + r[1] * s]; });
    g.strokeStyle = '#8fe9ff'; g.lineWidth = 1.6; g.shadowColor = '#6fe3ff'; g.shadowBlur = 8; E.forEach(function (e) { g.beginPath(); g.moveTo(P[e[0]][0], P[e[0]][1]); g.lineTo(P[e[1]][0], P[e[1]][1]); g.stroke(); }); g.shadowBlur = 0;
  }
  var SPH = []; for (var q = 0; q < 260; q++) { var yy = 1 - 2 * q / 259, rr = Math.sqrt(1 - yy * yy), th = q * 2.39996; SPH.push([Math.cos(th) * rr, yy, Math.sin(th) * rr]); }
  function drawSph(g, W, H, t) {
    g.clearRect(0, 0, W, H); var s = Math.min(W, H) * .36;
    SPH.forEach(function (p) { var r = rot(p[0], p[1], p[2], t * .5, .3), a = .25 + .75 * (r[2] + 1) / 2; g.fillStyle = 'rgba(143,233,255,' + a.toFixed(2) + ')'; g.fillRect(W / 2 + r[0] * s, H / 2 + r[1] * s, 2, 2); });
  }
  var visible = true, t0 = performance.now();
  if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { visible = es[0].isIntersecting; }).observe($('device'));
  function loop(now) {
    var t = (now - t0) / 1000;
    if (visible) {
      if (ctx.chart) drawChart(ctx.chart, cv.chart.width, cv.chart.height, reduce ? 1 : Math.min(1, t / 4.5));
      if (ctx.wave) drawWave(ctx.wave, cv.wave.width, cv.wave.height, reduce ? 0 : t);
      if (ctx.pyr) drawPyr(ctx.pyr, cv.pyr.width, cv.pyr.height, reduce ? 0 : t);
      if (ctx.sph) drawSph(ctx.sph, cv.sph.width, cv.sph.height, reduce ? 0 : t);
    }
    if (!reduce) requestAnimationFrame(loop);
  }
  sizeAll(); window.addEventListener('resize', function () { sizeAll(); if (reduce) loop(performance.now() + 5000); });
  requestAnimationFrame(loop);
  /* gentle pointer tilt */
  var dev = $('device');
  if (!reduce) document.addEventListener('pointermove', function (e) {
    if (dev.classList.contains('open') || innerWidth < 760) return;
    var x = e.clientX / innerWidth - .5, y = e.clientY / innerHeight - .5;
    dev.style.setProperty('--ry', (-9 + x * 7).toFixed(2) + 'deg'); dev.style.setProperty('--rx', (3 - y * 4).toFixed(2) + 'deg');
  }, { passive: true });

  applyText();
  var h = location.hash.slice(1);
  if (h) setTimeout(function () { var b = document.querySelector('.app[data-id="' + h.replace(/[^\w-]/g, '') + '"]'); if (b) b.click(); }, 300);
})();
