<template>
  <div class="seasonal-event-reminder-container">
    <v-dialog
      v-model="showReminder"
      max-width="400"
      persistent
      class="seasonal-reminder-dialog"
    >
      <v-card
        rounded="xl"
        class="reminder-card"
        :style="cardStyle"
      >
        <!-- Background Image Layer -->
        <v-img
          :src="currentBannerUrl"
          cover
          class="bg-image"
          position="top center"
        >
          <!-- Close Button -->
          <v-btn
            icon="mdi-close"
            variant="flat"
            size="small"
            color="rgba(0,0,0,0.5)"
            class="position-absolute top-0 right-0 ma-2 text-white"
            style="z-index: 10"
            @click="remindLater"
          ></v-btn>

          <!-- Content Overlay -->
          <div class="content-overlay d-flex flex-column h-100">
            
            <v-spacer></v-spacer>

            <!-- Action Buttons Area -->
            <div class="action-area pa-4">
              <!-- Row 1: Completed & Go -->
              <div class="d-flex align-center gap-2 mb-3">
                <v-btn
                  variant="outlined"
                  color="white"
                  class="flex-1-0 font-weight-bold bg-black-transparent"
                  height="44"
                  @click="markAsCompleted"
                >
                  <v-icon start icon="mdi-check" size="small"></v-icon>
                  {{ t('seasonalEvent.completed') }}
                </v-btn>

                <v-btn
                  color="primary"
                  variant="elevated"
                  class="flex-1-0 font-weight-bold"
                  height="44"
                  @click="openWebshop"
                >
                  {{ t('seasonalEvent.goToWebshop') }}
                  <v-icon end icon="mdi-open-in-new" size="small"></v-icon>
                </v-btn>
              </div>

              <!-- Row 2: Secondary Actions -->
              <div class="d-flex align-center gap-2">
                <v-btn
                  variant="text"
                  size="small"
                  color="white"
                  class="text-shadow flex-1-0"
                  @click="remindLater"
                >
                  {{ t('seasonalEvent.remindLater') }}
                </v-btn>

                <v-btn
                  variant="text"
                  size="small"
                  color="white"
                  class="text-shadow flex-1-0"
                  @click="dontShowAgain"
                >
                  {{ t('seasonalEvent.dontShowAgain') }}
                </v-btn>
              </div>
            </div>
          </div>
        </v-img>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { useSettingsStore } from '@/stores/settings'

export default {
  name: 'SeasonalEventReminder',
  
  data() {
    return {
      showReminder: false,
      settingsStore: useSettingsStore(),
      webshopUrl: 'https://webshop.browndust2.global/CT/events/attend-event/',
      
      // Campaign Configs
      campaigns: [
        {
          id: 'winter_2025_checkin',
          startDate: new Date('2025-12-16T00:00:00+08:00'),
          endDate: new Date('2026-01-15T07:59:59+08:00'),
          banners: {
            'ko-KR': '/events/winter_2025_checkin/ko-KR.jpg',
            'ja-JP': '/events/winter_2025_checkin/ja-JP.jpg',
            'en': '/events/winter_2025_checkin/en.jpg',
            'zh-Hans-CN': '/events/winter_2025_checkin/zh-CN.jpg',
            'zh-Hant-TW': '/events/winter_2025_checkin/zh-TW.jpg'
          }
        },
        {
          id: 'spring_2026_checkin',
          startDate: new Date('2026-01-15T12:30:00+08:00'),
          endDate: new Date('2026-02-12T07:59:59+08:00'),
          banners: {
            'ko-KR': '/events/spring_2026_checkin/ko-KR.png',
            'ja-JP': '/events/spring_2026_checkin/ja-JP.png',
            'en': '/events/spring_2026_checkin/en.png',
            'zh-Hans-CN': '/events/spring_2026_checkin/zh-CN.png',
            'zh-Hant-TW': '/events/spring_2026_checkin/zh-TW.png'
          }
        }
      ]
    }
  },

  computed: {
    t() {
      return (key, params) => this.settingsStore.t(key, null, params)
    },

    activeCampaign() {
      const now = new Date()
      return this.campaigns.find(c => now >= c.startDate && now <= c.endDate)
    },

    currentBannerUrl() {
      if (!this.activeCampaign) return ''
      return this.activeCampaign.banners[this.settingsStore.selectedLanguage] || this.activeCampaign.banners['en']
    },

    statusKey() {
      if (!this.activeCampaign) return ''
      const now = new Date()
      const dateKey = now.toISOString().split('T')[0]
      return `${this.activeCampaign.id}_${dateKey}`
    },
    
    // Key for "Don't Show Again" which applies to the whole campaign
    permanentDismissKey() {
      if (!this.activeCampaign) return ''
      return `${this.activeCampaign.id}_permanent_dismiss`
    },

    shouldShowReminder() {
      if (!this.activeCampaign) return false

      const status = this.settingsStore.seasonalEventStatus || {}
      
      // Check permanent dismissal
      if (status[this.permanentDismissKey]) {
        return false
      }

      const todayStatus = status[this.statusKey]

      // Check if completed today
      if (todayStatus?.completed) {
        return false
      }

      // Check if dismissed temporarily (remind later)
      if (todayStatus?.dismissedUntil && new Date().getTime() < todayStatus.dismissedUntil) {
        return false
      }

      return true
    },
    
    cardStyle() {
      return {
        height: 'min(650px, 85vh)', // Max height constraint for popup
        overflow: 'hidden'
      }
    }
  },

  mounted() {
    // Check every minute
    this.checkAndShowReminder()
    this.reminderInterval = setInterval(() => {
      this.checkAndShowReminder()
    }, 60000)
  },

  beforeUnmount() {
    if (this.reminderInterval) {
      clearInterval(this.reminderInterval)
    }
  },

  methods: {
    checkAndShowReminder() {
      if (this.shouldShowReminder && !this.showReminder) {
        setTimeout(() => {
          this.showReminder = true
        }, 3000) // Slight delay to not annoy immediately
      }
    },

    openWebshop() {
      window.open(this.webshopUrl, '_blank', 'noopener,noreferrer')
      this.markAsCompleted()
    },

    markAsCompleted() {
      this.updateStatus(this.statusKey, {
        completed: true,
        completedAt: new Date().getTime()
      })
      this.showReminder = false
    },

    remindLater() {
      // Remind again after 4 hours
      const dismissUntil = new Date().getTime() + (4 * 60 * 60 * 1000)
      this.updateStatus(this.statusKey, {
        dismissedUntil: dismissUntil
      })
      this.showReminder = false
    },

    dontShowAgain() {
      if (confirm(this.t('seasonalEvent.confirmDontShowAgain'))) {
        this.updateStatus(this.permanentDismissKey, {
          dismissed: true,
          dismissedAt: new Date().getTime()
        })
        this.showReminder = false
      }
    },

    updateStatus(key, data) {
      const currentStatus = this.settingsStore.seasonalEventStatus || {}
      const updatedStatus = {
        ...currentStatus,
        [key]: {
          ...(currentStatus[key] || {}),
          ...data
        }
      }
      this.settingsStore.updateSeasonalEventStatus(updatedStatus)
    }
  }
}
</script>

<style scoped>
.seasonal-reminder-dialog :deep(.v-dialog) {
  backdrop-filter: blur(4px);
}

.reminder-card {
  position: relative;
  background-color: rgb(30, 30, 30); /* Dark fallback */
}

/* Ensure image covers the card properly */
.bg-image {
  height: 100%;
}

/* Overlay gradient to make buttons readable */
.content-overlay {
  background: linear-gradient(
    to bottom,
    transparent 50%,
    rgba(0, 0, 0, 0.6) 70%,
    rgba(0, 0, 0, 0.95) 100%
  );
}

.text-shadow {
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.9);
}

.bg-black-transparent {
  background-color: rgba(0, 0, 0, 0.3) !important;
}

.gap-2 {
  gap: 8px;
}

.flex-1-0 {
  flex: 1 0 0;
}

@media (max-width: 480px) {
  .seasonal-reminder-dialog :deep(.v-dialog) {
    margin: 16px;
  }
}
</style>
