<template>
  <v-row>
    <v-col>
      <div class="forum-container">
        <!-- 標題和控制按鈕 -->
        <div class="forum-header">
          <span class="forum-title">X Posts</span>
          <div class="forum-controls">
            <v-btn icon size="small" @click="scrollLeft">
              <v-icon>mdi-chevron-left</v-icon>
            </v-btn>
            <v-btn icon size="small" @click="scrollRight">
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
            <!-- 標題放在圖片上方 -->
            <div class="item-title">{{ item.title }}</div>
            <!-- 圖片 -->
            <a :href="item.link" target="_blank" class="item-image">
              <v-img
                :src="item.image || generatePlaceholderImage(item.title)"
                height="160"
                width="160"
                class="d-block mx-auto"
              ></v-img>
            </a>
            <!-- 作者名稱和 Icon -->
            <div class="author-section">
              <v-icon
                class="author-icon"
                small
                @click="openAuthorProfile(item.authorProfile)"
              >
                mdi-account
              </v-icon>
              <span
                class="author-name"
                @click="openAuthorProfile(item.authorProfile)"
              >
                {{ item.author }}
              </span>
            </div>
            <!-- Hashtag -->
            <div class="item-hashtag">{{ item.hashtag }}</div>
          </div>
        </div>
      </div>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "XPosts",
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
      ctx.font = "20px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      this.wrapText(ctx, text, canvas.width / 2, canvas.height / 2, 150, 22);
      return canvas.toDataURL();
    },
    wrapText(ctx, text, x, y, maxWidth, lineHeight) {
      const words = text.split(" ");
      let line = "";
      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + " ";
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
          ctx.fillText(line, x, y);
          line = words[n] + " ";
          y += lineHeight;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, x, y);
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
    openAuthorProfile(url) {
      if (url) {
        window.open(url, "_blank");
      }
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
}

.forum-header {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  flex-shrink: 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  background-color: rgba(255, 255, 255, 0.02);
}

.forum-title {
  font-size: 1rem;
  font-weight: 500;
}

.forum-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.scroll-container {
  height: 260px;
  display: flex;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  padding: 16px 16px 24px 16px; /* 底部增加8px內邊距避免滾軸被裁切 */
}

/* 統一滾軸樣式 - 符合MD3規範 */
.scroll-container::-webkit-scrollbar {
  height: 8px; /* MD3建議最小8px以確保點擊區域 */
}

.scroll-container::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  margin: 0 8px; /* 左右邊距避免被圓角裁切 */
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
  height: 228px;
  display: flex;
  flex-direction: column;
  margin-right: 16px;
  flex-shrink: 0;
}

.item-title {
  height: 20px;
  line-height: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 4px;
  font-size: 0.875rem;
}

.item-image {
  flex-shrink: 0;
  margin-bottom: 4px;
}

.author-section {
  height: 24px;
  line-height: 24px;
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  margin-bottom: 4px;
}

.author-icon {
  color: #5c8a10;
  cursor: pointer;
}

.author-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 120px;
  font-size: 0.75rem;
}

.item-hashtag {
  height: 16px;
  line-height: 16px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.75rem;
  color: #666;
}
</style>
