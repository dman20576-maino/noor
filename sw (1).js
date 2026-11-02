const V='noor-v4',SHELL=['./','index.html','stories.json','names.json','manifest.json','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x.startsWith('noor-v')&&x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
async function audio(r){const m=await caches.match(r.url);if(!m)return fetch(r);const rg=r.headers.get('range');if(!rg||m.type==='opaque')return m;const b=await m.blob(),x=/bytes=(\d+)-(\d*)/.exec(rg);if(!x)return m;const s=+x[1],e=x[2]?Math.min(+x[2],b.size-1):b.size-1;return new Response(b.slice(s,e+1),{status:206,headers:{'Content-Type':'audio/mpeg','Content-Range':`bytes ${s}-${e}/${b.size}`,'Content-Length':String(e-s+1)}})}
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
 if(u.hostname==='cdn.islamic.network'){e.respondWith(audio(r));return}
 const ok=u.origin===location.origin||u.hostname==='fonts.googleapis.com'||u.hostname==='fonts.gstatic.com'||u.hostname==='api.alquran.cloud';
 if(!ok||r.headers.has('range')||u.pathname.includes('/quran/'))return;
 e.respondWith(fetch(r).then(res=>{if(res.ok||res.type==='opaque'){const cp=res.clone();caches.open(V).then(c=>c.put(r,cp))}return res}).catch(()=>caches.match(r).then(m=>m||(r.mode==='navigate'?caches.match('index.html'):Response.error()))))});
