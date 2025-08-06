/**
 * main-ko-KR.js
 *
 * Korean version entry point - bootstraps Vuetify and other plugins then mounts the App
 */

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'
import { useSettingsStore } from './stores/settings'

import { createRouter, createWebHistory } from 'vue-router'
import { routes } from 'vue-router/auto/routes'

// Import critical CSS first for better performance
import './styles/critical.css'

const router = createRouter({
    history: createWebHistory('/ko-KR/'),
    routes,
  })

const app = createApp(App)

registerPlugins(app)

const settingsStore = useSettingsStore()

// 設定預設語言為韓文，並標記這是從 /ko-KR 路由進入
settingsStore.setDefaultLanguageFromRoute('ko-KR')
settingsStore.loadSettings()

app.mount('#app')