<template>
  <v-container class="feedback-tracker-page">
    <v-row justify="center">
      <v-col cols="12" md="10" lg="8">
        <!-- 頁面標題與返回按鈕 -->
        <div class="page-header mb-6">
          <div class="header-with-back">
            <v-btn
              @click="goBack"
              icon
              variant="text"
              size="small"
              class="back-btn"
              :aria-label="t('feedbackTracker.back')"
            >
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
            <h1 class="page-title">{{ t('feedbackTracker.title') }}</h1>
          </div>
          <p class="page-subtitle">{{ t('feedbackTracker.description') }}</p>
        </div>

        <!-- 載入中 -->
        <div v-if="loading" class="text-center py-12">
          <v-progress-circular
            indeterminate
            color="primary"
            size="48"
          ></v-progress-circular>
          <p class="mt-4 text-medium-emphasis">{{ t('feedbackTracker.loading') }}</p>
        </div>

        <!-- 無資料 -->
        <v-card v-else-if="feedbackItems.length === 0" rounded="xl" class="empty-card">
          <v-card-text class="text-center py-12">
            <v-icon size="64" color="primary" class="mb-4">mdi-inbox-outline</v-icon>
            <h3 class="text-h6 mb-2">{{ t('feedbackTracker.noData') }}</h3>
            <p class="text-medium-emphasis">{{ t('feedbackTracker.noDataDescription') }}</p>
          </v-card-text>
        </v-card>

        <!-- 意見回饋列表 -->
        <div v-else class="feedback-list">
          <v-card
            v-for="item in paginatedItems"
            :key="item.id"
            rounded="xl"
            class="feedback-item-card mb-4"
          >
            <v-card-text class="pa-6">
              <!-- 卡片標題區域 -->
              <div class="card-header mb-4">
                <div class="d-flex align-center justify-space-between flex-wrap">
                  <div class="d-flex align-center">
                    <!-- 狀態徽章 -->
                    <v-chip
                      :color="getStatusColor(item.status)"
                      size="small"
                      variant="tonal"
                      rounded="lg"
                      class="status-chip"
                    >
                      <v-icon :icon="getStatusIcon(item.status)" size="16" class="mr-1"></v-icon>
                      {{ getStatusText(item.status) }}
                    </v-chip>
                    
                    <!-- 類型徽章 -->
                    <v-chip
                      :color="getTypeColor(item.type)"
                      size="small"
                      variant="tonal"
                      rounded="lg"
                      class="type-chip ml-2"
                    >
                      <v-icon :icon="getTypeIcon(item.type)" size="16" class="mr-1"></v-icon>
                      {{ getTypeText(item.type) }}
                    </v-chip>
                  </div>
                  
                  <!-- 日期 -->
                  <span class="text-caption text-medium-emphasis">
                    {{ formatDate(item.created_at) }}
                  </span>
                </div>
                
                <!-- ID -->
                <div class="text-caption text-medium-emphasis mt-2">
                  #{{ item.id }}
                </div>
              </div>

              <!-- 意見內容 -->
              <div class="feedback-content mb-4">
                <div class="content-label mb-2">
                  <v-icon size="18" color="primary" class="mr-2">mdi-comment-text</v-icon>
                  {{ t('feedbackTracker.feedback') }}
                </div>
                <div class="content-text">
                  {{ getFeedbackText(item) }}
                </div>
              </div>

              <!-- 處理方式 -->
              <div v-if="item.resolution && getResolutionText(item)" class="resolution-content">
                <div class="content-label mb-2">
                  <v-icon size="18" color="success" class="mr-2">mdi-check-circle</v-icon>
                  {{ t('feedbackTracker.resolution') }}
                </div>
                <div class="content-text resolution-text">
                  {{ getResolutionText(item) }}
                </div>
              </div>
            </v-card-text>
          </v-card>
        </div>

        <!-- 分頁器 -->
        <div v-if="totalPages > 1" class="text-center mt-6 mb-6">
          <v-pagination
            v-model="currentPage"
            :length="totalPages"
            :total-visible="7"
            color="primary"
            rounded="circle"
          ></v-pagination>
        </div>

        <!-- 底部導航按鈕 -->
        <div v-if="!loading && feedbackItems.length > 0" class="bottom-nav-buttons mt-6 mb-4">
          <div class="d-flex align-center justify-space-between">
            <v-btn
              @click="scrollToTop"
              color="primary"
              variant="text"
              size="small"
              class="mr-2"
              :aria-label="t('feedbackTracker.scrollToTop')"
            >
              <v-icon class="mr-2">mdi-chevron-up</v-icon>
              {{ t('feedbackTracker.scrollToTop') }}
            </v-btn>
            
            <v-btn
              @click="goBack"
              color="secondary"
              variant="outlined"
              size="small"
              :aria-label="t('feedbackTracker.back')"
            >
              <v-icon class="mr-2">mdi-arrow-left</v-icon>
              {{ t('feedbackTracker.back') }}
            </v-btn>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { useSettingsStore } from '@/stores/settings'
import { useAppStore } from '@/stores/app'

export default {
  name: "FeedbackTrackerPage",
  setup() {
    const settingsStore = useSettingsStore()
    const appStore = useAppStore()
    return { settingsStore, appStore }
  },
  data() {
    return {
      loading: false,
      feedbackItems: [],
      currentPage: 1,
      itemsPerPage: 5
    }
  },
  computed: {
    // 多語言文字
    t() {
      return (key, params) => this.$t(key, this.settingsStore.selectedLanguage, params);
    },
    
    // 計算總頁數
    totalPages() {
      return Math.ceil(this.feedbackItems.length / this.itemsPerPage);
    },
    
    // 計算當前頁顯示的項目
    paginatedItems() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.feedbackItems.slice(start, end);
    }
  },
  mounted() {
    // 確保設定已載入
    if (!this.settingsStore.isLoaded) {
      this.settingsStore.loadSettings();
    }
    
    // 載入意見回饋數據
    this.loadFeedbackData();
  },
  methods: {
    // 載入意見回饋數據
    async loadFeedbackData() {
      this.loading = true;
      try {
        const response = await this.appStore.fetchFeedbackData();
        // 按日期排序，新的在上
        this.feedbackItems = (response || []).sort((a, b) => {
          const dateA = new Date(a.created_at);
          const dateB = new Date(b.created_at);
          return dateB - dateA; // 降序：新的在前
        });
      } catch (error) {
        console.error('載入意見回饋數據失敗:', error);
        this.feedbackItems = [];
      } finally {
        this.loading = false;
      }
    },
    
    // 返回上一頁
    goBack() {
      this.$router.back();
    },
    
    // 滾動到頂部
    scrollToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    
    // 獲取處理狀態的文字
    getStatusText(status) {
      const statusMap = {
        'completed': this.t('feedbackTracker.status.completed'),
        'in-progress': this.t('feedbackTracker.status.inProgress'),
        'pending': this.t('feedbackTracker.status.pending'),
        'rejected': this.t('feedbackTracker.status.rejected')
      };
      return statusMap[status] || status;
    },
    
    // 獲取處理狀態的顏色
    getStatusColor(status) {
      const colorMap = {
        'completed': 'success',
        'in-progress': 'info',
        'pending': 'warning',
        'rejected': 'error'
      };
      return colorMap[status] || 'default';
    },
    
    // 獲取處理狀態的圖標
    getStatusIcon(status) {
      const iconMap = {
        'completed': 'mdi-check-circle',
        'in-progress': 'mdi-clock',
        'pending': 'mdi-alert-circle',
        'rejected': 'mdi-close-circle'
      };
      return iconMap[status] || 'mdi-help-circle';
    },
    
    // 獲取類型的文字
    getTypeText(type) {
      return this.t(`feedback.issueTypes.${type}`) || type;
    },
    
    // 獲取類型的圖標
    getTypeIcon(type) {
      const iconMap = {
        'bug': 'mdi-bug',
        'content': 'mdi-text-box',
        'suggestion': 'mdi-lightbulb-on',
        'other': 'mdi-dots-horizontal'
      };
      return iconMap[type] || 'mdi-tag';
    },
    
    // 獲取類型的顏色
    getTypeColor(type) {
      const colorMap = {
        'bug': 'error',
        'content': 'warning',
        'suggestion': 'info',
        'other': 'default'
      };
      return colorMap[type] || 'default';
    },
    
    // 獲取意見內容的文字（根據當前語言）
    getFeedbackText(item) {
      if (!item.feedback) return '';
      return item.feedback[this.settingsStore.selectedLanguage] 
        || item.feedback['zh-Hant-TW'] 
        || item.feedback['en']
        || '';
    },
    
    // 獲取處理方式的文字（根據當前語言）
    getResolutionText(item) {
      if (!item.resolution) return '';
      return item.resolution[this.settingsStore.selectedLanguage] 
        || item.resolution['zh-Hant-TW'] 
        || item.resolution['en']
        || '';
    },
    
    // 格式化日期
    formatDate(dateString) {
      if (!dateString) return '';
      
      try {
        const date = new Date(dateString);
        const options = { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        };
        return date.toLocaleDateString(this.settingsStore.selectedLanguage, options);
      } catch (error) {
        return dateString;
      }
    }
  }
};
</script>

<style scoped>
.feedback-tracker-page {
  min-height: calc(100vh - 64px);
  padding-top: 32px;
  padding-bottom: 32px;
}

/* 頁面標題 */
.page-header {
  text-align: center;
}

.header-with-back {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-bottom: 16px;
}

.back-btn {
  position: absolute;
  left: 0;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #e72857;
  margin: 0;
}

.page-subtitle {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
}

/* 意見回饋列表 */
.feedback-list {
  width: 100%;
}

.feedback-item-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%);
  border: 1px solid rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.feedback-item-card:hover {
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

/* 卡片標題 */
.card-header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding-bottom: 16px;
}

.status-chip,
.type-chip {
  font-weight: 500;
}

/* 內容區域 */
.feedback-content,
.resolution-content {
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
  padding: 16px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.resolution-content {
  background: rgba(66, 185, 131, 0.05);
  border-color: rgba(66, 185, 131, 0.2);
}

.content-label {
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 8px;
}

.content-text {
  font-size: 0.95rem;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.85);
  text-align: justify;
  text-justify: inter-ideograph;
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: pre-wrap;
}

.resolution-text {
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
}

/* 空狀態卡片 */
.empty-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%);
  border: 1px solid rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(10px);
}

/* 設定 v-pagination 元件的主題色，這會影響 hover 等效果的顏色 */
:deep(.v-pagination) {
  --v-theme-primary: #e72857;
  --v-pagination-item-active-color: #ffffff; /* 設定啟用項目的文字顏色 */
}

/* 針對當前啟用(active)的分頁按鈕 */
:deep(.v-pagination .v-pagination__item--is-active .v-btn) {
  background-color: #e72857 !important; /* 紅色背景 */
  color: #ffffff !important;             /* 白色文字 */
  border-color: #e72857 !important;     /* 紅色邊框 */
  font-weight: 600;
}

/* 確保 hover 或 focus 狀態下，啟用按鈕的樣式不變 */
:deep(.v-pagination .v-pagination__item--is-active .v-btn:hover),
:deep(.v-pagination .v-pagination__item--is-active .v-btn:focus-visible) {
  background-color: #e72857 !important;
  color: #ffffff !important;
}

/* 針對鍵盤聚焦環(focus ring)的顯示，避免預設的白色外框 */
:deep(.v-pagination .v-btn:focus-visible) {
  outline: 2px solid rgba(231, 40, 87, 0.6) !important;
  outline-offset: 1px;
}

/* 底部導航按鈕 */
.bottom-nav-buttons {
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding-top: 24px;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .page-title {
    font-size: 1.75rem;
  }
  
  .header-with-back {
    justify-content: flex-start;
  }
  
  .back-btn {
    position: relative;
    left: auto;
  }
  
  .feedback-item-card .v-card-text {
    padding: 16px !important;
  }
  
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .bottom-nav-buttons .d-flex {
    flex-direction: column;
    gap: 12px;
  }
  
  .bottom-nav-buttons .v-btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .feedback-tracker-page {
    padding-top: 16px;
  }
  
  .page-title {
    font-size: 1.5rem;
  }
  
  .content-label {
    font-size: 0.8rem;
  }
  
  .content-text {
    font-size: 0.875rem;
  }
}
</style>

