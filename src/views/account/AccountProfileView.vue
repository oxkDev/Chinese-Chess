<script setup lang="ts">
import SnapSection from '@/components/SnapSection.vue';
import ButtonMain from '@/components/mains/ButtonMain.vue';
import IconButtonMain from '@/components/IconButtonMain.vue';
import { useFireStore, useUserStore } from '@/store';
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import IconMain from '@/components/IconMain.vue';
import { getAuth } from 'firebase/auth';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const user = computed(() => userStore.getUser);

const sideNav = {
  "account 2": "#profile",
  "data": "#statistics",
  "warn": "#actions",
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

const statShow = ref("");

const stats = computed((): { [key: string]: { title: string, val: number, sub?: boolean, suffix?: boolean, show?: string } } => {
  const raw = userStore.getStatistics
  let totals = {} as { [key: string]: { title: string, val: number, sub?: boolean, show: string } };
  for (const i of Object.keys(raw)) {
    if (typeof (raw[i]) == 'object') {
      totals[i] = { title: `Total ${i}`, val: raw[i]["tp"] + raw[i]["cp"] + raw[i]["ol"], show: i };
      totals[`${i}-tp`] = { title: "2 Player", val: raw[i]["tp"], sub: true, show: i }
      totals[`${i}-cp`] = { title: "Computer", val: raw[i]["cp"], sub: true, show: i }
      totals[`${i}-ol`] = { title: "Online", val: raw[i]["ol"], sub: true, show: i }
    }
  }

  return {
    "bestRank": { title: "Best Rank", val: raw.bestRank, suffix: true },
    ...totals,
  }
});

console.log(stats)

watch(route, () => {
  if (Object.values(sideNav).indexOf(route.hash) == -1) router.push(sideNav['account 2']);
});

// function edit() {
//   if (userStore.user) userStore.user.username = "testers";
// }
</script>

<template>
  <div id="accountProfile">
    <div id="profileScreen">
      <snap-section title="profile" route-name="/account">
        <img src="@/assets/logo/favicon-jiang (dark).svg" id="userPicture" />
        <label class="profile-text-wrap">
          <h3 id="username" class="user-details">{{ user.username }}</h3>
        </label>
        <label class="profile-text-wrap">
          <p id="userEmail" class="user-details">{{ user.email }}</p>
        </label>
        <label class="profile-text-wrap">
          <div id="scoreData">
            <icon-main icon="rank 1" class="score-icon" />
            <p class="score-value"><b>{{ user.score }}</b></p>
            <p class="separator">:</p> <icon-main icon="rank 2" class="score-icon" />
            <p class="score-value"><b>{{ user.rank }} </b> {{ rankSuffix(user.rank) }}</p>
          </div>
        </label>
        <button-main @click="useFireStore().loadFirebase()">Edit</button-main>
      </snap-section>

      <snap-section title="statistics" route-name="/account">
        <transition-group :duration="userStore.getSettings.animationSpeed * 5">
          <!-- <label class="stat-row" key="bestRank">
            <h3 class="stat-title">Best Rank</h3>
            <p class="stat-value"><b>{{ userStore.getStatistics["bestRank"] }}</b> {{
            rankSuffix(userStore.getStatistics["bestRank"]) }}</p>
          </label> -->
          <template v-for="(stat, i) in stats" :key="i">

            <label v-if="!stat.sub || stat.show == statShow" :on-click="() => { statShow = i; }" class="stat-row"
              :class="{ sub: stat.sub }">
              <h3 class="stat-title">{{ stat.title }}</h3>
              <p class="stat-value"><b>{{ stat.val }}</b> {{ stat.suffix ? rankSuffix(stat.val)
            :
            "" }}</p>
            </label>
          </template>
        </transition-group>
      </snap-section>

      <snap-section title="actions" route-name="/account">
        <button-main @click="userStore.signOut()">Log out</button-main>
        <button-main>Reset</button-main>
        <button-main @click="router.push('/account/delete')">Delete</button-main>
      </snap-section>
    </div>
    <nav id="sideNav">
      <icon-button-main v-for="( value, key ) in sideNav " :active="route.hash == value" :key="key" :to="value"
        :icon="key" class="side-nav" />
    </nav>
  </div>
</template>

<style>
#accountProfile {
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
}

#userPicture {
  width: 60%;
  align-self: center;
  transition: var(--transition-m);
  margin-bottom: 20px;
}

#username {
  text-align: center;
}

#userEmail {
  font-style: italic;
}

#scoreData {
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 15px 0;
}

#scoreData>.separator {
  margin: 0 5%;
}

#scoreData>.score-value,
svg.score-icon {
  margin: 3px;
}

svg.score-icon {
  width: 30px;
  padding: 0;
}

.profile-text-wrap {
  overflow: hidden;
}

.stat-row {
  width: 100%;
  margin: 5px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-row.sub {
  width: calc(100% - 20px);
  padding-left: 20px;
  margin: 2px 0;
}

nav#sideNav {
  display: flex;
  flex-direction: column;
  position: absolute;
  justify-content: center;
  right: 0px;
  height: 100%;
  top: 0px;
}

nav#sideNav path {
  transition: var(--transition-m);
}

.v-enter-from #userPicture,
.v-leave-to #userPicture {
  transform: scale(.9);
  opacity: 0;
}

.v-enter-from .user-details {
  transform: translateY(-100%);
  opacity: 0;
}

.v-leave-to .user-details {
  transform: translateY(100%);
  opacity: 0;
}

.v-enter-from #scoreData>*,
.v-leave-to #scoreData>* {
  transform: scale(.9);
  opacity: 0;
}

.v-enter-from #scoreData>.separator {
  margin: 0 5px;
}

.v-enter-from a.side-nav,
.v-leave-to a.side-nav {
  transform: scale(.9);
  opacity: 0;
}
</style>