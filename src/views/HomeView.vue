<script setup lang="ts">
import { useRouter } from 'vue-router';
// import { onMounted, ref } from 'vue';
import ButtonMain from '@/components/mains/ButtonMain.vue'; // @ is an alias to /src
import SequenceTransition from '@/components/SequenceTransition.vue';
// import { useUserStore } from '@/store';
const router = useRouter();
// const userstore = useUserStore();

// const settings = userstore.getSettings;

// const home = ref();

// function transitiondelays() {
//   for (let i = 0; i < home.value.children.length; i++) {
//     home.value.children[i].style.setProperty("--main-delay", `${i * 0.001 * settings.animationSpeed}s`);
//   }
// }

// onMounted(transitiondelays);

</script>

<template>
  <sequence-transition id="home" class="page-view" :leave="true">
    <button-main @click="router.push('/two-player');">2 Player</button-main>
    <button-main>Online</button-main>
    <button-main>Computer</button-main>
    <button-main @click="router.push('/saved');">Saved Games</button-main>
  </sequence-transition>
</template>

<style>
/* #home {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
} */

/* #home.v-enter-active>*,
#home.v-leave-active>* {
  transition-delay: var(--main-delay);
} */
</style>