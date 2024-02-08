<script setup lang="ts">
import { useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';
import ButtonMain from '@/components/mains/ButtonMain.vue'; // @ is an alias to /src
import { useStore } from 'vuex';
import { Settings } from '@/store';

const router = useRouter();
const store = useStore();

const settings = store.state.settings as Settings;

const home = ref();

function twoPlayer() { router.push("/two-player") }

function transitiondelays() {
  for (let i = 0; i < home.value.children.length; i++) {
    home.value.children[i].style.transitionDelay = `${i * 0.001 * settings.animationSpeed}s`;
  }
}

// onBeforeUnmount(transitiondelays);
onMounted(transitiondelays);

</script>

<template>
  <div id="home" ref="home">
    <button-main @click="twoPlayer">2 Player</button-main>
    <button-main>Online</button-main>
    <button-main>Computer</button-main>
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
</style>