
<script setup lang="ts">
import { defineProps } from 'vue';

defineProps({
  interval: {type: Number, default: 0.1},
});

// const wrap = ref();

// function transitiondelays() {
//   for (let i = 0; i < wrap.value.children.length; i++) {
//     wrap.value.children[i].style.transitionDelay = `${i * props.interval}s`;
//   }
// }
// onMounted(() => {transitiondelays();
// console.log(slots)});
</script>

<template>
<div class="sequenceTransition" ref="wrap">
  <slot/>
</div>
</template>

<style scoped>
.v-enter-active.sequenceTransition *:nth-child(1) * {
  transition-delay: calc(v-bind(interval) * 1s);
}
.v-enter-active.sequenceTransition *:nth-child(2) * {
  transition-delay: calc(v-bind(interval) * 2s);
}
.v-enter-active.sequenceTransition *:nth-child(3) * {
  transition-delay: calc(v-bind(interval) * 3s);
}
.v-enter-active.sequenceTransition *:nth-child(4) * {
  transition-delay: calc(v-bind(interval) * 4s);
}
.v-enter-active.sequenceTransition *:nth-child(5) * {
  transition-delay: calc(v-bind(interval) * 5s);
}
</style>