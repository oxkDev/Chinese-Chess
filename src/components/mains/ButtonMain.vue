<script setup lang="ts">
import { Settings } from '@/store';
import { useStore } from 'vuex';

const settings = useStore().getters.settings as Settings;

function vibrate() {
  if (settings.haptic) navigator.vibrate(10);
}

defineProps<{
  name?: string,
  small?: boolean,
  disable?: boolean
}>();

const emits = defineEmits<{
  (e: "click", evnt: MouseEvent): void,
}>();

</script>

<template>
  <button :disabled="!!disable" class="button-main" :class="{ small }"
    :onclick="(e: MouseEvent) => { if (!disable) { emits('click', e); vibrate(); } }">
    <h2 id="text">
      <slot></slot>
    </h2>
    <!-- <div id="hover"></div> -->
  </button>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.button-main {
  width: var(--length);
  width: 100%;
  max-width: 300px;
  height: 40px;
  border-radius: 20px;
  margin: 15px 0;
  padding: 5px;
  background: var(--primary);
  box-shadow: var(--default-shadow);
  display: block;
  position: relative;
}

button.small {
  max-width: 140px;
}

#text {
  height: 100%;
  /* line-height: 100%; */
  margin: 0;
  text-overflow: ellipsis;
  text-align: center;
  vertical-align: middle;
  overflow: hidden;
  position: relative;
  z-index: 0;
}

button::after {
  content: " ";
  width: 60%;
  height: 150%;
  margin: auto;
  border-radius: 100px;
  /* box-shadow: 0 0 10px black; */
  filter: blur(20px);
  background-color: var(--generic);
  /* backdrop-filter: invert(100%); */
  opacity: 0;
  display: block;
  position: relative;
  bottom: 125%;
  z-index: 1;
  transition: var(--transition-m);
}

button:hover {
  box-shadow: var(--default-glow);
}

button:hover::after {
  width: 120%;
  opacity: 0.15;
}

button:hover #text {
  letter-spacing: 4px;
}

button:active::after {
  background-color: var(--contrast);
}

button:active #text {
  letter-spacing: 2px;
}

.v-leave-to button,
.v-enter-from button {
  /* transform: translateX(-50px); */
  transform: scale(.9);
  box-shadow: none;
  /* filter: blur(10px); */
  opacity: 0;
}

button[disabled] {
  pointer-events: none;
  background: var(--translucent);
  box-shadow: var(--inner-shadow);
}

button[disabled] #text {
  opacity: .5;
}
</style>
