<script setup lang="ts">
import SequenceTransition from '@/components/SequenceTransition.vue';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import type { BoardHist, GamePlayData, GameSettings, Pieces } from '@/store/chinese chess';
import { useGameStore, useUserStore } from '@/store';

const router = useRouter();
const gameStore = useGameStore();
const userStore = useUserStore();

const settings = userStore.getSettings;

const saves = ref();
const games = ref(gameStore.getSavedGames);

function transitionDelays() {
  let pieces = [];
  if (saves.value) {
    for (const elm of saves.value) {
      pieces.push(...[...elm.querySelectorAll("g.piece-wrap")].reverse());
    }
    for (let i = 0; i < pieces.length; i++) {
      pieces[i].style.setProperty("--piece-delay", `${i * 0.0001 * settings.animationSpeed}s`);
    }
  }
}

function getBoard(boardHist: BoardHist): Pieces {
  const pieces = Object.values(boardHist).pop()?.board;
  return pieces ? pieces : {};
}

function formatTimings(gameData: { settings: GameSettings, game: GamePlayData }): string[] {
  const duration = gameData.settings.gameDuration;
  let timer = gameData.game.timer;
  if (duration > 0) timer = { 0: duration - timer[0], 1: duration - timer[1] };
  let out = [];
  for (const i in timer) {
    if (timer[i as "0" | "1"] < 0) timer[i as "0" | "1"] = 0;
    const trnd = Math.round(timer[i as "0" | "1"] / 1000);
    const minutes = String(Math.floor(trnd / 60)),
      seconds = String(Math.floor(trnd % 60));
    out.push(`${minutes.length == 1 ? '0' + minutes : minutes} : ${seconds.length == 1 ? '0' + seconds : seconds}`);
  }
  return out.reverse();
}

function start(gameKey: string) {
  gameStore.playSavedGame(gameKey);
  router.push('/game-play');
  userStore.feedback(10);
}

onMounted(transitionDelays);

</script>


<template>
  <div id="savedGameView">
    <sequence-transition :interval="0.15">
      <button v-for="(gameData, key) in games" :key="key" v-on:click="() => start(key.toString())" class="saved-game"
        ref="saves">
        <div class="game-info">
          <h2 class="game-type">{{ gameData.settings.type }}</h2>
          <div class="game-timings">
            <p v-for="timing in formatTimings(gameData)" :key="timing" class="game-timing">{{ timing }}</p>
          </div>
          <div class="game-durations">
            <p class="game-duration-game">
              <b>{{ Math.round(gameData.settings.gameDuration / 60000) }}</b> min
            </p>
            <p class="game-duration-turn">
              <b>{{ Math.round(gameData.settings.turnDuration / 60000) }}</b> min
            </p>
          </div>
        </div>
        <svg width="90" height="100" viewBox="0 0 90 100" fill="none" xmlns="http://www.w3.org/2000/svg"
          class="game-board">
          <rect x="5" y="5" width="80" height="90" rx="4.5" />
          <path d="M35 5V25" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M55 5V25" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M35 75L35 95" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M55 75L55 95" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M35 25L55 25" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M5 45L85 45" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M5 55L85 55" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M35 75H55" stroke-linecap="round" stroke-linejoin="round" />
          <g v-for="(coord, k) in getBoard(gameData.game.boardHist)" :key="k"
            :player="k.toString().charAt(k.toString().length - 1)" class="piece-wrap">
            <circle :cx="5 + 10 * coord[0]" :cy="95 - 10 * coord[1]" r="4.5" class="piece-background" />
            <circle :cx="5 + 10 * coord[0]" :cy="95 - 10 * coord[1]" r="3" class="mark" />
          </g>
        </svg>
      </button>
    </sequence-transition>
  </div>
</template>


<style>
#savedGameView {
  height: 100vh;
  width: 100%;
  padding: 0 30px;
  margin: 0 -30px;
  overflow-y: scroll;
}

#savedGameView>.sequence-transition {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: calc(min(70vh, calc(85vh - 75px)) - 30px);
  padding: calc(15vh + 30px) 0 max(calc(15vh), 75px);
  scroll-snap-align: start;
  overflow-y: visible;
}

button.saved-game {
  height: 150px;
  padding: 12px;
  margin: 15px 0;
  border-radius: 20px;
  background: var(--background-secondary);
  box-shadow: var(--default-shadow);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

div.game-info {
  margin: 0 5px;
  height: 100%;
  width: 50%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}

.game-type {
  width: 100%;
  text-align: left;
}

.game-timing {
  width: 100%;
  text-align: center;
}

.game-durations {
  width: 100%;
  height: 30px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.game-timings,
.game-info,
.game-durations {
  overflow: hidden;
}

svg.game-board {
  height: 100%;
  width: auto;
  aspect-ratio: 9/10;
}

svg.game-board>path,
svg.game-board>rect {
  stroke: var(--generic);
  stroke-opacity: 0.6;
}

g[player]>circle.piece-background {
  filter: drop-shadow(var(--icon-shadow));
}

g[player="0"]>circle.piece-background {
  fill: var(--piece-home-background);
}

g[player="0"]>circle.mark {
  fill: var(--piece-home-colour);
  opacity: .5;
}

g[player="1"]>circle.piece-background {
  fill: var(--piece-rival-background);
}

g[player="1"]>circle.mark {
  fill: var(--piece-rival-colour);
  opacity: .5;
}

button.saved-game:hover {
  box-shadow: var(--default-glow);
  padding: 10px;
}

button.saved-game:hover .game-type {
  letter-spacing: 4px;
}

button.saved-game:hover g[player]>circle.piece-background {
  filter: drop-shadow(var(--icon-glow));
}

button.saved-game:active {
  aspect-ratio: 2;
  padding: 14px;
  filter: contrast(90%);
}

button.saved-game:active .game-type {
  letter-spacing: 2px;
}

.v-enter-from .saved-game,
.v-leave-to .saved-game {
  opacity: 0;
}

.v-enter-from .game-type,
.v-leave-to .game-type {
  transform: translateX(-50%);
}

.v-enter-from .game-duration-game,
.v-leave-to .game-duration-game {
  transform: translateX(-50%);
}

.v-enter-from .game-duration-turn,
.v-leave-to .game-duration-turn {
  transform: translateX(50%);
}

.v-enter-from .game-timing,
.v-leave-to .game-timing {
  transform: translateX(-50%);
}

.v-enter-from g.piece-wrap,
.v-leave-to g.piece-wrap {
  opacity: 0;
}

.v-enter-from circle.piece-background,
.v-leave-to circle.piece-background {
  r: 3px;
}

.v-enter-active g.piece-wrap,
.v-leave-active g.piece-wrap {
  transition-delay: var(--piece-delay);
}
</style>