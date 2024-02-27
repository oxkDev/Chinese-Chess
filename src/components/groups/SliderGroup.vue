<script setup lang="ts">
import { ref } from 'vue';
import SliderMain from '@/components/mains/SliderMain.vue';
import { useStore } from '@/store';

const settings = useStore().getSettings;

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

const output = ref(0);

let interv = 0;

function update(newValue: number) {
  clearInterval(interv);
  newValue = parseInt(newValue.toString());
  
  if (settings.animationSpeed == 0) {
    output.value = newValue;
    return;
  }

  let step = props.step;
  let intervalDuration = Math.round((props.duration * settings.animationSpeed / 100) * step / Math.abs(output.value - newValue) );

  if (intervalDuration <= 0) {
    output.value = newValue;
    return;
  }

  if (intervalDuration < 50) {
    const multiple = Math.ceil(50 / intervalDuration);
    step *= multiple;
    intervalDuration = 50;
  }

  const intervFunc = () => {
    if (Math.abs(output.value - newValue) < step) output.value = newValue;
    else if (output.value > newValue) output.value -= step;
    else if (output.value < newValue) output.value += step;
    if (output.value == newValue) clearInterval(interv);
  };
  // console.log(!(intervalDuration == Infinity || step == Infinity), typeof(step), typeof(newValue))
  if (!(intervalDuration == Infinity || intervalDuration == 0)) {
    intervFunc();
    interv = setInterval(intervFunc, intervalDuration);
  }
}

update(props.value);
</script>

<template>
  <div class="slider-group">
    <label class="slider-heading">
      <h3 class="slider-title">{{ name }}</h3>
      <p v-if="props.options[output]" class="slider-reading"><b>{{ props.options[output] }}</b></p>
      <p v-else class="slider-reading"><b>{{ output }}</b> {{ unit }}</p>
    </label>
    <slider-main class="slider" :id="name?.toLowerCase()" :max="max" :value="value"
      @on-input="v => { emits('update', v); update(v); }" @on-set="v => emits('set', v)" :step="step"></slider-main>
    <p class="slider-label-wrap">
      <datalist :id="name?.toLowerCase()" class="slider-labels">
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

.slider-heading {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;
}

.slider-title {
  min-width: 50%;
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

datalist.slider-labels * {
  min-width: 30px;
}

.v-enter-from h3.slider-title,
.v-leave-to h3.slider-title {
  transform: translateX(-50%);
  opacity: 0;
}

.v-enter-from .slider-reading,
.v-leave-to .slider-reading {
  transform: translateX(100%);
  opacity: 0;
}

.v-enter-from .slider-labels>*,
.v-leave-to .slider-labels>* {
  transform: scale(.9);
  opacity: 0;
}

.v-enter-from .slider,
.v-leave-to .slider {
  opacity: 0;
}
</style>