<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/store';

const settings = useUserStore().getSettings;

const props = defineProps({
  interval: { type: Number, default: 0.1 },
  maxDuration: { type: Number, default: 0.5 },
  leave: { type: Boolean, default: false },
});

const wrap = ref();

function transitiondelays() {
  const interval = Math.min(props.interval, props.maxDuration / wrap.value.children.length) * settings.animationSpeed / 100;
  for (let i = 0; i < wrap.value.children.length; i++) {
    wrap.value.children[i].style.setProperty("--sequence-delay", `${i * interval}s`);
  }
}

onMounted(transitiondelays);
</script>

<template>
  <div class="sequence-transition" :class="{ leave }" ref="wrap">
    <slot tester />
  </div>
</template>

<style>
.v-enter-active.sequence-transition>*,
.v-enter-active.sequence-transition *,
.v-enter-active .sequence-transition>*,
.v-enter-active .sequence-transition * {
  transition-delay: var(--sequence-delay);
}

.v-leave-active.sequence-transition.leave>*,
.v-leave-active.sequence-transition.leave *,
.v-leave-active .sequence-transition.leave>*,
.v-leave-active .sequence-transition.leave * {
  transition-delay: var(--sequence-delay);
}
</style>