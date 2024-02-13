<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue';
import SliderMain from '@/components/mains/SliderMain.vue';
import { Settings } from '@/store';
import { useStore } from 'vuex';

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
}>();

const output = ref(0);
const store = useStore();

const settings = store.state.settings as Settings;

let interv = 0;

function update(newValue: number, intervalDuration: number = Math.round(props.duration / Math.abs(output.value - newValue))) {
  emits("update", newValue);
  clearInterval(interv);

  let step = props.step;
  newValue = parseInt(newValue.toString());

  if (settings.animationSpeed == 0) {
    output.value = newValue;
    return;
  } else {
    intervalDuration *= settings.animationSpeed/100;
  }

  if (intervalDuration < 10 && intervalDuration > 0) {
    step *= Math.ceil(10 / intervalDuration);
    intervalDuration *= step;
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

onBeforeUnmount(() => {
  output.value = 0;
});

</script>

<template>
  <div class="sliderWrap">
    <label class="sliderHeading">
      <h3 class="sliderTitle">{{ name }}</h3>
      <p v-if="props.options[output]" class="sliderReading"><b>{{ props.options[output] }}</b></p>
      <p v-else class="sliderReading"><b>{{ output }}</b> {{ unit }}</p>
    </label>
    <slider-main class="slider" :id="name?.toLowerCase()" :max="max" :value="value" @on-input="update"
      :step="step"></slider-main>
    <p class="sliderLabelWrap">
      <datalist :id="name?.toLowerCase()" class="sliderLabels">
        <slot></slot>
      </datalist>
    </p>
  </div>
</template>

<style>
.sliderWrap {
  width: 100%;
  margin: 15px 0;
}

.sliderHeading {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;
}

.sliderLabelWrap {
  height: 30px;
  overflow: hidden;
}

datalist.sliderLabels {
  /* margin-top: 10px; */
  display: flex;
  width: 100%;
  height: 30px;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;
  /* font-weight: 200; */
}

datalist.sliderLabels * {
  min-width: 30px;
}

.v-enter-from h3.sliderTitle,
.v-leave-to h3.sliderTitle {
  transform: translateX(-50%);
  opacity: 0;
}

.v-enter-from .sliderReading,
.v-leave-to .sliderReading {
  transform: translateX(50%);
  opacity: 0;
}

.v-enter-from .sliderLabels>*,
.v-leave-to .sliderLabels>* {
  transform: scale(.9);
  opacity: 0;
}

.v-enter-from .slider,
.v-leave-to .slider {
  opacity: 0;
}
</style>