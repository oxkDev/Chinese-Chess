<script setup lang="ts">
import ButtonMain from '@/components/mains/ButtonMain.vue';
import OptionsGroup from '@/components/groups/OptionsGroup.vue';
import SequenceTransition from '@/components/SequenceTransition.vue';
import GameSettingsGroup from '@/components/groups/GameSettingsGroup.vue';
import { ref } from 'vue';
import { useGameStore } from '@/store';
import { useRouter } from 'vue-router';
import { type GameSettings } from '@/store/chinese chess';

const router = useRouter();
const gameStore = useGameStore();
// const gameSettings = gameStore.getSettings;

const settingsGroup = ref({ gameDuration: 60, turnDuration: 5 });
const gameOptions = {
  type: "tp",
  names: ["home", "rival"],
  gameDuration: 0,
  turnDuration: 0,
  starter: 0,
};

function start() {
  gameOptions.gameDuration = settingsGroup.value.gameDuration * 60000;
  gameOptions.turnDuration = settingsGroup.value.turnDuration * 60000;
  gameOptions.starter = (gameOptions.starter == 1) ? Math.round((Math.random() + Math.random() + Math.random()) / 3) : Number(gameOptions.starter == 2);
  console.log(gameOptions)
  gameStore.setGame(gameOptions as GameSettings);
  router.push('/game-play');
}

</script>


<template>
  <sequence-transition id="twoPlayer">
    <game-settings-group v-model="settingsGroup" />
    <options-group v-model="gameOptions.starter" :options="['Home', 'Random', 'Rival']">Starter</options-group>
    <button-main @click="start" id="startButton">Start</button-main>
  </sequence-transition>
</template>


<style>
#twoPlayer {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: min(70vh, calc(85vh - 75px));
  scroll-snap-align: start;
  overflow-y: visible;
  padding: 15vh 0 max(15vh, 75px);
}

.v-enter-active #startButton {
  transition-delay: calc(var(--animation-speed) * 0.3s);
}

.v-leave-active #startButton {
  transition-delay: calc(var(--animation-speed) * 0.2s);
}
</style>