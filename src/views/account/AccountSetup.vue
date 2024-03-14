<script setup lang="ts">
import SequenceTransition from '@/components/SequenceTransition.vue';
import TextInput from '@/components/TextInput.vue';
import ButtonMain from '@/components/mains/ButtonMain.vue';

</script>

<template>
  <sequence-transition>
    <text-input name="username">Username</text-input>
    <button-main>Confirm</button-main>
  </sequence-transition>
</template>

<style></style>