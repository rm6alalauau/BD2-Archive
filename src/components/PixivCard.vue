<template>
  <v-row>
    <v-col>
      <v-card rounded="xl" class="position-relative">
        <v-card-title
          class="headline"
          style="font-size: 1rem; display: flex; align-items: center"
        >
          Pixiv Hot
          <v-select
            v-model="selectedOption"
            :items="options"
            item-title="title"
            item-value="value"
            class="ml-4 pixiv-select"
            style="max-width: 160px; height: 60px; align-items: center"
            rounded="xl"
            @update:modelValue="onOptionChange"
            return-object
            :loading="isLoading"
            :disabled="isLoading"
          ></v-select>
          <div style="margin-left: auto; display: flex; align-items: center">
            <v-btn icon @click="scrollLeft" :disabled="isLoading">
              <v-icon>mdi-chevron-left</v-icon>
            </v-btn>
            <v-btn icon @click="scrollRight" :disabled="isLoading">
              <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
          </div>
        </v-card-title>
        <div
          ref="scrollContainer"
          class="scroll-container"
          style="
            overflow-x: auto;
            white-space: nowrap;
            min-height: 210px;
            padding: 4px;
          "
          @scroll="handleScroll"
        >
          <div
            v-for="item in list"
            :key="item.id"
            class="d-inline-block mx-2 text-left"
          >
            <!-- 關鍵修正：確保 item.id 存在，此連結現在可以工作 -->
            <a
              :href="`https://www.pixiv.net/artworks/${item.id}`"
              target="_blank"
            >
              <v-img
                :src="item.imageUrl"
                height="160"
                width="160"
                class="d-block mx-auto"
                :lazy-src="getPlaceholderImage()"
                loading="lazy"
                @error="handleImageError"
              ></v-img>
            </a>
            <div class="text-ellipsis">{{ item.title }}</div>
            <div class="d-flex align-items-center">
              <v-avatar size="24">
                <!-- 關鍵修正：確保 item.userId 存在，此連結現在可以工作 -->
                <a
                  :href="`https://www.pixiv.net/users/${item.userId}`"
                  target="_blank"
                >
                  <v-img
                    :src="item.authorAvatar"
                    height="24"
                    width="24"
                    class="d-block mx-auto"
                  />
                </a>
              </v-avatar>
              <span class="ml-2 text-ellipsis">{{ item.authorName }}</span>
            </div>
          </div>
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { useSettingsStore } from '@/stores/settings'



export default {
  name: "PixivCard",
  setup() {
    const settingsStore = useSettingsStore()
    return { settingsStore }
  },
  data() {
    return {
      isLoading: false,
      allIllusts: [],
      list: [],
      selectedOption: { title: "♡ 100+", value: { min: 100, max: 499 } },
      options: [
        { title: "♡ 100+", value: { min: 100, max: 499 } },
        { title: "♡ 500+", value: { min: 500, max: 999 } },
        { title: "♡ 1000+", value: { min: 1000, max: Infinity } },
      ],

      canLoadMore: true,
      lastFetchTime: null,
      cachedPages: {},
      showLeftShadow: false,
      showRightShadow: false,
    };
  },
  computed: {
    showR18Content() {
      return this.settingsStore.showR18Content
    }
  },
  watch: {
    // 監聽 R18 設定變化，清除緩存
    showR18Content() {
      this.clearCache();
    }
  },
  async mounted() {
    await this.startFetchingProcess();
    this.$nextTick(() => {
        if(this.$refs.scrollContainer) this.handleScroll();
    });
    this.settingsStore.loadSettings();
  },
  methods: {
    async startFetchingProcess() {
      this.allIllusts = [];
      this.list = [];
      this.canLoadMore = true;
      await this.fetchMoreDataIfNeeded();
    },
    
    async onOptionChange() {
      this.applyFilter();
      await this.fetchMoreDataIfNeeded();
      // 重置滾動位置到最左邊
      this.$nextTick(() => {
        if (this.$refs.scrollContainer) {
          this.$refs.scrollContainer.scrollLeft = 0;
        }
      });
    },

    async fetchMoreDataIfNeeded() {
      if (this.isLoading) return;

        this.isLoading = true;
        try {
        const newIllusts = await this.fetchPixivPage();
          
          if (newIllusts && newIllusts.length > 0) {
          this.allIllusts = newIllusts; // 直接替換所有數據
            this.applyFilter();
          } else {
            this.canLoadMore = false;
          }
        } catch (error) {
          console.error('Error fetching data:', error);
          this.canLoadMore = false;
        } finally {
          this.isLoading = false;
        }
    },
    
    async fetchPixivPage() {
      const now = Date.now();
      const cacheKey = `pixiv_${this.showR18Content}`;
      
      // 檢查緩存是否有效（5分鐘內）
      const cacheValid = this.lastFetchTime && 
                        this.cachedPages[cacheKey] && 
                        (now - this.lastFetchTime < 5 * 60 * 1000);
      
      if (cacheValid) {
        // 使用緩存數據
        return this.cachedPages[cacheKey];
      }
      
      try {
        // 使用自己的 API 端點，就像論壇和兌換碼一樣
        const originalUrl = 'https://thedb2pulse-api.zzz-archive-back-end.workers.dev/pixiv';
        const url = this.$getApiUrl ? this.$getApiUrl(originalUrl) : originalUrl;
        
        // 獲取 Pixiv 資料
        const response = await fetch(url);
        if (!response.ok) throw new Error(`API error: ${response.status}`);
        const data = await response.json();
        if (!data || !Array.isArray(data) || data.length === 0) return null;

        // 根據設定決定是否顯示 R18 內容
        const maxSanityLevel = this.showR18Content ? 6 : 4;
        
        // 處理新的 API 格式
        const processedData = data
          .filter(item => item && item.id && item.sanity_level <= maxSanityLevel)
          .map(item => ({
            // 這些是 template 需要的欄位
            id: item.id,
            userId: item.user.id,
            imageUrl: `https://bd2pixiv.zzz-archive-back-end.workers.dev/${item.image_urls.square_medium.replace("https://i.pximg.net/", "")}`,
            title: item.title,
            authorName: item.user.name,
            authorAvatar: item.user.profile_image_urls.medium.includes("https://s.pximg.net/common/images/no_profile.png")
              ? item.user.profile_image_urls.medium
              : `https://bd2pixiv.zzz-archive-back-end.workers.dev/${item.user.profile_image_urls.medium.replace("https://i.pximg.net/", "")}`,
            
            // 這是篩選邏輯需要的欄位
            total_bookmarks: item.total_bookmarks,
          }));

        // 更新緩存
        this.cachedPages[cacheKey] = processedData;
        this.lastFetchTime = now;
        
        return processedData;

      } catch (error) {
        console.error(`獲取 Pixiv 數據時出錯:`, error);
        this.canLoadMore = false;
        return null;
      }
    },

    applyFilter() {
      const { min, max } = this.selectedOption.value;
      this.list = this.allIllusts.filter(item => {
        return item.total_bookmarks >= min && item.total_bookmarks <= max;
      });
      this.$nextTick(() => {
        if(this.$refs.scrollContainer) this.handleScroll();
      });
    },
    
    scrollLeft() {
      if(this.$refs.scrollContainer) {
        this.$refs.scrollContainer.scrollBy({ left: -200, behavior: "smooth" });
      }
    },
    scrollRight() {
      if(this.$refs.scrollContainer) {
        this.$refs.scrollContainer.scrollBy({ left: 200, behavior: "smooth" });
      }
    },
    
    handleScroll() {
      const container = this.$refs.scrollContainer;
      if (container) {
        this.showLeftShadow = container.scrollLeft > 0;
        this.showRightShadow =
          container.scrollLeft + container.clientWidth < container.scrollWidth;
      }
    },
    

    getPlaceholderImage() {
      // 返回一個簡單的佔位符圖片
      return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYwIiBoZWlnaHQ9IjE2MCIgdmlld0JveD0iMCAwIDE2MCAxNjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNjAiIGhlaWdodD0iMTYwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik04MCA2MEM4OC44MzY2IDYwIDk2IDY3LjE2MzQgOTYgNzZWODRDOTYgOTIuODM2NiA4OC44MzY2IDEwMCA4MCAxMDBDNzEuMTYzNCAxMDAgNjQgOTIuODM2NiA2NCA4NFY3NkM2NCA2Ny4xNjM0IDcxLjE2MzQgNjAgODAgNjBaIiBmaWxsPSIjRTBFMEUwIi8+Cjwvc3ZnPgo=';
    },
    handleImageError(event) {
      // 圖片載入失敗時的處理
      // 可以設置一個錯誤佔位符或隱藏圖片
      event.target.style.display = 'none';
    },
    
    clearCache() {
      // 清除緩存並重新開始獲取過程
      this.cachedPages = {};
      this.lastFetchTime = null;
      this.startFetchingProcess();
    },
  },
};
</script>

<style scoped>
.text-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 150px;
}

/* 移除 v-select 下拉欄位的邊框線 */
.pixiv-select :deep(.v-field__outline) {
  display: none !important;
}

/* 自定義滾動條樣式 - 與 OfficialMedia 一致 */
.scroll-container::-webkit-scrollbar {
  height: 6px;
}

.scroll-container::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.scroll-container::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

.scroll-container::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

/* 隱藏滾軸的箭頭按鈕 */
.scroll-container::-webkit-scrollbar-button {
  display: none;
}
</style>