<script setup lang="ts">
import SequenceTransition from '@/components/SequenceTransition.vue';
import { ref, defineProps, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const props = defineProps<{
  title: string,
}>();

const section = ref();
const show = ref(false);
let timeout = 0;

watch(route, () => {
  if (route.hash && route.hash != `#${props.title}` && show.value && route.path == '/settings') {
    clearTimeout(timeout);
    show.value = false;
    const elm = document.querySelector(route.hash);
    if (elm) timeout = setTimeout(() => elm?.scrollIntoView({ behavior: "auto", inline: "nearest", block: "end" }), 500);
  }
});

onMounted(() => {
  const observer = new IntersectionObserver((e) => {
    show.value = e[0].isIntersecting;
    if (show.value) {
      router.push(`#${props.title}`);
    }
  }, {
    root: section.value.parentElement,
    rootMargin: "0px",
    threshold: 0.75,
  });

  observer.observe(section.value);
});

</script>

<template>
  <section :id="title" ref="section">
    <transition :duration="500">
      <sequence-transition :key="show.toString()">
        <slot v-if="show" />
      </sequence-transition>
    </transition>
  </section>
</template>

<style scoped>
section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 100vh;
  width: 100%;
  scroll-snap-align: start;
  overflow-y: hidden;
}

div {
  display: flex;
  flex-direction: column;
}

div * {
  transition-delay: inherit;
}
</style>