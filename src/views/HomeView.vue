<script setup lang="ts">
import { useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';
import ButtonMain from '@/components/mains/ButtonMain.vue'; // @ is an alias to /src
import { useStore } from '@/store';

const router = useRouter();
const store = useStore();

const settings = store.getSettings;

const home = ref();

function transitiondelays() {
  for (let i = 0; i < home.value.children.length; i++) {
    home.value.children[i].style.setProperty("--main-delay", `${i * 0.001 * settings.animationSpeed}s`);
  }
}

onMounted(transitiondelays);

</script>

<template>
  <div id="home" ref="home">
    <button-main @click="if (store.isPlaying) router.push('/game-play'); else router.push('/two-player');">2
      Player</button-main>
    <button-main>Online</button-main>
    <button-main>Computer</button-main>
    <button-main @click="router.push('/saved');">Saved Games</button-main>
  </div>
</template>

<style>
#home {
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

#home.v-enter-active>*,
#home.v-leave-active>* {
  transition-delay: var(--main-delay);
}
</style>