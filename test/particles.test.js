'use strict';
const http=require('http'),fs=require('fs'),path=require('path'),assert=require('assert');const {chromium}=require('playwright');
const ROOT=path.resolve(__dirname,'..'),OUT=process.argv[2]||null;
const M={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml'};
const srv=http.createServer((q,r)=>{let p=decodeURIComponent(new URL(q.url,'http://x').pathname);if(p.endsWith('/'))p+='index.html';const f=path.join(ROOT,p);fs.readFile(f,(e,b)=>{if(e){r.writeHead(404);return r.end();}r.writeHead(200,{'Content-Type':M[path.extname(f)]||'application/octet-stream'});r.end(b);});});
const ok=m=>console.log('  ✔',m);
(async()=>{await new Promise(r=>srv.listen(0,r));const origin='http://localhost:'+srv.address().port;
const br=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});const errs=[],ext=[];
for(const [name,vp] of [['desktop',{width:1280,height:800}],['mobile',{width:390,height:780,hasTouch:true,isMobile:true}]]){
 const pg=await (await br.newContext({viewport:vp})).newPage();pg.on('pageerror',e=>errs.push(e.message));pg.on('console',m=>{if(m.type()==='error'&&!/favicon/.test(m.text()))errs.push(m.text());});
 pg.on('request',r=>{if(!r.url().startsWith(origin)&&!r.url().startsWith('data:'))ext.push(r.url());});
 await pg.goto(origin+'/film/particles.html');await pg.waitForFunction(()=>window.__film);
 const sig=[];for(const s of [0,.1,.27,.47,.67,.87,1]){sig.push(await pg.evaluate(p=>window.__film.probe(p),s));if(OUT){await pg.waitForTimeout(250);await pg.screenshot({path:`${OUT}/${name}-${Math.round(s*100)}.png`});}}
 assert(sig.every(n=>n>40),'blank stage: '+sig);ok(name+': particles rendered at every stage '+sig.join(','));
 // real scrolling drives chapters via Lenis/ScrollTrigger
 const max=await pg.evaluate(()=>document.documentElement.scrollHeight-innerHeight);
 await pg.evaluate(y=>scrollTo(0,y),Math.round(max*.27));await pg.waitForTimeout(1500);
 assert.deepStrictEqual(await pg.evaluate(()=>window.__film.on),[false,true,false,false,false]);ok(name+': scrolling shows chapter 2 only');
 await pg.evaluate(y=>scrollTo(0,y),max);await pg.waitForTimeout(1500);assert(await pg.evaluate(()=>window.__film.end));
 assert(await pg.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));ok(name+': end card shown, no horizontal overflow');
 // interaction does not throw
 await pg.mouse.move(300,300);await pg.mouse.click(300,300);await pg.waitForTimeout(300);ok(name+': pointer move + click wave');
 await pg.click('#lang');assert.strictEqual(await pg.evaluate(()=>document.documentElement.dir),'rtl');ok(name+': Persian toggles RTL');
}
assert.deepStrictEqual(ext,[],'external requests: '+ext);ok('no external (CDN) requests: fully self-hosted');
assert.deepStrictEqual(errs,[]);console.log('\nfilm tests passed');await br.close();srv.close();})().catch(e=>{console.error('FAIL',e);process.exit(1);});
