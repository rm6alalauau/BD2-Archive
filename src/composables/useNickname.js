import { ref } from "vue";

export function useNickname() {
    const inputNickname = ref("");
    const currentNickname = ref("");
    const savedNicknames = ref([]);

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

    const saveAndSetNickname = (onSuccess) => {
        if (!inputNickname.value.trim()) return;

        currentNickname.value = inputNickname.value.trim();
        localStorage.setItem("nickname", currentNickname.value);
        saveNicknameToList(currentNickname.value);

        if (onSuccess) {
            onSuccess();
        }
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

    const exitNicknameMode = () => {
        currentNickname.value = "";
        inputNickname.value = "";
        localStorage.removeItem("nickname");
    };

    return {
        inputNickname,
        currentNickname,
        savedNicknames,
        loadSavedNicknames,
        saveAndSetNickname,
        removeSavedNickname,
        exitNicknameMode,
        saveNicknameToList
    };
}
