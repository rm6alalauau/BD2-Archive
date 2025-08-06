/**
 * main-ja.js
 *
 * Japanese version entry point - bootstraps Vuetify and other plugins then mounts the App
 */

// Plugins
import { registerPluginsWithoutRouter } from '@/plugins'

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'
import { useSettingsStore } from './stores/settings'

import { createRouter, createWebHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'

// Import critical CSS first for better performance
import './styles/critical.css'

const router = createRouter({
    history: createWebHistory('/ja-JP/'),
    routes,
  })

const app = createApp(App)

app.use(router)

registerPluginsWithoutRouter(app)

const settingsStore = useSettingsStore()

// 設定預設語言為日文，並標記這是從 /ja-JP 路由進入
settingsStore.setDefaultLanguageFromRoute('ja-JP')
settingsStore.loadSettings()

app.mount('#app')