<script setup lang="ts">
import ButtonMain from '../mains/ButtonMain.vue';

defineProps<{
  options: string[] | ["decline", "accept"] | ["cancel", "ok"],
  show: boolean
}>();

const emits = defineEmits<{
  (e: "update", result: boolean): void,
}>();
</script>

<template>
  <transition>
    <div class="request-group" v-if="show" :key="show.toString()">
      <h3 class="request-title">
        <slot />
      </h3>
      <div class="request-buttons">
        <button-main class="request-deny"
          @click="(e: MouseEvent) => { (e.target as Element).classList.add('request-choice'); emits('update', false) }">{{
            options[0] }}</button-main>
        <button-main class="request-accept"
          @click="(e: MouseEvent) => { (e.target as Element).classList.add('request-choice'); emits('update', true) }">{{
            options[1] }}</button-main>
      </div>
    </div>
  </transition>
</template>

<style>
.request-group {
  width: 100%;
  max-width: 300px;
  margin: 5px 0;
  padding: 15px;
  overflow: hidden;
  position: absolute;
  left: -15px;
  border-radius: 35px;
  box-shadow: var(--overlay-shadow);
  background: var(--background-primary);
  z-index: 10;
}

.blur-m .request-group {
  background: var(--background-primary-translucent);
  backdrop-filter: var(--blur-m);
}

.request-title {
  margin-bottom: 15px;
  text-align: center;
}

.request-buttons {
  display: flex;
  margin: 0 -10px;
}

.request-buttons button.button-main {
  margin: 0 10px;
}

.v-enter-from.request-group,
.v-leave-to.request-group {
  opacity: 0;
}


.v-enter-active .request-accept,
.request-choice,
.v-leave-to.request-group {
  transition-delay: calc(var(--animation-speed) * 0.1s);
}

.v-enter-from .request-title,
.v-leave-to .request-title {
  transform: translateY(-5px);
}
</style>