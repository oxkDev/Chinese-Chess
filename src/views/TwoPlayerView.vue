<script setup lang="ts">
import ButtonMain from '@/components/mains/ButtonMain.vue';
import OptionsGroup from '@/components/groups/OptionsGroup.vue';
import SequenceTransition from '@/components/SequenceTransition.vue';
import GameSettingsGroup from '@/components/groups/GameSettingsGroup.vue';
import { ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

const router = useRouter();
const store = useStore();

const settings = ref();
const gameOptions = {
  names: ["home", "rival"],
  gameDuration: 0,
  turnDuration: 0,
  starter: 0,
};

function start() {
  const durations = settings.value.duration;
  gameOptions.gameDuration = parseInt(durations.game)*60000;
  gameOptions.turnDuration = parseInt(durations.turn)*60000;
  gameOptions.starter = (gameOptions.starter == 1) ? Math.round(Math.random()) : Number(gameOptions.starter == 2)
  store.commit("setGame", gameOptions);
  router.push('/game-play');
}

</script>


<template>
  <sequence-transition id="twoPlayer">
    <game-settings-group ref="settings"/>
    <options-group @update="v => { gameOptions.starter = v }" :options="['Home', 'Random', 'Rival']">Starter</options-group>
    <button-main @click="start" id="startButton">Start</button-main>
  </sequence-transition>
</template>


<style>
#twoPlayer {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 100vh;
  scroll-snap-align: start;
  overflow-y: visible;
}

.v-enter-active #startButton {
  transition-delay: .4s;
}

.v-leave-active #startButton {
  transition-delay: .2s;
}
</style>