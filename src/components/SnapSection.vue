<script setup lang="ts">
import SequenceTransition from '@/components/SequenceTransition.vue';
import { ref, onMounted, watch, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from '@/store';

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

const settings = computed(() => userStore.getSettings);

const props = defineProps<{
  title: string,
  routeName: string,
}>();

const section = ref();
const show = ref(false);
let intersecting = false;
let timeout = 0;

function scrollToSection(behaviour: "auto" | "smooth" | "instant" = "auto") {
  if (section.value) section.value.scrollIntoView({ behavior: behaviour, inline: "nearest" });
  show.value = true;
}

watch(route, () => {
  if (route.path.includes(props.routeName)) {
    clearTimeout(timeout);
    console.log(intersecting, props.title);
    if (route.hash == `#${props.title}` && !intersecting) {
      if (settings.value.animationLevel >= 1) {
        show.value = false;
        timeout = setTimeout(scrollToSection, 5 * settings.value.animationSpeed);
      } else
        scrollToSection("smooth");
    } else if (settings.value.animationLevel >= 1) {
      show.value = false;
      // if (elm) timeout = setTimeout(() => elm?.scrollIntoView({ behavior: "auto", inline: "nearest", block: "end" }), 5 * settings.animationSpeed);
    }
  }
});

onMounted(() => {
  if (route.hash == `#${props.title}`) {
    scrollToSection();
  }

  const observer = new IntersectionObserver((e) => {
    intersecting = e[0].isIntersecting;
    show.value = intersecting || settings.value.animationLevel < 1;
    if (intersecting && route.hash != `#${props.title}`) {
      router.push(`#${props.title}`);
      userStore.feedback();
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
  <section :id="title" class="snap-section" ref="section">
    <transition :duration="5 * settings.animationSpeed">
      <sequence-transition :key="show.toString()" class="innerWrap">
        <slot v-if="show" />
      </sequence-transition>
    </transition>
  </section>
</template>

<style scoped>
/* section.snap-section {
  width: 100%;
  max-width: 300px;
  min-height: var(--safe-height);
  margin: 0 auto;
  padding: var(--vertical-padding) 0;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  scroll-snap-align: start;
  overflow: visible;
} */

.innerWrap {
  display: flex;
  flex-direction: column;

  * {
    transition-delay: inherit;
  }
}
</style>