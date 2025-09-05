/*
  A simplified service worker inspired by successful push demos.
  It assumes the incoming payload is always a valid JSON string.
*/

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));

self.addEventListener('push', (event) => {
  // 這個版本不再做複雜的 try...catch 或文字回退
  // 我們直接假設從後端來的真實推送一定是有效的 JSON
  // 這將使它的行為與 DevTools 測試失敗的行為分離開來
  
  if (!event.data) {
    console.log('Push event received but no data.');
    return;
  }

  // 直接解析 JSON
  const payload = event.data.json();

  const title = payload.title;
  const options = {
    body: payload.body,
    icon: payload.icon || '/favicon.ico',
    // 為了最大限度地提高成功率，我們只使用最核心的 'body' 和 'icon' 選項
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  // 為了簡化，我們先寫死點擊後打開首頁
  event.waitUntil(clients.openWindow('/'));
});