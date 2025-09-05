/*
  A simplified service worker inspired by successful push demos.
  It assumes the incoming payload is always a valid JSON string.
*/

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));

self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push Received.');

  let title = 'The BD2 Pulse';
  let options = {
    body: '兌換碼更新',
    icon: '/favicon.ico',
    data: { url: '/' },
  };

  if (event.data) {

    const payloadText = event.data.text();
    console.log(`[Service Worker] Received payload text: "${payloadText}"`);

    try {

      const payload = JSON.parse(payloadText);
      console.log('[Service Worker] Payload parsed successfully:', payload);
      
      title = payload.title || title;
      options.body = payload.body || options.body;
      options.icon = payload.icon || options.icon;
      options.data.url = payload.url || options.data.url;

    } catch (e) {
      // 如果解析失败 (例如 DevTools 的纯文本推送)，就将整个 payload 当作纯文字 body
      console.warn('[Service Worker] Payload is not valid JSON, treating as plain text.');
      options.body = payloadText;
    }
  } else {
    console.log('[Service Worker] Push event but no data');
  }

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const urlToOpen = event.notification.data.url || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.endsWith(urlToOpen) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});