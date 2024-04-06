<script setup lang="ts">
import SequenceTransition from '@/components/SequenceTransition.vue';
import ButtonMain from '@/components/mains/ButtonMain.vue';
import { ref } from 'vue';
import { errorMessage, useUserStore } from '@/store';
import TextInput from '@/components/TextInput.vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const userStore = useUserStore();

const defaultEmail = route.name == "Log In" ? userStore.getEmail || "" : "";
const form = {
  email: defaultEmail,
  password: "",
  cfmPassword: "",
};

const loading = ref(false);
const error = ref("");

// function onEnter(e: KeyboardEvent) {
//   if (e.key == "Enter") {
//     if (form.password && (form.email || route.name == 'Delete Account')) submit();
//   }
// }

async function submit(e: SubmitEvent) {
  e.preventDefault();

  if (!form.email.toLowerCase().match(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  ) && route.name != "Delete Account")
    return error.value = "The email provided is invalid";
  if (form.password.length < 8)
    return error.value = "The password should be at least 8 characters long";

  try {
    console.log("submit", form);
    // loading.value = true;

    if (route.name == "Log In") {
      await userStore.signIn({
        email: form.email,
        password: form.password
      });
    } else if (route.name == "Sign Up") {
      if (form.password != form.cfmPassword) return error.value = "The passwords do not match";
      await userStore.signUp({
        email: form.email,
        password: form.password
      });
    } else if (route.name == "Delete Account") {
      await userStore.deleteAccount(form.password).catch(e => {
        if (e.code == "auth/invalid-credential") throw { code: "The password is incorrect" };
        throw e;
      });
      console.log("delete success");
    }
    console.log("success");

    router.push("/account");
  } catch (e: any) {
    // loading.value = false;
    error.value = errorMessage[e.code] || e.code || "An unexpected error has occurred";
  }
  // loading.value = false;
}

</script>

<template>
  <form :onsubmit="async (e: SubmitEvent) => { loading = true; await submit(e); loading = false; }">
    <sequence-transition id="authentication" class="page-view">
      <transition-group :duration="5 * userStore.getSettings.animationSpeed">
        <text-input v-if="route.name != 'Delete Account'" :value="defaultEmail" key="email" name="email" type="email"
          v-model="form.email" required>User
          Email</text-input>
        <text-input key="password" name="password" type="password" v-model="form.password"
          required>Password</text-input>
        <text-input v-if="route.name == 'Sign Up'" key="cfmPassword" name="confirm-password" type="password"
          v-model="form.cfmPassword" required>Confirm Password</text-input>
        <label v-if="error" :key="error" class="error">
          <p class="auth-subtext">{{ error }}</p>
        </label>
        <button v-if="route.name == 'Log In'" type="button" key="reset" :onclick="() => router.push('/')"
          class="reset-password">
          <p class="auth-subtext">Forgot Password</p>
        </button>
        <button-main key="submit" type="submit" :disable="loading">{{ route.name }}</button-main>
      </transition-group>
    </sequence-transition>
  </form>
</template>

<style>
.reset-password,
label.error {
  display: block;
  width: 100%;
  margin: 10px 0;
  text-align: left;
  background: transparent;
  overflow: hidden;
}

label.error {
  margin: 0 0 10px;
}

label.error>p {
  height: auto;
}

.reset-password:active>p {
  letter-spacing: 1.5px;
}

.reset-password:hover>p,
.reset-password:focus>p {
  color: var(--secondary);
}

.v-enter-from p.auth-subtext {
  opacity: 0;
  transform: translateY(-100%);
}

.v-leave-to p.auth-subtext {
  opacity: 0;
  transform: translateY(100%);
}

/* #authentication .v-enter-from, */
#authentication .v-leave-active {
  position: absolute !important;
  transition-duration: 100s;
}
</style>