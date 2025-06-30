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
          <v-img :src="item.imgSrc" max-height="300">
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
</style>
