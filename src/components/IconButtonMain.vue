<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import IconMain from './IconMain.vue';

const props = defineProps<{
  name?: string,
  icon: string,
  big?: boolean,
  to?: string,
  active?: 'route' | boolean,
  type?: 'router' | 'button',
  disable?: boolean,
}>();

const emits = defineEmits<{
  (e: "click"): void,
}>();

const rotate = ["cross", "restart", "settings 1", "undo"];
</script>

<template>
  <button v-if="type == 'button'" :onclick="() => emits('click')" :disable="!!props.disable" class="iconButton">
    <icon-main :icon="icon" :active="String(props.active) != 'route' ? !!props.active : ''"
      :class="`buttonIcon ${rotate.indexOf(props.icon) != -1 ? 'rotate' : ''} ${big ? 'big' : ''}`" ref="svg" />
  </button>
  <router-link v-else :disable="!!props.disable" :to="to ? to : ''" class="iconButton">
    <icon-main :icon="icon" :active="String(props.active) != 'route' ? !!props.active : ''"
      :class="`${rotate.indexOf(props.icon) != -1 ? 'rotate' : ''} ${big ? 'big' : ''}`" ref="svg" />

  </router-link>
</template>

<style scoped>
.iconButton {
  margin: 5px;
  color: var(--text);
  opacity: 0.6;
  text-shadow: var(--icon-shadow);
  background: none;
}

svg path {
  stroke: var(--text);
  stroke-opacity: 1;
}

svg.big {
  height: 12vw;
  max-height: 60px;
  min-height: 30px;
  width: 12vw;
  max-width: 60px;
  min-width: 30px;
}

svg.big>>>path {
  stroke-width: 1.5px;
}

.iconButton:hover {
  opacity: 1;
  filter: drop-shadow(var(--icon-shadow));
}

.iconButton:has(> svg[active="true"]),
.iconButton.router-link-exact-active:not(:has(> svg[active="false"])),
.iconButton[disable="true"] {
  pointer-events: none;
}

.iconButton[disable="true"] {
  opacity: .3;
}

svg[active="true"],
a.router-link-exact-active svg:not([active="false"]) {
  filter: drop-shadow(var(--icon-glow));
}

a.router-link-exact-active:not(:has(svg[active="false"])) {
  opacity: 1;
}

/* svg.buttonIcon:active path, */
svg[active="true"]>>>path,
a.router-link-exact-active svg:not([active="false"])>>>path {
  stroke: var(--secondary);
}

.footerNav-enter-from svg,
.v-enter-from svg,
.footerNav-leave-to svg,
.v-leave-to svg {
  opacity: 0;
}

.footerNav-enter-from svg.rotate,
.v-enter-from svg.rotate {
  transform: rotate(135deg);
}

.footerNav-leave-to svg.rotate,
.v-leave-to svg.rotate {
  transform: rotate(-135deg);
}
</style>