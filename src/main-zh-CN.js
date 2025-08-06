/**
 * main-zh-CN.js
 *
 * Simplified Chinese version entry point - bootstraps Vuetify and other plugins then mounts the App
 */

// Plugins
import { registerPlugins } from '@/plugins'

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
    history: createWebHistory('/zh-CN/'),
    routes,
  })

const app = createApp(App)

registerPlugins(app)

const settingsStore = useSettingsStore()

// 設定預設語言為簡體中文，並標記這是從 /zh-CN 路由進入
settingsStore.setDefaultLanguageFromRoute('zh-Hans-CN')
settingsStore.loadSettings()

app.mount('#app')