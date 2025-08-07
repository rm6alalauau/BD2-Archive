/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Import critical CSS first for better performance
import './styles/critical.css'

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'
import { useSettingsStore } from './stores/settings'

const app = createApp(App)

registerPlugins(app)

const settingsStore = useSettingsStore()
settingsStore.loadSettings()

app.mount('#app')
