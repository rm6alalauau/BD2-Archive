<template>

  <v-container>
    <v-row class="ga">
      <v-col cols="12" md="6" class="d-flex flex-column">
        <News class="mb-4" />
        <Profile class="flex-grow-1" />
      </v-col>
      <v-col cols="12" md="6" class="d-flex flex-column">
        <Forums />
        <PixivCard class="mb-2"/>
        <OfficialMedia />
      </v-col>
    </v-row>
    
    <!-- 免責聲明 -->
    <v-row class="mt-6">
      <v-col cols="12">
        <v-card
          class="disclaimer-card"
          elevation="0"
          variant="outlined"
        >
          <v-card-text class="text-center py-3">
            <v-icon size="16" class="mr-2 opacity-60">mdi-information-outline</v-icon>
            <span class="text-caption text-medium-emphasis">
              {{ t('disclaimer.short') }}
            </span>
            <v-btn
              variant="text"
              size="small"
              class="ml-2"
              @click="showDisclaimerDialog = true"
            >
              {{ t('disclaimer.nav') }}
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  
  <!-- 免責聲明詳細對話框 -->
  <v-dialog
    v-model="showDisclaimerDialog"
    max-width="700"
    scrollable
  >
    <v-card class="disclaimer-dialog">
      <v-card-title class="disclaimer-dialog-title">
        <v-icon class="mr-2" color="primary">mdi-information-outline</v-icon>
        {{ t('disclaimer.content.title') }}
      </v-card-title>
      
      <v-card-text class="disclaimer-dialog-content">
        <v-expansion-panels 
          variant="accordion" 
          class="disclaimer-accordion"
          multiple
        >
          <v-expansion-panel
            v-for="(section, index) in disclaimerSections"
            :key="index"
            class="disclaimer-panel"
          >
            <v-expansion-panel-title class="panel-title">
              <div class="title-content">
                <v-icon 
                  :icon="section.icon" 
                  size="20" 
                  class="mr-3" 
                  color="primary"
                ></v-icon>
                <span>{{ t(`disclaimer.content.section${index + 1}.title`) }}</span>
              </div>
            </v-expansion-panel-title>
            
            <v-expansion-panel-text class="panel-content">
              <p class="section-text">
                {{ t(`disclaimer.content.section${index + 1}.content`) }}
              </p>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card-text>
      
      <v-card-actions class="disclaimer-dialog-actions">
        <v-spacer></v-spacer>
        <v-btn
          variant="outlined"
          color="primary"
          @click="showDisclaimerDialog = false"
        >
          {{ t('common.close') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { useAppStore } from '@/stores/app'
import { useSettingsStore } from '@/stores/settings'

export default {
  data() {
    return {
      warningVisible: false,
      showDisclaimerDialog: false,
      settingsStore: useSettingsStore(),
    };
  },
  
  computed: {
    // 多語言文字
    t() {
      return (key, params) => this.$t(key, this.settingsStore.selectedLanguage, params);
    },
    
    // 免責聲明章節配置
    disclaimerSections() {
      return [
        { icon: 'mdi-information-outline' },      // 網站定位與獨立性
        { icon: 'mdi-copyright' },                // 智慧財產權歸屬
        { icon: 'mdi-check-circle-outline' },     // 內容的準確性
        { icon: 'mdi-link-variant' },             // 第三方內容與連結
        { icon: 'mdi-heart-outline' },            // 非營利聲明與贊助
        { icon: 'mdi-email-outline' }             // 版權問題聯繫
      ];
    }
  },
  
  mounted() {
    // 確保設定已載入
    if (!this.settingsStore.isLoaded) {
      this.settingsStore.loadSettings();
    }
    
    // 延遲載入API數據，避免阻塞頁面渲染
    this.$nextTick(() => {
      setTimeout(() => {
        this.fetchDataAsync();
      }, 100); // 延遲100ms，讓頁面先完成初始渲染
    });
  },
  
  methods: {
    async fetchDataAsync() {
      try {
        const appStore = useAppStore();
        
        // 添加載入狀態檢查，避免重複請求
        if (appStore.loading) {
          return;
        }
        
        // 如果已有數據且不久前更新過，跳過請求
        if (appStore.hasData && appStore.lastUpdated) {
          const timeSinceUpdate = Date.now() - new Date(appStore.lastUpdated).getTime();
          if (timeSinceUpdate < 5 * 60 * 1000) { // 5分鐘內有更新過
            return;
          }
        }
        
        await appStore.fetchAllData();
        
      } catch (error) {
        console.error("Failed to fetch data:", error);
        // 即使 API 失敗，頁面也能正常顯示
        // 可以在這裡添加用戶友好的錯誤提示
      }
    }
  }
};
</script>

<style scoped>
.flex-grow-1 {
  flex-grow: 1; /* 使組件填滿剩餘空間 */
}

/* 免責聲明卡片樣式 */
.disclaimer-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.01) 100%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.disclaimer-card:hover {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%);
  border-color: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.disclaimer-card .text-caption {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.85rem;
}

.disclaimer-card .v-btn {
  color: rgba(231, 40, 87, 0.9);
  font-weight: 500;
  transition: all 0.2s ease;
}

.disclaimer-card .v-btn:hover {
  color: rgba(231, 40, 87, 1);
  background: rgba(231, 40, 87, 0.1);
}

/* 免責聲明對話框樣式 */
.disclaimer-dialog {
  background: linear-gradient(145deg, rgba(15, 15, 15, 0.98) 0%, rgba(30, 30, 30, 0.98) 100%);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 28px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
  overflow: hidden;
}

.disclaimer-dialog-title {
  color: rgba(255, 255, 255, 0.95);
  font-weight: 600;
  font-size: 1.2rem;
  padding: 20px 24px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  background: linear-gradient(135deg, rgba(231, 40, 87, 0.1) 0%, rgba(231, 40, 87, 0.05) 100%);
}

.disclaimer-dialog-content {
  padding: 24px;
}

/* Accordion 手風琴樣式 */
.disclaimer-accordion {
  background: transparent;
  border-radius: 16px;
  overflow: hidden;
}

.disclaimer-panel {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 0;
  margin-bottom: 0;
  overflow: hidden;
  transition: all 0.3s ease;
}

.disclaimer-panel:first-child {
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
}

.disclaimer-panel:last-child {
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
}

.disclaimer-panel:not(:last-child) {
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.disclaimer-panel:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.12);
}

.panel-title {
  background: rgba(255, 255, 255, 0.02);
}

.title-content {
  display: flex;
  align-items: center;
  font-weight: 500;
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.9);
}

.panel-content {
  background: transparent;
  padding: 16px 20px;
}

.section-text {
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.95rem;
  text-align: justify;
  text-justify: inter-ideograph;
  margin-bottom: 0;
}

.disclaimer-dialog-actions {
  padding: 16px 24px 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

/* Vuetify Accordion 深層樣式覆蓋 */
:deep(.v-expansion-panel-title__overlay) {
  background: rgba(255, 255, 255, 0.02);
}

:deep(.v-expansion-panel-title--active) {
  background: rgba(231, 40, 87, 0.08);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
}

:deep(.v-expansion-panel-text__wrapper) {
  padding: 0;
}

/* 響應式設計 */
@media (max-width: 600px) {
  .disclaimer-card .v-card-text {
    padding: 12px 16px !important;
  }
  
  .disclaimer-card .text-caption {
    font-size: 0.75rem !important;
  }
  
  .disclaimer-dialog {
    margin: 16px;
    border-radius: 20px;
  }
  
  .disclaimer-dialog-title {
    font-size: 1.1rem;
    padding: 16px 20px 12px;
  }
  
  .disclaimer-dialog-content {
    padding: 20px;
  }
  
  .disclaimer-panel:first-child {
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
  }

  .disclaimer-panel:last-child {
    border-bottom-left-radius: 12px;
    border-bottom-right-radius: 12px;
  }
  
  .title-content {
    font-size: 0.95rem;
  }
  
  .panel-content {
    padding: 12px 16px;
  }
  
  .section-text {
    font-size: 0.9rem;
    line-height: 1.6;
  }
  
  .disclaimer-dialog-actions {
    padding: 12px 20px 16px;
  }
}
</style>
