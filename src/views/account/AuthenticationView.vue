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

const form = {
  email: "",
  password: "",
  cfmPassword: "",
};

const loading = ref(false);
const error = ref("");

async function submit() {
  if (!form.email.toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    ) && route.name != "Delete Account") return error.value = "The email provided is invalid";
  if (form.password.length < 8) return error.value = "The password should be at least 8 characters long";

  try {
    loading.value = true;

    if (route.name == "Log In") {
      const r = await userStore.signIn({
        email: form.email,
        password: form.password
      });
      console.log(r);
    } else if (route.name == "Sign Up") {
      if (form.password != form.cfmPassword) return error.value = "The passwords do not match";
      const r = await userStore.signUp({
        email: form.email,
        password: form.password
      });
      console.log(r);
    } else {
      await userStore.deleteAccount(form.password);
      console.log("delete success");
    }
      loading.value = false;
    router.push("/account");
  } catch (e: any) {
    loading.value = false;
    error.value = errorMessage[e.code] || e.code;
    console.log("failed: ", e);
  }
}

</script>

<template>
  <sequence-transition id="authentication">
    <transition-group :duration="50 * userStore.getSettings.animationSpeed">
      <text-input v-if="route.name != 'Delete Account'" key="email" name="email" type="email"
        @update="v => form.email = v">User Email</text-input>
      <text-input key="password" name="password" type="password" @update="v => form.password = v">Password</text-input>
      <text-input v-if="route.name == 'Sign Up'" key="cfmPassword" name="confirm-password" type="password"
        @update="v => form.cfmPassword = v">Confirm Password</text-input>
      <label v-if="error" :key="error" class="error">
        <p class="auth-subtext">{{ error }}</p>
      </label>
      <button v-if="route.name == 'Log In'" key="reset" :onclick="() => router.push('/')" class="reset-password">
        <p class="auth-subtext">Forgot Password</p>
      </button>
      <button-main key="submit" :disable="loading" @click="submit()">{{ route.name }}</button-main>
    </transition-group>
  </sequence-transition>

</template>

<style>
#authentication {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
}

.reset-password,
label.error {
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

.reset-password:active > p {
  letter-spacing: 1.5px;
}

.reset-password:hover>p {
  color: var(--secondary);
}

.v-enter-from p.auth-subtext,
.v-leave-to p.auth-subtext {
  opacity: 0;
  transform: translateX(-50%);
}

/* #authentication .v-enter-from, */
#authentication .v-leave-active {
  position: absolute !important;
}
</style>