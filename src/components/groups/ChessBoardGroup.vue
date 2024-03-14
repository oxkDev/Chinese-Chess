<script setup lang="ts">
import { ref } from 'vue';
import ChessPieceIcon from '@/components/ChessPieceIcon.vue';
import { useUserStore } from '@/store';

const userStore = useUserStore(), settings = userStore.getSettings;

const props = defineProps<{
  pieces: { [key: string]: number[] },
  turn: 0 | 1 | number,
  actions: { moves: { [key: string]: number[][] }, blocks: { [key: string]: number[][] } },
  stalemate: string[],
  rotateOpponent: boolean,
}>();

const emits = defineEmits<{
  (e: "move", piece: string, coord: number[]): void,
}>();

const checkDisplay = ref({ piece: "", moves: [], blocks: [] } as { piece: string, moves: string[], blocks: string[] });

function getPositions() {
  const pos: string[] = [];
  for (let i = 0; i < 90; i++) {
    pos[i] = "";
  }
  for (const p in props.pieces) {
    const coord = props.pieces[p];
    pos[(9 - coord[1]) * 9 + coord[0]] = p;
  }

  return pos;
}

function pieceCheck(piece: string) {
  const converted: { moves: string[], blocks: string[] } = { moves: [], blocks: [] };
  if (props.actions.moves[piece]) for (const coord of props.actions.moves[piece]) converted.moves.push(coord.toString());
  if (props.actions.blocks[piece]) for (const coord of props.actions.blocks[piece]) converted.blocks.push(coord.toString());

  checkDisplay.value.moves = converted.moves;
  checkDisplay.value.blocks = converted.blocks;
}

function onFocus(f: boolean, p: string) {
  if (f) {
    checkDisplay.value.piece = p;
    pieceCheck(p);
    userStore.feedback();
  } else if (checkDisplay.value.piece == p)
    checkDisplay.value = { piece: "", moves: [], blocks: [] };
}

</script>

<template>
  <div class="chess-board-group" ref="boardWrap">
    <transition-group name="pieces" tag="div" class="board-grid-wrap">
      <div v-for="(piece, i) in getPositions()" :key="piece ? piece : i" class="position">
        <chess-piece-icon v-if="piece != ''" :type="piece[0] + piece[piece.length - 1]"
          :coord="[Math.floor(i / 9), i % 9]" :rotate="!(rotateOpponent === false)"
          :active="turn.toString() == piece[piece.length - 1]" :danger="stalemate.length > 0 && settings.stalemateAid"
          :attacker="stalemate.indexOf(piece) != -1 && settings.stalemateAid" @focus="f => onFocus(f, piece)"
          class="chess-piece" />
        <transition v-if="settings.positionAid" :duration="200" mode="out-in" :kill="piece != ''">
          <div v-if="checkDisplay.moves.indexOf(`${i % 9},${9 - Math.floor(i / 9)}`) + 1"
            :onclick="() => { emits('move', checkDisplay.piece, [i % 9, 9 - Math.floor(i / 9)]); checkDisplay = { piece: '', moves: [], blocks: [] }; }"
            class="moves-check">
            <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" class="moves-indicator">
              <circle v-if="piece != ''" cx="9" cy="9" r="8" stroke="white" stroke-width="1.5" />
              <circle cx="9" cy="9" r="5" fill="white" />
            </svg>
          </div>
          <svg v-else-if="checkDisplay.blocks.indexOf(`${i % 9},${9 - Math.floor(i / 9)}`) + 1" viewBox="0 0 18 18"
            fill="none" xmlns="http://www.w3.org/2000/svg" class="blocked-move">
            <path d="M15 3L9 9M9 9L3 15M9 9L15 15M9 9L3 3" stroke="white" stroke-width="3" />
          </svg>
        </transition>
      </div>
    </transition-group>
    <div class="board-lines">
      <svg viewBox="0 0 315 350" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path class="vline opp" d="M52.5 17.5L52.5 157.5" />
        <path class="vline opp" d="M87.5 17.5L87.5 157.5" />
        <path class="vline opp" d="M122.5 17.5L122.5 157.5" />
        <path class="vline opp" d="M157.5 17.5L157.5 157.5" />
        <path class="vline opp" d="M192.5 17.5L192.5 157.5" />
        <path class="vline opp" d="M227.5 17.5L227.5 157.5" />
        <path class="vline opp" d="M262.5 17.5V157.5" />
        <path class="vline home" d="M52.5 192.5L52.5 332.5" />
        <path class="vline home" d="M87.5 192.5L87.5 332.5" />
        <path class="vline home" d="M122.5 192.5L122.5 332.5" />
        <path class="vline home" d="M157.5 192.5L157.5 332.5" />
        <path class="vline home" d="M192.5 192.5L192.5 332.5" />
        <path class="vline home" d="M227.5 192.5L227.5 332.5" />
        <path class="vline home" d="M262.5 192.5L262.5 332.5" />
        <path class="hline" d="M17.5 52.5L297.5 52.5" />
        <path class="hline" d="M17.5 87.5L297.5 87.5" />
        <path class="hline" d="M17.5 122.5L297.5 122.5" />
        <path class="hline" d="M17.5 157.5H297.5" />
        <path class="hline" d="M17.5 192.5H297.5" />
        <path class="hline" d="M17.5 227.5H297.5" />
        <path class="hline" d="M17.5 262.5H297.5" />
        <path class="hline" d="M17.5 297.5H297.5" />
        <path class="cross home"
          d="M192.5 262.5L157.5 297.5M157.5 297.5L122.5 332.5M157.5 297.5L192.5 332.5M157.5 297.5L122.5 262.5" />
        <path class="cross opp"
          d="M192.5 17.5L157.5 52.5M157.5 52.5L122.5 87.5M157.5 52.5L192.5 87.5M157.5 52.5L122.5 17.5" />
        <path class="frame"
          d="M17.5 175L17.5 22.5C17.5 19.7386 19.7386 17.5 22.5 17.5L292.5 17.5C295.261 17.5 297.5 19.7386 297.5 22.5L297.5 327.5C297.5 330.261 295.261 332.5 292.5 332.5L22.5 332.5C19.7386 332.5 17.5 330.261 17.5 327.5L17.5 175Z" />
      </svg>
    </div>
  </div>
</template>

<style>
.chess-board-group {
  width: calc(100vw - 20px);
  max-width: 60vh;
  background: var(--background-secondary);
  mask: url("@/assets/board/board.svg");
  mask-size: cover;
  position: relative;
  box-shadow: var(--default-shadow);
}

.board-grid-wrap {
  margin: 5px;
  max-width: 100%;
  display: grid;
  grid-template-rows: repeat(10, 1fr);
  grid-template-columns: repeat(9, 1fr);
  position: relative;
  z-index: 2;
}

.chessRowWrap {
  display: grid;
  grid-template-columns: repeat(9, 1fr);
}

.position {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 100%;
  position: relative;
}

.pieces-leave-active.position {
  position: absolute !important;
  transition: none;
  opacity: 0 !important;
}

.pieces-move {
  transition: var(--transition-m);
}

.pieces-enter-from,
.pieces-leave-to {
  transform: scale(.7);
  opacity: 0;
}

.chess-piece:hover,
.moves-check:hover {
  cursor: pointer;
}

.moves-check {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 100%;
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: 3;
  display: flex;
  justify-content: center;
  align-items: center;
}

.moves-indicator,
.blocked-move {
  width: 60%;
  opacity: .6;
  aspect-ratio: 1;
  border-radius: 100%;
  backdrop-filter: drop-shadow(var(--icon-shadow));
}

.blocked-move {
  position: absolute;
  top: 20%;
  left: 20%;
  z-index: 3;
}

.moves-indicator>circle[stroke],
.blocked-move>path[stroke] {
  stroke: var(--generic);
}

.moves-indicator>circle[fill] {
  fill: var(--generic)
}

/* .moves-check[kill="true"] > .moves-indicator,
.blocked-move[kill="true"] {
  backdrop-filter: invert(10%);
} */

.moves-check[kill="true"]>.moves-indicator>circle[stroke],
.blocked-move[kill="true"]>path[stroke] {
  stroke: var(--dark);
}

.moves-check[kill="true"]>.moves-indicator>circle[fill] {
  fill: var(--dark);
}

.board-lines {
  width: calc(100% - 10px);
  height: calc(100% - 10px);
  margin: 5px;
  position: absolute;
  top: 0px;
  right: 0px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
}

.board-lines svg {
  width: 100%;
}

.board-lines path {
  stroke: var(--generic);
  stroke-width: 2px;
  opacity: .5;
}

.board-lines path.frame {
  stroke-width: 3px;
}

.v-enter-from .chess-board-group,
.v-leave-to .chess-board-group {
  transform: scale(.95);
  opacity: 0;
}

.v-enter-from.moves-check,
.v-leave-to.moves-check,
.v-enter-from.blocked-move,
.v-leave-to.blocked-move {
  transform: scale(.8);
  opacity: 0;
  box-shadow: none;
}

.v-enter-from.moves-check>.moves-indicator,
.v-leave-to.moves-check>.moves-indicator {
  width: 10%;
}

.v-enter-from.moves-check>.moves-indicator>circle[fill],
.v-leave-to.moves-check>.moves-indicator>circle[fill] {
  r: 2;
}

.v-enter-active.moves-check,
.v-leave-active.moves-check {
  transition: var(--transition-m);
  pointer-events: none;
}


.board-lines path {
  transition-delay: .1s;
}

.board-lines path.frame {
  transition-delay: .4s;
}

.v-enter-from .board-lines path.frame {
  stroke-width: 0px;
}

.v-enter-from .board-lines path.vline.home {
  transform: translateY(55%) scaleY(0);
}

.v-enter-from .board-lines path.vline.opp {
  transform: translateY(45%) scaleY(0);
}

.v-enter-from .board-lines path.hline {
  transform: translateX(50%) scaleX(0);
}

.v-enter-from .board-lines path.cross.home {
  transform: translate(50%, 85%) scale(0);
}

.v-enter-from .board-lines path.cross.opp {
  transform: translate(50%, 15%) scale(0);
}

.board-lines path.cross {
  transition-delay: .2s;
}
</style>