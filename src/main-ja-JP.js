/**
 * main-ja.js
 *
 * Japanese version entry point - bootstraps Vuetify and other plugins then mounts the App
 */

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'
import { useSettingsStore } from './stores/settings'

// Import critical CSS first for better performance
import './styles/critical.css'

const app = createApp(App)

registerPlugins(app)

const settingsStore = useSettingsStore()

// 設定預設語言為日文，並標記這是從 /ja-JP 路由進入
settingsStore.setDefaultLanguageFromRoute('ja-JP')
settingsStore.loadSettings()

app.mount('#app')