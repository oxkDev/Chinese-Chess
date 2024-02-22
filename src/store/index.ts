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
  constructor({
    colourTheme = new ColourTheme(),
    designTheme = "default" as "default" | "subtle" | "square",
    blur = 2,
    music = false,
    game = false,
    atmos = false,
    haptic = true,
    animationSpeed = 100,
    animationLevel = 2,
    positionAid = true,
    stalemateAid = true,
  } = {}) {
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

  vibrate(pattern: number | number[] = 5) {
    if (this.haptic && navigator.vibrate) navigator.vibrate(pattern);
  }
}

export class GameData {
  settings?: GameSettings;
  play?: GamePlayData;
  constructor({ settings, play }: { settings?: GameSettings, play?: GamePlayData }) {
    this.settings = settings;
    this.play = play;

    return {
      settings: settings,
      play: play,
    }
  }
}

export default createStore({
  state: () => {
    // localStorage.setItem("settings", "");
    const settings = localStorage.getItem("settings");
    const game = localStorage.getItem("game");
    const saves = localStorage.getItem("saves");
    return {
      // settings: {
      settings: new Settings(JSON.parse(settings ? settings : "{}")),
      // },
      game: new GameData(JSON.parse(game ? game : "{}")),
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
      if (Object.keys(state.saves).indexOf(key) != -1)
        state.game = { ...state.saves[key] } as GameData;
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