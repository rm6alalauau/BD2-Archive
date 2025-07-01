<template>
  <v-row justify="end">
    <v-col>
      <v-card rounded="xl" class="profile-card">
        <!-- 標題 -->
        <v-card-title
          class="headline"
          style="font-size: 1rem; font-weight: bold; color: #e72857;"
        >
          兌換碼
        </v-card-title>

        <!-- 卡片內容 -->
        <v-card-text class="profile-card-content">
          <!-- 暱稱輸入表單 -->
          <v-form
            ref="form"
            v-model="valid"
            v-if="!isSubmitted"
            variant="outlined"
            @submit.prevent="submitNickname"
          >
            <v-text-field
              v-model="nickname"
              :rules="[(v) => !!v || '請輸入暱稱']"
              label="遊戲暱稱"
              required
              outlined
              placeholder="請輸入您的遊戲暱稱"
              @keydown.enter="submitNickname"
            ></v-text-field>
            <v-btn @click="submitNickname" variant="outlined" color="primary">
              查詢兌換碼
            </v-btn>
          </v-form>

          <!-- 兌換碼展示 -->
          <div v-else class="coupon-display-area">
            <!-- 用戶資訊卡片 -->
            <div class="user-profile-card">
              <v-avatar 
                size="56" 
                @click="openAvatarDialog" 
                class="user-avatar"
              >
                <img 
                  :src="currentAvatarUrl" 
                  :alt="`avatar-${selectedAvatarId}`"
                  style="width: 100%; height: 100%; object-fit: cover;"
                />
              </v-avatar>
              
              <div class="user-info">
                <div class="user-nickname">{{ nickname }}</div>
                <div class="user-subtitle">點擊頭像可更換</div>
              </div>
              
              <v-btn
                @click="clearData"
                icon="mdi-logout"
                size="small"
                variant="text"
                class="logout-btn"
                title="重新輸入暱稱"
              ></v-btn>
            </div>
            
            <!-- API 狀態提示 -->
            <div v-if="showApiStatus" class="api-status-card">
              <div class="api-status-header">
                <v-icon :color="apiStatusColor" size="16">{{ apiStatusIcon }}</v-icon>
                <span class="api-status-text">{{ apiStatusText }}</span>
                <v-btn
                  v-if="hasApiError"
                  @click="retryLoadData"
                  :loading="retrying"
                  size="x-small"
                  variant="text"
                  color="primary"
                >
                  重試
                </v-btn>
              </div>
              <div v-if="hasApiError && appStore.error" class="api-error-detail">
                技術細節：{{ appStore.error }}
              </div>
            </div>
            
            <!-- 兌換碼列表 -->
            <div v-if="loading" class="loading-container">
              <v-progress-circular indeterminate color="primary"></v-progress-circular>
              <div class="mt-2">載入兌換碼中...</div>
              <div class="text-caption text-grey mt-1">正在等待API載入完成</div>
              <v-btn 
                @click="retryLoadCouponCodes"
                color="primary"
                variant="outlined"
                size="small"
                class="mt-3"
              >
                重新載入
              </v-btn>
            </div>
            
            <div v-else-if="couponCodes.length > 0">
              <div class="coupon-list-container">
                <div 
                  v-for="(coupon, index) in couponCodes"
                  :key="index"
                  class="coupon-item"
                  :class="{ 'coupon-item--claimed': coupon.claimed }"
                >
                  <!-- 主要內容行 -->
                  <div class="coupon-main-row">
                    <!-- 狀態圖標 -->
                    <v-icon 
                      :color="coupon.claimed ? 'success' : 'grey-lighten-1'"
                      :icon="coupon.claimed ? 'mdi-check-circle' : 'mdi-circle-outline'"
                      size="20"
                      class="coupon-status-icon"
                    ></v-icon>
                    
                    <!-- 兌換碼和狀態標籤 -->
                    <div class="coupon-code-section">
                      <div class="coupon-code-row">
                        <span class="coupon-code">{{ coupon.code }}</span>
                        <v-chip
                          v-if="coupon.status"
                          size="x-small"
                          :color="getStatusColor(coupon.status)"
                          variant="flat"
                          class="coupon-status-chip"
                        >
                          {{ coupon.status }}
                        </v-chip>
                      </div>
                      
                      <!-- 獎勵描述 -->
                      <div v-if="coupon.description" class="coupon-description">
                        {{ coupon.description }}
                      </div>
                    </div>
                    
                    <!-- 兌換按鈕或重試按鈕 -->
                    <v-btn
                      v-if="isApiErrorCode(coupon.code)"
                      :loading="retrying"
                      @click="retryLoadData"
                      color="warning"
                      size="small"
                      variant="flat"
                      class="coupon-action-btn"
                    >
                      重新載入
                    </v-btn>
                    <v-btn
                      v-else
                      :loading="coupon.claiming"
                      :disabled="coupon.claimed"
                      @click="executeClaim(coupon, index)"
                      :color="getButtonColor(coupon)"
                      size="small"
                      variant="flat"
                      class="coupon-action-btn"
                    >
                      {{ getButtonText(coupon) }}
                    </v-btn>
                  </div>
                  
                  <!-- 狀態訊息行（僅在有訊息時顯示）-->
                  <div 
                    v-if="coupon.statusMessage || coupon.errorMessage" 
                    class="coupon-message-row"
                  >
                    <div class="coupon-message-spacer"></div>
                    <div class="coupon-message-content">
                      <!-- 成功訊息 -->
                      <div 
                        v-if="coupon.statusMessage" 
                        class="coupon-message coupon-message--success"
                      >
                        <v-icon size="14" color="success">mdi-check-circle</v-icon>
                        <span>{{ coupon.statusMessage }}</span>
                      </div>
                      
                      <!-- 錯誤訊息 -->
                      <div 
                        v-if="coupon.errorMessage" 
                        class="coupon-message coupon-message--error"
                      >
                        <v-icon size="14" color="error">mdi-alert-circle</v-icon>
                        <span>{{ coupon.errorMessage }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- 兌換碼重新載入區域（給已經提交暱稱的用戶） -->
              <div v-if="isSubmitted" class="mt-4 text-center">
                <v-btn
                  @click="retryLoadCouponCodes"
                  :loading="retrying"
                  color="primary"
                  variant="outlined"
                  prepend-icon="mdi-refresh"
                  size="small"
                >
                  重新載入兌換碼
                </v-btn>
                <div class="text-caption text-grey mt-1">
                  如果兌換碼未正確載入，點擊此處重新載入
                </div>
                
                <!-- 幫助提示 -->
                <v-alert
                  v-if="hasApiError || couponCodes.length === 0"
                  color="info"
                  variant="tonal"
                  density="compact"
                  class="mt-3 text-left"
                  icon="mdi-lightbulb-outline"
                >
                  <div class="text-body-2">
                    <strong>載入問題解決方案：</strong>
                  </div>
                  <div class="text-caption mt-1">
                    • 如果提交暱稱時API尚未載入完成，可能導致兌換碼無法正確顯示<br>
                    • 點擊上方「重新載入兌換碼」<br>
                    • 或者點擊「退出」重新輸入暱稱
                  </div>
                </v-alert>
              </div>
            </div>
          </div>

          <!-- 網路狀態指示器 -->
          <v-alert
            v-if="networkStatus && networkStatus !== 'online'"
            :color="networkStatus === 'checking' ? 'info' : 'warning'"
            icon="mdi-wifi"
            dense
            class="mb-4"
          >
            {{ networkStatusText }}
          </v-alert>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>

  <!-- 頭像選擇對話框 -->
  <v-dialog v-model="avatarDialog" max-width="600px">
    <v-card>
      <v-card-title class="headline">選擇頭像 ({{ availableAvatars.length }} 個可選)</v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col 
              v-for="avatarId in availableAvatars" 
              :key="avatarId" 
              cols="2" 
              class="pa-1"
            >
              <v-avatar 
                size="60" 
                @click="selectAvatar(avatarId)"
                :class="selectedAvatarId === avatarId ? 'selected-avatar' : ''"
                style="cursor: pointer; border: 2px solid transparent;"
              >
                <img 
                  :src="getAvatarUrl(avatarId)" 
                  :alt="`avatar-${avatarId}`"
                  style="width: 100%; height: 100%; object-fit: cover;"
                />
              </v-avatar>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="avatarDialog = false">確定</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  
</template>

<script>
import { useAppStore } from '@/stores/app'

export default {
  data() {
    return {
      valid: false,
      nickname: "",
      isSubmitted: false,
      loading: false,
      retrying: false,
      couponCodes: [],
      apiEndpoint: 'https://bd2redeem.zzz-archive-back-end.workers.dev/',
      appId: 'bd2-live',
      currentAvatarUrl: '',
      selectedAvatarId: null,
      avatarDialog: false,
      // 可用的頭像ID列表（排除不存在的 23, 24, 29, 30）
      availableAvatars: [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
        11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        21, 22, 25, 26, 27, 28, 31, 32, 33, 34,
        35, 36, 37, 38, 39, 40, 41, 42, 43, 44,
        45, 46, 47, 48
      ],
              // 頭像格式映射（JPG格式的頭像ID）
        jpgAvatars: [39, 40, 41, 42, 43, 44, 45, 46, 47, 48],
        // 網路狀態監控
        networkStatus: null,
    };
  },
  
  computed: {
    // API 狀態監控
    appStore() {
      return useAppStore();
    },
    
    hasApiError() {
      return this.couponCodes.some(coupon => this.isApiErrorCode(coupon.code)) || this.appStore.error;
    },
    
    showApiStatus() {
      return this.isSubmitted && (this.hasApiError || this.appStore.loading);
    },
    
    apiStatusColor() {
      if (this.appStore.loading || this.retrying) return 'warning';
      if (this.hasApiError) return 'error';
      return 'success';
    },
    
    apiStatusIcon() {
      if (this.appStore.loading || this.retrying) return 'mdi-loading';
      if (this.hasApiError) return 'mdi-alert-circle';
      return 'mdi-check-circle';
    },
    
    apiStatusText() {
      if (this.retrying) return '重新載入中...';
      if (this.appStore.loading) return 'API 載入中...';
      if (this.hasApiError) return 'API 連線異常';
      return 'API 連線正常';
    },
    
    networkStatusText() {
      switch (this.networkStatus) {
        case 'checking': return '正在檢測兌換服務連接...';
        case 'slow': return '兌換服務回應較慢，請稍候';
        case 'unreachable': return '無法連接兌換服務，請檢查網路';
        case 'cors-error': return 'iOS Safari 兼容性問題';
        default: return '';
      }
    }
  },
  
  created() {
    try {
      // 從 localStorage 中加載暱稱
      this.nickname = localStorage.getItem("nickname") || "";
      
      // 從 localStorage 中加載頭像ID，如果沒有則隨機生成
      const savedAvatarId = localStorage.getItem("selectedAvatarId");
      if (savedAvatarId) {
        this.selectedAvatarId = parseInt(savedAvatarId);
      } else {
        //const randomIndex = Math.floor(Math.random() * this.availableAvatars.length);
        this.selectedAvatarId = this.availableAvatars[31];
        localStorage.setItem("selectedAvatarId", this.selectedAvatarId.toString());
      }
      
      this.updateCurrentAvatarUrl();
      
      if (this.nickname) {
      this.isSubmitted = true;
        // 不在這裡立即調用 fetchCouponCodes，而是等待 API 載入完成
      }
    } catch (error) {
      console.error("Error in created hook:", error);
      // 如果有錯誤，重置狀態
      this.nickname = "";
      this.isSubmitted = false;
      localStorage.removeItem("nickname");
    }
  },
  mounted() {
    console.log("Component mounted, isSubmitted:", this.isSubmitted, "nickname:", this.nickname);
    // 在 mounted 階段監聽 store 狀態
    this.watchStoreData();
  },
  methods: {
    // 等待API載入完成並載入數據
    async waitForApiAndLoadData() {
      const appStore = useAppStore();
      const maxWaitTime = 15000; // 最多等待15秒
      const checkInterval = 500; // 每500ms檢查一次
      let waitedTime = 0;
      
      console.log("開始等待API載入完成...");
      
      return new Promise((resolve) => {
        const checkData = () => {
          waitedTime += checkInterval;
          
          console.log(`等待API載入: ${waitedTime}ms / ${maxWaitTime}ms (loading: ${appStore.loading}, hasData: ${appStore.hasData})`);
          
          // 檢查是否載入完成
          if (!appStore.loading) {
            console.log("API載入完成，載入兌換碼...");
            this.loading = false;
            this.loadCouponCodesFromStore();
            resolve();
            return;
          }
          
          // 檢查是否超時
          if (waitedTime >= maxWaitTime) {
            console.warn("API載入超時，強制載入兌換碼...");
            this.loading = false;
            this.loadCouponCodesFromStore();
            resolve();
            return;
          }
          
          // 繼續等待
          setTimeout(checkData, checkInterval);
        };
        
        // 開始檢查
        setTimeout(checkData, checkInterval);
      });
    },
    
    // 監聽 store 數據變化（保留給 mounted 使用）
    watchStoreData() {
      const appStore = useAppStore();
      console.log("watchStoreData called, hasData:", appStore.hasData, "loading:", appStore.loading, "isSubmitted:", this.isSubmitted);
      
      // 如果已經提交暱稱且有數據，直接載入
      if (this.isSubmitted && appStore.hasData) {
        console.log("Store has data, loading coupon codes...");
        this.loadCouponCodesFromStore();
      }
    },
    
    // 從 store 載入兌換碼數據
    loadCouponCodesFromStore() {
      try {
        console.log("Loading coupon codes from store...");
        const appStore = useAppStore();
        const redeemData = appStore.redeemCodes;
        
        console.log("Store redeem data:", redeemData);
        
        if (redeemData && redeemData.length > 0) {
          // 檢查是否有 API 錯誤
          const hasApiError = redeemData.some(item => item.code === 'API_ERROR');
          
          if (hasApiError) {
            console.log("Detected API error in store data");
            this.couponCodes = [
              { 
                code: 'API_ERROR', 
                description: '暫時無法載入兌換碼資料', 
                status: 'API連線中斷', 
                claimed: false, 
                claiming: false, 
                statusMessage: null, 
                statusMessageType: null, 
                errorMessage: '請重新整理頁面或稍後再試' 
              }
            ];
            
            // 顯示更詳細的錯誤信息
            if (appStore.error) {
              this.couponCodes[0].errorMessage = `連線錯誤: ${appStore.error}`;
            }
            
            return; // 提早返回，避免繼續處理
          }
          
          // 轉換正常數據格式
          this.couponCodes = redeemData.map(item => ({
            code: item.code || '未知代碼',
            description: item.reward || '未知獎勵',
            status: item.status || '未知狀態',
            claimed: false,
            claiming: false,
            statusMessage: null,
            statusMessageType: null,
            errorMessage: null
          }));
          
          // 載入已兌換狀態
          this.loadClaimedStatus();
          console.log("Coupon codes loaded successfully");
          
          // 如果是重新載入成功，顯示簡短提示
          if (this.retrying) {
            this.$nextTick(() => {
              // 可以在這裡添加成功提示，但不要太打擾用戶
              console.log("兌換碼重新載入成功！");
            });
          }
        } else {
          console.log("No redeem data available");
          
          // 檢查是否有API錯誤
          if (appStore.error) {
            this.couponCodes = [
              { 
                code: 'LOAD_ERROR', 
                description: '兌換碼載入失敗', 
                status: '載入錯誤', 
                claimed: false, 
                claiming: false, 
                statusMessage: null, 
                statusMessageType: null, 
                errorMessage: `${appStore.error} - 請重新整理頁面` 
              }
            ];
          } else {
            // 單純沒有數據
            this.couponCodes = [
              { 
                code: 'NO_DATA', 
                description: '目前沒有可用的兌換碼', 
                status: '暫無資料', 
                claimed: false, 
                claiming: false, 
                statusMessage: null, 
                statusMessageType: null, 
                errorMessage: null 
              }
            ];
          }
        }
      } catch (error) {
        console.error("Error loading coupon codes from store:", error);
        this.couponCodes = [
          { 
            code: 'SYSTEM_ERROR', 
            description: '系統載入兌換碼時發生錯誤', 
            status: '系統錯誤', 
            claimed: false, 
            claiming: false, 
            statusMessage: null, 
            statusMessageType: null, 
            errorMessage: '請重新整理頁面或聯絡管理員' 
          }
        ];
      }
    },

    // API 客戶端方法 - iOS Safari 兼容版本
    async claimCoupon(userId = '', code = '') {
      const maxRetries = 3;
      const baseDelay = 1000;
      let lastError;
      
      // 檢測 iOS 設備
      const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                         (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          console.log(`兌換嘗試 ${attempt}/${maxRetries} - 代碼: ${code} (iOS: ${isIOSDevice})`);
          
          // 使用最簡單的請求配置避免觸發 OPTIONS 預檢
          const requestBody = JSON.stringify({
            appId: this.appId,
            userId,
            code,
          });
          
          // 設置較短的超時時間
          const timeoutMs = isIOSDevice ? 8000 : 15000;
          const controller = new AbortController();
          const timeoutId = setTimeout(() => {
            console.log(`兌換請求超時 ${timeoutMs}ms`);
            controller.abort();
          }, timeoutMs);
          
          // iOS Safari 優化：使用最小化的 CORS 配置
          const response = await fetch(this.apiEndpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: requestBody,
            signal: controller.signal,
            // iOS Safari 特定配置
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'omit', // 重要：iOS Safari 對 credentials 敏感
          });
          
          clearTimeout(timeoutId);
          
          if (response.ok) {
            console.log(`兌換成功，嘗試次數: ${attempt}`);
            return await response.json();
          }

          // 處理 API 錯誤回應
          let errorData;
          try {
            errorData = await response.json();
          } catch {
            errorData = { 
              message: `HTTP ${response.status}: ${response.statusText}`,
              errorCode: `HTTP_${response.status}`
            };
          }
          
          console.warn('API 錯誤回應:', errorData);
          
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
          console.warn(`兌換嘗試 ${attempt} 失敗:`, error.message);
          
          // 最後一次嘗試失敗
          if (attempt === maxRetries) {
            throw error;
          }
          
          // 判斷是否值得重試
          const isRetryableError = 
            error.name === 'AbortError' || // 超時
            error.message.includes('Failed to fetch') || // 網路問題
            error.message.includes('NetworkError') || // 網路問題
            error.message.includes('伺服器錯誤') || // 5xx 錯誤
            error.message.includes('請求過於頻繁') || // 429 錯誤
            error.message.includes('Load failed'); // 載入失敗
          
          if (!isRetryableError) {
            console.log('不可重試的錯誤，放棄:', error.message);
            throw error;
          }
          
          // 計算重試延遲
          const delay = baseDelay * Math.pow(2, attempt - 1);
          console.log(`等待 ${delay}ms 後重試...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
      
      throw lastError;
    },

    // 保存兌換狀態到 localStorage
    saveClaimedStatus() {
      const claimedCodes = this.couponCodes
        .filter(coupon => coupon.claimed)
        .map(coupon => coupon.code);
      localStorage.setItem(`claimedCodes_${this.nickname}`, JSON.stringify(claimedCodes));
      console.log(`Saved claimed status for ${this.nickname}:`, claimedCodes);
    },

    // 從 localStorage 載入兌換狀態
    loadClaimedStatus() {
      try {
        if (!this.nickname) {
          console.log("No nickname, skipping load claimed status");
          return;
        }
        
        const claimedCodesStr = localStorage.getItem(`claimedCodes_${this.nickname}`);
        const claimedCodes = claimedCodesStr ? JSON.parse(claimedCodesStr) : [];
        
        if (!Array.isArray(claimedCodes)) {
          console.warn("Invalid claimed codes data, resetting");
          return;
        }
        
        if (!this.couponCodes || !Array.isArray(this.couponCodes)) {
          console.warn("Invalid coupon codes array");
          return;
        }
        
        // 獲取當前 API 中的所有兌換碼
        const currentCodes = this.couponCodes.map(coupon => coupon.code);
        
        // 載入兌換狀態
        this.couponCodes.forEach(coupon => {
          if (coupon && coupon.code) {
            coupon.claimed = claimedCodes.includes(coupon.code);
          }
        });
        
        // 清理已經不存在的兌換碼記錄（可選的優化）
        const validClaimedCodes = claimedCodes.filter(code => currentCodes.includes(code));
        if (validClaimedCodes.length !== claimedCodes.length) {
          console.log(`Cleaning up obsolete claimed codes. Before: ${claimedCodes.length}, After: ${validClaimedCodes.length}`);
          localStorage.setItem(`claimedCodes_${this.nickname}`, JSON.stringify(validClaimedCodes));
        }
        
        console.log(`Loaded claimed status for ${this.nickname}:`, claimedCodes, "total:", claimedCodes.length, "codes");
      } catch (error) {
        console.error("Error loading claimed status:", error);
        // 如果載入失敗，清除可能損壞的數據
        try {
          localStorage.removeItem(`claimedCodes_${this.nickname}`);
        } catch (cleanupError) {
          console.error("Error cleaning up claimed codes:", cleanupError);
        }
      }
    },

    // 獲取按鈕顏色
    getButtonColor(coupon) {
      if (coupon.claimed) return 'success';
      if (coupon.errorMessage) return 'error';
      return 'primary';
    },

    // 獲取按鈕文字
    getButtonText(coupon) {
      if (coupon.claimed) return '已兌換';
      if (coupon.errorMessage) return '重試';
      return '兌換';
    },

    // 獲取狀態顏色
    getStatusColor(status) {
      const statusColors = {
        '限時可用': 'warning',
        '目前可用': 'success',
        '永久': 'info',
        '已過期': 'error'
      };
      return statusColors[status] || 'default';
    },

    async submitNickname() {
      if (this.$refs.form.validate()) {
        const appStore = useAppStore();
        
        // 儲存暱稱到 localStorage
        localStorage.setItem("nickname", this.nickname);
        
        // 檢查API狀態
        if (appStore.loading) {
          // API還在載入中，顯示等待狀態
          this.isSubmitted = true;
          this.loading = true;
          console.log("API還在載入中，等待完成...");
          
          // 滾動到載入區域並顯示提示
          this.$nextTick(() => {
            const loadingContainer = document.querySelector('.loading-container');
            if (loadingContainer) {
              loadingContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          });
          
          // 開始監聽並等待API載入完成
          this.waitForApiAndLoadData();
        } else if (appStore.hasData) {
          // API已經載入完成，直接載入兌換碼
          this.isSubmitted = true;
          console.log("API已載入，直接載入兌換碼...");
          this.loadCouponCodesFromStore();
        } else {
          // API沒有數據且不在載入中，可能是錯誤狀態
          this.isSubmitted = true;
          console.log("API未載入或載入失敗，嘗試觸發載入...");
          
          // 嘗試觸發API載入
          try {
            this.loading = true;
            await appStore.fetchAllData();
            this.loadCouponCodesFromStore();
          } catch (error) {
            console.error("觸發API載入失敗:", error);
            this.loadCouponCodesFromStore(); // 載入錯誤狀態
          } finally {
            this.loading = false;
          }
        }
      }
    },
    
    async executeClaim(coupon, index) {
      if (coupon.claimed || coupon.claiming) return;
      
      // 設置兌換中狀態 - 使用 Vue 3 的響應式更新
      this.couponCodes[index].claiming = true;
      this.couponCodes[index].errorMessage = null; // 清除之前的錯誤訊息
      this.couponCodes[index].statusMessage = null; // 清除之前的狀態訊息
      
      try {
        // 使用 API 客戶端執行兌換
        const result = await this.claimCoupon(this.nickname, coupon.code);
        
        console.log("Claim result:", result);
        
        // 檢查是否成功
        if (result.success === true) {
          // 兌換成功
          this.couponCodes[index].claimed = true;
          this.couponCodes[index].claiming = false;
          this.couponCodes[index].errorMessage = null;
          this.couponCodes[index].statusMessage = '兌換成功';
          this.couponCodes[index].statusMessageType = 'success';
          
          // 保存兌換狀態到 localStorage
          this.saveClaimedStatus();
          
          console.log(`兌換碼 ${coupon.code} 兌換成功！`);
        } else {
          // 如果 success 不是 true，當作錯誤處理
          throw result;
        }
        
      } catch (error) {
        console.error("Error claiming coupon:", error);
        
        // 重置兌換狀態
        this.couponCodes[index].claiming = false;
        
        // 檢查錯誤對象的結構
        console.log("Error object:", error);
        console.log("Error.errorCode:", error.errorCode);
        console.log("Error.message:", error.message);
        
        // 根據錯誤類型處理
        if (error.errorCode === 'AlreadyUsed') {
          // 已經使用過的兌換碼，標記為已兌換並顯示狀態訊息
          console.log("Already used - marking as claimed");
          this.couponCodes[index].claimed = true;
          this.couponCodes[index].errorMessage = null;
          this.couponCodes[index].statusMessage = '已使用過該序號';
          this.couponCodes[index].statusMessageType = 'success';
          this.saveClaimedStatus();
          
        } else if (error.errorCode === 'InvalidCode') {
          // 無效的兌換碼
          console.log("Invalid code error");
          this.couponCodes[index].errorMessage = '無效的兌換碼';
          this.couponCodes[index].statusMessage = null;
          
        } else if (error.errorCode === 'IncorrectUser') {
          // 暱稱驗證失敗
          console.log("Incorrect user error");
          this.couponCodes[index].errorMessage = '暱稱驗證失敗，請確認暱稱是否正確';
          this.couponCodes[index].statusMessage = null;
          
        } else if (error.errorCode === 'ExpiredCode') {
          // 兌換碼已到期
          console.log("code expired error");
          this.couponCodes[index].errorMessage = '兌換碼已過期';
          this.couponCodes[index].statusMessage = null;
          
        } else {
          // 其他錯誤 - 改善錯誤處理
          console.log("Other error:", error);
          
          // 根據錯誤類型提供更具體的訊息
          if (error.name === 'AbortError') {
            this.couponCodes[index].errorMessage = '請求超時，請重試';
          } else if (error.message && error.message.includes('Failed to fetch')) {
            this.couponCodes[index].errorMessage = '網路連線問題，請檢查網路後重試';
          } else if (error.message && error.message.includes('NetworkError')) {
            this.couponCodes[index].errorMessage = '網路錯誤，請稍後重試';
          } else if (error.message && error.message.includes('Server error')) {
            this.couponCodes[index].errorMessage = '伺服器暫時無法回應，請稍後重試';
          } else if (error.message && error.message.includes('Rate limited')) {
            this.couponCodes[index].errorMessage = '請求過於頻繁，請稍後再試';
          } else {
            // 通用錯誤訊息
            this.couponCodes[index].errorMessage = '兌換失敗，請重新整理頁面後再試';
          }
          
          this.couponCodes[index].statusMessage = null;
        }
      }
    },
    
    clearData() {
      try {
        // 清除暱稱
        localStorage.removeItem("nickname");
        
        // 注意：不要清除兌換狀態，保留每個暱稱的兌換記錄
        // localStorage.removeItem(`claimedCodes_${this.nickname}`);
        
        // 重置組件狀態
        this.nickname = "";
        this.isSubmitted = false;
        this.couponCodes = [];
        this.loading = false;
        
        console.log("Data cleared successfully - keeping claimed status for future use");
      } catch (error) {
        console.error("Error clearing data:", error);
        // 強制重置狀態
        this.nickname = "";
      this.isSubmitted = false;
        this.couponCodes = [];
        this.loading = false;
      }
    },

    openAvatarDialog() {
      this.avatarDialog = true;
    },

    selectAvatar(avatarId) {
      this.selectedAvatarId = avatarId;
      this.updateCurrentAvatarUrl();
      // 保存到 localStorage
      localStorage.setItem("selectedAvatarId", avatarId.toString());
      this.avatarDialog = false;
    },

    getAvatarUrl(avatarId) {
      // 格式化 avatarId 為兩位數字
      const formattedId = avatarId.toString().padStart(2, '0');
      // 根據頭像ID決定使用PNG還是JPG格式
      const extension = this.jpgAvatars.includes(avatarId) ? 'jpg' : 'png';
      return `https://www.browndust2.com/img/designKit/snsIcon/social-icon-${formattedId}.${extension}`;
    },

    updateCurrentAvatarUrl() {
      this.currentAvatarUrl = this.getAvatarUrl(this.selectedAvatarId);
    },

    isApiErrorCode(code) {
      // 判斷是否為API錯誤碼
      return ['API_ERROR', 'LOAD_ERROR', 'SYSTEM_ERROR'].includes(code);
    },

    async retryLoadData() {
      if (this.retrying) return; // 避免重複點擊
      
      console.log("Manual retry requested by user");
      this.retrying = true;
      
      try {
        const appStore = useAppStore();
        
        // 先嘗試重新載入 store 數據
        await appStore.retryFetchAllData();
        
        // 然後重新載入兌換碼
        this.loadCouponCodesFromStore();
        
        console.log("Retry completed successfully");
        
      } catch (error) {
        console.error("Retry failed:", error);
        
        // 即使重試失敗，也更新顯示以反映最新的錯誤狀態
        this.loadCouponCodesFromStore();
        
      } finally {
        this.retrying = false;
      }
    },
    
    // 重新載入兌換碼（給用戶使用的通用方法）
    async retryLoadCouponCodes() {
      if (this.retrying) return;
      
      console.log("用戶手動重新載入兌換碼");
      this.retrying = true;
      this.loading = true;
      
      try {
        const appStore = useAppStore();
        
        // 清除現有的兌換碼數據
        this.couponCodes = [];
        
        // 重新觸發API載入
        await appStore.fetchAllData();
        
        // 載入兌換碼
        this.loadCouponCodesFromStore();
        
        console.log("兌換碼重新載入成功");
        
      } catch (error) {
        console.error("重新載入兌換碼失敗:", error);
        
        // 即使失敗也載入當前狀態
        this.loadCouponCodesFromStore();
        
      } finally {
        this.retrying = false;
        this.loading = false;
      }
    },

    

    // 處理兌換請求  
    async handleClaim() {
      if (this.claimLoading) return;
      
      const userId = this.userId || '';
      const code = this.couponCode;
      
      if (!code) {
        this.showError('請輸入兌換碼');
        return;
      }
      
      this.claimLoading = true;
      this.claimStatus = '';
      this.claimMessage = '';
      this.networkStatus = 'checking';
      
      try {
        const result = await this.claimCoupon(userId, code);
        console.log('兌換結果:', result);
        
        this.networkStatus = 'online';
        
        // 處理回應
        if (result.success) {
          this.claimStatus = 'success';
          this.claimMessage = result.message || '兌換成功！';
        } else {
          this.claimStatus = 'error';
          this.claimMessage = result.message || '兌換失敗';
        }
        
      } catch (error) {
        console.warn('兌換錯誤:', error);
        this.claimStatus = 'error';
        
        // 網路狀態診斷
        if (error.message.includes('Failed to fetch')) {
          this.networkStatus = 'unreachable';
          this.claimMessage = '無法連接兌換服務，請檢查網路狀態';
        } else if (error.message.includes('timeout') || error.name === 'AbortError') {
          this.networkStatus = 'slow';
          this.claimMessage = '兌換服務回應超時，請稍後重試';
        } else if (error.message.includes('CORS') || error.message.includes('cors')) {
          this.networkStatus = 'cors-error';
          this.claimMessage = 'iOS Safari 兼容性問題，請嘗試重新整理頁面';
        } else if (error.errorCode) {
          this.networkStatus = 'online';
          this.claimMessage = `${error.message}`;
        } else {
          this.networkStatus = 'unreachable';
          this.claimMessage = error.message || '兌換失敗，請稍後重試';
        }
      } finally {
        this.claimLoading = false;
        // 3秒後清除網路狀態提示
        setTimeout(() => {
          if (this.networkStatus !== 'unreachable') {
            this.networkStatus = null;
          }
        }, 3000);
      }
    },
  },
};
</script>

<style scoped>
/* Profile 卡片樣式 */
.profile-card {
  min-height: 500px;
}

/* 桌面版才使用動態高度 */
@media (min-width: 769px) {
  .profile-card {
    height: 100%; /* 讓卡片填滿父容器的高度 */
    display: flex;
    flex-direction: column;
  }
  
  /* 卡片內容區域 */
  .profile-card-content {
    flex: 1; /* 填滿剩餘空間 */
    display: flex;
    flex-direction: column;
  }
  
  /* 兌換碼展示區域 */
  .coupon-display-area {
    flex: 1; /* 填滿剩餘空間 */
    display: flex;
    flex-direction: column;
  }
}

/* 載入狀態容器 */
.loading-container {
  height: 400px; /* 預設固定高度 */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

/* 兌換碼列表容器 - 預設固定高度 */
.coupon-list-container {
  height: 400px; /* 預設固定高度 */
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
    flex: 1; /* 填滿剩餘空間 */
    min-height: 300px; /* 最小高度 */
    height: auto; /* 覆蓋固定高度 */
  }
  
  .coupon-list-container {
    flex: 1; /* 填滿剩餘空間 */
    min-height: 300px; /* 最小高度 */
    height: auto; /* 覆蓋固定高度 */
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

/* 選中頭像的樣式 */
.selected-avatar {
  border: 2px solid #e72857 !important;
  box-shadow: 0 0 8px rgba(231, 40, 87, 0.5);
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
  min-width: 0; /* 防止文字溢出 */
}

.coupon-code-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 2px;
}

.coupon-code {
  font-weight: 600;
  font-size: 1rem;
  color: #e72857;
}

.coupon-status-chip {
  flex-shrink: 0;
}

.coupon-description {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.2;
  margin-top: 2px;
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
  width: 32px; /* 與圖標寬度對齊 */
  flex-shrink: 0;
}

.coupon-message-content {
  flex: 1;
  min-width: 0; /* 防止溢出 */
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
    height: 350px; /* 平板固定高度 */
  }
  
  .loading-container {
    height: 350px; /* 平板固定高度 */
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
    display: none; /* 在小螢幕隱藏副標題 */
  }
  
  .coupon-list-container {
    height: 300px; /* 手機固定高度 */
  }
  
  .loading-container {
    height: 300px; /* 手機固定高度 */
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

/* 用戶資訊卡片樣式 */
.user-profile-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  margin-bottom: 8px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%);
  transition: all 0.2s ease-in-out;
}

.user-profile-card:hover {
  border-color: rgba(231, 40, 87, 0.3);
  background: linear-gradient(135deg, rgba(231, 40, 87, 0.08) 0%, rgba(255, 255, 255, 0.05) 100%);
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
  min-width: 0; /* 防止文字溢出 */
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

.logout-btn {
  flex-shrink: 0;
  opacity: 0.7;
  transition: opacity 0.2s ease-in-out;
}

.user-profile-card:hover .logout-btn {
  opacity: 1;
}

/* API 狀態卡片樣式 */
.api-status-card {
  margin-bottom: 12px;
  padding: 8px 12px;
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.api-status-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
}

.api-status-text {
  flex: 1;
  color: rgba(255, 255, 255, 0.8);
}

.api-error-detail {
  margin-top: 4px;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
  padding: 4px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}
</style>
