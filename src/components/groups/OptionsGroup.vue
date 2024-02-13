<script setup lang="ts">
import OptionsMain from '@/components/mains/OptionsMain.vue';

defineProps<{
  options: string[],
  def?: number,
}>();

const emits = defineEmits<{
  (e: "update", value: number): void,
}>();

</script>

<template>
  <div class="optionsGroupWrap">
    <div class="optionsHeading">
      <h3 class="OptionsTitle">
        <slot></slot>
      </h3>
    </div>
    <options-main class="options" @on-input="val => emits('update', val)" :options="options" :def="def"></options-main>
  </div>
</template>

<style scoped>
.optionsGroupWrap {
  width: 100%;
  margin: 15px 0;
  /* overflow: visible; */
}

.optionsHeading {
  overflow: hidden;
}

.v-enter-from h3.OptionsTitle,
.v-leave-to h3.OptionsTitle {
  transform: translateX(-50%);
  opacity: 0;
}

.v-enter-from .options,
.v-leave-to .options {
  opacity: 0;
}
</style>