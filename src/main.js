/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Import critical CSS first for better performance
import './styles/critical.css'

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { setupLayouts } from 'virtual:generated-layouts'
import { routes } from 'vue-router/auto-routes'
import { registerPluginsWithoutRouter } from '@/plugins'
import { useSettingsStore } from './stores/settings'

const router = createRouter({
  history: createWebHistory('/'),
  routes: setupLayouts(routes),
})

const app = createApp(App)
app.use(router)
registerPluginsWithoutRouter(app)

const settingsStore = useSettingsStore()
settingsStore.loadSettings()

app.mount('#app')
