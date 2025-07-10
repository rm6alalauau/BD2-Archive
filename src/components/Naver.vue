<!--
Naver Lounge 論壇組件

這個組件用於顯示 Naver Lounge 的論壇內容，與其他論壇組件保持一致的設計風格。

功能特點：
- 水平滾動顯示論壇帖子
- 支持圖片優化（使用 Cloudinary）
- 顯示作者、點讚、評論、閱讀數等統計信息
- 響應式設計，適配不同螢幕尺寸
- 與其他論壇組件統一的視覺風格

數據格式要求：
{
  title: "帖子標題",
  link: "帖子鏈接",
  imageUrl: "圖片URL（可選）",
  author: "作者名稱",
  userIdHash: "用戶ID哈希（用於生成作者資料頁面鏈接）",
  buffs: "點讚數",
  comments: "評論數",
  reads: "閱讀數"
}

使用方法：
<Naver :items="naverItems" />
-->

<template>
  <v-row>
    <v-col>
      <div class="forum-container">
        <!-- 標題和控制按鈕 -->
        <div class="forum-header">
          <span class="forum-title">Naver</span>
          <div class="forum-controls">
            <v-btn icon size="small" @click="scrollLeft">
              <v-icon>mdi-chevron-left</v-icon>
            </v-btn>
            <v-btn icon size="small" @click="scrollRight">
              <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
          </div>
        </div>
        <!-- 內容區域 -->
        <div
          ref="scrollContainer"
          class="scroll-container"
          @scroll="handleScroll"
        >
          <div
            v-for="(item, i) in items"
            :key="i"
            class="content-item"
          >
            <!-- 標題放在圖片上方 -->
            <div class="item-title" @click="openPostLink(item.link)">
              {{ item.title }}
            </div>
            <!-- 圖片 -->
            <a :href="item.link" target="_blank" class="item-image">
              <v-img
                :src="getOptimizedImageUrl(item.imageUrl) || generatePlaceholderImage(item.title)"
                height="160"
                width="160"
                class="d-block mx-auto"
                @error="handleImageError"
              ></v-img>
            </a>
            <!-- 作者名稱和 Icon -->
            <div class="author-section">
              <v-icon
                class="author-icon"
                small
                @click="openAuthorProfile(item.userIdHash)"
              >
                mdi-account
              </v-icon>
              <span
                class="author-name"
                @click="openAuthorProfile(item.userIdHash)"
              >
                {{ item.author }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import { getSmallOptimizedImageUrl } from '@/utils/cloudinary'

export default {
  name: "NaverPosts",
  props: {
    items: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      canScrollLeft: false,
      canScrollRight: false,
      imageCache: new Map(), // 圖片URL緩存
    };
  },
  mounted() {
    this.handleScroll();
  },
  
  updated() {
    this.$nextTick(() => {
      this.handleScroll();
    });
  },
  
  methods: {
    // 滾動控制
    scrollLeft() {
      const container = this.$refs.scrollContainer;
      if (container) {
        container.scrollBy({ left: -200, behavior: 'smooth' });
      }
    },
    
    scrollRight() {
      const container = this.$refs.scrollContainer;
      if (container) {
        container.scrollBy({ left: 200, behavior: 'smooth' });
      }
    },
    
    handleScroll() {
      const container = this.$refs.scrollContainer;
      if (container) {
        this.canScrollLeft = container.scrollLeft > 0;
        this.canScrollRight = container.scrollLeft < (container.scrollWidth - container.clientWidth);
      }
    },
    
    // 獲取優化的圖片URL
    getOptimizedImageUrl(imageUrl) {
      if (!imageUrl) return '';
      
      // 檢查緩存
      if (this.imageCache.has(imageUrl)) {
        return this.imageCache.get(imageUrl);
      }
      
      try {
        // 檢查URL是否包含特殊字符或過長，如果有問題直接使用原始URL
        if (imageUrl.includes('%') || imageUrl.includes('&') || imageUrl.length > 500 || 
            imageUrl.includes('BD2_') || imageUrl.includes('공지사항')) {
          console.warn('Image URL contains special characters or is problematic, using original URL');
          this.imageCache.set(imageUrl, imageUrl);
          return imageUrl;
        }
        
        const optimizedUrl = getSmallOptimizedImageUrl(imageUrl);
        // 緩存結果
        this.imageCache.set(imageUrl, optimizedUrl);
        return optimizedUrl;
      } catch (error) {
        console.warn('Cloudinary optimization failed:', error);
        // 緩存原始URL作為回退
        this.imageCache.set(imageUrl, imageUrl);
        return imageUrl;
      }
    },
    
    // 生成預設圖片
    generatePlaceholderImage(title) {
      // 使用簡單的SVG佔位符，避免外部依賴
      return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYwIiBoZWlnaHQ9IjE2MCIgdmlld0JveD0iMCAwIDE2MCAxNjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNjAiIGhlaWdodD0iMTYwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik04MCA2MEM4OC44MzY2IDYwIDk2IDY3LjE2MzQgOTYgNzZWODRDOTYgOTIuODM2NiA4OC44MzY2IDEwMCA4MCAxMDBDNzEuMTYzNCAxMDAgNjQgOTIuODM2NiA2NCA4NFY3NkM2NCA2Ny4xNjM0IDcxLjE2MzQgNjAgODAgNjBaIiBmaWxsPSIjRTBFMEUwIi8+Cjwvc3ZnPgo=';
    },
    
    // 處理圖片加載錯誤
    handleImageError(event) {
      // 確保event和event.target存在
      if (!event || !event.target) {
        return;
      }
      
      console.warn('Image failed to load:', event.target.src);
      
      // 如果圖片加載失敗，使用預設圖片
      const placeholderUrl = this.generatePlaceholderImage();
      if (event.target.src !== placeholderUrl) {
        event.target.src = placeholderUrl;
      }
    },
    
    // 打開作者資料頁面
    openAuthorProfile(userIdHash) {
      if (userIdHash) {
        const profileUrl = `https://game.naver.com/profile/${userIdHash}/BrownDust2`;
        window.open(profileUrl, '_blank');
      }
    },

    // 打開帖子鏈接
    openPostLink(link) {
      if (link) {
        window.open(link, '_blank');
      }
    }
  }
};
</script>

<style scoped>
.forum-container {
  height: 300px;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 16px;
  overflow: hidden;
}

.forum-header {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  flex-shrink: 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  background-color: rgba(255, 255, 255, 0.02);
}

.forum-title {
  font-size: 1rem;
  font-weight: 500;
}

.forum-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.scroll-container {
  height: 260px;
  display: flex;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  padding: 16px 16px 24px 16px; /* 底部增加8px內邊距避免滾軸被裁切 */
  gap: 16px;
}

/* 統一滾軸樣式 - 符合MD3規範 */
.scroll-container::-webkit-scrollbar {
  height: 8px; /* MD3建議最小8px以確保點擊區域 */
}

.scroll-container::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  margin: 0 8px; /* 左右邊距避免被圓角裁切 */
}

.scroll-container::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  min-width: 20px; /* 確保最小寬度 */
}

.scroll-container::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

/* 隱藏滾軸的箭頭按鈕 */
.scroll-container::-webkit-scrollbar-button {
  display: none;
}

.content-item {
  width: 160px;
  height: 228px;
  display: flex;
  flex-direction: column;
  margin-right: 16px;
  flex-shrink: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 8px;
  transition: all 0.2s ease-in-out;
  cursor: pointer;
}

.content-item:hover {
  background: linear-gradient(135deg, rgba(231, 40, 87, 0.1) 0%, rgba(255, 255, 255, 0.08) 100%);
  border-color: rgba(231, 40, 87, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(231, 40, 87, 0.15);
}

.item-title {
  height: 20px;
  line-height: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 4px;
  font-size: 0.875rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  cursor: pointer;
  transition: color 0.2s ease-in-out;
  /* 確保標題可見 */
  display: block;
  min-height: 20px;
}

.item-title:hover {
  color: #e72857;
}

.item-image {
  flex-shrink: 0;
  margin-bottom: 4px;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s ease-in-out;
}

.item-image:hover {
  transform: scale(1.02);
}

.author-section {
  height: 24px;
  line-height: 24px;
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: auto; /* 讓作者區域自動推到底部 */
}

.author-icon {
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  transition: color 0.2s ease-in-out;
}

.author-icon:hover {
  color: #e72857;
}

.author-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 120px;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition: color 0.2s ease-in-out;
}

.author-name:hover {
  color: #e72857;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .content-item {
    width: 140px;
    height: 200px;
    padding: 8px;
  }
  
  .item-title {
    font-size: 0.8rem;
    height: 18px;
    line-height: 18px;
  }
  
  .item-image {
    margin-bottom: 4px;
  }
  
  .item-image .v-img {
    height: 140px !important;
    width: 140px !important;
  }
  
  .author-section {
    height: 20px;
    line-height: 20px;
  }
  
  .author-name {
    max-width: 100px;
    font-size: 0.7rem;
  }
}
</style> 