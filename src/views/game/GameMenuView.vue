<script setup lang="ts">
import IconButtonMain from '@/components/IconButtonMain.vue';
import SettingsView from '@/views/SettingsView.vue';
import ButtonMain from '@/components/mains/ButtonMain.vue';
import { useRouter } from 'vue-router';
import { useGameStore } from '@/store';

const router = useRouter();
const gameStore = useGameStore();

const isSaved = gameStore.isSaved;

defineProps<{
  subPage: ("home" | "settings" | "restart" | ""),
}>();

const emits = defineEmits<{
  (e: "action", act: "restart" | ""): void,
  (e: "update", path: "home" | "settings" | "restart"): void,
}>();

</script>

<template>
  <transition-group name="menu" tag="div" class="menu-screen">

    <icon-button-main v-if="subPage == 'home' || !subPage" :active="subPage == 'home'" type="button" key="home"
      icon="home" :big="true" @click="emits('update', 'home')" class="menu-button"
      :class="{ active: subPage == 'home' }" />
    <icon-button-main v-if="!subPage" type="button" key="settings 1" icon="settings 1" :big="true"
      @click="emits('update', 'settings'); router.push('/game-play/settings');" class="menu-button" />
    <icon-button-main v-if="subPage == 'restart' || !subPage" :active="subPage == 'restart'" type="button" key="restart"
      icon="restart" :big="true" @click="emits('update', 'restart')" class="menu-button"
      :class="{ active: subPage == 'restart' }" />
  </transition-group>

  <transition :duration="300" mode="out-in">
    <div v-if="subPage == 'home'" class="sub-page">
      <button-main @click="gameStore.endGame(); router.push('/');">End Match</button-main>
      <button-main :disable="!isSaved" @click="gameStore.saveGame(); router.push('/')">Save Match</button-main>
    </div>
    <settings-view v-else-if="subPage == 'settings'" class="sub-page" />
    <div v-else-if="subPage == 'restart'" class="sub-page">
      <button-main @click="emits('action', 'restart'); router.push('')">Rematch</button-main>
    </div>
  </transition>
</template>

<style>
.menu-screen {
  position: absolute;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.icon-button-main.menu-button {
  margin: 2vh 0;
  z-index: 1;
  transition: var(--transition-l);
}

.menu-button.active {
  position: absolute;
  top: 25vh;
  transform: scale(1.2);
}

.sub-page {
  width: 100%;
  display: flex;
  flex-direction: column;
  z-index: 5;
}

.menuIconsGroup {
  display: block;
  height: 100%;
  width: 100%;
}

.menu-move {
  transition: var(--transition-m);
}

.menu-leave-active {
  transition-duration: 1s;
  position: relative !important;
}

.menu-leave-to,
.menu-enter-from {
  transform: scale(.9);
  opacity: 0 !important;
}
</style>