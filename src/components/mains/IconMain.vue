<script setup lang="ts">
import { ref } from 'vue';

defineProps<{
  icon: "account 1" |
  "account 2" |
  "animation" |
  "appearance" |
  "back 1" |
  "back 2" |
  "behaviour" |
  "cross" |
  "data" |
  "disable timer" |
  "forward 1" |
  "forward 2" |
  "home" |
  "menu" |
  "rank 1" |
  "rank 2" |
  "rank 3" |
  "restart" |
  "settings 1" |
  "settings 2" |
  "sound" |
  "undo" |
  "warn" |
  string,
}>();

const svg = ref();

defineExpose({
  svg,
});

</script>

<template>
  <svg viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" ref="svg">
    <g v-if="icon == 'account 1'">
      <path
        d="M21 9C21 12.3137 18.3137 15 15 15C11.6863 15 9 12.3137 9 9C9 5.68629 11.6863 3 15 3C18.3137 3 21 5.68629 21 9Z"
        stroke="white" stroke-linejoin="round" />
      <path
        d="M9.70814 18.0709C9.62963 18.025 9.54056 18 9.44962 18H9C5.68629 18 3 20.6863 3 24V28C3 28.2761 3.22386 28.5 3.5 28.5H26.5C26.7761 28.5 27 28.2761 27 28V24C27 20.6863 24.3137 18 21 18H20.5504C20.4594 18 20.3704 18.025 20.2919 18.0709C18.738 18.9794 16.9298 19.5 15 19.5C13.0702 19.5 11.262 18.9794 9.70814 18.0709Z"
        stroke="white" stroke-linejoin="round" />
    </g>
    <g v-else-if="icon == 'account 2'">
      <path
        d="M24.6814 24.4085C27.0447 21.9771 28.5 18.6585 28.5 15C28.5 7.54416 22.4558 1.5 15 1.5C7.54416 1.5 1.5 7.54416 1.5 15C1.5 18.6585 2.95529 21.9771 5.31856 24.4085M24.6814 24.4085C22.4977 21.4322 18.9745 19.5 15 19.5C11.0255 19.5 7.50235 21.4322 5.31856 24.4085M24.6814 24.4085C22.2285 26.9322 18.7973 28.5 15 28.5C11.2027 28.5 7.77152 26.9322 5.31856 24.4085M20.25 12.75C20.25 15.6495 17.8995 18 15 18C12.1005 18 9.75 15.6495 9.75 12.75C9.75 9.85051 12.1005 7.5 15 7.5C17.8995 7.5 20.25 9.85051 20.25 12.75Z"
        stroke="white" />
    </g>
    <g v-else-if="icon == 'animation'">
      <path
        d="M15 3H3.5C3.22386 3 3 3.22386 3 3.5V15M15 3H26.5C26.7761 3 27 3.22386 27 3.5V15M15 3L21 9L27 15M15 3L9 9L3 15M27 15V26.5C27 26.7761 26.7761 27 26.5 27H15M27 15L21 21L15 27M15 27H3.5C3.22386 27 3 26.7761 3 26.5V15M15 27L9 21L3 15"
        stroke="white" stroke-linejoin="round" />
    </g>
    <g v-else-if="icon == 'appearance'">
      <path
        d="M26.5 3H3.5C3.22386 3 3 3.22386 3 3.5V11.5C3 11.7761 3.22386 12 3.5 12H26.5C26.7761 12 27 11.7761 27 11.5V3.5C27 3.22386 26.7761 3 26.5 3Z"
        stroke="white" stroke-linejoin="round" />
      <path
        d="M27 18.5V26.5C27 26.7761 26.7761 27 26.5 27L18.5 27C18.2239 27 18 26.7761 18 26.5V18.5C18 18.2239 18.2239 18 18.5 18L26.5 18C26.7761 18 27 18.2239 27 18.5Z"
        stroke="white" stroke-linejoin="round" />
      <path
        d="M12 18.5V26.5C12 26.7761 11.7761 27 11.5 27H3.5C3.22386 27 3 26.7761 3 26.5V18.5C3 18.2239 3.22386 18 3.5 18H11.5C11.7761 18 12 18.2239 12 18.5Z"
        stroke="white" stroke-linejoin="round" />
    </g>
    <g v-else-if="icon == 'back 1'">
      <path d="M19.5 3L7.5 15L19.5 27" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
    </g>
    <g v-else-if="icon == 'back 2'">
      <path
        d="M3.75 15.433C3.41667 15.2406 3.41667 14.7594 3.75 14.567L24.75 2.44263C25.0833 2.25018 25.5 2.49074 25.5 2.87564L25.5 27.1244C25.5 27.5093 25.0833 27.7498 24.75 27.5574L3.75 15.433Z"
        stroke="white" stroke-linejoin="round" />
    </g>
    <g v-else-if="icon == 'behaviour'">
      <path
        d="M7.06811 3.74038L2.68863 11.2481C2.49419 11.5814 2.73462 12 3.12052 12L11.8795 12C12.2654 12 12.5058 11.5814 12.3114 11.2481L7.93189 3.74038C7.73895 3.40963 7.26105 3.40963 7.06811 3.74038Z"
        stroke="white" stroke-linejoin="round" />
      <path
        d="M27 11.5V3.5C27 3.22386 26.7761 3 26.5 3H18.5C18.2239 3 18 3.22386 18 3.5V11.5C18 11.7761 18.2239 12 18.5 12L26.5 12C26.7761 12 27 11.7761 27 11.5Z"
        stroke="white" stroke-linejoin="round" />
      <path
        d="M20.2804 27H24.7196C24.8938 27 25.0554 26.9094 25.1462 26.7607L27.5907 22.7607C27.6885 22.6007 27.6885 22.3993 27.5907 22.2393L25.1462 18.2393C25.0554 18.0906 24.8938 18 24.7196 18H20.2804C20.1062 18 19.9446 18.0906 19.8538 18.2393L17.4093 22.2393C17.3115 22.3993 17.3115 22.6007 17.4093 22.7607L19.8538 26.7607C19.9446 26.9094 20.1062 27 20.2804 27Z"
        stroke="white" stroke-linejoin="round" />
      <path
        d="M7.50002 27.375C10.1924 27.375 12.375 25.1924 12.375 22.5C12.375 19.8076 10.1924 17.625 7.50002 17.625C4.80763 17.625 2.62502 19.8076 2.62502 22.5C2.62502 25.1924 4.80763 27.375 7.50002 27.375Z"
        stroke="white" stroke-linejoin="round" />
    </g>
    <g v-else-if="icon == 'cross'">
      <path d="M25.5 4.5L15 15M4.5 4.5L15 15M25.5 25.5L15 15M4.5 25.5L15 15" stroke="white" stroke-linecap="round" />
    </g>
    <g v-else-if="icon == 'data'">
      <path d="M11.5 22.5V6M18.5 22.5V9M25.5 22.5V3M3 27H27M4.5 22.5V13.5" stroke="white" stroke-linecap="round"
        stroke-linejoin="round" />
    </g>
    <g v-else-if="icon == 'disable timer'">
      <path
        d="M15 9C10.0294 9 6 13.0294 6 18C6 22.9706 10.0294 27 15 27C19.9706 27 24 22.9706 24 18C24 13.0294 19.9706 9 15 9ZM15 9V4.5M9 4.5H15M21 4.5H15M19.5 18H15.5C15.2239 18 15 17.7761 15 18V13.5M3 27L27 3"
        stroke="white" stroke-linecap="round" stroke-linejoin="round" />
    </g>
    <g v-else-if="icon == 'forward 1'">
      <path d="M10.5 27L22.5 15L10.5 3" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
    </g>
    <g v-else-if="icon == 'forward 2'">
      <path
        d="M26.25 14.567C26.5833 14.7594 26.5833 15.2406 26.25 15.433L5.25 27.5574C4.91667 27.7498 4.5 27.5093 4.5 27.1244L4.5 2.87564C4.5 2.49074 4.91667 2.25018 5.25 2.44263L26.25 14.567Z"
        stroke="white" stroke-linejoin="round" />
    </g>
    <g v-else-if="icon == 'home'">
      <path
        d="M4.5 25.5L4.5 15.2071C4.5 15.0745 4.55268 14.9473 4.64645 14.8536L14.6464 4.85355C14.8417 4.65829 15.1583 4.65829 15.3536 4.85355L25.3536 14.8536C25.4473 14.9473 25.5 15.0745 25.5 15.2071L25.5 25.5"
        stroke="white" stroke-linecap="round" stroke-linejoin="round" />
    </g>
    <g v-else-if="icon == 'menu'">
      <path d="M27 6L3 6M27 15H3M27 24H3" stroke="white" stroke-linecap="round" />
    </g>
    <g v-else-if="icon == 'rank 1'">
      <path
        d="M15 1.50067L18.1991 11.3461L28.5514 11.3463L20.1766 17.4316L23.3755 27.2774L15 21.1929L6.62461 27.2777L9.82312 17.432L1.448 11.3468L11.8003 11.3463L15.0001 1.50067Z"
        stroke="white" stroke-linejoin="round" />
    </g>
    <g v-else-if="icon == 'rank 2'">
      <path d="M3 27V9H10.5M10.5 9V3H19.5V12M10.5 9V27M27 27V12H19.5M19.5 12V27" stroke="white" stroke-linecap="round"
        stroke-linejoin="round" />
    </g>
    <g v-else-if="icon == 'rank 3'">
      <path
        d="M10.5 3H5C4.72386 3 4.5 3.22386 4.5 3.5V27.3981C4.5 27.8277 5.00596 28.0573 5.32925 27.7744L10.5 23.25M10.5 3H19.5M10.5 3V23.25M19.5 3H25C25.2761 3 25.5 3.22386 25.5 3.5V27.3981C25.5 27.8277 24.994 28.0573 24.6707 27.7744L19.5 23.25M19.5 3V23.25M10.5 23.25L14.6799 19.7667C14.8653 19.6122 15.1347 19.6122 15.3201 19.7667L19.5 23.25"
        stroke="white" stroke-linejoin="round" />
    </g>
    <g v-else-if="icon == 'restart'">
      <path
        d="M27.99 3.51H20.4901M20.4901 3.51V11.01M20.4901 3.51L23.4853 6.51472C25.7358 8.76515 27 11.8174 27 15C27 18.1826 25.7357 21.2348 23.4853 23.4853C21.2348 25.7357 18.1826 27 15 27C11.8174 27 8.76516 25.7357 6.51472 23.4853C4.26428 21.2348 3 18.1826 3 15C3 11.8174 4.26428 8.76516 6.51472 6.51472C8.76516 4.26428 11.8174 3 15 3"
        stroke="white" stroke-linecap="round" stroke-linejoin="round" />
    </g>
    <g v-else-if="icon == 'settings 1'">
      <path
        d="M28.2113 14.5C28.39 14.8094 28.39 15.1906 28.2113 15.5L22.0387 26.1913C21.86 26.5007 21.5299 26.6913 21.1726 26.6913L8.82735 26.6913C8.47009 26.6913 8.13996 26.5007 7.96133 26.1913L1.78868 15.5C1.61004 15.1906 1.61004 14.8094 1.78868 14.5L7.96133 3.80866C8.13996 3.49925 8.47009 3.30866 8.82735 3.30866L21.1727 3.30866C21.5299 3.30866 21.86 3.49926 22.0387 3.80866L28.2113 14.5Z"
        stroke="white" stroke-linejoin="round" />
    </g>
    <g v-else-if="icon == 'settings 2'">
      <path
        d="M15 9H3M15 9C15 11.4853 17.0147 13.5 19.5 13.5C21.9853 13.5 24 11.4853 24 9M15 9C15 6.51472 17.0147 4.5 19.5 4.5C21.9853 4.5 24 6.51472 24 9M27 9H24M6 21H3M6 21C6 23.4853 8.01472 25.5 10.5 25.5C12.9853 25.5 15 23.4853 15 21M6 21C6 18.5147 8.01472 16.5 10.5 16.5C12.9853 16.5 15 18.5147 15 21M27 21H15"
        stroke="white" stroke-linecap="round" stroke-linejoin="round" />
    </g>
    <g v-else-if="icon == 'sound'">
      <path d="M9 19.5V10.5M15 27V3M21 19.5V10.5M27 22.5V7.5M3 22.5V7.5" stroke="white" stroke-linecap="round"
        stroke-linejoin="round" />
    </g>
    <g v-else-if="icon == 'undo'">
      <path
        d="M3.50999 2.01001V9.50996M3.50999 9.50996H11.01M3.50999 9.50996L6.51471 6.51468C8.76515 4.26424 11.8174 3.00001 15 3.00001C18.1826 3.00001 21.2348 4.26429 23.4853 6.51473C25.7357 8.76517 27 11.8174 27 15C27 18.1826 25.7357 21.2349 23.4853 23.4853C21.2348 25.7357 18.1826 27 15 27C11.8174 27 8.76515 25.7357 6.51471 23.4853C5.40041 22.371 4.51649 21.0481 3.91343 19.5922"
        stroke="white" stroke-linecap="round" stroke-linejoin="round" />
    </g>
    <g v-else-if="icon == 'warn'">
      <path
        d="M15 10.5V20.25M1.5766 26.25H28.4234C28.8083 26.25 29.0489 25.8333 28.8564 25.5L15.433 2.25C15.2406 1.91667 14.7594 1.91667 14.567 2.25L1.14359 25.5C0.951142 25.8333 1.1917 26.25 1.5766 26.25Z"
        stroke="white" stroke-linecap="round" stroke-linejoin="round" />
    </g>
    <g v-else>
      <path
        d="M27.5 22.5V7.5C27.5 4.73858 25.2614 2.5 22.5 2.5H7.5C4.73858 2.5 2.5 4.73858 2.5 7.5V22.5C2.5 25.2614 4.73858 27.5 7.5 27.5H22.5C25.2614 27.5 27.5 25.2614 27.5 22.5Z"
        stroke="white" stroke-linejoin="round" />
      <path d="M16.5 13.5H24.5L16.5 5.5V13.5Z" stroke="white" stroke-linejoin="round" />
      <path d="M5.5 9.5C5.5 7.29086 7.29086 5.5 9.5 5.5H13.5V13.5H5.5V9.5Z" stroke="white" stroke-linejoin="round" />
      <path d="M20.5 24C18.2909 24 16.5 22.2091 16.5 20V16.5H20C22.2091 16.5 24 18.2909 24 20.5V24H20.5Z" stroke="white"
        stroke-linejoin="round" />
      <path d="M5.50001 19.5L10.5 24.5L13.5 21.5V16.5H8.50001L5.50001 19.5Z" stroke="white" stroke-linejoin="round" />
    </g>
  </svg>
</template>

<style scoped>
svg {
  filter: drop-shadow(var(--icon-shadow));
}

path {
  stroke-width: 2px;
  stroke: var(--text);
}
</style>