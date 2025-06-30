<template>
  <v-app-bar
    :elevation="0"
    class="custom-nav-bar"
    height="64"
    fixed
  >
    <v-container class="d-flex align-center justify-space-between pa-0">
      <!-- 品牌區域 -->
      <div class="brand-section" @click="goHome">
        <img 
          src="https://www.browndust2.com/img/seo/favicon.png" 
          alt="BD2 Logo" 
          class="brand-logo"
        />
        <span class="brand-text">The BD2 Pulse</span>
      </div>

      <!-- 桌面版操作按鈕組 -->
      <div class="nav-actions d-none d-sm-flex align-center">
        <!-- 設定按鈕 -->
        <v-btn
          icon
          class="mr-2"
          @click="$router.push('/setting')"
        >
          <v-icon>mdi-cog</v-icon>
          <v-tooltip activator="parent" location="bottom">設定</v-tooltip>
        </v-btn>

        <!-- 意見回饋按鈕 -->
        <v-btn
          @click="openFeedback"
          icon
          variant="text"
          class="nav-action-btn"
          size="large"
        >
          <v-icon size="20">mdi-comment-question-outline</v-icon>
          <v-tooltip activator="parent" location="bottom">意見回饋</v-tooltip>
        </v-btn>
      </div>

      <!-- 手機版選單按鈕 -->
      <v-btn
        @click="toggleMobileMenu"
        icon
        variant="text"
        class="nav-action-btn d-sm-none"
        size="large"
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
            :class="{ 'mobile-nav-item-active': $route.path === '/' }"
            block
          >
            <v-icon size="20" class="mr-3">mdi-home</v-icon>
            首頁
          </v-btn>
          
          <v-btn
            @click="$router.push('/setting')"
            variant="text"
            class="mobile-nav-item"
            :class="{ 'mobile-nav-item-active': $route.path === '/setting' }"
            block
          >
            <v-icon size="20" class="mr-3">mdi-cog</v-icon>
            設定
          </v-btn>
          
          <v-btn
            @click="openFeedback"
            variant="text"
            class="mobile-nav-item"
            block
          >
            <v-icon size="20" class="mr-3">mdi-comment-question-outline</v-icon>
            意見回饋
          </v-btn>
        </div>
      </v-container>
    </div>
  </v-expand-transition>
</template>

<script>
export default {
  name: "Navigation",
  data() {
    return {
      mobileMenu: false,
    };
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
    
    toggleMobileMenu() {
      this.mobileMenu = !this.mobileMenu;
    }
  },
  mounted() {
    // 路由變化時關閉手機選單
    this.$router.afterEach(() => {
      this.mobileMenu = false;
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

.nav-action-btn {
  color: rgba(255, 255, 255, 0.7) !important;
  border-radius: 12px;
  transition: all 0.2s ease-in-out;
}

.nav-action-btn:hover {
  color: rgba(255, 255, 255, 0.9) !important;
  background: rgba(255, 255, 255, 0.1);
  transform: scale(1.05);
}

.nav-action-btn:active {
  transform: scale(0.95);
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