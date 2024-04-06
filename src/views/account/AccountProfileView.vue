<script setup lang="ts">
import SnapSection from '@/components/SnapSection.vue';
import SequenceTransition from '@/components/SequenceTransition.vue';
import ButtonMain from '@/components/mains/ButtonMain.vue';
import IconButtonMain from '@/components/IconButtonMain.vue';
import { useFireStore, useUserStore } from '@/store';
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import IconMain from '@/components/mains/IconMain.vue';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const user = computed(() => userStore.getUser);

const sideNav = {
  "account 2": "#profile",
  "data": "#statistics",
  "warn": "#actions",
}

const types: { [key: string]: string } = {
  "tp": "2 Player",
  "ol": "Online",
  "cp": "Computer"
}

function rankSuffix(n: number) {
  let numList = n.toString().split("").reverse();
  const prefixes: { [key: string]: string } = {
    "1": "st",
    "2": "nd",
    "3": "rd"
  }
  if (!prefixes[numList[0]] || numList[1] == "1") return "th";
  return prefixes[numList[0]]
}

function formatTiming(time: number) {
  let s = time % 60, m = Math.floor(time / 60), h = Math.floor(m / 60);

  return `${h ? h + ' : ' : ''}${m} : ${s}`;
}

const statShow = ref("");

interface Stats {
  [key: string]: {
    title: string,
    val: string | number,
    sub?: {
      [key: string]: {
        title: string,
        val: string | number,
        suffix?: string,
      }
    },
    suffix?: string,
    show?: string
  }
}

const stats = computed((): Stats => {
  const raw = userStore.getStatistics
  let totals: Stats = {};
  for (const i of Object.keys(raw)) {
    if (["games", "wins", "moves"].includes(i)) {
      totals[i] = { title: `Total ${i}`, val: raw[i]["tp"] + raw[i]["cp"] + raw[i]["ol"], show: i };
      totals[i].sub = {
        "tp": { title: "2 Player", val: raw[i]["tp"] },
        "cp": { title: "Computer", val: raw[i]["cp"] },
        "ol": { title: "Online", val: raw[i]["ol"] }
      }
    } else if (i == 'playTime') {
      const totalVal = raw[i]["tp"] + raw[i]["cp"] + raw[i]["ol"];

      totals[i] = { title: `Total Time`, val: formatTiming(totalVal), show: i };
      const sub: { [key: string]: { title: string, val: string | number } } = {};
      for (const cat of ["tp", "cp", "ol"])
        sub[cat] = { title: types[cat], val: formatTiming(raw[i][cat]) }

      totals[i].sub = sub;
    }
  }

  return {
    "bestRank": { title: "Best Rank", val: raw.bestRank ? raw.bestRank : "unknown", suffix: raw.bestRank ? rankSuffix(raw.bestRank) : '' },
    ...totals,
  }
});

watch(route, () => {
  // statShow.value = "";
  if (!Object.values(sideNav).includes(route.hash)) router.push(sideNav['account 2']);
});
</script>

<template>
  <div id="accountProfile" class="scroll-snap-view">
    <!-- <div id="profileScreen" class="scroll-page-view"> -->
    <snap-section title="profile" route-name="/account">
      <img src="@/assets/logo/favicon-jiang (dark).svg" id="profilePicture" />
      <label class="profile-text-wrap">
        <h3 id="username" class="user-details">{{ user.username }}</h3>
      </label>
      <label class="profile-text-wrap">
        <p id="userEmail" class="user-details">{{ user.email }}</p>
      </label>
      <div id="userScoreData">
        <label class="data-score data-wrap">
          <icon-main icon="rank 1" class="data-icon" />
          <label class="profile-text-wrap user-score">
            <p class="data-value"><b>{{ user.score }}</b></p>
          </label>
        </label>
        <p class="separator">:</p>
        <label class="data-rank data-wrap">
          <icon-main icon="rank 2" class="data-icon" />
          <label class="profile-text-wrap user-rank">
            <p class="data-value"><b>{{ user.rank || "?" }} </b> {{ user.rank ? rankSuffix(user.rank) : "" }}</p>
          </label>
        </label>
      </div>
      <button-main @click="router.push('/account/edit')">Edit Profile</button-main>
    </snap-section>

    <snap-section title="statistics" route-name="/account" class="statistics-page">
      <transition-group :duration="userStore.getSettings.animationSpeed * 5">
        <template v-for="(stat, i) in stats" :key="i">
          <label @click="() => { statShow = stat.show == statShow ? '' : stat.show || ''; userStore.feedback(); }"
            class="stat-row group-heading">
            <h3 class="stat-title group-title">{{ stat.title }}</h3>
            <p class="stat-value group-value"><b>{{ stat.val }}</b> {{ stat.suffix ? stat.suffix : "" }}</p>
          </label>
          <sequence-transition v-if="stat.sub && statShow == stat.show" class="stat-sub" key="sub">
            <label v-for="(sub, i) in stat.sub" :key="i" @click="() => { statShow = ''; }"
              class="stat-row group-heading">
              <h3 class="stat-title group-title">{{ sub.title }}</h3>
              <p class="stat-value group-value"><b>{{ sub.val }}</b> {{ stat.suffix ? sub.suffix : "" }}</p>
            </label>

          </sequence-transition>
        </template>
      </transition-group>
    </snap-section>

    <snap-section title="actions" route-name="/account">
      <button-main @click="router.push('/account/update')">Update</button-main>
      <button-main @click="userStore.resetAccount()">Reset</button-main>
      <button-main @click="router.push('/account/delete')">Delete</button-main>
      <button-main @click="userStore.signOut()">Log out</button-main>
    </snap-section>
    <!-- </div> -->
    <nav id="sideNav">
      <icon-button-main v-for="( value, key ) in sideNav " :active="route.hash == value" :key="key" :to="value"
        :icon="key" class="side-nav" />
    </nav>
    <transition :duration="{ enter: 700, leave: 500 }" mode="out-in">
      <div :key="String(route.name != 'Account')" id="profileOverlay" class="overlay-view"
        v-if="route.name != 'Account'">
        <section class="page-view">
          <router-view></router-view>
        </section>
        <!-- <div class="footer bottom">
          <nav class="navbar main">
            <transition-group name="footer-nav" :duration="500 * userStore.getSettings.animationSpeed">
              <icon-button-main v-if="route.path.includes('menu') && (!!route.hash || route.name != 'Menu')"
                type="button" @click="router.push('/game-play/menu')" icon="back 1" />
              <icon-button-main type="button" @click="router.push('/game-play')" icon="cross" key="cross" />
            </transition-group>
          </nav>
        </div> -->
      </div>
    </transition>
  </div>
</template>

<style>
/* #accountProfile {
  width: 100vw;
  height: 100vh;
  position: fixed;
  left: 0px;
  top: 0px;
  display: flex;
  justify-content: center;
  align-items: center;
}

#profileScreen {
  height: 100vh;
  width: calc(100% - 120px);
  padding: 0 60px;
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
} */

#profilePicture {
  width: 60%;
  align-self: center;
  transition: var(--transition-m);
  margin-bottom: 20px;
}

#username {
  text-align: center;
  text-transform: none;
}

#userEmail {
  font-style: italic;
  opacity: .7;
  letter-spacing: 2px;
}

#userScoreData {
  height: 30px;
  margin: 15px 0;

  .separator {
    margin: 0 5%;
  }

  .data-wrap {
    width: 100%;
    justify-content: center;
  }

  .data-score {
    justify-content: right;
  }

  .data-rank {
    justify-content: left;
  }
}

#userScoreData,
#userScoreData .data-wrap {
  display: flex;
  align-items: center;
}

#userScoreData .data-value,
svg.data-icon {
  margin: 3px;
}

svg.data-icon {
  width: 30px;
  height: 30px;
  padding: 0;
}

.profile-text-wrap {
  overflow: hidden;
}

.stat-row {
  margin: 5px 0;
}

.stat-sub {
  width: calc(100% - 20px);
  padding-left: 20px;
}

.stat-sub .stat-row {
  margin: 2px 0;
}

.stat-sub.v-leave-active {
  position: absolute;
  transition-duration: 100s;
}

.v-enter-from,
.v-leave-to {

  &.stat-row,
  .stat-row {
    opacity: 0;
  }

  /* .stat-row .stat-value,
  &.stat-sub .stat-row .stat-value {
    transform: scale(.8);
    opacity: 0;
  } */

  #userScoreData {

    .data-icon,
    .separator {
      transform: scale(.8);
      opacity: 0;

    }

    .profile-text-wrap>.data-value {
      transform: translateX(-100%);
      opacity: 0;
    }
  }

  #profilePicture {
    transform: scale(.9);
    opacity: 0;
  }
}

.stat-sub.v-enter-from .stat-row .stat-title,
.stat-sub.v-enter-from .stat-row .stat-value {
  transform: translateY(-100%);
}

.stat-sub.v-leave-to .stat-row .stat-title,
.stat-sub.v-leave-to .stat-row .stat-value {
  transform: translateY(100%);
}

.v-enter-from .user-details {
  transform: translateY(-100%);
}

.v-leave-to .user-details {
  transform: translateY(100%);
}

.v-enter-active #userScoreData .profile-text-wrap>.data-value {
  transition-delay: calc(.4s * var(--animation-speed)) !important;
}
</style>