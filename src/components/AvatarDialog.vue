<template>
  <v-dialog
    :model-value="modelValue"
    @update:modelValue="$emit('update:modelValue', $event)"
    max-width="600px"
    scrollable
  >
    <v-card rounded="lg">
      <v-card-title>{{ t('profile.userProfile.selectAvatar') }} ({{ availableAvatars.length }})</v-card-title>
      <v-divider></v-divider>
      <v-card-text style="max-height: 60vh; overflow-y: auto;">
        <v-container>
          <v-row>
            <v-col 
              v-for="avatar in availableAvatars" 
              :key="avatar" 
              cols="2" 
              class="pa-1"
            >
              <v-avatar 
                size="60" 
                @click="selectAvatar(avatar)"
                :class="currentAvatar == avatar ? 'selected-avatar' : ''"
                style="cursor: pointer; border: 2px solid transparent; display: block; margin: 0 auto;"
              >
                <v-img 
                  :src="getAvatarUrl(avatar)" 
                  :alt="`avatar-${avatar}`"
                  style="width: 100%; height: 100%; object-fit: cover;"
                ></v-img>
              </v-avatar>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="$emit('update:modelValue', false)">{{ t('common.close') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { useSettingsStore } from "@/stores/settings";
import { computed } from "vue";

// --- Props and Emits ---
const props = defineProps({
  modelValue: Boolean, // 用於 v-model
  currentAvatar: String,
});
const emit = defineEmits(["update:modelValue", "update:avatar"]);

// --- Store ---
const settingsStore = useSettingsStore();
const t = computed(() => settingsStore.t);

// --- Data ---
const availableAvatars = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
  25, 26, 27, 28, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45,
  46, 47, 48,
];
const jpgAvatars = [39, 40, 41, 42, 43, 44, 45, 46, 47, 48];

// --- Methods ---
const getAvatarUrl = (avatarId) => {
  const formattedId = String(avatarId).padStart(2, "0");
  const extension = jpgAvatars.includes(avatarId) ? "jpg" : "png";
  return `https://www.browndust2.com/img/designKit/snsIcon/social-icon-${formattedId}.${extension}`;
};

const selectAvatar = (newAvatar) => {
  if (newAvatar) {
    emit("update:avatar", newAvatar);
  }
  emit("update:modelValue", false); // 選完自動關閉
};
</script>

<style scoped>
.selected-avatar {
  border: 3px solid #e72857 !important;
  box-shadow: 0 0 12px rgba(231, 40, 87, 0.7);
}
</style>
