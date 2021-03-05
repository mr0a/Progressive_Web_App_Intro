self.importScripts('./assets/vendor/js/idb-keyval.js');

const version = 3;

const staticCacheName = `static-v${version}`;
const dynamicCacheName = `dynamic-v${version}`;

const preCache = [
    {
        name: staticCacheName,
        urls: [
            './',
            './assets/vendor/css/bootstrap.min.css',
            './assets/vendor/js/alpine.js',
            './assets/vendor/js/idb-keyval.js'
        ]
    },
    {
        name: dynamicCacheName,
        urls: [
            './index.html',
            './assets/js/app.js',
            './data.json'
        ]
    }
];

async function addCacheHeader(res) {
    if (!res) return;

    let headers = new Headers(res.headers);
    headers.set('sw-cache', 'true');

    let buffer = await res.arrayBuffer();

    return new Response(buffer, {
        status: res.status,
        statusText: res.statusText,
        headers: headers
    });
}

async function clearOldCache(keysToKeep) {
    let cacheKeys = await caches.keys();
    console.log(cacheKeys);

    return Promise.all(
        cacheKeys
            .filter(key => keysToKeep.indexOf(key) === -1)
            .map(key => caches.delete(key))
    );

}

async function getResponseFor(req) {
    let staticCache = await caches.open(staticCacheName);
    let cacheRes = await staticCache.match(req);

    //Serving static cache
    if (cacheRes) {
        return cacheRes
    }

    let dynamicCache = await caches.open(dynamicCacheName);

    try {
        let res = await fetch(req);
        cacheRes = await dynamicCache.match(req);

        // Updating dynamic cache if the cache for the req exists
        if (cacheRes) {
            await dynamicCache.put(req, res.clone());
        }

        return res;
    } catch (err) {
        // Response from dynamic cache when error occured in fetch
        return await addCacheHeader(await dynamicCache.match(req));
    }

}

async function syncReport(){
    let changed = await idbKeyval.get('changed');
    
    if (changed && changed.length > 0){
        console.log("Send report to server");
        await idbKeyval.set('changed', []);
    }
}


self.addEventListener('install', e => {
    console.log("The SW is installed");
    e.waitUntil(Promise.all(
        preCache.map(obj => {
            caches
                .open(obj.name).then(cache => {
                    cache.addAll(obj.urls)
                }).then(() => self.skipWaiting()); // Skipwaiting when new sw is installed
        })
    ));

    self.addEventListener('activate', e => {
        e.waitUntil(clearOldCache(preCache.map(obj => obj.name)))
    })

});

self.addEventListener('fetch', e => {
    e.respondWith(
        getResponseFor(e.request)
    );
});

self.addEventListener('sync', e => {
    if (e.tag === 'sync-report') {
        e.waitUntil(syncReport());
    }
})