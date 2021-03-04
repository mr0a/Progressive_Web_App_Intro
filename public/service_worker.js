const cacheName = "static-v1";
const preCache = [
    './',
    './index.html'
];

self.addEventListener('install', e => {
    console.log("The SW is installed");
    e.waitUntil(
        caches.open(cacheName).then(cache => cache.addAll(preCache))
    )
});