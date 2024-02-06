<script setup lang="ts">
// import { Options, Vue } from 'vue-class-component';
import { defineProps, defineEmits, onMounted, ref } from 'vue';

const input = ref();

const props = defineProps<{
  name?: string,
  def?: boolean,
}>();

const emits = defineEmits<{
  (e: "click", newValue: boolean): void,
}>();

onMounted(() => {
  input.value.checked = props.def;
  input.value.addEventListener("change", () => emits("click", input.value.checked));
});

</script>

<template>
  <label class="switch">
    <span class="knob">
      <input type="checkbox" ref="input">
    </span>
  </label>
</template>

<style scoped>
input {
  opacity: 0;
  height: 0;
  width: 0;
}

.switch {
  height: 36px;
  width: 70px;
  border-radius: 20px;
  background: var(--translucent);
  box-shadow: var(--inner-shadow);
  display: flex;
}

.switch:has(input:checked) {
  background: var(--primary);
  box-shadow: var(--default-shadow);
}

.switch:hover {
  cursor: pointer;
}

.switch:has(input:checked):hover {
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

.switch:hover .knob {
  transform: scale(1.1);
}

.switch:active .knob {
  width: 200%;
}

.switch:before,
.switch:after {
  content: "";
  width: 0px;
  transition: var(--transition-s);
}

.switch:has(input:checked):before,
.switch:has(input:not(:checked)):after {
  width: 100%;
  transition-delay: .1s;
}

.v-enter-from .switch,
.v-leave-to .switch {
  width: 36px;
  margin-right: 34px;
  transform: scale(.9);
}

/* .v-enter-active .switch {
  animation: forwards .5s animate ease;
}

.v-leave-active .switch {
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