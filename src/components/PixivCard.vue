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
            class="ml-4"
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
          @scroll="handleScroll"
          style="
            overflow-x: auto;
            white-space: nowrap;
            scrollbar-width: thin;
            scrollbar-color: #5c8a10 #000000;
            min-height: 210px;
            padding-bottom: 16px;
          "
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

const MIN_ITEMS_THRESHOLD = 30;
const MAX_PAGES_TO_FETCH = 10;

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

      currentPage: 1,
      canLoadMore: true,
    };
  },
  computed: {
    showR18Content() {
      return this.settingsStore.showR18Content
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
      this.currentPage = 1;
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

      // 避免阻塞性的while循環，改為單次檢查和遞歸調用
      if (this.list.length < MIN_ITEMS_THRESHOLD && this.canLoadMore) {
        if (this.currentPage > MAX_PAGES_TO_FETCH) {
          this.canLoadMore = false;
          return;
        }

        this.isLoading = true;
        try {
          const newIllusts = await this.fetchPixivPage(this.currentPage);
          
          if (newIllusts && newIllusts.length > 0) {
            const existingIds = new Set(this.allIllusts.map(i => i.id));
            const uniqueNewIllusts = newIllusts.filter(i => !existingIds.has(i.id));
            
            this.allIllusts.push(...uniqueNewIllusts);
            this.applyFilter();
            this.currentPage++;
            
            // 使用 nextTick 確保DOM更新後再繼續
            this.$nextTick(() => {
              // 如果還需要更多數據，延遲執行避免阻塞
              if (this.list.length < MIN_ITEMS_THRESHOLD && this.canLoadMore) {
                setTimeout(() => {
                  this.fetchMoreDataIfNeeded();
                }, 100); // 100ms延遲，讓出線程控制權
              }
            });
          } else {
            this.canLoadMore = false;
          }
        } catch (error) {
          console.error('Error fetching data:', error);
          this.canLoadMore = false;
        } finally {
          this.isLoading = false;
        }
      }
    },
    
    async fetchPixivPage(page) {
      try {
        const params = {
          word: "ブラウンダスト",
          mode: "partial_match_for_tags",
          order: "popular_desc",
          page: page,
        };
        const queryString = new URLSearchParams(params).toString();
        const originalUrl = `https://api.obfs.dev/api/pixiv/search?${queryString}`;
        const url = this.$getApiUrl ? this.$getApiUrl(originalUrl) : originalUrl;
        
        // 獲取 Pixiv 資料
        
        const response = await fetch(url);
        if (!response.ok) throw new Error(`API error: ${response.status}`);
        const data = await response.json();
        if (!data?.illusts?.length) return null;

        // 關鍵修正：確保返回的物件結構與 template 期望的一致
        // 根據設定決定是否顯示 R18 內容
        const maxSanityLevel = this.showR18Content ? 6 : 4;
        
        return data.illusts
          .filter(item => item && item.id && item.sanity_level <= maxSanityLevel)
          .map(item => ({
            // 這些是 template 需要的欄位
            id: item.id,
            userId: item.user.id, // 恢復 userId 欄位
            imageUrl: `https://bd2pixiv.zzz-archive-back-end.workers.dev/${item.image_urls.square_medium.replace("https://i.pximg.net/", "")}`,
            title: item.title,
            authorName: item.user.name,
            authorAvatar: item.user.profile_image_urls.medium.includes("https://s.pximg.net/common/images/no_profile.png")
              ? item.user.profile_image_urls.medium
              : `https://bd2pixiv.zzz-archive-back-end.workers.dev/${item.user.profile_image_urls.medium.replace("https://i.pximg.net/", "")}`,
            
            // 這是篩選邏輯需要的欄位
            total_bookmarks: item.total_bookmarks,
          }));

      } catch (error) {
        console.error(`獲取第 ${page} 頁時出錯:`, error);
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
      // 移除陰影邏輯，保留方法以避免錯誤
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
</style>