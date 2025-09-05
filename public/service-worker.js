// 监听 'install' 事件，确保 SW 立即激活
self.addEventListener('install', () => {
  self.skipWaiting();
});

// 监听 'activate' 事件
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push Received.');

  let notificationText = '收到了無酬載的推送！';
  // 檢查 event.data 是否存在
  if (event.data) {
    console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);
    notificationText = event.data.text();
  } else {
    console.log('[Service Worker] Push had no data.');
  }

  const title = '最終測試';
  const options = {
    body: notificationText,
    icon: '/favicon.ico',
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// 暂时移除 'notificationclick' 的监听，先确保显示功能正常
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification click Received.');
  event.notification.close();
});