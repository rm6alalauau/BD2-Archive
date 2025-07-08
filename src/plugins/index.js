/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import vuetify from './vuetify'
import pinia from '@/stores'
import router from '@/router'
import { createApp } from 'vue'
import { t } from '@/locales'

// API URL 工具函數
export const getApiUrl = (endpoint) => {
  const isDev = import.meta.env.DEV;
  
  // 開發環境使用代理，避免 CORS 問題
  if (isDev) {
    if (endpoint.includes('thedb2pulse-api.zzz-archive-back-end.workers.dev')) {
      return endpoint.replace('https://thedb2pulse-api.zzz-archive-back-end.workers.dev', '/api/db2pulse');
    }
    if (endpoint.includes('bd2-official-proxy.zzz-archive-back-end.workers.dev')) {
      return endpoint.replace('https://bd2-official-proxy.zzz-archive-back-end.workers.dev', '/api/bd2-proxy');
    }
    if (endpoint.includes('bd2redeem.zzz-archive-back-end.workers.dev')) {
      return endpoint.replace('https://bd2redeem.zzz-archive-back-end.workers.dev', '/api/redeem');
    }
  }
  
  // 生產環境直接使用原始 URL
  return endpoint;
};

// iOS 檢測工具
export const isIOS = () => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) || 
         (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
};

// 獲取針對 iOS 優化的 fetch 配置
export const getOptimizedFetchConfig = (config = {}) => {
  const ios = isIOS();
  
  if (ios) {
    // iOS 優化配置
    return {
      ...config,
      // 減少超時時間，iOS Safari 對長時間請求不友好
      timeout: Math.min(config.timeout || 10000, 10000),
      // 添加 iOS 友好的 headers
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache',
        ...config.headers,
        // 移除可能導致問題的 headers
        'User-Agent': undefined,
      },
      // iOS Safari 需要明確的 mode 設置
      mode: config.mode || 'cors',
      // 禁用 cache 避免 iOS Safari 的緩存問題
      cache: 'no-store',
      // iOS Safari 對 credentials 敏感
      credentials: config.credentials || 'omit',
    };
  }
  
  // 非 iOS 設備使用原始配置
  return config;
};

// iOS 優化的 fetch 包裝器
export const iosFetch = async (url, config = {}) => {
  const optimizedConfig = getOptimizedFetchConfig(config);
  const timeout = optimizedConfig.timeout || 10000;
  
  // 創建 AbortController 用於超時控制
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    
    controller.abort();
  }, timeout);
  
  try {
    const response = await fetch(url, {
      ...optimizedConfig,
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    
    // iOS 特殊錯誤處理
    if (error.name === 'AbortError') {
      throw new Error(`iOS network timeout after ${timeout}ms`);
    }
    
    throw error;
  }
};

// 全局註冊工具函數
export function registerGlobalUtils(app) {
  app.config.globalProperties.$getApiUrl = getApiUrl;
  app.config.globalProperties.$isIOS = isIOS;
  app.config.globalProperties.$iosFetch = iosFetch;
  
  // 註冊多語言函數
  app.config.globalProperties.$t = t;
  
  // 也可以通過 provide/inject 提供
  app.provide('getApiUrl', getApiUrl);
  app.provide('isIOS', isIOS);
  app.provide('iosFetch', iosFetch);
  app.provide('t', t);
}

// 日誌控制工具
const isDev = import.meta.env.DEV || import.meta.env.MODE === 'development'

export const logger = {
  log: (...args) => {
    if (isDev) console.log(...args)
  },
  warn: (...args) => {
    if (isDev) console.warn(...args)
  },
  error: (...args) => {
    // 錯誤信息始終顯示
    console.error(...args)
  },
  info: (...args) => {
    if (isDev) console.info(...args)
  }
}

export function registerPlugins(app) {
  app
    .use(vuetify)
    .use(router)
    .use(pinia)
  
  // 註冊全局工具函數
  registerGlobalUtils(app);
  
  // 將 logger 添加到全局屬性
  app.config.globalProperties.$logger = logger
}
