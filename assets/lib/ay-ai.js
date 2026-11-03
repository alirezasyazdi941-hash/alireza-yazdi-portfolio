/*! ay-ai 1.0.0 — Alireza Yazdi · keyless/BYO-token AI client with a content-addressed IndexedDB cache.
 *  Cache key = SHA-256( canonical JSON of {kind, provider, model, params, prompt} ). No dependencies. MIT. */
(function (root) {
  'use strict';
  const DB = 'ay-ai-cache', STORE = 'entries', VERSION = 1;
  const enc = new TextEncoder();

  // ---- canonical JSON + SHA-256 -------------------------------------------------
  function canon(v) {
    if (v === null || typeof v !== 'object') return JSON.stringify(v === undefined ? null : v);
    if (Array.isArray(v)) return '[' + v.map(canon).join(',') + ']';
    return '{' + Object.keys(v).sort().filter((k) => v[k] !== undefined).map((k) => JSON.stringify(k) + ':' + canon(v[k])).join(',') + '}';
  }
  async function sha256(text) {
    const d = await crypto.subtle.digest('SHA-256', enc.encode(text));
    return Array.from(new Uint8Array(d), (b) => b.toString(16).padStart(2, '0')).join('');
  }
  const keyFor = (spec) => sha256(canon(spec));

  // ---- IndexedDB ----------------------------------------------------------------
  let dbp = null;
  function open() {
    if (dbp) return dbp;
    dbp = new Promise((res, rej) => {
      const r = indexedDB.open(DB, VERSION);
      r.onupgradeneeded = () => { const s = r.result.createObjectStore(STORE, { keyPath: 'key' }); s.createIndex('at', 'at'); };
      r.onsuccess = () => res(r.result);
      r.onerror = () => rej(r.error);
    });
    return dbp;
  }
  async function tx(mode, fn) {
    const db = await open();
    return new Promise((res, rej) => {
      const t = db.transaction(STORE, mode); const out = fn(t.objectStore(STORE));
      t.oncomplete = () => res(out && 'result' in out ? out.result : undefined);
      t.onerror = () => rej(t.error); t.onabort = () => rej(t.error);
    });
  }
  const store = {
    get: (key) => tx('readonly', (s) => s.get(key)),
    put: (rec) => tx('readwrite', (s) => s.put(rec)),
    del: (key) => tx('readwrite', (s) => s.delete(key)),
    clear: () => tx('readwrite', (s) => s.clear()),
    all: () => tx('readonly', (s) => s.getAll()),
  };
  async function stats() {
    const all = (await store.all()) || [];
    let bytes = 0; for (const e of all) bytes += e.size || 0;
    return { entries: all.length, bytes };
  }

  // ---- cache wrapper ------------------------------------------------------------
  const inflight = new Map();
  /** spec identifies the request; produce() returns string|Blob. opts.ttlMs, opts.refresh */
  async function cached(spec, produce, opts) {
    opts = opts || {};
    const key = await keyFor(spec);
    if (!opts.refresh) {
      const hit = await store.get(key);
      if (hit && (!opts.ttlMs || Date.now() - hit.at < opts.ttlMs)) return { key, value: hit.value, fromCache: true };
    }
    if (inflight.has(key)) return inflight.get(key);
    const p = (async () => {
      try {
        const value = await produce();
        const size = typeof value === 'string' ? value.length : (value && value.size) || 0;
        await store.put({ key, spec: { kind: spec.kind, provider: spec.provider, model: spec.model }, value, size, at: Date.now() });
        return { key, value, fromCache: false };
      } finally { inflight.delete(key); }
    })();
    inflight.set(key, p); return p;
  }

  // ---- providers ----------------------------------------------------------------
  async function fail(r, who) {
    let t = ''; try { t = (await r.text()).slice(0, 200); } catch (e) {}
    const e = new Error(who + ' HTTP ' + r.status + (t ? ': ' + t : '')); e.status = r.status;
    e.retryAfter = +r.headers.get('retry-after') || 0; throw e;
  }
  const Pollinations = {
    textBase: 'https://text.pollinations.ai', imageBase: 'https://image.pollinations.ai',
    async text(prompt, o) {
      o = o || {};
      const r = await fetch(this.textBase + '/openai', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: o.signal,
        body: JSON.stringify({ model: o.model || 'openai', seed: o.seed, messages: [].concat(o.system ? [{ role: 'system', content: o.system }] : [], [{ role: 'user', content: prompt }]) }),
      });
      if (!r.ok) await fail(r, 'Pollinations');
      const j = await r.json(); return j.choices[0].message.content;
    },
    async image(prompt, o) {
      o = o || {};
      const q = new URLSearchParams({ width: o.width || 768, height: o.height || 768, seed: o.seed == null ? 42 : o.seed, nologo: 'true' });
      const r = await fetch(this.imageBase + '/prompt/' + encodeURIComponent(prompt) + '?' + q, { signal: o.signal });
      if (!r.ok) await fail(r, 'Pollinations');
      const b = await r.blob(); if (!/^image\//.test(b.type)) throw new Error('Pollinations returned non-image'); return b;
    },
  };
  const HuggingFace = { // token is supplied by the user at runtime; it is never stored in this repo or in the cache
    base: 'https://router.huggingface.co',
    async text(prompt, o) {
      if (!o || !o.token) throw new Error('Hugging Face token required');
      const r = await fetch(this.base + '/v1/chat/completions', {
        method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + o.token }, signal: o.signal,
        body: JSON.stringify({ model: o.model, max_tokens: o.maxTokens || 512, messages: [].concat(o.system ? [{ role: 'system', content: o.system }] : [], [{ role: 'user', content: prompt }]) }),
      });
      if (!r.ok) await fail(r, 'HuggingFace');
      const j = await r.json(); return j.choices[0].message.content;
    },
    async image(prompt, o) {
      if (!o || !o.token) throw new Error('Hugging Face token required');
      const r = await fetch(this.base + '/hf-inference/models/' + o.model, {
        method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + o.token, Accept: 'image/png' }, signal: o.signal,
        body: JSON.stringify({ inputs: prompt }),
      });
      if (!r.ok) await fail(r, 'HuggingFace');
      return r.blob();
    },
  };
  const providers = { pollinations: Pollinations, huggingface: HuggingFace };

  /** High-level: generate({kind:'text'|'image', provider, model, prompt, system, seed, width, height, token}) */
  function generate(a, opts) {
    const P = providers[a.provider]; if (!P) throw new Error('unknown provider');
    const spec = { kind: a.kind, provider: a.provider, model: a.model || null, prompt: a.prompt, system: a.system || null, seed: a.seed == null ? null : a.seed, width: a.width || null, height: a.height || null };
    return cached(spec, () => P[a.kind](a.prompt, a), opts); // token deliberately NOT part of the key
  }

  root.AYAI = { version: '1.0.0', sha256, canon, keyFor, store, stats, cached, generate, providers };
})(typeof self !== 'undefined' ? self : this);
