<template>
  <v-app>
    <Navigation />
    <v-main class="main-content">
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
//
</script>

<style scoped>
.main-content {
  padding-top: 64px; /* 導覽欄高度 */
}
</style>
