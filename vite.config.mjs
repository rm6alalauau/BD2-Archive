// Plugins
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import Fonts from "unplugin-fonts/vite";
import Layouts from "vite-plugin-vue-layouts";
import Vue from "@vitejs/plugin-vue";
import VueRouter from "unplugin-vue-router/vite";
import Vuetify, { transformAssetUrls } from "vite-plugin-vuetify";
import { beasties } from "vite-plugin-beasties";

// Utilities
import { defineConfig } from "vite";

// 移除 MDI 字體預載入的插件
function removeMDIPreload() {
  return {
    name: 'remove-mdi-preload',
    transformIndexHtml(html) {
      // 移除 MDI 字體的預載入標籤
      return html.replace(
        /<link[^>]*rel=["'](?:modulepreload|preload)["'][^>]*materialdesignicons[^>]*>/gi,
        ''
      );
    }
  };
}
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
    // Beasties plugin for Critical CSS
    beasties({
      options: {
        preload: 'swap',
        inlineThreshold: 0,
        minimumExternalSize: 0,
        pruneSource: false,
        preloadFonts: false,
        inlineFonts: false,
        // 針對行動裝置優化
        criticalThreshold: 0,
        criticalTestPage: '/',
        // 更激進的內聯策略
        inlineCritical: true,
        // 減少外部資源
        externalThreshold: 0,
        // 更激進的效能優化
        inlineStylesheets: true,
        // 內聯所有關鍵 CSS
        inlineCriticalThreshold: 0,
      }
    }),
    // 移除 MDI 字體預載入以避免警告
    removeMDIPreload(),
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
        target: 'https://api.thebd2pulse.com',
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
  publicDir: 'public',
  build: {
    chunkSizeWarningLimit: 800, // 降低警告閾值，針對行動裝置優化
    rollupOptions: {
      input: {
        main: 'index.html',
        'en': 'en.html',
        'ja-JP': 'ja-JP.html',
        'ko-KR': 'ko-KR.html',
        'zh-CN': 'zh-CN.html'
      },
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
        // 確保CSS文件正確生成
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/\.(css)$/.test(assetInfo.name)) {
            return `assets/[name]-[hash].${ext}`;
          }
          return `assets/[name]-[hash].${ext}`;
        },
      },
    },
    // 添加更穩定的構建設定
    sourcemap: false,
    minify: 'esbuild',
    target: 'es2015',
    // CSS優化設定
    cssCodeSplit: true,
    cssMinify: true,
    // 針對行動裝置的額外優化
    assetsInlineLimit: 4096, // 內聯小於4KB的資源
  },
  optimizeDeps: {
    include: ['vue', 'vue-router', 'pinia', 'vuetify'],
  },
  // 禁用字型預載入
  experimental: {
    renderBuiltUrl(filename, { hostType }) {
      if (hostType === 'js') {
        return { relative: true }
      } else {
        return { relative: true }
      }
    }
  }
});
