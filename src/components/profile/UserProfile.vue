<template>
  <div class="user-profile-card">
    <v-avatar size="56" @click="$emit('open-avatar-dialog')" class="user-avatar">
      <v-img :src="currentAvatarUrl" :alt="currentNickname"></v-img>
    </v-avatar>
    <div class="user-info" @click="$emit('open-nickname-dialog')">
      <div class="user-nickname">{{ currentNickname }}</div>
      <div class="user-subtitle">
        {{ t("profile.userProfile.clickAvatarToChange") }}
      </div>
    </div>
    <div class="user-actions">
      <v-btn
        @click="$emit('logout')"
        icon="mdi-logout"
        size="small"
        variant="text"
        :title="t('profile.userProfile.reenterNickname')"
        :aria-label="t('profile.userProfile.reenterNickname')"
      ></v-btn>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useSettingsStore } from "@/stores/settings";

const props = defineProps({
  currentNickname: String,
  currentAvatarUrl: String
});

defineEmits(['open-avatar-dialog', 'open-nickname-dialog', 'logout']);

const settingsStore = useSettingsStore();
const t = computed(() => settingsStore.t);
</script>

<style scoped>
.user-profile-card {
  display: flex;
  align-items: center;
  padding: 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  margin-bottom: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.user-profile-card:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.user-avatar {
  cursor: pointer;
  border: 2px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.user-avatar:hover {
  border-color: #e72857;
  transform: scale(1.05);
}

.user-info {
  flex: 1;
  margin-left: 16px;
  cursor: pointer;
}

.user-nickname {
  font-size: 1.1rem;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 2px;
}

.user-subtitle {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
}

.user-actions {
  margin-left: 8px;
}
</style>
