<script setup lang="ts">
import ButtonMain from '@/components/mains/ButtonMain.vue'; // @ is an alias to /src
import SequenceTransition from '@/components/SequenceTransition.vue';
import { useUserStore } from '@/store';
import { useRouter, useRoute } from 'vue-router';
import AccountProfileView from './account/AccountProfileView.vue';
import AccountSetupView from './account/AccountSetupView.vue';

const router = useRouter();
const route = useRoute();

const userStore = useUserStore();
const settings = userStore.getSettings;

</script>

<template>
  <router-view v-slot="{ Component }">
    <transition mode="out-in" :enter-from-class="`v-enter-from ${route.meta.transition?.toString()}`"
      :leave-to-class="`v-leave-to ${route.meta.transition?.toString()}`"
      :duration="{ enter: 10 * settings.animationSpeed, leave: route.meta.fast ? 4 * settings.animationSpeed : 7 * settings.animationSpeed }">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<style>
#google {
  background: none;
  outline: var(--generic) solid 2px;
}
</style>