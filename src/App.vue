<script setup lang="ts">
import IconButtonMain from "@/components/IconButtonMain.vue";
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import { Settings } from "./store";

const route = useRoute();
const store = useStore();

const settings = ref(store.state.settings as Settings);

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

watch(store.state.settings, () => {
  styleElmSheet?.deleteRule(0);
  setSettingsRules();
});

function getTitle(): string | undefined {
  if (route.meta.title) return route.meta.title?.toString();
  const hashMeta = route.meta.hash as { [hash: string]: string };
  return hashMeta ? hashMeta[route.hash] : "";
}

</script>

<template>
  <div id="main">
    <div id="title">
      <transition name="title" :duration="500">
        <h1 :key="route.fullPath">{{ getTitle() }}</h1>
      </transition>
    </div>

    <router-view v-slot="{ Component }">
      <transition :enter-from-class="`v-enter-from ${route.meta.transition?.toString()}`"
        :leave-to-class="`v-leave-to ${route.meta.transition?.toString()}`" mode="out-in"
        :duration="{ enter: 10 * settings.animationSpeed, leave: route.meta.fast ? 4 * settings.animationSpeed : 7 * settings.animationSpeed }">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>

  <transition :duration="500" enter-from-class="footer v-enter-from" leave-to-class="footer v-enter-from">
    <footer v-if="String(route.meta.footer) != 'undefined'" :key="route.meta.footer?.toString()">
      <nav class="navbar main" id="footer">
        <transition-group name="footerNav" :duration="500">
          <icon-button-main v-for="(value, key) in route.meta.footer" active="route" :key="key" :to="value" :icon="key" />
        </transition-group>
      </nav>
    </footer>
  </transition>
</template>

<style>
:root {
  color-scheme: dark;

  --primary: #3D68A9;
  --secondary: #2A8FAF;
  --background-primary: #232527;
  --background-secondary: #2B3D51;
  --text: #FFFFFF99;
  --generic: #FFF;
  --contrast: #000;
  --light: #FFF;
  --dark: #000;

  --translucent: #FFFFFF19;
  /* 10% */
  --translucent-less: #FFFFFF40;
  /* 25% */
  --contrast-translucent: #00000040;
  /* 25% */
  --contrast-translucent-less: #00000066;
  /* 40% */
  --background-primary-translucent: #232527B3;
  /* 70% */
  --primary-translucent: #3d68a94d;
  /* 25% */
  --secondary-translucent: #2a90af4d;
  /* 25% */

  --piece-home-background: var(--light);
  --piece-home-colour: var(--background-primary);
  --piece-rival-background: var(--background-secondary);
  --piece-rival-colour: var(--light);

  --default-shadow: 0 0 20px var(--contrast-translucent);
  --default-glow: 0 0 15px var(--primary-translucent);
  --icon-shadow: 0 0 5px var(--contrast-translucent-less);
  --icon-glow: 0 0 5px var(--secondary-translucent);
  --inner-shadow: inset 0 0 10px var(--contrast-translucent);
  --overlay-shadow: 0 0 20px var(--background-primary-translucent);

  --blur-l: blur(25px);
  --blur-m: blur(10px);

  --font-title: 700 20px/30px Roboto;
  --font-label: 300 18px/30px Roboto;
  --font-heading-1: 300 16px/30px Roboto;
  --font-subtitle: 300 14px/20px Roboto;

  --transition-s: all calc(0.2s * var(--animation-speed)) ease;
  --transition-m: all calc(0.4s * var(--animation-speed)) ease;
  --transition-l: all calc(0.7s * var(--animation-speed)) ease;

  /* --transition-s: all .1s ease;
  --transition-m: all .2s ease;
  --transition-l: all .4s ease; */
}

html {
  background: var(--background-primary);
}

body {
  width: 100%;
  background: var(--background-primary);
  transition: var(--transition-l);
  overflow: hidden;
}

* {
  margin: 0;
  outline: none;
  appearance: none;
  color: var(--text);
  transition: var(--transition-m);
  -webkit-tap-highlight-color: transparent;
}

h1 {
  font: var(--font-title);
  letter-spacing: 5px;
  /* margin-right: -5px; */
  text-transform: uppercase;
  text-align: left;
}

h2 {
  height: 30px;
  font: var(--font-heading-1);
  letter-spacing: 3px;
  /* margin-right: -3px; */
  text-transform: uppercase;
}

h3 {
  height: 30px;
  font: var(--font-label);
  letter-spacing: 2px;
  /* margin-right: -2px; */
  text-transform: capitalize;
  text-align: left;
}

p {
  height: 20px;
  font: var(--font-subtitle);
  letter-spacing: 1px;
  /* margin-right: -1px; */
}

b {
  font-weight: 500;
}

button {
  overflow: hidden;
  border: none;
  outline: none;
  padding: 0px;
}

button:hover {
  cursor: pointer;
}

#app {
  width: 100vw;
  height: 100vh;
  text-align: center;
}

#main {
  height: 100%;
  max-width: 300px;
  margin: auto;
  padding: 0 30px;
}

#title {
  width: 100%;
  max-width: 300px;
  height: 30px;
  margin: auto;
  overflow: hidden;
  position: fixed;
  top: 15%;
  z-index: 100;
}

footer {
  width: 100%;
  position: fixed;
  bottom: 0px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 10;
}

nav.navbar {
  margin: 10px;
  display: flex;
  justify-content: space-around;
  border-radius: 20px;
  background-color: var(--background-primary-translucent);
}

body.blur-m nav.navbar {
  backdrop-filter: var(--blur-m);
}

nav.navbar.main {
  margin: 10px auto;
}

.v-enter-active *,
.v-enter-active.blur,
.v-leave-active.blur,
.title-enter-active * {
  transition: var(--transition-l);
}

.v-leave-active *,
.title-leave-active *,
.footerNav-enter-active,
.footerNav-leave-active,
.footerNav-move {
  transition: var(--transition-m);
}

.footerNav-leave-active {
  position: absolute;
}

.v-enter-from .footer nav,
.v-leave-to .footer nav {
  opacity: 0;
  transform: scale(.9);
}

.v-enter-from.blur,
.v-leave-to.blur {
  filter: var(--blur-l);
  opacity: 0;
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

/* Roboto */
@font-face {
  font-family: "Roboto";
  src: url("@/assets/fonts/roboto/Roboto-700.ttf") format("truetype");
  font-weight: 700;
  font-style: normal;
}

@font-face {
  font-family: "Roboto";
  src: url("@/assets/fonts/roboto/Roboto-700-Italic.ttf") format("truetype");
  font-weight: 700;
  font-style: italic;
}

@font-face {
  font-family: "Roboto";
  src: url("@/assets/fonts/roboto/Roboto-400.ttf") format("truetype");
  font-weight: 400;
  font-style: normal;
}

@font-face {
  font-family: "Roboto";
  src: url("@/assets/fonts/roboto/Roboto-400-Italic.ttf") format("truetype");
  font-weight: 400;
  font-style: italic;
}

@font-face {
  font-family: "Roboto";
  src: url("@/assets/fonts/roboto/Roboto-300.ttf") format("truetype");
  font-weight: 300;
  font-style: normal;
}

@font-face {
  font-family: "Roboto";
  src: url("@/assets/fonts/roboto/Roboto-300-Italic.ttf") format("truetype");
  font-weight: 300;
  font-style: italic;
}

/* Roboto Mono */
@font-face {
  font-family: "Roboto-Mono";
  src: url("@/assets/fonts/roboto-mono/RobotoMono.ttf") format("truetype");
  font-weight: 1 999;
  font-style: normal;
}

@font-face {
  font-family: "Roboto-Mono";
  src: url("@/assets/fonts/roboto-mono/RobotoMono-Italic.ttf") format("truetype");
  font-weight: 1 999;
  font-style: italic;
}

/* Raleway */
@font-face {
  font-family: "Raleway";
  src: url("@/assets/fonts/raleway/Raleway.ttf") format("truetype");
  font-weight: 1 999;
  font-style: normal;
}

@font-face {
  font-family: "Raleway";
  src: url("@/assets/fonts/raleway/Raleway-Italic.ttf") format("truetype");
  font-weight: 1 999;
  font-style: italic;
}


/* Lexend-Deca */
@font-face {
  font-family: "Lexend-Deca";
  src: url("@/assets/fonts/lexend-deca/LexendDeca.ttf") format("truetype");
  font-weight: 1 999;
  font-style: normal;
}

/* Montserrat */
@font-face {
  font-family: "Montserrat";
  src: url("@/assets/fonts/montserrat/Montserrat.ttf") format("truetype");
  font-weight: 1 999;
  font-style: normal;
}

@font-face {
  font-family: "Montserrat";
  src: url("@/assets/fonts/montserrat/Montserrat-Italic.ttf") format("truetype");
  font-weight: 1 999;
  font-style: italic;
}

/* Handjet */
@font-face {
  font-family: "Handjet";
  src: url("@/assets/fonts/handjet/Handjet.ttf") format("truetype");
  font-weight: 1 999;
  font-style: normal;
}
</style>
