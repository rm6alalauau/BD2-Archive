<template>
  <v-row>
    <v-col>
      <!-- 載入狀態 -->
      <div v-if="!hasAnyData()" class="d-flex justify-center align-center" style="height: 300px;">
        <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
      </div>
      
      <!-- 內容區域 -->
      <component v-else :is="selectedComponent" :items="items[selectedComponent]" />
      
      <!-- 標籤組 -->
      <v-chip-group v-model="selectedComponent" column mandatory>
        <v-chip
          v-for="component in components"
          :key="component.value"
          :value="component.value"
          variant="outlined"
        >
          {{ component.text }}
        </v-chip>
      </v-chip-group>
    </v-col>
  </v-row>
</template>

<script>
import { useAppStore } from '@/stores/app'
import Bahamut from "./Bahamut.vue";
import NGAList from "./Nga.vue";
import PTTList from "./Ptt.vue";
import XPosts from "./X.vue";
import RedditPosts from "./Reddit.vue";
import NaverPosts from "./Naver.vue";

export default {
  name: "ParentComponent",
  components: {
    Bahamut,
    NGAList,
    PTTList,
    XPosts,
    RedditPosts,
    NaverPosts,
  },
  data() {
    return {
      selectedComponent: "Bahamut", // 預設顯示的組件
      allComponents: [
        { text: "巴哈", value: "Bahamut" },
        { text: "NGA", value: "NGAList" },
        { text: "PTT", value: "PTTList" },
        { text: "X", value: "XPosts" },
        { text: "Reddit", value: "RedditPosts" },
        { text: "Naver", value: "NaverPosts" },
      ],
      components: [
        { text: "巴哈", value: "Bahamut" },
        { text: "NGA", value: "NGAList" },
        { text: "PTT", value: "PTTList" },
        { text: "X", value: "XPosts" },
        { text: "Reddit", value: "RedditPosts" },
        { text: "Naver", value: "NaverPosts" },
      ],
      items: {
        Bahamut: [],
        NGAList: [],
        PTTList: [],
        XPosts: [],
        RedditPosts: [],
        NaverPosts: [],
      },
    };
  },
  computed: {
    // 獲取用戶設定的論壇選擇
    userSelectedForums() {
      try {
        const saved = localStorage.getItem('bd2_settings');
        if (saved) {
          const settings = JSON.parse(saved);
          const selectedForums = settings.selectedForums || ['Bahamut', 'NGAList', 'PTTList', 'XPosts', 'RedditPosts'];
          return selectedForums;
        }
      } catch (error) {
        console.error('載入論壇設定時發生錯誤:', error);
      }
      return ['Bahamut', 'NGAList', 'PTTList', 'XPosts', 'RedditPosts']; // 預設全選（不包含Naver）
    },
    
    // 根據用戶設定過濾的組件列表
    filteredComponents() {
      const selectedForums = this.userSelectedForums;
      const filtered = this.allComponents.filter(component => 
        selectedForums.includes(component.value)
      );
      
      // 確保至少有一個組件
      const result = filtered.length > 0 ? filtered : this.allComponents;
      return result;
    }
  },
  watch: {
    // 監聽過濾後的組件變化
    filteredComponents: {
      handler(newComponents) {
        this.components = newComponents;
        
        // 如果當前選中的組件不在新的列表中，切換到第一個可用的
        const currentComponentExists = newComponents.some(comp => comp.value === this.selectedComponent);
        if (!currentComponentExists && newComponents.length > 0) {
          this.selectedComponent = newComponents[0].value;
        }
      },
      immediate: true
    }
  },
  mounted() {
    // 立即顯示載入狀態，不等待數據
    this.loadDataFromStore();
    
    // 監聽設定變化
    window.addEventListener('storage', this.handleSettingsChange);
    
    // 如果沒有數據，立即開始獲取
    if (!this.hasAnyData()) {
      this.fetchData();
    }
  },
  
  beforeUnmount() {
    window.removeEventListener('storage', this.handleSettingsChange);
  },
  
  methods: {
    // 檢查是否有任何數據
    hasAnyData() {
      return Object.values(this.items).some(items => items && items.length > 0);
    },
    
    loadDataFromStore() {
      try {
        const appStore = useAppStore();
        
        // 從 store 獲取論壇數據
        const forumData = appStore.forumData;
        this.items = { ...forumData };
        
        // 如果沒有數據，嘗試獲取
        if (!appStore.hasData) {
          this.fetchData();
        }
      } catch (error) {
        console.error("Error loading data from store:", error);
      }
    },
    
    async fetchData() {
      try {
        const appStore = useAppStore();
        await appStore.fetchAllData();
        
        // 更新本地數據
        this.loadDataFromStore();
      } catch (error) {
        console.error("Error fetching forum data:", error);
        // 即使失敗也不影響其他功能
      }
    },
    
    // 處理設定變化
    handleSettingsChange(event) {
      if (event.key === 'bd2_settings') {
        // 觸發 computed 重新計算
        this.$forceUpdate();
      }
    }
  },
};
</script>
