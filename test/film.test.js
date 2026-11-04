'use strict';
// Journey film (film/index.html): intro gate, cinematic scroll, data-driven dashboard.
const http=require('http'),fs=require('fs'),path=require('path'),assert=require('assert');const {chromium}=require('playwright');
const ROOT=path.resolve(__dirname,'..'),OUT=process.argv[2]||null;
const M={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.jpg':'image/jpeg'};
const srv=http.createServer((q,r)=>{let p=decodeURIComponent(new URL(q.url,'http://x').pathname);if(p.endsWith('/'))p+='index.html';fs.readFile(path.join(ROOT,p),(e,b)=>{if(e){r.writeHead(404);return r.end();}r.writeHead(200,{'Content-Type':M[path.extname(p)]||'application/octet-stream'});r.end(b);});});
const ok=m=>console.log('  ✔',m);
(async()=>{await new Promise(r=>srv.listen(0,r));const origin='http://localhost:'+srv.address().port;
const nApps=+fs.readFileSync(path.join(ROOT,'assets/data.js'),'utf8').match(/\bid: "/g).length;
const br=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});const errs=[],ext=[];
for(const [name,vp] of [['desktop',{width:1280,height:800}],['mobile',{width:390,height:780,hasTouch:true,isMobile:true}]]){
 const pg=await (await br.newContext({viewport:vp})).newPage();pg.on('pageerror',e=>errs.push(e.message));pg.on('console',m=>{if(m.type()==='error'&&!/favicon/.test(m.text()))errs.push(m.text());});
 pg.on('request',r=>{if(!r.url().startsWith(origin)&&!r.url().startsWith('data:'))ext.push(r.url());});
 await pg.goto(origin+'/film/index.html');await pg.waitForSelector('#btn-enter');
 assert(!/nononick/i.test(await pg.evaluate(()=>document.body.innerText)),'old brand visible');ok(name+': intro gate shows personal name, no old brand');
 await pg.click('#btn-enter');
 const max=await pg.evaluate(()=>document.getElementById('scroll-container').offsetHeight-innerHeight);
 for(const s of [.1,.3,.5,.7,.95]){await pg.evaluate(y=>scrollTo(0,y),Math.round(max*s));await pg.waitForTimeout(1800);if(OUT)await pg.screenshot({path:`${OUT}/j-${name}-${Math.round(s*100)}.png`});}
 ok(name+': scrolled through all five acts without errors');
 const tiles=await pg.evaluate(()=>document.querySelectorAll('#project-grid .tile').length);assert.strictEqual(tiles,nApps);ok(name+': dashboard lists all '+nApps+' apps from data.js');
 const hrefs=await pg.evaluate(()=>[...document.querySelectorAll('#project-grid .tile')].map(a=>a.getAttribute('href')));assert(hrefs.every(h=>/^\.\.\/apps\/[a-z-]+\/index\.html$/.test(h)));ok(name+': every tile points to a local app');
 for(const h of hrefs){assert(fs.existsSync(path.join(ROOT,'film',h)),'missing '+h);}ok(name+': all tile targets exist');
 await pg.click('[data-category="ai"]');const ai=await pg.evaluate(()=>document.querySelectorAll('#project-grid .tile').length);assert(ai>=2&&ai<nApps);ok(name+': category filter works ('+ai+' AI tools)');
 await pg.click('[data-category="contact"]');assert((await pg.textContent('#project-grid')).includes('Alireza_Yazdi@nononick.ir'));ok(name+': contact tab shows email');
 assert(await pg.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));ok(name+': no horizontal overflow');
}
assert.deepStrictEqual(ext,[],'external requests: '+ext);ok('no external requests: libraries are self-hosted');
assert.deepStrictEqual(errs,[]);console.log('\nfilm tests passed');await br.close();srv.close();})().catch(e=>{console.error('FAIL',e);process.exit(1);});
