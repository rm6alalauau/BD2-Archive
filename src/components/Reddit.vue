<template>
  <v-row>
    <v-col>
      <div class="forum-container">
        <!-- 標題和控制按鈕 -->
        <div class="forum-header">
          <span class="forum-title">Reddit Posts</span>
          <div class="forum-controls">
            <v-btn icon size="small" @click="scrollLeft" aria-label="向左滾動">
              <v-icon>mdi-chevron-left</v-icon>
            </v-btn>
            <v-btn icon size="small" @click="scrollRight" aria-label="向右滾動">
              <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
          </div>
        </div>
        <!-- 內容區域 -->
        <div
          ref="scrollContainer"
          class="scroll-container"
          @scroll="handleScroll"
        >
          <div
            v-for="(item, i) in items"
            :key="i"
            class="content-item"
          >
            <a :href="item.link" target="_blank" class="item-image">
              <template v-if="isVideo(item.image)">
                <video
                  :src="item.image"
                  height="160"
                  width="160"
                  class="d-block mx-auto"
                  controls
                ></video>
              </template>
              <template v-else>
                <v-img
                  v-if="item.image"
                  :src="item.image"
                  :alt="item.title || 'Reddit 貼文圖片'"
                  height="160"
                  width="160"
                  class="d-block mx-auto"
                ></v-img>
                <v-img
                  v-else
                  :src="generatePlaceholderImage(item.title)"
                  :alt="item.title || 'Reddit 貼文預設圖片'"
                  height="160"
                  width="160"
                  class="d-block mx-auto"
                ></v-img>
              </template>
            </a>
            <div class="item-title">{{ item.title }}</div>
            <div class="item-stats">
              <v-icon size="small">mdi-thumb-up</v-icon>
              <span class="stat-text">{{ item.upvotes }}</span>
              <v-icon size="small">mdi-comment</v-icon>
              <span class="stat-text">{{ item.comments }}</span>
            </div>
          </div>
        </div>
      </div>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "RedditPosts",
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
  methods: {
    generatePlaceholderImage(text) {
      const canvas = document.createElement("canvas");
      canvas.width = 160;
      canvas.height = 160;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#ccc";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#000";
      ctx.font = "16px Arial";
      ctx.textAlign = "center";

      // 將字串分行
      const maxWidth = 140; // 字串顯示的最大寬度
      const lineHeight = 18; // 行高
      const words = text.split(" ");
      let line = "";
      const lines = [];
      words.forEach((word) => {
        const testLine = line + word + " ";
        const testWidth = ctx.measureText(testLine).width;
        if (testWidth > maxWidth) {
          lines.push(line);
          line = word + " ";
        } else {
          line = testLine;
        }
      });
      lines.push(line);

      // 將每行字串繪製到 canvas 中
      const yOffset = (canvas.height - lines.length * lineHeight) / 2;
      lines.forEach((line, index) => {
        ctx.fillText(line, canvas.width / 2, yOffset + index * lineHeight);
      });

      return canvas.toDataURL();
    },
    scrollLeft() {
      const container = this.$refs.scrollContainer;
      container.scrollBy({ left: -200, behavior: "smooth" });
    },
    scrollRight() {
      const container = this.$refs.scrollContainer;
      container.scrollBy({ left: 200, behavior: "smooth" });
    },
    handleScroll() {
      const container = this.$refs.scrollContainer;
      this.showLeftShadow = container.scrollLeft > 0;
      this.showRightShadow =
        container.scrollLeft + container.clientWidth < container.scrollWidth;
    },
    isVideo(url) {
      if (!url) return false;
      // 去除查詢參數的部分
      const cleanUrl = url.split("?")[0];
      // 支援的影片副檔名
      const videoExtensions = ["mp4", "webm", "ogg"];
      const extension = cleanUrl.split(".").pop().toLowerCase();
      return videoExtensions.includes(extension);
    },
  },
};
</script>

<style scoped>
.forum-container {
  height: 300px;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 16px;
  overflow: hidden;
  position: relative;
}

.forum-header {
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px 0 16px;
  flex-shrink: 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  background-color: rgba(255, 255, 255, 0.02);
  position: relative;
  z-index: 1;
}

.forum-title {
  font-size: 1rem;
  font-weight: 500;
  transform: translateY(-4px);
}

.forum-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  transform: translateY(-4px);
}

.scroll-container {
  height: 264px;
  display: flex;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  padding: 20px 16px 8px 16px; /* 頂部增加間距，底部避免被圓角裁切 */
  position: absolute;
  top: 36px; /* 從 header 高度開始 */
  left: 0;
  right: 0;
}

/* 統一滾軸樣式 - 符合MD3規範 */
.scroll-container::-webkit-scrollbar {
  height: 8px; /* MD3建議最小8px以確保點擊區域 */
}

.scroll-container::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  margin: 0; /* 移除邊距讓滾軸直接貼在底部 */
}

.scroll-container::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  min-width: 20px; /* 確保最小寬度 */
}

.scroll-container::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

/* 隱藏滾軸的箭頭按鈕 */
.scroll-container::-webkit-scrollbar-button {
  display: none;
}

.content-item {
  width: 160px;
  height: 220px;
  display: flex;
  flex-direction: column;
  margin-right: 16px;
  flex-shrink: 0;
}

.item-image {
  flex-shrink: 0;
  margin-bottom: 4px;
}

.item-title {
  height: 32px;
  line-height: 16px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  margin-bottom: 1px;
  font-size: 0.875rem;
  text-overflow: ellipsis;
}

.item-stats {
  height: 16px;
  line-height: 16px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.stat-text {
  font-size: 0.75rem;
  margin-right: 8px;
}
</style>
