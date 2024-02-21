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
  <div class="options-group">
    <div class="options-heading">
      <h3 class="Options-title">
        <slot></slot>
      </h3>
    </div>
    <options-main class="options" @on-input="val => emits('update', val)" :options="options" :def="def"></options-main>
  </div>
</template>

<style scoped>
.options-group {
  width: 100%;
  margin: 15px 0;
  /* overflow: visible; */
}

.options-heading {
  overflow: hidden;
}

.v-enter-from h3.Options-title,
.v-leave-to h3.Options-title {
  transform: translateX(-50%);
  opacity: 0;
}

.v-enter-from .options,
.v-leave-to .options {
  opacity: 0;
}
</style>