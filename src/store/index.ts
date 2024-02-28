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

export class UserData {
  userid: string;
  password: string;
  constructor({ userid, password }: {
    userid: string,
    password: string,
  }) {
    this.userid = userid;
    this.password = password;
  }
}

export class GameData {
  settings?: GameSettings;
  play?: GamePlayData;
  constructor({ settings, play }: { settings?: GameSettings, play?: GamePlayData }) {
    this.settings = settings;
    this.play = play;
  }
}

export const useUserStore = defineStore('userStore', {
  state: () => {
    // localStorage.setItem("settings", "");
    const userStore = localStorage.getItem("userStore"), userData = {
      settings: new Settings(),
      user: undefined as UserData | undefined,
    };
    if (!userStore) {
      localStorage.setItem("userStore", JSON.stringify(userData));
    } else {
      const parsedData = JSON.parse(userStore)
      userData.settings = new Settings(parsedData.settings);
      if (parsedData.user) userData.user = new UserData(parsedData.user);
    }
    return userData
  },
  getters: {
    getSettings(state): Settings {
      return state.settings;
    },
  },
  actions: {
    saveLocalStorage() {
      localStorage.setItem(this.$id, JSON.stringify({
        settings: this.settings,
        user: this.user,
      }));
    },
    updateLocalStorage() {
      const userStore = localStorage.getItem("userStore"), parsedData = JSON.parse(userStore ? userStore : "{}");
      this.settings = new Settings(parsedData.settings);
      if (parsedData.user) this.user = new UserData(parsedData.user);
    },
    setSettings(settings: Settings) {
      this.settings = settings;
      this.saveLocalStorage();
    },
    feedback(pattern: number | number[] = 5) {
      if (this.settings.haptic && navigator.vibrate) navigator.vibrate(pattern);
    }
  }
});

export const useGameStore = defineStore('gameStore', {
  state: () => {
    const local = localStorage.getItem("gameStore"), gameData = {
      settings: {
        gameDuration: 3600000,
        turnDuration: 300000,
      },
      play: undefined as {
        settings: GameSettings,
        game: GamePlayData | undefined,
      } | undefined,
      saves: {} as { [key: string]: { settings: GameSettings, game: GamePlayData } }
    };
    try {
      const localData = JSON.parse(local ? local : "{}");
      if (localData.settings) gameData.settings = localData.settings as { gameDuration: number, turnDuration: number };
      if (localData.saves) gameData.saves = localData.saves;
      if (localData.play && localData.play.settings) gameData.play = localData.play;
    } catch (e) {
      console.error("Error retrieving data: ", gameData, e);
      localStorage.setItem("gameStore", JSON.stringify(gameData));
    }
    return gameData
  },
  getters: {
    isPlaying(state): boolean {
      return !!state.play;
    },
    isSaved(state): boolean {
      return !!state.play?.game;
    },
    getGame(state): { settings: GameSettings, play?: GamePlayData } {
      if (state.play) return state.play;
      else throw ("error");
    },
    getSettings(state) {
      return { ...state.settings };
    },
    getSavedGames(state): { [key: string]: { settings: GameSettings, game: GamePlayData } } {
      return state.saves;
    }
  },
  actions: {
    saveLocalStorage() {
      // console.log(JSON.stringify({
      //   settings: this.settings,
      //   play: this.play,
      //   saves: this.saves
      // }));
      localStorage.setItem("gameStore", JSON.stringify({
        settings: this.settings,
        play: this.play,
        saves: this.saves
      }));
    },
    updateLocalStorage() {
      const local = localStorage.getItem(this.$id), localData = JSON.parse(local ? local : "{}");

      this.settings = localData.settings ? localData.settings : {
        gameDuration: 3600000,
        turnDuration: 300000,
      };
      this.play = localData.play;
      this.saves = localData.saves;
    },
    setGame(settings: GameSettings) {
      this.play = {
        settings,
        game: undefined,
      }
      this.saveLocalStorage();
    },
    updateGame(playData: GamePlayData) {
      if (this.play)
        if (playData && Object.keys(playData.boardHist).length > 1) {
          this.play.game = playData;
          if (Object.keys(this.saves).indexOf(playData.start) != -1) this.saves[playData.start].game = playData;
        } else {
          this.play.game = undefined;
          if (Object.keys(this.saves).indexOf(playData.start) != -1) delete this.saves[playData.start];
        }
      this.saveLocalStorage();
    },
    endGame() {
      if (this.play && this.play.game) {
        if (Object.keys(this.saves).indexOf(this.play.game.start) != -1) delete this.saves[this.play.game.start];
      }
      this.play = undefined;
      this.saveLocalStorage();
    },
    saveGame() {
      if (this.play && this.play.game) this.saves[this.play.game.start] = { ...this.play } as { settings: GameSettings, game: GamePlayData };
      this.play = undefined;
      this.saveLocalStorage();
    },
    playSavedGame(key: string) {
      if (Object.keys(this.saves).indexOf(key) != -1) {
        const save = { ...this.saves[key] };
        this.play = save;
      }
    },
  }
});

// addEventListener("storage", () => {
//   useUserStore().updateLocalStorage();
//   useGameStore().updateLocalStorage();
// })
