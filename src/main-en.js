/**
 * main-en.js - English entry point (optimized)
 */

import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { setupLayouts } from 'virtual:generated-layouts'
import { routes } from 'vue-router/auto-routes'
import { registerPluginsWithoutRouter } from '@/plugins'
import { useSettingsStore } from './stores/settings'
import App from './App.vue'
import './styles/critical.css'

const router = createRouter({
  history: createWebHistory('/en/'),
  routes: setupLayouts(routes),
})

const app = createApp(App)
app.use(router)
registerPluginsWithoutRouter(app)

const settingsStore = useSettingsStore()
settingsStore.setDefaultLanguageFromRoute('en')
settingsStore.loadSettings()

app.mount('#app')