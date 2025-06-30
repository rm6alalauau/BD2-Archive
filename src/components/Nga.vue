<template>
  <v-row>
    <v-col>
      <v-list v-if="items.length > 0" class="scrollable-list">
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          @click="navigateTo(item.link)"
          :class="{ 'odd-item': i % 2 === 0, 'even-item': i % 2 !== 0 }"
        >
          <v-list-item-content>
            <v-list-item-title class="nga-text">{{
              item.title
            }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "NGAList",
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
.scrollable-list {
  max-height: 300px; /* 與 v-carousel 的高度一致 */
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #5c8a10 #000000;
}
.odd-item {
  background-color: #fff0cd;
}
.even-item {
  background-color: #fff8e7;
}
.nga-text {
  color: #1a3959;
}
</style>
