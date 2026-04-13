<script setup lang="ts">
import IconButtonMain from "@/components/IconButtonMain.vue";
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useGameStore, useUserStore } from "./store";
import router from "./router";

const route = useRoute();
const userStore = useUserStore();
const gameStore = useGameStore();

let settings = ref({ ...userStore.getSettings });

const styleElm = document.createElement("style");
document.head.appendChild(styleElm);
styleElm.id = "variables";
const styleElmSheet = styleElm.sheet;

const headerElm = document.querySelector("meta[name='theme-color']");

function setSettingsRules() {
  const colourTheme = settings.value.colourTheme;
  headerElm?.setAttribute("content", colourTheme.backgroundPrimary);

  styleElmSheet?.insertRule(`:root {
    color-scheme: ${colourTheme.type};

    --primary: ${colourTheme.primary};
    --secondary: ${colourTheme.secondary};
    --background-primary: ${colourTheme.backgroundPrimary};
    --background-secondary: ${colourTheme.backgroundSecondary};

    --background-primary-translucent: ${colourTheme.backgroundPrimary + colourTheme.translucence.xs}; /* 70% */
    --primary-translucent: ${colourTheme.primary + colourTheme.translucence.m}; /* 25% */
    --secondary-translucent: ${colourTheme.secondary + colourTheme.translucence.m}; /* 25% */

    --text: ${colourTheme.text};
    --generic: ${colourTheme.generic};
    --contrast: ${colourTheme.contrast};
    --translucent: ${colourTheme.generic + colourTheme.translucence.l}; /* 10% */
    --translucent-less: ${colourTheme.generic + colourTheme.translucence.m}; /* 25% */
    --contrast-translucent: ${colourTheme.contrast + colourTheme.translucence.m}; /* 25% */
    --contrast-translucent-less: ${colourTheme.contrast + colourTheme.translucence.s}; /* 40% */
    
    --default-shadow: 0 0 20px ${colourTheme.shadow.default};
    --default-glow: 0 0 15px ${colourTheme.glow.default};
    --icon-shadow: 0 0 5px ${colourTheme.shadow.icon};
    --icon-glow: 0 0 5px ${colourTheme.glow.icon};
    --inner-shadow: inset 0 0 10px ${colourTheme.shadow.default};

    --piece-home-background: ${colourTheme.pieceHome.background};
    --piece-home-colour: ${colourTheme.pieceHome.colour};
    --piece-rival-background: ${colourTheme.pieceRival.background};
    --piece-rival-colour: ${colourTheme.pieceRival.colour};

    --animation-speed: ${settings.value.animationSpeed / 100};
  }`, 0);
  for (let i = 1; i < 5; i++) document.body.classList.toggle(`animate-${i}`, i <= settings.value.animationLevel);
  document.body.classList.toggle("blur-m", settings.value.blur >= 1);
  document.body.classList.toggle("blur-l", settings.value.blur >= 2);
}

setSettingsRules();

console.info("reload");

watch(userStore, () => {
  settings.value = userStore.getSettings;
  styleElmSheet?.deleteRule(0);
  setSettingsRules();
});

addEventListener("storage", () => {
  if (gameStore.isPlaying && route.path.indexOf('game-play') == -1) router.push('/game-play');
});

function getTitle(): string {
  if (route.meta) {
    const hashMeta = route.meta.hash as { [hash: string]: string };
    if (hashMeta && hashMeta[route.hash]) return hashMeta[route.hash];
    if (route.meta.title) return route.meta.title?.toString();
  }
  return "";
}

</script>

<template>
  <div id="main">
    <div id="title">
      <transition name="title" :duration="5 * settings.animationSpeed">
        <h1 :key="route.fullPath">{{ getTitle() }}</h1>
      </transition>
    </div>

    <router-view v-slot="{ Component }">
      <transition mode="out-in" :enter-from-class="`v-enter-from ${route.meta.transition?.toString()}`"
        :leave-to-class="`v-leave-to ${route.meta.transition?.toString()}`"
        :duration="{ enter: 10 * settings.animationSpeed, leave: route.meta.fast ? 4 * settings.animationSpeed : 7 * settings.animationSpeed }">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>

  <transition :duration="5 * settings.animationSpeed">
    <footer v-if="route.meta.footer" :key="route.meta.footer.toString()">
      <nav class="navbar main" id="footer">
        <transition-group name="footer-nav" :duration="5 * settings.animationSpeed">
          <template v-for="(value, key) in route.meta.footer" :key="key">
            <icon-button-main v-if="key == 'back'" type="button" @click="router.push(value)" icon="cross" />
            <icon-button-main v-else active="route" :to="value" :icon="key" />
          </template>
        </transition-group>
      </nav>
    </footer>
  </transition>
</template>

<style>
#main {
  height: 100vh;
  max-width: 300px;
  margin: auto;
  padding: 0 30px;
}

#title {
  width: 100%;
  height: 30px;
  max-width: 300px;
  margin: auto;
  overflow: hidden;
  position: fixed;
  top: 15%;
  z-index: 100;
}

.title-enter-from {
  opacity: 0;
  transform: translateY(-30px);
}

.title-leave-to {
  height: 0px;
  opacity: 0;
  transform: translateY(30px);
}
</style>