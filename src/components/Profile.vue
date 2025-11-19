<template>
  <v-card ref="profileCardRef" rounded="xl" class="d-flex flex-column profile-card">
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
      <NicknameInput
        v-if="!currentNickname"
        v-model="inputNickname"
        :saved-nicknames="savedNicknames"
        @submit="handleSaveNickname"
        @select="handleSelectSavedNickname"
        @remove="removeSavedNickname"
        @open-dialog="nicknameDialog = true"
      />

      <!-- 狀態二：已設定暱稱 -->
      <div v-else class="coupon-display-area">
        <UserProfile
          :current-nickname="currentNickname"
          :current-avatar-url="currentAvatarUrl"
          @open-avatar-dialog="avatarDialog = true"
          @open-nickname-dialog="nicknameDialog = true"
          @logout="exitNicknameMode"
        />

        <CouponList
          :loading="loading"
          :redeem-codes="redeemCodes"
          @claim="handleClaim"
          @open-official="openOfficialRedeemPage"
          @show-image="showImagePreview"
        />
      </div>
    </v-card-text>

    <!-- 兌換動畫 -->
    <RedeemAnimation :animation="redeemAnimation" />

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
      @select="handleSelectNicknameDialog"
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
import { ref, computed, onMounted } from "vue";
import { useSettingsStore } from "@/stores/settings";
import { useAppStore } from "@/stores/app";
import AvatarDialog from "./AvatarDialog.vue";
import NicknameDialog from "./NicknameDialog.vue";

// Composables
import { useNickname } from "@/composables/useNickname";
import { useAvatar } from "@/composables/useAvatar";
import { useRedeemCodes } from "@/composables/useRedeemCodes";

// Components
import NicknameInput from "./profile/NicknameInput.vue";
import UserProfile from "./profile/UserProfile.vue";
import CouponList from "./profile/CouponList.vue";
import RedeemAnimation from "./profile/RedeemAnimation.vue";

// --- Stores ---
const settingsStore = useSettingsStore();
const appStore = useAppStore();

// --- Computed ---
const t = computed(() => settingsStore.t);

// --- Composables Setup ---
const {
  inputNickname,
  currentNickname,
  savedNicknames,
  loadSavedNicknames,
  saveAndSetNickname,
  removeSavedNickname,
  exitNicknameMode: originalExitNicknameMode,
  saveNicknameToList
} = useNickname();

const {
  currentAvatar,
  avatarDialog,
  currentAvatarUrl,
  updateAvatar,
  initAvatar
} = useAvatar();

const {
  loading,
  redeemCodes,
  redeemAnimation,
  loadRedeemCodes,
  executeClaim,
  openOfficialRedeemPage
} = useRedeemCodes(currentNickname, t);

// --- Local State ---
const nicknameDialog = ref(false);
const showHelpDialog = ref(false);
const profileCardRef = ref(null);

// 圖片預覽相關
const imagePreviewDialog = ref(false);
const selectedCouponImage = ref(null);

// --- Methods ---

// Wrapper for saveAndSetNickname to trigger loadRedeemCodes
const handleSaveNickname = () => {
  saveAndSetNickname(() => {
    loadRedeemCodes();
  });
};

// Wrapper for selecting saved nickname
const handleSelectSavedNickname = (nickname) => {
  inputNickname.value = nickname;
  handleSaveNickname();
};

// Wrapper for exitNicknameMode to clear redeem codes
const exitNicknameMode = () => {
  originalExitNicknameMode();
  redeemCodes.value = [];
};

// Wrapper for NicknameDialog selection
const handleSelectNicknameDialog = (nickname) => {
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

const enterNewNickname = () => {
  exitNicknameMode();
  nicknameDialog.value = false;
};

const handleClaim = (coupon, index, event) => {
  executeClaim(coupon, index, event, profileCardRef.value);
};

// Image Preview Methods
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

// --- Lifecycle ---
onMounted(() => {
  loadSavedNicknames();
  initAvatar();

  // 載入保存的暱稱
  const savedNickname = localStorage.getItem("nickname");
  if (savedNickname) {
    currentNickname.value = savedNickname;
    loadRedeemCodes();
  }

  // 確保 appStore 已經初始化
  if (!appStore.hasData && !appStore.loading) {
    appStore.fetchAllData().catch((error) => {
      console.error("初始化載入失敗:", error);
    });
  }
});
</script>

<style scoped>
/* Profile 卡片樣式 */
.profile-card {
  /* 關鍵點 1: 讓自己成為子絕對定位元素的基準 */
  position: relative; 
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

@media (max-width: 768px) {
  .profile-card {
    min-height: 450px;
  }
}

@media (max-width: 480px) {
  .profile-card {
    min-height: 400px;
  }
}
</style>
