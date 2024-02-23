<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useStore } from '@/store';

const store = useStore();

const input = ref();
const width = ref(36);

const props = defineProps({
  id: { type: String, default: "options" },
  max: { type: Number, default: 100 },
  value: { type: Number, default: -1 },
  step: { type: Number, defualt: 1 },
});

const emits = defineEmits<{
  (e: "onInput", newValue: number): void,
  (e: "onSet", newValue: number): void,
}>();

watch(props, () => {
  if (input.value.value > props.max) {
    input.value.value = props.max;
  }
  setTimeout(setPosition);
});

function setPosition() {
  emits("onInput", input.value.value);
  // status.value = input.value.value;
  width.value = input.value.value / props.max;
}


onMounted(() => {
  let timeout: number;
  input.value.value = props.value == -1 ? props.max / 2 : props.value;
  setPosition();
  input.value.addEventListener("input", () => {
    setPosition();
    if (store.settings.haptic) {
      clearTimeout(timeout);
      timeout = parseInt(setTimeout(() => store.feedback(), 10).toString());
    }
  });
  input.value.addEventListener("mouseup", () => {
    emits("onSet", input.value.value);
  });
  input.value.addEventListener("touchend", () => {
    emits("onSet", input.value.value);
  });
});

</script>

<template>
  <div class="slider-main">
    <input type="range" min="0" :max="max" :list="id" :step="step" ref="input">
    <div class="progress"><span class="knob"></span></div>
  </div>
</template>

<style scoped>
.progress,
input::-webkit-slider-thumb {
  transition: var(--transition-s);
}

.slider-main {
  height: 36px;
  max-width: 300px;
  margin: 10px 0 0;
  border-radius: 20px;
  background: var(--translucent);
  position: relative;
  box-shadow: var(--inner-shadow);
}

.slider-main:hover,
input:hover {
  cursor: pointer;
}

.progress {
  height: 100%;
  width: calc(v-bind(width) * (100% - 36px) + 36px);
  min-width: 36px;
  max-width: 100%;
  border-radius: 20px;
  background: var(--primary);
  position: absolute;
  bottom: 0px;
  left: 0px;
  z-index: 1;
  box-shadow: var(--default-shadow);
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.progress>.knob {
  height: 26px;
  min-width: 26px;
  margin: 5px;
  border-radius: 20px;
  background: var(--contrast-translucent);
  box-shadow: var(--default-shadow);
  display: block;
}

.slider-main:hover .progress {
  box-shadow: var(--default-glow);
}

input {
  overflow: visible;
  width: calc(100% - 10px);
  height: 100%;
  margin: 0 5px;
  position: relative;
  outline: none;
  background: none;
  opacity: 0;
  display: block;
  z-index: 2;
}

input::-webkit-slider-thumb {
  height: 26px;
  width: 26px;
  appearance: none;
  margin: none;
}

.slider-main:hover .knob {
  transform: scale(1.1);
}

.v-enter-from .progress,
.v-leave-to .progress {
  width: 36px;
}

.v-enter-active .progress,
.v-leave-active .progress {
  transition: var(--transition-m);
}
</style>