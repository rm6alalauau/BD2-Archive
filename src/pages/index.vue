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
    // 非阻塞方式獲取API數據
    this.fetchDataAsync();
  },
  
  methods: {
    async fetchDataAsync() {
      try {
        const appStore = useAppStore();
        await appStore.fetchAllData();
      } catch (error) {
        console.error("Failed to fetch data:", error);
        // 即使 API 失敗，頁面也能正常顯示
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
