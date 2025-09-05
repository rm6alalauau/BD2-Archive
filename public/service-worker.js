// 確保 SW 立即更新並取得頁面控制權
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));

// 核心的 push 事件處理
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push Received.');

  let payload = {};
  // --- ✨ 關鍵修正：使用 try...catch 安全地解析 JSON ---
  try {
    if (event.data) {
      payload = event.data.json();
      console.log('[Service Worker] Push payload parsed:', payload);
    } else {
      console.log('[Service Worker] Push event but no data');
    }
  } catch (e) {
    console.error('[Service Worker] Failed to parse push payload as JSON:', e);
    // 如果解析失敗，payload 仍然會是一個空物件 {}
  }

  // --- 使用解析後的 payload，並為每個屬性提供安全的預設值 ---
  const title = payload.title || 'The BD2 Pulse';
  const options = {
    body: payload.body || '有新的兌換碼或更新！',
    icon: payload.icon || '/favicon.ico', // 建議使用 ICO 或 PNG
    badge: payload.badge || '/favicon.ico', // 用於 Android 狀態列的小圖示
    data: {
      url: payload.url || '/', // 點擊通知後要前往的 URL
    },
    // 為了最大相容性，可以暫時先移除 vibrate, renotify, tag 等選項，或確保它們的值是正確的
    // vibrate: [100, 50, 100], 
    tag: 'bd2-update', // 使用一個固定的 tag 可以讓新通知覆蓋舊通知
  };

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