// Plugins
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import Fonts from "unplugin-fonts/vite";
import Layouts from "vite-plugin-vue-layouts";
import Vue from "@vitejs/plugin-vue";
import VueRouter from "unplugin-vue-router/vite";
import Vuetify, { transformAssetUrls } from "vite-plugin-vuetify";
import { beasties } from 'vite-plugin-beasties'

// Utilities
import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";

const INVALID_CHAR_REGEX = /[\u0000-\u001F"#\$&*+,:;<=>?[\]^`{|}\u007F]/g;
const DRIVE_LETTER_REGEX = /^[a-z]:/i;

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  plugins: [
    VueRouter(),
    Layouts(),
    Vue({
      template: { transformAssetUrls },
    }),
    Vuetify({
      autoImport: true,
      styles: {
        configFile: "src/styles/settings.scss",
      },
    }),
    Components(),
    Fonts({
      google: {
        families: [
          {
            name: "Roboto",
            styles: "wght@100;300;400;500;700;900",
          },
        ],
      },
    }),
    AutoImport({
      imports: ["vue", "vue-router"],
      eslintrc: {
        enabled: true,
      },
      vueTemplate: true,
    }),
    beasties({
      // `beasties` 的配置選項
      // `options` 物件會直接傳遞給底層的 `beasties` 核心庫
      options: {
        // `preload` 設置為 'swap' 是官方推薦的一種高效異步加載策略
        // 它會讓 <link> 標籤變成 <link rel="stylesheet" ... media="print" onload="this.media='all'">
        // 與我們之前的目標一致
        preload: 'swap',

        // 為禁用了 JavaScript 的瀏覽器提供一個備用樣式表
        noscriptFallback: true,

        // 壓縮內聯的 CSS
        compress: true,
      }
    }),
  ],
  define: { "process.env": {} },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
    extensions: [".js", ".json", ".jsx", ".mjs", ".ts", ".tsx", ".vue"],
  },
  server: {
    port: 3001,
    hmr: {
      overlay: false
    },
    proxy: {
      '/api/bd2-proxy': {
        target: 'https://bd2-official-proxy.zzz-archive-back-end.workers.dev',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/bd2-proxy/, ''),
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('Sending Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
          });
        },
      },
      '/api/db2pulse': {
        target: 'https://thedb2pulse-api.zzz-archive-back-end.workers.dev',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/db2pulse/, ''),
      },
      '/api/redeem': {
        target: 'https://bd2redeem.zzz-archive-back-end.workers.dev',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/redeem/, ''),
      },

    }
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['vue', 'vue-router', 'pinia'],
          'vuetify': ['vuetify'],
          'utils': ['js-cookie']
        },
        sanitizeFileName(name) {
          const match = DRIVE_LETTER_REGEX.exec(name);
          const driveLetter = match ? match[0] : "";
          return (
            driveLetter +
            name.slice(driveLetter.length).replace(INVALID_CHAR_REGEX, "")
          );
        },
      },
    },
  },
  optimizeDeps: {
    include: ['vue', 'vue-router', 'pinia', 'vuetify']
  }
});
