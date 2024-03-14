import { defineStore } from 'pinia'
import { ColourTheme } from './themes';
import { type GamePlayData, type GameSettings } from './chinese chess';
import { deleteDoc, doc, getDoc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { ref } from 'vue';

const auth = getAuth();

export const errorMessage: { [key: string]: string } = {
  "auth/invalid-credential": "The email or password provided is invalid",
  "auth/invalid-email": "The email provided is invalid",
  "auth/email-already-in-use": "This email is already in use"
}

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
  email: string;
  username: string;
  score: number;
  rank: number;
  statistics: {
    "bestRank": number,
    "games": {
      "tp": number,
      "cp": number,
      "ol": number,
    },
    "wins": {
      "tp": number,
      "cp": number,
      "ol": number,
    },
    "moves": {
      "tp": number,
      "cp": number,
      "ol": number,
    }
  };
  constructor({
    email,
    username = email.split("@")[0],
    score = 100,
    rank = 1000,
    statistics = {
      "bestRank": rank,
      "games": {
        "tp": 0,
        "cp": 0,
        "ol": 0,
      },
      "wins": {
        "tp": 0,
        "cp": 0,
        "ol": 0,
      },
      "moves": {
        "tp": 0,
        "cp": 0,
        "ol": 0,
      }
    }
  }: {
    email: string,
    username?: string,
    score?: number,
    rank?: number,
    statistics?: {
      "bestRank": number,
      "games": {
        "tp": number,
        "cp": number,
        "ol": number,
      },
      "wins": {
        "tp": number,
        "cp": number,
        "ol": number,
      },
      "moves": {
        "tp": number,
        "cp": number,
        "ol": number,
      }
    }
  }) {
    this.email = email;
    this.username = username;
    this.score = score || 0;
    this.rank = rank || 0;
    this.statistics = statistics;
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

export const useFireStore = defineStore('firestore', () => {
  const auth = getAuth();

  const userStore = useUserStore();
  const gameStore = useGameStore();

  // state
  const firebaseData = ref({
    user: userStore.user,
    savedGames: gameStore.saves,
  });

  // actions
  async function loadFirebase() {
    if (auth.currentUser && auth.currentUser.email) {
      const snapshot = await getDoc(doc(db, "users", auth.currentUser.email)).catch(e => {
        console.error("saveFirebase error:", e);
        throw e;
      });
      const data = { ...snapshot.data() };
      console.info("loadFirebase success: ", data);
      if (data && data.email) {
        userStore.user = new UserData(data as {email: string, [key: string]: any});
        userStore.saveLocalStorage();
      }
    }
  }

  async function saveFirebase() {
    const user = auth.currentUser;
    if (user && user.email) {
      if (!userStore.user) userStore.user = new UserData({ email: user.email });
      await setDoc(doc(db, "users", user.email), { ...userStore.user }).catch(e => {
        console.error("saveFirebase error:", e);
        throw e;
      });
      console.info("saveFirebase: success");
    }
  }

  // initialise
  if (auth.currentUser && auth.currentUser.email) onSnapshot(doc(db, "users", auth.currentUser.email), {
    next(snapshot) {
      console.log(snapshot)
    }
  });
  auth.authStateReady().then(() => {
    loadFirebase();
  });

  return {
    // states
    firebaseData,
    // actions
    loadFirebase,
    saveFirebase,
    test() {
      console.log(this.loadFirebase());
    }
    // getters
  }
});

export const useUserStore = defineStore('userStore', {
  state: () => {
    // localStorage.setItem("settings", "");
    const userStore = localStorage.getItem("userStore"), userData = {
      settings: new Settings(),
      user: undefined as UserData | undefined,
    };
    if (userStore) {
      const parsedData = JSON.parse(userStore)
      userData.settings = new Settings(parsedData.settings);
      if (parsedData.user) userData.user = new UserData(parsedData.user);
    } else localStorage.setItem("userStore", JSON.stringify(userData));

    return userData
  },
  getters: {
    getSettings(): Settings {
      return this.settings;
    },
    getUser(): UserData {
      return this.user || new UserData({ email: "fake@gmail.com" });
    },
    getStatistics(): {[key: string]: any} {
      if (this.user) return this.user.statistics;
      else return {};
    },
    isLoggedIn(): boolean {
      return !!this.user;
    }
  },
  actions: {
    saveLocalStorage() {
      localStorage.setItem(this.$id, JSON.stringify({
        settings: this.settings,
        user: this.user,
      }));
    },
    loadLocalStorage() {
      const userStore = localStorage.getItem(this.$id), parsedData = JSON.parse(userStore ? userStore : "{}");
      this.settings = new Settings(parsedData.settings);
      this.user = parsedData.user;
    },
    setSettings(settings: Settings) {
      this.settings = settings;
      this.saveLocalStorage();
    },
    async signUp({ email, password }: {
      email: string,
      password: string,
    }) {
      // attempt sign up
      const result = await createUserWithEmailAndPassword(auth, email, password).catch(e => {
        console.error("signUp error:", e);
        throw e;
      });
      // if successful, add user to state.user;
      this.user = new UserData({ email });
      this.saveLocalStorage();
      try {

        await setDoc(doc(db, "users", email), { ...this.user });
        console.info("signUp success:", result.user);
      } catch (e) {
        console.error("setDoc error: ", e);
      }
      return result;

    },
    async signIn({ email, password }: {
      email: string,
      password: string,
    }) {
      // attempt log in
      const result = await signInWithEmailAndPassword(auth, email, password).catch(e => {
        console.error("signIn error:", e);
        throw e;
      });
      // if successful, add user to state.user;
      await useFireStore().loadFirebase();
      return result;
    },
    async signOut() {
      await signOut(auth).catch(e => {
        console.info("signOut: error");
        throw e;
      });
      this.user = undefined;
      this.saveLocalStorage();
      return "success";
    },
    async deleteAccount(password: string) {
      const user = auth.currentUser;
      if (user) {
        await this.signIn({ email: user.email || "", password }).catch(e => {
          throw e;
        });
        try {
          user.delete();
          this.user = undefined;
          this.saveLocalStorage();
          await deleteDoc(doc(db, "users", user.email || ""));
          return "success"
        } catch (e) {
          console.error("deleteAccount: error");
          throw e;
        }
      } else throw ("Not signed in");
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
      const localData = JSON.parse(local || "{}");
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
    getGame(state): { settings: GameSettings, game?: GamePlayData } {
      if (state.play) return state.play;
      else return {
        settings: {
          type: '2 Player',
          names: [],
          gameDuration: state.settings.gameDuration,
          turnDuration: state.settings.turnDuration,
          starter: 0
        }
      };
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
      // console.info(JSON.stringify({
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
    loadLocalStorage() {
      const local = localStorage.getItem(this.$id), localData = JSON.parse(local || "{}");

      this.settings = localData.settings ? localData.settings : {
        gameDuration: 3600000,
        turnDuration: 300000,
      };
      this.play = localData.play;
      this.saves = localData.saves;
    },
    setGame(settings: GameSettings) {
      if (this.play)
        this.play.settings = settings;
      else
        this.play = {
          settings,
          game: undefined,
        }

      this.settings.gameDuration = settings.gameDuration;
      this.settings.turnDuration = settings.turnDuration;
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
        this.saveLocalStorage();
      }
    },
  }
});

addEventListener("storage", e => {
  if (e.key == useUserStore.$id) useUserStore().loadLocalStorage();
  if (e.key == useGameStore.$id) useGameStore().loadLocalStorage();
})