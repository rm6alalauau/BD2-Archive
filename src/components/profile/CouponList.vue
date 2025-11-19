<template>
  <div class="coupon-list-wrapper">
    <div v-if="loading && !redeemCodes.length" class="loading-container">
      <v-progress-circular
        indeterminate
        color="primary"
      ></v-progress-circular>
      <div class="mt-2 text-medium-emphasis">
        {{ t("profile.loadingTitle") }}
      </div>
    </div>

    <div v-else-if="redeemCodes.length > 0" class="coupon-list-container">
      <CouponItem
        v-for="(coupon, index) in redeemCodes"
        :key="coupon.code"
        :coupon="coupon"
        :index="index"
        @claim="(c, i, e) => $emit('claim', c, i, e)"
        @open-official="(code) => $emit('open-official', code)"
        @show-image="(coupon) => $emit('show-image', coupon)"
      />
    </div>

    <div v-else class="loading-container">
      <v-icon size="x-large" color="grey-lighten-1"
        >mdi-package-variant-closed</v-icon
      >
      <div class="mt-2 text-grey">{{ t("profile.status.unknown") }}</div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useSettingsStore } from "@/stores/settings";
import CouponItem from "./CouponItem.vue";

const props = defineProps({
  loading: Boolean,
  redeemCodes: {
    type: Array,
    default: () => []
  }
});

defineEmits(['claim', 'open-official', 'show-image']);

const settingsStore = useSettingsStore();
const t = computed(() => settingsStore.t);
</script>

<style scoped>
.coupon-list-wrapper {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}

.loading-container {
  height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.coupon-list-container {
  height: 400px;
  overflow-y: auto;
  padding: 6px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  background-color: rgba(255, 255, 255, 0.02);
  gap: 8px;
  display: flex;
  flex-direction: column;
}

@media (min-width: 769px) {
  .loading-container {
    flex: 1;
    min-height: 350px;
    height: auto;
  }

  .coupon-list-container {
    flex: 1;
    min-height: 350px;
    height: auto;
  }
}

.coupon-list-container::-webkit-scrollbar {
  width: 6px;
}

.coupon-list-container::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.coupon-list-container::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

.coupon-list-container::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

@media (max-width: 768px) {
  .coupon-list-container {
    height: 350px;
  }

  .loading-container {
    height: 350px;
  }
}

@media (max-width: 480px) {
  .coupon-list-container {
    height: 300px;
  }

  .loading-container {
    height: 300px;
  }
}
</style>
