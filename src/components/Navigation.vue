<template>
  <v-app-bar
    :elevation="0"
    class="custom-nav-bar"
    height="64"
    fixed
  >
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

export default {
  name: "Navigation",
  data() {
    return {
      mobileMenu: false,
      languageMenu: false,
      settingsStore: useSettingsStore(),
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
    
    selectLanguage(languageCode) {
      this.settingsStore.updateLanguage(languageCode);
      this.languageMenu = false;
      this.mobileMenu = false;
    },
    
    toggleMobileMenu() {
      this.mobileMenu = !this.mobileMenu;
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
  },
};
</script>

<style scoped>
/* 主導覽欄 */
.custom-nav-bar {
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(20, 20, 20, 0.95) 100%);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 1000;
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
}
</style>