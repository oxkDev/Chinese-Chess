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
    <div class="requestGroupWrap" v-if="show" :key="show.toString()">
      <h3 class="requestTitle">
        <slot />
      </h3>
      <div class="requestButtons">
        <button-main class="requestDeny"
          @click="(e: MouseEvent) => { (e.target as Element).classList.add('requestChoice'); emits('update', false) }">{{
            options[0] }}</button-main>
        <button-main class="requestAccept"
          @click="(e: MouseEvent) => { (e.target as Element).classList.add('requestChoice'); emits('update', true) }">{{
            options[1] }}</button-main>
      </div>
    </div>
  </transition>
</template>

<style>
.requestGroupWrap {
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

.blur-m .requestGroupWrap {
  background: var(--background-primary-translucent);
  backdrop-filter: var(--blur-m);
}

.requestTitle {
  margin-bottom: 15px;
  text-align: center;
}

.requestButtons {
  display: flex;
  margin: 0 -10px;
}

.requestButtons button {
  margin: 0 10px;
}

.v-enter-from.requestGroupWrap,
.v-leave-to.requestGroupWrap {
  opacity: 0;
}


.v-enter-active .requestAccept,
.requestChoice,
.v-leave-to.requestGroupWrap {
  transition-delay: calc(var(--animation-speed) * 0.1s);
}

.v-enter-from .requestTitle,
.v-leave-to .requestTitle {
  transform: translateY(-5px);
}
</style>