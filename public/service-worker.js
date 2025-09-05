// 儲存使用者偏好設定
let userPreferences = {
  language: 'zh-Hant-TW',
  icon: '/favicon.ico'
};

// 多語系預設訊息
const defaultMessages = {
  'zh-Hant-TW': {
    title: 'The BD2 Pulse',
    body: '有新的兌換碼可用了！'
  },
  'zh-Hans-CN': {
    title: 'The BD2 Pulse',
    body: '有新的兑换码可用了！'
  },
  'en': {
    title: 'The BD2 Pulse',
    body: 'New redeem codes available!'
  },
  'ja-JP': {
    title: 'The BD2 Pulse',
    body: '新しい交換コードが利用可能です！'
  },
  'ko-KR': {
    title: 'The BD2 Pulse',
    body: '새로운 교환 코드가 사용 가능합니다!'
  }
};

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// 接收來自主線程的使用者偏好設定
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SET_USER_PREFERENCES') {
    userPreferences = event.data.preferences;
    console.log('[Service Worker] User preferences updated:', userPreferences);
  }
});

self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push Received.');

  // 使用使用者偏好的語言取得預設訊息
  const defaultMessage = defaultMessages[userPreferences.language] || defaultMessages['zh-Hant-TW'];
  
  let notificationData = {
    title: defaultMessage.title,
    body: defaultMessage.body,
    icon: userPreferences.icon,
    badge: userPreferences.icon,
    data: {
      url: '/',
      language: userPreferences.language
    }
  };

  // 檢查後端是否有傳來資料
  if (event.data) {
    try {
      const pushData = event.data.json();
      console.log('[Service Worker] Push had this data:', pushData);
      
      // 如果後端有傳來對應語言的訊息，就使用它，否則使用預設訊息
      if (pushData.title && pushData.body) {
        notificationData.title = pushData.title;
        notificationData.body = pushData.body;
      }
      
      // 如果後端有指定 URL，就使用它
      if (pushData.url) {
        notificationData.data.url = pushData.url;
      }
    } catch (e) {
      // 如果解析失敗，嘗試當作純文字處理
      console.log('[Service Worker] Failed to parse JSON, treating as text:', e);
      try {
        const textData = event.data.text();
        if (textData) {
          notificationData.body = textData;
        }
      } catch (textError) {
        console.log('[Service Worker] Failed to parse as text too, using defaults');
      }
    }
  } else {
    console.log('[Service Worker] Push had no data, using defaults.');
  }

  event.waitUntil(
    self.registration.showNotification(notificationData.title, {
      body: notificationData.body,
      icon: notificationData.icon,
      badge: notificationData.badge,
      data: notificationData.data,
      actions: [
        {
          action: 'view',
          title: '查看',
          icon: notificationData.icon
        }
      ]
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification click Received.');
  event.notification.close();
  
  // 開啟或聚焦到網站
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      const url = event.notification.data?.url || '/';
      
      // 檢查是否已有開啟的頁面
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      
      // 沒有開啟的頁面，開啟新的
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});