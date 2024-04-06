<script setup lang="ts">
import IconButtonMain from '@/components/IconButtonMain.vue';
import ButtonMain from '@/components/mains/ButtonMain.vue';
import { useRoute, useRouter } from 'vue-router';
import { useGameStore, useUserStore } from '@/store';

const route = useRoute();
const router = useRouter();
const gameStore = useGameStore();
const settings = useUserStore().getSettings;

// const subPage = ref("");

// defineProps<{
//   subPage: ("home" | "settings" | "restart" | ""),
// }>();

const emits = defineEmits<{
  (e: "action", act: "restart" | ""): void,
}>();

</script>

<template>
  <transition-group name="menu" tag="div" class="menu-screen">

    <icon-button-main v-if="route.hash == '#home' || !route.hash" :active="route.hash == '#home'" type="button"
      key="home" icon="home" :big="true" @click="router.push('#home')" class="menu-button" />
    <icon-button-main v-if="!route.hash" type="button" key="settings 1" icon="settings 1" :big="true"
      @click="router.push({ name: 'Menu Settings' });" class="menu-button" />
    <icon-button-main v-if="route.hash == '#restart' || !route.hash" :active="route.hash == '#restart'" type="button"
      key="restart" icon="restart" :big="true" @click="router.push('#restart')" class="menu-button" />
  </transition-group>

  <transition :duration="300" mode="out-in">
    <div v-if="route.hash == '#home'" class="sub-page">
      <button-main @click="gameStore.endGame(); router.push('/');">End Match</button-main>
      <button-main :disable="!gameStore.isSaved" @click="gameStore.saveGame(); router.push('/')">Save
        Match</button-main>
    </div>
    <div v-else-if="route.hash == '#restart'" class="sub-page">
      <button-main @click="emits('action', 'restart'); router.push({ name: 'Game Play' })">Rematch</button-main>
    </div>
  </transition>
  <router-view v-slot="{ Component }">
    <transition :duration="500 * settings.animationSpeed">
      <component :is="Component" />
    </transition>
  </router-view>
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

.menu-button[active="true"] {
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