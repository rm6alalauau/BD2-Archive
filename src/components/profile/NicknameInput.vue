<template>
  <div class="nickname-input-area">
    <div style="width: 100%; max-width: 400px">
      <div class="nickname-input-container">
        <v-text-field
          v-model="modelValue"
          :label="t('profile.nicknamePlaceholder')"
          variant="outlined"
          @keyup.enter="$emit('submit')"
          @focus="onFocus"
          @blur="onBlur"
          :rules="[rules.required, rules.maxLength(20)]"
          :append-inner-icon="
            savedNicknames.length > 0 ? 'mdi-account-multiple' : null
          "
          @click:append-inner="$emit('open-dialog')"
          autofocus
          class="mb-2"
          :placeholder="t('profile.nicknameInputPlaceholder')"
        ></v-text-field>

        <!-- 暱稱建議列表 -->
        <v-card
          v-if="showSuggestions && savedNicknames.length > 0"
          class="nickname-suggestions"
          elevation="8"
        >
          <v-list density="compact">
            <v-list-item
              v-for="savedNickname in savedNicknames"
              :key="savedNickname"
              class="nickname-suggestion-item"
              @click="$emit('select', savedNickname)"
            >
              <template #prepend>
                <v-icon size="16" color="primary">mdi-account</v-icon>
              </template>

              <v-list-item-title class="nickname-suggestion-text">
                {{ savedNickname }}
              </v-list-item-title>

              <template #append>
                <v-btn
                  @click.stop="$emit('remove', savedNickname)"
                  icon="mdi-close"
                  size="x-small"
                  variant="text"
                  color="grey"
                  class="nickname-delete-btn"
                  :aria-label="`刪除暱稱 ${savedNickname}`"
                ></v-btn>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </div>

      <v-btn
        block
        color="primary"
        @click="$emit('submit')"
        :disabled="!modelValue.trim()"
      >
        {{ t("profile.queryButton") }}
      </v-btn>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useSettingsStore } from "@/stores/settings";

const props = defineProps({
  modelValue: String,
  savedNicknames: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits([
  'update:modelValue', 
  'submit', 
  'select', 
  'remove', 
  'open-dialog'
]);

const settingsStore = useSettingsStore();
const t = computed(() => settingsStore.t);

const showSuggestions = ref(false);

const rules = computed(() => ({
  required: (value) => !!value || t.value("profile.nicknameRequired"),
  maxLength: (max) => (value) =>
    !value ||
    value.length <= max ||
    t.value("feedback.validation.maxLength", null, { limit: max }),
}));

const onFocus = () => {
  if (props.savedNicknames.length > 0) {
    showSuggestions.value = true;
  }
};

const onBlur = () => {
  // 延遲隱藏建議，讓用戶有時間點擊建議項目
  setTimeout(() => {
    showSuggestions.value = false;
  }, 200);
};

// Watch modelValue to emit update
const modelValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
});
</script>

<style scoped>
.nickname-input-area {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.nickname-input-container {
  position: relative;
}

.nickname-suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 100;
  max-height: 200px;
  overflow-y: auto;
  margin-top: 4px;
}

.nickname-suggestion-item {
  cursor: pointer;
  transition: background-color 0.2s;
}

.nickname-suggestion-item:hover {
  background-color: rgba(var(--v-theme-primary), 0.1);
}

.nickname-suggestion-text {
  font-size: 0.9rem;
}

.nickname-delete-btn {
  opacity: 0.6;
}

.nickname-delete-btn:hover {
  opacity: 1;
  color: rgb(var(--v-theme-error)) !important;
}
</style>
