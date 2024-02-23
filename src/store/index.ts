import { defineStore } from 'pinia'
import { ColourTheme } from './themes';
import { type GamePlayData, type GameSettings } from './chinese chess';

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

export const useStore = defineStore('preferences', {
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
  getters: {
    isPlaying(state): boolean {
      return !!state.game.play && Object.keys(state.game.play.boardHist).length > 1;
    },
    getGame(state): { settings: GameSettings, play?: GamePlayData } {
      if (state.game.settings) return state.game as { settings: GameSettings, play?: GamePlayData };
      else return { settings: {
        type: '2 Player',
        names: ['Home', 'Rival'],
        gameDuration: 3600000,
        turnDuration: 300000,
        starter: Math.round(Math.random()) as 0 | 1,
      } };
    },
    getSettings(state): Settings {
      if (state.settings) return { ...state.settings };
      else throw ("settings not found");
    },
    getSavedGames(state): { [key: string]: { settings: GameSettings, play: GamePlayData } } {
      return state.saves;
    }
  },
  actions: {
    setSettings(settings: Settings) {
      this.settings = settings;
      localStorage.setItem("settings", JSON.stringify(settings));
    },
    setGame(settings: GameSettings) {
      this.game.settings = settings;
      localStorage.setItem("game", JSON.stringify(this.game));
    },
    updateGame(playData: GamePlayData) {
      if (playData && Object.keys(playData.boardHist).length > 1) {
        this.game.play = playData;
        if (Object.keys(this.saves).indexOf(playData.start) != -1) this.saves[playData.start].play = playData;
      } else {
        this.game.play = undefined;
        if (Object.keys(this.saves).indexOf(playData.start) != -1) delete this.saves[playData.start];
      }
      localStorage.setItem("saves", JSON.stringify(this.saves));
      localStorage.setItem("game", JSON.stringify(this.game));
    },
    endGame() {
      if (this.game.play) {
        if (Object.keys(this.saves).indexOf(this.game.play.start) != -1) delete this.saves[this.game.play.start];
        localStorage.setItem("saves", JSON.stringify(this.saves));
        this.game.play = undefined;
        localStorage.setItem("game", JSON.stringify(this.game));
      }
    },
    saveGame() {
      if (this.game.play) this.saves[this.game.play.start] = { ...this.game } as { settings: GameSettings, play: GamePlayData };
      this.game.play = undefined;
      localStorage.setItem("game", JSON.stringify(this.game));
      localStorage.setItem("saves", JSON.stringify(this.saves));
    },
    playSavedGame(key: string) {
      if (Object.keys(this.saves).indexOf(key) != -1)
        this.game = { ...this.saves[key] } as GameData;
    },
    feedback(pattern: number | number[] = 5) {
      if (this.settings.haptic && navigator.vibrate) navigator.vibrate(pattern);
    }
  }
});