/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
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

// Import MDI font with proper preload handling
import '@mdi/font/css/materialdesignicons.css'

const app = createApp(App)

registerPlugins(app)

const settingsStore = useSettingsStore()
settingsStore.loadSettings()

app.mount('#app')
