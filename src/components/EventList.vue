<template>
  <div class="event-list-container">
    <div class="d-flex align-center justify-space-between mb-3 px-1">
      <div class="text-subtitle-1 font-weight-bold">{{ t('events.currentEvents') }}</div>
    </div>
    
    <div class="event-items">
      <div v-for="event in activeEvents" :key="event.id" class="event-item mb-2">
        <v-card
          :color="getEventColor(event.type)"
          class="event-card rounded-pill px-4 py-2"
          flat
        >
          <div class="d-flex align-center justify-space-between">
            <div class="event-title text-truncate mr-2">
              {{ getLocalizedTitle(event.title) }}
            </div>
            <v-chip
              size="x-small"
              variant="flat"
              :color="getBadgeColor(event.type)"
              class="time-badge px-2"
            >
              {{ getRemainingTime(event.endTime) }}
            </v-chip>
          </div>
        </v-card>
      </div>
      
      <!-- 如果沒有活動 -->
      <div v-if="activeEvents.length === 0" class="text-center py-4 text-medium-emphasis">
        {{ t('events.noActiveEvents') }}
      </div>
    </div>

    <!-- 查看更多按鈕 -->
    <div class="mt-4 px-1">
      <v-btn
        block
        variant="flat"
        color="primary"
        class="rounded-lg view-all-btn"
        prepend-icon="mdi-calendar-clock"
        append-icon="mdi-chevron-right"
        @click="$router.push('/events')"
      >
        {{ t('events.viewAllSchedule') }}
      </v-btn>
    </div>
  </div>
</template>

<script>
import { useSettingsStore } from '@/stores/settings'
import { useAppStore } from '@/stores/app'

export default {
  name: 'EventList',
  data() {
    return {
      settingsStore: useSettingsStore(),
      appStore: useAppStore(),
    }
  },
  computed: {
    t() {
      return (key, params) => this.settingsStore.t(key, null, params);
    },
    activeEvents() {
      const now = new Date();
      const events = this.appStore.gameEvents || [];
      
      // Filter for active events
      // Sort priority:
      // 1. Banners (banner/banner_character)
      // 2. End time (soonest ending first)
      return events
        .filter(e => {
          const start = new Date(e.startTime);
          const end = new Date(e.endTime);
          return now >= start && now <= end;
        })
        .sort((a, b) => {
          // Check if event is a banner
          const isBannerA = a.type === 'banner' || a.type === 'banner_character';
          const isBannerB = b.type === 'banner' || b.type === 'banner_character';

          // Prioritize banners
          if (isBannerA && !isBannerB) return -1;
          if (!isBannerA && isBannerB) return 1;

          // If both are banners or both are not, sort by end time
          return new Date(a.endTime) - new Date(b.endTime);
        })
        .slice(0, 5); // Show top 5
    }
  },
  methods: {
    getLocalizedTitle(titleObj) {
      if (!titleObj) return '';
      const lang = this.settingsStore.selectedLanguage;
      return titleObj[lang] || titleObj['en'] || Object.values(titleObj)[0] || '';
    },
    getEventColor(type) {
      // Background colors for the bars
      const colors = {
        banner: '#FFE082', // Amber lighten-3
        event: '#EF9A9A', // Red lighten-3
        abyss: '#E6EE9C', // Lime lighten-3
        season: '#80DEEA', // Cyan lighten-3
        other: '#E0E0E0'
      };
      return colors[type] || colors.other;
    },
    getBadgeColor(type) {
      // Darker badge colors for contrast
      const colors = {
        banner: '#5D4037', // Brown darken-2
        event: '#C62828', // Red darken-3
        abyss: '#558B2F', // Light Green darken-3
        season: '#006064', // Cyan darken-4
        other: '#424242'
      };
      return colors[type] || colors.other;
    },
    getRemainingTime(endTimeStr) {
      const now = new Date();
      const end = new Date(endTimeStr);
      const diffMs = end - now;
      
      if (diffMs <= 0) return this.t('events.ended');
      
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      
      if (diffDays > 0) {
        return `${diffDays}d ${diffHours}h`;
      } else {
        return `${diffHours}h`;
      }
    }
  },
  mounted() {
    // Ensure data is fetched
    if (!this.appStore.gameEvents || this.appStore.gameEvents.length === 0) {
      this.appStore.fetchGameEvents();
    }
  }
}
</script>

<style scoped>
.event-list-container {
  height: 300px;
  display: flex;
  flex-direction: column;
}

.event-items {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden; /* Hide horizontal scrollbar */
  padding-right: 4px; /* Space for scrollbar */
}

.event-items::-webkit-scrollbar {
  width: 6px;
}

.event-items::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.event-items::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

.event-items::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

.event-items::-webkit-scrollbar-button {
  display: none;
}

.event-card {
  transition: transform 0.2s;
  color: #333 !important; /* Ensure text is dark on light bars */
}

.event-card:hover {
  transform: translateX(4px);
}

.event-title {
  font-weight: 500;
  font-size: 0.9rem;
}

.time-badge {
  font-weight: bold;
  opacity: 0.9;
}

.view-all-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  text-transform: none;
  letter-spacing: 0.5px;
}
</style>
