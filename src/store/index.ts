import { createStore } from 'vuex'

export class Settings {
  colour: number;
  design: number;
  music: boolean;
  game: boolean;
  atmos: boolean;
  haptic: boolean;
  animationSpeed: number;
  animationLevel: number;
  positionAid: boolean;
  stalemateAid: boolean;
  constructor(
    colour = 1,
    design = 1,
    music = true,
    game = false,
    atmos = false,
    haptic = false,
    animationSpeed = 50,
    animationLevel = 2,
    positionAid = true,
    stalemateAid = false,
  ) {
    this.colour = colour;
    this.design = design;
    this.music = music;
    this.game = game;
    this.atmos = atmos;
    this.haptic = haptic;
    this.animationSpeed = animationSpeed;
    this.animationLevel = animationLevel;
    this.positionAid = positionAid;
    this.stalemateAid = stalemateAid;
  }
}

interface Pieces { [key: string]: number[] }

interface GameSettings {
  names: string[],
  gameDuration: number,
  turnDuration: number,
  starter: 0 | 1,
}

interface GameData {
  settings: GameSettings,
  play: {
    turn: 0 | 1,
    boardHist: { [key: number]: Pieces },
    timer: {
      0: number,
      1: number,
    }
    turnTimer: number,
  }
}

export default createStore({
  state: {
    // settings: {
    settings: new Settings(),
    // },
    game: {} as GameData,
  },
  mutations: {
    setSettings(state, settings: Settings) {
      state.settings = settings;
    },
    setGame(state, settings: GameSettings) {
      const gameData: GameData = {
        settings: settings,
        play: {
          turn: settings.starter,
          boardHist: {},
          timer: {
            0: settings.gameDuration,
            1: settings.gameDuration,
          },
          turnTimer: settings.turnDuration,
        }
      }
      state.game = gameData;
    },
    editGame(state, settings: {gameDuration: number, turnDuration: number}) {
      state.game.settings.gameDuration = settings.gameDuration;
      state.game.settings.turnDuration = settings.turnDuration;
    }
  },
  getters: {
    game(state) {
      if (state.game.settings && state.game.play) return state.game;
      else return false;
    },
    settings(state) {
      if (state.game.settings) return state.game.settings;
      else return false;
      // return { ...state.game.settings };
    },
  },
  actions: {
  },
  modules: {
  }
})
