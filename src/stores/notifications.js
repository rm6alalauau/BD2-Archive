import { defineStore } from 'pinia'
import { useSettingsStore } from '@/stores/settings'

// 將 VAPID Public Key 從環境變數帶入
const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY || ''
// 訂閱資料上傳端點（Cloudflare Worker 或其他後端）
const NOTIFICATIONS_ENDPOINT = import.meta.env.VITE_NOTIFICATIONS_ENDPOINT || ''

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/')

  const rawData = atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

export const useNotificationsStore = defineStore('notifications', {
  state: () => ({
    isSupported: typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window,
    permissionState: typeof Notification !== 'undefined' ? Notification.permission : 'default',
    isSubscribed: false,
    registration: null,
    subscription: null,
    error: null,
    // iOS 相關狀態
    isIOS: typeof window !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent),
    isPWA: typeof window !== 'undefined' && (window.navigator.standalone === true || window.matchMedia('(display-mode: standalone)').matches),
  }),

  getters: {
    // iOS 需要加到桌面才能使用通知
    isNotificationSupported() {
      if (!this.isSupported) return false
      if (this.isIOS && !this.isPWA) return false // iOS 需要是 PWA 模式
      return true
    },
    
    // 取得適當的錯誤訊息
    supportMessage() {
      if (!this.isSupported) return 'browser_not_supported'
      if (this.isIOS && !this.isPWA) return 'ios_need_pwa'
      return 'supported'
    }
  },

  actions: {
    // 根據使用者選擇的 icon 回傳對應的 favicon 路徑
    getFaviconPath(selectedIcon) {
      if (!selectedIcon || selectedIcon === 'favicon.ico') {
        return '/favicon.ico'
      }
      // 假設使用者選擇的 icon 格式為 'favicon01', 'favicon02' 等
      const iconNumber = selectedIcon.replace('favicon', '').padStart(2, '0')
      return `/favicon${iconNumber}.png`
    },

    async initialize() {
      try {
        if (!this.isSupported) return

        // 等待現有的 service worker 就緒（若已在 App 註冊）
        const reg = await navigator.serviceWorker.ready
        this.registration = reg

        // 檢查既有訂閱狀態
        const existing = await reg.pushManager.getSubscription()
        if (existing) {
          this.subscription = existing
          this.isSubscribed = true
          
          // 如果已有訂閱，也要更新 Service Worker 的使用者偏好
          const settings = useSettingsStore()
          setTimeout(() => {
            if (reg.active) {
              reg.active.postMessage({
                type: 'SET_USER_PREFERENCES',
                preferences: {
                  language: settings.selectedLanguage,
                  icon: this.getFaviconPath(settings.selectedIcon)
                }
              })
              console.log('[Notifications] User preferences synced to SW on init:', {
                language: settings.selectedLanguage,
                icon: this.getFaviconPath(settings.selectedIcon)
              })
            }
          }, 50)
        }
        this.permissionState = typeof Notification !== 'undefined' ? Notification.permission : 'default'
      } catch (err) {
        this.error = err?.message || String(err)
      }
    },

    async registerServiceWorker() {
      if (!this.isSupported) return null
      // 若 App 尚未註冊，此處提供冗餘註冊
      const reg = await navigator.serviceWorker.register('/service-worker.js')
      this.registration = reg
      return reg
    },

    async requestPermissionAndSubscribe() {
      try {
        if (!this.isSupported) throw new Error('此瀏覽器不支援通知')
        if (!VAPID_PUBLIC_KEY) throw new Error('缺少 VITE_VAPID_PUBLIC_KEY')
        if (!NOTIFICATIONS_ENDPOINT) throw new Error('缺少 VITE_NOTIFICATIONS_ENDPOINT')

        // 要求權限
        const result = await Notification.requestPermission()
        this.permissionState = result
        if (result !== 'granted') {
          throw new Error('使用者未授權通知')
        }

        // 確保有 SW 註冊
        const reg = this.registration || await this.registerServiceWorker()
        if (!reg) throw new Error('Service Worker 註冊失敗')

        // 建立訂閱
        const subscription = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
        })
        this.subscription = subscription
        this.isSubscribed = true

        // 取用目前語系等使用者偏好
        const settings = useSettingsStore()
        
        // 將使用者偏好傳送給 Service Worker (延遲確保 SW 準備就緒)
        setTimeout(() => {
          if (reg.active) {
            reg.active.postMessage({
              type: 'SET_USER_PREFERENCES',
              preferences: {
                language: settings.selectedLanguage,
                icon: this.getFaviconPath(settings.selectedIcon)
              }
            })
            console.log('[Notifications] User preferences sent to SW:', {
              language: settings.selectedLanguage,
              icon: this.getFaviconPath(settings.selectedIcon)
            })
          }
        }, 100)

        // 後端期望的結構：subscription 包裝 endpoint 與 keys
        const { endpoint, keys } = subscription.toJSON()
        const payload = {
          subscription: {
            endpoint,
            keys,
          },
          language: settings.selectedLanguage,
          userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
          timezoneOffset: new Date().getTimezoneOffset(),
          createdAt: new Date().toISOString(),
        }

        // 傳送至後端保存（包含語系與環境資訊）
        const endpointBase = import.meta.env.DEV ? '/api/push' : NOTIFICATIONS_ENDPOINT
        const res = await fetch(endpointBase + '/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (!res.ok) {
          const msg = await (async () => { try { return await res.text() } catch { return '' } })()
          throw new Error(`Subscribe failed: ${res.status} ${res.statusText} ${msg}`)
        }
      } catch (err) {
        this.error = err?.message || String(err)
        throw err
      }
    },

    async unsubscribe() {
      try {
        if (!this.subscription) return
        const endpoint = this.subscription.endpoint

        await this.subscription.unsubscribe()
        this.subscription = null
        this.isSubscribed = false

        if (NOTIFICATIONS_ENDPOINT) {
          // 通知後端移除
          const endpointBase = import.meta.env.DEV ? '/api/push' : NOTIFICATIONS_ENDPOINT
          const res = await fetch(endpointBase + '/unsubscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ endpoint }),
          })
          if (!res.ok) {
            const msg = await (async () => { try { return await res.text() } catch { return '' } })()
            throw new Error(`Unsubscribe failed: ${res.status} ${res.statusText} ${msg}`)
          }
        }
      } catch (err) {
        this.error = err?.message || String(err)
        throw err
      }
    },

    async syncPermission() {
      this.permissionState = typeof Notification !== 'undefined' ? Notification.permission : 'default'
    },

    // 測試通知功能
    async sendTestNotification() {
      if (!this.isSupported || !this.isSubscribed || !this.registration) {
        throw new Error('通知功能不可用')
      }

      try {
        const settings = useSettingsStore()
        
        // 多語系測試訊息
        const testMessages = {
          'zh-Hant-TW': {
            title: '✅ 測試通知成功！',
            body: 'The BD2 Pulse - 推播功能正常運作'
          },
          'zh-Hans-CN': {
            title: '✅ 测试通知成功！',
            body: 'The BD2 Pulse - 推播功能正常运作'
          },
          'en': {
            title: '✅ Test Notification Successful!',
            body: 'The BD2 Pulse - Push notifications are working'
          },
          'ja-JP': {
            title: '✅ テスト通知成功！',
            body: 'The BD2 Pulse - プッシュ通知が正常に動作中'
          },
          'ko-KR': {
            title: '✅ 테스트 알림 성공！',
            body: 'The BD2 Pulse - 푸시 알림이 정상 작동'
          }
        }

        const message = testMessages[settings.selectedLanguage] || testMessages['zh-Hant-TW']
        
        // 直接通過 Service Worker 顯示測試通知
        if (this.registration.active) {
          this.registration.active.postMessage({
            type: 'SHOW_TEST_NOTIFICATION',
            notification: {
              title: message.title,
              body: message.body,
              icon: this.getFaviconPath(settings.selectedIcon),
              badge: this.getFaviconPath(settings.selectedIcon),
              data: { url: '/', test: true }
            }
          })
        }
      } catch (err) {
        this.error = err?.message || String(err)
        throw err
      }
    },
  },
})

