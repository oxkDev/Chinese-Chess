<script setup lang="ts">
import GameSettingsGroup from '@/components/groups/GameSettingsGroup.vue';
import ButtonMain from '@/components/mains/ButtonMain.vue';
import router from '@/router';
import { GameSettings } from '@/store/chinese chess';
import { ref } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

const gameSettings = store.getters.settings as GameSettings;

const durations = ref({ game: gameSettings.gameDuration, turn: gameSettings.turnDuration });

function save() {
  const d = {
    gameDuration: durations.value.game*60000,
    turnDuration: durations.value.turn*60000
  }
  store.commit("editGame", d);
  router.push('');
}

</script>

<template>
  <game-settings-group @update="d => durations = d" :game-duration="gameSettings.gameDuration / 60000"
    :turn-duration="gameSettings.turnDuration / 60000" />
  <button-main :disable="durations.game*60000 == gameSettings.gameDuration && durations.turn*60000 == gameSettings.turnDuration"
    @click="save()">Save</button-main>
</template>

<style></style>