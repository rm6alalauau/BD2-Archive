<template>
  <!-- 載入狀態 -->
  <div v-if="loading" class="d-flex justify-center align-center" style="height: 300px;">
    <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
  </div>
  
  <!-- 錯誤狀態 -->
  <div v-else-if="error" class="d-flex justify-center align-center" style="height: 300px;">
    <v-alert type="error" variant="tonal">
      {{ error }}
    </v-alert>
  </div>
  
  <!-- 新聞輪播 -->
  <v-carousel
    v-else-if="newsList.length > 0"
    :key="carouselKey"
    height="300"
    show-arrows="hover"
    cycle
    hide-delimiter-background
    ref="carousel"
    class="news-carousel"
  >
    <v-carousel-item v-for="(newsItem, i) in newsList" :key="i">
      <v-card flat tile rounded="xl">
        <a
          :href="newsItem.link"
          target="_blank"
        >
          <div class="custom-image-container">
            <img 
              :src="newsItem.imageUrl" 
              :class="['news-image', { 'banner-image': newsItem.imageUrl.includes('banner-') }]"
              alt="news"
              loading="lazy"
              @error="handleImageError"
            />
            
            <!-- 標題和標籤覆蓋層 -->
            <div class="overlay-content">
              <div class="overlay-row">
                <!-- 標籤 -->
                <div
                  v-if="newsItem.tag"
                  class="custom-tag"
                  :style="{ backgroundColor: getTagColor(newsItem.tag) }"
                >
                  {{ getTagText(newsItem.tag) }}
                </div>
                

                
                <!-- 標題 -->
                <div class="news-title">
                  {{ newsItem.title }}
                </div>
              </div>
            </div>
          </div>
        </a>
      </v-card>
    </v-carousel-item>
  </v-carousel>
  
  <!-- 無資料狀態 -->
  <div v-else class="d-flex justify-center align-center" style="height: 300px;">
    <v-alert type="info" variant="tonal">
      {{ t('news.noData') }}
    </v-alert>
  </div>
</template>

<script>
import { useSettingsStore } from '@/stores/settings'

export default {
  data() {
    return {
      newsList: [],
      carouselKey: 0,
      loading: false,
      error: null,
      settingsStore: useSettingsStore(),
      // 移除 lastFetchTime 和 cachedData，因為緩存現在由 Worker 處理
    };
  },
  computed: {
    t() {
      return (key, params) => this.$t(key, this.settingsStore.selectedLanguage, params);
    }
  },
  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        this.fetchNewsData();
      }, 200);
    });
  },
  watch: {
    'settingsStore.selectedLanguage'() {
      this.fetchNewsData();
    }
  },
  methods: {
    /**
     * 【LCP 優化版】只負責獲取已處理好的數據並渲染
     */
    async fetchNewsData() {
      this.loading = true;
      this.error = null;
      
      try {
        const selectedLanguage = this.settingsStore.selectedLanguage;
        const languageEndpoint = this.getApiEndpoint(selectedLanguage);

        // 使用 Vite 代理，或在生產環境直接請求
        // 注意：這裡不再需要時間戳，因為 Worker 有 CDN 緩存
        const workerUrl = 'https://bd2-official-proxy.zzz-archive-back-end.workers.dev';
        const originalUrl = `${workerUrl}/news/${languageEndpoint}`;
        const apiUrl = this.$getApiUrl ? this.$getApiUrl(originalUrl) : originalUrl;
        
        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error(`伺服器回應錯誤: ${response.status}`);
        }

        const data = await response.json();

        // 【關鍵簡化】不再需要 filter, sort, slice！
        // Worker 已經幫我們處理好了，直接使用返回的數據。
        const items = data.data || [];

        // 轉換資料格式以適配輪播組件
        this.newsList = items.map((item) => {
          // 這部分的邏輯保持不變，因為它只負責格式化
          const imageUrl = this.extractFirstImageUrl(item.attributes.content || item.attributes.NewContent, item.attributes?.tag || '');
          
          return {
            id: item.id,
            title: item.attributes?.subject || this.t('common.notFound'),
            link: `https://www.browndust2.com/${this.getWebsiteLocale()}/news/view?id=${item.id}`,
            imageUrl: this.normalizeUrl(imageUrl), // 使用輔助函式確保 URL 正確
            tag: item.attributes?.tag || '',
            // 其他不再需要的欄位可以移除
          };
        });

        // 强制重新渲染 v-carousel
        this.carouselKey += 1;

      } catch (error) {
        console.error("Error fetching news data:", error);
        this.error = `${this.t('news.loadFailed')}: ${error.message}`;
      } finally {
        this.loading = false;
      }
    },

    /**
     * 新增的輔助函式，確保 URL 正確
     */
    normalizeUrl(url) {
        if (!url) return '';
        if (url.startsWith('http')) return url;
        return `https://www.browndust2.com${url}`;
    },

    // ===== 以下是您原有的、無需修改的輔助方法 =====
    extractFirstImageUrl(htmlContent, tag) {
      if (!htmlContent) return this.getDefaultImageByTag(tag);
      const imgMatch = htmlContent.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/i);
      return imgMatch ? imgMatch[1] : this.getDefaultImageByTag(tag);
    },
    
    getDefaultImageByTag(tag) {
      const baseUrl = 'https://www.browndust2.com/img/news/banner-';
      const tagSuffix = tag || 'notice';
      return `${baseUrl}${tagSuffix}.png`;
    },
    
    getTagColor(tag) {
      const tagColors = { 'notice': '#ff5a21', 'maintenance': '#1258e8', 'event': '#e72857', 'dev_note': '#0000EE', 'package_deal': '#0000EE', 'issue': '#0000EE' };
      return tagColors[tag] || '#ff5a21';
    },
    
    getTagText(tag) {
      return this.t(`news.tags.${tag}`) || tag;
    },
    
    handleImageError(event) {
      event.target.src = this.getDefaultImageByTag('notice');
    },

    getWebsiteLocale() {
      const localeMap = { 'zh-Hant-TW': 'zh-tw', 'en': 'en-us', 'ja-JP': 'ja-jp', 'ko-KR': 'ko-kr' };
      return localeMap[this.settingsStore.selectedLanguage] || 'zh-tw';
    },

    getApiEndpoint(language) {
      const endpointMap = { 'zh-Hant-TW': 'tw', 'en': 'en', 'ja-JP': 'jp', 'ko-KR': 'kr' };
      return endpointMap[language] || 'tw';
    },
  },
};
</script>

<style scoped>
.news-carousel {
  height: 300px;
}

.v-carousel-item {
  height: 300px;
}

.v-card {
  height: 100%;
}

/* 自定義圖片容器 */
.custom-image-container {
  width: 100%;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  overflow: hidden;
  position: relative;
}

/* 一般新聞圖片 */
.news-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  object-position: center;
}

/* 預設圖片（banner-開頭的） */
.banner-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: left center;
}

/* 覆蓋層內容 */
.overlay-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 12px 16px;
  z-index: 1;
}

/* 水平排列容器 */
.overlay-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* 自定義標籤樣式 */
.custom-tag {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  color: white;
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  flex-shrink: 0; /* 防止標籤被壓縮 */
}



/* 新聞標題樣式 */
.news-title {
  font-size: 16px;
  font-weight: bold;
  flex: 1; /* 佔據剩餘空間 */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 0; /* 確保文字省略生效 */
}

/* 隱藏輪播控制按鈕 */
:deep(.v-carousel__controls) {
  display: none !important;
}

/* 確保容器有相對定位 */
.custom-image-container {
  position: relative;
}
</style>
