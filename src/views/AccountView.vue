<script setup lang="ts">
import { onMounted, ref } from 'vue';
import ButtonMain from '@/components/mains/ButtonMain.vue'; // @ is an alias to /src
import { useUserStore } from '@/store';
import { useRouter } from 'vue-router';
import { getAuth } from 'firebase/auth';
import AccountProfileView from './account/AccountProfileView.vue';

const router = useRouter();
const auth = getAuth();

const userStore = useUserStore();
const settings = userStore.getSettings;
// const user = ref(userStore.isLoggedIn);

// console.log(user, auth.currentUser)

const account = ref();

function transitiondelays() {
  for (let i = 0; i < account.value.children.length; i++) {
    account.value.children[i].style.setProperty("--account-delay", `${i * 0.001 * settings.animationSpeed}s`);
  }
}

onMounted(transitiondelays);
</script>

<template>
  <transition :duration="5 * settings.animationSpeed" mode="out-in">
    <div id="account" ref="account" :key="userStore.isLoggedIn.toString()">
      <account-profile-view v-if="userStore.isLoggedIn"/>
      <template v-else>
        <button-main key="login" @click="router.push('/account/login')">Log In</button-main>
        <button-main key="sign up" @click="router.push('/account/sign-up')">Sign Up</button-main>
        <button-main key="google" id="google">Google</button-main>
      </template>
    </div>
  </transition>
</template>

<style>
#account {
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

#google {
  background: none;
  outline: var(--generic) solid 2px;
}

#account.v-enter-active>*,
#account.v-leave-active>* {
  transition-delay: var(--account-delay);
}
</style>