<template>
  <div class="profile-test-page">
    <v-container>
      <v-row>
        <v-col cols="12" md="8" lg="6" class="mx-auto">
          <v-card class="mb-4" rounded="lg">
            <v-card-title class="text-h5 text-center">
              <v-icon color="primary" class="mr-2">mdi-test-tube</v-icon>
              ProfileTest 組件測試
            </v-card-title>
            <v-card-text class="text-center">
              <p>這是測試 <code>&lt;script setup&gt;</code> 語法的 Profile 組件</p>
              <p class="text-body-2 text-grey">
                此頁面專門用於測試新的響應式實現方式，不會影響現有功能
              </p>
            </v-card-text>
          </v-card>
          
          <!-- 測試組件 -->
          <ProfileTest />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import ProfileTest from '@/components/ProfileTest.vue'
</script>

<style scoped>
.profile-test-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%);
  padding: 20px 0;
}

code {
  background-color: rgba(255, 255, 255, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Consolas', 'Monaco', monospace;
}
</style> 