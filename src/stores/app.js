// Utilities
import { defineStore } from 'pinia'
import { getApiUrl, customFetch } from '@/plugins/index.js'

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

      // 根據 URL 選擇使用 customFetch 或普通 fetch
      const isThebd2pulseApi = url.includes('api.thebd2pulse.com') || url.includes('/api/db2pulse');
      const response = isThebd2pulseApi
        ? await customFetch(url, fetchOptions)
        : await fetch(url, fetchOptions);
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

// 獲取用戶選擇的論壇設定
const getUserSelectedForums = () => {
  try {
    const saved = localStorage.getItem('bd2_settings');
    if (saved) {
      const settings = JSON.parse(saved);
      return settings.selectedForums || ['Bahamut', 'NGAList', 'PTTList', 'XPosts', 'RedditPosts'];
    }
  } catch (error) {
    console.error('載入論壇設定時發生錯誤:', error);
  }
  return ['Bahamut', 'NGAList', 'PTTList', 'XPosts', 'RedditPosts']; // 預設全選（不包含Naver）
};

// 論壇 API 配置映射 - 更新為新的統一 API
const FORUM_API_CONFIG = {
  'Bahamut': { name: 'baha', key: 'baha' },
  'NGAList': { name: 'nga', key: 'nga' },
  'PTTList': { name: 'ptt', key: 'ptt' },
  'RedditPosts': { name: 'reddit', key: 'reddit' },
  'XPosts': { name: 'x', key: 'x' }
};

// Naver 使用獨立的 API 端點
const NAVER_API_ENDPOINT = 'https://api.thebd2pulse.com/naver';

// 新的統一論壇 API 端點
const FORUMS_API_ENDPOINT = 'https://api.thebd2pulse.com/forums';

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
      naver: [],
      pixiv: [],
      gameEvents: []
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
        this.error = error.message || 'Failed to fetch data';
      } finally {
        this.loading = false;
      }
    },

    // iOS 順序加載策略
    async fetchDataSequentially() {
      // 優先載入論壇數據，因為它是用戶最常查看的內容
      const priorityTasks = [
        { name: 'forumData', fn: () => this.fetchForumData() },
      ];

      const secondaryTasks = [
        { name: 'redeemCodes', fn: () => this.fetchRedeemCodes() },
        { name: 'news', fn: () => this.fetchNews() },
        { name: 'gameEvents', fn: () => this.fetchGameEvents() },
        { name: 'officialMedia', fn: () => this.fetchOfficialMedia() },
      ];

      // 先載入優先任務
      for (const task of priorityTasks) {
        try {
          await task.fn();
        } catch (error) {
          // 不中斷整個流程，繼續載入其他數據
        }
      }

      // 然後載入次要任務
      for (const task of secondaryTasks) {
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
      // 優先載入論壇數據
      const priorityTasks = [
        this.fetchForumData().catch(e => { }),
      ];

      const secondaryTasks = [
        this.fetchRedeemCodes().catch(e => { }),
        this.fetchNews().catch(e => { }),
        this.fetchGameEvents().catch(e => { }),
        this.fetchOfficialMedia().catch(e => { }),
      ];

      // 先等待優先任務完成
      await Promise.allSettled(priorityTasks);

      // 然後載入次要任務
      await Promise.allSettled(secondaryTasks);
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

    // 獲取遊戲活動數據
    async fetchGameEvents() {
      // Mock Data
      const mockGameEvents = [
        {
          "id": "event_001",
          "type": "banner_character",
          "startTime": "2024-12-20T00:00:00+08:00",
          "endTime": "2030-01-10T23:59:59+08:00",
          "title": {
            "zh-Hant-TW": "[復刻] 劍道社 - 尤斯緹亞",
            "en": "[Rerun] Kendo Club - Justia",
            "ja-JP": "[復刻] 剣道部 - ユースティア",
            "ko-KR": "[복각] 검도부 - 유스티아",
            "zh-Hans-CN": "[复刻] 剑道社 - 尤斯缇亚"
          }
        },
        {
          "id": "event_002",
          "type": "event",
          "startTime": "2024-12-25T00:00:00+08:00",
          "endTime": "2030-01-15T23:59:59+08:00",
          "title": {
            "zh-Hant-TW": "冬季登入獎勵",
            "en": "Winter Attendance Event",
            "ja-JP": "冬のログインボーナス",
            "ko-KR": "겨울 출석 이벤트",
            "zh-Hans-CN": "冬季登录奖励"
          }
        },
        {
          "id": "event_003",
          "type": "season_pass",
          "startTime": "2024-12-01T00:00:00+08:00",
          "endTime": "2030-02-01T23:59:59+08:00",
          "title": {
            "zh-Hant-TW": "賽季通行證：雪花",
            "en": "Season Pass: Snowflake",
            "ja-JP": "シーズンパス：雪の華",
            "ko-KR": "시즌 패스: 눈꽃",
            "zh-Hans-CN": "赛季通行证：雪花"
          }
        },
        {
          "id": "event_004",
          "type": "abyss",
          "startTime": "2025-01-01T00:00:00+08:00",
          "endTime": "2030-01-14T23:59:59+08:00",
          "title": {
            "zh-Hant-TW": "惡魔城：傲慢之塔",
            "en": "Evil Castle: Tower of Pride",
            "ja-JP": "悪魔城：傲慢の塔",
            "ko-KR": "악마성: 오만의 탑",
            "zh-Hans-CN": "恶魔城：傲慢之塔"
          }
        },
        {
          "id": "event_new_char",
          "type": "banner_character",
          "startTime": "2025-01-04T00:00:00+08:00",
          "endTime": "2030-01-18T23:59:59+08:00",
          "title": {
            "zh-Hant-TW": "[新] 代號S - 莎赫拉查德",
            "en": "[New] Code Name S - Scheherazade",
            "ja-JP": "[新規] コードネームS - 谢拉查德",
            "ko-KR": "[신규] 코드네임 S - 세헤라자드",
            "zh-Hans-CN": "[新] 代号S - 莎赫拉查德"
          }
        },
        {
          "id": "event_raid",
          "type": "event",
          "startTime": "2025-01-10T00:00:00+08:00",
          "endTime": "2030-01-24T23:59:59+08:00",
          "title": {
            "zh-Hant-TW": "魔獸追蹤者：黑曜石",
            "en": "Fiend Hunter: Obsidian",
            "ja-JP": "魔獣チェイサー：オブシディアン",
            "ko-KR": "마수 추적자: 흑요석",
            "zh-Hans-CN": "魔兽追踪者：黑曜石"
          }
        },
        {
          "id": "event_mini",
          "type": "minigame",
          "startTime": "2025-01-01T00:00:00+08:00",
          "endTime": "2030-01-31T23:59:59+08:00",
          "title": {
            "zh-Hant-TW": "迷你遊戲：大逃殺",
            "en": "Mini-game: Battle Royale",
            "ja-JP": "ミニゲーム：バトルロイヤル",
            "ko-KR": "미니게임: 배틀로얄",
            "zh-Hans-CN": "迷你游戏：大逃杀"
          }
        }
      ];

      try {
        const apiUrl = getApiUrl('https://api.thebd2pulse.com/events');

        // 嘗試獲取數據
        const response = await retryFetch(apiUrl);
        const data = await response.json();

        if (data && Array.isArray(data)) {
          this.apiData.gameEvents = data;

          if (data.length === 0) {
            console.warn('Events API returned empty array');
          }
        } else {
          // 如果數據格式不正確，使用 Mock Data
          console.warn('Events API returned invalid format, utilizing mock data');
          this.apiData.gameEvents = mockGameEvents;
        }

      } catch (error) {
        console.error("Error fetching game events:", error);
        // 發生錯誤時使用 Mock Data，確保 UI 有東西顯示
        this.apiData.gameEvents = mockGameEvents;
      }
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

    // 獲取意見回饋追蹤數據
    async fetchFeedbackData() {
      try {
        const apiUrl = getApiUrl('https://api.thebd2pulse.com/feedback');
        const response = await retryFetch(apiUrl);
        const data = await response.json();

        // 返回意見回饋數據陣列
        return data || [];

      } catch (error) {
        console.error("Error fetching feedback data:", error);
        return [];
      }
    },

    // 獲取兌換碼數據
    async fetchRedeemCodes() {
      try {
        // 檢查是否為開發環境並使用代理 URL
        const originalUrl = 'https://api.thebd2pulse.com/redeem';
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

    // 獲取論壇數據 - 使用新的統一 API 和 Naver 獨立 API
    async fetchForumData() {
      try {
        // 獲取統一論壇 API 數據
        const apiUrl = getApiUrl(FORUMS_API_ENDPOINT);
        const response = await retryFetch(apiUrl);
        const data = await response.json();

        // 解析統一 API 返回的數據
        if (data && typeof data === 'object') {
          // 更新各個論壇的數據
          Object.keys(FORUM_API_CONFIG).forEach(forumName => {
            const config = FORUM_API_CONFIG[forumName];
            const forumData = data[config.key] || [];

            // 更新對應的數據
            this.apiData[config.key] = forumData;
          });

          // 處理 Pixiv 數據（如果有的話）
          if (data.pixiv) {
            this.apiData.pixiv = data.pixiv;
          }

        } else {
          console.warn('論壇 API 返回的數據格式不正確');
          // 設置空數據
          Object.keys(FORUM_API_CONFIG).forEach(forumName => {
            const config = FORUM_API_CONFIG[forumName];
            this.apiData[config.key] = [];
          });
        }

        // 獲取 Naver 數據（使用獨立 API）
        try {
          const naverApiUrl = getApiUrl(NAVER_API_ENDPOINT);
          const naverResponse = await retryFetch(naverApiUrl);
          const naverData = await naverResponse.json();

          if (naverData && Array.isArray(naverData)) {
            this.apiData.naver = naverData;
          } else {
            console.warn('Naver API 返回的數據格式不正確');
            this.apiData.naver = [];
          }
        } catch (naverError) {
          console.error("Error fetching Naver data:", naverError);
          this.apiData.naver = [];
        }

        // 更新最後更新時間
        this.lastUpdated = new Date();

      } catch (error) {
        console.error("Error fetching forum data:", error);

        // 設置空數組，避免UI錯誤
        Object.keys(FORUM_API_CONFIG).forEach(forumName => {
          const config = FORUM_API_CONFIG[forumName];
          this.apiData[config.key] = [];
        });
        this.apiData.naver = [];

        throw error;
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
      RedditPosts: state.apiData.reddit,
      NaverPosts: state.apiData.naver // Naver 保持獨立
    }),
    // 遊戲活動數據
    gameEvents: (state) => state.apiData.gameEvents,
    // 是否有數據
    hasData: (state) => state.lastUpdated !== null,
    // 是否有有效數據
    hasValidData: (state) => state.lastFetchTime && (Date.now() - state.lastFetchTime < 5 * 60 * 1000)
  }
})
