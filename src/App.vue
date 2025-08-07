<template>
  <v-app :lang="settingsStore.selectedLanguage">
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import { useSettingsStore } from '@/stores/settings'
import { watch } from 'vue'

export default {
  name: 'App',
  setup() {
    const settingsStore = useSettingsStore()
    
    // 監聽語言變化並更新HTML lang屬性
    watch(() => settingsStore.selectedLanguage, (newLang) => {
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('lang', newLang)
      }
    }, { immediate: true })
    
    return { settingsStore }
  },
  mounted() {
    // 隱藏靜態回退內容，讓 Vue 應用接管
    this.hideStaticFallbackContent()
    
    // 載入設定
    this.settingsStore.loadSettings()
    // 確保HTML lang屬性正確設定
    document.documentElement.setAttribute('lang', this.settingsStore.selectedLanguage)
  },
  methods: {
    hideStaticFallbackContent() {
      // 尋找並隱藏靜態回退內容
      const staticContent = document.getElementById('static-fallback-content')
      if (staticContent) {
        // 使用 fade out 動畫讓轉換更平滑
        staticContent.style.transition = 'opacity 0.3s ease-out'
        staticContent.style.opacity = '0'
        
        // 動畫完成後移除元素
        setTimeout(() => {
          if (staticContent.parentNode) {
            staticContent.parentNode.removeChild(staticContent)
          }
        }, 300)
      }
    }
  }
}
</script>
