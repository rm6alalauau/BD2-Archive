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
      目前沒有新聞資料
    </v-alert>
  </div>
</template>

<script>
export default {
  data() {
    return {
      newsList: [],
      carouselKey: 0,
      loading: false,
      error: null,
    };
  },
  async mounted() {
    // 延遲載入新聞數據，避免阻塞頁面初始渲染
    this.$nextTick(() => {
      setTimeout(() => {
        this.fetchNewsData();
      }, 200); // 延遲200ms，讓主要內容先載入
    });
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
    
    // 格式化日期
    formatDate(dateString) {
      if (!dateString) return '';
      
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        return '昨天';
      } else if (diffDays === 0) {
        return '今天';
      } else if (diffDays < 7) {
        return `${diffDays} 天前`;
      } else {
        return date.toLocaleDateString('zh-TW', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      }
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
      const tagTexts = {
        'notice': '公告事項',
        'maintenance': '維護',
        'event': '活動',
        'dev_note': '開發者筆記',
        'package_deal': '禮包商品',
        'issue': '遊戲已知問題'
      };
      return tagTexts[tag] || tag;
    },
    
    // 圖片載入錯誤處理
    handleImageError(event) {
      console.warn('News image failed to load:', event.target.src);
      // 使用預設圖片
      event.target.src = this.getDefaultImageByTag('notice');
    },
    
    async fetchNewsData() {
      this.loading = true;
      this.error = null;
      
      try {
        // 加上隨機參數避免快取
        const timestamp = Date.now();
        
        // 使用代理過的網址，並且根據環境自動選擇
        const originalUrl = `https://bd2-official-proxy.zzz-archive-back-end.workers.dev/news?v=${timestamp}`;
        const apiUrl = this.$getApiUrl ? this.$getApiUrl(originalUrl) : originalUrl;
        
        console.log("Fetching news from:", apiUrl);
        
        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("API Response:", data);

        // 處理資料：過濾、排序、取最新10筆
        const items = data.data || data || [];
        const sorted = items
          .filter(item => item.attributes?.createdAt) // 過濾掉沒有時間的
          .sort((a, b) =>
            new Date(b.attributes.createdAt) - new Date(a.attributes.createdAt)
          )
          .slice(0, 10); // 最新的10筆

        // 轉換資料格式以適配輪播組件
        this.newsList = sorted.map((item) => {
          const imageUrl = this.extractFirstImageUrl(item.attributes.NewContent, item.attributes?.tag || '');
          const description = this.extractTextContent(item.attributes.NewContent);
          
          return {
            id: item.id,
            title: item.attributes?.subject || '無標題',
            link: `https://www.browndust2.com/zh-tw/news/view?id=${item.id}`,
            imageUrl: imageUrl,
            createdAt: item.attributes?.createdAt,
            description: description,
            tag: item.attributes?.tag || '',
            publishedAt: item.attributes?.publishedAt
          };
        });

        console.log("Processed news list:", this.newsList);

        // 强制重新渲染 v-carousel
        this.carouselKey += 1;
      } catch (error) {
        console.error("Error fetching news data:", error);
        this.error = `載入新聞失敗: ${error.message}`;
      } finally {
        this.loading = false;
      }
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
