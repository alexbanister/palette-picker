this.addEventListener('install', event => {
  event.waitUntil(
    caches.open('assets-v1')
      .then(cache => {
        return cache.addAll([
          '/',
          '/js/javascript.js',
          '/images/loading.gif',
          '/images/unlocked.svg',
          '/images/locked.svg',
          '/css/style.css'
        ]) //end addAll
      }) //end .then
  );
});

this.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  )
});

this.addEventListener('activate', event => {
  var cacheWhitelist = ['assets-v1'];
  event.waitUntil(
    caches.keys().then(function (keyList) {
      return Promise.all(keyList.map(function (key) {
        if (cacheWhitelist.indexOf(key) === -1) {
          return caches.delete(key);
        }
      }));
    })
  );
});
