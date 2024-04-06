<script setup lang="ts">
import SequenceTransition from '@/components/SequenceTransition.vue';
import TextInput from '@/components/TextInput.vue';
import ButtonMain from '@/components/mains/ButtonMain.vue';
import { useUserStore } from '@/store';
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const userStore = useUserStore();
const route = useRoute();

const username = ref(userStore.email?.split('@')[0]);

route.meta.title = 'Welcome';

function setup() {
  if (username.value) userStore.setupAccount(username.value);
}

addEventListener("keypress", e => {
  if (e.key == "Enter") setup();
});
</script>

<template>
  <sequence-transition id="accountSetup" class="page-view">
    <img src="@/assets/logo/favicon-jiang (dark).svg" id="userPicture" />
    <text-input name="username" :value="username" v-model="username">Username</text-input>
    <button-main :disable="!username" @click="setup()">Confirm</button-main>
  </sequence-transition>
</template>

<style>
#userPicture {
  width: 60%;
  align-self: center;
  transition: var(--transition-m);
  margin-bottom: 20px;
}
</style>