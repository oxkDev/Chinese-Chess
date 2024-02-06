<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import SwitchMain from '@/components/mains/SwitchMain.vue';

defineProps<{
  def?: boolean,
}>();

const emits = defineEmits<{
  (e: "update", value: boolean): void,
}>();

</script>

<template>
  <div class="switchGroupWrap">
    <label class="switchLabel"><h3 class="switchTitle"><slot></slot></h3></label>
    <switch-main @click="val => emits('update', val)" :def="def"></switch-main>
  </div>
</template>

<style scoped>
.switchGroupWrap {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 15px 0;
  overflow: hidden;
}

.v-enter-from h3.switchTitle,
.v-leave-to h3.switchTitle {
  transform: translateX(-50%);
  opacity: 0;
}

.v-enter-from .switch,
.v-leave-to .switch {
  opacity: 0;
}
</style>