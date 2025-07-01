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
  </v-container>
</template>

<script>
import { useAppStore } from '@/stores/app'

export default {
  data() {
    return {
      warningVisible: false,
    };
  },
  
  mounted() {
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
          console.log("Data is already loading, skipping...");
          return;
        }
        
        // 如果已有數據且不久前更新過，跳過請求
        if (appStore.hasData && appStore.lastUpdated) {
          const timeSinceUpdate = Date.now() - new Date(appStore.lastUpdated).getTime();
          if (timeSinceUpdate < 5 * 60 * 1000) { // 5分鐘內有更新過
            console.log("Data is recent, skipping fetch");
            return;
          }
        }
        
        console.log("Starting to fetch data...");
        await appStore.fetchAllData();
        console.log("Data fetch completed successfully");
        
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
</style>
