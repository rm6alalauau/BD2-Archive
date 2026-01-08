<template>
  <v-container fluid class="events-page">
    <v-row>
      <v-col cols="12">
        <div class="d-flex align-center mb-4">
          <v-btn icon="mdi-arrow-left" variant="text" @click="$router.back()" class="mr-2"></v-btn>
          <h1 class="text-h4 font-weight-bold">{{ t('events.timeline') }}</h1>
        </div>
      </v-col>
    </v-row>

    <!-- 控制列 -->
    <v-row class="mb-4 align-center">
      <v-col cols="12" sm="auto" class="d-flex align-center flex-wrap">
        <v-checkbox
          v-model="useLocalTime"
          :label="t('events.useLocalTime')"
          hide-details
          density="compact"
          class="mr-4"
        ></v-checkbox>
        <v-checkbox
          v-model="showEndedEvents"
          :label="t('events.showEndedEvents')"
          hide-details
          density="compact"
          class="mr-4"
        ></v-checkbox>
      </v-col>
      <v-col cols="12" sm="auto">
         <div class="text-caption text-medium-emphasis">
           {{ useLocalTime ? t('events.localTime') : t('events.serverTime') }}
         </div>
      </v-col>
    </v-row>

    <!-- 時間軸視圖 (Gantt Chart) -->
    <v-row>
      <v-col cols="12">
        <v-card class="timeline-card pa-4" rounded="xl">
            <!-- 這裡是簡單的實現，實際的甘特圖可能需要專門的庫或複雜的 SVG 渲染 -->
            <!-- 這裡我們使用一個自定義的網格系統來模擬 -->
            
            <div class="gantt-container">
                <!-- 頭部日期 (簡單模擬) -->
                <div class="gantt-header d-flex border-b mb-2 pb-2">
                    <div class="gantt-col-header" v-for="day in 28" :key="day" style="flex: 1; text-align: center; font-size: 0.75rem; color: #aaa;">
                        {{ day }}
                    </div>
                </div>

                <!-- 活動條目 -->
                <div v-for="event in sortedEvents" :key="event.id" class="gantt-row mb-3 position-relative">
                    <div class="d-flex align-center justify-space-between mb-1">
                        <span class="text-subtitle-2">{{ getLocalizedTitle(event.title) }}</span>
                        <v-chip size="x-small" :color="getEventColor(event.type)" variant="flat" label>
                            {{ getRemainingTime(event.endTime) }}
                        </v-chip>
                    </div>
                    
                    <!-- 進度條模擬 -->
                    <v-progress-linear
                        :model-value="getProgress(event)"
                        :color="getEventColor(event.type)"
                        height="24"
                        rounded
                        striped
                        class="event-progress-bar"
                    >
                        <template v-slot:default="{ value }">
                            <span class="text-caption font-weight-bold ml-2 progress-text">{{ Math.ceil(value) }}%</span>
                        </template>
                    </v-progress-linear>
                    
                     <div class="text-caption text-medium-emphasis mt-1">
                        {{ formatDate(event.startTime) }} ~ {{ formatDate(event.endTime) }}
                    </div>
                </div>
            </div>
            
             <div v-if="sortedEvents.length === 0" class="text-center pa-8">
                <v-progress-circular v-if="loading" indeterminate></v-progress-circular>
                <div v-else>{{ t('events.noActiveEvents') }}</div>
            </div>

        </v-card>
      </v-col>
    </v-row>

  </v-container>
</template>

<script>
import { useSettingsStore } from '@/stores/settings'
import { useAppStore } from '@/stores/app'

export default {
  name: 'EventsPage',
  data() {
    return {
      settingsStore: useSettingsStore(),
      appStore: useAppStore(),
      useLocalTime: true,
      showEndedEvents: false,
      loading: false,
    }
  },
  computed: {
    t() {
      return (key, params) => this.settingsStore.t(key, null, params);
    },
    sortedEvents() {
        const now = new Date();
        let events = [...(this.appStore.gameEvents || [])];

        // Filter ended events if showEndedEvents is false
        if (!this.showEndedEvents) {
            events = events.filter(e => new Date(e.endTime) >= now);
        }

        // Sort by start time. If showing ended events, maybe reverse order or keep standard?
        // Standard start time sorting seems best for gantt chart view
        return events.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
    }
  },
  methods: {
    getLocalizedTitle(titleObj) {
        if (!titleObj) return '';
        const lang = this.settingsStore.selectedLanguage;
        return titleObj[lang] || titleObj['en'] || Object.values(titleObj)[0] || '';
    },
    getEventColor(type) {
         const colors = {
            banner_character: 'amber-darken-3',
            event: 'red-darken-2',
            minigame: 'deep-purple-lighten-1',
            season_pass: 'cyan-darken-2',
            abyss: 'green-darken-2',
            other: 'grey-darken-1'
        };
        return colors[type] || colors.other;
    },
    formatDate(dateStr) {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleDateString(this.settingsStore.selectedLanguage === 'en' ? 'en-US' : 'zh-TW', {
            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    },
    getRemainingTime(endTimeStr) {
      const now = new Date();
      const end = new Date(endTimeStr);
      const diffMs = end - now;
      if (diffMs <= 0) return this.t('events.ended');
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? `${diffDays}d` : '< 1d';
    },
    getProgress(event) {
        const start = new Date(event.startTime).getTime();
        const end = new Date(event.endTime).getTime();
        const now = new Date().getTime();
        
        if (now < start) return 0;
        if (now > end) return 100;
        return ((now - start) / (end - start)) * 100;
    }
  },
  mounted() {
      if (!this.appStore.gameEvents || this.appStore.gameEvents.length === 0) {
          this.loading = true;
          this.appStore.fetchGameEvents().finally(() => {
              this.loading = false;
          });
      }
  }
}
</script>

<style scoped>
.events-page {
  min-height: 100vh;
}

.timeline-card {
    min-height: 500px;
}

/* Enhance striped progress bar visibility */
:deep(.v-progress-linear__background) {
    opacity: 0.3 !important;
}

/* Make stripes more visible */
:deep(.v-progress-linear--striped .v-progress-linear__determinate) {
    background-image: linear-gradient(
        45deg, 
        rgba(255, 255, 255, 0.35) 25%, 
        transparent 25%, 
        transparent 50%, 
        rgba(255, 255, 255, 0.35) 50%, 
        rgba(255, 255, 255, 0.35) 75%, 
        transparent 75%, 
        transparent
    ) !important;
    background-size: 20px 20px !important; 
}

/* Make text shadow more prominent */
.progress-text {
    text-shadow: 0px 1px 3px rgba(0, 0, 0, 0.8);
    color: white !important;
    letter-spacing: 0.5px;
    z-index: 2;
}
</style>
