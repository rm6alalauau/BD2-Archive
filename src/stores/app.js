// Utilities
import { defineStore } from 'pinia'
import { getApiUrl } from '@/plugins/index.js'

// 重試工具函數
const retryFetch = async (url, options = {}, maxRetries = 3, delayMs = 1000) => {
  let lastError;
  
  // 檢測是否為 iOS 設備
  const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                     (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  
  // iOS 設備使用更保守的重試策略
  const effectiveMaxRetries = isIOSDevice ? 2 : maxRetries; // iOS 減少重試次數
  const effectiveDelay = isIOSDevice ? delayMs * 0.5 : delayMs; // iOS 使用更短的延遲
  
  for (let attempt = 1; attempt <= effectiveMaxRetries; attempt++) {
    try {
      
      // 檢查是否為 Google Apps Script URL，使用不同的配置
      const isGoogleAppsScript = url.includes('script.google.com');
      
      // iOS 設備使用更短的超時
      const timeoutMs = isIOSDevice ? 8000 : 15000;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
      
      let fetchOptions;
      if (isGoogleAppsScript) {
        // 對 Google Apps Script 使用最簡單的配置，避免觸發預檢請求
        fetchOptions = {
          ...options,
          signal: controller.signal,
          // iOS 特殊優化
          ...(isIOSDevice && {
            cache: 'no-store',
            mode: 'cors',
            credentials: 'omit',
          }),
        };
      } else {
        // 對其他 API 使用完整配置
        fetchOptions = {
          ...options,
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
            ...options.headers
          },
          // iOS 特殊優化
          ...(isIOSDevice && {
            cache: 'no-store',
            mode: 'cors',
            credentials: 'omit',
          }),
        };
      }
      
      const response = await fetch(url, fetchOptions);
      clearTimeout(timeoutId);
      
      // 檢查回應狀態
      if (response.ok) {
        return response;
      }
      
      // 5xx 錯誤值得重試，4xx 錯誤通常不值得重試
      if (response.status >= 500 && attempt < effectiveMaxRetries) {
        throw new Error(`Server error ${response.status}, will retry...`);
      } else if (response.status >= 400) {
        throw new Error(`Client error ${response.status}: ${response.statusText}`);
      }
      
      throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
      
    } catch (error) {
      lastError = error;
      
      // 如果是最後一次嘗試，拋出錯誤
      if (attempt === effectiveMaxRetries) {
        throw error;
      }
      
      // 判斷是否值得重試
      const isRetryableError = 
        error.name === 'AbortError' || // 超時
        error.message.includes('Failed to fetch') || // 網路問題
        error.message.includes('NetworkError') || // 網路問題
        error.message.includes('Server error') || // 5xx 錯誤
        error.message.includes('Load failed'); // 載入失敗
      
      if (!isRetryableError) {
        throw error;
      }
      
      // 指數退避：每次重試延遲時間加倍，iOS 使用更短的延遲
      const delay = effectiveDelay * Math.pow(2, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
};

export const useAppStore = defineStore('app', {
  state: () => ({
    // API數據
    apiData: {
      redeem: [],
      baha: [],
      nga: [],
      ptt: [],
      x: [],
      reddit: [],
      pixiv: []
    },
    // 載入狀態
    loading: false,
    // 錯誤狀態
    error: null,
    // 最後更新時間
    lastUpdated: null,
    // 最後加載時間
    lastFetchTime: null
  }),
  
  actions: {
    // 通用數據獲取方法，支持緩存和重試
    async fetchAllData() {
      // 檢測設備類型
      const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                         (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      
      this.loading = true;
      this.error = null;
      
      // 檢查是否已有緩存數據（5分鐘內）
      const now = Date.now();
      const cacheValid = this.lastFetchTime && (now - this.lastFetchTime < 5 * 60 * 1000);
      
      if (cacheValid && this.hasValidData()) {
        this.loading = false;
        return;
      }
      
      try {
        // iOS 使用順序載入，避免併發請求問題
        if (isIOSDevice) {
          await this.fetchDataSequentially();
        } else {
          await this.fetchDataInParallel();
        }
        
        // 記錄成功的加載時間
        this.lastFetchTime = now;
        
      } catch (error) {
        console.error('📱 Error fetching data:', error);
        this.error = error.message || 'Failed to fetch data';
      } finally {
        this.loading = false;
      }
    },
    
    // iOS 順序加載策略
    async fetchDataSequentially() {
      const tasks = [
        { name: 'redeemCodes', fn: () => this.fetchRedeemCodes() },
        { name: 'forumData', fn: () => this.fetchForumData() },
        { name: 'news', fn: () => this.fetchNews() },
        { name: 'officialMedia', fn: () => this.fetchOfficialMedia() },
        { name: 'pixivCards', fn: () => this.fetchPixivCards() },
      ];
      
      for (const task of tasks) {
        try {
          await task.fn();
          
          // 在 iOS 上添加小延遲，避免請求過於密集
          await new Promise(resolve => setTimeout(resolve, 200));
        } catch (error) {
          // 不中斷整個流程，繼續載入其他數據
        }
      }
    },
    
    // 非 iOS 並行加載策略
    async fetchDataInParallel() {
      const tasks = [
        this.fetchRedeemCodes().catch(e => {}),
        this.fetchForumData().catch(e => {}),
        this.fetchNews().catch(e => {}),
        this.fetchOfficialMedia().catch(e => {}),
        this.fetchPixivCards().catch(e => {}),
      ];
      
      // 等待所有任務完成，即使某些失敗也不會影響其他
      await Promise.allSettled(tasks);
    },
    
    // 手動重試API調用
    async retryFetchAllData() {
      // 清除之前的錯誤狀態
      this.error = null;
      
      // 重置為備用數據，以防重試也失敗
      if (this.apiData.redeem.some(item => item.code === 'API_ERROR')) {
        this.apiData.redeem = [];
      }
      
      // 調用原本的 fetch 方法
      return await this.fetchAllData();
    },
    
    // 獲取新聞數據
    async fetchNews() {
      // 這裡可以添加具體的新聞 API 調用
      // 暫時保持空實現，等待具體的 API 端點
    },
    
    // 獲取官方媒體數據
    async fetchOfficialMedia() {
      // 這裡可以添加具體的官方媒體 API 調用
      // 暫時保持空實現，等待具體的 API 端點
    },
    
    // 獲取 Pixiv 卡片數據
    async fetchPixivCards() {
      try {
        // 使用自己的 API 端點，就像論壇和兌換碼一樣
        const originalUrl = 'https://thedb2pulse-api.zzz-archive-back-end.workers.dev/pixiv';
        const apiUrl = getApiUrl(originalUrl);
        
        const response = await retryFetch(apiUrl);
        const data = await response.json();
        
        // 更新 Pixiv 數據
        this.apiData.pixiv = data || [];
        
      } catch (error) {
        console.error("Error fetching pixiv data:", error);
        
        // 設置空數組，避免UI錯誤
        this.apiData.pixiv = [];
        
        throw error; // 重新拋出錯誤，讓上層處理
      }
    },
    
    // 獲取兌換碼數據
    async fetchRedeemCodes() {
      try {
        // 檢查是否為開發環境並使用代理 URL
        const originalUrl = 'https://thedb2pulse-api.zzz-archive-back-end.workers.dev/redeem';
        const apiUrl = getApiUrl(originalUrl);
        
        const response = await retryFetch(apiUrl);
        const data = await response.json();
        
        // 更新兌換碼數據
        this.apiData.redeem = data || [];
        
      } catch (error) {
        console.error("Error fetching redeem codes:", error);
        
        // 設置備用數據
        this.apiData.redeem = [
          {
            code: 'API_ERROR',
            reward: '無法連接到兌換碼服務器',
            status: '錯誤'
          }
        ];
        
        throw error; // 重新拋出錯誤，讓上層處理
      }
    },

    // 獲取論壇數據
    async fetchForumData() {
      // 定義所有論壇API端點
      const forumApis = [
        { name: 'baha', url: 'https://thedb2pulse-api.zzz-archive-back-end.workers.dev/baha', key: 'baha' },
        { name: 'nga', url: 'https://thedb2pulse-api.zzz-archive-back-end.workers.dev/nga', key: 'nga' },
        { name: 'ptt', url: 'https://thedb2pulse-api.zzz-archive-back-end.workers.dev/ptt', key: 'ptt' },
        { name: 'reddit', url: 'https://thedb2pulse-api.zzz-archive-back-end.workers.dev/reddit', key: 'reddit' },
        { name: 'x', url: 'https://thedb2pulse-api.zzz-archive-back-end.workers.dev/x', key: 'x' }
      ];
      
      const results = await Promise.allSettled(
        forumApis.map(async (forum) => {
          try {
            const apiUrl = getApiUrl(forum.url);
            
            const response = await retryFetch(apiUrl);
            const data = await response.json();
            
            // 更新對應的數據
            this.apiData[forum.key] = data || [];
            
            return { forum: forum.name, success: true };
          } catch (error) {
            console.error(`Error fetching ${forum.name} data:`, error);
            
            // 設置空數組，避免UI錯誤
            this.apiData[forum.key] = [];
            
            return { forum: forum.name, success: false, error: error.message };
          }
        })
      );
      
      // 檢查結果
      const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
      const failed = results.length - successful;
      
      // 更新最後更新時間
      this.lastUpdated = new Date();
      
      // 即使部分失敗也不拋出錯誤，讓其他數據能正常顯示
      if (successful === 0) {
        throw new Error('All forum APIs failed to load');
      }
    },
  },
  
  getters: {
    // 兌換碼數據
    redeemCodes: (state) => state.apiData.redeem,
    // 論壇數據
    forumData: (state) => ({
      Bahamut: state.apiData.baha,
      NGAList: state.apiData.nga,
      PTTList: state.apiData.ptt,
      XPosts: state.apiData.x,
      RedditPosts: state.apiData.reddit
    }),
    // 是否有數據
    hasData: (state) => state.lastUpdated !== null,
    // 是否有有效數據
    hasValidData: (state) => state.lastFetchTime && (Date.now() - state.lastFetchTime < 5 * 60 * 1000)
  }
})
