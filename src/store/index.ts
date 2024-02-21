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
    // localStorage.setItem("saves", "");
    const saves = localStorage.getItem("saves");
    return {
      // settings: {
      settings: settings ? JSON.parse(settings) as Settings : new Settings(),
      // },
      game: (game ? JSON.parse(game) : {}) as GameData,
      saves: (saves ? JSON.parse(saves) : {}) as { [key: string]: { settings: GameSettings, play: GamePlayData } },
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
      if (playData && Object.keys(playData.boardHist).length > 1) {
        state.game.play = playData;
        if (Object.keys(state.saves).indexOf(playData.start) != -1) state.saves[playData.start].play = playData;
      } else {
        state.game.play = undefined;
        if (Object.keys(state.saves).indexOf(playData.start) != -1) delete state.saves[playData.start];
      }
      localStorage.setItem("saves", JSON.stringify(state.saves));
      localStorage.setItem("game", JSON.stringify(state.game));
    },
    endGame(state) {
      if (state.game.play) {
        if (Object.keys(state.saves).indexOf(state.game.play.start) != -1) delete state.saves[state.game.play.start];
        localStorage.setItem("saves", JSON.stringify(state.saves));
        state.game.play = undefined;
        localStorage.setItem("game", JSON.stringify(state.game));
      }
    },
    saveGame(state, game: GameData = state.game) {
      if (game.play) state.saves[game.play.start] = { ...game } as { settings: GameSettings, play: GamePlayData };
      state.game.play = undefined;
      localStorage.setItem("game", JSON.stringify(state.game));
      localStorage.setItem("saves", JSON.stringify(state.saves));
    },
    playSavedGame(state, key: string) {
      if (Object.keys(state.saves).indexOf(key) != -1) {
        state.game = { ...state.saves[key] } as GameData;
        console.log(state.game);
      } else
        console.log("game not found")
    }
  },
  getters: {
    isPlaying(state) {
      return !!state.game.play && Object.keys(state.game.play.boardHist).length > 1;
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
    savedGames(state) {
      return state.saves;
    }
  },
  actions: {
  },
  modules: {
  }
});