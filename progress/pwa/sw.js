

this.addEventListener('install',function (event) {
   event.waitUntil(
       caches.open('my-test-cache-v1').then(function (cache) {
           return cache.addAll([
               '/',
               '/main.html',
               '/main.css',
               '/userImage.jpg',
           ])
       })
   )
});

this.addEventListener('fetch',function (event) {
    event.respondWith(
        caches.match(event.request).then(function (response) {

        })
    )
})