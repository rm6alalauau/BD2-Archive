/*
  Minimal Service Worker for Web Push notifications
  - Handles 'push' to display notifications
  - Handles 'notificationclick' to focus/open a URL
*/

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
  try {
    const data = event.data ? event.data.json() : {};
    const title = data.title || 'The BD2 Pulse';
    const options = {
      body: data.body || '有新的兌換碼或更新！',
      icon: data.icon || '/favicon.png',
      badge: data.badge || '/favicon.png',
      data: {
        url: data.url || '/',
      },
      vibrate: [100, 50, 100],
      renotify: true,
      tag: data.tag || 'bd2-updates',
    };
    event.waitUntil(self.registration.showNotification(title, options));
  } catch (e) {
    // Fallback if payload is not JSON
    event.waitUntil(self.registration.showNotification('The BD2 Pulse', {
      body: '有新的通知',
    }));
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = (event.notification && event.notification.data && event.notification.data.url) || '/';
  event.waitUntil(
    (async () => {
      const allClients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
      let client = allClients.find((c) => c.url.includes(url));
      if (client) {
        await client.focus();
      } else {
        await self.clients.openWindow(url);
      }
    })()
  );
});

