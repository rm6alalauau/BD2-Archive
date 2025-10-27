# The BD2 Pulse

A fan-made information aggregation platform for Brown Dust 2 players.

> ⚠️ **Note**: This is an unofficial fan site with no affiliation to the game's developers or publishers.

## ✨ Features

- 📰 **Official News** - Stay updated with the latest game announcements
- 💬 **Community Forums** - Aggregate posts from Bahamut, PTT, NGA, Reddit, and more
- 🎨 **Fan Creations** - Discover amazing artwork on Pixiv
- 📱 **Redeem Codes** - Quick access to active redemption codes
- 🔔 **Push Notifications** - Get notified when new redeem codes are available
- 🌐 **Multi-language** - Support for Traditional Chinese, Simplified Chinese, English, Japanese, and Korean
- ⚙️ **Customizable** - Adjust font size, toggle content filters, and more

## 🛠️ Tech Stack

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

## 📁 Architecture

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

## 🚀 Quick Start

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Design Resources

- [Figma Community File](https://www.figma.com/community/file/1441663496302710815/zzz-archive)

## 📑 License

[MIT](http://opensource.org/licenses/MIT)

---

**Disclaimer**: This is a fan-created unofficial information site with no affiliation to NEOWIZ or the Brown Dust 2 operations team.
