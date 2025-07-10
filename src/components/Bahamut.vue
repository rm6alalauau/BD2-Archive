<template>
  <v-col>
    <v-carousel
      height="300"
      show-arrows="hover"
      hide-delimiters
      cycle
      v-if="items.length > 0"
      :key="carouselKey"
    >
      <v-carousel-item v-for="(item, i) in items" :key="i">
        <v-card flat tile rounded="xl" @click="navigateTo(item.link)">
          <v-img 
            :src="getOptimizedImageUrl(item.imgSrc)" 
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
import { optimizeImageUrl } from '@/utils/cloudinary'

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
    getOptimizedImageUrl(imageUrl) {
      if (!imageUrl) return '';
      
      // 如果已經是Cloudinary URL，直接返回（避免重複處理）
      if (imageUrl.includes('cloudinary.com')) {
        return imageUrl;
      }
      
      // 使用Cloudinary優化
      return optimizeImageUrl(imageUrl);
    },
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
