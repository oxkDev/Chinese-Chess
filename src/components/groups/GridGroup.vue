<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/store';

const settings = useUserStore().getSettings;

const props = defineProps<{
  name: string,
  margin: string,
  duration?: number,
}>();

const grid = ref();

function transitiondelays() {
  let d = Math.round((props.duration ? props.duration : 200) / grid.value.children.length * settings.animationSpeed / 100);
  for (let i = 0; i < grid.value.children.length; i++) {
    grid.value.children[i].style.setProperty("--grid-delay", `${i * d}ms`);
  }
}

onMounted(transitiondelays);

</script>

<template>
  <div class="grid-group">
    <label class="group-heading">
      <h3 class="group-title">{{ name }}</h3>
    </label>
    <div class="grid" ref="grid">
      <slot></slot>
    </div>
  </div>
</template>

<style>
.grid-group {
  width: 100%;
  margin: 15px 0;
  overflow: visible;
}

.grid {
  /* margin: calc(-1 * v-bind('props.margin')); */
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: v-bind(margin);
}

.v-enter-from,
.v-leave-to {

  h3.grid-title,
  h3.grid-title {
    transform: translateX(-50%);
    opacity: 0;
  }

  .grid>* {
    transform: scale(.9);
    opacity: 0;
  }
}

.v-enter-active .grid-group>div.grid>*,
.v-leave-active .grid>* {
  transition-delay: var(--grid-delay);
}
</style>