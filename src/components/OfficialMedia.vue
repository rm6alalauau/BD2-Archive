<template>
  <v-card rounded="xl" class="official-media-card">
    <!-- 標題區域 -->
    <div class="media-header">
      <div class="header-content">
        <v-icon color="#e72857" size="24">mdi-youtube</v-icon>
        <span class="header-title">官方媒體</span>
      </div>
      <v-progress-circular
        v-if="isLoading"
        indeterminate
        size="20"
        width="2"
        color="#e72857"
        class="header-loading"
      ></v-progress-circular>
    </div>

    <!-- 內容區域 -->
    <div class="media-content">
      <!-- 錯誤狀態 -->
      <div v-if="error" class="error-state">
        <v-icon color="error" size="48" class="mb-2">mdi-alert-circle</v-icon>
        <p class="error-title">無法載入媒體資料</p>
        <p class="error-message">{{ error }}</p>
      </div>
      
      <!-- 媒體列表 -->
      <div v-else-if="recentMedia.length" class="media-list-container">
        <div 
          v-for="item in recentMedia" 
          :key="item.mediaId"
          class="media-item"
          @click="openVideo(item.url)"
        >
          <!-- 縮圖 -->
          <div class="media-thumbnail">
            <img 
              :src="item.fullThumbnailUrl" 
              :alt="item.title"
              class="thumbnail-image"
              @error="handleImageError"
            />
            <div class="play-overlay">
              <v-icon color="white" size="32">mdi-play</v-icon>
            </div>
          </div>
          
          <!-- 內容區域 -->
          <div class="media-info">
            <div class="media-title">{{ item.title }}</div>
            <div class="media-date">{{ item.formattedDate }}</div>
          </div>
        </div>
      </div>
      
      <!-- 空狀態 -->
      <div v-else-if="!isLoading" class="empty-state">
        <v-icon color="grey-lighten-1" size="48" class="mb-2">mdi-video-off</v-icon>
        <p class="empty-message">近期沒有新的官方媒體</p>
      </div>
    </div>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      isLoading: false,
      error: null,
      recentMedia: [],
    };
  },
  async created() {
    await this.fetchMediaData();
  },
  methods: {
    // 開啟影片
    openVideo(url) {
      window.open(url, '_blank');
    },
    
    // 處理圖片載入錯誤
    handleImageError(event) {
      event.target.src = 'https://img.youtube.com/vi/default/mqdefault.jpg';
    },
    
    /**
     * 【URL 最終修正版】
     */
    async fetchMediaData() {
      this.isLoading = true;
      this.error = null;
      try {
        const proxyApiUrl = 'https://bd2-official-proxy.zzz-archive-back-end.workers.dev/media'; // 請確保這裡用了您的 Worker URL
        const response = await fetch(proxyApiUrl); 
        
        if (!response.ok) {
          throw new Error(`代理伺服器回應錯誤: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error);
        }
        
        if (!data || !Array.isArray(data.data)) {
          throw new Error("API 回應格式不正確 (找不到 data 陣列)");
        }
        
        const allTwMedia = data.data.flatMap(item => {
          const mainAttrs = item.attributes;
          const twLocalization = mainAttrs.localizations?.data.find(
            loc => loc.attributes.locale === 'zh-Hant-TW'
          );

          if (twLocalization) {
            return {
              mediaId: twLocalization.id,
              title: twLocalization.attributes.caption,
              videoId: twLocalization.attributes.video_id,
              thumbnail: mainAttrs.poster?.data?.attributes?.url || null,
              publishedAt: mainAttrs.publishedAt,
            };
          }
          return [];
        });

        const uniqueTwMedia = [];
        const seenIds = new Set();
        for (const item of allTwMedia) {
          if (!seenIds.has(item.mediaId)) {
            uniqueTwMedia.push(item);
            seenIds.add(item.mediaId);
          }
        }
        
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        this.recentMedia = uniqueTwMedia
          //.filter(item => {
          //  return item.thumbnail && new Date(item.publishedAt) >= thirtyDaysAgo;
          //})
          .map(item => {
            // ===== 【關鍵修正】智能處理縮圖 URL =====
            let thumbnailUrl = item.thumbnail;
            // 檢查返回的路徑是否已經是完整的 URL
            if (thumbnailUrl && !thumbnailUrl.startsWith('http')) {
              // 如果不是，它就是一個相對路徑 (如 /uploads/...)，我們才幫它拼接主機名
              thumbnailUrl = `https://www.browndust2.com${thumbnailUrl}`;
            }

            return {
              ...item,
              url: `https://www.youtube.com/watch?v=${item.videoId}`,
              // 直接使用我們處理好的 thumbnailUrl
              fullThumbnailUrl: thumbnailUrl, 
              formattedDate: new Date(item.publishedAt).toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric' })
            };
          });

        this.recentMedia.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

      } catch (e) {
        this.error = e.message;
        console.error("載入官方媒體資料失敗:", e);
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>

<style scoped>
/* 主卡片樣式 */
.official-media-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%);
  border: 1px solid rgba(255, 255, 255, 0.12);
  overflow: hidden;
  height: 100%;
  max-height: 600px;
  display: flex;
  flex-direction: column;
}

/* 標題區域 */
.media-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  background-color: rgba(255, 255, 255, 0.02);
}

.header-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
}

.header-loading {
  opacity: 0.8;
}

/* 內容區域 */
.media-content {
  padding: 8px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* 媒體列表容器 */
.media-list-container {
  flex: 1;
  overflow-y: auto;
  padding: 4px;
  min-height: 200px;
  max-height: 500px;
}

/* 自定義滾動條樣式 */
.media-list-container::-webkit-scrollbar {
  width: 6px;
}

.media-list-container::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.media-list-container::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

.media-list-container::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

/* 媒體項目 */
.media-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  margin-bottom: 8px;
  border-radius: 12px;
  background-color: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.media-item:hover {
  background-color: rgba(255, 255, 255, 0.08);
  border-color: rgba(231, 40, 87, 0.3);
  transform: translateY(-1px);
}

.media-item:last-child {
  margin-bottom: 0;
}

/* 縮圖區域 */
.media-thumbnail {
  position: relative;
  flex-shrink: 0;
  width: 80px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
  background-color: rgba(255, 255, 255, 0.1);
}

.thumbnail-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.2s ease-in-out;
}

.media-item:hover .thumbnail-image {
  transform: scale(1.05);
}

/* 播放按鈕覆蓋層 */
.play-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.4);
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
}

.media-item:hover .play-overlay {
  opacity: 1;
}

/* 媒體資訊 */
.media-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
}

.media-title {
  font-size: 0.9rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.media-date {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
}

/* 錯誤狀態 */
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
  flex: 1;
  min-height: 200px;
  max-height: 500px;
}

.error-title {
  font-size: 1rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 8px;
}

.error-message {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
}

/* 空狀態 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
  flex: 1;
  min-height: 200px;
  max-height: 500px;
}

.empty-message {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .official-media-card {
    max-height: 500px;
  }
  
  .media-header {
    padding: 12px 16px;
  }
  
  .header-title {
    font-size: 1rem;
  }
  
  .media-content {
    padding: 6px;
  }
  
  .media-item {
    padding: 10px;
    gap: 10px;
  }
  
  .media-thumbnail {
    width: 70px;
    height: 52px;
  }
  
  .media-title {
    font-size: 0.85rem;
  }
  
  .media-date {
    font-size: 0.75rem;
  }
  
  .media-list-container {
    min-height: 150px;
    max-height: 400px;
  }
  
  .error-state,
  .empty-state {
    min-height: 150px;
    max-height: 400px;
  }
}

@media (max-width: 480px) {
  .official-media-card {
    height: auto; /* 在手機版使用自動高度 */
  }
  
  .media-list-container {
    max-height: 350px; /* 在手機版限制最大高度 */
    min-height: 200px;
  }
  
  .media-item {
    padding: 8px;
    gap: 8px;
  }
  
  .media-thumbnail {
    width: 60px;
    height: 45px;
  }
  
  .error-state,
  .empty-state {
    min-height: 120px;
    padding: 20px 15px;
  }
}
</style>