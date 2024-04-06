<script setup lang="ts">
import { useUserStore } from '@/store';

const userStore = useUserStore();

defineProps<{
  name?: string,
  small?: boolean,
  disable?: boolean,
  active?: boolean,
  type?: "button" | "submit" | "reset",
}>();

const emits = defineEmits<{
  (e: "click", evnt: MouseEvent): void,
}>();

</script>

<template>
  <button :disabled="!!disable" class="button-main" :class="{ small, active }" :type="type"
    :onclick="(e: MouseEvent) => { if (!disable) { emits('click', e); userStore.feedback(10); } }">
    <h2 class="button-text">
      <slot></slot>
    </h2>
  </button>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
button.button-main {
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

button.button-main.small {
  max-width: 140px;
}

.button-text {
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

button.button-main::after {
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
  position: absolute;
  bottom: -25%;
  left: 20%;
  z-index: 1;
  transition: var(--transition-m);
}

button.button-main:hover {
  box-shadow: var(--default-glow);

  &::after {
    width: 120%;
    left: -10%;
    opacity: 0.15;
  }

  .button-text {
    letter-spacing: 4px;
  }
}

button.button-main:active {

  &::after {
    background-color: var(--contrast);
  }

  .button-text {
    letter-spacing: 2px;
  }
}

.v-enter-from button.button-main,
.v-leave-to button.button-main,
button.button-main.v-enter-from,
button.button-main.v-leave-to {
  /* transform: translateX(-50px); */
  transform: scale(.9);
  box-shadow: none;
  /* filter: blur(10px); */
  opacity: 0;
}

button.button-main[disabled] {
  pointer-events: none;
  background: var(--translucent);
  box-shadow: var(--inner-shadow);

  .button-text {
    opacity: .5;
  }
}
</style>
