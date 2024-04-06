<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/store';

const userStore = useUserStore();

const props = defineProps<{
  options: string[],
  value?: number,
  id?: string,
}>();

const emits = defineEmits<{
  (e: "onInput", newValue: number): void,
}>();

const output = defineModel<number>();

const gap = 100 / props.options.length;
const input = ref();
const selected = ref(0);
const position = ref(0);

function setPosition() {
  selected.value = parseInt(input.value.value);
  output.value = selected.value;
  position.value = gap * input.value.value;
}

onMounted(() => {
  input.value.value = props.value || props.options.length - 2;
  setPosition();

  input.value.addEventListener("input", () => {
    setPosition();
    emits("onInput", input.value.value);
    userStore.feedback();
  });
})

</script>

<template>
  <div class="options-main">
    <input type="range" min="0" :max="options.length - 1" :id="id" ref="input">
    <div class="selector"></div>
    <ul class="options-list">
      <p v-for="(option, index) in options" :class="{ selected: selected == index }" :key="option">{{ option }}</p>
    </ul>
  </div>
</template>

<style scoped>
.options-main {
  height: 40px;
  max-width: 300px;
  width: 100%;
  margin-top: 10px;
  border-radius: 20px;
  background: var(--translucent);
  box-shadow: var(--inner-shadow);
  position: relative;
}

.options-main:hover,
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
  box-shadow: var(--default-shadow);
  position: absolute;
  top: 0;
  left: v-bind(position + "%");
  z-index: 1;
}

input {
  height: 100%;
  width: calc(100% - 10px);
  margin: 0 5px;
  background: none;
  position: relative;
  outline: none;
  display: block;
  overflow: visible;
  opacity: 0;
  z-index: 2;
}

.options-list {
  width: 100%;
  height: 100%;
  padding: 0;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  position: absolute;
  top: 0px;
  z-index: 1;

  p {
    min-width: 33%;
    text-align: center;
    font-size: 16px;
  }

  p.selected {
    /* font-weight: 500; */
    transition-delay: .2s;
    letter-spacing: 2px;
  }
}

.v-enter-from .options-main,
.v-leave-to .options-main {

  .options-main {
    transition-delay: .1s;
  }

  div.selector,
  p {
    transform: scale(.9);
  }
}
</style>