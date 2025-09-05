// 確保 SW 立即更新並取得頁面控制權
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));

// 核心的 push 事件處理
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push Received.');

  let title = 'The BD2 Pulse';
  let options = {
    body: '有新的兌換碼或更新！',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    data: { url: '/' },
    tag: 'bd2-update',
  };

  if (event.data) {
    try {
      // 嘗試解析 JSON
      const payload = event.data.json();
      console.log('[Service Worker] Payload parsed as JSON:', payload);
      
      // 使用 JSON 中的內容來覆蓋預設值
      title = payload.title || title;
      options.body = payload.body || options.body;
      options.icon = payload.icon || options.icon;
      options.badge = payload.badge || options.badge;
      options.data.url = payload.url || options.data.url;

    } catch (e) {
      // 如果解析 JSON 失敗，就將整個 payload 當作純文字 body
      console.log('[Service Worker] Payload is not JSON, treating as text.');
      options.body = event.data.text();
    }
  } else {
    console.log('[Service Worker] Push event but no data');
  }

  event.waitUntil(self.registration.showNotification(title, options));
});

// 點擊通知的處理
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification click Received.');
  event.notification.close();

  const urlToOpen = event.notification.data.url || '/';

  // 尋找是否已有開啟的頁面，如果有就 focus，沒有就開新的
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      for (const client of clientList) {
        // 如果找到相同 URL 的頁面，就聚焦到該頁面
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      // 如果沒找到，就開啟新視窗
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});