<template>
  <div 
    v-if="animation && animation.show" 
    class="redeem-animation-overlay"
    :style="{
      left: animation.position.x,
      top: animation.position.y,
      transform: 'translate(-50%, -50%)'
    }"
  >
    <img 
      :src="animation.src" 
      alt="兌換動畫"
      class="redeem-animation-gif"
    />
  </div>
</template>

<script setup>
defineProps({
  animation: {
    type: Object,
    default: null
  }
});
</script>

<style scoped>
.redeem-animation-overlay {
  /* 關鍵點 2: 對話框使用 fixed 改為 absolute */
  position: absolute; 
  
  /* 關鍵點 3: 層級要足夠高，但不能擋到其他互動元素 */
  z-index: 10; /* 比內容層級高但低於對話框 */
  
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
  animation: scaleIn 0.3s ease-out, fadeOut 0.5s ease-in-out 3s forwards;
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

/* 手機版調整 */
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
