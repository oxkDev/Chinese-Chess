import { createStore } from 'vuex'
import { ColourTheme } from './themes';
import { GamePlayData, GameSettings } from './chinese chess';

export class Settings {
  colourTheme: ColourTheme;
  designTheme: "default" | "subtle" | "square";
  blur: number;
  music: boolean;
  game: boolean;
  atmos: boolean;
  haptic: boolean;
  animationSpeed: number;
  animationLevel: number;
  positionAid: boolean;
  stalemateAid: boolean;
  constructor(
    colourTheme: ColourTheme = new ColourTheme(),
    designTheme: "default" | "subtle" | "square" = "default",
    blur = 2,
    music = false,
    game = false,
    atmos = false,
    haptic = true,
    animationSpeed = 100,
    animationLevel = 2,
    positionAid = true,
    stalemateAid = true,
  ) {
    this.colourTheme = colourTheme;
    this.designTheme = designTheme;
    this.blur = blur;
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

export interface GameData {
  settings: GameSettings,
  play?: GamePlayData,
}

export default createStore({
  state: () => {
    const settings = localStorage.getItem("settings");
    const game = localStorage.getItem("game");
    return {
      // settings: {
      settings: settings ? JSON.parse(settings) as Settings : new Settings(),
      // },
      game: (game ? JSON.parse(game) : {}) as GameData,
    }
  },
  mutations: {
    setSettings(state, settings: Settings) {
      state.settings = settings;
      localStorage.setItem("settings", JSON.stringify(settings));
    },
    setGame(state, settings: GameSettings) {
      state.game.settings = settings;
      localStorage.setItem("game", JSON.stringify(state.game));
    },
    updateGame(state, playData: GamePlayData) {
      state.game.play = playData;
      localStorage.setItem("game", JSON.stringify(state.game));
    },
    endGame(state) {
      state.game.play = undefined;
      localStorage.setItem("game", JSON.stringify(state.game));
    },
    // localSave(state, type: "game" | "settings") {
    //   localStorage.setItem(type, JSON.stringify(state[type]));
    // }
  },
  getters: {
    isPlaying(state) {
      return !!state.game.play;
    },
    game(state) {
      if (state.game.settings) return state.game;
      else return false;
    },
    settings(state) {
      if (state.settings) return state.settings;
      else return false;
      // return { ...state.game.settings };
    },
  },
  actions: {
  },
  modules: {
  }
});