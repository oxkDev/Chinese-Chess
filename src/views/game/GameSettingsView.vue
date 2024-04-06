<script setup lang="ts">
import GameSettingsGroup from '@/components/groups/GameSettingsGroup.vue';
import ButtonMain from '@/components/mains/ButtonMain.vue';
import router from '@/router';
import { type GameSettings } from '@/store/chinese chess';
import { ref } from 'vue';
import { useGameStore } from '@/store';

const gameStore = useGameStore();

defineEmits<{
  (e: "action", act: "update" | ""): void,
}>();

const gameSettings: GameSettings = gameStore.getGame.settings;

const durations = ref({ gameDuration: gameSettings.gameDuration, turnDuration: gameSettings.turnDuration });

function save() {
  gameSettings.gameDuration = durations.value.gameDuration * 60000;
  gameSettings.turnDuration = durations.value.turnDuration * 60000;
  gameStore.setGame(gameSettings);
  router.push('/game-play');
}
</script>

<template>
  <game-settings-group v-model="durations" />
  <button-main
    :disable="durations.gameDuration * 60000 == gameSettings.gameDuration && durations.turnDuration * 60000 == gameSettings.turnDuration"
    @click="save()">Save</button-main>
</template>