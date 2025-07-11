/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

// BD2 Dark Theme
const bd2DarkTheme = {
  dark: true,
  colors: {
    background: '#0a0a0a',
    surface: '#1a1a1a',
    'on-surface': '#e7e7e7',
    'surface-container': '#2a2a2a',
    'on-surface-container': '#d1d1d1',
    'outline': '#797979',
    'on-surface-variant': '#e7e7e7',
    primary: '#e72857',
    'on-primary': '#ffffff',
    'primary-container': '#c41e47',
    'on-primary-container': '#ffffff',
    secondary: '#424242',
    'on-secondary': '#ffffff',
    error: '#ff5252',
    'on-error': '#ffffff',
    info: '#2196f3',
    success: '#4caf50',
    warning: '#ffc107',
  },
  variables: {
    'border-color': '#797979',
    'border-opacity': 1,
    'high-emphasis-opacity': 0.87,
    'medium-emphasis-opacity': 0.60,
    'disabled-opacity': 0.38,
    'idle-opacity': 0.04,
    'hover-opacity': 0.04,
    'focus-opacity': 0.12,
    'selected-opacity': 0.08,
    'activated-opacity': 0.12,
    'pressed-opacity': 0.12,
    'dragged-opacity': 0.08,
    'theme-kbd': '#212529',
    'theme-on-kbd': '#ffffff',
    'theme-code': '#f5f5f5',
    'theme-on-code': '#000000',
  }
}

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
  theme: {
    defaultTheme: 'bd2DarkTheme',
    themes: {
      bd2DarkTheme,
    },
  },
  defaults: {
    // 禁用自動字型載入
    global: {
      ripple: false,
    },
  },
})
