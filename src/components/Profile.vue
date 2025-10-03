<template>
  <v-card rounded="xl" class="d-flex flex-column profile-card">
    <v-card-title
      class="headline d-flex align-center"
      style="font-size: 1rem; font-weight: bold; color: #e72857"
    >
      {{ t("profile.title") }}
      <v-btn
        icon
        size="small"
        variant="text"
        color="primary"
        class="ml-2"
        :aria-label="t('profile.helpDialog.title')"
        @click="showHelpDialog = true"
      >
        <v-icon size="18">mdi-help-circle-outline</v-icon>
      </v-btn>
    </v-card-title>

    <v-card-text class="flex-grow-1 profile-card-content">
      <!-- 狀態一：尚未設定暱稱 -->
      <div v-if="!currentNickname" class="nickname-input-area">
        <div style="width: 100%; max-width: 400px">
          <div class="nickname-input-container">
            <v-text-field
              v-model="inputNickname"
              :label="t('profile.nicknamePlaceholder')"
              variant="outlined"
              @keyup.enter="saveAndSetNickname"
              @focus="onNicknameInputFocus"
              @blur="onNicknameInputBlur"
              :rules="[rules.required, rules.maxLength(20)]"
              :append-inner-icon="
                savedNicknames.length > 0 ? 'mdi-account-multiple' : null
              "
              @click:append-inner="nicknameDialog = true"
              autofocus
              class="mb-2"
              :placeholder="t('profile.nicknameInputPlaceholder')"
            ></v-text-field>

            <!-- 暱稱建議列表 -->
            <v-card
              v-if="showNicknameSuggestions && savedNicknames.length > 0"
              class="nickname-suggestions"
              elevation="8"
            >
              <v-list density="compact">
                <v-list-item
                  v-for="savedNickname in savedNicknames"
                  :key="savedNickname"
                  class="nickname-suggestion-item"
                  @click="selectSavedNickname(savedNickname)"
                >
                  <template #prepend>
                    <v-icon size="16" color="primary">mdi-account</v-icon>
                  </template>

                  <v-list-item-title class="nickname-suggestion-text">
                    {{ savedNickname }}
                  </v-list-item-title>

                  <template #append>
                    <v-btn
                      @click.stop="removeSavedNickname(savedNickname)"
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
            @click="saveAndSetNickname"
            :disabled="!inputNickname.trim()"
          >
            {{ t("profile.queryButton") }}
          </v-btn>
        </div>
      </div>

      <!-- 狀態二：已設定暱稱 -->
      <div v-else class="coupon-display-area">
        <div class="user-profile-card">
          <v-avatar size="56" @click="avatarDialog = true" class="user-avatar">
            <v-img :src="currentAvatarUrl" :alt="currentNickname"></v-img>
          </v-avatar>
          <div class="user-info" @click="nicknameDialog = true">
            <div class="user-nickname">{{ currentNickname }}</div>
            <div class="user-subtitle">
              {{ t("profile.userProfile.clickAvatarToChange") }}
            </div>
          </div>
          <div class="user-actions">
            <v-btn
              @click="exitNicknameMode"
              icon="mdi-logout"
              size="small"
              variant="text"
              :title="t('profile.userProfile.reenterNickname')"
              :aria-label="t('profile.userProfile.reenterNickname')"
            ></v-btn>
          </div>
        </div>

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
          <div
            v-for="(coupon, index) in redeemCodes"
            :key="coupon.code"
            class="coupon-item"
          >
            <div class="coupon-main-row">
              <v-icon
                :color="coupon.claimed ? 'success' : 'grey-lighten-1'"
                :icon="
                  coupon.claimed ? 'mdi-check-circle' : 'mdi-circle-outline'
                "
                size="20"
                class="coupon-status-icon"
              ></v-icon>

              <div class="coupon-code-section">
                <div class="coupon-code-row">
                  <div class="coupon-code-left">
                    <a
                      href="#"
                      class="coupon-code coupon-code-link"
                      @click.prevent="openOfficialRedeemPage(coupon.code)"
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
                      @click="showImagePreview(coupon)"
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
                @click="executeClaim(coupon, index, $event)"
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
        </div>

        <div v-else class="loading-container">
          <v-icon size="x-large" color="grey-lighten-1"
            >mdi-package-variant-closed</v-icon
          >
          <div class="mt-2 text-grey">{{ t("profile.status.unknown") }}</div>
        </div>
      </div>
    </v-card-text>

    <!-- 兌換動畫 -->
    <div 
      v-if="redeemAnimation && redeemAnimation.show" 
      class="redeem-animation-overlay"
      :style="{
        left: redeemAnimation.position.x,
        top: redeemAnimation.position.y,
        transform: redeemAnimation.position.x.includes('%') ? 'translate(-50%, -50%)' : 'translate(-50%, -50%)'
      }"
    >
      <img 
        :src="redeemAnimation.src" 
        :alt="'兌換動畫'"
        class="redeem-animation-gif"
      />
    </div>

    <!-- Dialogs -->
    <AvatarDialog
      v-model="avatarDialog"
      :current-avatar="String(currentAvatar)"
      @update:avatar="updateAvatar"
    />
    <NicknameDialog
      v-model="nicknameDialog"
      :nicknames="savedNicknames"
      :current="currentNickname"
      @select="selectNickname"
      @delete="deleteNickname"
      @new="enterNewNickname"
    />
    
    <!-- 圖片預覽對話框 -->
    <v-dialog
      v-model="imagePreviewDialog"
      max-width="600"
      @click:outside="closeImagePreview"
    >
      <v-card v-if="selectedCouponImage">
        <v-card-title class="d-flex align-center justify-space-between">
          <span>{{ selectedCouponImage.code }}</span>
          <v-btn
            icon
            size="small"
            variant="text"
            @click="closeImagePreview"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        
        <v-card-text class="pa-0">
          <v-img
            :src="selectedCouponImage.image_url"
            :alt="`${selectedCouponImage.code} 兌換碼圖片`"
            contain
            max-height="400"
            @error="handleImageLoadError"
          >
            <template v-slot:placeholder>
              <div class="d-flex align-center justify-center fill-height">
                <v-progress-circular indeterminate color="primary"></v-progress-circular>
              </div>
            </template>
          </v-img>
        </v-card-text>
        
        <v-card-actions class="justify-center">
          <v-btn
            variant="text"
            @click="closeImagePreview"
          >
            關閉
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    
    <!-- 兌換碼功能說明對話框 -->
    <v-dialog v-model="showHelpDialog" max-width="600">
      <v-card>
        <v-card-title class="text-h6 pa-4">
          {{ t('profile.helpDialog.title') }}
        </v-card-title>
        
        <v-divider />
        
        <v-card-text class="pa-4">
          <!-- 運作方式 -->
          <div class="mb-4">
            <h3 class="text-subtitle-1 font-weight-bold mb-2 text-primary">
              {{ t('profile.helpDialog.howItWorks') }}
            </h3>
            <div class="mb-2">{{ t('profile.helpDialog.step1') }}</div>
            <div class="mb-2">{{ t('profile.helpDialog.step2') }}</div>
            <div class="mb-2">{{ t('profile.helpDialog.step3') }}</div>
          </div>
          
          <!-- 狀態說明 -->
          <div>
            <h3 class="text-subtitle-1 font-weight-bold mb-2 text-primary">
              {{ t('profile.helpDialog.statusMeaning') }}
            </h3>
            <div class="mb-2">{{ t('profile.helpDialog.statusDescription') }}</div>
            <div class="mb-1">
              <span style="color: #4CAF50; font-weight: bold;">{{ t('profile.helpDialog.statusSuccess') }}</span>
            </div>
            <div class="mb-1">
              <span style="color: #FB8C00; font-weight: bold;">{{ t('profile.helpDialog.statusUsed') }}</span>
            </div>
            <div class="mb-1">
              <span style="color: #F44336; font-weight: bold;">{{ t('profile.helpDialog.statusFailed') }}</span>
            </div>
          </div>
          
          <!-- 本地儲存提醒 -->
          <div class="mt-4">
            <h3 class="text-subtitle-1 font-weight-bold mb-2 text-warning">
              {{ t('profile.helpDialog.importantNote') }}
            </h3>
            <div class="text-body-2 text-medium-emphasis">
              {{ t('profile.helpDialog.localStorageNote') }}
            </div>
          </div>
        </v-card-text>
        
        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn color="primary" @click="showHelpDialog = false">
            {{ t('common.close') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useSettingsStore } from "@/stores/settings";
import { useAppStore } from "@/stores/app";
import AvatarDialog from "./AvatarDialog.vue";
import NicknameDialog from "./NicknameDialog.vue";

// --- Stores ---
const settingsStore = useSettingsStore();
const appStore = useAppStore();

// --- Props ---
const props = defineProps({
  // 可以根據需要添加 props
});

// --- Reactive Data ---
const inputNickname = ref("");
const currentNickname = ref("");
const savedNicknames = ref([]);
const currentAvatar = ref(1);
const avatarDialog = ref(false);
const nicknameDialog = ref(false);
const showHelpDialog = ref(false);
const loading = ref(false);
const redeemCodes = ref([]);
const showNicknameSuggestions = ref(false);
const nicknameInputFocused = ref(false);
// 圖片預覽相關
const imagePreviewDialog = ref(false);
const selectedCouponImage = ref(null);
// 兌換動畫相關
const redeemAnimation = ref(null);
const claimCount = ref(0);

// --- Computed ---
const t = computed(() => settingsStore.t);

const currentAvatarUrl = computed(() => {
  const formattedId = String(currentAvatar.value).padStart(2, "0");
  const jpgAvatars = [39, 40, 41, 42, 43, 44, 45, 46, 47, 48];
  const extension = jpgAvatars.includes(currentAvatar.value) ? "jpg" : "png";
  return `https://www.browndust2.com/img/designKit/snsIcon/social-icon-${formattedId}.${extension}`;
});

const rules = computed(() => ({
  required: (value) => !!value || t.value("profile.nicknameRequired"),
  maxLength: (max) => (value) =>
    !value ||
    value.length <= max ||
    t.value("feedback.validation.maxLength", null, { limit: max }),
}));

// --- Methods ---
const loadSavedNicknames = () => {
  try {
    const saved = localStorage.getItem("savedNicknames");
    savedNicknames.value = saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error("載入暱稱列表失敗:", error);
    savedNicknames.value = [];
  }
};

const saveNicknameToList = (nickname) => {
  if (!nickname || nickname.trim() === "") return;

  const trimmedNickname = nickname.trim();

  if (!savedNicknames.value.includes(trimmedNickname)) {
    savedNicknames.value.unshift(trimmedNickname);

    if (savedNicknames.value.length > 10) {
      savedNicknames.value = savedNicknames.value.slice(0, 10);
    }

    localStorage.setItem(
      "savedNicknames",
      JSON.stringify(savedNicknames.value)
    );
  } else {
    const index = savedNicknames.value.indexOf(trimmedNickname);
    savedNicknames.value.splice(index, 1);
    savedNicknames.value.unshift(trimmedNickname);
    localStorage.setItem(
      "savedNicknames",
      JSON.stringify(savedNicknames.value)
    );
  }
};

const saveAndSetNickname = () => {
  if (!inputNickname.value.trim()) return;

  currentNickname.value = inputNickname.value.trim();
  localStorage.setItem("nickname", currentNickname.value);
  saveNicknameToList(currentNickname.value);

  // 載入兌換碼
  loadRedeemCodes();
};

const loadRedeemCodes = async () => {
  loading.value = true;

  try {
    // 檢查 appStore 狀態
    if (appStore.loading) {
      await waitForApiAndLoadData();
    } else if (appStore.hasData) {
      loadCouponCodesFromStore();
    } else {
      await appStore.fetchAllData();
      loadCouponCodesFromStore();
    }
  } catch (error) {
    console.error("載入兌換碼失敗:", error);
    // 載入錯誤狀態
    redeemCodes.value = [
      {
        code: "LOAD_ERROR",
        description: "兌換碼載入失敗",
        status: "載入錯誤",
        claimed: false,
        claiming: false,
        statusMessage: null,
        errorMessage: "請重新整理頁面或稍後再試",
      },
    ];
  } finally {
    loading.value = false;
  }
};

const loadClaimedStatus = () => {
  try {
    const claimedCodesStr = localStorage.getItem(
      `claimedCodes_${currentNickname.value}`
    );
    const claimedCodes = claimedCodesStr ? JSON.parse(claimedCodesStr) : [];

    redeemCodes.value.forEach((coupon) => {
      coupon.claimed = claimedCodes.includes(coupon.code);
    });
  } catch (error) {
    console.error("載入兌換狀態失敗:", error);
  }
};

const saveClaimedStatus = () => {
  const claimedCodes = redeemCodes.value
    .filter((coupon) => coupon.claimed)
    .map((coupon) => coupon.code);
  localStorage.setItem(
    `claimedCodes_${currentNickname.value}`,
    JSON.stringify(claimedCodes)
  );
};

const executeClaim = async (coupon, index, event) => {
  if (coupon.claimed || coupon.claiming) return;

  // 顯示兌換動畫（點擊時立即觸發）
  const buttonElement = event?.target;
  showRedeemAnimation(buttonElement);

  // 設置兌換中狀態
  redeemCodes.value[index].claiming = true;
  redeemCodes.value[index].errorMessage = null;
  redeemCodes.value[index].statusMessage = null;
  redeemCodes.value[index].messageType = null;

  try {
    // 使用真正的 API 客戶端執行兌換
    const result = await claimCoupon(currentNickname.value, coupon.code);

    // 檢查是否成功
    if (result.success === true) {
      // 兌換成功
      redeemCodes.value[index].claimed = true;
      redeemCodes.value[index].claiming = false;
      redeemCodes.value[index].errorMessage = null;
      redeemCodes.value[index].statusMessage = t.value(
        "profile.errors.claimSuccess"
      );
      redeemCodes.value[index].messageType = "success";

      // 保存兌換狀態到 localStorage
      saveClaimedStatus();
    } else {
      // 如果 success 不是 true，當作錯誤處理
      throw result;
    }
  } catch (error) {
    console.error("兌換錯誤:", error);

    // 重置兌換狀態
    redeemCodes.value[index].claiming = false;

    // 根據錯誤類型處理
    if (error.errorCode === "AlreadyUsed") {
      // 已經使用過的兌換碼，標記為已兌換
      redeemCodes.value[index].claimed = true;
      redeemCodes.value[index].errorMessage = null;
      redeemCodes.value[index].statusMessage = t.value(
        "profile.errors.alreadyUsed"
      );
      redeemCodes.value[index].messageType = "warning";
      saveClaimedStatus();
    } else if (error.errorCode === "InvalidCode") {
      // 無效的兌換碼
      redeemCodes.value[index].errorMessage = t.value(
        "profile.errors.invalidCoupon"
      );
      redeemCodes.value[index].statusMessage = null;
      redeemCodes.value[index].messageType = "error";
    } else if (error.errorCode === "IncorrectUser") {
      // 暱稱驗證失敗
      redeemCodes.value[index].errorMessage = t.value(
        "profile.errors.nicknameValidationFailed"
      );
      redeemCodes.value[index].statusMessage = null;
      redeemCodes.value[index].messageType = "error";
    } else if (error.errorCode === "ExpiredCode") {
      // 兌換碼已到期
      redeemCodes.value[index].errorMessage = t.value(
        "profile.errors.couponExpired"
      );
      redeemCodes.value[index].statusMessage = null;
      redeemCodes.value[index].messageType = "error";
    } else {
      // 其他錯誤
      if (error.name === "AbortError") {
        redeemCodes.value[index].errorMessage = t.value(
          "profile.errors.requestTimeout"
        );
      } else if (error.message && error.message.includes("Failed to fetch")) {
        redeemCodes.value[index].errorMessage = t.value(
          "profile.errors.networkConnection"
        );
      } else if (error.message && error.message.includes("NetworkError")) {
        redeemCodes.value[index].errorMessage = t.value(
          "profile.errors.networkError"
        );
      } else {
        redeemCodes.value[index].errorMessage = t.value(
          "profile.errors.claimFailed"
        );
      }
      redeemCodes.value[index].messageType = "error";
      redeemCodes.value[index].statusMessage = null;
    }
  }
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

// 顯示兌換動畫
const showRedeemAnimation = (buttonElement = null) => {
  // 檢查是否開啟彩蛋模式
  if (settingsStore.activeEasterEggMode !== 'walker_mode') {
    return;
  }

  claimCount.value += 1;
  
  // 決定使用哪個 GIF
  const gifPath = claimCount.value === 1 
    ? '/yuri/effects/redeem1.gif' 
    : '/yuri/effects/redeem2.gif';
  
  // 計算動畫位置
  let position = { x: '50%', y: '50%' };
  
  if (buttonElement) {
    try {
      const rect = buttonElement.getBoundingClientRect();
      position = {
        x: `${rect.left + rect.width / 2}px`,
        y: `${rect.top - 100}px` // 按鈕上方100px
      };
    } catch (error) {
      console.warn('無法獲取按鈕位置，使用預設位置', error);
    }
  }
  
  // 創建動畫物件
  redeemAnimation.value = {
    id: Date.now(),
    src: gifPath,
    show: true,
    startTime: Date.now(),
    position: position
  };
  
  // 2.5秒後自動隱藏（縮短時間減少干擾）
  setTimeout(() => {
    if (redeemAnimation.value) {
      redeemAnimation.value.show = false;
      // 再過300ms完全移除
      setTimeout(() => {
        redeemAnimation.value = null;
      }, 300);
    }
  }, 2500);
};

// 檢查是否為日期格式
const isDateStatus = (status) => {
  const datePattern = /^\d{4}\/\d{1,2}\/\d{1,2}$/;
  return datePattern.test(status);
};

// 格式化日期顯示
const formatDateStatus = (status) => {
  if (!isDateStatus(status)) {
    // 如果不是日期格式，檢查是否為預定義的 status 值
    return t.value(`profile.status.${status}`) || status;
  }

  const statusDate = new Date(status);
  const currentDate = new Date();

  // 比較日期（忽略時間）
  const statusDateOnly = new Date(
    statusDate.getFullYear(),
    statusDate.getMonth(),
    statusDate.getDate()
  );
  const currentDateOnly = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate()
  );

  // 格式化日期顯示
  const month = statusDate.getMonth() + 1;
  const day = statusDate.getDate();

  if (statusDateOnly < currentDateOnly) {
    return t.value('profile.status.expired'); // 已過期
  } else if (statusDateOnly.getTime() === currentDateOnly.getTime()) {
    return `${t.value('profile.status.limited')} (${t.value('common.today')})`; // 今天到期
  } else {
    return t.value('profile.status.limited'); // 尚未到期
  }
};

// 獲取日期顯示文字（用於描述區域）
const getDateDisplayText = (expiryDate) => {
  if (!expiryDate || !isDateStatus(expiryDate)) return null;

  const statusDate = new Date(expiryDate);
  const month = statusDate.getMonth() + 1;
  const day = statusDate.getDate();

  // 使用多語系文字
  const expiryText = t.value('profile.expiryDate') || '到期';
  return `${month}/${day} ${expiryText}`;
};

const getStatusColor = (status) => {
  // 檢查是否為日期格式 (YYYY/M/D 或 YYYY/M/DD)
  if (isDateStatus(status)) {
    const statusDate = new Date(status);
    const currentDate = new Date();

    // 比較日期（忽略時間）
    const statusDateOnly = new Date(
      statusDate.getFullYear(),
      statusDate.getMonth(),
      statusDate.getDate()
    );
    const currentDateOnly = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate()
    );

    if (statusDateOnly < currentDateOnly) {
      return "error"; // 已過期
    } else if (statusDateOnly.getTime() === currentDateOnly.getTime()) {
      return "warning"; // 今天是最後一天，但仍可使用
    } else {
      return "warning"; // 尚未到期 - 統一使用 warning 顏色
    }
  }

  // 更新的狀態顏色邏輯 - 使用英文狀態值
  const statusColors = {
    active: "success",      // 目前可用 - 綠色
    expired: "error",       // 已過期 - 紅色
    limited: "warning",     // 限時可用 - 橙色
    permanent: "info",      // 永久 - 藍色
    unknown: "default",     // 未知狀態 - 灰色
    // 如果您需要更多狀態，可以添加：
    // coming_soon: "secondary", // 即將推出 - 紫色
    // maintenance: "default",   // 維護中 - 灰色
    // special: "primary"        // 特殊活動 - 主色調
  };
  
  return statusColors[status] || "default";
};

const exitNicknameMode = () => {
  currentNickname.value = "";
  inputNickname.value = "";
  redeemCodes.value = [];
  localStorage.removeItem("nickname");
};

const updateAvatar = (avatarId) => {
  currentAvatar.value = avatarId;
  localStorage.setItem("selectedAvatarId", avatarId.toString());
};

const selectNickname = (nickname) => {
  if (nickname === currentNickname.value) return;

  currentNickname.value = nickname;
  localStorage.setItem("nickname", nickname);
  saveNicknameToList(nickname);

  // 重新載入兌換碼
  loadRedeemCodes();
};

const deleteNickname = (nickname) => {
  removeSavedNickname(nickname);
};

const removeSavedNickname = (nickname) => {
  const index = savedNicknames.value.indexOf(nickname);
  if (index > -1) {
    savedNicknames.value.splice(index, 1);
    localStorage.setItem(
      "savedNicknames",
      JSON.stringify(savedNicknames.value)
    );

    if (currentNickname.value === nickname) {
      exitNicknameMode();
    }
  }
};

const enterNewNickname = () => {
  exitNicknameMode();
  nicknameDialog.value = false;
};

const onNicknameInputFocus = () => {
  nicknameInputFocused.value = true;
  if (savedNicknames.value.length > 0) {
    showNicknameSuggestions.value = true;
  }
};

const onNicknameInputBlur = () => {
  // 延遲隱藏建議，讓用戶有時間點擊建議項目
  setTimeout(() => {
    nicknameInputFocused.value = false;
    showNicknameSuggestions.value = false;
  }, 200);
};

const selectSavedNickname = (nickname) => {
  inputNickname.value = nickname;
  showNicknameSuggestions.value = false;
  nicknameInputFocused.value = false;

  // 自動提交暱稱
  saveAndSetNickname();
};

// === API 相關方法 ===

// 等待 API 載入完成
const waitForApiAndLoadData = async () => {
  const maxWaitTime = 15000; // 最多等待15秒
  const checkInterval = 500; // 每500ms檢查一次
  let waitedTime = 0;

  console.log("開始等待API載入完成...");

  return new Promise((resolve) => {
    const checkData = () => {
      waitedTime += checkInterval;

      console.log(
        `等待API載入: ${waitedTime}ms / ${maxWaitTime}ms (loading: ${appStore.loading}, hasData: ${appStore.hasData})`
      );

      // 檢查是否載入完成
      if (!appStore.loading) {
        console.log("API載入完成，載入兌換碼...");
        loading.value = false;
        loadCouponCodesFromStore();
        resolve();
        return;
      }

      // 檢查是否超時
      if (waitedTime >= maxWaitTime) {
        console.warn("API載入超時，強制載入兌換碼...");
        loading.value = false;
        loadCouponCodesFromStore();
        resolve();
        return;
      }

      // 繼續等待
      setTimeout(checkData, checkInterval);
    };

    // 開始檢查
    setTimeout(checkData, checkInterval);
  });
};

// 圖片預覽相關方法
const showImagePreview = (coupon) => {
  selectedCouponImage.value = coupon;
  imagePreviewDialog.value = true;
};

const closeImagePreview = () => {
  imagePreviewDialog.value = false;
  selectedCouponImage.value = null;
};

const handleImageLoadError = () => {
  console.warn('兌換碼圖片載入失敗');
};

// 開啟官方兌換頁面並複製兌換碼
const openOfficialRedeemPage = async (code) => {
  try {
    // 顯示兌換動畫（點擊時立即觸發）
    showRedeemAnimation();
    
    // 複製兌換碼到剪貼板
    await copyToClipboard(code);
    
    // 根據當前語言設置獲取對應的語言參數
    const langParam = getOfficialPageLangParam();
    
    // 構建官方兌換頁面URL
    const officialUrl = `https://redeem.bd2.pmang.cloud/bd2/index.html?lang=${langParam}&userId=${encodeURIComponent(currentNickname.value)}`;
    
    // 在新分頁開啟官方兌換頁面
    window.open(officialUrl, '_blank');
    
    // 標記為已兌換並保存到 localStorage（等同於點擊兌換按鈕的操作）
    markCouponAsClaimed(code);
  } catch (error) {
    console.error('開啟官方兌換頁面時發生錯誤:', error);
  }
};

// 複製文字到剪貼板
const copyToClipboard = async (text) => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      // 使用現代 Clipboard API
      await navigator.clipboard.writeText(text);
    } else {
      // 降級方案：使用傳統方法
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'absolute';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  } catch (error) {
    console.error('複製到剪貼板失敗:', error);
    throw error;
  }
};

// 獲取官方兌換頁面的語言參數
const getOfficialPageLangParam = () => {
  const currentLanguage = settingsStore.selectedLanguage;
  
  // 語言映射表：應用語言 -> 官方頁面語言參數
  const langMapping = {
    'zh-Hant-TW': 'zh-TW',  // 繁體中文
    'zh-Hans-CN': 'zh-CN',  // 簡體中文
    'en': 'en-US',          // 英文
    'ja-JP': 'ja-JP',       // 日文
    'ko-KR': 'ko-KR'        // 韓文
  };
  
  // 返回對應的語言參數，如果沒有匹配則默認使用繁體中文
  return langMapping[currentLanguage] || 'zh-TW';
};

// 標記兌換碼為已兌換
const markCouponAsClaimed = (code) => {
  try {
    // 找到對應的兌換碼項目並更新狀態
    const couponIndex = redeemCodes.value.findIndex(coupon => coupon.code === code);
    if (couponIndex !== -1) {
      redeemCodes.value[couponIndex].claimed = true;
      redeemCodes.value[couponIndex].statusMessage = t.value("profile.errors.claimSuccess");
      redeemCodes.value[couponIndex].messageType = "success";
      redeemCodes.value[couponIndex].errorMessage = null;
      
      // 保存兌換狀態到 localStorage
      saveClaimedStatus();
    }
  } catch (error) {
    console.error('標記兌換碼為已兌換時發生錯誤:', error);
  }
};

// 獲取本地化的獎勵文字
const getLocalizedReward = (reward) => {
  if (!reward) return null;
  
  // 如果 reward 是字串，直接返回（舊格式相容）
  if (typeof reward === 'string') {
    return reward;
  }
  
  // 如果 reward 是物件，根據當前語言選擇對應文字
  if (typeof reward === 'object' && reward !== null) {
    const currentLanguage = settingsStore.selectedLanguage;
    return reward[currentLanguage] || reward['zh-Hant-TW'] || reward['en'] || Object.values(reward)[0];
  }
  
  return null;
};

// 從 store 載入兌換碼數據
const loadCouponCodesFromStore = () => {
  try {
    const redeemData = appStore.redeemCodes;

    if (redeemData && redeemData.length > 0) {
      // 檢查是否有 API 錯誤
      const hasApiError = redeemData.some((item) => item.code === "API_ERROR");

      if (hasApiError) {
        redeemCodes.value = [
          {
            code: "API_ERROR",
            description: "暫時無法載入兌換碼資料",
            status: "API連線中斷",
            claimed: false,
            claiming: false,
            statusMessage: null,
            errorMessage: "請重新整理頁面或稍後再試",
          },
        ];

        // 顯示更詳細的錯誤信息
        if (appStore.error) {
          redeemCodes.value[0].errorMessage = `連線錯誤: ${appStore.error}`;
        }

        return;
      }

      // 轉換正常數據格式並過濾已過期的兌換碼
      const filteredRedeemData = redeemData.filter((item) => {
        // 如果沒有過期日期，保留所有項目
        if (!item.expiry_date || !isDateStatus(item.expiry_date)) {
          return true;
        }

        // 檢查日期是否已過期超過一天
        const expiryDate = new Date(item.expiry_date);
        const currentDate = new Date();

        // 比較日期（忽略時間）
        const expiryDateOnly = new Date(
          expiryDate.getFullYear(),
          expiryDate.getMonth(),
          expiryDate.getDate()
        );
        const currentDateOnly = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate()
        );

        // 計算日期差（以天為單位）
        const timeDiff = currentDateOnly.getTime() - expiryDateOnly.getTime();
        const daysDiff = timeDiff / (1000 * 3600 * 24);

        // 如果過期超過1天，則過濾掉
        return daysDiff <= 1;
      });

      redeemCodes.value = filteredRedeemData.map((item) => ({
        code: item.code || "未知代碼",
        reward: item.reward, // 保留原始的多語系物件
        description: getLocalizedReward(item.reward) || "未知獎勵", // 保留作為備用
        status: item.status || "未知狀態",
        expiry_date: item.expiry_date || null, // 添加過期日期
        image_url: item.image_url || null, // 添加圖片 URL
        claimed: false,
        claiming: false,
        statusMessage: null,
        errorMessage: null,
        messageType: null,
      }));

      // 載入已兌換狀態
      loadClaimedStatus();
    } else {
      // 檢查是否有API錯誤
      if (appStore.error) {
        redeemCodes.value = [
          {
            code: "LOAD_ERROR",
            description: "兌換碼載入失敗",
            status: "載入錯誤",
            claimed: false,
            claiming: false,
            statusMessage: null,
            errorMessage: `${appStore.error} - 請重新整理頁面`,
          },
        ];
      } else {
        // 單純沒有數據
        redeemCodes.value = [
          {
            code: "NO_DATA",
            description: "目前沒有可用的兌換碼",
            status: "暫無資料",
            claimed: false,
            claiming: false,
            statusMessage: null,
            errorMessage: null,
          },
        ];
      }
    }
  } catch (error) {
    console.error("從 store 載入兌換碼時發生錯誤:", error);
    redeemCodes.value = [
      {
        code: "SYSTEM_ERROR",
        description: "系統載入兌換碼時發生錯誤",
        status: "系統錯誤",
        claimed: false,
        claiming: false,
        statusMessage: null,
        errorMessage: "請重新整理頁面或聯絡管理員",
      },
    ];
  }
};

// API 客戶端方法 - iOS Safari 兼容版本
const claimCoupon = async (userId = "", code = "") => {
  const maxRetries = 3;
  const baseDelay = 1000;
  let lastError;
      const apiEndpoint = "https://api.thebd2pulse.com/redeem/coupon";
  const appId = "bd2-live";

  // 檢測 iOS 設備
  const isIOSDevice =
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // 使用最簡單的請求配置避免觸發 OPTIONS 預檢
      const requestBody = JSON.stringify({
        appId,
        userId,
        code,
      });

      // 設置較短的超時時間
      const timeoutMs = isIOSDevice ? 8000 : 15000;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, timeoutMs);

      // iOS Safari 優化：使用最小化的 CORS 配置
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: requestBody,
        signal: controller.signal,
        mode: "cors",
        cache: "no-cache",
        credentials: "omit", // 重要：iOS Safari 對 credentials 敏感
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        return await response.json();
      }

      // 處理 API 錯誤回應
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = {
          message: `HTTP ${response.status}: ${response.statusText}`,
          errorCode: `HTTP_${response.status}`,
        };
      }

      // 5xx 錯誤值得重試
      if (response.status >= 500 && attempt < maxRetries) {
        throw new Error(`伺服器錯誤 ${response.status}，將重試...`);
      }

      // 429 錯誤值得重試
      if (response.status === 429 && attempt < maxRetries) {
        throw new Error(`請求過於頻繁，將重試...`);
      }

      // 其他 4xx 錯誤不重試
      if (response.status >= 400) {
        throw errorData;
      }

      throw errorData;
    } catch (error) {
      lastError = error;

      // 最後一次嘗試失敗
      if (attempt === maxRetries) {
        throw error;
      }

      // 判斷是否值得重試
      const isRetryableError =
        error.name === "AbortError" || // 超時
        error.message.includes("Failed to fetch") || // 網路問題
        error.message.includes("NetworkError") || // 網路問題
        error.message.includes("伺服器錯誤") || // 5xx 錯誤
        error.message.includes("請求過於頻繁") || // 429 錯誤
        error.message.includes("Load failed"); // 載入失敗

      if (!isRetryableError) {
        throw error;
      }

      // 計算重試延遲
      const delay = baseDelay * Math.pow(2, attempt - 1);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
};

// --- Lifecycle ---
onMounted(() => {
  loadSavedNicknames();

  // 載入保存的暱稱
  const savedNickname = localStorage.getItem("nickname");
  if (savedNickname) {
    currentNickname.value = savedNickname;
    loadRedeemCodes();
  }

  // 載入保存的頭像
  const savedAvatarId = localStorage.getItem("selectedAvatarId");
  if (savedAvatarId) {
    currentAvatar.value = parseInt(savedAvatarId);
  } else {
    // 隨機選擇一個頭像
    const availableAvatars = [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
      22, 25, 26, 27, 28, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43,
      44, 45, 46, 47, 48,
    ];
    const randomAvatar =
      availableAvatars[Math.floor(Math.random() * availableAvatars.length)];
    currentAvatar.value = randomAvatar;
    localStorage.setItem("selectedAvatarId", randomAvatar.toString());
  }

  // 確保 appStore 已經初始化
  if (!appStore.hasData && !appStore.loading) {
    appStore.fetchAllData().catch((error) => {
      console.error("初始化載入失敗:", error);
    });
  }
});

// --- Watch ---
// 監聽 appStore 數據變化
watch(
  () => ({
    hasData: appStore.hasData,
    loading: appStore.loading,
    error: appStore.error,
    lastFetchTime: appStore.lastFetchTime,
    redeemCodes: appStore.redeemCodes,
  }),
  (newVal, oldVal) => {
    // 只有當用戶已輸入暱稱時才處理
    if (!currentNickname.value) {
      return;
    }

    // 如果已有正常的兌換碼，跳過（避免重複載入）
    if (
      redeemCodes.value.length > 0 &&
      !["API_ERROR", "LOAD_ERROR", "SYSTEM_ERROR", "NO_DATA"].includes(
        redeemCodes.value[0].code
      )
    ) {
      return;
    }

    // 如果API從載入中變為完成，載入兌換碼
    if (oldVal && oldVal.loading && !newVal.loading) {
      loadCouponCodesFromStore();
      return;
    }

    // 如果API從沒有數據變為有數據，載入兌換碼
    if (oldVal && !oldVal.hasData && newVal.hasData) {
      loadCouponCodesFromStore();
      return;
    }

    // 如果lastFetchTime更新（表示有新數據），載入兌換碼
    if (
      oldVal &&
      oldVal.lastFetchTime !== newVal.lastFetchTime &&
      newVal.lastFetchTime
    ) {
      loadCouponCodesFromStore();
      return;
    }

    // 如果兌換碼數據直接更新
    if (
      newVal.redeemCodes &&
      newVal.redeemCodes.length > 0 &&
      (!oldVal ||
        JSON.stringify(oldVal.redeemCodes) !==
          JSON.stringify(newVal.redeemCodes))
    ) {
      loadCouponCodesFromStore();
      return;
    }
  },
  { deep: true, immediate: true }
);
</script>

<style scoped>
/* Profile 卡片樣式 */
.profile-card {
  min-height: 500px;
}

/* 桌面版增加最小高度以平衡左右列 */
@media (min-width: 769px) {
  .profile-card {
    min-height: 550px; /* 適度增加最小高度，平衡左右列但不擋到News */
  }
}

/* 桌面版才使用動態高度 */
@media (min-width: 769px) {
  .profile-card {
    height: 100%; /* 填滿分配的高度 */
    display: flex;
    flex-direction: column;
    min-height: 550px; /* 適度增加最小高度，平衡左右列 */
  }

  .profile-card-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0; /* 允許內容收縮 */
  }

  .coupon-display-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0; /* 允許內容收縮 */
  }
}

/* 載入狀態容器 */
.loading-container {
  height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

/* 兌換碼列表容器 */
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

/* 桌面版使用動態高度 */
@media (min-width: 769px) {
  .loading-container {
    flex: 1;
    min-height: 350px; /* 適度增加最小高度 */
    height: auto;
  }

  .coupon-list-container {
    flex: 1;
    min-height: 350px; /* 適度增加最小高度 */
    height: auto;
  }
}

/* 自定義滾動條樣式 */
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

/* 兌換碼列表項目樣式 */
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

/* 兌換碼內容區域 */
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

/* 今天是最後一天的特殊樣式 */
.coupon-status-chip.v-chip--color-warning {
  animation: pulse-warning 2s infinite;
}

@keyframes pulse-warning {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
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

/* 狀態訊息區域 */
.coupon-message-row {
  display: flex;
  padding: 8px 16px 12px 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  background-color: rgba(255, 255, 255, 0.02);
}

.coupon-message-spacer {
  width: 32px;
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

.coupon-message--warning {
  color: #fb8c00;
  background-color: rgba(251, 140, 0, 0.15);
  border: 1px solid rgba(251, 140, 0, 0.3);
}

.coupon-message--error {
  color: #f44336;
  background-color: rgba(244, 67, 54, 0.15);
  border: 1px solid rgba(244, 67, 54, 0.3);
}

/* 用戶資訊卡片樣式 */
.user-profile-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  margin-bottom: 8px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 16px;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.05) 0%,
    rgba(255, 255, 255, 0.02) 100%
  );
  transition: all 0.2s ease-in-out;
}

.user-profile-card:hover {
  border-color: rgba(231, 40, 87, 0.3);
  background: linear-gradient(
    135deg,
    rgba(231, 40, 87, 0.08) 0%,
    rgba(255, 255, 255, 0.05) 100%
  );
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
  color: #e72857;
  margin-bottom: 2px;
}

.user-subtitle {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
}

.user-actions {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
}

/* 暱稱輸入區域樣式 */
.nickname-input-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 40px;
  width: 100%;
}

/* 桌面版：靠上對齊 */
@media (min-width: 769px) {
  .nickname-input-area {
    justify-content: flex-start;
    padding-top: 60px;
  }
}

/* 手機版：保持原有的居中效果 */
@media (max-width: 768px) {
  .nickname-input-area {
    justify-content: center;
    height: 100%;
    padding-top: 20px;
  }
}

/* 暱稱輸入容器樣式 */
.nickname-input-container {
  position: relative;
}

.nickname-suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 1000;
  max-height: 200px;
  overflow-y: auto;
  background: rgba(18, 18, 18, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(231, 40, 87, 0.3);
  border-top: none;
  border-radius: 0 0 12px 12px;
}

.nickname-suggestion-item {
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.nickname-suggestion-item:last-child {
  border-bottom: none;
}

.nickname-suggestion-item:hover {
  background-color: rgba(231, 40, 87, 0.1);
}

.nickname-suggestion-text {
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
}

.nickname-delete-btn {
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
}

.nickname-suggestion-item:hover .nickname-delete-btn {
  opacity: 0.7;
}

.nickname-delete-btn:hover {
  opacity: 1 !important;
}

/* 響應式調整 */
@media (max-width: 768px) {
  .profile-card {
    min-height: 450px;
  }

  .user-profile-card {
    padding: 12px;
    gap: 12px;
  }

  .user-nickname {
    font-size: 1rem;
  }

  .coupon-list-container {
    height: 350px;
  }

  .loading-container {
    height: 350px;
  }

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
  .profile-card {
    min-height: 400px;
  }

  .user-profile-card {
    padding: 12px;
    gap: 10px;
  }

  .user-subtitle {
    display: none;
  }

  .coupon-list-container {
    height: 300px;
  }

  .loading-container {
    height: 300px;
  }

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

/* 兌換動畫樣式 */
.redeem-animation-overlay {
  position: fixed;
  z-index: 9999;
  pointer-events: none;
  animation: fadeIn 0.3s ease-in-out;
}

.redeem-animation-gif {
  max-width: 200px;
  max-height: 200px;
  width: auto;
  height: auto;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.7);
  filter: drop-shadow(0 0 20px rgba(231, 40, 87, 0.5));
  animation: scaleIn 0.3s ease-out, fadeOut 0.5s ease-in-out 2.5s forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes scaleIn {
  from {
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.9);
  }
}

/* 手機版動畫調整 */
@media (max-width: 768px) {
  .redeem-animation-gif {
    max-width: 180px;
    max-height: 180px;
  }
}

@media (max-width: 480px) {
  .redeem-animation-gif {
    max-width: 150px;
    max-height: 150px;
  }
}
</style>
