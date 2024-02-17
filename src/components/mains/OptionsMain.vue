<script setup lang="ts">
import { Settings } from '@/store';
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';

const settings = useStore().getters.settings as Settings;

const props = defineProps<{
  options: string[],
  def?: number,
}>();

const emits = defineEmits<{
  (e: "onInput", newValue: number): void,
}>();

const gap = 100 / props.options.length;
const input = ref();
const selected = ref(0);
const position = ref(0);

function setPosition() {
  emits("onInput", parseInt(input.value.value));
  position.value = gap * input.value.value;
  selected.value = input.value.value;

}

onMounted(() => {
  input.value.value = props.def ? props.def : props.options.length - 2;
  setPosition();
  input.value.addEventListener("input", () => {
    setPosition();
    if (settings.haptic) navigator.vibrate(5);
  });
})

</script>

<template>
  <div class="optionsTrack">
    <input type="range" min="0" :max="options.length - 1" ref="input">
    <div class="selector"></div>
    <ul class="optionsList">
      <p v-for="(option, index) in options" :selected="selected == index" :key="option">{{ option }}</p>
    </ul>
  </div>
</template>

<style scoped>
.optionsTrack {
  height: 40px;
  max-width: 300px;
  width: 100%;
  margin: 10px 0 0;
  border-radius: 20px;
  background: var(--translucent);
  box-shadow: var(--inner-shadow);
}

.optionsTrack:hover,
input:hover {
  cursor: pointer;
}

input:hover+.selector {
  box-shadow: var(--default-glow);
}

.selector {
  height: 100%;
  width: v-bind(gap + "%");
  min-width: 36px;
  border-radius: 20px;
  background: var(--primary);
  position: relative;
  bottom: 100%;
  left: v-bind(position + "%");
  z-index: 1;
  box-shadow: var(--default-shadow);
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

.optionsList {
  padding: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  position: relative;
  bottom: 200%;
  z-index: 1;
}

.optionsList p {
  min-width: 33%;
  text-align: center;
  font-size: 16px;
}

.optionsList p[selected="true"] {
  /* font-weight: 500; */
  transition-delay: .2s;
  letter-spacing: 2px;
}

.v-enter-from .selector,
.v-leave-to .selector,
.v-enter-from p,
.v-leave-to p {
  transform: scale(.9);
}

.v-enter-from .selector,
.v-leave-to .optionsTrack {
  transition-delay: .1s;
}
</style>