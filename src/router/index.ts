import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import { useGameStore } from '@/store';
import AccountView from '@/views/AccountView.vue';
import AuthenticationView from '@/views/account/AuthenticationView.vue';
import HomeView from '@/views/HomeView.vue';
import SettingsView from '@/views/SettingsView.vue';
import TwoPlayerView from '@/views/TwoPlayerView.vue';
import SavedGamesView from '@/views/SavedGamesView.vue';
import GamePlayView from '@/views/game/GamePlayView.vue';
import GameMenuView from '@/views/game/GameMenuView.vue';
import GameSettingsView from '@/views/game/GameSettingsView.vue';

const homeFooter = {
  "account 1": "/account",
  "home": "/",
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
    path: '/account',
    name: 'Account',
    component: AccountView,
    meta: {
      footer: homeFooter,
      hash: {
        "#appearance": "Appearance",
        "#sound": "Sound",
        "#animation": "Animation",
        "#behaviour": "Behaviour"
      },
    },
  },
  {
    path: '/account/login',
    name: 'Log In',
    component: AuthenticationView,
    meta: { title: 'Login', transition: 'blur', fast: true, footer: { 'cross': '/account' } }
  },
  {
    path: '/account/sign-up',
    name: 'Sign Up',
    component: AuthenticationView,
    meta: { title: 'Sign Up', transition: 'blur', fast: true, footer: { 'cross': '/account' } }
  },
  {
    path: '/account/delete',
    name: 'Delete Account',
    component: AuthenticationView,
    meta: { title: 'Delete', transition: 'blur', fast: true, footer: { 'cross': '/account' } }
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
    children: [
      {
        path: 'game-settings',
        name: 'Game Settings',
        component: GameSettingsView,
        meta: {
          title: "Game Settings",
          footer: { 'cross': '/game-play' }
        }
      },
      {
        path: 'menu',
        name: 'Menu',
        component: GameMenuView,
        meta: {
          title: "Menu",
          hash: {
            '#home': 'Home',
            '#restart': 'Restart'
          }
        },
        children: [
          {
            path: 'settings',
            name: 'Menu Settings',
            component: SettingsView,
            meta: {
              hash: {
                "#appearance": "Appearance",
                "#sound": "Sound",
                "#animation": "Animation",
                "#behaviour": "Behaviour"
              },
            }
          },
        ]
      },
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

  const gameStore = useGameStore();

  if (gameStore.isPlaying) {
    // console.log("gamep")
    if (to.path.indexOf('game-play') == -1)
      return next({ name: 'Game Play' });
  } else if (to.path.indexOf('game-play') != -1) {
    // console.log("refused")
    return next({ name: '2 Player' });
  }
  next();

})

export default router