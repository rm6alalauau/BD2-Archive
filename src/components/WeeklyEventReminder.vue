<template>
  <div class="weekly-reminder-container">
    <v-banner
      v-if="shouldDisplayServiceAnnouncement"
      class="service-announcement-banner mb-4"
      color="warning"
      density="comfortable"
      rounded="lg"
      prepend-icon="mdi-alert-circle-outline"
      variant="tonal"
    >
      <template #text>
        <div class="banner-text">
          <div class="banner-title">{{ t('serviceAnnouncement.title') }}</div>
          <div class="banner-content">
            {{ t('serviceAnnouncement.content') }}
          </div>
        </div>
      </template>
      <template #actions>
        <v-btn
          variant="text"
          color="warning"
          @click="dismissServiceAnnouncement"
        >
          {{ t('common.close') }}
        </v-btn>
      </template>
    </v-banner>

    <v-dialog
      v-model="showReminder"
      max-width="400"
      persistent
      class="weekly-reminder-dialog"
    >
      <v-card
        prepend-icon="mdi-calendar-check"
        :title="t('weeklyReminder.title')"
        rounded="xl"
      >
        <template v-slot:prepend>
          <v-avatar color="primary" class="mr-3">
            <v-icon color="white">mdi-calendar-check</v-icon>
          </v-avatar>
        </template>

        <template v-slot:subtitle>
          {{ t('weeklyReminder.currentWeek', { week: currentWeek }) }}
        </template>

        <v-card-text class="pb-4">
          <p class="text-body-1 mb-4">
            {{ t('weeklyReminder.description') }}
          </p>

          <!-- 移除 v-card，直接顯示時間 -->
          <div>
            <div class="text-caption text-medium-emphasis">
              {{ t('weeklyReminder.timeRemaining') }}
            </div>
            <div class="text-body-2 text-high-emphasis">
              {{ formatTimeRemaining() }}
            </div>
          </div>
        </v-card-text>

        <!-- 使用 v-card-actions 進行標準按鈕佈局 -->
        <v-card-actions class="px-6 pb-4">
          <!-- "稍後提醒" 作為最低優先級，使用 text button，放在最左邊 -->
          <v-btn
            variant="text"
            @click="dismissReminder"
          >
            {{ t('weeklyReminder.remindLater') }}
          </v-btn>

          <v-spacer></v-spacer>

          <!-- "已完成" 作為中等優先級，使用 tonal button -->
          <v-btn
            variant="tonal"
            @click="markAsCompleted"
            class="mr-2"
          >
            {{ t('weeklyReminder.completed') }}
          </v-btn>

          <!-- "前往" 作為最高優先級，使用 elevated button -->
          <v-btn
            color="primary"
            variant="elevated"
            @click="openWebshop"
          >
            {{ t('weeklyReminder.goToWebshop') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { useSettingsStore } from '@/stores/settings'

export default {
  name: 'WeeklyEventReminder',
  
  data() {
    return {
      showReminder: false,
      settingsStore: useSettingsStore(),
      webshopUrl: 'https://webshop.browndust2.global/',
      currentTime: new Date(),
      bannerStartDate: new Date('2025-12-10T00:00:00+08:00'),
      bannerEndDate: new Date('2025-12-25T23:59:59+08:00'),
      serviceAnnouncementId: '2025-holiday-update-delay',
      
      // 官方活動時間配置 - 使用台灣標準時間 (CST, UTC+8)
      // JavaScript 會自動根據用戶的本地時區進行轉換和計算
      eventWeeks: [
        {
          week: 1,
          start: new Date('2025-08-18T08:00:00+08:00'), // 台灣時間 週一 08:00
          end: new Date('2025-08-25T07:59:59+08:00')    // 台灣時間 週一 07:59
        },
        {
          week: 2,
          start: new Date('2025-08-25T08:00:00+08:00'), // 台灣時間 週一 08:00
          end: new Date('2025-09-01T07:59:59+08:00')    // 台灣時間 週一 07:59
        },
        {
          week: 3,
          start: new Date('2025-09-01T08:00:00+08:00'), // 台灣時間 週一 08:00
          end: new Date('2025-09-08T07:59:59+08:00')    // 台灣時間 週一 07:59
        },
        {
          week: 4,
          start: new Date('2025-09-08T08:00:00+08:00'), // 台灣時間 週一 08:00
          end: new Date('2025-09-15T07:59:59+08:00')    // 台灣時間 週一 07:59
        },
        {
          week: 5,
          start: new Date('2025-09-15T08:00:00+08:00'), // 台灣時間 週一 08:00
          end: new Date('2025-09-22T07:59:59+08:00')    // 台灣時間 週一 07:59
        },
        {
          week: 6,
          start: new Date('2025-09-22T08:00:00+08:00'), // 台灣時間 週一 08:00
          end: new Date('2025-09-29T07:59:59+08:00')    // 台灣時間 週一 07:59
        }
      ]
    }
  },
  
  computed: {
    // 翻譯函數
    t() {
      return (key, params) => {
        return this.settingsStore.t(key, null, params)
      }
    },
    
    // 獲取當前活動週期
    currentWeekData() {
      const now = new Date()
      return this.eventWeeks.find(week => now >= week.start && now <= week.end)
    },
    
    // 當前是第幾週
    currentWeek() {
      return this.currentWeekData?.week || 0
    },
    
    // 獲取當前週的唯一標識符
    currentWeekKey() {
      return this.currentWeekData ? `official_week_${this.currentWeekData.week}` : null
    },
    
    // 是否在活動期間內
    isInEventPeriod() {
      return this.currentWeekData !== undefined
    },
    
    // 是否已關閉服務公告
    isServiceAnnouncementDismissed() {
      const dismissed = this.settingsStore.dismissedServiceAnnouncements || {}
      return Boolean(dismissed[this.serviceAnnouncementId])
    },

    // 是否應該顯示提醒
    shouldShowReminder() {
      if (!this.isInEventPeriod || !this.currentWeekKey) {
        return false
      }
      
      const weeklyStatus = this.settingsStore.weeklyEventReminder || {}
      const weekStatus = weeklyStatus[this.currentWeekKey]
      
      // 檢查是否已完成
      if (weekStatus?.completed) {
        return false
      }
      
      // 檢查是否在暫時關閉期間
      if (weekStatus?.dismissedUntil && new Date().getTime() < weekStatus.dismissedUntil) {
        return false
      }
      
      return true
    },

    // 是否在公告顯示期間內
    isWithinBannerPeriod() {
      return this.currentTime >= this.bannerStartDate && this.currentTime <= this.bannerEndDate
    },

    // 服務公告是否應該顯示
    shouldDisplayServiceAnnouncement() {
      return this.isWithinBannerPeriod && !this.isServiceAnnouncementDismissed
    }
  },
  
  mounted() {
    this.checkAndShowReminder()
    
    // 每分鐘檢查一次是否需要顯示提醒
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
    // 檢查並顯示提醒
    checkAndShowReminder() {
      this.currentTime = new Date()

      if (this.shouldShowReminder && !this.showReminder) {
        // 延遲2秒顯示，讓頁面先載入完成
        setTimeout(() => {
          this.showReminder = true
        }, 2000)
      }
    },
    
    // 格式化剩餘時間
    formatTimeRemaining() {
      if (!this.currentWeekData) return ''
      
      const now = new Date()
      const endTime = this.currentWeekData.end
      const timeDiff = endTime.getTime() - now.getTime()
      
      if (timeDiff <= 0) {
        return this.t('weeklyReminder.timeExpired')
      }
      
      const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      
      if (days > 0) {
        return this.t('weeklyReminder.timeRemainingDays', { days, hours })
      } else if (hours > 0) {
        return this.t('weeklyReminder.timeRemainingHours', { hours })
      } else {
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60))
        return this.t('weeklyReminder.timeRemainingMinutes', { minutes })
      }
    },
    
    // 開啟網路商店
    openWebshop() {
      window.open(this.webshopUrl, '_blank', 'noopener,noreferrer')
      this.markAsCompleted()
    },
    
    // 標記為已完成
    markAsCompleted() {
      if (!this.currentWeekKey) return
      
      this.updateWeeklyStatus({
        completed: true,
        completedAt: new Date().getTime()
      })
      this.showReminder = false
    },
    
    // 暫時關閉提醒（4小時後重新顯示）
    dismissReminder() {
      if (!this.currentWeekKey) return
      
      const dismissUntil = new Date().getTime() + (4 * 60 * 60 * 1000)
      this.updateWeeklyStatus({
        dismissedUntil: dismissUntil
      })
      this.showReminder = false
    },

    // 關閉服務公告
    dismissServiceAnnouncement() {
      this.settingsStore.dismissServiceAnnouncement(this.serviceAnnouncementId)
    },
    
    // 更新週期狀態
    updateWeeklyStatus(status) {
      const currentStatus = this.settingsStore.weeklyEventReminder || {}
      const updatedStatus = {
        ...currentStatus,
        [this.currentWeekKey]: {
          ...currentStatus[this.currentWeekKey],
          ...status
        }
      }
      
      this.settingsStore.updateWeeklyEventReminder(updatedStatus)
    }
  }
}
</script>

<style scoped>
.weekly-reminder-dialog :deep(.v-dialog) {
  backdrop-filter: blur(8px);
}

.service-announcement-banner {
  border-radius: 20px;
}

.service-announcement-banner .banner-title {
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 4px;
}

.service-announcement-banner .banner-content {
  font-size: 0.95rem;
  white-space: pre-line;
}

.reminder-card {
  box-shadow: 
    0 8px 10px -6px rgba(0, 0, 0, 0.2),
    0 16px 24px 2px rgba(0, 0, 0, 0.14),
    0 6px 30px 5px rgba(0, 0, 0, 0.12);
}

/* 響應式設計 */
@media (max-width: 480px) {
  .weekly-reminder-dialog :deep(.v-dialog) {
    margin: 24px;
  }
  
  .reminder-card {
    border-radius: 24px !important;
  }
  
  .reminder-card .v-card-text {
    padding: 24px !important;
  }
}
</style>