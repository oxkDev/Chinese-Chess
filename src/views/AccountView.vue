<script setup lang="ts">
import ButtonMain from '@/components/mains/ButtonMain.vue'; // @ is an alias to /src
import SequenceTransition from '@/components/SequenceTransition.vue';
import { useUserStore } from '@/store';
import { useRouter } from 'vue-router';
import AccountProfileView from './account/AccountProfileView.vue';
import AccountSetupView from './account/AccountSetupView.vue';

const router = useRouter();

const userStore = useUserStore();
const settings = userStore.getSettings;

</script>

<template>
  <transition :duration="5 * settings.animationSpeed" mode="out-in">
    <account-profile-view v-if="userStore.isSetup" />
    <account-setup-view v-else-if="userStore.isLoggedIn" />
    <sequence-transition v-else id="account" class="page-view" ref="account" :leave="true">
      <button-main key="login" @click="router.push('/account/login')">Log In</button-main>
      <button-main key="sign up" @click="router.push('/account/sign-up')">Sign Up</button-main>
      <button-main key="google" id="google">Google</button-main>
    </sequence-transition>
  </transition>
</template>

<style>

#google {
  background: none;
  outline: var(--generic) solid 2px;
}
</style>