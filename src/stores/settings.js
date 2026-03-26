import { defineStore } from 'pinia'
import { getTranslation } from '@/locales'

// 1. 新增可選 icon 陣列
// 當前圖標總數
const TOTAL_ICONS = 27;

// 生成圖標陣列，採用混合排序邏輯
const generateAvailableIcons = () => {
  return Array.from({ length: TOTAL_ICONS }, (_, i) => {
    const iconNumber = i + 1;

    // 計算 order 值：
    // - favicon01.png 到 favicon12.png：從新到舊排列
    // - favicon13.png 以後：越大越新
    let order;
    if (iconNumber <= 12) {
      // 1~12：favicon01是最新(12)，favicon12是最舊(1)
      order = 12 - (iconNumber - 1); // favicon01=12, favicon02=11, ..., favicon12=1
    } else {
      // 13+：直接使用數字，比12更大所以更新
      order = iconNumber; // favicon13=13, favicon14=14, ...
    }

    return {
      id: `icon${iconNumber}`,
      path: `/favicon${String(iconNumber).padStart(2, '0')}.png`,
      order: order
    };
  }).sort((a, b) => b.order - a.order); // 按 order 降序排列，最新的在前面
};

// 根據彩蛋模式返回不同的圖標陣列
export const getAvailableIcons = (easterEggMode = 'default') => {
  if (easterEggMode === 'walker_mode') {
    // 彩蛋模式：返回 17 個相同的 Yuri favicon，創造有趣的重複效果
    return Array.from({ length: TOTAL_ICONS }, (_, i) => {
      const iconNumber = i + 1;
      return {
        id: `yuri-favicon-${iconNumber}`,
        path: '/yuri/favicon.png',
        order: TOTAL_ICONS - i // 讓第一個顯示為最新
      };
    });
  }

  // 正常模式：返回原本的圖標陣列
  return generateAvailableIcons();
};

// 保持向後兼容的導出
export const availableIcons = generateAvailableIcons();

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    fontScale: 1.0,
    showR18Content: false,
    showAIContent: true, // AI 內容預設開啟
    selectedForums: ['Bahamut', 'NGAList', 'PTTList', 'XPosts', 'RedditPosts'], // 預設值（繁體中文）
    // 語言設定
    selectedLanguage: 'zh-Hant-TW',
    // 新增：路由預設語言
    routeDefaultLanguage: null,
    // 週期性活動提醒狀態
    weeklyEventReminder: {},
    // 季節性活動提醒狀態 (新增)
    seasonalEventStatus: {},
    // 每日簽到提醒設定
    dailyCheckinReminderEnabled: false,
    // 每日簽到狀態記錄
    dailyCheckinStatus: {},
    supportedLanguages: [
      { code: 'zh-Hant-TW', name: '繁體中文', flag: '🇹🇼' },
      { code: 'zh-Hans-CN', name: '简体中文', flag: '🇨🇳' },
      { code: 'en', name: 'English', flag: '🇺🇸' },
      { code: 'ja-JP', name: '日本語', flag: '🇯🇵' },
      { code: 'ko-KR', name: '한국어', flag: '🇰🇷' }
    ],
    isLoaded: false,
    // 2. 新增 icon 狀態
    selectedIcon: 'icon1',
    // ++ 新增彩蛋模式狀態 ++
    activeEasterEggMode: 'default', // 預設為 'default'，可設為 'walker_mode'
    // 服務公告關閉狀態
    dismissedServiceAnnouncements: {},
  }),

  getters: {
    // 獲取當前語言資訊
    currentLanguage: (state) => {
      return state.supportedLanguages.find(lang => lang.code === state.selectedLanguage) || state.supportedLanguages[0]
    },

    // 翻譯函數
    t: (state) => {
      return (key, language = null, params = {}) => {
        const targetLanguage = language || state.selectedLanguage
        return getTranslation(key, targetLanguage, params)
      }
    },
    // 3. 新增 currentIconPath
    currentIconPath(state) {
      // 彩蛋模式：強制使用 Yuri favicon
      if (state.activeEasterEggMode === 'walker_mode') {
        return '/yuri/favicon.png';
      }

      // 正常模式：使用原本的邏輯
      const found = availableIcons.find(icon => icon.id === state.selectedIcon)
      return found ? found.path : availableIcons[0].path
    },
  },

  actions: {
    // 檢測瀏覽器語言
    detectBrowserLanguage() {
      const browserLang = navigator.language || navigator.userLanguage

      // 語言映射表，將瀏覽器語言代碼映射到我們支援的語言
      const langMap = {
        'zh-TW': 'zh-Hant-TW',
        'zh-HK': 'zh-Hant-TW',
        'zh-MO': 'zh-Hant-TW',
        'zh-CN': 'zh-Hans-CN',
        'zh-SG': 'zh-Hans-CN',
        'en': 'en',
        'en-US': 'en',
        'en-GB': 'en',
        'en-AU': 'en',
        'en-CA': 'en',
        'ja': 'ja-JP',
        'ja-JP': 'ja-JP',
        'ko': 'ko-KR',
        'ko-KR': 'ko-KR'
      }

      // 檢查完整匹配
      if (langMap[browserLang]) {
        return langMap[browserLang]
      }

      // 檢查語言代碼的前綴匹配（例如 en-CA -> en）
      const langPrefix = browserLang.split('-')[0]
      if (langMap[langPrefix]) {
        // 對於中文，需要更精確的處理
        if (langPrefix === 'zh') {
          // 如果只是 'zh' 沒有地區代碼，預設使用繁體中文
          // 因為大部分繁體中文用戶的瀏覽器設定是 'zh' 或 'zh-TW'
          return 'zh-Hant-TW'
        }
        return langMap[langPrefix]
      }

      // 預設返回繁體中文
      return 'zh-Hant-TW'
    },

    // 根據語言獲取預設論壇選擇
    getDefaultForumsByLanguage(languageCode) {
      const forumDefaults = {
        'en': ['RedditPosts', 'XPosts', 'Bahamut', 'NGAList', 'PTTList'], // 英文：Reddit 優先
        'ja-JP': ['XPosts', 'RedditPosts', 'Bahamut', 'NGAList', 'PTTList'], // 日文：X(Twitter) 優先
        'ko-KR': ['NaverPosts', 'XPosts', 'RedditPosts', 'Bahamut', 'NGAList'], // 韓文：Naver 優先
        'zh-Hans-CN': ['Bahamut', 'NGAList', 'PTTList', 'XPosts', 'RedditPosts'], // 簡體中文：維持原預設
        'zh-Hant-TW': ['Bahamut', 'NGAList', 'PTTList', 'XPosts', 'RedditPosts'] // 繁體中文：維持原預設
      }

      return forumDefaults[languageCode] || forumDefaults['zh-Hant-TW']
    },

    // 載入設定
    loadSettings() {
      try {
        const saved = localStorage.getItem('bd2_settings')
        if (saved) {
          const settings = JSON.parse(saved)

          this.fontScale = settings.fontScale || 1.0
          this.showR18Content = settings.showR18Content || false
          this.showAIContent = settings.showAIContent !== undefined ? settings.showAIContent : true
          // 決定要使用的語言（用於判斷預設論壇）
          let targetLanguage
          if (this.routeDefaultLanguage) {
            targetLanguage = settings.selectedLanguage || this.routeDefaultLanguage
          } else {
            targetLanguage = settings.selectedLanguage || this.detectBrowserLanguage()
          }

          // 根據語言設定預設論壇，但如果用戶已有自定義設定則保留
          this.selectedForums = settings.selectedForums || this.getDefaultForumsByLanguage(targetLanguage)

          // 語言優先級：路由預設語言 > 儲存的語言 > 瀏覽器語言
          if (this.routeDefaultLanguage) {
            // 如果是新用戶（沒有儲存的語言設定），使用路由預設語言
            this.selectedLanguage = settings.selectedLanguage || this.routeDefaultLanguage
          } else {
            this.selectedLanguage = settings.selectedLanguage || this.detectBrowserLanguage()
          }

          // 載入 icon 設定
          this.selectedIcon = settings.selectedIcon || 'icon1'

          // 載入週期性活動提醒設定
          this.weeklyEventReminder = settings.weeklyEventReminder || {}
          this.seasonalEventStatus = settings.seasonalEventStatus || {}

          // 載入每日簽到提醒設定
          this.dailyCheckinReminderEnabled = settings.dailyCheckinReminderEnabled || false
          this.dailyCheckinStatus = settings.dailyCheckinStatus || {}

          // ++ 載入彩蛋模式設定 ++
          this.activeEasterEggMode = settings.activeEasterEggMode || 'default'

          // 載入服務公告狀態
          this.dismissedServiceAnnouncements = settings.dismissedServiceAnnouncements || {}

          this.applyFontScale()
        } else {
          // 如果沒有保存的設定，優先使用路由預設語言
          let targetLanguage
          if (this.routeDefaultLanguage) {
            this.selectedLanguage = this.routeDefaultLanguage
            targetLanguage = this.routeDefaultLanguage
          } else {
            this.selectedLanguage = this.detectBrowserLanguage()
            targetLanguage = this.selectedLanguage
          }

          // 新用戶根據語言設定預設論壇
          this.selectedForums = this.getDefaultForumsByLanguage(targetLanguage)

          // 立即保存初始設定，確保下次不會再檢測
          this.saveSettings()
        }

        this.isLoaded = true
        this.updateFavicon() // 載入時更新 favicon
        this.updatePWAIcon() // 載入時更新 PWA manifest
      } catch (error) {
        console.error('載入設定時發生錯誤:', error)
        // 即使出錯也嘗試設定語言
        if (this.routeDefaultLanguage) {
          this.selectedLanguage = this.routeDefaultLanguage
        } else {
          this.selectedLanguage = this.detectBrowserLanguage()
        }
        this.isLoaded = true // 即使出錯也標記為已載入，使用預設值
        this.updateFavicon()
        this.updatePWAIcon()
      }
    },

    // 儲存設定
    saveSettings() {
      const settings = {
        fontScale: this.fontScale,
        showR18Content: this.showR18Content,
        showAIContent: this.showAIContent,
        selectedForums: this.selectedForums,
        selectedLanguage: this.selectedLanguage,
        selectedIcon: this.selectedIcon,
        weeklyEventReminder: this.weeklyEventReminder,
        seasonalEventStatus: this.seasonalEventStatus,
        dailyCheckinReminderEnabled: this.dailyCheckinReminderEnabled,
        dailyCheckinStatus: this.dailyCheckinStatus,
        // ++ 儲存彩蛋模式設定 ++
        activeEasterEggMode: this.activeEasterEggMode,
        dismissedServiceAnnouncements: this.dismissedServiceAnnouncements,
      }

      localStorage.setItem('bd2_settings', JSON.stringify(settings))
    },

    // 應用字體縮放
    applyFontScale() {
      document.documentElement.style.fontSize = `${this.fontScale}rem`
    },

    // 更新字體縮放
    updateFontScale(scale) {
      this.fontScale = scale
      this.applyFontScale()
      this.saveSettings()
    },

    // 更新 R18 設定
    updateR18Setting(show) {
      this.showR18Content = show
      this.saveSettings()
    },

    // 更新 AI 內容設定
    updateAISetting(show) {
      this.showAIContent = show
      this.saveSettings()
    },

    // 更新論壇選擇
    updateForumSelection(forums) {
      this.selectedForums = forums
      this.saveSettings()
    },

    // 更新語言選擇
    updateLanguage(languageCode) {
      if (this.supportedLanguages.some(lang => lang.code === languageCode)) {
        this.selectedLanguage = languageCode
        this.saveSettings()
        // 通知 Service Worker 更新語言偏好
        this.updateServiceWorkerLanguage()
      }
    },

    // 更新 Service Worker 的語言偏好
    updateServiceWorkerLanguage() {
      if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(registration => {
          if (registration.active) {
            // 取得 notifications store 來獲取 favicon 路徑
            const notificationsStore = this.getNotificationsStore()
            registration.active.postMessage({
              type: 'SET_USER_PREFERENCES',
              preferences: {
                language: this.selectedLanguage,
                icon: notificationsStore ? notificationsStore.getFaviconPath(this.selectedIcon) : `/favicon${String(this.selectedIcon.replace('icon', '')).padStart(2, '0')}.png`
              }
            })
          }
        }).catch(err => {
          console.log('Service Worker not ready:', err)
        })
      }
    },

    // 獲取 notifications store 的輔助方法
    getNotificationsStore() {
      try {
        // 動態導入 notifications store 以避免循環依賴
        const { useNotificationsStore } = require('@/stores/notifications')
        return useNotificationsStore()
      } catch (err) {
        return null
      }
    },

    // 重置為預設值
    resetToDefaults() {
      this.fontScale = 1.0
      this.showR18Content = false
      this.selectedForums = ['Bahamut', 'NGAList', 'PTTList', 'XPosts', 'RedditPosts']
      this.selectedLanguage = 'zh-Hant-TW'
      this.selectedIcon = 'icon1'
      this.dailyCheckinReminderEnabled = false
      this.dailyCheckinStatus = {}
      // ++ 重置彩蛋模式 ++
      this.activeEasterEggMode = 'default'
      this.dismissedServiceAnnouncements = {}

      this.applyFontScale()
      this.saveSettings()
      this.updateFavicon()
    },

    // 4. 新增 setIcon
    setIcon(iconId) {
      this.selectedIcon = iconId
      this.saveSettings()
      this.updateFavicon()
      // 通知 Service Worker 更新 icon 偏好
      this.updateServiceWorkerIcon()
      // 更新 PWA manifest 圖標
      this.updatePWAIcon()
    },

    // 關閉服務公告
    dismissServiceAnnouncement(announcementId) {
      if (!announcementId) return

      const dismissed = {
        ...(this.dismissedServiceAnnouncements || {}),
        [announcementId]: new Date().getTime()
      }

      this.dismissedServiceAnnouncements = dismissed
      this.saveSettings()
    },

    // 更新 PWA manifest 圖標
    updatePWAIcon() {
      if (typeof window !== 'undefined') {
        try {
          // 移除舊的 manifest link
          const existingManifest = document.querySelector('link[rel="manifest"]')
          if (existingManifest) {
            existingManifest.remove()
          }

          // 創建動態 manifest
          const iconPath = this.currentIconPath
          const manifest = {
            name: "The BD2 Pulse",
            short_name: "The BD2 Pulse",
            description: "A gaming information aggregation platform for Brown Dust 2 players.",
            start_url: "/",
            display: "standalone",
            background_color: "#0a0a0a",
            theme_color: "#e72857",
            orientation: "portrait-primary",
            scope: "/",
            lang: "zh-TW",
            categories: ["games", "utilities"],
            icons: [
              {
                src: iconPath,
                sizes: "512x512",
                type: "image/png",
                purpose: "any maskable"
              },
              {
                src: iconPath,
                sizes: "192x192",
                type: "image/png",
                purpose: "any"
              },
              {
                src: "/favicon.ico",
                sizes: "16x16 32x32 48x48",
                type: "image/x-icon"
              }
            ]
          }

          // 創建 blob URL 並設定新的 manifest
          const manifestBlob = new Blob([JSON.stringify(manifest)], { type: 'application/json' })
          const manifestURL = URL.createObjectURL(manifestBlob)

          const newManifest = document.createElement('link')
          newManifest.rel = 'manifest'
          newManifest.href = manifestURL
          document.head.appendChild(newManifest)

          console.log('[Settings] PWA manifest updated with icon:', iconPath)
        } catch (error) {
          console.warn('[Settings] Failed to update PWA manifest:', error)
        }
      }
    },

    // 更新 Service Worker 的 icon 偏好
    updateServiceWorkerIcon() {
      if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(registration => {
          if (registration.active) {
            const notificationsStore = this.getNotificationsStore()
            registration.active.postMessage({
              type: 'SET_USER_PREFERENCES',
              preferences: {
                language: this.selectedLanguage,
                icon: notificationsStore ? notificationsStore.getFaviconPath(this.selectedIcon) : `/favicon${String(this.selectedIcon.replace('icon', '')).padStart(2, '0')}.png`
              }
            })
          }
        }).catch(err => {
          console.log('Service Worker not ready:', err)
        })
      }
    },

    // 5. 新增 updateFavicon
    updateFavicon() {
      // 移除舊的 icon
      document.querySelectorAll("link[rel*='icon']").forEach(el => el.remove())
      // 新的 favicon
      const link = document.createElement('link')
      link.rel = 'icon'
      link.href = this.currentIconPath
      link.type = 'image/png'
      document.head.appendChild(link)
      // 兼容 iOS/Android 桌面捷徑
      document.querySelectorAll("link[rel='apple-touch-icon']").forEach(el => el.remove())
      const appleLink = document.createElement('link')
      appleLink.rel = 'apple-touch-icon'
      appleLink.href = this.currentIconPath
      appleLink.sizes = '192x192'
      document.head.appendChild(appleLink)
    },

    // 設定路由預設語言（在載入設定前呼叫）
    setDefaultLanguageFromRoute(languageCode) {
      // 語言代碼對照表
      const langMap = {
        'en': 'en',
        'zh': 'zh-Hant-TW',
        'zh-tw': 'zh-Hant-TW',
        'zh-cn': 'zh-Hans-CN',
        'zh-hans-cn': 'zh-Hans-CN',
        'ja': 'ja-JP',
        'ja-jp': 'ja-JP',
        'ko': 'ko-KR',
        'ko-kr': 'ko-KR'
      }

      this.routeDefaultLanguage = langMap[languageCode.toLowerCase()] || languageCode
    },

    // 更新週期性活動提醒狀態
    updateWeeklyEventReminder(reminderData) {
      this.weeklyEventReminder = { ...reminderData }
      this.saveSettings()
    },

    // 更新季節性活動提醒狀態
    updateSeasonalEventStatus(statusData) {
      this.seasonalEventStatus = { ...statusData }
      this.saveSettings()
    },

    // 更新每日簽到提醒設定
    updateDailyCheckinReminder(enabled) {
      this.dailyCheckinReminderEnabled = enabled
      this.saveSettings()
    },

    // 更新每日簽到狀態
    updateDailyCheckinStatus(statusData) {
      this.dailyCheckinStatus = { ...statusData }
      this.saveSettings()
    },

    // ++ 新增彩蛋模式相關的 action ++
    // 設定彩蛋模式
    setEasterEggMode(mode) {
      this.activeEasterEggMode = mode
      this.saveSettings()
      console.log('[Settings] Easter Egg mode changed to:', mode)
    },
  }
}) 