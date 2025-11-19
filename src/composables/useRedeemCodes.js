import { ref, watch } from "vue";
import { useAppStore } from "@/stores/app";
import { useSettingsStore } from "@/stores/settings";

export function useRedeemCodes(currentNickname, t) {
    const appStore = useAppStore();
    const settingsStore = useSettingsStore();

    const loading = ref(false);
    const redeemCodes = ref([]);
    const claimCount = ref(0);
    const redeemAnimation = ref(null);

    // 檢查是否為日期格式
    const isDateStatus = (status) => {
        const datePattern = /^\d{4}\/\d{1,2}\/\d{1,2}$/;
        return datePattern.test(status);
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

    const saveClaimedStatus = () => {
        if (!currentNickname.value) return;
        const claimedCodes = redeemCodes.value
            .filter((coupon) => coupon.claimed)
            .map((coupon) => coupon.code);
        localStorage.setItem(
            `claimedCodes_${currentNickname.value}`,
            JSON.stringify(claimedCodes)
        );
    };

    const loadClaimedStatus = () => {
        if (!currentNickname.value) return;
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

    // 顯示兌換動畫
    const showRedeemAnimation = (buttonElement = null, profileCardRef = null) => {
        if (settingsStore.activeEasterEggMode !== 'walker_mode') {
            return;
        }

        claimCount.value += 1;
        const gifPath = claimCount.value % 2 === 1
            ? '/yuri/effects/redeem1.gif'
            : '/yuri/effects/redeem2.gif';

        let position = { x: '50%', y: '50%' }; // 預設位置為卡片中央

        if (buttonElement && profileCardRef) {
            try {
                // 計算按鈕相對於 Profile 卡片的位置
                const cardRect = profileCardRef.$el.getBoundingClientRect();
                const buttonRect = buttonElement.getBoundingClientRect();

                const relativeX = (buttonRect.left + buttonRect.width / 2) - cardRect.left;
                const relativeY = (buttonRect.top + buttonRect.height / 2) - cardRect.top;

                position = {
                    x: `${relativeX}px`,
                    y: `${relativeY - 80}px`, // 在按鈕中心點上方 80px
                };
            } catch (error) {
                console.warn('無法獲取按鈕相對位置，使用卡片中央作為預設', error);
            }
        }

        redeemAnimation.value = {
            id: Date.now(),
            src: gifPath,
            show: true,
            position: position
        };

        setTimeout(() => {
            if (redeemAnimation.value) {
                redeemAnimation.value.show = false;
                setTimeout(() => {
                    redeemAnimation.value = null;
                }, 300);
            }
        }, 2500);
    };

    const executeClaim = async (coupon, index, event, profileCardRef) => {
        if (coupon.claimed || coupon.claiming) return;

        // 顯示兌換動畫（點擊時立即觸發）
        const buttonElement = event?.target;
        showRedeemAnimation(buttonElement, profileCardRef);

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

    return {
        loading,
        redeemCodes,
        redeemAnimation,
        loadRedeemCodes,
        executeClaim,
        markCouponAsClaimed,
        showRedeemAnimation,
        getLocalizedReward,
        isDateStatus,
        loadClaimedStatus,
        openOfficialRedeemPage
    };
}
