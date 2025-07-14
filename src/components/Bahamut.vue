<template>
  <v-col>
    <!-- 載入狀態 -->
    <div v-if="items.length === 0" class="d-flex justify-center align-center" style="height: 300px;">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
    </div>
    
    <!-- 輪播內容 -->
    <v-carousel
      v-else
      height="300"
      show-arrows="hover"
      hide-delimiters
      cycle
      :key="carouselKey"
    >
      <v-carousel-item v-for="(item, i) in items" :key="i">
        <v-card flat tile rounded="xl" @click="navigateTo(item.link)">
          <v-img 
            :src="item.imgSrc" 
            :alt="item.title || 'Brown Dust 2 遊戲圖片'"
            height="300"
            contain
            class="bahamut-image"
          >
            <v-row class="fill-height" align="end">
              <v-col
                class="text-center white--text"
                style="background-color: rgba(0, 0, 0, 0.5)"
              >
                {{ item.title }}
              </v-col>
            </v-row>
          </v-img>
        </v-card>
      </v-carousel-item>
    </v-carousel>
  </v-col>
</template>

<script>
// import { getOptimizedImageUrl } from '@/utils/cloudinary'

export default {
  name: "Bahamut",
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      carouselKey: 0,
    };
  },
  watch: {
    items: {
      handler() {
        this.carouselKey += 1; // 强制重新渲染 v-carousel
      },
      deep: true,
    },
  },
  methods: {
    navigateTo(link) {
      window.open(link, "_blank");
    },
    // getOptimizedImageUrl(imageUrl) {
    //   if (!imageUrl) return '';
    //   if (imageUrl.includes('cloudinary.com')) {
    //     return imageUrl;
    //   }
    //   return getOptimizedImageUrl(imageUrl, 'h_300,c_scale,f_auto,q_auto');
    // },
  },
};
</script>

<style scoped>
.v-img {
  position: relative;
}
.v-col {
  padding: 0;
}
.bahamut-image {
  min-height: 300px;
  height: 300px;
}
</style>
