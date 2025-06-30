<template>
  <v-container class="settings-page">
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">
        <!-- 頁面標題 -->
        <div class="page-header mb-6">
          <h1 class="page-title">設定</h1>
          <p class="page-subtitle">自訂您的使用體驗</p>
        </div>

        <!-- 外觀設定 -->
        <v-card rounded="xl" class="settings-card mb-4">
          <v-card-title class="settings-section-title">
            <v-icon class="mr-3" color="primary">mdi-palette</v-icon>
            外觀設定
          </v-card-title>
          <v-card-text>
            <!-- 字體縮放 -->
            <div class="setting-item">
              <div class="setting-info">
                <div class="setting-label">字體大小</div>
                <div class="setting-description">調整介面字體的顯示大小</div>
              </div>
              <div class="font-scale-controls">
                <v-btn
                  @click="decreaseFontScale"
                  :disabled="fontScale <= 0.8"
                  icon
                  size="small"
                  variant="outlined"
                >
                  <v-icon>mdi-minus</v-icon>
                </v-btn>
                <span class="font-scale-value mx-4">{{ Math.round(fontScale * 100) }}%</span>
                <v-btn
                  @click="increaseFontScale"
                  :disabled="fontScale >= 1.3"
                  icon
                  size="small"
                  variant="outlined"
                >
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </div>
            </div>
          </v-card-text>
        </v-card>

        <!-- 內容設定 -->
        <v-card rounded="xl" class="settings-card mb-4">
          <v-card-title class="settings-section-title">
            <v-icon class="mr-3" color="primary">mdi-filter</v-icon>
            內容設定
          </v-card-title>
          <v-card-text>
            <!-- R18 內容顯示 -->
            <div class="setting-item">
              <div class="setting-info">
                <div class="setting-label">Pixiv R18 內容</div>
                <div class="setting-description">是否顯示成人內容（需滿 18 歲）</div>
              </div>
              <v-switch
                v-model="showR18Content"
                color="primary"
                hide-details
              ></v-switch>
            </div>

            <v-divider class="my-4"></v-divider>

            <!-- 論壇顯示設定 -->
            <div class="setting-item">
              <div class="setting-info">
                <div class="setting-label">顯示論壇</div>
                <div class="setting-description">選擇要顯示的論壇來源</div>
              </div>
            </div>
            
            <div class="forum-checkboxes mt-3">
              <v-checkbox
                v-for="forum in forumOptions"
                :key="forum.value"
                v-model="selectedForums"
                :value="forum.value"
                :label="forum.label"
                :disabled="selectedForums.length === 1 && selectedForums.includes(forum.value)"
                color="primary"
                hide-details
                class="forum-checkbox"
              ></v-checkbox>
            </div>
            
            <v-alert
              v-if="selectedForums.length === 1"
              type="info"
              variant="tonal"
              class="mt-3"
              density="compact"
            >
              至少需要選擇一個論壇來源
            </v-alert>
          </v-card-text>
        </v-card>

        <!-- 資料管理 -->
        <v-card rounded="xl" class="settings-card mb-4">
          <v-card-title class="settings-section-title">
            <v-icon class="mr-3" color="primary">mdi-database</v-icon>
            資料管理
          </v-card-title>
          <v-card-text>
            <!-- 清除使用者資料 -->
            <div class="setting-item">
              <div class="setting-info">
                <div class="setting-label">清除使用者資料</div>
                <div class="setting-description">清除已儲存的暱稱和兌換記錄</div>
              </div>
              <v-btn
                @click="showClearDataDialog = true"
                color="warning"
                variant="outlined"
                size="small"
              >
                <v-icon class="mr-2">mdi-delete-sweep</v-icon>
                清除資料
              </v-btn>
            </div>
          </v-card-text>
        </v-card>

        <!-- 重置設定 -->
        <v-card rounded="xl" class="settings-card mb-6">
          <v-card-text class="text-center py-6">
            <v-btn
              @click="showResetDialog = true"
              color="error"
              variant="outlined"
              size="large"
            >
              <v-icon class="mr-2">mdi-restore</v-icon>
              還原預設值
            </v-btn>
            <div class="mt-2 text-caption text-medium-emphasis">
              將所有設定恢復為預設狀態
            </div>
          </v-card-text>
        </v-card>

        <!-- 導航按鈕 -->
        <div class="navigation-buttons">
          <v-btn
            @click="goToHome"
            color="primary"
            variant="flat"
            size="large"
            rounded="lg"
            class="home-btn"
          >
            <v-icon class="mr-2">mdi-home</v-icon>
            返回首頁
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <!-- 清除資料確認對話框 -->
    <v-dialog v-model="showClearDataDialog" max-width="400">
      <v-card rounded="xl">
        <v-card-title class="text-h6">
          <v-icon class="mr-2" color="warning">mdi-alert</v-icon>
          確認清除資料
        </v-card-title>
        <v-card-text>
          <p>此操作將清除以下資料：</p>
          <ul class="mt-2">
            <li>已儲存的遊戲暱稱</li>
            <li>兌換碼使用記錄</li>
            <li>頭像選擇記錄</li>
          </ul>
          <p class="mt-3 text-warning">此操作無法復原，確定要繼續嗎？</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="showClearDataDialog = false" variant="text">取消</v-btn>
          <v-btn @click="clearUserData" color="warning" variant="flat">確定清除</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 重置設定確認對話框 -->
    <v-dialog v-model="showResetDialog" max-width="400">
      <v-card rounded="xl">
        <v-card-title class="text-h6">
          <v-icon class="mr-2" color="error">mdi-restore</v-icon>
          確認重置設定
        </v-card-title>
        <v-card-text>
          <p>此操作將恢復所有設定為預設值：</p>
          <ul class="mt-2">
            <li>字體大小：100%</li>
            <li>R18 內容：關閉</li>
            <li>論壇顯示：全部開啟</li>
          </ul>
          <p class="mt-3 text-error">確定要重置所有設定嗎？</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="showResetDialog = false" variant="text">取消</v-btn>
          <v-btn @click="resetToDefaults" color="error" variant="flat">確定重置</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 成功提示 -->
    <v-snackbar
      v-model="showSuccessMessage"
      :timeout="3000"
      color="success"
      location="top"
    >
      {{ successMessage }}
      <template v-slot:actions>
        <v-btn @click="showSuccessMessage = false" icon="mdi-close" variant="text"></v-btn>
      </template>
    </v-snackbar>

    <!-- 浮動返回按鈕（手機版） -->
    <v-fab
      v-show="showFloatingButton"
      @click="goToHome"
      color="primary"
      size="large"
      location="bottom end"
      class="floating-home-btn"
      :style="{ bottom: fabBottom + 'px' }"
    >
      <v-icon>mdi-home</v-icon>
      <v-tooltip activator="parent" location="left">返回首頁</v-tooltip>
    </v-fab>
  </v-container>
</template>

<script>
import { useSettingsStore } from '@/stores/settings'

export default {
  name: "SettingsPage",
  setup() {
    const settingsStore = useSettingsStore()
    return { settingsStore }
  },
  data() {
    return {
      // 對話框狀態
      showClearDataDialog: false,
      showResetDialog: false,
      
      // 成功訊息
      showSuccessMessage: false,
      successMessage: '',
      
      // 浮動按鈕控制
      showFloatingButton: false,
      fabBottom: 24,
    };
  },
  computed: {
    // 使用 store 的狀態（移除主題相關）
    fontScale: {
      get() { return this.settingsStore.fontScale },
      set(value) { this.settingsStore.updateFontScale(value) }
    },
    showR18Content: {
      get() { return this.settingsStore.showR18Content },
      set(value) { this.settingsStore.updateR18Setting(value) }
    },
    selectedForums: {
      get() { return this.settingsStore.selectedForums },
      set(value) { this.settingsStore.updateForumSelection(value) }
    },
    forumOptions() {
      return [
        { label: '巴哈姆特', value: 'Bahamut' },
        { label: 'NGA', value: 'NGAList' },
        { label: 'PTT', value: 'PTTList' },
        { label: 'X (Twitter)', value: 'XPosts' },
        { label: 'Reddit', value: 'RedditPosts' },
      ]
    }
  },
  methods: {
    // 字體縮放控制
    increaseFontScale() {
      if (this.fontScale < 1.3) {
        const newScale = Math.round((this.fontScale + 0.1) * 10) / 10;
        this.fontScale = newScale;
      }
    },
    
    decreaseFontScale() {
      if (this.fontScale > 0.8) {
        const newScale = Math.round((this.fontScale - 0.1) * 10) / 10;
        this.fontScale = newScale;
      }
    },
    
    // 導航功能
    goToHome() {
      this.$router.push('/');
    },
    
    // 處理滾動事件
    handleScroll() {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // 當滾動超過一定距離時顯示浮動按鈕（僅手機版）
      if (window.innerWidth <= 768) {
        this.showFloatingButton = scrollY > 200;
        
        // 調整浮動按鈕位置，避免被底部內容遮擋
        const distanceFromBottom = documentHeight - scrollY - windowHeight;
        this.fabBottom = distanceFromBottom < 100 ? 100 : 24;
      } else {
        this.showFloatingButton = false;
      }
    },
    
    // 清除使用者資料
    clearUserData() {
      try {
        // 清除兌換碼相關資料
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && (
            key.includes('coupon_') || 
            key.includes('nickname') || 
            key.includes('selectedAvatarId') ||
            key.includes('userProfile')
          )) {
            keysToRemove.push(key);
          }
        }
        
        keysToRemove.forEach(key => localStorage.removeItem(key));
        
        this.showClearDataDialog = false;
        this.showSuccess('使用者資料已清除');
      } catch (error) {
        console.error('清除資料時發生錯誤:', error);
      }
    },
    
    // 重置所有設定
    resetToDefaults() {
      this.settingsStore.resetToDefaults();
      this.showResetDialog = false;
      this.showSuccess('設定已重置為預設值');
    },
    
    // 顯示成功訊息
    showSuccess(message) {
      this.successMessage = message;
      this.showSuccessMessage = true;
    },
  },
  
  watch: {
    // 監聽論壇選擇變化，手動觸發 storage 事件來通知其他組件
    selectedForums: {
      handler() {
        // 使用 setTimeout 確保設定已經保存到 localStorage
        this.$nextTick(() => {
          // 手動觸發 storage 事件來通知其他組件
          window.dispatchEvent(new StorageEvent('storage', {
            key: 'bd2_settings',
            newValue: localStorage.getItem('bd2_settings')
          }));
        });
      },
      deep: true
    }
  },
  
  mounted() {
    this.settingsStore.loadSettings();
    
    // 添加滾動監聽
    window.addEventListener('scroll', this.handleScroll);
    window.addEventListener('resize', this.handleScroll);
  },
  
  beforeUnmount() {
    // 移除事件監聽
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('resize', this.handleScroll);
  },
};
</script>

<style scoped>
.settings-page {
  min-height: calc(100vh - 64px);
  padding-top: 32px;
  padding-bottom: 32px;
}

/* 頁面標題 */
.page-header {
  text-align: center;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #e72857;
  margin-bottom: 8px;
}

.page-subtitle {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
}

/* 設定卡片 */
.settings-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%);
  border: 1px solid rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(10px);
}

.settings-section-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  padding-bottom: 8px;
}

/* 設定項目 */
.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.setting-info {
  flex: 1;
}

.setting-label {
  font-size: 1rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 4px;
}

.setting-description {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.4;
}

/* 字體縮放控制 */
.font-scale-controls {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.font-scale-value {
  font-weight: 600;
  color: #e72857;
  min-width: 50px;
  text-align: center;
}

/* 論壇選項 */
.forum-checkboxes {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 8px;
}

.forum-checkbox {
  margin: 0;
}

/* 導航按鈕 */
.navigation-buttons {
  display: flex;
  justify-content: center;
  margin-top: 16px;
}

.home-btn {
  min-width: 160px;
  height: 48px;
  font-weight: 600;
  text-transform: none;
  letter-spacing: 0.5px;
}

/* 浮動按鈕 */
.floating-home-btn {
  position: fixed !important;
  z-index: 1000;
  transition: bottom 0.3s ease;
}

.floating-home-btn :deep(.v-btn) {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* 響應式設計 */
@media (max-width: 768px) {
  .setting-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .font-scale-controls {
    align-self: stretch;
    justify-content: center;
  }
  
  .forum-checkboxes {
    grid-template-columns: 1fr;
  }
  
  .page-title {
    font-size: 1.75rem;
  }
  
  /* 手機版隱藏固定導航按鈕，使用浮動按鈕 */
  .navigation-buttons {
    display: none;
  }
}

@media (min-width: 769px) {
  /* 桌面版隱藏浮動按鈕 */
  .floating-home-btn {
    display: none !important;
  }
}

@media (max-width: 480px) {
  .settings-page {
    padding-top: 16px;
  }
  
  .page-title {
    font-size: 1.5rem;
  }
  
  .font-scale-controls {
    gap: 16px;
  }
}
</style> 