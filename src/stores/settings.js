import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    fontScale: 1.0,
    showR18Content: false,
    selectedForums: ['Bahamut', 'NGAList', 'PTTList', 'XPosts', 'RedditPosts'],
    // 語言設定
    selectedLanguage: 'zh-Hant-TW',
    supportedLanguages: [
      { code: 'zh-Hant-TW', name: '繁體中文', flag: '🇹🇼' },
      { code: 'en', name: 'English', flag: '🇺🇸' },
      { code: 'ja-JP', name: '日本語', flag: '🇯🇵' },
      { code: 'ko-KR', name: '한국어', flag: '🇰🇷' }
    ],
    isLoaded: false,
  }),

  getters: {
    // 獲取當前語言資訊
    currentLanguage: (state) => {
      return state.supportedLanguages.find(lang => lang.code === state.selectedLanguage) || state.supportedLanguages[0]
    }
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
        'zh': 'zh-Hant-TW',        // 預設中文為繁體
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
        return langMap[langPrefix]
      }
      
      // 預設返回繁體中文
      return 'zh-Hant-TW'
    },

    // 載入設定
    loadSettings() {
      try {
        const saved = localStorage.getItem('bd2_settings')
        if (saved) {
          const settings = JSON.parse(saved)
          
          this.fontScale = settings.fontScale || 1.0
          this.showR18Content = settings.showR18Content || false
          this.selectedForums = settings.selectedForums || ['Bahamut', 'NGAList', 'PTTList', 'XPosts', 'RedditPosts']
          this.selectedLanguage = settings.selectedLanguage || this.detectBrowserLanguage()
          
          this.applyFontScale()
        } else {
          // 如果沒有保存的設定，使用瀏覽器語言作為預設
          this.selectedLanguage = this.detectBrowserLanguage()
          // 立即保存初始設定，確保下次不會再檢測
          this.saveSettings()
        }
        
        this.isLoaded = true
      } catch (error) {
        console.error('載入設定時發生錯誤:', error)
        // 即使出錯也嘗試設定瀏覽器語言
        this.selectedLanguage = this.detectBrowserLanguage()
        this.isLoaded = true // 即使出錯也標記為已載入，使用預設值
      }
    },

    // 儲存設定
    saveSettings() {
      const settings = {
        fontScale: this.fontScale,
        showR18Content: this.showR18Content,
        selectedForums: this.selectedForums,
        selectedLanguage: this.selectedLanguage,
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
      
      this.applyFontScale()
      this.saveSettings()
    }
  }
}) 