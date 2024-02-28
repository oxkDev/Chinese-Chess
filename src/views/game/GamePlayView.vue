<script setup lang="ts">
import IconButtonMain from "@/components/IconButtonMain.vue";
import GameSettingsView from "./GameSettingsView.vue";
import GameMenuView from "./GameMenuView.vue";
import RequestGroup from "@/components/groups/RequestGroup.vue";
import ChessBoardGroup from "@/components/groups/ChessBoardGroup.vue";
import Board, { type GamePlayData, type GameSettings } from "@/store/chinese chess";
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from "vue-router";
import { useGameStore, useUserStore } from "@/store";

const gameStore = useGameStore(), userStore = useUserStore();
const route = useRoute();
const router = useRouter();

const playData: { settings: GameSettings, game?: GamePlayData } = gameStore.getGame;
const gameSettings = playData.settings;
const rotate = ref(gameSettings.type == "2 Player");
const gamePlay = ref(new Board(gameSettings));
const boardDisplay = ref(0);


const actions = ref(gamePlay.value.checkmateCheck(gamePlay.value.turn.player));
const stalemate = ref(gamePlay.value.stalemateCheck(gamePlay.value.turn.player));

const requests = ref({
  0: 0,
  1: 0,
  win: 1,
} as { [key: number | string]: number });

const timings = ref({
  0: { game: formatTimings(gameSettings.gameDuration), turn: formatTimings(gameSettings.turnDuration) },
  1: { game: formatTimings(gameSettings.gameDuration), turn: formatTimings(gameSettings.turnDuration) },
} as { [key: number]: { game: string, turn: string } });

// let menuOverlay = route.hash != "" || route.name != "Game Play";
const menuPage = ref("" as ("home" | "settings" | "restart" | ""));

watch(route, () => {
  if (route.hash != '' || route.name != 'Game Play') gamePlay.value.pause(true);
  else setTimeout(() => gamePlay.value.pause(false), 500);
  if (route.name == "menuSettings") menuPage.value = "settings";
});

watch(gameSettings, () => {
  gamePlay.value.updateSettings(gameSettings);
});

function requestUndo(player: number) {
  if (requests.value[player] != 0) requests.value[player] = 2;
}

function update(turn: 0 | 1 | number = gamePlay.value.turn.player) {
  actions.value = gamePlay.value.checkmateCheck(turn);
  stalemate.value = gamePlay.value.stalemateCheck(turn);
  requests.value[turn] = Number(gamePlay.value.turn.iteration > 0);
  requests.value[1 - turn] = 0;
  boardDisplay.value = gamePlay.value.turn.iteration;
  gameStore.updateGame(gamePlay.value.getGame());

  if (stalemate.value.length) userStore.feedback([10, 150, 10]);
  else userStore.feedback(5);
}

function move(piece: string, coord: number[]) {
  gamePlay.value.move(piece, coord);
  update();

  if (JSON.stringify(actions.value.moves) == '{}') gamePlay.value.win(1 - gamePlay.value.turn.player);
}

function undo(to = gamePlay.value.turn.iteration - 1) {
  gamePlay.value.pause(true);
  gamePlay.value.winner = undefined;
  gamePlay.value.undo(to);
  requests.value["win"] = 1;
  update();
  gamePlay.value.pause(false);
}

function formatTimings(t: number) {
  if (t < 0) t = 0;
  const trnd = Math.round(t / 1000);
  const minutesTime = String(Math.floor(trnd / 60)),
    secondsTime = String(Math.floor(trnd % 60));
  return `${minutesTime.length == 1 ? '0' + minutesTime : minutesTime} : ${secondsTime.length == 1 ? '0' + secondsTime : secondsTime}`;
}


for (const i in gamePlay.value.timer) {
  gamePlay.value.timer[parseInt(i)].onUpdate(v => {
    if (gameSettings.gameDuration > 0) timings.value[parseInt(i)].game = formatTimings(gameSettings.gameDuration - v);
    else timings.value[parseInt(i)].game = formatTimings(v);
  });
}

gamePlay.value.turn.timer.onUpdate(v => {
  if (gameSettings.turnDuration > 0) {
    timings.value[gamePlay.value.turn.player].turn = formatTimings(gameSettings.turnDuration - v);
    timings.value[1 - gamePlay.value.turn.player].turn = formatTimings(gameSettings.turnDuration);
  } else {
    timings.value[gamePlay.value.turn.player].turn = formatTimings(v);
  }
});

gamePlay.value.onWin = w => {
  actions.value = { moves: {}, blocks: {} };
  console.log("win:", w);

  userStore.feedback([10, 150, 10, 150, 10]);
}

onMounted(() => {
  gamePlay.value.start(playData.game);
  if (playData.game) {
    update();
    if (JSON.stringify(actions.value.moves) == '{}') gamePlay.value.win(1 - gamePlay.value.turn.player);
  }
  if (route.hash != '' || route.name != 'Game Play') gamePlay.value.pause(true);
});

</script>

<template>
  <div id="gamePlay">
    <div id="gameScreen">
      <request-group class="top" :show="requests[1] == 2" @update="c => { requests[1] = Number(c); if (c) undo() }"
        :options="['Decline', 'Accept']"><b>Undo</b>
        request</request-group>
      <request-group class="bottom" :show="requests[0] == 2" @update="c => { requests[0] = Number(c); if (c) undo() }"
        :options="['Decline', 'Accept']"><b>Undo</b>
        request</request-group>
      <request-group class="center" :show="gamePlay.winner != undefined && requests['win'] > 0"
        @update="c => { requests['win'] = Number(c); if (c) undo(0); }" :options="['Cancel', 'Rematch']">
        <h2><b>{{ gamePlay.names[gamePlay.winner ? gamePlay.winner : 0] }}</b> Wins</h2>
      </request-group>
      <div class="timing top">
        <h2>{{ timings[1].game }}</h2>
        <h2>{{ timings[1].turn }}</h2>
      </div>
      <chess-board-group :pieces="gamePlay.boardHist[boardDisplay].board" :turn="gamePlay.turn.player"
        :rotateOpponent="rotate" :actions="boardDisplay == gamePlay.turn.iteration ? actions : { moves: {}, blocks: {} }"
        :stalemate="stalemate" @move="(piece, coord) => move(piece, coord)"
        :onclick="() => { if (!gamePlay.winner) boardDisplay = gamePlay.turn.iteration; }" />
      <div class="timing">
        <h2>{{ timings[0].game }}</h2>
        <h2>{{ timings[0].turn }}</h2>
      </div>
    </div>
    <div class="footer top">
      <nav class="navbar main" id="oFooter">
        <icon-button-main type="button" icon="back 2"
          :disable="boardDisplay <= 0 || (gamePlay.turn.player != 1 && !gamePlay.winner)" @click="boardDisplay--;" />
        <icon-button-main type="button" :disable="requests[0] == 0" :active="requests[0] == 2" icon="undo"
          @click="requestUndo(0)" />
        <icon-button-main type="button" icon="forward 2"
          :disable="boardDisplay >= gamePlay.turn.iteration || (gamePlay.turn.player != 1 && !gamePlay.winner)"
          @click="boardDisplay++;" />
      </nav>
    </div>
    <div class="footer bottom">
      <nav class="navbar">
        <icon-button-main :disable="!!gamePlay.winner" to="#gameSettings" icon="settings 2" />
      </nav>
      <nav class="navbar main" id="hFooter">
        <icon-button-main type="button" icon="back 2"
          :disable="boardDisplay <= 0 || (gamePlay.turn.player != 0 && !gamePlay.winner)" @click="boardDisplay--;" />
        <icon-button-main type="button" :disable="requests[1] == 0" :active="requests[1] == 2" icon="undo"
          @click="requestUndo(1)" />
        <icon-button-main type="button" icon="forward 2"
          :disable="boardDisplay >= gamePlay.turn.iteration || (gamePlay.turn.player != 0 && !gamePlay.winner)"
          @click="boardDisplay++;" />
      </nav>
      <nav class="navbar">
        <icon-button-main to="#menu" icon="menu" />
      </nav>
    </div>
    <transition :duration="{ enter: 700, leave: 500 }" mode="out-in">
      <div :key="String(route.hash != '' || route.name != 'Game Play')" id="gameOverlay"
        v-if="route.hash != '' || route.name != 'Game Play'">
        <section class="overlay-content">
          <game-settings-view v-if="route.hash == '#gameSettings'" />
          <game-menu-view v-if="route.hash == '#menu' || route.name == 'menuSettings'" :sub-page="menuPage"
            @action="act => { if (act == 'restart') undo(0); menuPage = '' }" @update="path => { menuPage = path; }"
            ref="menuOverlay" />
        </section>
        <div class="footer bottom">
          <nav class="navbar main">
            <transition-group name="footer-nav" :duration="500">
              <icon-button-main v-if="route.name != 'Game Play' || menuPage != ''" type="button"
                @click="router.push('/game-play#menu'); menuPage = '';" icon="back 1" key="back 1" />
              <icon-button-main type="button" @click="router.push('/game-play'); menuPage = '';" icon="cross"
                key="cross" />
            </transition-group>
          </nav>
        </div>
      </div>
    </transition>
  </div>
</template>

<style>
#gamePlay {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 100vh;
  scroll-snap-align: start;
  overflow-y: visible;
}

#gameScreen {
  position: relative;
  height: 100vh;
  min-height: 600px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.timing {
  width: 100%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  overflow: hidden;
}

.timing>h2 {
  margin-right: -3px;
}

.request-group.bottom {
  bottom: 80px;
}

.request-group.top {
  top: 80px;
}

.footer {
  width: 100%;
  position: fixed;
  left: 0px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 10;
}

.footer.top {
  top: 0px;
}

.footer.bottom {
  bottom: 0px;
}

.v-enter-from .top,
.top {
  transform: rotate(180deg);
}

#gameOverlay {
  width: 100vw;
  height: 100vh;
  position: absolute;
  left: 0px;
  top: 0px;
  z-index: 50;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: var(--transition-l);
  background: var(--background-primary);
  backdrop-filter: none;
}

.blur-l #gameOverlay {
  background: var(--background-primary-translucent);
  backdrop-filter: var(--blur-l);
}

.overlay-content {
  max-width: 300px;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.v-enter-from#gameOverlay,
.v-leave-to#gameOverlay {
  /* opacity: 0; */
  background: transparent;
  backdrop-filter: none;
}

.v-enter-from .timing>h2,
.v-leave-to .timing>h2 {
  transform: translateY(-20px);
  opacity: 0;
}

.v-enter-active .timing>h2 {
  transition-delay: .2s;
}
</style>