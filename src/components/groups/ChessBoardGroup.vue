<script setup lang="ts">
import { ref } from 'vue';
import ChessPieceIcons from '@/components/ChessPieceIcons.vue';
import { useStore } from 'vuex';
import { Settings } from '@/store';

const store = useStore();
const settings = store.getters.settings as Settings;

const props = defineProps<{
  pieces: { [key: string]: number[] },
  turn: 0 | 1,
  actions: { moves: { [key: string]: number[][] }, blocks: { [key: string]: number[][] } },
  stalemate: string[],
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
    if (settings.haptic) navigator.vibrate(5);
  } else if (checkDisplay.value.piece == p) {
    checkDisplay.value = { piece: "", moves: [], blocks: [] }
  }
}

</script>

<template>
  <div class="chessBoardWrap" ref="boardWrap">
    <transition-group name="pieces" tag="div" class="chessGridWrap">
      <div v-for="(piece, i) in getPositions()" :key="piece ? piece : i" class="position">
        <chess-piece-icons v-if="piece != ''" :type="piece[0] + piece[piece.length - 1]"
          :coord="[Math.floor(i / 9), i % 9]" :rotate="true" :active="turn.toString() == piece[piece.length - 1]"
          :danger="stalemate.length > 0 && settings.stalemateAid"
          :attacker="stalemate.indexOf(piece) != -1 && settings.stalemateAid" @focus="f => onFocus(f, piece)"
          class="chessPiece" />
        <transition :duration="200" mode="out-in" :key="turn">
          <div v-if="checkDisplay.moves.indexOf(`${i % 9},${9 - Math.floor(i / 9)}`) + 1" :kill="piece != ''"
            :onclick="() => { emits('move', checkDisplay.piece, [i % 9, 9 - Math.floor(i / 9)]); checkDisplay = { piece: '', moves: [], blocks: [] }; }"
            class="movesCheck">
            <div v-if="settings.positionAid" class="movesCheckIndicator"></div>
          </div>
          <div v-else-if="checkDisplay.blocks.indexOf(`${i % 9},${9 - Math.floor(i / 9)}`) + 1 && settings.positionAid"
            :kill="piece != ''" class="blockedMove"></div>
        </transition>
      </div>
    </transition-group>
    <div class="chessLines">
      <svg viewBox="0 0 315 350" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path class="vLine opp" d="M52.5 17.5L52.5 157.5" />
        <path class="vLine opp" d="M87.5 17.5L87.5 157.5" />
        <path class="vLine opp" d="M122.5 17.5L122.5 157.5" />
        <path class="vLine opp" d="M157.5 17.5L157.5 157.5" />
        <path class="vLine opp" d="M192.5 17.5L192.5 157.5" />
        <path class="vLine opp" d="M227.5 17.5L227.5 157.5" />
        <path class="vLine opp" d="M262.5 17.5V157.5" />
        <path class="vLine home" d="M52.5 192.5L52.5 332.5" />
        <path class="vLine home" d="M87.5 192.5L87.5 332.5" />
        <path class="vLine home" d="M122.5 192.5L122.5 332.5" />
        <path class="vLine home" d="M157.5 192.5L157.5 332.5" />
        <path class="vLine home" d="M192.5 192.5L192.5 332.5" />
        <path class="vLine home" d="M227.5 192.5L227.5 332.5" />
        <path class="vLine home" d="M262.5 192.5L262.5 332.5" />
        <path class="hLine" d="M17.5 52.5L297.5 52.5" />
        <path class="hLine" d="M17.5 87.5L297.5 87.5" />
        <path class="hLine" d="M17.5 122.5L297.5 122.5" />
        <path class="hLine" d="M17.5 157.5H297.5" />
        <path class="hLine" d="M17.5 192.5H297.5" />
        <path class="hLine" d="M17.5 227.5H297.5" />
        <path class="hLine" d="M17.5 262.5H297.5" />
        <path class="hLine" d="M17.5 297.5H297.5" />
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
.chessBoardWrap {
  width: calc(100vw - 20px);
  max-width: 60vh;
  background: var(--background-secondary);
  mask: url("@/assets/board/board.svg");
  mask-size: cover;
  position: relative;
}

.chessGridWrap {
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

.chessPiece:hover,
.movesCheck:hover {
  cursor: pointer;
}

.movesCheck {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 100%;
  opacity: .5;
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: 3;
  display: flex;
  justify-content: center;
  align-items: center;
}

.movesCheckIndicator,
.blockedMove {
  width: 30%;
  aspect-ratio: 1;
  border-radius: 100%;
  background: var(--generic);
  box-shadow: var(--icon-shadow);
}

.movesCheck[kill="true"]>.movesCheckIndicator {
  outline: solid var(--dark) 3px;
  outline-offset: 5px;
  background: var(--dark);
}

.blockedMove {
  width: 50%;
  background: var(--generic);
  opacity: .8;
  mask: url("@/assets/icons/cross.svg");
  mask-size: 200%;
  mask-position: center;
  position: absolute;
  top: 25%;
  left: 25%;
  z-index: 3;
}

.blockedMove[kill="true"] {
  background: var(--contrast)
}

.chessLines {
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

.chessLines svg {
  width: 100%;
}

.chessLines path {
  stroke: var(--generic);
  stroke-width: 2px;
  opacity: .5;
}

.chessLines path.frame {
  stroke-width: 3px;
}

.v-enter-from .chessBoardWrap,
.v-leave-to .chessBoardWrap {
  transform: scale(.95);
  opacity: 0;
}

.v-enter-from.movesCheck,
.v-leave-to.movesCheck,
.v-enter-from.blockedMove,
.v-leave-to.blockedMove {
  transform: scale(.8);
  opacity: 0;
  box-shadow: none;
}

.v-enter-from.movesCheck>.movesCheckIndicator,
.v-leave-to.movesCheck>.movesCheckIndicator {
  width: 10%;
  outline-offset: 10px;
}

.v-enter-active.movesCheck,
.v-leave-active.movesCheck {
  transition: var(--transition-m);
}


.chessLines path {
  transition-delay: .1s;
}

.chessLines path.frame {
  transition-delay: .4s;
}

.v-enter-from .chessLines path.frame {
  stroke-width: 0px;
}

.v-enter-from .chessLines path.vLine.home {
  transform: translateY(55%) scaleY(0);
}

.v-enter-from .chessLines path.vLine.opp {
  transform: translateY(45%) scaleY(0);
}

.v-enter-from .chessLines path.hLine {
  transform: translateX(50%) scaleX(0);
}

.v-enter-from .chessLines path.cross.home {
  transform: translate(50%, 85%) scale(0);
}

.v-enter-from .chessLines path.cross.opp {
  transform: translate(50%, 15%) scale(0);
}

.chessLines path.cross {
  transition-delay: .2s;
}
</style>