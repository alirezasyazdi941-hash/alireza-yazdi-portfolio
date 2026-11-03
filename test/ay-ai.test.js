'use strict';
const http=require('http'),fs=require('fs'),path=require('path'),assert=require('assert');const {chromium}=require('playwright');
const ROOT=path.resolve(__dirname,'..');
const srv=http.createServer((q,r)=>{let p=decodeURIComponent(new URL(q.url,'http://x').pathname);if(p.endsWith('/'))p+='index.html';const f=path.join(ROOT,p);fs.readFile(f,(e,b)=>{if(e){r.writeHead(404);return r.end();}r.writeHead(200,{'Content-Type':f.endsWith('.js')?'text/javascript':'text/html'});r.end(b);});});
const ok=(m)=>console.log('  ✔',m);
(async()=>{await new Promise(r=>srv.listen(0,r));const base='http://localhost:'+srv.address().port+'/';
const br=await chromium.launch();const pg=await (await br.newContext()).newPage();const errs=[];pg.on('pageerror',e=>errs.push(e.message));
const calls={text:0,img:0,hf:0,auth:[]};
await pg.route('https://text.pollinations.ai/**',r=>{calls.text++;r.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*'},body:JSON.stringify({choices:[{message:{content:'<b>hello</b>'}}]})});});
const PNG=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==','base64');
await pg.route('https://image.pollinations.ai/**',r=>{calls.img++;r.fulfill({status:200,contentType:'image/png',headers:{'access-control-allow-origin':'*'},body:PNG});});
await pg.route('https://router.huggingface.co/**',r=>{calls.hf++;calls.auth.push(r.request().headers()['authorization']);r.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*','access-control-allow-headers':'*'},body:JSON.stringify({choices:[{message:{content:'hf answer'}}]})});});
await pg.goto(base+'apps/ai-lab/index.html');
// SHA-256 known vector + canonical key order independence
const v=await pg.evaluate(async()=>({e:await AYAI.sha256(''),a:await AYAI.keyFor({a:1,b:2}),b:await AYAI.keyFor({b:2,a:1})}));
assert.strictEqual(v.e,'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');assert.strictEqual(v.a,v.b);ok('SHA-256 vector + canonical key order-independent');
// text: miss then hit, with persistence across reload
await pg.click('#go');await pg.waitForFunction(()=>document.querySelector('#meta .b')?.textContent==='fresh');
assert.strictEqual(await pg.textContent('#out pre'),'<b>hello</b>');assert.strictEqual(await pg.locator('#out b').count(),0);ok('Pollinations text fresh, rendered XSS-safe');
await pg.reload();await pg.click('#go');await pg.waitForFunction(()=>document.querySelector('#meta .b')?.textContent==='from IndexedDB');
assert.strictEqual(calls.text,1);ok('after reload served from IndexedDB (no 2nd request)');
await pg.click('#re');await pg.waitForFunction(()=>document.querySelector('#meta .b')?.textContent==='fresh');assert.strictEqual(calls.text,2);ok('refresh bypasses cache');
// image blob cached
await pg.selectOption('#kind','image');await pg.click('#go');await pg.waitForSelector('#out img');await pg.click('#go');
await pg.waitForFunction(()=>document.querySelector('#meta .b')?.textContent==='from IndexedDB');assert.strictEqual(calls.img,1);ok('image Blob stored and re-served from IndexedDB');
// HF: token sent, token not part of key, not stored in cache
await pg.selectOption('#prov','huggingface');await pg.selectOption('#kind','text');await pg.fill('#model','x/y');await pg.fill('#tok','hf_SECRET123');await pg.click('#go');
await pg.waitForFunction(()=>document.querySelector('#out pre')?.textContent==='hf answer');assert.strictEqual(calls.auth[0],'Bearer hf_SECRET123');
const dump=await pg.evaluate(async()=>JSON.stringify((await AYAI.store.all()).map(e=>({s:e.spec,k:e.key}))));assert(!dump.includes('SECRET123'));ok('Hugging Face call uses token; token never stored in cache');
// in-flight dedupe
const n=await pg.evaluate(async()=>{let c=0;const f=()=>{c++;return new Promise(r=>setTimeout(()=>r('v'),100));};await Promise.all([AYAI.cached({z:1},f),AYAI.cached({z:1},f)]);return c;});assert.strictEqual(n,1);ok('concurrent identical requests deduplicated');
await pg.click('#clr');assert.strictEqual((await pg.evaluate(()=>AYAI.stats())).entries,0);ok('clear cache');
assert.deepStrictEqual(errs,[]);console.log('\nall ay-ai tests passed');await br.close();srv.close();})().catch(e=>{console.error('FAIL',e);process.exit(1);});
