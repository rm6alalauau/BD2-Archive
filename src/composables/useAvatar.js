import { ref, computed } from "vue";
import { useSettingsStore } from "@/stores/settings";

export function useAvatar() {
    const settingsStore = useSettingsStore();
    const currentAvatar = ref(1);
    const avatarDialog = ref(false);

    const currentAvatarUrl = computed(() => {
        // 彩蛋模式：使用 Yuri 角色圖片
        if (settingsStore.activeEasterEggMode === 'walker_mode') {
            const yuriAvatars = [
                'icon1.gif', 'icon2.gif', 'icon3.png', 'icon4.png', 'icon5.gif',
                'icon6.gif', 'icon7.gif', 'icon8.gif', 'icon9.gif', 'icon10.gif',
                'icon11.gif', 'icon12.gif', 'icon13.gif', 'icon14.gif', 'icon15.png',
                'icon16.gif', 'icon17.webp', 'icon18.png', 'icon19.gif', 'icon20.gif'
            ];

            // 確保 currentAvatar 值在有效範圍內
            const avatarIndex = (currentAvatar.value - 1) % yuriAvatars.length;
            return `/yuri/role/${yuriAvatars[avatarIndex]}`;
        }

        // 正常模式：使用原本的 Brown Dust 頭像
        const formattedId = String(currentAvatar.value).padStart(2, "0");
        const jpgAvatars = [39, 40, 41, 42, 43, 44, 45, 46, 47, 48];
        const extension = jpgAvatars.includes(currentAvatar.value) ? "jpg" : "png";
        return `https://www.browndust2.com/img/designKit/snsIcon/social-icon-${formattedId}.${extension}`;
    });

    const updateAvatar = (avatarId) => {
        currentAvatar.value = avatarId;
        localStorage.setItem("selectedAvatarId", avatarId.toString());
    };

    const initAvatar = () => {
        // 載入保存的頭像
        const savedAvatarId = localStorage.getItem("selectedAvatarId");
        if (savedAvatarId) {
            currentAvatar.value = parseInt(savedAvatarId);
        } else {
            // 隨機選擇一個頭像
            let availableAvatars;

            // 彩蛋模式：使用 Yuri 角色範圍 (1-20)
            if (settingsStore.activeEasterEggMode === 'walker_mode') {
                availableAvatars = Array.from({ length: 20 }, (_, i) => i + 1);
            } else {
                // 正常模式：使用原本的 Brown Dust 頭像範圍
                availableAvatars = [
                    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
                    22, 25, 26, 27, 28, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43,
                    44, 45, 46, 47, 48,
                ];
            }

            const randomAvatar =
                availableAvatars[Math.floor(Math.random() * availableAvatars.length)];
            currentAvatar.value = randomAvatar;
            localStorage.setItem("selectedAvatarId", randomAvatar.toString());
        }
    };

    return {
        currentAvatar,
        avatarDialog,
        currentAvatarUrl,
        updateAvatar,
        initAvatar
    };
}
