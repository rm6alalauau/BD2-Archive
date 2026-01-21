```html
<template>
  <div class="events-page d-flex flex-column">
    <!-- Unified Header Control Bar -->
    <div class="d-flex flex-wrap align-center px-4 py-2 bg-surface elevation-1 position-relative border-b" style="z-index: 10; border-color: rgba(255, 255, 255, 0.1) !important; min-height: 56px;">
        
        <!-- Left: Filters -->
        <div class="filter-section d-flex flex-grow-1" :class="{'mobile-filters': $vuetify.display.xs}">
            <!-- Desktop/Tablet: Single Row -->
            <v-chip-group v-if="!$vuetify.display.xs" v-model="selectedFilters" multiple column filter class="my-0">
               <v-chip value="banner" density="compact" label size="small" color="amber-darken-3" variant="outlined">{{ t('events.filter_banner') }}</v-chip>
               <v-chip value="event" density="compact" label size="small" color="red-darken-2" variant="outlined">{{ t('events.filter_event') }}</v-chip>
               <v-chip value="abyss" density="compact" label size="small" color="green-darken-2" variant="outlined">{{ t('events.filter_abyss') }}</v-chip>
               <v-chip value="season" density="compact" label size="small" color="cyan-darken-2" variant="outlined">{{ t('events.filter_season') }}</v-chip>
            </v-chip-group>

            <!-- Mobile: 2x2 Grid -->
            <div v-else class="d-grid mobile-filter-grid w-100">
               <v-chip 
                    :class="{'v-chip--selected': selectedFilters.includes('banner')}"
                    @click="toggleFilter('banner')"
                    density="compact" label size="small" color="amber-darken-3" variant="outlined" 
                    class="ma-1 justify-center"
                >{{ t('events.filter_banner') }}</v-chip>
               <v-chip 
                    :class="{'v-chip--selected': selectedFilters.includes('event')}"
                    @click="toggleFilter('event')"
                    density="compact" label size="small" color="red-darken-2" variant="outlined" 
                    class="ma-1 justify-center"
                >{{ t('events.filter_event') }}</v-chip>
               <v-chip 
                    :class="{'v-chip--selected': selectedFilters.includes('abyss')}"
                    @click="toggleFilter('abyss')"
                    density="compact" label size="small" color="green-darken-2" variant="outlined" 
                    class="ma-1 justify-center"
                >{{ t('events.filter_abyss') }}</v-chip>
               <v-chip 
                    :class="{'v-chip--selected': selectedFilters.includes('season')}"
                    @click="toggleFilter('season')"
                    density="compact" label size="small" color="cyan-darken-2" variant="outlined" 
                    class="ma-1 justify-center"
                >{{ t('events.filter_season') }}</v-chip>
            </div>
        </div>

        <!-- Right: Controls -->
        <div class="controls-section d-flex align-center flex-shrink-0 ml-auto">
             <!-- Time Settings -->
            <v-checkbox
                v-model="useLocalTime"
                :label="t('events.useLocalTime')"
                hide-details
                density="compact"
                class="mr-3 d-none d-sm-flex"
            ></v-checkbox>
            <v-checkbox
                v-model="showEndedEvents"
                :label="t('events.showEndedEvents')"
                hide-details
                density="compact"
            ></v-checkbox>

             <!-- Sort Button -->
             <v-btn 
                icon 
                variant="text" 
                :color="sortDescending ? 'primary' : ''"
                @click="toggleSort"
                :title="t('events.sort_reverse')"
                class="ml-2"
            >
                <v-icon>{{ sortDescending ? 'mdi-sort-clock-ascending-outline' : 'mdi-sort-clock-descending-outline' }}</v-icon>
             </v-btn>
        </div>
    </div>

    <!-- Gantt Chart Container -->
    <div class="gantt-wrapper position-relative flex-grow-1" ref="ganttWrapper">
        <div v-if="loading" class="d-flex align-center justify-center h-100">
            <v-progress-circular indeterminate></v-progress-circular>
        </div>
        
        <div v-else-if="filteredEvents.length === 0" class="d-flex align-center justify-center h-100">
             {{ t('events.noActiveEvents') }}
        </div>

        <div v-else class="gantt-scroll-container" ref="scrollContainer">
            <!-- Timeline Header (Dates) -->
            <div class="timeline-header" :style="{ width: totalWidth + 'px' }">
                <div 
                    v-for="tick in timeTicks" 
                    :key="tick.timestamp" 
                    class="time-tick-label"
                    :style="{ left: tick.left + 'px' }"
                >
                    {{ formatDateShort(tick.date) }}
                </div>
            </div>

            <!-- Grid Lines -->
             <div class="grid-lines" :style="{ width: totalWidth + 'px', height: totalHeight + 'px' }">
                <div 
                    v-for="tick in timeTicks" 
                    :key="'line-' + tick.timestamp" 
                    class="grid-line"
                    :style="{ left: tick.left + 'px' }"
                ></div>
            </div>

            <!-- Current Time Line -->
            <div 
                class="current-time-line"
                :style="{ left: currentTimeOffset + 'px', height: totalHeight + 'px' }"
            >
                <div class="current-time-label">
                     {{ formatTime(nowDate) }}
                </div>
            </div>

            <!-- Events -->
            <div class="events-track-container" :style="{ width: totalWidth + 'px' }">
                <div 
                    v-for="(event, index) in filteredEvents" 
                    :key="event.id" 
                    class="event-bar-wrapper"
                    :style="{ 
                        top: (index * eventRowHeight) + 'px',
                        left: getEventLeft(event) + 'px',
                        width: getEventWidth(event) + 'px',
                        height: (eventRowHeight - 10) + 'px'
                    }"
                >
                    <v-tooltip location="top" activator="parent">
                         <span>{{ getLocalizedTitle(event.title) }}</span>
                         <br/>
                         <span class="text-caption">{{ formatDateFull(event.startTime) }} ~ {{ formatDateFull(event.endTime) }}</span>
                    </v-tooltip>

                    <div 
                        class="event-bar"
                        :class="getEventClass(event)"
                        :style="{ backgroundColor: getEventColor(event) }"
                    >
                        <!-- Progress Overlay for past part of event -->
                        <div class="event-progress" :style="{ width: getEventProgress(event) + '%' }"></div>
                        
                        <div class="event-content px-2 d-flex align-center justify-space-between fill-height">
                             <!-- Sticky Title -->
                             <span class="text-caption font-weight-bold text-truncate text-white sticky-title" style="z-index: 2; text-shadow: 0 1px 2px rgba(0,0,0,0.8);">
                                {{ getLocalizedTitle(event.title) }}
                             </span>
                             
                             <!-- Sticky Remaining Time Chip -->
                             <v-chip 
                                size="x-small" 
                                color="white" 
                                variant="elevated" 
                                class="sticky-time ml-2 font-weight-bold text-black"
                                style="z-index: 2; box-shadow: 0 1px 2px rgba(0,0,0,0.5);"
                             >
                                {{ getRemainingTime(event.endTime) }}
                             </v-chip>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  </div>
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
      nowDate: new Date(),
      timer: null,
      
      // Configuration
      pixelsPerHour: 5, // Width per hour
      eventRowHeight: 50,
      paddingDays: 2, // Days to show before/after events
      
      // Filters & Sorting
      selectedFilters: ['banner', 'event', 'abyss', 'season'],
      sortDescending: false // Default: Ascending end time (ending soonest first)
    }
  },
  computed: {
    t() {
      return (key, params) => this.settingsStore.t(key, null, params);
    },
    filteredEvents() {
        let events = [...(this.appStore.gameEvents || [])];
        
        // 1. Filter by Ended Status
        if (!this.showEndedEvents) {
            events = events.filter(e => new Date(e.endTime) >= this.nowDate);
        }
        
        // 2. Filter by Category
        events = events.filter(e => {
            const category = this.getEventCategory(e.type);
            return this.selectedFilters.includes(category);
        });

        // 3. Sort (Category Priority -> End Time)
        // Priority: Banner(1) > Event(2) > Abyss(3) > Season(4)
        const priorityMap = {
            'banner': 1,
            'event': 2,
            'abyss': 3,
            'season': 4,
            'other': 5
        };

        return events.sort((a,b) => {
            const catA = this.getEventCategory(a.type);
            const catB = this.getEventCategory(b.type);
            
            // Primary: Category Priority (Ascending = 1 -> 4)
            if (priorityMap[catA] !== priorityMap[catB]) {
                return priorityMap[catA] - priorityMap[catB];
            }
            
            // Secondary: End Time
            const endA = new Date(a.endTime).getTime();
            const endB = new Date(b.endTime).getTime();
            
            if (this.sortDescending) {
                return endB - endA; // Ending Latest first
            } else {
                return endA - endB; // Ending Soonest first
            }
        });
    },
    // Dynamically calculate timeline range based on filtered events
    timelineStart() {
        if (this.filteredEvents.length === 0) return new Date();
        const earliest = Math.min(...this.filteredEvents.map(e => new Date(e.startTime).getTime()));
        const d = new Date(earliest);
        d.setDate(d.getDate() - this.paddingDays);
        d.setHours(0, 0, 0, 0);
        return d;
    },
    timelineEnd() {
        if (this.filteredEvents.length === 0) return new Date();
        const latest = Math.max(...this.filteredEvents.map(e => new Date(e.endTime).getTime()));
        const d = new Date(latest);
        d.setDate(d.getDate() + this.paddingDays);
        d.setHours(23, 59, 59, 999);
        return d;
    },
    totalWidth() {
        const hours = (this.timelineEnd - this.timelineStart) / (1000 * 60 * 60);
        // Ensure minimum width to prevent collapse
        return Math.max(window.innerWidth, hours * this.pixelsPerHour);
    },
    totalHeight() {
        return Math.max(400, this.filteredEvents.length * this.eventRowHeight + 50); // Min height or based on events
    },
    currentTimeOffset() {
        const diffMs = this.nowDate - this.timelineStart;
        return (diffMs / (1000 * 60 * 60)) * this.pixelsPerHour;
    },
    timeTicks() {
        const ticks = [];
        let current = new Date(this.timelineStart);
        current.setHours(0,0,0,0); // Start at midnight
        
        while (current <= this.timelineEnd) {
            const diffMs = current - this.timelineStart;
            ticks.push({
                date: new Date(current),
                timestamp: current.getTime(),
                left: (diffMs / (1000 * 60 * 60)) * this.pixelsPerHour
            });
            current.setDate(current.getDate() + 1);
        }
        return ticks;
    }
  },
  methods: {
    toggleFilter(val) {
        if (this.selectedFilters.includes(val)) {
            this.selectedFilters = this.selectedFilters.filter(f => f !== val);
        } else {
            this.selectedFilters.push(val);
        }
    },
    getEventCategory(type) {
        if (type === 'banner_character' || type === 'banner') return 'banner';
        if (type === 'event' || type === 'minigame') return 'event'; // Group event & minigame
        if (type === 'abyss') return 'abyss';
        if (type === 'season_pass') return 'season';
        return 'other'; // Should ideally not happen or handle as 'event'
    },
    toggleSort() {
        this.sortDescending = !this.sortDescending;
    },
    getLocalizedTitle(titleObj) {
        if (!titleObj) return '';
        const lang = this.settingsStore.selectedLanguage;
        return titleObj[lang] || titleObj['en'] || Object.values(titleObj)[0] || '';
    },
    getEventColor(event) {
        const end = new Date(event.endTime);
        if (end < this.nowDate) return '#616161'; // Grey for ended

        const type = event.type;
        const colors = {
            banner_character: '#FF8F00', // amber-darken-3
            banner: '#FF8F00',
            event: '#D32F2F', // red-darken-2
            minigame: '#9575CD', // deep-purple-lighten-1
            season_pass: '#0097A7', // cyan-darken-2
            abyss: '#388E3C', // green-darken-2
            other: '#757575'
        };
        return colors[type] || colors.other;
    },
    getEventClass(event) {
        return ''; 
    },
    getEventLeft(event) {
        const start = new Date(event.startTime);
        const diffMs = start - this.timelineStart;
        return Math.max(0, (diffMs / (1000 * 60 * 60)) * this.pixelsPerHour);
    },
    getEventWidth(event) {
        const start = new Date(event.startTime);
        const end = new Date(event.endTime);
        const durationMs = end - start;
        return (durationMs / (1000 * 60 * 60)) * this.pixelsPerHour;
    },
    getEventProgress(event) {
        const start = new Date(event.startTime).getTime();
        const end = new Date(event.endTime).getTime();
        const now = this.nowDate.getTime();
        
        if (now < start) return 0;
        if (now > end) return 100;
        return ((now - start) / (end - start)) * 100;
    },
    formatDateShort(date) {
        return date.toLocaleDateString(this.settingsStore.selectedLanguage === 'en' ? 'en-US' : 'zh-TW', {
            month: 'numeric', day: 'numeric'
        });
    },
    formatTime(date) {
         return date.toLocaleTimeString(this.settingsStore.selectedLanguage === 'en' ? 'en-US' : 'zh-TW', {
            hour: '2-digit', minute: '2-digit', hour12: false
        });
    },
    formatDateFull(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleString(this.settingsStore.selectedLanguage === 'en' ? 'en-US' : 'zh-TW', {
             month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    },
    getRemainingTime(endTimeStr) {
      const end = new Date(endTimeStr);
      const diffMs = end - this.nowDate;
      if (diffMs <= 0) return this.t('events.ended');
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? `${diffDays}d` : '< 1d';
    },
    scrollToNow() {
        this.$nextTick(() => {
            const container = this.$refs.scrollContainer;
            if (container) {
                // Center the view on "now"
                const center = this.currentTimeOffset - (container.clientWidth / 2);
                container.scrollLeft = Math.max(0, center);
            }
        });
    }
  },
  mounted() {
      // Load filters from localStorage
      const savedFilters = localStorage.getItem('events_filters');
      if (savedFilters) {
          try {
              this.selectedFilters = JSON.parse(savedFilters);
          } catch (e) {
              console.error("Failed to parse saved filters", e);
          }
      }

      this.timer = setInterval(() => {
          this.nowDate = new Date();
      }, 60000); // Update every minute

      if (!this.appStore.gameEvents || this.appStore.gameEvents.length === 0) {
          this.loading = true;
          this.appStore.fetchGameEvents().finally(() => {
              this.loading = false;
              this.scrollToNow();
          });
      } else {
          this.scrollToNow();
      }
      
      // Re-scroll on window resize
      window.addEventListener('resize', this.scrollToNow);
  },
  beforeUnmount() {
      if (this.timer) clearInterval(this.timer);
      window.removeEventListener('resize', this.scrollToNow);
  },
  watch: {
    // Re-scroll when switching ended events visibility as the timeline width might change
    showEndedEvents() {
        this.scrollToNow();
    },
    loading(val) {
        if (!val) this.scrollToNow();
    },
    selectedFilters: {
        handler(val) {
            localStorage.setItem('events_filters', JSON.stringify(val));
        },
        deep: true
    }
  }
}
</script>

<style scoped>
.events-page {
  height: 100vh;
  overflow: hidden;
}

.gantt-wrapper {
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.gantt-scroll-container {
    overflow-x: auto;
    overflow-y: auto;
    flex: 1;
    position: relative;
    background-color: #1e1e1e; /* Dark background */
    
    /* Hide scrollbar for cleaner look if desired, or keep standard */
    scrollbar-width: thin;
    scrollbar-color: #555 #1e1e1e;
}

.timeline-header {
    height: 40px;
    background-color: #2c2c2c;
    position: sticky;
    top: 0;
    z-index: 5;
    border-bottom: 1px solid #444;
}

.time-tick-label {
    position: absolute;
    top: 8px;
    transform: translateX(-50%);
    font-size: 0.75rem;
    color: #aaa;
    white-space: nowrap;
}

.grid-lines {
    position: absolute;
    top: 0;
    left: 0;
    pointer-events: none;
    z-index: 1;
}

.grid-line {
    position: absolute;
    top: 40px; /* Start below header */
    bottom: 0;
    width: 1px;
    background-color: rgba(255, 255, 255, 0.05);
    height: 100%;
}

.current-time-line {
    position: absolute;
    top: 0;
    width: 2px;
    background-color: #ef5350; /* Red line */
    z-index: 6; /* Above events */
    pointer-events: none;
    box-shadow: 0 0 8px rgba(239, 83, 80, 0.6);
}

.current-time-label {
    position: sticky;
    top: 45px;
    background: #ef5350;
    color: white;
    font-size: 0.7rem;
    padding: 2px 6px;
    border-radius: 4px;
    transform: translateX(-50%);
    white-space: nowrap;
}

.events-track-container {
    position: relative;
    min-height: 100%;
    padding-top: 20px; /* Space below header */
    z-index: 2;
}

.event-bar-wrapper {
    position: absolute;
    padding: 0;
}

.event-bar {
    width: 100%;
    height: 100%;
    border-radius: 6px;
    position: relative;
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.event-bar:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.5);
    z-index: 3;
}

.event-progress {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.3); /* Darken the passed part */
    /* Or use a striped texture for the FUTURE part? */
    /* User request: "Range bar... scroll to view..." */
    /* Let's replicate the "striped" look of the original if possible, but maybe subtle */
}

/* Optional: Add stripes to the whole bar or just the active part */
.event-bar {
    background-image: linear-gradient(
        45deg, 
        rgba(255, 255, 255, 0.1) 25%, 
        transparent 25%, 
        transparent 50%, 
        rgba(255, 255, 255, 0.1) 50%, 
        rgba(255, 255, 255, 0.1) 75%, 
        transparent 75%, 
        transparent
    );
    background-size: 20px 20px; 
}

/* Sticky Labels */
.sticky-title {
    position: sticky;
    left: 10px;
    max-width: 60%; /* Prevent overlap with time chip if event is short */
}

.sticky-time {
    position: sticky;
    right: 10px; 
    /* To stick to the right edge of the *viewport*, we'd need fixed/absolute logic relative to screen. 
       But 'position: sticky; right: 10px' inside the bar sticks to the right edge of the BAR.
       The user wants it visible... 
       Actually, `left` sticky works great for the Title (sticks to left edge of screen when scrolling right).
       For the End Time, we usually want it to stay visible on the right if we scroll left.
       No, we scroll right to see future. The end time is at the end. 
       If the bar is super long and extends off screen to the right, we want the text likely on the left.
       If we scroll past the start, we want the title to stick to the left edge of the screen so we know what it is (Implemented).
       Do we want the time to stick? Usually the time is 1d, 2d... 
       If the user wants "Label at the left", I did that. 
       "Remaining time as tag" -> Done.
    */
    /* If the user wants the end time to be visible even if the end of the bar is off-screen,
       we would need it to stick to the *right edge of the screen* but constrained by the bar.
       Sticky relative to the container works. Let's try to keep it simple first.
       If we want it to always be near the Title, we can just put it next to the title (sticky-left).
       But the user said "Remaining time change to tag...".
       Let's put the Time Chip next to the Title inside the sticky container.
    */
}

/* Mobile Filter Grid */
.mobile-filter-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    width: 100%;
}

@media (max-width: 600px) {
    .filter-section {
        flex: 0 0 100%; /* Filters take full width on mobile */
        order: 1;
        margin-bottom: 8px; /* Spacing before controls */
    }
    .controls-section {
        flex: 0 0 100%;
        order: 2;
        justify-content: space-between; /* Spread controls on second line */
    }
}
</style>
```
