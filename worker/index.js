/* eslint-disable no-underscore-dangle */
/* eslint-disable no-restricted-globals */

self.__WB_DISABLE_DEV_LOGS = true;

// eslint-disable-next-line no-unused-vars
const CACHE_NAME = 'offline';
const OFFLINE_URL = 'offline.html';

self.addEventListener('install', (event) => {
  console.log('install event1');

  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      // https://developer.mozilla.org/en-US/docs/Web/API/Request/cache
      await cache.add(new Request(OFFLINE_URL, { cache: 'reload' })); // ensure the result is fresh not from cache
    })(),
  );
});

self.addEventListener('activate', () => {
  console.log('activate event');

  // const promise = async () => {
  //   const nextDataCache = await caches.open('next-data');
  //   const nextDataCacheKeys = await nextDataCache.keys();
  //   const target = nextDataCacheKeys.filter(
  //     (key) =>
  //       key.url ===
  //       'https://localhost:3000/_next/data/kKd_Gixs8tqHppnLoZ-kw/other.json',
  //   );
  //   console.log('target', target);
  //   const result = await nextDataCache.delete(target[0]);
  //   console.log('result', result);
  // };

  // event.waitUntil(promise());

  // event.waitUntil(
  //   caches
  //     .keys()
  //     .then((keys) =>
  //       Promise.all(
  //         keys.map((key) => {
  //           if (!expectedCaches.includes(key)) {
  //             return caches.delete(key);
  //           }
  //         }),
  //       ),)
  //     .then(() => {
  //       console.log('V2 now ready to handle fetches!');
  //     }),
  // );
});

self.addEventListener('fetch', (event) => {
  // only handle navigate request
  if (event.request.mode === 'navigate') {
    const promise = async () => {
      try {
        const networkResponse = await fetch(event.request);
        return networkResponse;
      } catch {
        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match(OFFLINE_URL);
        return cachedResponse;
      }
    };
    event.respondWith(promise());
  }
});

self.addEventListener('push', (event) => {
  const data = event?.data.json();

  event?.waitUntil(
    self.registration.showNotification('Notification Title', {
      // tag, silent, lang, icon, dir, body
      icon: 'icons/maskable_icon.png',
      body: data.title || 'Default',
      data: 'https://developer.mozilla.org/en-US/docs/Web/API/PushManager/subscribe',
      actions: [
        {
          action: 'confirm',
          title: 'optionA',
        },
        {
          action: 'cancel',
          title: 'optionB',
        },
      ],
    }),
  );
});

self.addEventListener('notificationclick', (event) => {
  const clickedNotification = event.notification;
  clickedNotification.close();

  const url = clickedNotification.data;

  if (url) {
    event.waitUntil(self.clients.openWindow(url));
  }
});
