<template>
  <v-row>
    <v-col>
      <v-list v-if="items.length > 0" class="scrollable-list">
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          @click="navigateTo(item.link)"
        >
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
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
.scrollable-list {
  max-height: 300px; /* 與 v-carousel 的高度一致 */
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #5c8a10 #000000;
}
.v-list-item {
  cursor: pointer;
  border-bottom: 5px solid #000000; /* 添加底部邊框 */
}
</style>
