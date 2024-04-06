<script setup lang="ts">
import SequenceTransition from '@/components/SequenceTransition.vue';
import TextInput from '@/components/TextInput.vue';
import ButtonMain from '@/components/mains/ButtonMain.vue';
import { errorMessage, useFireStore, useUserStore } from '@/store';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const userStore = useUserStore(), fireStore = useFireStore();
const route = useRoute();
const router = useRouter();

const username = ref(userStore.user?.username || userStore.getEmail?.split('@')[0] || '');
const cred = ref({
  email: "",
  password: "",
  newPassword: "",
  cfmPassword: "",
});
const authenticated = ref(false);
const loading = ref(false);
const error = ref("");

let timeout = 0;

route.meta.title = 'Welcome';

async function submit(e: SubmitEvent) {
  e.preventDefault();

  if (route.name == 'Edit Profile') {
    await userStore.updateUserData({ username: username.value }).then(() => {
      console.log("save success");
      router.push("/account");
    }).catch(e => {
      error.value = e.code || "An unexpected error has occurred";
    });
  } else if (route.name == 'Update Account') {

    if (!authenticated.value) {
      await userStore.reSignIn(cred.value.password).then(() => {
        authenticated.value = true;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          authenticated.value = false;
          error.value = 'Session timeout: 2 minutes has passed';
        }, 120000);
      }).catch(e => {
        if (e.code == "auth/invalid-credential") return error.value = "The password is incorrect";
        error.value = errorMessage[e.code] || e.code || "An unexpected error has occurred";
      });
    } else {
      if (cred.value.email && !cred.value.email.toLowerCase().match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      ))
        return error.value = "The email provided is invalid";
      if (cred.value.newPassword) {

        if (cred.value.newPassword.length < 8)
          return error.value = "The password should be at least 8 characters long";
        if (cred.value.newPassword != cred.value.cfmPassword)
          return error.value = "The passwords do not match";
      }

      await userStore.updateAccount({ email: cred.value.email, newPassword: cred.value.newPassword }).then(() => {
        console.log("update success");
        router.push("/account");
      }).catch(e => {
        error.value = errorMessage[e.code] || e.code || "An unexpected error has occurred";
      });
    }
  }
}
</script>

<template>
  <form :onsubmit="async (e: SubmitEvent) => { loading = true; await submit(e); loading = false; }" id="accountUpdate">
    <sequence-transition class="page-view">
      <transition-group :duration="5 * userStore.getSettings.animationSpeed">
        <template v-if="route.name == 'Edit Profile'">

          <img src="@/assets/logo/favicon-jiang (dark).svg" key="profilePicture" id="profilePicture" />
          <text-input key="username" name="username" :value="username" v-model="username">Username</text-input>
          <button-main :disable="!username || loading" key="save" type="submit">Save</button-main>
        </template>
        <template v-else>
          <template v-if="authenticated">
            <text-input key="email" name="email" type="email" :value="userStore.getEmail || ''"
              v-model="cred.email">Uesr
              Email</text-input>
            <text-input key="newPassword" name="newPassword" type="password" v-model="cred.newPassword">New
              Password</text-input>
            <text-input key="cfmPassword" name="cfmPassword" type="password" v-model="cred.cfmPassword" required>Confirm
              Password</text-input>
          </template>
          <template v-else>
            <text-input key="password" name="password" type="password" v-model="cred.password"
              required>Password</text-input>
          </template>
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

<style>
#accountUpdate {
  width: 100%;
}

#profilePicture {
  width: 60%;
  align-self: center;
  transition: var(--transition-m);
  margin-bottom: 20px;
}

.cred-heading {
  margin-top: 10px;
}

#accountUpdate .v-leave-active {
  position: absolute !important;
  transition-duration: 100s;
}
</style>