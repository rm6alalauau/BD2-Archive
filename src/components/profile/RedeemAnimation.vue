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
  position: absolute;
  z-index: 100;
  pointer-events: none;
}

.redeem-animation-gif {
  width: 150px;
  height: 150px;
  object-fit: contain;
}
</style>
