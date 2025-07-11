<template>
  <v-container class="feedback-page">
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">
        <!-- 頁面標題 -->
        <div class="page-header mb-6">
          <h1 class="page-title">{{ t('feedback.title') }}</h1>
          <p class="page-subtitle">{{ t('feedback.description') }}</p>
        </div>

        <!-- 主要表單卡片 -->
        <v-card rounded="xl" class="feedback-card">
          <v-card-title class="feedback-card-title">
            <v-icon class="mr-3" color="primary" size="24">mdi-message-heart-outline</v-icon>
            {{ t('feedback.cardTitle') }}
          </v-card-title>
          
          <v-form ref="form" v-model="isFormValid" @submit.prevent="submitFeedback">
            <v-card-text class="pa-6">
              <p class="feedback-description mb-6">
                {{ t('feedback.formDescription') }}
              </p>

              <!-- 問題類型選擇 -->
              <div class="form-section mb-6">
                <div class="form-label mb-3">{{ t('feedback.form.issueType') }}</div>
                <v-select
                  v-model="formData.issueType"
                  :items="issueTypes"
                  :placeholder="t('feedback.form.issueTypePlaceholder')"
                  variant="outlined"
                  :rules="[rules.required]"
                  required
                  class="custom-select"
                  hide-details="auto"
                >
                  <template v-slot:prepend-inner>
                    <v-icon color="primary" size="20">mdi-tag-outline</v-icon>
                  </template>
                </v-select>
              </div>

              <!-- 詳細描述 -->
              <div class="form-section mb-6">
                <div class="form-label mb-3">{{ t('feedback.form.description') }}</div>
                <v-textarea
                  v-model="formData.description"
                  :placeholder="t('feedback.form.descriptionPlaceholder')"
                  variant="outlined"
                  rows="5"
                  counter="500"
                  :rules="[rules.required, rules.maxLength(500)]"
                  required
                  class="custom-textarea"
                  hide-details="auto"
                >
                  <template v-slot:prepend-inner>
                    <v-icon color="primary" size="20">mdi-text-box-outline</v-icon>
                  </template>
                </v-textarea>
              </div>
              
              <!-- 回報者暱稱 -->
              <div class="form-section mb-4">
                <div class="form-label mb-3">{{ t('feedback.form.nickname') }}</div>
                <v-text-field
                  v-model="formData.reporter"
                  :placeholder="t('feedback.form.nicknamePlaceholder')"
                  variant="outlined"
                  counter="30"
                  :rules="[rules.maxLength(30)]"
                  class="custom-textfield"
                  hide-details="auto"
                >
                  <template v-slot:prepend-inner>
                    <v-icon color="primary" size="20">mdi-account-outline</v-icon>
                  </template>
                </v-text-field>
              </div>

              <!-- 系統資訊提示 -->
              <div class="system-info-card mb-4">
                <div class="system-info-header">
                  <v-icon size="18" color="primary">mdi-information-outline</v-icon>
                  <span class="system-info-title">{{ t('feedback.systemInfo.title') }}</span>
                </div>
                <div class="system-info-content">
                  {{ t('feedback.systemInfo.description') }}
                </div>
              </div>

              <!-- 成功或錯誤訊息 -->
              <v-alert
                v-if="submitStatus.message"
                :type="submitStatus.type"
                variant="tonal"
                rounded="lg"
                class="custom-alert"
                :icon="submitStatus.type === 'success' ? 'mdi-check-circle' : 'mdi-alert-circle'"
              >
                <div class="alert-content">
                  {{ submitStatus.message }}
                </div>
                <template v-slot:actions>
                  <v-btn @click="showSuccessMessage = false" icon="mdi-close" variant="text" aria-label="關閉訊息"></v-btn>
                </template>
              </v-alert>
            </v-card-text>

            <!-- 操作按鈕區域 -->
            <v-card-actions class="pa-6 pt-0">
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                variant="flat"
                size="large"
                rounded="lg"
                @click="submitFeedback"
                :loading="isSubmitting"
                :disabled="!isFormValid"
                class="submit-btn"
              >
                <v-icon class="mr-2">mdi-send</v-icon>
                {{ t('feedback.form.submit') }}
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>

        <!-- 額外資訊卡片 -->
        <v-card rounded="xl" class="info-card mt-4">
          <v-card-text class="pa-6">
            <div class="info-content">
              <v-icon color="primary" size="20" class="mr-3">mdi-shield-check</v-icon>
              <div class="info-text">
                <div class="info-title">{{ t('feedback.privacy.title') }}</div>
                <div class="info-description">
                  {{ t('feedback.privacy.description') }}
                </div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { useSettingsStore } from '@/stores/settings'

export default {
  name: "FeedbackPage",
  data() {
    return {
      isFormValid: false,
      isSubmitting: false,
      
      // 表單資料
      formData: {
        issueType: null,
        description: '',
        reporter: '',
      },

      // 自動獲取的系統資訊
      systemInfo: {
        deviceType: 'Unknown',
        os: 'Unknown',
        browser: 'Unknown',
      },
      
      // 提交狀態
      submitStatus: {
        type: 'success', // 'success' or 'error'
        message: ''
      },
      
      // Vuetify 的驗證規則
      rules: {
        required: value => !!value || this.t('feedback.validation.required'),
        maxLength: (limit) => value => (value || '').length <= limit || this.t('feedback.validation.maxLength', { limit }),
      }
    };
  },
  
  computed: {
    // 設定 Store
    settingsStore() {
      return useSettingsStore();
    },
    
    // 多語言文字
    t() {
      return (key, params) => this.$t(key, this.settingsStore.selectedLanguage, params);
    },
    
    // 問題類型選項
    issueTypes() {
      return [
        { title: this.t('feedback.issueTypes.bug'), value: this.t('feedback.issueTypes.bug') },
        { title: this.t('feedback.issueTypes.content'), value: this.t('feedback.issueTypes.content') },
        { title: this.t('feedback.issueTypes.suggestion'), value: this.t('feedback.issueTypes.suggestion') },
        { title: this.t('feedback.issueTypes.other'), value: this.t('feedback.issueTypes.other') }
      ];
    }
  },
  
  mounted() {
    // 元件掛載時，自動獲取一次系統資訊
    this.systemInfo = this.getSystemInfo();
  },

  methods: {
    /**
     * 獲取並解析用戶的設備和系統資訊
     */
    getSystemInfo() {
      if (typeof navigator === 'undefined') {
        return { os: 'N/A', browser: 'N/A', deviceType: 'N/A' };
      }
      
      const ua = navigator.userAgent;
      let os = "Unknown OS";
      let browser = "Unknown Browser";
      let deviceType = "Desktop";

      if (/Windows/i.test(ua)) os = "Windows";
      else if (/Macintosh|Mac OS X/i.test(ua)) os = "macOS";
      else if (/iPhone|iPad|iPod/i.test(ua)) os = "iOS";
      else if (/Android/i.test(ua)) os = "Android";
      else if (/Linux/i.test(ua)) os = "Linux";

      if (/Edg/i.test(ua)) browser = "Edge";
      else if (/Chrome/i.test(ua) && !/Chromium/i.test(ua)) browser = "Chrome";
      else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) browser = "Safari";
      else if (/Firefox/i.test(ua)) browser = "Firefox";

      if (/Mobi/i.test(ua)) deviceType = "Mobile";

      return { os, browser, deviceType };
    },
    
    /**
     * 提交表單數據到 Google Form
     */
    async submitFeedback() {
      // 觸發 Vuetify 的驗證
      const { valid } = await this.$refs.form.validate();
      if (!valid) {
        this.submitStatus = { type: 'error', message: this.t('feedback.errors.validation') };
        return;
      }
      
      this.isSubmitting = true;
      this.submitStatus.message = '';

      // 組合設備和系統資訊
      const deviceInfo = `${this.systemInfo.deviceType} / ${this.systemInfo.os}`;
      const osInfo = this.systemInfo.browser;

      // 建立 FormData 物件來發送數據
      const formData = new FormData();
      formData.append('entry.427537308', this.formData.issueType);
      formData.append('entry.811564151', this.formData.description);
      formData.append('entry.616391368', deviceInfo);
      formData.append('entry.1141091423', osInfo);
      formData.append('entry.431317857', this.formData.reporter || '匿名');

      // Google 表單 action URL
      const formActionUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSe-IAxGn4zvUf4Rsdh9QXsAT7WtiX0HrZeQ86JhaIuUXQeKMA/formResponse';

      try {
        await fetch(formActionUrl, {
          method: 'POST',
          body: formData,
          mode: 'no-cors' // 以 no-cors 模式發送，忽略跨域錯誤
        });
        
        // 顯示成功訊息
        this.submitStatus = { 
          type: 'success', 
          message: this.t('feedback.success') 
        };
        
        // 重置表單
        this.$refs.form.reset();
        
      } catch (error) {
        console.error("回饋發送失敗:", error);
        this.submitStatus = { 
          type: 'error', 
          message: this.t('feedback.error') 
        };
      } finally {
        this.isSubmitting = false;
      }
    },
  },
};
</script>

<style scoped>
.feedback-page {
  min-height: calc(100vh - 64px);
  padding-top: 32px;
  padding-bottom: 32px;
}

/* 頁面標題 */
.page-header {
  text-align: center;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #e72857;
  margin-bottom: 8px;
}

.page-subtitle {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
}

/* 主要卡片 */
.feedback-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%);
  border: 1px solid rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(10px);
}

.feedback-card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  padding: 24px 24px 0 24px;
}

.feedback-description {
  font-size: 0.95rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.8);
}

/* 表單區塊 */
.form-section {
  position: relative;
}

.form-label {
  font-size: 1rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
}

.optional-label {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 400;
}

/* 自定義表單元件 */
.custom-select :deep(.v-field) {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.custom-select :deep(.v-field:hover) {
  border-color: rgba(231, 40, 87, 0.5);
}

.custom-select :deep(.v-field--focused) {
  border-color: #e72857;
  box-shadow: 0 0 0 2px rgba(231, 40, 87, 0.2);
}

.custom-textarea :deep(.v-field) {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.custom-textarea :deep(.v-field:hover) {
  border-color: rgba(231, 40, 87, 0.5);
}

.custom-textarea :deep(.v-field--focused) {
  border-color: #e72857;
  box-shadow: 0 0 0 2px rgba(231, 40, 87, 0.2);
}

.custom-textfield :deep(.v-field) {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.custom-textfield :deep(.v-field:hover) {
  border-color: rgba(231, 40, 87, 0.5);
}

.custom-textfield :deep(.v-field--focused) {
  border-color: #e72857;
  box-shadow: 0 0 0 2px rgba(231, 40, 87, 0.2);
}

/* 系統資訊卡片 */
.system-info-card {
  background: rgba(231, 40, 87, 0.1);
  border: 1px solid rgba(231, 40, 87, 0.2);
  border-radius: 12px;
  padding: 16px;
}

.system-info-header {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.system-info-title {
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  margin-left: 8px;
}

.system-info-content {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.5;
}

.system-info-details {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

/* 提交按鈕 */
.submit-btn {
  min-width: 140px;
  height: 48px;
  font-weight: 600;
  text-transform: none;
  letter-spacing: 0.5px;
}

/* 警告訊息 */
.custom-alert {
  border-radius: 12px;
}

.alert-content {
  font-weight: 500;
}

/* 資訊卡片 */
.info-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(5px);
}

.info-content {
  display: flex;
  align-items: flex-start;
}

.info-text {
  flex: 1;
}

.info-title {
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 4px;
}

.info-description {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.5;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .page-title {
    font-size: 1.75rem;
  }
  
  .feedback-card-title {
    padding: 20px 20px 0 20px;
    font-size: 1.1rem;
  }
  
  .feedback-card :deep(.v-card-text) {
    padding: 20px !important;
  }
  
  .feedback-card :deep(.v-card-actions) {
    padding: 20px !important;
    padding-top: 0 !important;
  }
  
  .system-info-details {
    justify-content: flex-start;
  }
}

@media (max-width: 480px) {
  .feedback-page {
    padding-top: 16px;
  }
  
  .page-title {
    font-size: 1.5rem;
  }
  
  .submit-btn {
    width: 100%;
  }
}
</style>