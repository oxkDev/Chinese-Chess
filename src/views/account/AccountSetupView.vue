<script setup lang="ts">
import SequenceTransition from '@/components/SequenceTransition.vue';
import TextInput from '@/components/TextInput.vue';
import ButtonMain from '@/components/mains/ButtonMain.vue';
import { useFireStore, useUserStore } from '@/store';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const userStore = useUserStore(), fireStore = useFireStore();
const router = useRouter();

const username = ref(userStore.email?.split('@')[0]);

function setup() {
  if (username.value) userStore.setupAccount(username.value).then(() => router.push("/account"));
}

addEventListener("keypress", e => {
  if (e.key == "Enter") setup();
});
</script>

<template>
  <sequence-transition id="accountSetup" class="page-view">
    <img src="@/assets/logo/favicon-jiang (dark).svg" class="profile-picture" />
    <text-input name="username" :value="username" v-model="username">Username</text-input>
    <button-main :disable="!username" @click="setup()">Confirm</button-main>
  </sequence-transition>
</template>

<style>
</style>