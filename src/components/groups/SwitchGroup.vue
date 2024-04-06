<script setup lang="ts">
import SwitchMain from '@/components/mains/SwitchMain.vue';

defineProps<{
  value?: boolean,
}>();

const emits = defineEmits<{
  (e: "update", value: boolean): void,
}>();

const output = defineModel<number>();

</script>

<template>
  <div class="switch-group">
    <label class="switch-label">
      <h3 class="group-title">
        <slot></slot>
      </h3>
    </label>
    <switch-main v-model="output" @click="val => emits('update', val)" :value="value"></switch-main>
  </div>
</template>

<style>
.switch-group {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 15px 0;
  overflow: visible;
}

label.switch-label {
  overflow: hidden;
}

.v-enter-from,
.v-leave-to {
  
  .switch-main {
    opacity: 0;
  }
}
</style>