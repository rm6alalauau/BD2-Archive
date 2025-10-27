<template>
  <v-app-bar
    :elevation="0"
    class="custom-nav-bar"
    height="64"
    fixed
  >
    <!-- 動畫容器 -->
    <div class="walker-stage">
            <img 
              v-for="walker in activeWalkers" 
              :key="walker.id"
              :src="walker.src" 
              class="walker"
              :style="walker.style"
              :data-walker-id="walker.id"
            />
    </div>

    <v-container class="d-flex align-center justify-space-between pa-0">
      <div class="brand-section" @click="goHome">
        <span class="brand-text">The BD2 Pulse</span>
      </div>

      <!-- 桌面版操作按鈕組 -->
      <div class="nav-actions d-none d-sm-flex align-center">
        <!-- 語言選擇器 -->
        <v-menu
          v-model="languageMenu"
          :close-on-content-click="true"
          location="bottom"
          transition="slide-y-transition"
        >
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              icon
              class="mr-2"
              :aria-label="t('nav.switchLanguage')"
            >
              <v-icon>mdi-web</v-icon>
              <v-tooltip activator="parent" location="bottom" :aria-label="t('nav.switchLanguage')">
                {{ t('nav.switchLanguage') }}
              </v-tooltip>
            </v-btn>
          </template>
          <v-list class="language-menu" density="compact">
            <v-list-item
              v-for="language in settingsStore.supportedLanguages"
              :key="language.code"
              @click="selectLanguage(language.code)"
              :active="language.code === settingsStore.selectedLanguage"
              class="language-menu-item"
            >
              <v-list-item-title>{{ language.name }}</v-list-item-title>
              <template v-slot:append v-if="language.code === settingsStore.selectedLanguage">
                <v-icon color="primary" size="18">mdi-check</v-icon>
              </template>
            </v-list-item>
          </v-list>
        </v-menu>

        <!-- 設定按鈕 -->
        <v-btn
          icon
          class="mr-2"
          @click="goToSettings"
          :aria-label="t('nav.settings')"
        >
          <v-icon>mdi-cog-outline</v-icon>
          <v-tooltip activator="parent" location="bottom" :aria-label="t('nav.settings')">{{ t('nav.settings') }}</v-tooltip>
        </v-btn>

        <!-- 意見回饋按鈕 -->
        <v-btn
          icon
          class="mr-2"
          @click="openFeedback"
          :aria-label="t('nav.feedback')"
        >
          <v-icon>mdi-comment-question-outline</v-icon>
          <v-tooltip activator="parent" location="bottom" :aria-label="t('nav.feedback')">{{ t('nav.feedback') }}</v-tooltip>
        </v-btn>

        <!-- 關於按鈕 -->
        <v-btn
          icon
          class="mr-2"
          @click="goToAbout"
          :aria-label="t('nav.about')"
        >
          <v-icon>mdi-information-outline</v-icon>
          <v-tooltip activator="parent" location="bottom" :aria-label="t('nav.about')">{{ t('nav.about') }}</v-tooltip>
        </v-btn>
      </div>

      <!-- 手機版選單按鈕 -->
      <v-btn
        @click="toggleMobileMenu"
        icon
        variant="text"
        class="d-sm-none"
        size="large"
        :aria-label="mobileMenu ? t('nav.closeMenu') : t('nav.openMenu')"
      >
        <v-icon size="20">{{ mobileMenu ? 'mdi-close' : 'mdi-menu' }}</v-icon>
      </v-btn>
    </v-container>
  </v-app-bar>

  <!-- 手機版下拉選單 -->
  <v-expand-transition>
    <div v-if="mobileMenu" class="mobile-nav d-sm-none">
      <v-container class="py-4">
        <div class="mobile-nav-items">
          <v-btn
            @click="goHome"
            variant="text"
            class="mobile-nav-item"
            block
          >
            <v-icon size="20" class="mr-3">mdi-home</v-icon>
            {{ t('nav.home') }}
          </v-btn>
          
          <v-btn
            @click="goToSettings"
            variant="text"
            class="mobile-nav-item"
            block
          >
            <v-icon size="20" class="mr-3">mdi-cog</v-icon>
            {{ t('nav.settings') }}
          </v-btn>
          
          <v-btn
            @click="openFeedback"
            variant="text"
            class="mobile-nav-item"
            block
          >
            <v-icon size="20" class="mr-3">mdi-comment-question-outline</v-icon>
            {{ t('nav.feedback') }}
          </v-btn>
          
          <v-btn
            @click="goToAbout"
            variant="text"
            class="mobile-nav-item"
            block
          >
            <v-icon size="20" class="mr-3">mdi-information-outline</v-icon>
            {{ t('nav.about') }}
          </v-btn>

          <!-- 手機版語言選擇 -->
          <v-divider class="my-2 opacity-30"></v-divider>
          <div class="mobile-language-section">
            <div class="mobile-language-label">
              <v-icon size="18" class="mr-2">mdi-web</v-icon>
              {{ t('nav.languageSelection') }}
            </div>
            <div class="mobile-language-grid">
              <v-btn
                v-for="language in settingsStore.supportedLanguages"
                :key="language.code"
                @click="selectLanguage(language.code)"
                :variant="language.code === settingsStore.selectedLanguage ? 'tonal' : 'text'"
                :color="language.code === settingsStore.selectedLanguage ? 'primary' : 'default'"
                class="mobile-language-btn"
                size="small"
              >
                <span class="language-name">{{ language.name }}</span>
                <v-icon 
                  v-if="language.code === settingsStore.selectedLanguage" 
                  size="16" 
                  class="ml-1"
                >
                  mdi-check
                </v-icon>
              </v-btn>
            </div>
          </div>
        </div>
      </v-container>
    </div>
  </v-expand-transition>
</template>

<script>
import { useSettingsStore } from '@/stores/settings'
import { watch } from 'vue'

export default {
  name: "Navigation",
  data() {
    return {
      mobileMenu: false,
      languageMenu: false,
      settingsStore: useSettingsStore(),

      // --- Walker 相關 Data ---
      walkerTemplates: [
        { name: 'r2', duration: 25, direction: 'right', src: '/yuri/effects/r2(25s).gif' },
        { name: 'l2', duration: 25, direction: 'left', src: '/yuri/effects/l2(25s).gif' },
        { name: 'r3', duration: 10, direction: 'right', src: '/yuri/effects/r3(10s).gif' },
        { name: 'l3', duration: 10, direction: 'left', src: '/yuri/effects/l3(10s).gif' },
        { name: 'r4', duration: 15, direction: 'right', src: '/yuri/effects/r4(15s).gif' },
        { name: 'l4', duration: 15, direction: 'left', src: '/yuri/effects/l4(15s).gif' },
        { name: 'r5', duration: 20, direction: 'right', src: '/yuri/effects/r5(20s).gif' },
        { name: 'l5', duration: 20, direction: 'left', src: '/yuri/effects/l5(20s).gif' },
      ],
      maxActiveWalkers: 8, // 同時存在的 Walker 數量上限
      activeWalkers: [],
      walkerInterval: null,
      animationFrameId: null, // 用於控制動畫循環
    };
  },
  computed: {
    // 多語言文字
    t() {
      return (key, params) => this.$t(key, this.settingsStore.selectedLanguage, params);
    }
  },
  methods: {
    goHome() {
      this.mobileMenu = false;
      if (this.$route.path !== '/') {
        this.$router.push('/');
      }
    },
    
    goToSettings() {
      this.mobileMenu = false;
      if (this.$route.path !== '/setting') {
        this.$router.push('/setting');
      }
    },
    
    openFeedback() {
      this.mobileMenu = false;
      if (this.$route.path !== '/feedback') {
        this.$router.push('/feedback');
      }
    },
    
    goToAbout() {
      this.mobileMenu = false;
      if (this.$route.path !== '/about') {
        this.$router.push('/about');
      }
    },
    
    selectLanguage(languageCode) {
      this.settingsStore.updateLanguage(languageCode);
      this.languageMenu = false;
      this.mobileMenu = false;
    },
    
    toggleMobileMenu() {
      this.mobileMenu = !this.mobileMenu;
    },

    // --- 全新的、統一的 Walker 動畫邏輯 ---
    spawnWalker() {
      // 檢查是否已達到數量上限
      if (this.activeWalkers.length >= this.maxActiveWalkers) {
        return; // 如果已達到上限，不生成新的 Walker
      }

      const template = this.walkerTemplates[Math.floor(Math.random() * this.walkerTemplates.length)];
      const walkerWidth = 64; // 與 CSS 中設定的寬度一致

      const newWalker = {
        id: Date.now() + Math.random(),
        src: template.src,
        direction: template.direction,
        duration: template.duration * 1000, // 將秒轉換為毫秒
        startTime: performance.now(),
        style: {
          // 初始位置由 JS 控制，CSS 中不再需要 animation
          transform: `translateX(${template.direction === 'left' ? -walkerWidth : window.innerWidth}px)`,
          bottom: `${Math.random() * 4}px`,
          zIndex: 5 - Math.round(template.duration / 5),
        }
      };
      this.activeWalkers.push(newWalker);
    },

    // 動畫主循環
    animateWalkers(timestamp) {
      const windowWidth = window.innerWidth;
      const walkerWidth = 64;

      // 遍歷所有 activeWalkers，更新它們的位置
      this.activeWalkers.forEach(walker => {
        const progress = (timestamp - walker.startTime) / walker.duration; // 計算動畫進度 (0.0 to 1.0+)
        
        // 如果動畫已完成，則跳過計算
        if (progress > 1.1) return; // 留一點緩衝

        const totalDistance = windowWidth + walkerWidth;
        const currentDistance = totalDistance * progress;

        let currentPos;
        if (walker.direction === 'left') {
          // 從左向右移動
          currentPos = -walkerWidth + currentDistance;
        } else {
          // 從右向左移動
          currentPos = windowWidth - currentDistance;
        }

        // 直接更新 style 的 transform 屬性，Vue 會響應式地更新到 DOM
        walker.style.transform = `translateX(${currentPos}px)`;
      });

      // 移除已經完全跑完動畫的 walker
      this.activeWalkers = this.activeWalkers.filter(w => (timestamp - w.startTime) < w.duration * 1.1);

      // 只要畫面上還有 walker，就繼續下一幀動畫
      if (this.activeWalkers.length > 0) {
        this.animationFrameId = requestAnimationFrame(this.animateWalkers);
      } else {
        this.animationFrameId = null; // 沒有 walker 了就停止循環
      }
    },

    startWalkerSpawner() {
      this.stopWalkerSpawner();
      this.walkerInterval = setInterval(() => {
        if (Math.random() < 0.3) {
           // 每次生成 walker 時，如果動畫循環已停止，就重新啟動它
          if (!this.animationFrameId) {
            this.animationFrameId = requestAnimationFrame(this.animateWalkers);
          }
          this.spawnWalker();
        }
      }, 3000);
    },

    stopWalkerSpawner() {
      clearInterval(this.walkerInterval);
      this.walkerInterval = null;
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = null;
      }
      this.activeWalkers = [];
    }
  },

  mounted() {
    // 確保設定已載入
    if (!this.settingsStore.isLoaded) {
      this.settingsStore.loadSettings();
    }
    
    // 路由變化時關閉選單
    this.$router.afterEach(() => {
      this.mobileMenu = false;
      this.languageMenu = false;
    });

    // 監聽彩蛋模式變化
    this.unwatch = watch(() => this.settingsStore.activeEasterEggMode, (newMode) => {
      if (newMode === 'walker_mode') { 
        this.startWalkerSpawner();
      } else {
        this.stopWalkerSpawner();
      }
    }, { immediate: true });
  },

  beforeUnmount() {
    this.stopWalkerSpawner();
    if (this.unwatch) {
      this.unwatch();
    }
  },
};
</script>


<style scoped>
/* 主導覽欄 */
.custom-nav-bar {
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(20, 20, 20, 0.95) 100%);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  z-index: 1000;
}

/* 導覽列的內容容器 (Logo, 按鈕等) */
.custom-nav-bar :deep(.v-container) {
  position: relative;
  z-index: 2;
}

/* --- Walker 動畫樣式 --- */

/* 動畫舞台 */
.walker-stage {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden; /* 改回 hidden，因為 JS 會精確計算位置 */
  z-index: 1;
  pointer-events: none;
}

/* 行走的角色 (GIF) - 只定義外觀，位置和動畫完全由 JS 控制 */
.walker {
  position: absolute;
  height: 64px;
  width: 64px; /* 固定寬度 */
  bottom: 0;
  pointer-events: none;
  image-rendering: pixelated;
  image-rendering: -webkit-optimize-contrast;
  /* 關鍵: 告知瀏覽器 transform 會頻繁變動，進行優化 */
  will-change: transform; 
  /* 初始位置由 JS 的 style.transform 決定 */
  left: 0; 
}

/* 品牌區域 */
.brand-section {
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.brand-section:hover {
  opacity: 0.8;
}

.brand-logo {
  width: 32px;
  height: 32px;
  margin-right: 12px;
  border-radius: 6px;
}

.brand-text {
  font-size: 1.25rem;
  font-weight: 700;
  color: #e72857;
  letter-spacing: -0.02em;
}


/* 桌面版操作按鈕組 */
.nav-actions {
  gap: 4px;
}

/* 語言選擇器 */
.language-menu {
  background: rgba(20, 20, 20, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  min-width: 160px;
}

.language-menu-item {
  color: rgba(255, 255, 255, 0.8);
  transition: all 0.2s ease;
  border-radius: 8px;
  margin: 4px 8px;
}

.language-menu-item:hover {
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.9);
}

.language-menu-item.v-list-item--active {
  background: rgba(231, 40, 87, 0.12);
  color: #e72857;
}

/* 手機版下拉選單 */
.mobile-nav {
  position: fixed;
  top: 64px;
  left: 0;
  right: 0;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.98) 0%, rgba(20, 20, 20, 0.98) 100%);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 999;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.mobile-nav-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.mobile-nav-item {
  color: rgba(255, 255, 255, 0.8) !important;
  font-weight: 500;
  justify-content: flex-start !important;
  border-radius: 12px;
  padding: 12px 16px;
  transition: all 0.2s ease-in-out;
  text-transform: none !important;
}

.mobile-nav-item:hover {
  color: rgba(255, 255, 255, 0.95) !important;
  background: rgba(255, 255, 255, 0.08);
}

.mobile-nav-item-active {
  color: #e72857 !important;
  background: linear-gradient(135deg, rgba(231, 40, 87, 0.15) 0%, rgba(255, 255, 255, 0.08) 100%);
  border: 1px solid rgba(231, 40, 87, 0.3);
}

/* 手機版語言選擇 */
.mobile-language-section {
  padding: 12px 16px;
}

.mobile-language-label {
  font-size: 0.9rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 12px;
  display: flex;
  align-items: center;
}

.mobile-language-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.mobile-language-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 12px;
  transition: all 0.2s ease;
  text-transform: none !important;
  font-weight: 500;
  min-height: 40px;
}

.mobile-language-btn .language-name {
  font-size: 0.85rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Tooltip 樣式 */
:deep(.v-tooltip .v-overlay__content) {
  background: rgba(0, 0, 0, 0.9);
  color: white;
  font-size: 0.8rem;
  padding: 4px 8px;
  border-radius: 6px;
  backdrop-filter: blur(10px);
}

/* 響應式設計 */
@media (max-width: 480px) {
  .nav-title-main {
    font-size: 1.2rem;
  }
  
  .mobile-language-grid {
    grid-template-columns: 1fr;
  }
  
  .mobile-language-btn .language-name {
    font-size: 0.9rem;
  }
}

/* 確保 v-container 在平板和手機版有適當的 padding */
@media (max-width: 768px) {
  .custom-nav-bar .v-container {
    padding-left: 16px !important;
    padding-right: 16px !important;
  }
  
  .nav-brand {
    margin-left: 0; /* 平板和手機版都不使用負 margin */
  }
}</style>