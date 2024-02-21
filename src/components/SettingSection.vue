<script setup lang="ts">
import SequenceTransition from '@/components/SequenceTransition.vue';
import { Settings } from '@/store';
import { ref, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useStore } from 'vuex';

const router = useRouter();
const route = useRoute();
const store = useStore();

const settings = store.state.settings as Settings;

const props = defineProps<{
  title: string,
}>();

const section = ref();
const show = ref(false);
let timeout = 0;

watch(route, () => {
  if (route.hash != `#${props.title}` && show.value && route.path.indexOf("/settings") != -1) {
    clearTimeout(timeout);
    show.value = false;
    const elm = document.querySelector(`${route.hash}.setting-section`);
    if (elm) timeout = setTimeout(() => elm?.scrollIntoView({ behavior: "auto", inline: "nearest", block: "end" }), 5*settings.animationSpeed);
  }
});

onMounted(() => {
  const observer = new IntersectionObserver((e) => {
    show.value = e[0].isIntersecting;
    if (show.value) {
      router.push(`#${props.title}`);
      if (settings.haptic) navigator.vibrate(5);
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
  <section :id="title" class="setting-section" ref="section">
    <transition :duration="5*settings.animationSpeed">
      <sequence-transition :key="show.toString()" class="innerWrap">
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
  min-height: calc(70vh - 20px);
  padding: calc(15vh + 10px) 0;
  width: 100%;
  scroll-snap-align: start;
  overflow: visible;
}

.innerWrap {
  display: flex;
  flex-direction: column;
}

.innerWrap * {
  transition-delay: inherit;
}
</style>