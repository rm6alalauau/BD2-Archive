<template>
  <v-row>
    <v-col>
      <!-- 使用虛擬滾動代替普通列表 -->
      <v-virtual-scroll
        v-if="items.length > 0"
        :items="items"
        :item-height="64"
        height="300"
        class="virtual-scrollable-list"
      >
        <template v-slot:default="{ item, index }">
          <v-list-item
            :key="index"
            @click="navigateTo(item.link)"
            class="ptt-list-item"
          >
            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-virtual-scroll>
      
      <!-- 無資料狀態 -->
      <div v-else class="no-data-state">
        <v-icon color="grey" size="48" class="mb-2">mdi-forum-outline</v-icon>
        <p class="text-grey">目前沒有 PTT 資料</p>
      </div>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "PTTList",
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
  methods: {
    navigateTo(link) {
      window.open(link, "_blank");
    },
  },
};
</script>

<style scoped>
/* 虛擬滾動容器樣式 */
.virtual-scrollable-list {
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background-color: rgba(255, 255, 255, 0.02);
}

/* 自定義滾動條樣式 */
.virtual-scrollable-list :deep(.v-virtual-scroll__container) {
  scrollbar-width: thin;
  scrollbar-color: #5c8a10 transparent;
}

.virtual-scrollable-list :deep(.v-virtual-scroll__container)::-webkit-scrollbar {
  width: 6px;
}

.virtual-scrollable-list :deep(.v-virtual-scroll__container)::-webkit-scrollbar-track {
  background: transparent;
}

.virtual-scrollable-list :deep(.v-virtual-scroll__container)::-webkit-scrollbar-thumb {
  background-color: #5c8a10;
  border-radius: 3px;
}

.virtual-scrollable-list :deep(.v-virtual-scroll__container)::-webkit-scrollbar-thumb:hover {
  background-color: #7ba633;
}

/* 列表項目樣式 */
.ptt-list-item {
  cursor: pointer;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  transition: background-color 0.2s ease;
}

.ptt-list-item:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

.ptt-list-item:last-child {
  border-bottom: none;
}

/* 無資料狀態樣式 */
.no-data-state {
  height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
}

.no-data-state p {
  margin: 0;
  font-size: 0.9rem;
}
</style>
