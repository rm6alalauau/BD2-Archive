<template>
  <div>
    <!-- 內容區域 -->
    <v-window v-model="selectedComponent" disabled>
      <v-window-item value="NewsCarousel">
        <NewsCarousel />
      </v-window-item>
      <v-window-item value="EventList">
        <EventList />
      </v-window-item>
    </v-window>
    
    <!-- 標籤組 -->
    <v-chip-group
      v-model="selectedComponent"
      column
      mandatory
      class="mt-1 mb-0"
      selected-class="text-primary"
    >
      <v-chip
        value="NewsCarousel"
        variant="outlined"
        class="ma-1"
        prepend-icon="mdi-newspaper"
      >
        {{ t('news.title') }}
      </v-chip>
      <v-chip
        value="EventList"
        variant="outlined"
        class="ma-1"
        prepend-icon="mdi-calendar-multiselect"
      >
        {{ t('events.timeline') }}
      </v-chip>
    </v-chip-group>
  </div>
</template>

<script>
import NewsCarousel from './NewsCarousel.vue'
import EventList from './EventList.vue'
import { useSettingsStore } from '@/stores/settings'

export default {
  name: 'News',
  components: {
    NewsCarousel,
    EventList
  },
  data() {
    return {
      selectedComponent: 'NewsCarousel',
      settingsStore: useSettingsStore(),
    }
  },
  computed: {
    t() {
      return (key, params) => this.$t(key, this.settingsStore.selectedLanguage, params);
    }
  }
}
</script>

<style scoped>
/* 確保高度一致，避免切換時跳動 */
:deep(.v-window), :deep(.v-window-item) {
  height: 300px;
}
</style>
