/**
 * main-zh-CN.js
 *
 * Simplified Chinese version entry point - bootstraps Vuetify and other plugins then mounts the App
 */

// Plugins
import { registerPluginsWithoutRouter } from '@/plugins'

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'
import { useSettingsStore } from './stores/settings'

import { createRouter, createWebHistory } from 'vue-router'
import { setupLayouts } from 'virtual:generated-layouts'
import { routes } from 'vue-router/auto-routes'

// Critical CSS is already loaded in HTML head for better performance

const router = createRouter({
    history: createWebHistory('/zh-CN/'),
    routes: setupLayouts(routes),
})

const app = createApp(App)

app.use(router)

registerPluginsWithoutRouter(app)

const settingsStore = useSettingsStore()

// 設定預設語言為簡體中文，並標記這是從 /zh-CN 路由進入
settingsStore.setDefaultLanguageFromRoute('zh-Hans-CN')
settingsStore.loadSettings()

app.mount('#app')