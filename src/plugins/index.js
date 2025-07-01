/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import vuetify from './vuetify'
import pinia from '@/stores'
import router from '@/router'

// API URL 工具函數
export const getApiUrl = (endpoint) => {
  const isDev = import.meta.env.DEV;
  
  // 開發環境使用代理，避免 CORS 問題
  if (isDev) {
    if (endpoint.includes('bd2-official-proxy.zzz-archive-back-end.workers.dev')) {
      return endpoint.replace('https://bd2-official-proxy.zzz-archive-back-end.workers.dev', '/api/bd2-proxy');
    }
    if (endpoint.includes('bd2redeem.zzz-archive-back-end.workers.dev')) {
      return endpoint.replace('https://bd2redeem.zzz-archive-back-end.workers.dev', '/api/redeem');
    }
    if (endpoint.includes('api.obfs.dev')) {
      return endpoint.replace('https://api.obfs.dev', '/api/pixiv');
    }
  }
  
  // 生產環境直接使用原始 URL
  return endpoint;
};

// 全局註冊工具函數
export function registerGlobalUtils(app) {
  app.config.globalProperties.$getApiUrl = getApiUrl;
  
  // 也可以通過 provide/inject 提供
  app.provide('getApiUrl', getApiUrl);
}

export function registerPlugins (app) {
  app
    .use(vuetify)
    .use(router)
    .use(pinia)
  
  // 註冊全局工具函數
  registerGlobalUtils(app);
}
