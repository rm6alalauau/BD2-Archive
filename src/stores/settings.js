import { defineStore } from 'pinia'
import { getTranslation } from '@/locales'

// 1. 新增可選 icon 陣列
export const availableIcons = Array.from({ length: 12 }, (_, i) => ({
  id: `icon${i + 1}`,
  path: `/favicon${String(i + 1).padStart(2, '0')}.png`
}))

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
      }
    },

    // 儲存設定
    saveSettings() {
      const settings = {
        fontScale: this.fontScale,
        showR18Content: this.showR18Content,
        selectedForums: this.selectedForums,
        selectedLanguage: this.selectedLanguage,
        selectedIcon: this.selectedIcon,
        weeklyEventReminder: this.weeklyEventReminder,
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
      }
    },

    // 重置為預設值
    resetToDefaults() {
      this.fontScale = 1.0
      this.showR18Content = false
      this.selectedForums = ['Bahamut', 'NGAList', 'PTTList', 'XPosts', 'RedditPosts']
      this.selectedLanguage = 'zh-Hant-TW'
      this.selectedIcon = 'icon1'
      
      this.applyFontScale()
      this.saveSettings()
      this.updateFavicon()
    },

    // 4. 新增 setIcon
    setIcon(iconId) {
      this.selectedIcon = iconId
      this.saveSettings()
      this.updateFavicon()
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
  }
}) 