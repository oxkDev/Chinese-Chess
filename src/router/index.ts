import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import AccountView from '@/views/AccountView.vue';
import HomeView from '@/views/HomeView.vue';
import SettingsView from '@/views/SettingsView.vue';
import TwoPlayerView from '@/views/TwoPlayerView.vue';
import SavedGamesView from '@/views/SavedGamesView.vue';
import GamePlayView from '@/views/game/GamePlayView.vue';
import { useStore } from '@/store';

const homeFooter = {
  "account": "/account",
  "home": "/",
  "settings 1": "/settings",
}

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    meta: { footer: homeFooter },
  },{
    path: '/account',
    name: 'Account',
    component: AccountView,
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
    path: '/saved',
    name: 'Saved Games',
    component: SavedGamesView,
    meta: { title: 'Saved Games', transition: 'blur', fast: true, footer: { 'cross': '/' } },
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
  history: createWebHistory(import.meta.env.BASE_URL),
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

  if (store.isPlaying && to.path.indexOf('game-play') == -1)
    next({ name: 'Game Play' });
  else if (to.path.indexOf('game-play') != -1 && !store.getGame)
    next({ name: '2 Player' });
  else
    next();

})

export default router