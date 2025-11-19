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
  gap: 16px; /* Added gap from original */
  padding: 16px;
  margin-bottom: 8px; /* Changed from 16px to 8px */
  border: 1px solid rgba(255, 255, 255, 0.12); /* Changed from 0.1 */
  border-radius: 16px;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.05) 0%,
    rgba(255, 255, 255, 0.02) 100%
  );
  transition: all 0.2s ease-in-out; /* Changed timing */
}

.user-profile-card:hover {
  border-color: rgba(231, 40, 87, 0.3);
  background: linear-gradient(
    135deg,
    rgba(231, 40, 87, 0.08) 0%,
    rgba(255, 255, 255, 0.05) 100%
  );
  transform: none; /* Removed transform */
  box-shadow: none; /* Removed box-shadow */
}

.user-avatar {
  flex-shrink: 0;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
  border: 2px solid rgba(255, 255, 255, 0.1);
}

.user-avatar:hover {
  transform: scale(1.05);
  border-color: rgba(231, 40, 87, 0.5);
}

.user-info {
  flex: 1;
  min-width: 0;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
  border-radius: 8px;
  padding: 4px 8px;
  margin: -4px -8px;
}

.user-info:hover {
  background-color: rgba(231, 40, 87, 0.1);
}

.user-nickname {
  font-weight: 600;
  font-size: 1.1rem;
  color: #e72857; /* Changed from #ffffff */
  margin-bottom: 2px;
}

.user-subtitle {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
}

.user-actions {
  margin-left: 8px;
}

@media (max-width: 768px) {
  .user-profile-card {
    padding: 12px;
    gap: 12px;
  }

  .user-nickname {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .user-profile-card {
    padding: 12px;
    gap: 10px;
  }

  .user-subtitle {
    display: none;
  }
}
</style>
