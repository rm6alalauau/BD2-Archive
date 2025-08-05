# The BD2 Pulse

A gaming information aggregation platform for Brown Dust 2 players.

## Tech Stack

**Frontend Framework**
- Vue 3 with Composition API
- Vite for build tooling and development server

**UI Framework & Styling**
- Vuetify 3 (Material Design 3)
- SCSS for custom styling
- Material Design Icons

**State Management & Routing**
- Pinia for state management
- Vue Router with file-based routing
- Persistent settings with localStorage

**Performance & Optimization**
- Critical CSS inlining with Beasties
- Image optimization and lazy loading
- Font preloading and optimization

**Development Tools**
- Auto-import for components and composables
- Hot Module Replacement (HMR)
- ESLint for code quality

**Internationalization**
- Multi-language support (Traditional Chinese, Simplified Chinese, English, Japanese, Korean)
- Dynamic language switching with persistent preferences

## Architecture

```
src/
├── components/          # Reusable Vue components
├── layouts/            # Layout components
├── locales/            # Internationalization files
├── pages/              # Route-based page components
├── plugins/            # Vue plugins and configurations
├── router/             # Vue Router configuration
├── stores/             # Pinia stores
├── styles/             # Global styles and SCSS
└── utils/              # Utility functions
```

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## 📑 License
[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2016-present Vuetify, LLC
