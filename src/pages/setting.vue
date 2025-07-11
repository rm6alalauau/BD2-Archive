<template>
  <v-container class="settings-page">
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">
        <!-- 頁面標題 -->
        <div class="page-header mb-6">
          <h1 class="page-title">{{ t('settings.title') }}</h1>
                      <p class="page-subtitle">{{ t('settings.subtitle') }}</p>
        </div>

        <!-- 外觀設定 -->
        <v-card rounded="xl" class="settings-card mb-4">
          <v-card-title class="settings-section-title">
            <v-icon class="mr-3" color="primary">mdi-palette</v-icon>
            {{ t('settings.display.title') }}
          </v-card-title>
          <v-card-text>
            <!-- 字體縮放 -->
            <div class="setting-item">
              <div class="setting-info">
                <div class="setting-label">{{ t('settings.display.fontSize') }}</div>
                <div class="setting-description">{{ t('settings.display.fontSizeDescription') }}</div>
              </div>
              <div class="font-scale-controls">
                <v-btn
                  @click="decreaseFontScale"
                  :disabled="fontScale <= 0.8"
                  icon
                  size="small"
                  variant="outlined"
                  aria-label="減少字體大小"
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
                  aria-label="增加字體大小"
                >
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </div>
            </div>

            <!-- 網站圖示選擇 -->
            <div class="setting-item mt-6" style="align-items: flex-start; flex-direction: column;">
              <div class="setting-info">
                <div class="setting-label">{{ t('settings.display.websiteIcon') }}</div>
                <div class="setting-description">{{ t('settings.display.websiteIconDescription') }}</div>
              </div>
              
              <!-- MD3 風格的 icon 選擇器 -->
              <div class="icon-selector">
                <v-row>
                  <v-col 
                    v-for="icon in availableIcons" 
                    :key="icon.id" 
                    cols="6" 
                    sm="4" 
                    md="3" 
                    lg="2"
                  >
                    <v-card
                      @click="onSelectIcon(icon.id)"
                      :class="['icon-card', { 'icon-card--selected': settingsStore.selectedIcon === icon.id }]"
                      variant="outlined"
                      rounded="lg"
                      elevation="0"
                      hover
                    >
                      <v-card-text class="pa-3 text-center">
                        <div class="icon-preview">
                          <img 
                            :src="icon.path" 
                            :alt="`Icon ${icon.id}`"
                            class="icon-image"
                          />
                        </div>
                      </v-card-text>
                      
                      <!-- 選中狀態指示器 -->
                      <div 
                        v-if="settingsStore.selectedIcon === icon.id"
                        class="icon-selected-indicator"
                      >
                        <v-icon color="primary" size="small">mdi-check-circle</v-icon>
                      </div>
                    </v-card>
                  </v-col>
                </v-row>
              </div>
            </div>

          </v-card-text>
        </v-card>

        <!-- 內容設定 -->
        <v-card rounded="xl" class="settings-card mb-4">
          <v-card-title class="settings-section-title">
            <v-icon class="mr-3" color="primary">mdi-filter</v-icon>
            {{ t('settings.contentSettings.title') }}
          </v-card-title>
          <v-card-text>
            <!-- R18 內容顯示 -->
            <div class="setting-item">
              <div class="setting-info">
                <div class="setting-label">{{ t('settings.contentSettings.r18Content') }}</div>
                <div class="setting-description">{{ t('settings.contentSettings.r18Description') }}</div>
              </div>
              <v-switch
                v-model="showR18Content"
                color="primary"
                hide-details
              ></v-switch>
            </div>

            <!-- 贊助支持（開啟 R18 時顯示） -->
            <div v-if="showR18Content" class="mt-4">
              <v-divider class="mb-4"></v-divider>
              
              <!-- 感謝訊息（僅繁體中文顯示） -->
              <v-alert
                v-if="settingsStore.selectedLanguage === 'zh-Hant-TW'"
                color="primary"
                variant="tonal"
                rounded="lg"
                icon="mdi-hand-heart"
                class="mb-4"
              >
                <div class="text-body-2">
                  <strong>支持 The BD2 Pulse 持續運行</strong>
                </div>
                <div class="text-body-2 mt-2">
                  大家好，我是本站的開發者。感謝大家的支持！網站上線第二天，Cloudflare 的用量就超出了免費額度，這份熱情真的超乎我的想像。
                </div>
                <div class="text-body-2 mt-2">
                  為了讓大家能持續穩定地使用，我已經將服務升級到了付費方案。如果你覺得這個小工具對你有幫助，並有多餘的能力，歡迎通過下方的連結「請我喝杯咖啡」，任何一點支持都將成為我維護和優化網站的巨大動力！
                </div>
                <div class="text-body-2 mt-2">
                  <strong>再次感謝每一位使用者。</strong>
                </div>
              </v-alert>

              <!-- 贊助按鈕 -->
              <div class="donate-buttons">
                <v-row>
                  <v-col cols="12" sm="6">
                    <v-btn
                      color="primary"
                      variant="flat"
                      size="large"
                      rounded="lg"
                      block
                      @click="openKofi"
                      class="donate-btn"
                    >
                      <v-icon class="mr-2">mdi-coffee</v-icon>
                      {{ getKofiButtonText() }}
                    </v-btn>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-btn
                      color="secondary"
                      variant="flat"
                      size="large"
                      rounded="lg"
                      block
                      @click="openGank"
                      class="donate-btn"
                    >
                      <v-icon class="mr-2">mdi-gift</v-icon>
                      {{ getGankButtonText() }}
                    </v-btn>
                  </v-col>
                </v-row>
              </div>
            </div>

            <v-divider class="my-4"></v-divider>

            <!-- 論壇顯示設定 -->
            <div class="setting-item">
              <div class="setting-info">
                <div class="setting-label">{{ t('settings.forumSettings.title') }}</div>
                <div class="setting-description">{{ t('settings.forumSettings.description') }}</div>
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
              {{ t('settings.forumSettings.minRequired') }}
            </v-alert>
          </v-card-text>
        </v-card>

        <!-- 資料管理 -->
        <v-card rounded="xl" class="settings-card mb-4">
          <v-card-title class="settings-section-title">
            <v-icon class="mr-3" color="primary">mdi-database</v-icon>
            {{ t('settings.dataManagement.title') }}
          </v-card-title>
          <v-card-text>
            <!-- 清除使用者資料 -->
            <div class="setting-item">
              <div class="setting-info">
                <div class="setting-label">{{ t('settings.dataManagement.clearUserData') }}</div>
                <div class="setting-description">{{ t('settings.dataManagement.clearDescription') }}</div>
              </div>
              <v-btn
                @click="showClearDataDialog = true"
                color="warning"
                variant="outlined"
                size="small"
              >
                <v-icon class="mr-2">mdi-delete-sweep</v-icon>
                {{ t('settings.dataManagement.clearButton') }}
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
              {{ t('settings.dataManagement.resetButton') }}
            </v-btn>
            <div class="mt-2 text-caption text-medium-emphasis">
              {{ t('settings.dataManagement.resetHint') }}
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
            {{ t('settings.actions.backToHome') }}
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
            <li>語言：繁體中文（在導航欄切換）</li>
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
        <v-btn @click="showSuccessMessage = false" icon="mdi-close" variant="text" aria-label="關閉訊息"></v-btn>
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
      <v-tooltip activator="parent" location="left" :aria-label="t('settings.actions.backToHome')">{{ t('settings.actions.backToHome') }}</v-tooltip>
    </v-fab>
  </v-container>
</template>

<script>
import { useSettingsStore, availableIcons } from '@/stores/settings'

export default {
  name: "SettingsPage",
  setup() {
    const settingsStore = useSettingsStore()
    return { settingsStore, availableIcons }
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
    // 多語言文字
    t() {
      return (key, params) => this.$t(key, this.settingsStore.selectedLanguage, params);
    },
    
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
        { label: this.t('forums.bahamut'), value: 'Bahamut' },
        { label: this.t('forums.nga'), value: 'NGAList' },
        { label: this.t('forums.ptt'), value: 'PTTList' },
        { label: this.t('forums.x'), value: 'XPosts' },
        { label: this.t('forums.reddit'), value: 'RedditPosts' },
        { label: this.t('forums.naver'), value: 'NaverPosts' },
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
        this.showSuccess(this.t('settings.success.cleared'));
      } catch (error) {
        console.error('清除資料時發生錯誤:', error);
      }
    },
    
    // 重置所有設定
    resetToDefaults() {
      this.settingsStore.resetToDefaults();
      this.showResetDialog = false;
      this.showSuccess(this.t('settings.success.reset'));
    },
    
    // 顯示成功訊息
    showSuccess(message) {
      this.successMessage = message;
      this.showSuccessMessage = true;
    },

    // 贊助相關方法
    openKofi() {
      // 直接打開 Ko-fi 頁面
      window.open('https://ko-fi.com/thebd2pulse', '_blank');
    },

    openGank() {
      // 打開 Gank 贊助頁面
      window.open('https://ganknow.com/thebd2pulse/tip', '_blank');
    },

    // 多語言按鈕文字
    getKofiButtonText() {
      const lang = this.settingsStore.selectedLanguage;
      const texts = {
        'zh-Hant-TW': 'Ko-fi 請喝咖啡',
        'en': 'Buy me a coffee',
        'ja-JP': 'コーヒーをおごる',
        'ko-KR': '커피 한 잔 사주세요'
      };
      return texts[lang] || texts['zh-Hant-TW'];
    },

    getGankButtonText() {
      const lang = this.settingsStore.selectedLanguage;
      const texts = {
        'zh-Hant-TW': 'Gank 小額贊助',
        'en': 'Support via Gank',
        'ja-JP': 'Gankで支援',
        'ko-KR': 'Gank으로 후원'
      };
      return texts[lang] || texts['zh-Hant-TW'];
    },

    // icon 切換方法
    onSelectIcon(iconId) {
      if (this.settingsStore.selectedIcon !== iconId) {
        this.settingsStore.setIcon(iconId)
        this.showSuccess(this.t('settings.success.iconChanged'))
      }
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

/* Icon 選擇器 - MD3 風格 */
.icon-selector {
  width: 100%;
  margin-top: 16px;
}

.icon-card {
  position: relative;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(255, 255, 255, 0.12) !important;
  background: rgba(255, 255, 255, 0.02) !important;
  overflow: hidden;
}

.icon-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-color: rgba(255, 255, 255, 0.24) !important;
}

.icon-card--selected {
  border-color: rgb(66, 185, 131) !important;
  background: rgba(66, 185, 131, 0.08) !important;
  box-shadow: 0 2px 8px rgba(66, 185, 131, 0.2);
}

.icon-card--selected:hover {
  border-color: rgb(66, 185, 131) !important;
  background: rgba(66, 185, 131, 0.12) !important;
}

.icon-preview {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 48px;
  margin-bottom: 8px;
}

.icon-image {
  width: 48px;
  height: 48px;
  object-fit: contain;
  border-radius: 8px;
  transition: transform 0.2s ease;
}

.icon-card:hover .icon-image {
  transform: scale(1.05);
}



.icon-selected-indicator {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(66, 185, 131, 0.9);
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(4px);
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

/* 贊助按鈕樣式 */
.donate-buttons {
  margin-top: 16px;
}

.donate-btn {
  height: 48px;
  font-weight: 600;
  text-transform: none;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
}

.donate-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.donate-btn :deep(.v-btn__content) {
  font-size: 0.95rem;
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
  
  .donate-buttons .v-col {
    padding: 4px 8px;
  }
  
  .donate-btn {
    margin-bottom: 8px;
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