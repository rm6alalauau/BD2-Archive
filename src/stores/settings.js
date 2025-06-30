import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    fontScale: 1.0,
    showR18Content: false,
    selectedForums: ['Bahamut', 'NGAList', 'PTTList', 'XPosts', 'RedditPosts'],
    isLoaded: false,
  }),

  actions: {
    // 載入設定
    loadSettings() {
      try {
        console.log('載入設定中...')
        const saved = localStorage.getItem('bd2_settings')
        if (saved) {
          const settings = JSON.parse(saved)
          console.log('找到已儲存的設定:', settings)
          
          this.fontScale = settings.fontScale || 1.0
          this.showR18Content = settings.showR18Content || false
          this.selectedForums = settings.selectedForums || ['Bahamut', 'NGAList', 'PTTList', 'XPosts', 'RedditPosts']
          
          this.applyFontScale()
        } else {
          console.log('沒有找到已儲存的設定，使用預設值')
        }
        
        this.isLoaded = true
        console.log('設定載入完成:', {
          fontScale: this.fontScale,
          showR18Content: this.showR18Content,
          selectedForums: this.selectedForums
        })
      } catch (error) {
        console.error('載入設定時發生錯誤:', error)
        this.isLoaded = true // 即使出錯也標記為已載入，使用預設值
      }
    },

    // 儲存設定
    saveSettings() {
      const settings = {
        fontScale: this.fontScale,
        showR18Content: this.showR18Content,
        selectedForums: this.selectedForums,
      }
      
      console.log('儲存設定:', settings)
      localStorage.setItem('bd2_settings', JSON.stringify(settings))
    },

    // 應用字體縮放
    applyFontScale() {
      document.documentElement.style.fontSize = `${this.fontScale}rem`
    },

    // 更新字體縮放
    updateFontScale(scale) {
      console.log('更新字體縮放:', scale)
      this.fontScale = scale
      this.applyFontScale()
      this.saveSettings()
    },

    // 更新 R18 設定
    updateR18Setting(show) {
      console.log('更新 R18 設定:', show)
      this.showR18Content = show
      this.saveSettings()
    },

    // 更新論壇選擇
    updateForumSelection(forums) {
      console.log('更新論壇選擇:', forums)
      this.selectedForums = forums
      this.saveSettings()
    },

    // 重置為預設值
    resetToDefaults() {
      console.log('重置設定為預設值')
      this.fontScale = 1.0
      this.showR18Content = false
      this.selectedForums = ['Bahamut', 'NGAList', 'PTTList', 'XPosts', 'RedditPosts']
      
      this.applyFontScale()
      this.saveSettings()
    }
  }
}) 