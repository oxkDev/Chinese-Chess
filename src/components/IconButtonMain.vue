<script setup lang="ts">
import { useUserStore } from '@/store';
import IconMain from './mains/IconMain.vue';

const userStore = useUserStore();

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
  <a v-if="type == 'button'" @click="() => { emits('click'); userStore.feedback(); }"
    :active="String(props.active) != 'route' ? !!props.active : ''" :disable="!!props.disable" class="icon-button-main"
    :class="{ big }">
    <icon-main :icon="icon" :class="{ rotate: rotate.includes(props.icon) }" ref="svg" />
  </a>
  <router-link v-else :onclick="() => userStore.feedback()"
    :active="String(props.active) != 'route' ? !!props.active : ''" :disable="!!props.disable" :to="to ? to : ''"
    class="icon-button-main" :class="{ big }">
    <icon-main :icon="icon" :class="{ rotate: rotate.includes(props.icon) }" ref="svg" />
  </router-link>
</template>

<style scoped>
.icon-button-main {
  height: 8vw;
  max-height: 40px;
  min-height: 15px;
  width: 8vw;
  max-width: 40px;
  min-width: 15px;
  padding: 7.5px;
  margin: 5px;
  /* padding: 10px; */
  color: var(--text);
  text-shadow: var(--icon-shadow);
  background: none;
}

.icon-button-main:not([active="true"]) {
  opacity: 0.7;
}

svg path {
  stroke: var(--text);
  stroke-opacity: 1;
}

.icon-button-main.big {
  height: 12vw;
  max-height: 60px;
  min-height: 30px;
  width: 12vw;
  max-width: 60px;
  min-width: 30px;
}

.icon-button-main.big svg:deep(path) {
  stroke-width: 1.5px;
}

.icon-button-main[disable="false"]:not([active="true"]):hover {
  opacity: 1;
  cursor: pointer;
  filter: drop-shadow(var(--icon-shadow));
}

.icon-button-main[active="true"],
.icon-button-main.router-link-exact-active:not([active="false"]),
.icon-button-main[disable="true"] {
  pointer-events: none;
}

.icon-button-main[disable="true"] {
  opacity: .3;
}

.icon-button-main[active="true"] svg,
a.router-link-exact-active:not([active="false"]) svg {
  filter: drop-shadow(var(--icon-glow));
}


.icon-button-main[active="true"],
a.router-link-exact-active.icon-button-main:not([active="false"]) {
  opacity: 1;
}

.icon-button-main[active="true"] svg:deep(path),
a.router-link-exact-active.icon-button-main:not([active="false"]) svg:deep(path) {
  stroke: var(--secondary);
}

.icon-button-main[active="true"] svg.rotate,
a.router-link-exact-active.icon-button-main:not([active="false"]) svg.rotate {
  transform: rotate(-90deg);
}

.footer-nav-enter-from.icon-button-main,
.v-enter-from .icon-button-main,
.footer-nav-leave-to.icon-button-main,
.v-leave-to .icon-button-main {
  transform: scale(.8);

  svg {
    opacity: 0;
  }
}

.footer-nav-enter-from svg.rotate,
.v-enter-from svg.rotate {
  transform: rotate(135deg);
}

.footer-nav-leave-to.icon-button-main>svg.rotate,
.v-leave-to .icon-button-main>svg.rotate {
  transform: rotate(-135deg) !important;
}
</style>./mains/IconMain.vue