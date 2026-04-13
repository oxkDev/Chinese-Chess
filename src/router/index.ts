import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import { useFireStore, useGameStore, useUserStore } from '@/store';
import AccountView from '@/views/AccountView.vue';
import AuthenticationView from '@/views/account/AuthenticationView.vue';
import AccountVerifyView from '@/views/account/AccountVerifyView.vue';
import AccountSetupView from '@/views/account/AccountSetupView.vue';
import HomeView from '@/views/HomeView.vue';
import SettingsView from '@/views/SettingsView.vue';
import TwoPlayerView from '@/views/TwoPlayerView.vue';
import SavedGamesView from '@/views/SavedGamesView.vue';
import GamePlayView from '@/views/game/GamePlayView.vue';
import GameMenuView from '@/views/game/GameMenuView.vue';
import GameSettingsView from '@/views/game/GameSettingsView.vue';
import AccountSignedOutView from '@/views/account/AccountSignedOutView.vue';
import AccountProfileView from '@/views/account/AccountProfileView.vue';
import EditDetailsView from '@/views/account/EditDetailsView.vue';
import UpdateCredentialsView from '@/views/account/UpdateCredentialsView.vue';

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
    // name: 'Account',
    component: AccountView,
    children: [
      {
        path: '',
        name: 'Account Profile',
        component: AccountProfileView,
        meta: { footer: homeFooter, requiresAuth: true }
      },
      {
        path: 'verify',
        name: 'Account Verify',
        component: AccountVerifyView,
        meta: { title: 'Verify', footer: homeFooter, requiresAuth: true }
      },
      {
        path: 'setup',
        name: 'Account Setup',
        component: AccountSetupView,
        meta: { title: 'Welcome', footer: homeFooter, requiresAuth: true }
      },
      {
        path: 'edit',
        name: 'Edit Profile',
        component: EditDetailsView,
        meta: { title: 'Edit Profile', transition: 'blur', fast: true, footer: { 'back': '/account' }, requiresAuth: true }
      },
      {
        path: 'update',
        name: 'Update Account',
        component: UpdateCredentialsView,
        meta: { title: 'Update', transition: 'blur', fast: true, footer: { 'back': '/account#actions' }, requiresAuth: true }
      },
      {
        path: 'delete',
        name: 'Delete Account',
        component: AuthenticationView,
        meta: { title: 'Delete', transition: 'blur', fast: true, footer: { 'back': '/account#actions' }, requiresAuth: true }
      },
      {
        path: '',
        name: 'Signed Out',
        component: AccountSignedOutView,
        meta: { footer: homeFooter, requiresAuth: false }
      },
      {
        path: 'login',
        name: 'Log In',
        component: AuthenticationView,
        meta: { title: 'Log In', transition: 'blur', fast: true, footer: { 'back': '/account' }, requiresAuth: false }
      },
      {
        path: 'sign-up',
        name: 'Sign Up',
        component: AuthenticationView,
        meta: { title: 'Sign Up', transition: 'blur', fast: true, footer: { 'back': '/account' }, requiresAuth: false }
      },
    ]
  },
  // {
  //   path: '/account/edit',
  //   name: 'Edit Profile',
  //   component: UpdateDetailsView,
  //   meta: { title: 'Edit Profile', transition: 'blur', fast: true, footer: { 'cross': '/account' } }
  // },
  // {
  //   path: '/account/update',
  //   name: 'Update Account',
  //   component: UpdateDetailsView,
  //   meta: { title: 'Update', transition: 'blur', fast: true, footer: { 'cross': '/account#actions' } }
  // },
  // {
  //   path: '/account/delete',
  //   name: 'Delete Account',
  //   component: AuthenticationView,
  //   meta: { title: 'Delete', transition: 'blur', fast: true, footer: { 'cross': '/account#actions' } }
  // },
  // {
  //   path: '/account/login',
  //   name: 'Log In',
  //   component: AuthenticationView,
  //   meta: { title: 'Log In', transition: 'blur', fast: true, footer: { 'cross': '/account' } }
  // },
  // {
  //   path: '/account/sign-up',
  //   name: 'Sign Up',
  //   component: AuthenticationView,
  //   meta: { title: 'Sign Up', transition: 'blur', fast: true, footer: { 'cross': '/account' } }
  // },
  // {
  //   path: '/account/verify',
  //   name: 'Account Verify',
  //   component: AccountVerifyView,
  //   meta: { title: 'Verify', footer: homeFooter }
  // },
  // {
  //   path: '/account/setup',
  //   name: 'Account Setup',
  //   component: AccountSetupView,
  //   meta: { title: 'Welcome', footer: homeFooter }
  // },
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
      sideNav: {
        "appearance": "#appearance",
        "sound": "#sound",
        "animation": "#animation",
        "behaviour": "#behaviour",
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

router.beforeEach(async (to, from, next) => {

  document.title = `Chinese Chess | ${to.name?.toString()}`;

  const gameStore = useGameStore();
  const userStore = useUserStore();
  const fireStore = useFireStore();
  await fireStore.getStatus();

  if (gameStore.isPlaying) {
    if (!to.path.includes('game-play'))
      return next({ name: 'Game Play' });
  } else if (to.path.includes('game-play')) {
    return next({ name: '2 Player' });
  }

  if (to.path.includes('account')) {
    if (userStore.isLoggedIn) {
      if (!to.meta.requiresAuth) { // fallback account page for signed in users
        console.info('Signed in, redirecting to account profile page');
        return next({ name: 'Account Profile' });
      }

      if (!userStore.isVerified && to.name != 'Account Verify') {
        return next({ name: 'Account Verify' });
      } else if (userStore.isVerified) {
        if (to.name == 'Account Verify') {
          return next({ name: 'Account Profile' });
        }

        if (!userStore.isSetup && to.name != 'Account Setup') {
          return next({ name: 'Account Setup' });
        } else if (userStore.isSetup && to.name == 'Account Setup') {
          return next({ name: 'Account Profile' });
        }
      }

    } else if (to.meta.requiresAuth) { // fallback account page for signed out users
      console.info('Not signed in, redirecting to signed out page');
      return next({ name: 'Signed Out' });
    }

  }


  next();

})

export default router