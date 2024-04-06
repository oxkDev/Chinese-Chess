<script setup lang="ts">
import OptionsMain from '@/components/mains/OptionsMain.vue';

defineProps<{
  options: string[],
  value?: number,
}>();

const emits = defineEmits<{
  (e: "update", value: number): void,
}>();

// const id = props.name ? props.name.toLowerCase().replaceAll(' ', '-') : undefined;

const output = defineModel<number>();
</script>

<template>
  <div class="options-group">
    <label class="group-heading">
      <h3 class="group-title">
        <slot></slot>
      </h3>
    </label>
    <options-main class="options" v-model="output" @on-input="val => emits('update', val)" :options="options"
      :value="value"></options-main>
  </div>
</template>

<style>
.options-group {
  width: 100%;
  margin: 15px 0;
}

.v-enter-from,
.v-leave-to {

  .options {
    opacity: 0;
  }
}
</style>