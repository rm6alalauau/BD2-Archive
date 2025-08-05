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
    // 載入設定
    this.settingsStore.loadSettings()
    // 確保HTML lang屬性正確設定
    document.documentElement.setAttribute('lang', this.settingsStore.selectedLanguage)
  }
}
</script>
