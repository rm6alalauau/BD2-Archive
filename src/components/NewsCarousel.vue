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
              :loading="i === 0 ? 'eager' : 'lazy'"
              :fetchpriority="i === 0 ? 'high' : 'auto'"
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
  name: 'NewsCarousel',
  data() {
    return {
      newsList: [],
      carouselKey: 0,
      loading: false,
      error: null,
      settingsStore: useSettingsStore(),
      lastFetchTime: null,
      cachedData: {},
    };
  },
  computed: {
    // 多語言文字
    t() {
      return (key, params) => this.$t(key, this.settingsStore.selectedLanguage, params);
    }
  },
  async mounted() {
    // 延遲載入新聞數據，避免阻塞頁面初始渲染
    // 行動裝置使用更短的延遲
    const isMobile = window.innerWidth <= 768;
    const delay = isMobile ? 100 : 200;
    
    this.$nextTick(() => {
      setTimeout(() => {
        this.fetchNewsData();
      }, delay);
    });
  },
  watch: {
    // 監聽語言變化，重新獲取資料
    'settingsStore.selectedLanguage'() {
      this.fetchNewsData();
    }
  },
  methods: {
    // 從 HTML 內容中提取第一個圖片 URL
    extractFirstImageUrl(htmlContent, tag) {
      if (!htmlContent) {
        return this.getDefaultImageByTag(tag);
      }
      
      const imgMatch = htmlContent.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/i);
      return imgMatch ? imgMatch[1] : this.getDefaultImageByTag(tag);
    },
    
    // 根據標籤獲取預設圖片
    getDefaultImageByTag(tag) {
      const baseUrl = 'https://www.browndust2.com/img/news/banner-';
      const tagSuffix = tag || 'notice';
      return `${baseUrl}${tagSuffix}.png`;
    },
    
    // 從 HTML 內容中提取純文字描述
    extractTextContent(htmlContent) {
      if (!htmlContent) return '';
      
      // 移除 HTML 標籤，保留純文字
      const textContent = htmlContent
        .replace(/<[^>]*>/g, '') // 移除所有 HTML 標籤
        .replace(/&nbsp;/g, ' ') // 替換 HTML 實體
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .trim();
      
      // 限制描述長度
      return textContent.length > 100 ? textContent.substring(0, 100) + '...' : textContent;
    },
    
    // 獲取本地化日期文字
    getLocalizedDateText(key) {
      const texts = {
        'zh-Hant-TW': {
          'yesterday': '昨天',
          'today': '今天',
          'days_ago': '天前'
        },
        'en': {
          'yesterday': 'Yesterday',
          'today': 'Today',
          'days_ago': 'days ago'
        },
        'ja-JP': {
          'yesterday': '昨日',
          'today': '今日',
          'days_ago': '日前'
        },
        'ko-KR': {
          'yesterday': '어제',
          'today': '오늘',
          'days_ago': '일 전'
        }
      };
      
      const lang = this.settingsStore.selectedLanguage;
      return texts[lang]?.[key] || texts['zh-Hant-TW'][key];
    },
    
    // 根據選擇的語言返回對應的日期格式化地區設定
    getDateLocale() {
      const localeMap = {
        'zh-Hant-TW': 'zh-TW',
        'en': 'en-US',
        'ja-JP': 'ja-JP',
        'ko-KR': 'ko-KR'
      };
      return localeMap[this.settingsStore.selectedLanguage] || 'zh-TW';
    },
    
    // 獲取標籤顏色
    getTagColor(tag) {
      const tagColors = {
        'notice': '#ff5a21',
        'maintenance': '#1258e8',
        'event': '#e72857',
        'dev_note': '#0000EE',
        'package_deal': '#0000EE',
        'issue': '#0000EE'
      };
      return tagColors[tag] || '#ff5a21';
    },
    
    // 獲取標籤文字
    getTagText(tag) {
      return this.t(`news.tags.${tag}`) || tag;
    },
    
    // 圖片載入錯誤處理
    handleImageError(event) {
      const img = event.target;
      const newsItem = this.newsList.find(item => item.imageUrl === img.src);
      
      if (newsItem && newsItem.originalImageUrl && newsItem.originalImageUrl !== img.src) {
        // 如果Cloudinary優化失敗，嘗試使用原始圖片
        img.src = newsItem.originalImageUrl;
      } else {
        // 使用預設圖片
        img.src = this.getDefaultImageByTag('notice');
      }
    },
    
    async fetchNewsData() {
      const selectedLanguage = this.settingsStore.selectedLanguage;
      const now = Date.now();
      const cacheKey = selectedLanguage;
      
      // 檢查緩存是否有效（5分鐘內）
      const cacheValid = this.lastFetchTime && 
                        this.cachedData[cacheKey] && 
                        (now - this.lastFetchTime < 5 * 60 * 1000);
      
      if (cacheValid) {
        // 使用緩存數據
        this.newsList = this.cachedData[cacheKey];
        this.carouselKey += 1;
        return;
      }
      
      this.loading = true;
      this.error = null;
      
      try {
        // 加上隨機參數避免快取
        const timestamp = Date.now();
        
        // 根據語言選擇對應的API endpoint
        const languageEndpoint = this.getApiEndpoint(selectedLanguage);
        const originalUrl = `https://api.thebd2pulse.com/news/${languageEndpoint}?v=${timestamp}`;
        const apiUrl = this.$getApiUrl ? this.$getApiUrl(originalUrl) : originalUrl;
        
        const response = await this.$customFetch(apiUrl);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // 處理資料：直接使用返回的資料（已經是對應語言）
        const items = data.data || data || [];

        // 過濾、排序、取最新10筆
        const sorted = items
          .filter(item => item.attributes?.createdAt) // 過濾掉沒有時間的
          .sort((a, b) =>
            new Date(b.attributes.createdAt) - new Date(a.attributes.createdAt)
          )
          .slice(0, 10); // 最新的10筆

        // 轉換資料格式以適配輪播組件
        const processedNews = sorted.map((item, index) => {
          // 直接使用 API 返回的優化圖片 URL
          const optimizedImageUrl = item.attributes?.optimizedImageUrl || 
                                   this.extractFirstImageUrl(item.attributes.content || item.attributes.NewContent, item.attributes?.tag || '');
          
          const description = this.extractTextContent(item.attributes.content || item.attributes.NewContent);
          
          return {
            id: item.id,
            title: item.attributes?.subject || this.t('common.notFound'),
            link: `https://www.browndust2.com/${this.getWebsiteLocale()}/news/view?id=${item.id}`,
            imageUrl: optimizedImageUrl,
            originalImageUrl: item.attributes?.originalImageUrl || optimizedImageUrl, // 保留原始URL作為備用
            createdAt: item.attributes?.createdAt,
            description: description,
            tag: item.attributes?.tag || '',
            publishedAt: item.attributes?.publishedAt,
            locale: selectedLanguage,
          };
        });

        // 更新資料和緩存
        this.newsList = processedNews;
        this.cachedData[cacheKey] = processedNews;
        this.lastFetchTime = now;

        // 預載入第一張圖片（API 已經優化，但保留預載入功能）
        if (processedNews.length > 0 && processedNews[0].imageUrl) {
          this.preloadImage(processedNews[0].imageUrl);
        }

        // 强制重新渲染 v-carousel
        this.carouselKey += 1;
      } catch (error) {
        console.error("Error fetching news data:", error);
        this.error = `${this.t('news.loadFailed')}: ${error.message}`;
      } finally {
        this.loading = false;
      }
    },

    // 根據選擇的語言返回對應的官網地區路徑
    getWebsiteLocale() {
      const localeMap = {
        'zh-Hant-TW': 'zh-tw',
        'zh-Hans-CN': 'zh-tw',
        'en': 'en-us',
        'ja-JP': 'ja-jp',
        'ko-KR': 'ko-kr'
      };
      return localeMap[this.settingsStore.selectedLanguage] || 'zh-tw';
    },

    // 根據選擇的語言返回對應的API endpoint
    getApiEndpoint(language) {
      const endpointMap = {
        'zh-Hant-TW': 'tw',
        'zh-Hans-CN': 'tw',
        'en': 'en',
        'ja-JP': 'jp',
        'ko-KR': 'kr'
      };
      return endpointMap[language] || 'tw';
    },
    
    // 預載入圖片
    preloadImage(src) {
      if (!src) return;
      
      const img = new Image();
      img.onload = () => {
        console.log('Image preloaded:', src);
      };
      img.onerror = () => {
        console.warn('Failed to preload image:', src);
      };
      img.src = src;
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
  /* 確保 banner-image 的裁切位置正確 */
  min-width: 100%;
  min-height: 100%;
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
