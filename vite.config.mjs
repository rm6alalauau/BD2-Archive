// Plugins
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import Fonts from "unplugin-fonts/vite";
import Layouts from "vite-plugin-vue-layouts";
import Vue from "@vitejs/plugin-vue";
import VueRouter from "unplugin-vue-router/vite";
import Vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

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
    {
      name: 'html-transform',
      transformIndexHtml: {
        order: 'post',
        handler(html) {
          let transformedHtml = html;
          
          // 移除所有字型檔案的預載入標籤
          transformedHtml = transformedHtml.replace(
            /<link[^>]*rel="preload"[^>]*as="font"[^>]*>/g,
            ''
          );
          
          // 移除包含字型檔案路徑的預載入標籤
          transformedHtml = transformedHtml.replace(
            /<link[^>]*rel="preload"[^>]*materialdesignicons[^>]*>/g,
            ''
          );
          
          // 移除包含 .woff, .woff2, .ttf, .eot 的預載入標籤
          transformedHtml = transformedHtml.replace(
            /<link[^>]*rel="preload"[^>]*\.(woff|woff2|ttf|eot)[^>]*>/g,
            ''
          );
          
          // 移除無效的 type 屬性
          transformedHtml = transformedHtml.replace(
            /<link[^>]*rel="preload"[^>]*type="[^"]*"[^>]*>/g,
            (match) => {
              return match.replace(/type="[^"]*"/g, '');
            }
          );
          
          // 為所有 preload 標籤添加 crossorigin 屬性（如果沒有的話）
          transformedHtml = transformedHtml.replace(
            /<link([^>]*rel="preload"[^>]*)(?!.*crossorigin)/g,
            '<link$1 crossorigin="anonymous"'
          );
          
          return transformedHtml;
        }
      }
    }
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
  },
  optimizeDeps: {
    include: ['vue', 'vue-router', 'pinia', 'vuetify'],
    exclude: ['@mdi/font']
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
