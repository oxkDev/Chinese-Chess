<script setup lang="ts">
import SequenceTransition from '@/components/SequenceTransition.vue';
import ButtonMain from '@/components/mains/ButtonMain.vue';
import { useFireStore, useUserStore } from '@/store';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const userStore = useUserStore(), fireStore = useFireStore();
const router = useRouter();

const verifyLoading = ref(false);
const msg = ref("A verification link has been sent to your e-mail address.\n Please click the link to proceed.");

function verify() {
  verifyLoading.value = true;
  userStore.verifyEmail().then(() => { msg.value = "A verification link has been sent to your e-mail address.\n Please click the link to proceed." }).catch(e => {
    console.error(e);
    if (e.code == "auth/too-many-requests")
      msg.value = "Verification unsuccessful. Please wait a while before trying again.";
    else
      msg.value = "An error occurred while sending the verification link.";
  }).finally(() => {
    if (userStore.isVerified)
      router.push("/account");
    verifyLoading.value = false;
  });
}

// onMounted(verify);
</script>

<template>
  <sequence-transition id="accountVerify" class="page-view">
    <transition-group :duration="5 * userStore.getSettings.animationSpeed">
      <img src="@/assets/logo/favicon-jiang (dark).svg" class="profile-picture" key="profilePicture" />
      <h3 id="userEmail" class="user-details" key="email">{{ fireStore.firebaseData?.email }}</h3>
      <button-main :disable="verifyLoading" @click="verify()" key="verify">Verify E-Mail</button-main>
      <label v-if="msg" :key="msg" class="info error">
        <p class="auth-subtext">{{ msg }}</p>
      </label>
    </transition-group>
  </sequence-transition>
</template>

<style>

#accountVerify .v-leave-active {
  position: absolute !important;
}

#userEmail {
  text-transform: lowercase;
}
</style>