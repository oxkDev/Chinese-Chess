<script setup lang="ts">
import IconButtonMain from "@/components/IconButtonMain.vue";
import GameSettingsView from "./GameSettingsView.vue";
import GameMenuView from "./GameMenuView.vue";
import RequestGroup from "@/components/groups/RequestGroup.vue";
import Board, { GameSettings } from "@/store/chinese chess";
import { onMounted, ref, watch } from 'vue';
import { useRoute } from "vue-router";
import { useStore } from 'vuex';
import ChessBoardGroup from "@/components/groups/ChessBoardGroup.vue";

const store = useStore();
const route = useRoute();

const settings: GameSettings = store.getters.settings;
const gamePlay = ref(new Board(settings));
const actions = ref(gamePlay.value.checkmateCheck(gamePlay.value.turn.player));
const stalemate = ref(gamePlay.value.stalemateCheck(gamePlay.value.turn.player));
const boardDisplay = ref(0);

const requests = ref({
  0: 0,
  1: 0,
  win: 1,
} as { [key: number | string]: number });

const timings = ref({
  0: { game: formatTimings(settings.gameDuration), turn: formatTimings(settings.turnDuration) },
  1: { game: formatTimings(settings.gameDuration), turn: formatTimings(settings.turnDuration) },
} as { [key: number]: { game: string, turn: string } });

watch(route, () => {
  if (!route.hash) setTimeout(() => gamePlay.value.pause(false), 500);
  else gamePlay.value.pause(true);
});

watch(settings, () => {
  gamePlay.value.update(settings);
});

function requestUndo(player: number) {
  if (requests.value[player] != 0) requests.value[player] = 2;
}

function undo(to = gamePlay.value.turn.iteration - 1) {
  gamePlay.value.pause(true);
  gamePlay.value.winner = undefined;
  gamePlay.value.undo(to);
  actions.value = gamePlay.value.checkmateCheck(gamePlay.value.turn.player);
  stalemate.value = gamePlay.value.stalemateCheck(gamePlay.value.turn.player);
  requests.value[gamePlay.value.turn.player] = Number(gamePlay.value.turn.iteration > 0);
  requests.value[1 - gamePlay.value.turn.player] = 0;
  requests.value["win"] = 1;
  boardDisplay.value = to;
  gamePlay.value.pause(false);
}

function formatTimings(t: number) {
  if (t < 0) t = 0;
  const trnd = Math.round(t / 1000);
  const gameTime = String(Math.floor(trnd / 60)),
    turnTime = String(Math.floor(trnd % 60));
  return `${gameTime.length == 1 ? '0' + gameTime : gameTime} : ${turnTime.length == 1 ? '0' + turnTime : turnTime}`;
}


function move(piece: string, coord: number[]) {
  gamePlay.value.move(piece, coord);
  actions.value = gamePlay.value.checkmateCheck(gamePlay.value.turn.player);
  stalemate.value = gamePlay.value.stalemateCheck(gamePlay.value.turn.player);

  boardDisplay.value = gamePlay.value.turn.iteration;
  requests.value[gamePlay.value.turn.player] = 1;
  requests.value[1 - gamePlay.value.turn.player] = 0;

  if (JSON.stringify(actions.value.moves) == '{}') gamePlay.value.win(1 - gamePlay.value.turn.player);
}

onMounted(() => {
  gamePlay.value.start();

  for (const i in gamePlay.value.timer) {
    gamePlay.value.timer[parseInt(i)].onUpdate(v => {
      if (settings.gameDuration > 0) timings.value[parseInt(i)].game = formatTimings(settings.gameDuration - v);
      else timings.value[parseInt(i)].game = formatTimings(v);
    });
  }

  gamePlay.value.turn.timer.onUpdate(v => {
    if (settings.turnDuration > 0) {
      timings.value[gamePlay.value.turn.player].turn = formatTimings(settings.turnDuration - v);
      timings.value[1 - gamePlay.value.turn.player].turn = formatTimings(settings.turnDuration);
    } else {
      timings.value[gamePlay.value.turn.player].turn = formatTimings(v);
    }
  });

  gamePlay.value.onWin = w => {
    actions.value = { moves: {}, blocks: {} };
    console.log("win:", w);
  }
});

</script>

<template>
  <div id="gamePlay">
    <div id="gameScreen">
      <request-group class="top" :show="requests[1] == 2" @update="c => { requests[1] = Number(c); if (c) undo() }"
        :options="['Decline', 'Accept']"><b>Undo</b> request</request-group>
      <request-group class="bottom" :show="requests[0] == 2" @update="c => { requests[0] = Number(c); if (c) undo() }"
        :options="['Decline', 'Accept']"><b>Undo</b> request</request-group>
      <div class="timing top">
        <h2>{{ timings[1].game }}</h2>
        <h2>{{ timings[1].turn }}</h2>
      </div>
      <chess-board-group :pieces="gamePlay.boardHist[boardDisplay].board" :turn="gamePlay.turn.player as (0 | 1)"
        :actions="boardDisplay == gamePlay.turn.iteration ? actions : { moves: {}, blocks: {} }" :stalemate="stalemate"
        @move="(piece, coord) => move(piece, coord)"
        :onclick="() => { if (gamePlay.winner == undefined) boardDisplay = gamePlay.turn.iteration; }" />
      <div class="timing">
        <h2>{{ timings[0].game }}</h2>
        <h2>{{ timings[0].turn }}</h2>
      </div>
      <request-group class="center" :show="gamePlay.winner != undefined && requests['win'] > 0"
        @update="c => { requests['win'] = Number(c); if (c) undo(0); }" :options="['Cancel', 'Rematch']">
        <h2><b>{{ gamePlay.names[gamePlay.winner ? gamePlay.winner : 0] }}</b> Wins</h2>
      </request-group>
    </div>
    <div class="footer top">
      <nav class="navbar main" id="oFooter">
        <icon-button-main type="button" icon="back 2"
          :disable="boardDisplay <= 0 || (gamePlay.turn.player != 1 && gamePlay.winner == undefined)"
          @click="boardDisplay--;" />
        <icon-button-main type="button" :disable="requests[0] == 0" :active="requests[0] == 2" icon="undo"
          @click="requestUndo(0)" />
        <icon-button-main type="button" icon="forward 2"
          :disable="boardDisplay >= gamePlay.turn.iteration || (gamePlay.turn.player != 1 && gamePlay.winner == undefined)"
          @click="boardDisplay++;" />
      </nav>
    </div>
    <div class="footer bottom">
      <nav class="navbar">
        <icon-button-main to="#gameSettings" icon="settings 2" />
      </nav>
      <nav class="navbar main" id="hFooter">
        <icon-button-main type="button" icon="back 2"
          :disable="boardDisplay <= 0 || (gamePlay.turn.player != 0 && gamePlay.winner == undefined)"
          @click="boardDisplay--;" />
        <icon-button-main type="button" :disable="requests[1] == 0" :active="requests[1] == 2" icon="undo"
          @click="requestUndo(1)" />
        <icon-button-main type="button" icon="forward 2"
          :disable="boardDisplay >= gamePlay.turn.iteration || (gamePlay.turn.player != 0 && gamePlay.winner == undefined)"
          @click="boardDisplay++;" />
      </nav>
      <nav class="navbar">
        <icon-button-main to="#menu" icon="menu" />
      </nav>
    </div>
    <transition :duration="{ enter: 700, leave: 500 }" mode="out-in">
      <div :key="route.hash" id="gameOverlay" v-if="route.hash != ''">
        <section class="overlayContent">
          <game-settings-view v-if="route.hash == '#gameSettings'" />
          <game-menu-view> v-if="route.hash == '#menu'"</game-menu-view>
        </section>
        <div class="footer bottom">
          <nav class="navbar main">
            <icon-button-main to="" icon="cross" />
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

.requestGroup.bottom {
  bottom: 80px;
}

.requestGroup.top {
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

.top {
  transform: rotate(180deg);
}

.v-enter-from .top,
.top {
  transform: rotate(180deg);
}

#gameOverlay {
  width: 100vw;
  height: 100%;
  left: 0px;
  position: absolute;
  z-index: 50;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: var(--transition-l);
  background: var(--background-primary-translucent);
  backdrop-filter: blur(var(--blur-l));
}

.overlayContent {
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

.v-enter-active .timing>h2{
  transition-delay: .2s;
}
</style>