<script setup lang="ts">
import { ref } from 'vue';
import SliderMain from '@/components/mains/SliderMain.vue';
import { useUserStore } from '@/store';

const settings = useUserStore().getSettings;

const props = defineProps({
  name: String,
  unit: String,
  max: { type: Number, default: 100 },
  value: { type: Number, default: -1 },
  step: { type: Number, default: 1 },
  duration: { type: Number, default: 200 },
  options: { type: Object, default: () => ({}) },
});

const emits = defineEmits<{
  (e: "update", value: number): void,
  (e: "set", value: number): void,
}>();

const id = props.name ? props.name.toLowerCase().replaceAll(' ', '-') : undefined;

const display = ref(0);
const output = defineModel<number>();

let interv: number;

function update(newValue: number) {
  if (interv) cancelAnimationFrame(interv);
  newValue = parseInt(newValue.toString());
  if (newValue == display.value) return;

  const change = newValue - display.value;
  const duration = Math.round(props.duration * settings.animationSpeed / 100);
  const startTime = performance.now();

  const intervFunc = () => {
    const percentage = (performance.now() - startTime) / duration;
    if (percentage > 1) return display.value = newValue;
    display.value = Math.round(newValue - (change * (1 - percentage)));
    if (display.value != newValue) interv = requestAnimationFrame(intervFunc);
  };

  if (duration) interv = requestAnimationFrame(intervFunc);
  else display.value = newValue;
}

// onMounted(() => setTimeout(() => update(props.value), settings.animationSpeed));
display.value = props.value;
</script>

<template>
  <div class="slider-group">
    <label class="group-heading" :for="id">
      <h3 class="group-title">{{ name }}</h3>
      <p v-if="props.options[display]" class="group-value"><b>{{ props.options[display] }}</b></p>
      <p v-else class="group-value"><b>{{ display }}</b> {{ unit }}</p>
    </label>
    <slider-main class="slider" :id="id" :max="max" :value="value" v-model="output"
      @on-input="v => { emits('update', v); update(v); }" @on-set="v => emits('set', v)" :step="step"></slider-main>
    <p class="slider-label-wrap">
      <datalist :id="id" class="slider-labels">
        <slot></slot>
      </datalist>
    </p>
  </div>
</template>

<style>
.slider-group {
  width: 100%;
  margin: 15px 0;
}

.slider-label-wrap {
  height: 30px;
  overflow: hidden;
}

datalist.slider-labels {
  /* margin-top: 10px; */
  display: flex;
  width: 100%;
  height: 30px;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;
  /* font-weight: 200; */
}

datalist.slider-labels>* {
  min-width: 30px;
}

.v-enter-from,
.v-leave-to {

  .slider-labels>* {
    transform: scale(.9) translateY(-100%);
    opacity: 0;
  }

  .slider {
    opacity: 0;
  }
}

.v-enter-active .slider-labels>*{
  transition-delay: calc(var(--sequence-delay) + .1s * var(--animation-speed));
}
</style>