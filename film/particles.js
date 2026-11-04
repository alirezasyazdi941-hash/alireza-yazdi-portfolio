// Alireza Yazdi · interactive scroll film. three.js particles morph through 6 shapes as you scroll (Lenis + GSAP ScrollTrigger).
import * as THREE from 'three';
const P = window.PORTFOLIO, apps = P.apps, $ = (i) => document.getElementById(i);
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------- copy ----------
const N_APPS = apps.length;
const T = {
  en: { back: '← Portfolio', hint: 'SCROLL · MOVE · CLICK', open: 'Open the phone', gh: 'GitHub',
    ch: [['Chapter 1 · Signal', 'It begins as noise.', 'Sixteen thousand points, no meaning yet. Move through them. Click to send a wave.'],
         ['Chapter 2 · Structure', 'Noise learns a shape.', 'Layers, weights and a little patience.'],
         ['Chapter 3 · Research', 'Questions start to orbit.', 'Papers, labs and ideas pulling in every direction.'],
         ['Chapter 4 · Build', 'Then it gets built.', 'Plain code, no ceremony, tested before it is trusted.'],
         ['Chapter 5 · Ship', N_APPS + ' apps. One phone.', 'Each project becomes something you can open.']],
    end: 'MSc student in Artificial Intelligence · research tools, intelligent systems and interactive web platforms.', nm: P.profile.name },
  fa: { back: '← پورتفولیو', hint: 'اسکرول · حرکت · کلیک', open: 'باز کردن گوشی', gh: 'گیت‌هاب',
    ch: [['فصل ۱ · سیگنال', 'همه‌چیز با نویز شروع می‌شود.', 'شانزده هزار نقطه، هنوز بی‌معنا. از میانشان حرکت کن. کلیک کن تا موج بفرستی.'],
         ['فصل ۲ · ساختار', 'نویز شکل می‌گیرد.', 'لایه‌ها، وزن‌ها و کمی صبر.'],
         ['فصل ۳ · پژوهش', 'پرسش‌ها دورش می‌چرخند.', 'مقاله‌ها، آزمایشگاه‌ها و ایده‌هایی که از هر طرف می‌کشند.'],
         ['فصل ۴ · ساخت', 'بعد ساخته می‌شود.', 'کد ساده، بی‌تشریفات، و آزموده پیش از اعتماد.'],
         ['فصل ۵ · انتشار', N_APPS + ' اپ. یک گوشی.', 'هر پروژه به چیزی تبدیل می‌شود که می‌توان باز کرد.']],
    end: 'دانشجوی کارشناسی ارشد هوش مصنوعی · ابزارهای پژوهشی، سامانه‌های هوشمند و پلتفرم‌های وب تعاملی.', nm: P.profile.nameFa }
};
let lang = 'en'; try { lang = localStorage.getItem('ay_lang') || (/^fa/.test(navigator.language) ? 'fa' : 'en'); } catch (e) {}
function setLang(l) {
  lang = l; try { localStorage.setItem('ay_lang', l); } catch (e) {}
  document.documentElement.lang = l; document.documentElement.dir = l === 'fa' ? 'rtl' : 'ltr';
  const t = T[l]; $('back').textContent = t.back; $('hintt').textContent = t.hint; $('b1').textContent = t.open; $('b2').textContent = t.gh; $('b2').href = P.profile.github;
  $('nm').textContent = t.nm; $('endp').textContent = t.end;
  t.ch.forEach((s, i) => { const e = $('c' + i); e.innerHTML = '<small></small><h2></h2><p></p>'; e.children[0].textContent = s[0]; e.children[1].textContent = s[1]; e.children[2].textContent = s[2]; });
}
$('lang').onclick = () => setLang(lang === 'en' ? 'fa' : 'en'); setLang(lang);

// ---------- WebGL or fallback ----------
const canvas = $('gl'); let renderer;
try { renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: 'high-performance' }); } catch (e) { renderer = null; }
if (!renderer) { document.documentElement.classList.add('nogl'); document.body.insertAdjacentHTML('beforeend', '<p style="text-align:center;padding:0 24px 60px"><a class="btn" href="classic.html">Open the classic 2D film</a></p>'); throw new Error('no webgl'); }
renderer.setClearColor(0x05060f, 1);
const mobile = matchMedia('(max-width: 700px)').matches || /Mobi|Android/i.test(navigator.userAgent);
const N = mobile ? 9000 : 16000;
renderer.setPixelRatio(Math.min(devicePixelRatio || 1, mobile ? 1.5 : 2));
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, 1, .1, 100);

// ---------- target shapes ----------
const rnd = Math.random, TAU = Math.PI * 2;
const mk = () => new Float32Array(N * 3);
function sphere(r) { const a = mk(); for (let i = 0; i < N; i++) { const u = rnd() * 2 - 1, t = rnd() * TAU, k = r * Math.cbrt(rnd()), s = Math.sqrt(1 - u * u); a.set([k * s * Math.cos(t), k * u * .8, k * s * Math.sin(t)], i * 3); } return a; }
function network() {
  const L = [5, 7, 7, 4], pos = [], xs = [-4.6, -1.5, 1.5, 4.6];
  L.forEach((n, l) => { for (let i = 0; i < n; i++) pos.push({ l, x: xs[l], y: (i - (n - 1) / 2) * 1.05 }); });
  const edges = []; pos.forEach((a) => pos.forEach((b) => { if (b.l === a.l + 1) edges.push([a, b]); }));
  const a = mk();
  for (let i = 0; i < N; i++) {
    let x, y, z = (rnd() - .5) * .5;
    if (i < N * .32) { const n = pos[i % pos.length], r = .26 * Math.sqrt(rnd()), t = rnd() * TAU; x = n.x + r * Math.cos(t); y = n.y + r * Math.sin(t); z = (rnd() - .5) * .3; }
    else { const e = edges[(rnd() * edges.length) | 0], k = rnd(); x = e[0].x + (e[1].x - e[0].x) * k; y = e[0].y + (e[1].y - e[0].y) * k; }
    a.set([x, y, z], i * 3);
  } return a;
}
function galaxy() {
  const a = mk();
  for (let i = 0; i < N; i++) {
    if (i < N * .1) { const r = Math.pow(rnd(), 2) * .9, t = rnd() * TAU, u = rnd() * 2 - 1; a.set([r * Math.cos(t), r * u * .5, r * Math.sin(t)], i * 3); continue; }
    const arm = i % 3, r = .6 + Math.pow(rnd(), .8) * 6.2, ang = arm * TAU / 3 + r * .9 + (rnd() - .5) * .5 * (1 + r * .08);
    a.set([r * Math.cos(ang), (rnd() - .5) * .35 * (1 + (6 - r) * .08), r * Math.sin(ang) * .62], i * 3);
  } return a;
}
function codeWindow() {
  const a = mk(), w = 8, h = 4.9, lines = 9, bars = [];
  for (let i = 0; i < lines; i++) bars.push({ y: h / 2 - .95 - i * .42, x0: -w / 2 + .5 + (i % 3 === 1 ? .5 : i % 3 === 2 ? 1 : 0), len: (.25 + ((i * 37) % 10) / 10 * .55) * (w - 1.8) });
  for (let i = 0; i < N; i++) {
    let x, y; const k = rnd();
    if (k < .22) { const side = (rnd() * 4) | 0, t = rnd(); if (side < 2) { x = (t - .5) * w; y = (side ? -1 : 1) * h / 2; } else { y = (t - .5) * h; x = (side === 2 ? -1 : 1) * w / 2; } }
    else if (k < .3) { x = -w / 2 + (rnd()) * w; y = h / 2 - .45 + (rnd() - .5) * .04; }
    else { const b = bars[(rnd() * lines) | 0]; x = b.x0 + rnd() * b.len; y = b.y + (rnd() - .5) * .1; }
    a.set([x, y, (rnd() - .5) * .15], i * 3);
  } return a;
}
function phone() {
  const a = mk(), pw = 3.1, ph = 6.2, rr = .45, cols = 4, rows = Math.ceil(N_APPS / cols), cell = .56, gap = .2;
  const gridW = cols * cell + (cols - 1) * gap, x0 = -gridW / 2 + cell / 2, y0 = ph / 2 - 1.25;
  const rrPoint = (t) => { // point on rounded-rect outline
    const per = 2 * (pw - 2 * rr) + 2 * (ph - 2 * rr) + TAU * rr; let d = t * per;
    const sw = pw - 2 * rr, sh = ph - 2 * rr;
    if (d < sw) return [-pw / 2 + rr + d, ph / 2];
    d -= sw; if (d < Math.PI / 2 * rr) { const q = d / rr; return [pw / 2 - rr + Math.sin(q) * rr, ph / 2 - rr + Math.cos(q) * rr]; }
    d -= Math.PI / 2 * rr; if (d < sh) return [pw / 2, ph / 2 - rr - d];
    d -= sh; if (d < Math.PI / 2 * rr) { const q = d / rr; return [pw / 2 - rr + Math.cos(q) * rr, -ph / 2 + rr - Math.sin(q) * rr]; }
    d -= Math.PI / 2 * rr; if (d < sw) return [pw / 2 - rr - d, -ph / 2];
    d -= sw; if (d < Math.PI / 2 * rr) { const q = d / rr; return [-pw / 2 + rr - Math.sin(q) * rr, -ph / 2 + rr - Math.cos(q) * rr]; }
    d -= Math.PI / 2 * rr; if (d < sh) return [-pw / 2, -ph / 2 + rr + d];
    d -= sh; const q = d / rr; return [-pw / 2 + rr - Math.cos(q) * rr, ph / 2 - rr + Math.sin(q) * rr];
  };
  for (let i = 0; i < N; i++) {
    let x, y; const k = rnd();
    if (k < .18) [x, y] = rrPoint(rnd());
    else if (k < .21) { x = (rnd() - .5) * .9; y = ph / 2 - .35 + (rnd() - .5) * .16; }
    else { const idx = (rnd() * N_APPS) | 0, c = idx % cols, r = (idx / cols) | 0; x = x0 + c * (cell + gap) + (rnd() - .5) * cell; y = y0 - r * (cell + gap * 1.5) + (rnd() - .5) * cell; }
    a.set([x, y, (rnd() - .5) * .08], i * 3);
  } return a;
}
function glyph(text) {
  const c = document.createElement('canvas'); c.width = 520; c.height = 260; const g = c.getContext('2d');
  g.fillStyle = '#fff'; g.font = '900 230px system-ui, Arial'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(text, 260, 140);
  const d = g.getImageData(0, 0, 520, 260).data, pts = [];
  for (let y = 0; y < 260; y += 2) for (let x = 0; x < 520; x += 2) if (d[(y * 520 + x) * 4 + 3] > 128) pts.push([(x - 260) / 52, -(y - 130) / 52]);
  const a = mk(); for (let i = 0; i < N; i++) { const p = pts[(rnd() * pts.length) | 0] || [0, 0]; a.set([p[0] + (rnd() - .5) * .08, p[1] + 1.7 + (rnd() - .5) * .08, (rnd() - .5) * .5], i * 3); } return a;
}
const shapes = [sphere(7.5), network(), galaxy(), codeWindow(), phone(), glyph('AY')];
const geo = new THREE.BufferGeometry();
shapes.forEach((s, i) => geo.setAttribute('t' + i, new THREE.BufferAttribute(s, 3)));
geo.setAttribute('position', new THREE.BufferAttribute(shapes[0], 3));
geo.setAttribute('aSeed', new THREE.BufferAttribute(Float32Array.from({ length: N }, rnd), 1));

const uni = { uP: { value: 0 }, uTime: { value: 0 }, uRo: { value: new THREE.Vector3() }, uRd: { value: new THREE.Vector3(0, 0, -1) }, uPtr: { value: 0 },
  uClick: { value: new THREE.Vector4(0, 0, 0, -99) }, uScale: { value: 1 } };
const mat = new THREE.ShaderMaterial({
  uniforms: uni, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  vertexShader: `
    attribute vec3 t0,t1,t2,t3,t4,t5; attribute float aSeed;
    uniform float uP,uTime,uPtr,uScale; uniform vec3 uRo,uRd; uniform vec4 uClick;
    varying vec3 vCol; varying float vA;
    vec3 pick(float i){ if(i<.5)return t0; if(i<1.5)return t1; if(i<2.5)return t2; if(i<3.5)return t3; if(i<4.5)return t4; return t5; }
    vec3 hsl(float h,float s,float l){ vec3 k=mod(vec3(0.,8.,4.)+h/30.,12.); return l-s*min(l,1.-l)*clamp(min(k-3.,9.-k),-1.,1.); }
    void main(){
      float a=floor(uP), f=uP-a; a=min(a,5.); float b=min(a+1.,5.);
      float ff=smoothstep(0.,1.,clamp(f*1.7-aSeed*.7,0.,1.));
      vec3 p=mix(pick(a),pick(b),ff);
      float sw=sin(ff*3.14159)*1.6;
      p+=sw*vec3(sin(aSeed*40.+uTime),cos(aSeed*31.+uTime*.8),sin(aSeed*53.-uTime*.6));
      p+=.045*vec3(sin(uTime*.9+aSeed*60.),cos(uTime*.7+aSeed*45.),sin(uTime*.8+aSeed*30.));
      vec3 d=p-(uRo+uRd*dot(p-uRo,uRd)); float dist=length(d);
      p+=normalize(d+1e-4)*exp(-dist*dist*.9)*uPtr*1.15;
      float r=distance(p,uClick.xyz), t=uTime-uClick.w;
      p+=normalize(p-uClick.xyz+1e-4)*exp(-pow(r-t*7.,2.)*.6)*exp(-t*1.1)*1.5;
      float st=a+ff; float hue=mix(190.,150.,clamp(st,0.,1.)); 
      if(st>1.) hue=mix(150.,265.,clamp(st-1.,0.,1.)); if(st>2.) hue=mix(265.,35.,clamp(st-2.,0.,1.));
      if(st>3.) hue=mix(35.,330.,clamp(st-3.,0.,1.)); if(st>4.) hue=mix(330.,190.,clamp(st-4.,0.,1.));
      hue+=aSeed*46.-23.+ (st>3.5&&st<4.6 ? (p.x*28.+p.y*18.) : 0.);
      float glow=exp(-dist*dist*.6)*uPtr+exp(-pow(r-t*7.,2.)*.6)*exp(-t*1.1);
      vCol=hsl(hue,.8,.62+.18*glow); vA=.55+.45*aSeed+glow;
      vec4 mv=modelViewMatrix*vec4(p,1.);
      gl_PointSize=(1.7+aSeed*1.9+glow*3.)*uScale*(11./-mv.z);
      gl_Position=projectionMatrix*mv;
    }`,
  fragmentShader: `varying vec3 vCol; varying float vA; void main(){ float d=length(gl_PointCoord-.5); if(d>.5)discard; gl_FragColor=vec4(vCol,smoothstep(.5,.0,d)*vA*.9); }`
});
scene.add(new THREE.Points(geo, mat));

// ---------- resize ----------
function resize() { const w = innerWidth, h = innerHeight; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); uni.uScale.value = Math.min(devicePixelRatio || 1, 2) * (h / 800) * (mobile ? .9 : 1); }
addEventListener('resize', resize); resize();

// ---------- pointer (hover repels, click sends a wave) ----------
const ptr = { x: 0, y: 0, tx: 0, ty: 0, on: 0, ton: 0 }; const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
function move(e) { const x = e.clientX, y = e.clientY; ptr.tx = x / innerWidth * 2 - 1; ptr.ty = -(y / innerHeight * 2 - 1); ptr.ton = 1; const gl = $('glow'); gl.style.opacity = 1; gl.style.transform = `translate(${x}px,${y}px)`; }
addEventListener('pointermove', move, { passive: true });
addEventListener('pointerleave', () => { ptr.ton = 0; $('glow').style.opacity = 0; });
addEventListener('pointerup', (e) => { if (e.target.closest('a,button')) return; move(e); ndc.set(ptr.tx, ptr.ty); ray.setFromCamera(ndc, camera); const hit = ray.ray.origin.clone().add(ray.ray.direction.clone().multiplyScalar(-ray.ray.origin.z / ray.ray.direction.z)); uni.uClick.value.set(hit.x, hit.y, 0, clock.t); if (e.pointerType === 'touch') setTimeout(() => { ptr.ton = 0; }, 400); });
const clock = { t: 0 };

// ---------- scroll: Lenis + ScrollTrigger ----------
gsap.registerPlugin(ScrollTrigger);
const lenis = new Lenis({ lerp: reduced ? 1 : .085, smoothWheel: !reduced });
lenis.on('scroll', ScrollTrigger.update); gsap.ticker.add((t) => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0);
let prog = 0;
ScrollTrigger.create({ trigger: '#track', start: 'top top', end: 'bottom bottom', onUpdate: (s) => { prog = s.progress; } });
const stageAt = [0, .17, .37, .57, .77, .95]; // progress where each shape is fully formed
function toP(p) { for (let i = 0; i < 5; i++) if (p < stageAt[i + 1]) return i + clamp((p - stageAt[i]) / (stageAt[i + 1] - stageAt[i])) ; return 5; }
const win = [[-1, 0, .1, .14], [.14, .17, .3, .34], [.34, .37, .5, .54], [.54, .57, .7, .74], [.74, .77, .88, .92]];
const chs = [0, 1, 2, 3, 4].map((i) => $('c' + i)), endEl = $('end'), bar = $('bar'), hint = $('hint');
const dots = $('dots'); for (let i = 0; i < 6; i++) { const b = document.createElement('button'); b.setAttribute('aria-label', 'Chapter ' + (i + 1)); b.onclick = () => lenis.scrollTo(stageAt[i] * (document.documentElement.scrollHeight - innerHeight) + (i === 5 ? 0 : 0), { duration: 1.6 }); dots.append(b); }
const camKeys = [[0, 0, 15], [0, 0, 12], [0, 4.5, 12.5], [0, 0, 11.5], [0, 0, 11], [0, 0, 13]];
const smooth = { p: 0, yaw: 0, pitch: 0 };

function frame(ms) {
  const t = ms / 1000; clock.t = t; uni.uTime.value = t;
  smooth.p += (prog - smooth.p) * (reduced ? 1 : .09);
  const sp = toP(smooth.p); uni.uP.value = sp;
  const a = Math.min(Math.floor(sp), 4), f = sp - a, e = f * f * (3 - 2 * f), k0 = camKeys[a], k1 = camKeys[a + 1];
  const fit = Math.max(1, .9 / camera.aspect);
  ptr.x += (ptr.tx - ptr.x) * .08; ptr.y += (ptr.ty - ptr.y) * .08; ptr.on += (ptr.ton - ptr.on) * .1;
  const yaw = Math.sin(smooth.p * 6.283 * .6) * .35 + ptr.x * .18, pitch = (k0[1] + (k1[1] - k0[1]) * e) * .06 - ptr.y * .1;
  const z = (k0[2] + (k1[2] - k0[2]) * e) * fit, cy = k0[1] + (k1[1] - k0[1]) * e;
  camera.position.set(Math.sin(yaw) * z, cy * .5 + Math.sin(pitch) * z, Math.cos(yaw) * z); camera.lookAt(0, -.75, 0);
  ndc.set(ptr.x, ptr.y); ray.setFromCamera(ndc, camera); uni.uRo.value.copy(ray.ray.origin); uni.uRd.value.copy(ray.ray.direction); uni.uPtr.value = ptr.on;
  renderer.render(scene, camera);
  bar.style.transform = 'scaleX(' + smooth.p + ')';
  chs.forEach((c, i) => { const w = win[i]; c.classList.toggle('on', prog > w[0] && prog < w[3]); });
  const ee = prog > .955; endEl.classList.toggle('on', ee); hint.style.opacity = prog < .02 ? 1 : 0;
  [...dots.children].forEach((d, i) => d.classList.toggle('on', Math.round(sp) === i));
}
renderer.setAnimationLoop(frame);
window.__film = { // test hook: render now and count lit pixels
  probe(p) { prog = smooth.p = p; frame(performance.now()); const gl = renderer.getContext(), w = gl.drawingBufferWidth, h = gl.drawingBufferHeight, px = new Uint8Array(w * h * 4); gl.readPixels(0, 0, w, h, gl.RGBA, gl.UNSIGNED_BYTE, px); let n = 0; for (let i = 0; i < px.length; i += 4 * 17) if (px[i] + px[i + 1] + px[i + 2] > 120) n++; return n; },
  N, get on() { return chs.map((c) => c.classList.contains('on')); }, get end() { return endEl.classList.contains('on'); }
};
