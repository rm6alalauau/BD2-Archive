<template>
  <div class="coupon-item" :class="{ 'coupon-item--claimed': coupon.claimed }">
    <div class="coupon-main-row">
      <v-icon
        :color="coupon.claimed ? 'success' : 'grey-lighten-1'"
        :icon="coupon.claimed ? 'mdi-check-circle' : 'mdi-circle-outline'"
        size="20"
        class="coupon-status-icon"
      ></v-icon>

      <div class="coupon-code-section">
        <div class="coupon-code-row">
          <div class="coupon-code-left">
            <a
              href="#"
              class="coupon-code coupon-code-link"
              @click.prevent="$emit('open-official', coupon.code)"
              :title="t('profile.couponLink.tooltip', null, { code: coupon.code })"
            >
              {{ coupon.code }}
            </a>
            <!-- 圖片預覽圖示 -->
            <v-btn
              v-if="coupon.image_url"
              icon
              size="x-small"
              variant="text"
              class="coupon-image-btn"
              @click="$emit('show-image', coupon)"
            >
              <v-icon size="16" color="primary">mdi-image-outline</v-icon>
            </v-btn>
          </div>
          <v-chip
            v-if="coupon.status"
            size="x-small"
            :color="getStatusColor(coupon.status)"
            variant="flat"
            class="coupon-status-chip"
          >
            {{ formatDateStatus(coupon.status) }}
          </v-chip>
        </div>

        <div
          v-if="(getLocalizedReward(coupon.reward) || coupon.description) || getDateDisplayText(coupon.expiry_date)"
          class="coupon-description"
        >
          <span v-if="getLocalizedReward(coupon.reward) || coupon.description">{{
            getLocalizedReward(coupon.reward) || coupon.description
          }}</span>
          <span
            v-if="
              (getLocalizedReward(coupon.reward) || coupon.description) && getDateDisplayText(coupon.expiry_date)
            "
            class="coupon-description-separator"
          >
            •
          </span>
          <span
            v-if="getDateDisplayText(coupon.expiry_date)"
            class="coupon-date-text"
            >{{ getDateDisplayText(coupon.expiry_date) }}</span
          >
        </div>
      </div>

      <v-btn
        :loading="coupon.claiming"
        :disabled="coupon.claimed"
        @click="$emit('claim', coupon, index, $event)"
        :color="getButtonColor(coupon)"
        size="small"
        variant="flat"
        class="coupon-action-btn"
      >
        {{ getButtonText(coupon) }}
      </v-btn>
    </div>

    <div v-if="coupon.messageType" class="coupon-message-row">
      <div class="coupon-message-spacer"></div>
      <div class="coupon-message-content">
        <div
          :class="[
            'coupon-message',
            `coupon-message--${coupon.messageType}`,
          ]"
        >
          <v-icon
            size="14"
            :color="coupon.messageType"
            :icon="
              coupon.messageType === 'error'
                ? 'mdi-alert-circle'
                : 'mdi-check-circle'
            "
          ></v-icon>
          <span>{{ coupon.statusMessage || coupon.errorMessage }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useSettingsStore } from "@/stores/settings";

const props = defineProps({
  coupon: {
    type: Object,
    required: true
  },
  index: {
    type: Number,
    required: true
  }
});

defineEmits(['claim', 'open-official', 'show-image']);

const settingsStore = useSettingsStore();
const t = computed(() => settingsStore.t);

// Helper functions copied/adapted from Profile.vue
const isDateStatus = (status) => {
  const datePattern = /^\d{4}\/\d{1,2}\/\d{1,2}$/;
  return datePattern.test(status);
};

const getLocalizedReward = (reward) => {
  if (!reward) return null;
  if (typeof reward === 'string') return reward;
  if (typeof reward === 'object' && reward !== null) {
    const currentLanguage = settingsStore.selectedLanguage;
    return reward[currentLanguage] || reward['zh-Hant-TW'] || reward['en'] || Object.values(reward)[0];
  }
  return null;
};

const formatDateStatus = (status) => {
  if (!isDateStatus(status)) {
    return t.value(`profile.status.${status}`) || status;
  }
  const statusDate = new Date(status);
  const currentDate = new Date();
  const statusDateOnly = new Date(statusDate.getFullYear(), statusDate.getMonth(), statusDate.getDate());
  const currentDateOnly = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());

  if (statusDateOnly < currentDateOnly) {
    return t.value('profile.status.expired');
  } else if (statusDateOnly.getTime() === currentDateOnly.getTime()) {
    return `${t.value('profile.status.limited')} (${t.value('common.today')})`;
  } else {
    return t.value('profile.status.limited');
  }
};

const getDateDisplayText = (expiryDate) => {
  if (!expiryDate || !isDateStatus(expiryDate)) return null;
  const statusDate = new Date(expiryDate);
  const month = statusDate.getMonth() + 1;
  const day = statusDate.getDate();
  const expiryText = t.value('profile.expiryDate') || '到期';
  return `${month}/${day} ${expiryText}`;
};

const getStatusColor = (status) => {
  if (isDateStatus(status)) {
    const statusDate = new Date(status);
    const currentDate = new Date();
    const statusDateOnly = new Date(statusDate.getFullYear(), statusDate.getMonth(), statusDate.getDate());
    const currentDateOnly = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());

    if (statusDateOnly < currentDateOnly) return "error";
    if (statusDateOnly.getTime() === currentDateOnly.getTime()) return "warning";
    return "warning";
  }

  const statusColors = {
    active: "success",
    expired: "error",
    limited: "warning",
    permanent: "info",
    unknown: "default"
  };
  return statusColors[status] || "default";
};

const getButtonColor = (coupon) => {
  if (coupon.claimed) return "success";
  if (coupon.errorMessage) return "error";
  return "primary";
};

const getButtonText = (coupon) => {
  if (coupon.claimed) return t.value("profile.actions.claimed");
  if (coupon.errorMessage) return t.value("common.retry");
  return t.value("profile.actions.claim");
};
</script>

<style scoped>
.coupon-item {
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  background-color: rgba(255, 255, 255, 0.03);
  transition: all 0.2s ease-in-out;
}

.coupon-item:hover {
  background-color: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.2);
}

.coupon-item--claimed {
  background-color: rgba(76, 175, 80, 0.08);
  border-color: rgba(76, 175, 80, 0.25);
}

.coupon-main-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
}

.coupon-status-icon {
  flex-shrink: 0;
}

.coupon-code-section {
  flex: 1;
  min-width: 0;
}

.coupon-code-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2px;
}

.coupon-code-left {
  display: flex;
  align-items: center;
  gap: 4px;
}

.coupon-code {
  font-weight: 600;
  font-size: 1rem;
  color: #e72857;
}

.coupon-code-link {
  text-decoration: none;
  transition: all 0.2s ease-in-out;
  border-radius: 6px;
  padding: 2px 6px;
  margin: -2px -6px;
  position: relative;
}

.coupon-code-link:hover {
  color: #ffffff;
  background-color: rgba(231, 40, 87, 0.2);
  text-decoration: none;
  transform: translateY(-1px);
}

.coupon-code-link:active {
  transform: translateY(0);
}

.coupon-status-chip {
  flex-shrink: 0;
}

.coupon-image-btn {
  opacity: 0.7;
  transition: opacity 0.2s ease;
}

.coupon-image-btn:hover {
  opacity: 1;
}

.coupon-status-chip.v-chip--color-warning {
  animation: pulse-warning 2s infinite;
}

@keyframes pulse-warning {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.coupon-description {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.2;
  margin-top: 2px;
}

.coupon-description-separator {
  color: rgba(255, 255, 255, 0.4);
  margin: 0 4px;
}

.coupon-date-text {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.8rem;
}

.coupon-action-btn {
  flex-shrink: 0;
  min-width: 72px;
}

.coupon-message-row {
  display: flex;
  padding: 8px 16px 12px 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  background-color: rgba(255, 255, 255, 0.02);
}

.coupon-message-spacer {
  width: 32px; /* Icon width + gap */
  flex-shrink: 0;
}

.coupon-message-content {
  flex: 1;
  min-width: 0;
}

.coupon-message {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  padding: 8px 12px;
  border-radius: 8px;
  margin-top: 4px;
}

.coupon-message--success {
  color: #4caf50;
  background-color: rgba(76, 175, 80, 0.15);
  border: 1px solid rgba(76, 175, 80, 0.3);
}

.coupon-message--error {
  color: #f44336;
  background-color: rgba(244, 67, 54, 0.15);
  border: 1px solid rgba(244, 67, 54, 0.3);
}

.coupon-message--warning {
  color: #fb8c00;
  background-color: rgba(251, 140, 0, 0.15);
  border: 1px solid rgba(251, 140, 0, 0.3);
}

@media (max-width: 768px) {
  .coupon-main-row {
    padding: 10px 12px;
    gap: 8px;
  }

  .coupon-code {
    font-size: 0.9rem;
  }

  .coupon-description {
    font-size: 0.8rem;
  }

  .coupon-action-btn {
    min-width: 60px;
  }
}

@media (max-width: 480px) {
  .coupon-main-row {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
    padding: 12px;
  }

  .coupon-code-row {
    justify-content: space-between;
  }

  .coupon-status-chip {
    margin-left: auto;
  }

  .coupon-message-row {
    padding: 8px 12px 10px 12px;
  }

  .coupon-message-spacer {
    display: none;
  }
}
</style>
