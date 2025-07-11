<template>
  <v-dialog :model-value="modelValue" @update:modelValue="$emit('update:modelValue', $event)" max-width="450px">
    <v-card rounded="lg">
      <v-card-title>
        <v-icon start>mdi-account-multiple</v-icon>
        {{ t('profile.nickname.switch') }} ({{ nicknames.length }})
      </v-card-title>
      <v-card-text v-if="nicknames.length > 0">
        <v-list>
          <v-list-item
            v-for="name in nicknames"
            :key="name"
            @click="selectNicknameFromDialog(name)"
            :class="current === name ? 'selected-nickname' : ''"
            class="nickname-dialog-item"
          >
            <template #prepend>
              <v-avatar size="32" :color="current === name ? 'primary' : 'grey-lighten-1'">
                <v-icon :color="current === name ? 'white' : 'grey'">mdi-account</v-icon>
              </v-avatar>
            </template>
            
            <v-list-item-title class="font-weight-medium">
              {{ name }}
            </v-list-item-title>
            
            <v-list-item-subtitle v-if="current === name">
              {{ t('profile.nickname.current') }}
            </v-list-item-subtitle>
            
            <template #append>
              <div class="nickname-actions">
                <v-btn
                  @click.stop="selectNicknameFromDialog(name)"
                  :variant="current === name ? 'flat' : 'outlined'"
                  :color="current === name ? 'success' : 'primary'"
                  size="small"
                  class="mr-2"
                >
                  {{ current === name ? t('profile.nickname.current') : t('profile.userProfile.switchNickname') }}
                </v-btn>
                
                <v-btn
                  @click.stop="$emit('delete', name)"
                  icon="mdi-delete"
                  size="small"
                  variant="text"
                  color="error"
                  :title="t('profile.nickname.deleteTitle')"
                  :aria-label="`刪除暱稱 ${name}`"
                ></v-btn>
              </div>
            </template>
          </v-list-item>
        </v-list>
      </v-card-text>
      <v-card-text v-else class="text-center py-8">
        <v-icon size="48" color="grey-lighten-1" class="mb-4">mdi-account-off</v-icon>
        <div class="text-h6 text-grey-lighten-1">{{ t('profile.nickname.noSaved') }}</div>
        <div class="text-body-2 text-grey mt-2">{{ t('profile.nickname.autoSaveHint') }}</div>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn variant="text" @click="$emit('new')">{{ t('profile.userProfile.reenterNickname') }}</v-btn>
        <v-spacer></v-spacer>
        <v-btn text @click="$emit('update:modelValue', false)">{{ t('common.close') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { useSettingsStore } from '@/stores/settings';
import { computed } from 'vue';

// --- Props and Emits ---
defineProps({
  modelValue: Boolean,
  nicknames: { type: Array, default: () => [] },
  current: String,
});
const emit = defineEmits(['update:modelValue', 'select', 'delete', 'new']);

// --- Store ---
const settingsStore = useSettingsStore();
const t = (key, params) => settingsStore.t(key, settingsStore.selectedLanguage, params);

// --- Methods ---
const selectNicknameFromDialog = (nickname) => {
  emit('update:modelValue', false);
  emit('select', nickname);
};
</script>

<style scoped>
.nickname-dialog-item {
  border: 1px solid transparent;
  margin: 4px 0;
  transition: all 0.2s ease-in-out;
}
.nickname-dialog-item:hover {
  background-color: rgba(var(--v-theme-on-surface), 0.04);
  border-color: rgba(var(--v-theme-on-surface), 0.1);
}
.selected-nickname {
  background-color: rgba(var(--v-theme-primary), 0.1);
  border-color: rgba(var(--v-theme-primary), 0.3);
}

.nickname-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style> 