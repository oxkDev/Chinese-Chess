<script setup lang="ts">
import SequenceTransition from '@/components/SequenceTransition.vue';
import TextInput from '@/components/TextInput.vue';
import ButtonMain from '@/components/mains/ButtonMain.vue';
import { useFireStore, useUserStore } from '@/store';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const userStore = useUserStore(), fireStore = useFireStore();
const router = useRouter();

const username = ref(userStore.user?.username || userStore.getEmail?.split('@')[0] || '');

const loading = ref(false);
const error = ref("");

async function submit(e: SubmitEvent) {
  e.preventDefault();

  loading.value = true;
  await userStore.updateUserData({ username: username.value }).then(() => {
    console.log("save success");
    router.push("/account");
  }).catch(e => {
    error.value = e.code || "An unexpected error has occurred";
  });

  loading.value = false;
}
</script>

<template>
  <form :onsubmit="submit" id="accountUpdate">
    <sequence-transition class="page-view">
      <transition-group :duration="5 * userStore.getSettings.animationSpeed">
        <img src="@/assets/logo/favicon-jiang (dark).svg" key="profilePicture" class="profile-picture" />
        <text-input key="username" name="username" :value="username" v-model="username">Username</text-input>
        <button-main :disable="!username || loading" key="save" type="submit">Save</button-main>
        <label v-if="error" :key="error" class="error">
          <p class="auth-subtext">{{ error }}</p>
        </label>
      </transition-group>
    </sequence-transition>
  </form>
</template>

<style scoped>
#accountUpdate {
  width: 100%;
}

#accountUpdate .v-leave-active {
  position: absolute !important;
  transition-duration: 100s;
}
</style>