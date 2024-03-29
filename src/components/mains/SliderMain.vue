<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useUserStore } from '@/store';

const userStore = useUserStore();

const input = ref();
const width = ref(36);

const props = defineProps({
  id: { type: String, default: "options" },
  max: { type: Number, default: 100 },
  value: { type: Number, default: -1 },
  step: { type: Number, defualt: 1 },
});

let defValue = props.value;

const emits = defineEmits<{
  (e: "onInput", newValue: number): void,
  (e: "onSet", newValue: number): void,
}>();

watch(props, () => {
  if (input.value && input.value.value > props.max) {
    input.value.value = props.max;
    emits("onInput", input.value.value);
  } else if (props.value != defValue) {
    defValue = props.value;
    input.value.value = defValue;
    emits("onInput", input.value.value);
  }
  setPosition();
});

function setPosition() {
  // status.value = input.value.value;
  width.value = input.value.value / props.max;
}


onMounted(() => {
  let timeouts = {
    fb: 0,
    pos: 0,
  };
  input.value.value = props.value == -1 ? props.max / 2 : props.value;
  width.value = input.value.value / props.max;
  input.value.addEventListener("input", () => {
    emits("onInput", input.value.value);
    if (!timeouts.fb && userStore.getSettings.haptic) {
      timeouts.fb = setTimeout(() => {
        timeouts.fb = 0;
        userStore.feedback();
      }, 10);
    }
    if (!timeouts.pos) {
      setPosition();
      timeouts.pos = setTimeout(() => {
        timeouts.pos = 0;
        setPosition();
      }, 0.5 * userStore.getSettings.animationSpeed);
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
.progress {
  transition: width var(--transition-s), box-shadow var(--transition-m), background var(--transition-m);
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