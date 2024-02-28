<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/store';

const settings = useUserStore().getSettings;

const props = defineProps({
  interval: { type: Number, default: 0.1 },
});

const wrap = ref();

function transitiondelays() {
  for (let i = 0; i < wrap.value.children.length; i++) {
    wrap.value.children[i].style.setProperty("--sequence-delay", `${i * props.interval * settings.animationSpeed / 100}s`);
  }
}

onMounted(transitiondelays);
</script>

<template>
  <div class="sequence-transition" ref="wrap">
    <slot />
  </div>
</template>

<style>
.v-enter-active.sequence-transition>*,
.v-enter-active.sequence-transition *,
.v-enter-active .sequence-transition>*,
.v-enter-active .sequence-transition * {
  transition-delay: var(--sequence-delay);
}

/* .v-enter-active.sequence-transition>*:nth-child(1),
.v-enter-active.sequence-transition>*:nth-child(1) * {
  transition-delay: calc(v-bind(interval) * var(--animation-speed) * 1s);
}

.v-enter-active.sequence-transition>*:nth-child(2),
.v-enter-active.sequence-transition>*:nth-child(2) * {
  transition-delay: calc(v-bind(interval) * var(--animation-speed) * 2s);
}

.v-enter-active.sequence-transition>*:nth-child(3),
.v-enter-active.sequence-transition>*:nth-child(3) * {
  transition-delay: calc(v-bind(interval) * var(--animation-speed) * 3s);
}

.v-enter-active.sequence-transition>*:nth-child(4),
.v-enter-active.sequence-transition>*:nth-child(4) * {
  transition-delay: calc(v-bind(interval) * var(--animation-speed) * 4s);
}

.v-enter-active.sequence-transition>*:nth-child(5),
.v-enter-active.sequence-transition>*:nth-child(5) * {
  transition-delay: calc(v-bind(interval) * var(--animation-speed) * 5s);
}

.v-enter-active.sequence-transition>*:nth-child(6),
.v-enter-active.sequence-transition>*:nth-child(6) * {
  transition-delay: calc(v-bind(interval) * var(--animation-speed) * 6s);
}

.v-enter-active.sequence-transition>*:nth-child(7),
.v-enter-active.sequence-transition>*:nth-child(7) * {
  transition-delay: calc(v-bind(interval) * var(--animation-speed) * 7s);
}

.v-enter-active.sequence-transition>*:nth-child(8),
.v-enter-active.sequence-transition>*:nth-child(8) * {
  transition-delay: calc(v-bind(interval) * var(--animation-speed) * 8s);
} */
</style>