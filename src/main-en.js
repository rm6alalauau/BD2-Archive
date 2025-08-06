/**
 * main-en.js
 *
 * English version entry point - bootstraps Vuetify and other plugins then mounts the App
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
    history: createWebHistory('/en/'),
    routes,
})

const app = createApp(App)

app.use(router)

registerPluginsWithoutRouter(app)

const settingsStore = useSettingsStore()

// 設定預設語言為英文，並標記這是從 /en 路由進入
settingsStore.setDefaultLanguageFromRoute('en')
settingsStore.loadSettings()

app.mount('#app')