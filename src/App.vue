<script setup lang="ts">
import IconButtonMain from "@/components/IconButtonMain.vue";
import { useRoute } from "vue-router";

const route = useRoute();

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
        :duration="{ enter: 1000, leave: route.meta.fast ? 400 : 700 }">
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
  --primary: #3D68A9;
  --secondary: #2A8FAF;
  --background-primary: #232527;
  --background-secondary: #2B3D51;
  --text: #FFFFFF99;
  --generic: #FFF;
  --contrast: #000;
  --light: #FFF;

  --translucent: #FFFFFF19;
  /* 10% */
  --translucent-less: #FFFFFF4d;
  /* 30% */
  --contrast-translucent: #0000004d;
  /* 30% */
  --contrast-translucent-less: #00000066;
  /* 40% */
  --background-primary-translucent: #232527B3;
  /* 70% */
  --primary-translucent: #3d68a94d;
  /* 30% */
  --secondary-translucent: #2a90af4d;
  /* 30% */

  --default-shadow: 0 0 20px var(--contrast-translucent);
  --default-glow: 0 0 15px var(--primary-translucent);
  --icon-shadow: 0 0 10px var(--contrast-translucent-less);
  --icon-glow: 0 0 10px var(--secondary-translucent);
  --inner-shadow: inset 0 0 10px var(--contrast-translucent);
  --overlay-shadow: 0 0 20px var(--background-primary-translucent);

  --blur-l: 20px;
  --blur-m: 10px;

  --font-title: 700 20px/30px Roboto;
  --font-label: 300 18px/30px Roboto;
  --font-heading-1: 300 16px/30px Roboto;
  --font-subtitle: 300 14px/20px Roboto;

  --transition-s: all .2s ease;
  --transition-m: all .4s ease;
  --transition-l: all .7s ease;
}

html {
  width: 100%;
  background: var(--background-primary);
  overflow: hidden;
}

body,
* {
  margin: 0;
  outline: none;
  appearance: none;
  color: var(--text);
  transition: var(--transition-m);
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
  padding: 0 60px;
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
  backdrop-filter: blur(30px);
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
  filter: blur(var(--blur-l));
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
</style>