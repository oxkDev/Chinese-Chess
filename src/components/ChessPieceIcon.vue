<script setup lang="ts">
import { ref, onMounted } from 'vue';

const props = defineProps<{
  type: "B0" |
  "B1" |
  "C0" |
  "C1" |
  "J0" |
  "J1" |
  "M0" |
  "M1" |
  "P0" |
  "P1" |
  "S0" |
  "S1" |
  "X0" |
  "X1" |
  string,
  coord: number[],
  rotate?: boolean,
  active?: boolean,
  danger?: boolean,
  attacker?: boolean,
}>();

const emits = defineEmits<{
  (e: "focus", on: boolean): void
}>();

const piece = ref();
const focus = ref(false);

onMounted(() => {
  document.addEventListener("click", () => {
    if (focus.value != (piece.value == document.activeElement) && props.active) {
      focus.value = piece.value == document.activeElement;
      if (!focus.value) setTimeout(() => emits("focus", false));
      else emits("focus", true);
    }
  });
})

</script>

<template>
  <div class="chess-piece-icon" :isPiece="type != ''" tabindex="0"
    :class="{ active: focus, mark: (danger && active && type[0] == 'J') || attacker, rotate }"
    :player="type[type.length - 1]" :draggable="type != ''" ref="piece">
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="piece-icon-svg" ref="Svg">
      <path v-if="type == 'B0'" id="B0"
        d="M4.5 14.5H7M19.5 14.5H12.5M7 9.5V14.5M7 9.5V7.34713C7 6.85829 7.35341 6.4411 7.8356 6.36073L16 5M7 9.5H12.5M12.5 14.5H7M12.5 14.5V9.5M17 9.5H12.5M7 19L9.5 16.5C10 16 10 15.5 10 15.5M17 19L14.5 16.5" />
      <path v-else-if="type == 'B1'" id="B1"
        d="M4.5 13.5H12M19.5 13.5H12M11.5 6L12.5 4.5M12 13.5V19M12 13.5V12.5M18 7H6M6 12L8.5 9.5M9 8.5C9 8.5 9 9 8.5 9.5M11 12L8.5 9.5M13 12L15.5 9.5M16 8.5C16 8.5 16 9 15.5 9.5M18 12L15.5 9.5" />
      <path v-else-if="type == 'C0'" id="C0"
        d="M9 6.5H14M19 6.5H14M8.5 16.5H14M19.5 16.5H14M14 14.5H11C10.4477 14.5 10 14.0523 10 13.5V11.5M14 14.5H17C17.5523 14.5 18 14.0523 18 13.5V11.5M14 14.5V16.5M14 14.5V11.5M14 20V16.5M14 4V6.5M14 8.5H11C10.4477 8.5 10 8.94772 10 9.5V11.5M14 8.5H17C17.5523 8.5 18 8.94772 18 9.5V11.5M14 8.5V6.5M14 8.5V11.5M18 11.5H14M10 11.5H14M7 19.5V6M7 6L4.5 8.5M7 6L9 4" />
      <path v-else-if="type == 'C1'" id="C1"
        d="M5.5 6.5H12M18.5 6.5H12M5 16.5H12M19 16.5H12M12 14.5H8C7.44772 14.5 7 14.0523 7 13.5V11.5M12 14.5H16C16.5523 14.5 17 14.0523 17 13.5V11.5M12 14.5V16.5M12 14.5V11.5M12 20V16.5M12 4V6.5M12 8.5H8C7.44772 8.5 7 8.94772 7 9.5V11.5M12 8.5H16C16.5523 8.5 17 8.94772 17 9.5V11.5M12 8.5V6.5M12 8.5V11.5M17 11.5H12M7 11.5H12" />
      <path v-else-if="type == 'J0'" id="J0"
        d="M6 18H10.5C11.0523 18 11.5 17.5523 11.5 17L11.5 14.5C11.5 13.9477 11.0523 13.5 10.5 13.5H6M6 18L6 13.5M6 18V19M6 10.5H10C10.5523 10.5 11 10.0523 11 9.5V7C11 6.44772 10.5523 6 10 6H7C6.44772 6 6 6.44772 6 7V10.5ZM6 10.5V13.5M16 19L16 6.5M16 4L16 6.5M16 6.5H14C13.4477 6.5 13 6.94772 13 7.5L13 15.5M16 6.5H18C18.5523 6.5 19 6.94772 19 7.5V14.5C19 15.0523 18.5523 15.5 18 15.5H17.5M9 3.5L8.5 5.5" />
      <path v-else-if="type == 'J1'" id="J1"
        d="M6 5.5V9C6 9.55228 6.44772 10 7 10H9M10 10H9M9 10V4.5M9 10V13M9 18.5V13M5.5 13H6.5M10 13H9M9 13H6.5M6.5 13V15.5C6.5 17.5 5.5 18.5 5.5 18.5M18 6H14M18 6L18.25 5.5M18 6C18 6 17.5 7.5 16 9M14 6L14.5 5M14 6C14 6 13.5 7 13 7.5M11 9.5L12 8.5M13 12L14.5 10.5M16 9L13 7.5M16 9L14.5 10.5M13 7.5L12 8.5M12 8.5L14.5 10.5M19 13H11.5M15 18.5H16C16.5523 18.5 17 18.0523 17 17.5V11M14 16.5L13.5 15" />
      <path v-else-if="type == 'M0'" id="M0"
        d="M14 12.5H10M14 12.5H17.5C18.0523 12.5 18.5 12.9477 18.5 13.5V17.5C18.5 18.0523 18.0523 18.5 17.5 18.5V18.5M14 12.5V10M10 12.5V10M10 12.5C10 15.5 10 16 9 18.5M17 7.5H14M10 7.5H14M10 7.5V10M10 7.5V6C10 5.44772 10.4477 5 11 5H14M14 7.5V10M14 7.5V5M17 10H14M10 10H14M17.5 5H14M12 15L12.5 16.5M14 15L14.5 16.5M16 15L16.5 16.5M7 19V5.5M7 5.5L4.5 8M7 5.5L9 3.5" />
      <path v-else-if="type == 'M1'" id="M1"
        d="M12 12.5H7M12 12.5H16.5C17.0523 12.5 17.5 12.9477 17.5 13.5V17.5C17.5 18.0523 17.0523 18.5 16.5 18.5V18.5M12 12.5V10M7 12.5V10M7 12.5C7 15.5 7 16 6 18.5M16 7.5H12M7 7.5H12M7 7.5V10M7 7.5V6C7 5.44772 7.44772 5 8 5H12M12 7.5V10M12 7.5V5M16 10H12M7 10H12M16.5 5H12M9.5 15L10 16.5M12 15L12.5 16.5M14.5 15L15 16.5" />
      <path v-else-if="type == 'P0'" id="P0"
        d="M8.00004 4.5V12.5C8.00004 14.5 7.50003 15.5 7.00003 16.5L6 18.5M10.9998 9L14.4998 4.5M13.4998 6.5H16.9999C17.5522 6.5 17.9999 6.94772 17.9999 7.5V13.5C17.9999 14.0523 17.5522 14.5 16.9999 14.5V14.5M18.4999 16.5V17C18.4999 17.5523 18.0522 18 17.4999 18H13.4998C12.9475 18 12.4998 17.5523 12.4998 17V13M12.4998 8.5H14.9999C15.5522 8.5 15.9999 8.94772 15.9999 9.5V12C15.9999 12.5523 15.5522 13 14.9999 13H12.4998M12.4998 8.5V13M12.4998 8.5V7.5M9.5 8V10.5M9.00004 14.5L10 17M6.5 11V7.5" />
      <path v-else-if="type == 'P1'" id="P1"
        d="M5.99995 6H8.99998M11.4999 6H8.99998M11.5 9L14.9999 4.5M13.9999 6.5H17.5C18.0523 6.5 18.5 6.94772 18.5 7.5V13.5C18.5 14.0523 18.0523 14.5 17.5 14.5V14.5M19 16.5V17C19 17.5523 18.5523 18 18 18H13.9999C13.4477 18 12.9999 17.5523 12.9999 17V13M12.9999 8.5H15.5C16.0523 8.5 16.5 8.94772 16.5 9.5V12C16.5 12.5523 16.0523 13 15.5 13H12.9999M12.9999 8.5V13M12.9999 8.5V7.5M5 13.5L7.5 10C8.5 8.5 9 6.5 8.99998 6M7.00004 11V11.5M7.00004 11.5H9.50004C10.0523 11.5 10.5 11.9477 10.5 12.5L10.5 16C10.5 16.5523 10.0523 17 9.50001 17H7.00004M7.00004 11.5V17M7.00004 17.5V17" />
      <path v-else-if="type == 'S0'" id="S0"
        d="M9 9.5H14.5M20 9.5H14.5M10 17.5H14.5M19 17.5H14.5M14.5 9.5V17.5M14.5 9.5V4M7.5 19V5.5M7.5 5.5L5 8M7.5 5.5L9.5 3.5" />
      <path v-else-if="type == 'S1'" id="S1" d="M4.5 9.5H12M19.5 9.5H12M6.5 17.5H12M17.5 17.5H12M12 9.5V17.5M12 9.5V4" />
      <path v-else-if="type == 'X0'" id="X0"
        d="M12 10.5H18M12 10.5L12 15M12 10.5V7C12 6.44772 12.4477 6 13 6H17C17.5523 6 18 6.44772 18 7V10.5M18 10.5L18 15M12 15L12 18.5C12 19.0523 12.4477 19.5 13 19.5H17C17.5523 19.5 18 19.0523 18 18.5L18 15M12 15H18M8 19.5V8M8 5V8M5 8H8M10.5 8H8M8 8L10 14M8 8L6.5 14C6 16 5 17.5 5 17.5" />
      <path v-else-if="type == 'X1'" id="X1"
        d="M7 15L13.5 12.5M12 10.5C12 10.5 13 11 13.5 12.5M11.5 19H13C13.5523 19 14 18.5523 14 18V15M15.5 4L13.5 6M13.5 12.5C13.5 12.5 14 14 14 15M13.5 6.5H9C8.44772 6.5 8 6.94772 8 7.5V8C8 8.55228 8.44772 9 9 9H12.5M13.5 6.5H16.5C17.0523 6.5 17.5 6.94772 17.5 7.5V8C17.5 8.55228 17.0523 9 16.5 9H12.5M13.5 6.5L12.5 9M12.5 9C12.5 9 11.5 11 10 11.5L6 13M10.5 3.5L9.5 4.5M15 4.5H9.5M9.5 4.5C9.5 4.5 8 6 7.5 6.5C7 7 6.5 7.25 5.5 7.5M7 17.5L14 15M19 17.5H18.4117C18.148 17.5 17.8949 17.3958 17.7076 17.2101L14.6809 14.2093C14.2032 13.7358 14.3199 12.9351 14.9129 12.6176L17 11.5" />
      <circle cx="12" cy="12" r="11.5" />
    </svg>
    <svg viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" class="outline-svg">
      <circle cx="15" cy="15" class="outline-circle" />
    </svg>
  </div>
</template>

<style scoped>
.chess-piece-icon {
  width: calc(100% - 6px);
  max-width: 100px;
  margin: 3px;
  aspect-ratio: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  border-radius: 100%;
  box-shadow: var(--icon-shadow);
  outline: transparent solid 5px;
}

.chess-piece-icon>.outline-svg {
  width: 100%;
  height: 100%;
  transform: scale(1.175);
  border-radius: 100%;
  position: absolute;
  top: 0px;
  left: 0px;
}

.chess-piece-icon .outline-circle {
  r: 10;
  stroke: transparent;
  stroke-width: 0px;
}

.chess-piece-icon.active .outline-circle,
.chess-piece-icon.mark .outline-circle {
  r: 14;
  stroke: var(--translucent-less);
}

.chess-piece-icon.active>.outline-svg>.outline-circle {
  stroke-width: 2px;
  /* stroke: black; */
}

.chess-piece-icon.mark .outline-circle {
  stroke-width: 1px;
}

.chess-piece-icon[isPiece="true"][player="1"] {
  background: var(--piece-rival-background);
}

.chess-piece-icon.rotate[player="1"] {
  transform: rotate(180deg);
}

.chess-piece-icon[isPiece="true"][player="0"] {
  background: var(--piece-home-background);
}

.chess-piece-icon.active[isPiece="true"],
.chess-piece-icon.mark {
  box-shadow: var(--default-glow);
}

.chess-piece-icon[isPiece="true"][player="0"] svg.piece-icon-svg {
  stroke: var(--piece-home-colour);
}

svg.piece-icon-svg {
  height: 85%;
  aspect-ratio: 1;
  filter: drop-shadow(var(--type-shadow));
  stroke: var(--piece-rival-colour);
}
</style>