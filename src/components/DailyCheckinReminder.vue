<template>
  <v-dialog
    v-model="showReminder"
    max-width="400"
    persistent
    class="daily-checkin-dialog"
  >
    <v-card
      prepend-icon="mdi-calendar-check"
      :title="t('dailyCheckin.title')"
      rounded="xl"
    >
      <template v-slot:prepend>
        <v-avatar color="primary" class="mr-3">
          <v-icon color="white">mdi-calendar-check</v-icon>
        </v-avatar>
      </template>

      <template v-slot:subtitle>
        {{ t('dailyCheckin.currentDate', { date: currentDate }) }}
      </template>

      <v-card-text class="pb-4">
        <p class="text-body-1 mb-4">
          {{ t('dailyCheckin.description') }}
        </p>
        
        <!-- 顯示時間 -->
        <div>
          <div class="text-caption text-medium-emphasis">
            {{ t('dailyCheckin.timeRemaining') }}
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
          {{ t('dailyCheckin.remindLater') }}
        </v-btn>
        
        <v-spacer></v-spacer>
        
        <!-- "已完成" 作為中等優先級，使用 tonal button -->
        <v-btn
          variant="tonal"
          @click="markAsCompleted"
          class="mr-2"
        >
          {{ t('dailyCheckin.completed') }}
        </v-btn>
        
        <!-- "前往" 作為最高優先級，使用 elevated button -->
        <v-btn
          color="primary"
          variant="elevated"
          @click="openWebshop"
        >
          {{ t('dailyCheckin.goToWebshop') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { useSettingsStore } from '@/stores/settings'

export default {
  name: 'DailyCheckinReminder',
  
  data() {
    return {
      showReminder: false,
      settingsStore: useSettingsStore(),
      webshopUrl: 'https://webshop.browndust2.global/',
      
      // 每日重置時間配置 - 使用台灣標準時間 (CST, UTC+8)
      // JavaScript 會自動根據用戶的本地時區進行轉換和計算
      resetTime: {
        hour: 8, // 台灣時間早上 8 點
        minute: 0,
        second: 0
      }
    }
  },
  
  computed: {
    // 翻譯函數
    t() {
      return (key, params) => {
        return this.settingsStore.t(key, null, params)
      }
    },
    
    // 獲取當前日期
    currentDate() {
      const now = new Date()
      return now.toLocaleDateString(this.settingsStore.selectedLanguage, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    },
    
    // 獲取今日的唯一標識符
    todayKey() {
      const now = new Date()
      return `daily_checkin_${now.getFullYear()}_${String(now.getMonth() + 1).padStart(2, '0')}_${String(now.getDate()).padStart(2, '0')}`
    },
    
    // 是否應該顯示提醒
    shouldShowReminder() {
      // 檢查設定是否開啟
      if (!this.settingsStore.dailyCheckinReminderEnabled) {
        return false
      }
      
      const dailyStatus = this.settingsStore.dailyCheckinStatus || {}
      const todayStatus = dailyStatus[this.todayKey]
      
      // 檢查是否已完成
      if (todayStatus?.completed) {
        return false
      }
      
      // 檢查是否在暫時關閉期間
      if (todayStatus?.dismissedUntil && new Date().getTime() < todayStatus.dismissedUntil) {
        return false
      }
      
      return true
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
      if (this.shouldShowReminder && !this.showReminder) {
        // 延遲2秒顯示，讓頁面先載入完成
        setTimeout(() => {
          this.showReminder = true
        }, 2000)
      }
    },
    
    // 格式化剩餘時間
    formatTimeRemaining() {
      const now = new Date()
      const nextReset = this.getNextResetTime()
      const timeDiff = nextReset.getTime() - now.getTime()
      
      if (timeDiff <= 0) {
        return this.t('dailyCheckin.timeExpired')
      }
      
      const hours = Math.floor(timeDiff / (1000 * 60 * 60))
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60))
      
      if (hours > 0) {
        return this.t('dailyCheckin.timeRemainingHours', { hours, minutes })
      } else {
        return this.t('dailyCheckin.timeRemainingMinutes', { minutes })
      }
    },
    
    // 獲取下一個重置時間
    getNextResetTime() {
      const now = new Date()
      const nextReset = new Date(now)
      
      // 設定為今天的重置時間
      nextReset.setHours(this.resetTime.hour, this.resetTime.minute, this.resetTime.second, 0)
      
      // 如果今天的重置時間已經過了，設定為明天的重置時間
      if (nextReset <= now) {
        nextReset.setDate(nextReset.getDate() + 1)
      }
      
      return nextReset
    },
    
    // 開啟網路商店
    openWebshop() {
      window.open(this.webshopUrl, '_blank', 'noopener,noreferrer')
      this.markAsCompleted()
    },
    
    // 標記為已完成
    markAsCompleted() {
      if (!this.todayKey) return
      
      this.updateDailyStatus({
        completed: true,
        completedAt: new Date().getTime()
      })
      this.showReminder = false
    },
    
    // 暫時關閉提醒（4小時後重新顯示）
    dismissReminder() {
      if (!this.todayKey) return
      
      const dismissUntil = new Date().getTime() + (4 * 60 * 60 * 1000)
      this.updateDailyStatus({
        dismissedUntil: dismissUntil
      })
      this.showReminder = false
    },
    
    // 更新每日狀態
    updateDailyStatus(status) {
      const currentStatus = this.settingsStore.dailyCheckinStatus || {}
      const updatedStatus = {
        ...currentStatus,
        [this.todayKey]: {
          ...currentStatus[this.todayKey],
          ...status
        }
      }
      
      this.settingsStore.updateDailyCheckinStatus(updatedStatus)
    }
  }
}
</script>

<style scoped>
.daily-checkin-dialog :deep(.v-dialog) {
  backdrop-filter: blur(8px);
}

/* 響應式設計 */
@media (max-width: 480px) {
  .daily-checkin-dialog :deep(.v-dialog) {
    margin: 24px;
  }
}
</style> 