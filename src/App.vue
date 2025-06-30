<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import { useSettingsStore } from '@/stores/settings'

export default {
  name: 'App',
  setup() {
    const settingsStore = useSettingsStore()
    return { settingsStore }
  },
  mounted() {
    // 載入設定
    this.settingsStore.loadSettings()
  }
}
</script>
