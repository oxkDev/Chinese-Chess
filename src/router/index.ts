import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import SettingsView from '@/views/SettingsView.vue';
import TwoPlayerView from '@/views/TwoPlayerView.vue';
import GamePlayView from '@/views/GamePlayView.vue';
import { useStore } from 'vuex';

const homeFooter = {
  "home": '/',
  "settings 1": "/settings",
}

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    meta: { footer: homeFooter },
  },
  {
    path: '/settings',
    name: 'Settings',
    component: SettingsView,
    meta: {
      hash: {
        "#appearance": "Appearance",
        "#sound": "Sound",
        "#animation": "Animation",
        "#behaviour": "Behaviour"
      },
      footer: homeFooter
    },
  },
  {
    path: '/two-player',
    name: '2 Player',
    component: TwoPlayerView,
    meta: { title: '2 Player', transition: 'blur', fast: true, footer: { 'cross': '/' } },
  },
  {
    path: '/game-play',
    name: 'Game Play',
    component: GamePlayView,
    meta: {
      hash: {
        "#gameSettings": "Game Settings",
        "#menu": "Menu",
      }
    },
    children: [
      {
        path: 'settings',
        name: 'menuSettings',
        component: GamePlayView,
        meta: {
          hash: {
            "#appearance": "Appearance",
            "#sound": "Sound",
            "#animation": "Animation",
            "#behaviour": "Behaviour"
          },
        }
      }
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition;
    return {
      // el: to.hash,
      behavior: "smooth",
      top: 100,
    };
  }
});

router.beforeEach((to, from, next) => {

  document.title = `Chinese Chess | ${to.name?.toString()}`;

  const store = useStore();

  if (to.path.indexOf('game-play') != -1 && !store.getters.game) {
    next({ name: '2 Player' });
  } else {
    next();
  }
})

export default router