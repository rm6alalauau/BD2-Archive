// Utilities
import { defineStore } from 'pinia'

// 重試工具函數
const retryFetch = async (url, options = {}, maxRetries = 3, delayMs = 1000) => {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`API Request attempt ${attempt}/${maxRetries} to:`, url);
      
      // 設置合理的超時時間
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15秒超時
      
      // 檢查是否為 Google Apps Script URL，使用不同的配置
      const isGoogleAppsScript = url.includes('script.google.com');
      
      let fetchOptions;
      if (isGoogleAppsScript) {
        // 對 Google Apps Script 使用最簡單的配置，避免觸發預檢請求
        fetchOptions = {
          ...options,
          signal: controller.signal,
          // 不添加任何自定義 headers，保持簡單請求
        };
      } else {
        // 對其他 API 使用完整配置
        fetchOptions = {
          ...options,
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
            ...options.headers
          }
        };
      }
      
      const response = await fetch(url, fetchOptions);
      clearTimeout(timeoutId);
      
      // 檢查回應狀態
      if (response.ok) {
        console.log(`API Request successful on attempt ${attempt}`);
        return response;
      }
      
      // 5xx 錯誤值得重試，4xx 錯誤通常不值得重試
      if (response.status >= 500 && attempt < maxRetries) {
        throw new Error(`Server error ${response.status}, will retry...`);
      } else if (response.status >= 400) {
        throw new Error(`Client error ${response.status}: ${response.statusText}`);
      }
      
      throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
      
    } catch (error) {
      lastError = error;
      console.warn(`API Request attempt ${attempt} failed:`, error.message);
      
      // 如果是最後一次嘗試，拋出錯誤
      if (attempt === maxRetries) {
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
        console.log('Non-retryable error, giving up:', error.message);
        throw error;
      }
      
      // 指數退避：每次重試延遲時間加倍
      const delay = delayMs * Math.pow(2, attempt - 1);
      console.log(`Waiting ${delay}ms before retry...`);
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
      reddit: []
    },
    // 載入狀態
    loading: false,
    // 錯誤狀態
    error: null,
    // 最後更新時間
    lastUpdated: null
  }),
  
  actions: {
    async fetchAllData() {
      if (this.loading) {
        console.log("Already loading, skipping...");
        return; // 避免重複請求
      }
      
      console.log("Starting to fetch all data...");
      this.loading = true;
      this.error = null;
      
      try {
        const url = 'https://script.google.com/macros/s/AKfycbz0bIpZn-brdmlGLy7qHchcX1BBKtbH27EPVM3i3IYu2NwJ8Ufqa6lRz8MukOOGE2rt/exec';
        console.log("Fetching from:", url);
        
        const response = await retryFetch(url);
        
        const data = await response.json();
        console.log("Global API Response:", data);
        
        // 更新所有數據
        this.apiData.redeem = data.redeem || [];
        this.apiData.baha = data.baha || [];
        this.apiData.nga = data.nga || [];
        this.apiData.ptt = data.ptt || [];
        this.apiData.x = data.x || [];
        this.apiData.reddit = data.reddit || [];
        
        this.lastUpdated = new Date();
        console.log("Data updated successfully");
        
      } catch (error) {
        console.error("Error fetching global data:", error);
        this.error = error.message;
        
        // 設置一些備用數據，避免完全空白
        this.apiData.redeem = [
          {
            code: 'API_ERROR',
            reward: '無法連接到服務器',
            status: '錯誤'
          }
        ];
        
      } finally {
        this.loading = false;
        console.log("Fetch completed, loading:", this.loading);
      }
    },
    
    // 手動重試API調用
    async retryFetchAllData() {
      console.log("Manual retry requested by user");
      // 清除之前的錯誤狀態
      this.error = null;
      
      // 重置為備用數據，以防重試也失敗
      if (this.apiData.redeem.some(item => item.code === 'API_ERROR')) {
        this.apiData.redeem = [];
      }
      
      // 調用原本的 fetch 方法
      return await this.fetchAllData();
    }
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
    hasData: (state) => state.lastUpdated !== null
  }
})
