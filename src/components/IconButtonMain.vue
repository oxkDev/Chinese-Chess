<script setup lang="ts">
import { defineProps, defineEmits, ref } from 'vue';
import IconMain from './IconMain.vue';

const props = defineProps<{
  name?: string,
  icon: string,
  to?: string,
  active?: 'route' | boolean,
  type?: 'router' | 'button',
  disable?: boolean,
}>();

const emits = defineEmits<{
  (e: "click"): void,
}>();

const svg = ref();

const rotate = ["cross", "restart", "settings 1", "undo"];
</script>

<template>
  <button v-if="type == 'button'" :onclick="() => emits('click')" :disable="!!props.disable" :to="to ? to : ''" class="iconButton">
    <icon-main :icon="icon" :active="String(props.active) != 'route' ? !!props.active : ''"
      :class="`routerLinkIcon ${rotate.indexOf(props.icon) != -1 ? 'rotate' : ''}`" ref="svg"/>
  </button>
  <router-link v-else :disable="!!props.disable" :to="to ? to : ''" class="iconButton">
    <icon-main :icon="icon" :active="String(props.active) != 'route' ? !!props.active : ''"
      :class="`routerLinkIcon ${rotate.indexOf(props.icon) != -1 ? 'rotate' : ''}`" ref="svg"/>

  </router-link>
</template>

<style>
.iconButton {
  margin: 5px;
  color: var(--text);
  opacity: 0.8;
  text-shadow: var(--icon-shadow);
  background: none;
}

svg.routerLinkIcon path {
  stroke: var(--text);
  stroke-opacity: 1;
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
  opacity: .45;
}

svg[active="true"].routerLinkIcon,
a.router-link-exact-active svg:not([active="false"]) {
  filter: drop-shadow(var(--icon-glow));
}

svg[active="true"].routerLinkIcon path,
a.router-link-exact-active svg:not([active="false"]) path {
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