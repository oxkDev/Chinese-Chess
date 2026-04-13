<script setup lang="ts">
import ButtonMain from '@/components/mains/ButtonMain.vue'; // @ is an alias to /src
import SequenceTransition from '@/components/SequenceTransition.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
</script>

<template>
  <sequence-transition id="account" class="page-view" ref="account" :leave="true">
    <button-main key="login" @click="router.push('/account/login')">Log In</button-main>
    <button-main key="sign up" @click="router.push('/account/sign-up')">Sign Up</button-main>
    <button-main key="google" id="google">Google</button-main>
  </sequence-transition>
</template>

<style>
#google {
  background: none;
  outline: var(--generic) solid 2px;
}
</style>