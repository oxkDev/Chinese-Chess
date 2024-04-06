<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useUserStore } from '@/store';

const userStore = useUserStore();

const input = ref();

defineProps<{
  name?: string,
  value?: boolean,
  id?: string,
}>();

const emits = defineEmits<{
  (e: "click", newValue: boolean): void,
}>();

onMounted(() => {
  // input.value.checked = props.value;
  input.value.addEventListener("change", () => {
    emits("click", input.value.checked);
    userStore.feedback();
  });
});

</script>

<template>
  <label class="switch-main" :for="id">
    <span class="knob">
      <input type="checkbox" ref="input" :id="id" :checked="value">
    </span>
  </label>
</template>

<style scoped>
input {
  opacity: 0;
  height: 0;
  width: 0;
}

.switch-main {
  height: 36px;
  width: 70px;
  border-radius: 20px;
  background: var(--translucent);
  box-shadow: var(--inner-shadow);
  display: flex;
}

.switch-main:has(input:checked) {
  background: var(--primary);
  box-shadow: var(--default-shadow);
}

.switch-main:hover {
  cursor: pointer;
}

.switch-main:has(input:checked):hover {
  box-shadow: var(--default-glow);
}

.knob {
  height: 26px;
  width: calc(100% - 15px);
  min-width: 26px;
  margin: 5px;
  border-radius: 20px;
  background: var(--contrast-translucent);
  box-shadow: var(--default-shadow);
}

.switch-main:hover .knob {
  transform: scale(1.1);
}

.switch-main:active .knob {
  width: 200%;
}

.switch-main:before,
.switch-main:after {
  content: "";
  width: 0px;
  transition: var(--transition-s);
}

.switch-main:has(input:checked):before,
.switch-main:has(input:not(:checked)):after {
  width: 100%;
  transition-delay: calc(var(--animation-speed) * .1s);
}

.v-enter-from .switch-main,
.v-leave-to .switch-main {
  width: 36px;
  margin-right: 34px;
  transform: scale(.9);
}

/* .v-enter-active .switch-main {
  animation: forwards .5s animate ease;
}

.v-leave-active .switch-main {
  animation: forwards reverse .5s animate ease;
}

@keyframes animate {
  0% {
    width: 36px;
    margin-right: 34px;
    transform: scale(.9);
  }
  
  25% {
    width: 36px;
    margin-right: 34px;
  }

  75% {
    transform: scale(1);
  }
  
  100% {
    width: 70px;
    margin-right: 0px;
  }
} */
</style>