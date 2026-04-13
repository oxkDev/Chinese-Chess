<script setup lang="ts">
import SequenceTransition from '@/components/SequenceTransition.vue';
import TextInput from '@/components/TextInput.vue';
import ButtonMain from '@/components/mains/ButtonMain.vue';
import { errorMessage, useFireStore, useUserStore } from '@/store';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const userStore = useUserStore();
const fireStore = useFireStore();
const route = useRoute();
const router = useRouter();

const cred = ref({
  email: "",
  password: "",
  newPassword: "",
  cfmPassword: "",
});
const authenticated = ref(false);
const emailChanged = ref(false);
const loading = ref(false);
const error = ref("");

let timeout = 0;

route.meta.title = 'Welcome';

async function submit(e: SubmitEvent) {
  loading.value = true;
  error.value = "";

  e.preventDefault();

  if (!authenticated.value) {
    await userStore.reSignIn(cred.value.password).then(() => {
      authenticated.value = true;
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        authenticated.value = false;
        error.value = 'Session timeout: 2 minutes has passed';
      }, 120000);
    }).catch(e => {
      if (e.code == "auth/invalid-credential")
        error.value = "The password is incorrect";
      else
        error.value = errorMessage[e.code] || e.code || "An unexpected error has occurred";
    });
  } else {
    if (cred.value.email && !cred.value.email.toLowerCase().match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    ))
      error.value = "The email provided is invalid";

    else if (cred.value.newPassword) {
      if (cred.value.newPassword.length < 8)
        error.value = "The password should be at least 8 characters long";
      else if (cred.value.newPassword != cred.value.cfmPassword)
        error.value = "The passwords do not match";
    }

    if (!error.value)
      await userStore.updateAccount({ email: cred.value.email, newPassword: cred.value.newPassword }).then(() => {
        console.log("update success");
        clearTimeout(timeout);
        if (cred.value.email != userStore.getEmail) {
          emailChanged.value = true;
        } else {
          router.push("/account");
        }
      }).catch(e => {
        error.value = errorMessage[e.code] || e.code || "An unexpected error has occurred";
      });
  }

  loading.value = false;
}
</script>

<template>
  <form :onsubmit="submit" id="accountUpdate">
    <sequence-transition class="page-view">
      <transition-group :duration="5 * userStore.getSettings.animationSpeed">
        <template v-if="emailChanged">
          <img src="@/assets/logo/favicon-jiang (dark).svg" key="profilePicture" class="proile-picture" />
          <h3 key="credHeading" class="cred-heading">Account Updated</h3>
          <label key="info">
            <p key="credSub" class="auth-subtext">Please check your email to verify your account</p>
          </label>
          <button-main key="continue"
            :onclick="() => { fireStore.reloadUser(); router.push({ name: 'Account Profile' }) }">continue</button-main>
          <button-main key="resend" :onclick="() => { userStore.verifyEmail(); }">Resend</button-main>
        </template>

        <template v-else>
          <template v-if="authenticated">
            <text-input key="email" name="email" type="email" :value="userStore.getEmail || ''"
              v-model="cred.email">User
              Email</text-input>
            <text-input key="Password" name="New Password" type="password" v-model="cred.newPassword">
              New Password
            </text-input>
            <text-input v-if="authenticated" key="cfmPassword" name="cfmPassword" type="password"
              v-model="cred.cfmPassword" :required="!!cred.newPassword">Confirm
              Password</text-input>
          </template>
          <text-input v-else key="Password" name="Password" type="password" v-model="cred.password">
            Password
          </text-input>

          <label v-if="error" :key="error" class="error">
            <p class="auth-subtext">{{ error }}</p>
          </label>
          <button v-if="!authenticated" type="button" key="reset" :onclick="() => router.push('/')"
            class="reset-password">
            <p class="auth-subtext">Forgot Password</p>
          </button>
          <button-main :disable="loading" key="submit" type="submit">Update</button-main>
        </template>
      </transition-group>
    </sequence-transition>
  </form>
</template>

<style scoped>
#accountUpdate {
  width: 100%;
}

#profilePicture {
  width: 60%;
  align-self: center;
  transition: var(--transition-m);
  margin-bottom: 20px;
}

#accountUpdate .v-leave-active {
  position: absolute !important;
  /* transition-duration: 100s; */
}
</style>