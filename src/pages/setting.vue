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
              
                          <!-- MD3 風格的 icon 選擇器 - 分頁版本 -->
            <div class="icon-selector">
              <!-- 分頁指示器 -->
              <div class="icon-pagination-header">
                <div class="pagination-info">
                  <span class="text-caption text-medium-emphasis">
                    {{ t('settings.display.iconPage') }} {{ currentIconPage + 1 }} / {{ totalIconPages }}
                  </span>
                </div>
                <div class="pagination-controls">
                  <v-btn
                    @click="previousIconPage"
                    :disabled="currentIconPage === 0"
                    icon
                    size="small"
                    variant="text"
                    class="pagination-btn"
                  >
                    <v-icon>mdi-chevron-left</v-icon>
                  </v-btn>
                  <v-btn
                    @click="nextIconPage"
                    :disabled="currentIconPage === totalIconPages - 1"
                    icon
                    size="small"
                    variant="text"
                    class="pagination-btn"
                  >
                    <v-icon>mdi-chevron-right</v-icon>
                  </v-btn>
                </div>
              </div>

              <!-- 圖標網格 -->
              <v-row class="icon-grid" :class="{ 'single-row': isSingleRow }">
                <v-col 
                  v-for="icon in currentPageIcons" 
                  :key="icon.id" 
                  cols="4" 
                  sm="4" 
                  md="2"
                  lg="2"
                  xl="2"
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
                    
                    <!-- NEW 標籤 -->
                    <div 
                      v-if="isNewIcon(icon.id) && settingsStore.selectedIcon !== icon.id"
                      class="icon-new-badge"
                    >
                      NEW
                    </div>
                  </v-card>
                </v-col>
              </v-row>

              <!-- 頁面指示點 -->
              <div class="icon-page-dots" :class="{ 'single-row': isSingleRow }">
                <v-btn
                  v-for="(page, index) in totalIconPages"
                  :key="index"
                  @click="goToIconPage(index)"
                  :class="['page-dot', { 'page-dot--active': currentIconPage === index }]"
                  icon
                  size="x-small"
                  variant="text"
                >
                  <div class="dot"></div>
                </v-btn>
              </div>
            </div>
            </div>

          </v-card-text>
        </v-card>

        <!-- 通知設定 -->
        <v-card rounded="xl" class="settings-card mb-4">
          <v-card-title class="settings-section-title">
            <v-icon class="mr-3" color="primary">mdi-bell-outline</v-icon>
            {{ t('settings.notifications.title') }}
          </v-card-title>
          <v-card-text>
            <div class="setting-item">
              <div class="setting-info">
                <div class="setting-label">{{ t('settings.contentSettings.pushNotifications') }}</div>
                <div class="setting-description">{{ pushDescription }}</div>
              </div>
              <div>
                <v-btn
                  v-if="!notificationsSupported"
                  disabled
                  variant="outlined"
                  size="small"
                >
                  {{ unsupportedText }}
                </v-btn>
                <v-btn
                  v-else-if="permissionState !== 'granted'"
                  color="primary"
                  variant="flat"
                  size="small"
                  @click="enableNotifications"
                >
                  {{ requestPermissionText }}
                </v-btn>
                <div v-else class="d-flex align-center" style="gap: 16px;">
                  <v-switch
                    :model-value="notificationsStore.isSubscribed"
                    :loading="isTogglingSubscription"
                    color="primary"
                    hide-details
                    @update:model-value="handleSubscriptionToggle"
                  ></v-switch>
                  <v-btn
                    v-if="notificationsStore.isSubscribed"
                    variant="outlined"
                    size="small"
                    :loading="isTestingNotification"
                    @click="testNotification"
                    class="ml-2"
                  >
                    {{ testNotificationText }}
                  </v-btn>
                </div>
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

            <!-- AI 內容顯示 -->
            <div class="setting-item mt-6">
              <div class="setting-info">
                <div class="setting-label">{{ t('settings.contentSettings.aiContent') }}</div>
                <div class="setting-description">{{ t('settings.contentSettings.aiDescription') }}</div>
              </div>
              <v-switch
                v-model="showAIContent"
                color="primary"
                hide-details
              ></v-switch>
            </div>

            <!-- 每日簽到提醒 -->
            <div class="setting-item mt-6">
              <div class="setting-info">
                <div class="setting-label">{{ t('settings.contentSettings.dailyCheckinReminder') }}</div>
                <div class="setting-description">{{ t('settings.contentSettings.dailyCheckinReminderDescription') }}</div>
              </div>
              <v-switch
                v-model="dailyCheckinReminder"
                color="primary"
                hide-details
              ></v-switch>
            </div>

            <!-- 贊助支持（開啟 R18 時顯示） -->
            <div v-if="showR18Content" class="mt-4">
              <v-divider class="mb-4"></v-divider>
              
              <!-- 多語系贊助感謝訊息 -->
              <v-alert
                color="primary"
                variant="tonal"
                rounded="lg"
                icon="mdi-hand-heart"
                class="mb-4"
              >
                <div class="text-body-2">
                  <strong>{{ t('settings.supportTitle') }}</strong>
                </div>
                <div class="text-body-2 mt-2" v-for="(line, idx) in supportContentLines" :key="idx">
                  {{ line }}
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
import { useNotificationsStore } from '@/stores/notifications'

export default {
  name: "SettingsPage",
  setup() {
    const settingsStore = useSettingsStore()
    const notificationsStore = useNotificationsStore()
    return { settingsStore, availableIcons, notificationsStore }
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
      
      // 圖標分頁控制
      currentIconPage: 0,
      iconsPerPage: 6, // 每頁顯示的圖標數量：PC上一行6個，手機上兩行3個
      newIconCount: 3, // 最新的幾個圖標會顯示 NEW 標籤
      // 推播狀態
      permissionState: 'default',
      isTogglingSubscription: false, // 控制開關 loading 狀態
      isTestingNotification: false, // 控制測試按鈕 loading 狀態
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
    showAIContent: {
      get() { return this.settingsStore.showAIContent },
      set(value) { this.settingsStore.updateAISetting(value) }
    },
    selectedForums: {
      get() { return this.settingsStore.selectedForums },
      set(value) { this.settingsStore.updateForumSelection(value) }
    },
    dailyCheckinReminder: {
      get() { return this.settingsStore.dailyCheckinReminderEnabled },
      set(value) { this.settingsStore.updateDailyCheckinReminder(value) }
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
    },
    supportContentLines() {
      return this.t('settings.supportContent').split('\n');
    },

    // 圖標分頁相關計算屬性
    totalIconPages() {
      return Math.ceil(availableIcons.length / this.iconsPerPage);
    },
    currentPageIcons() {
      const startIndex = this.currentIconPage * this.iconsPerPage;
      const endIndex = startIndex + this.iconsPerPage;
      // 保持原順序，因為 availableIcons 已經是從新到舊排列
      return availableIcons.slice(startIndex, endIndex);
    },
    
    // 用於初始化頁面的原始順序圖標陣列
    originalOrderIcons() {
      return availableIcons;
    },
    
    // 判斷是否只顯示一行圖標
    isSingleRow() {
      // 根據螢幕寬度和圖標數量判斷
      if (window.innerWidth >= 769) { // PC版
        return this.currentPageIcons.length <= 6; // 6個圖標在PC上會顯示為一行
      }
      return false; // 手機版保持原間距
    },

            // 推播相關文字與支援狀態
        notificationsSupported() {
          return this.notificationsStore.isNotificationSupported
        },
        requestPermissionText() {
          return this.t('settings.contentSettings.enablePush') || '啟用通知'
        },
        unsupportedText() {
          const message = this.notificationsStore.supportMessage
          if (message === 'ios_need_pwa') {
            return this.t('settings.contentSettings.iosNeedPWA') || 'iOS 需要先加到桌面'
          }
          return this.t('settings.contentSettings.pushUnsupported') || '瀏覽器不支援'
        },
        pushDescription() {
          const message = this.notificationsStore.supportMessage
          if (message === 'ios_need_pwa') {
            return this.t('settings.contentSettings.iosInstallGuide') || '在 iOS 上需要先將網站「加入主畫面」才能使用推播通知'
          }
          return this.t('settings.contentSettings.pushDescription') || '啟用後將於有新的兌換碼時通知你'
        },
        testNotificationText() {
          return this.t('settings.contentSettings.testNotification') || '測試通知'
        },
  },
  methods: {
    // 判斷是否為新圖標
    isNewIcon(iconId) {
      // 找到圖標對象
      const icon = availableIcons.find(icon => icon.id === iconId);
      if (!icon) return false;
      
      // 根據 order 值判斷，order 值最大的幾個是最新的
      const allOrders = availableIcons.map(icon => icon.order).sort((a, b) => b - a);
      const minOrderForNew = allOrders[this.newIconCount - 1] || 0;
      
      return icon.order >= minOrderForNew;
    },

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
        'zh-Hans-CN': 'Ko-fi 请喝咖啡',
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
        'zh-Hans-CN': 'Gank 小额赞助',
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
        
        // 如果已訂閱推播，更新 Service Worker 的 icon 偏好
        this.updateServiceWorkerPreferences()
      }
    },

    // 圖標分頁控制方法
    nextIconPage() {
      if (this.currentIconPage < this.totalIconPages - 1) {
        this.currentIconPage++;
      }
    },
    previousIconPage() {
      if (this.currentIconPage > 0) {
        this.currentIconPage--;
      }
    },
    goToIconPage(pageIndex) {
      if (pageIndex >= 0 && pageIndex < this.totalIconPages) {
        this.currentIconPage = pageIndex;
      }
    },

    // 初始化圖標頁面，確保選中的圖標在當前頁面
    initializeIconPage() {
      // availableIcons 已經按 order 排序，直接查找索引即可
      const selectedIconIndex = availableIcons.findIndex(icon => icon.id === this.settingsStore.selectedIcon);
      if (selectedIconIndex !== -1) {
        const targetPage = Math.floor(selectedIconIndex / this.iconsPerPage);
        this.currentIconPage = targetPage;
      }
    },
    
    // 推播：初始化與狀態同步
    async initNotifications() {
      try {
        await this.notificationsStore.initialize()
        this.permissionState = this.notificationsStore.permissionState
      } catch (e) {
        // ignore
      }
    },
    async enableNotifications() {
      try {
        await this.notificationsStore.requestPermissionAndSubscribe()
        this.permissionState = this.notificationsStore.permissionState
        this.showSuccess(this.t('settings.success.enabled') || '已啟用通知')
      } catch (e) {
        this.showSuccess(e?.message || '啟用通知失敗')
      }
    },
    async handleSubscriptionToggle(val) {
      this.isTogglingSubscription = true
      try {
        if (val) {
          await this.notificationsStore.requestPermissionAndSubscribe()
        } else {
          await this.notificationsStore.unsubscribe()
        }
        this.permissionState = this.notificationsStore.permissionState
      } catch (e) {
        // 錯誤時顯示訊息
        this.showSuccess(e?.message || '操作失敗')
      } finally {
        this.isTogglingSubscription = false
      }
    },

    // 更新 Service Worker 的使用者偏好
    updateServiceWorkerPreferences() {
      if (this.notificationsStore.isSubscribed && this.notificationsStore.registration?.active) {
        this.notificationsStore.registration.active.postMessage({
          type: 'SET_USER_PREFERENCES',
          preferences: {
            language: this.settingsStore.selectedLanguage,
            icon: this.notificationsStore.getFaviconPath(this.settingsStore.selectedIcon)
          }
        })
      }
    },

    // 測試通知
    async testNotification() {
      this.isTestingNotification = true
      try {
        await this.notificationsStore.sendTestNotification()
        this.showSuccess(this.t('settings.success.testNotification') || '測試通知已發送')
      } catch (e) {
        this.showSuccess(e?.message || '發送測試通知失敗')
      } finally {
        this.isTestingNotification = false
      }
    },

    // 處理視窗大小變化
    handleResize() {
      // 強制重新計算響應式屬性
      this.$forceUpdate();
    },
  },
  
  watch: {
    // 監聽論壇選擇變化，手動觸發 storage 事件來通知其他組件
    selectedForums: {
      handler(newForums, oldForums) {
        // 檢查是否有實際變化
        if (JSON.stringify(newForums) !== JSON.stringify(oldForums)) {
          // 使用 setTimeout 確保設定已經保存到 localStorage
          this.$nextTick(() => {
            // 手動觸發 storage 事件來通知其他組件
            window.dispatchEvent(new StorageEvent('storage', {
              key: 'bd2_settings',
              newValue: localStorage.getItem('bd2_settings')
            }));
            
            // 顯示成功訊息
            this.showSuccess(this.t('settings.success.forumsUpdated'));
          });
        }
      },
      deep: true
    },
  },
  
  mounted() {
    this.settingsStore.loadSettings();
    
    // 初始化圖標分頁，確保選中的圖標在當前頁面
    this.initializeIconPage();
    
    // 添加滾動監聽
    window.addEventListener('scroll', this.handleScroll);
    window.addEventListener('resize', this.handleScroll);
    
    // 添加視窗大小變化監聽，用於圖標佈局調整
    window.addEventListener('resize', this.handleResize);

    // 推播初始化
    this.initNotifications();
  },
  
  beforeUnmount() {
    // 移除事件監聽
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('resize', this.handleScroll);
    window.removeEventListener('resize', this.handleResize);
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

/* 分頁控制 */
.icon-pagination-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 0 8px;
}

.pagination-info {
  flex: 1;
}

.pagination-controls {
  display: flex;
  gap: 4px;
}

.pagination-btn {
  opacity: 0.7;
  transition: opacity 0.2s ease;
}

.pagination-btn:hover:not(:disabled) {
  opacity: 1;
}

.pagination-btn:disabled {
  opacity: 0.3;
}

/* 圖標網格 */
.icon-grid {
  min-height: 140px; /* 固定高度，避免分頁切換時跳動 */
  margin-bottom: 16px;
}

/* PC 版調整：當只顯示一行圖標時減少底部間距 */
@media (min-width: 769px) {
  .icon-grid {
    margin-bottom: 8px; /* PC 版減少底部間距 */
  }
  
  .icon-page-dots {
    margin-top: 4px; /* PC 版減少頂部間距 */
  }
}

/* 單行圖標的特殊樣式 */
.icon-grid.single-row {
  margin-bottom: 8px; /* 單行時減少底部間距 */
}

.icon-page-dots.single-row {
  margin-top: 4px; /* 單行時減少頂部間距 */
}

/* 響應式間距調整 */
@media (min-width: 769px) {
  .icon-grid.single-row {
    margin-bottom: 6px; /* PC版單行時進一步減少間距 */
  }
  
  .icon-page-dots.single-row {
    margin-top: 2px; /* PC版單行時進一步減少間距 */
  }
}

/* 強制佈局一致性，避免中間斷點的不平衡佈局 */
@media (min-width: 600px) and (max-width: 768px) {
  .icon-grid .v-col {
    flex-basis: 33.333333% !important;
    max-width: 33.333333% !important;
  }
}

/* 頁面指示點 */
.icon-page-dots {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 8px;
}

.page-dot {
  width: 24px !important;
  height: 24px !important;
  min-width: unset !important;
}

.page-dot .dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.3);
  transition: all 0.2s ease;
}

.page-dot--active .dot {
  background-color: #e72857; /* 使用主題色 */
  transform: scale(1.2);
}

.page-dot:hover .dot {
  background-color: rgba(255, 255, 255, 0.5);
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

/* NEW 標籤樣式 */
.icon-new-badge {
  position: absolute;
  top: 4px;
  right: 4px;
  background: linear-gradient(135deg, #e72857, #ff4081);
  color: white;
  font-size: 10px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 8px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  box-shadow: 0 2px 4px rgba(231, 40, 87, 0.3);
  z-index: 2;
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