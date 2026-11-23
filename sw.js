/* 医械管家 Service Worker — 离线缓存 */
const CACHE='meddevice-v2.1';
const ASSETS=[
  './','./index.html','./app.js','./data.js',
  './manifest.webmanifest',
  './icon-192.png','./icon-512.png','./icon-maskable-512.png'
];

self.addEventListener('install',e=>{
  e.waitUntil(
    caches.open(CACHE).then(c=>c.addAll(ASSETS).catch(()=>{}))
      .then(()=>self.skipWaiting())
  );
});

self.addEventListener('activate',e=>{
  e.waitUntil(
    caches.keys().then(keys=>Promise.all(
      keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))
    )).then(()=>self.clients.claim())
  );
});

self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(
    caches.match(e.request).then(cached=>{
      // 网络优先更新缓存，失败则回退缓存（离线可用）
      const net=fetch(e.request).then(res=>{
        if(res&&res.status===200){
          const copy=res.clone();
          caches.open(CACHE).then(c=>c.put(e.request,copy));
        }
        return res;
      }).catch(()=>cached);
      return cached||net;
    })
  );
});
