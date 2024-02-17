<script setup lang="ts">
import ButtonMain from '@/components/mains/ButtonMain.vue';
import OptionsGroup from '@/components/groups/OptionsGroup.vue';
import SequenceTransition from '@/components/SequenceTransition.vue';
import GameSettingsGroup from '@/components/groups/GameSettingsGroup.vue';
import { ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { GameSettings } from '@/store/chinese chess';
import { GameData } from '@/store';

const router = useRouter();
const store = useStore();
const gameSettings = (store.getters.game as GameData).settings;

const settingsGroup = ref();
const gameOptions = {
  names: ["home", "rival"],
  gameDuration: 0,
  turnDuration: 0,
  starter: 0,
};

function start() {
  const durations = settingsGroup.value.duration;
  gameOptions.gameDuration = parseInt(durations.game) * 60000;
  gameOptions.turnDuration = parseInt(durations.turn) * 60000;
  gameOptions.starter = (gameOptions.starter == 1) ? Math.round(Math.random()) : Number(gameOptions.starter == 2)
  store.commit("setGame", gameOptions as GameSettings);
  router.push('/game-play');
}

</script>


<template>
  <sequence-transition id="twoPlayer">
    <game-settings-group :game-duration="gameSettings ? gameSettings.gameDuration / 60000 : undefined"
      :turn-duration="gameSettings ? gameSettings.turnDuration / 60000 : undefined" ref="settingsGroup" />
    <options-group @update="v => { gameOptions.starter = v }"
      :options="['Home', 'Random', 'Rival']">Starter</options-group>
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