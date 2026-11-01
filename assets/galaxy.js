/* In-house WebGL spiral galaxy (no dependencies). Points are placed on spiral arms
   and rotated in the vertex shader; a sparse star shell adds depth. */
(function () {
  'use strict';
  var canvas = document.getElementById('galaxy');
  var gl = canvas && (canvas.getContext('webgl', { antialias: false, alpha: true, premultipliedAlpha: false }) || canvas.getContext('experimental-webgl'));
  if (!gl) { document.documentElement.classList.add('no-webgl'); return; }

  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var small = Math.min(innerWidth, innerHeight) < 700 || (navigator.hardwareConcurrency || 8) <= 4;
  var N = small ? 22000 : 60000, STARS = small ? 700 : 1600;

  var vs = [
    'attribute vec3 aPos;attribute vec3 aColor;attribute float aSize;attribute float aSeed;attribute float aType;',
    'uniform mat4 uMVP;uniform float uTime;uniform float uScale;uniform float uSpin;',
    'varying vec3 vColor;varying float vAlpha;',
    'void main(){',
    '  vec3 p=aPos;float a=1.0;',
    '  if(aType<0.5){',
    '    float r=length(p.xz);float ang=atan(p.z,p.x)+uTime*uSpin*0.12;',
    '    p.x=cos(ang)*r;p.z=sin(ang)*r;',
    '  }else{ a=0.55+0.45*sin(uTime*1.3+aSeed*40.0); }',
    '  vec4 pos=uMVP*vec4(p,1.0);gl_Position=pos;',
    '  gl_PointSize=max(1.0,aSize*uScale/pos.w);vColor=aColor;vAlpha=a;',
    '}'].join('\n');
  var fs = [
    'precision mediump float;varying vec3 vColor;varying float vAlpha;',
    'void main(){float d=length(gl_PointCoord-0.5);if(d>0.5)discard;',
    'float s=pow(1.0-d*2.0,2.0);gl_FragColor=vec4(vColor,s*vAlpha*0.75);}'].join('\n');

  function sh(t, s) { var o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(o)); return o; }
  var prog;
  try {
    prog = gl.createProgram(); gl.attachShader(prog, sh(gl.VERTEX_SHADER, vs)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(prog); if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
  } catch (e) { console.warn('galaxy disabled:', e.message); document.documentElement.classList.add('no-webgl'); return; }
  gl.useProgram(prog);

  /* geometry: [x,y,z, r,g,b, size, seed, type] */
  var STRIDE = 9, data = new Float32Array((N + STARS) * STRIDE), i, o = 0;
  var R = 6, branches = 4, twist = 1.25, rand = Math.random;
  var inner = [1.0, 0.72, 0.45], outer = [0.42, 0.45, 1.0];
  for (i = 0; i < N; i++) {
    var r = Math.pow(rand(), 1.25) * R + 0.05;
    var b = (i % branches) / branches * Math.PI * 2 + r * twist;
    var spread = Math.pow(rand(), 2.4) * (r * 0.32 + 0.12);
    var rx = (rand() < .5 ? -1 : 1) * spread * (rand() + .2), ry = (rand() < .5 ? -1 : 1) * spread * .35 * rand(), rz = (rand() < .5 ? -1 : 1) * spread * (rand() + .2);
    var t = r / R;
    data[o++] = Math.cos(b) * r + rx; data[o++] = ry; data[o++] = Math.sin(b) * r + rz;
    data[o++] = inner[0] + (outer[0] - inner[0]) * t; data[o++] = inner[1] + (outer[1] - inner[1]) * t; data[o++] = inner[2] + (outer[2] - inner[2]) * t;
    data[o++] = 1.2 + rand() * 2.4; data[o++] = rand(); data[o++] = 0;
  }
  for (i = 0; i < STARS; i++) {
    var u = rand() * 2 - 1, th = rand() * Math.PI * 2, rad = 14 + rand() * 30, s = Math.sqrt(1 - u * u);
    data[o++] = rad * s * Math.cos(th); data[o++] = rad * u; data[o++] = rad * s * Math.sin(th);
    var w = .7 + rand() * .3; data[o++] = w; data[o++] = w; data[o++] = 1;
    data[o++] = 1 + rand() * 1.8; data[o++] = rand(); data[o++] = 1;
  }
  var buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  [['aPos', 3, 0], ['aColor', 3, 3], ['aSize', 1, 6], ['aSeed', 1, 7], ['aType', 1, 8]].forEach(function (a) {
    var l = gl.getAttribLocation(prog, a[0]); gl.enableVertexAttribArray(l); gl.vertexAttribPointer(l, a[1], gl.FLOAT, false, STRIDE * 4, a[2] * 4);
  });
  var uMVP = gl.getUniformLocation(prog, 'uMVP'), uTime = gl.getUniformLocation(prog, 'uTime'), uScale = gl.getUniformLocation(prog, 'uScale'), uSpin = gl.getUniformLocation(prog, 'uSpin');
  gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE); gl.clearColor(0, 0, 0, 0);

  /* minimal mat4 (column-major) */
  function mul(a, b) { var m = new Float32Array(16); for (var c = 0; c < 4; c++) for (var r = 0; r < 4; r++) { var s = 0; for (var k = 0; k < 4; k++) s += a[k * 4 + r] * b[c * 4 + k]; m[c * 4 + r] = s; } return m; }
  function persp(f, asp, n, fa) { var t = 1 / Math.tan(f / 2), m = new Float32Array(16); m[0] = t / asp; m[5] = t; m[10] = (fa + n) / (n - fa); m[11] = -1; m[14] = 2 * fa * n / (n - fa); return m; }
  function rotX(a) { var c = Math.cos(a), s = Math.sin(a), m = new Float32Array(16); m[0] = 1; m[5] = c; m[6] = s; m[9] = -s; m[10] = c; m[15] = 1; return m; }
  function rotY(a) { var c = Math.cos(a), s = Math.sin(a), m = new Float32Array(16); m[0] = c; m[2] = -s; m[5] = 1; m[8] = s; m[10] = c; m[15] = 1; return m; }
  function trans(x, y, z) { var m = new Float32Array(16); m[0] = m[5] = m[10] = m[15] = 1; m[12] = x; m[13] = y; m[14] = z; return m; }

  var dpr = 1, W = 0, H = 0, mx = 0, my = 0, tx = 0, ty = 0;
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, small ? 1.5 : 2);
    W = canvas.width = Math.floor(innerWidth * dpr); H = canvas.height = Math.floor(innerHeight * dpr);
    gl.viewport(0, 0, W, H);
  }
  addEventListener('resize', resize); resize();
  addEventListener('pointermove', function (e) { tx = e.clientX / innerWidth - .5; ty = e.clientY / innerHeight - .5; }, { passive: true });

  var t0 = performance.now(), raf = 0;
  function frame(now) {
    var t = (now - t0) / 1000;
    mx += (tx - mx) * .04; my += (ty - my) * .04;
    var aspect = W / H, shiftX = innerWidth > 900 ? 3.7 : 0, shiftY = innerWidth > 900 ? -0.6 : 2.2;
    var proj = persp(0.9, aspect, 0.1, 100);
    var view = mul(trans(shiftX, shiftY, -13.5), mul(rotX(0.92 + my * .35), rotY(mx * .5 + t * 0.012)));
    gl.uniformMatrix4fv(uMVP, false, mul(proj, view));
    gl.uniform1f(uTime, reduce ? 0 : t); gl.uniform1f(uSpin, reduce ? 0 : 0.55);
    gl.uniform1f(uScale, H * 0.95 * (dpr > 1 ? 1 : 1) / 10);
    gl.clear(gl.COLOR_BUFFER_BIT); gl.drawArrays(gl.POINTS, 0, N + STARS);
    if (!reduce && !document.hidden) raf = requestAnimationFrame(frame);
  }
  document.addEventListener('visibilitychange', function () { if (!document.hidden && !reduce) { cancelAnimationFrame(raf); raf = requestAnimationFrame(frame); } });
  raf = requestAnimationFrame(frame);
  if (reduce) addEventListener('resize', function () { requestAnimationFrame(frame); });
  window.__galaxyReady = true;
})();
