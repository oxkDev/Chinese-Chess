<script setup lang="ts">
import { onMounted, ref } from 'vue';
import ButtonMain from '@/components/mains/ButtonMain.vue'; // @ is an alias to /src
import { useStore } from 'vuex';
import { Settings } from '@/store';

const store = useStore();

const settings = store.getters.settings as Settings;

const account = ref();

function transitiondelays() {
  for (let i = 0; i < account.value.children.length; i++) {
    account.value.children[i].style.setProperty("--account-delay", `${i * 0.001 * settings.animationSpeed}s`);
  }
}

onMounted(transitiondelays);

</script>

<template>
  <div id="account" ref="account">
    <button-main>Log In</button-main>
    <button-main>Sign Up</button-main>
    <button-main id="google">Google</button-main>
  </div>
</template>

<style>
#account {
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

#google {
  background: none;
  outline: var(--generic) solid 2px;
}

#account.v-enter-active > *,
#account.v-leave-active > * {
  transition-delay: var(--account-delay);
}
</style>