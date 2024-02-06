<script setup lang="ts">
import { ref, defineProps, onMounted } from 'vue';

const props = defineProps<{
  name: string,
  margin: string,
  duration?: number,
}>();

const grid = ref();

function transitiondelays() {
  let d = Math.round((props.duration ? props.duration : 200) / grid.value.children.length);
  for (let i = 0; i < grid.value.children.length; i++) {
    grid.value.children[i].style.transitionDelay = `${i * d}ms`;
  }
}

onMounted(transitiondelays);

</script>

<template>
  <div class="gridGroupWrap">
    <h3 class="gridTitle">{{ name }}</h3>
    <div class="grid" ref="grid">
      <slot></slot>
    </div>
  </div>
</template>

<style>
.gridGroupWrap {
  width: 100%;
  margin: 15px 0;
  overflow: hidden;
}

.gridTitle {
  margin-bottom: 10px;
}

.grid {
  /* margin: calc(-1 * v-bind('props.margin')); */
  display: flex;
  flex-wrap: wrap;
  gap: v-bind(margin);
}

.v-enter-from h3.gridTitle,
.v-leave-to h3.gridTitle {
  transform: translateX(-50%);
  opacity: 0;
}

.v-enter-from .grid>*,
.v-leave-to .grid>* {
  transform: scale(.9);
  opacity: 0;
}
</style>