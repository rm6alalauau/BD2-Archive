// 监听 'install' 事件，确保 SW 立即激活
self.addEventListener('install', () => {
  self.skipWaiting();
});

// 监听 'activate' 事件
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// 监听核心的 'push' 事件
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push Received.');
  console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);

  const title = '测试通知'; // 写死一个最简单的标题
  const options = {
    body: '如果看到这条消息，代表 Service Worker 成功了！', // 写死一个最简单的内容
    icon: '/favicon.ico', // 使用一个最简单的图示
  };

  // 直接显示通知，不进行任何复杂的解析或操作
  event.waitUntil(self.registration.showNotification(title, options));
});

// 暂时移除 'notificationclick' 的监听，先确保显示功能正常
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification click Received.');
  event.notification.close();
});