<script setup lang="ts">
import SwitchMain from '@/components/mains/SwitchMain.vue';
import { Settings } from '@/store';
import { useStore } from 'vuex';

const settings = useStore().getters.settings as Settings;

defineProps<{
  def?: boolean,
}>();

const emits = defineEmits<{
  (e: "update", value: boolean): void,
}>();

function vibrate() {
  if (settings.haptic) navigator.vibrate(5);
}

</script>

<template>
  <div class="switch-group">
    <label class="switch-label"><h3 class="switch-title"><slot></slot></h3></label>
    <switch-main @click="val => {vibrate(); emits('update', val);}" :def="def"></switch-main>
  </div>
</template>

<style scoped>
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

.v-enter-from h3.switch-title,
.v-leave-to h3.switch-title {
  transform: translateX(-50%);
  opacity: 0;
}

.v-enter-from .switch-main,
.v-leave-to .switch-main {
  opacity: 0;
}
</style>