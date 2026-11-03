'use strict';
const http=require('http'),fs=require('fs'),path=require('path'),assert=require('assert');const {chromium}=require('playwright');
const ROOT=path.resolve(__dirname,'..'),OUT=process.argv[2]||null;
const M={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml'};
const srv=http.createServer((q,r)=>{let p=decodeURIComponent(new URL(q.url,'http://x').pathname);if(p.endsWith('/'))p+='index.html';const f=path.join(ROOT,p);fs.readFile(f,(e,b)=>{if(e){r.writeHead(404);return r.end();}r.writeHead(200,{'Content-Type':M[path.extname(f)]||'application/octet-stream'});r.end(b);});});
const ok=m=>console.log('  ✔',m);
(async()=>{await new Promise(r=>srv.listen(0,r));const base='http://localhost:'+srv.address().port+'/film/index.html';
const br=await chromium.launch();const errs=[];
for(const [name,vp] of [['desktop',{width:1280,height:800}],['mobile',{width:390,height:780}]]){
 const pg=await (await br.newContext({viewport:vp})).newPage();pg.on('pageerror',e=>errs.push(e.message));pg.on('console',m=>{if(m.type()==='error'&&!/favicon/.test(m.text()))errs.push(m.text());});
 await pg.goto(base);
 const max=await pg.evaluate(()=>document.getElementById('track').offsetHeight-innerHeight);
 const stops=[.0,.08,.27,.46,.5,.68,.88,1];const sig=[];
 for(const s of stops){await pg.evaluate(y=>scrollTo(0,y),Math.round(max*s));await pg.waitForTimeout(900);
  const h=await pg.evaluate(()=>{const c=document.getElementById('c'),x=c.getContext('2d'),d=x.getImageData(0,0,c.width,c.height).data;let n=0;for(let i=3;i<d.length;i+=4*37)if(d[i]>40)n++;return n;});
  sig.push(h);if(OUT)await pg.screenshot({path:`${OUT}/${name}-${Math.round(s*100)}.png`});}
 assert(sig.every(n=>n>5),'canvas blank at some stop: '+sig);ok(name+': canvas drawn at every chapter '+sig.join(','));
 const o=await pg.evaluate(()=>({end:+document.getElementById('end').style.opacity,cap:[...document.querySelectorAll('.cap')].map(c=>+c.style.opacity),ow:document.documentElement.scrollWidth>innerWidth}));
 assert(o.end>.9&&!o.ow);ok(name+': end card visible, no horizontal overflow');
 await pg.evaluate(()=>scrollTo(0,Math.round((document.getElementById('track').offsetHeight-innerHeight)*.27)));await pg.waitForTimeout(900);
 const c1=await pg.evaluate(()=>+document.getElementById('cap1').style.opacity);assert(c1>.8);ok(name+': chapter caption fades in at its scene');
 await pg.click('#lang');assert.strictEqual(await pg.evaluate(()=>document.documentElement.dir),'rtl');ok(name+': Persian toggles RTL');
}
assert.deepStrictEqual(errs,[]);console.log('\nfilm tests passed');await br.close();srv.close();})().catch(e=>{console.error('FAIL',e);process.exit(1);});
