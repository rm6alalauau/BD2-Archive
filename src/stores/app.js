// Utilities
import { defineStore } from 'pinia'

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
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
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
