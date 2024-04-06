import { defineStore } from 'pinia'
import { ColourTheme } from './themes';
import { type GamePlayData, type GameSettings } from './chinese chess';
import { deleteDoc, doc, getDoc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { EmailAuthProvider, createUserWithEmailAndPassword, getAuth, reauthenticateWithCredential, sendEmailVerification, signInWithEmailAndPassword, updateEmail, updatePassword, updateProfile } from 'firebase/auth';
import { ref, toRaw } from 'vue';

const auth = getAuth();

export const errorMessage: { [key: string]: string } = {
  "auth/invalid-credential": "The email or password provided is invalid",
  "auth/invalid-email": "The email provided is invalid",
  "auth/email-already-in-use": "This email is already in use",
  "auth/too-many-requests": "This account is temporarily disabled due to too many failed login attempts"
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
  statistics: Statistics;
  constructor({
    email,
    username,
    score = 100,
    rank = 0,
    statistics = new Statistics({ bestRank: rank }),
  }: {
    email: string,
    username: string,
    score?: number,
    rank?: number,
    statistics?: Statistics,
  }) {
    this.email = email;
    this.username = username;
    this.score = score || 0;
    this.rank = rank || 0;
    this.statistics = { ...new Statistics(statistics) };
  }
}

class Statistics {
  bestRank: number;
  games: { "tp": number, "cp": number, "ol": number, };
  wins: { "tp": number, "cp": number, "ol": number, };
  moves: { "tp": number, "cp": number, "ol": number, };
  playTime: { "tp": number, "cp": number, "ol": number, };
  constructor({
    bestRank = 0,
    games = { "tp": 0, "cp": 0, "ol": 0, },
    wins = { "tp": 0, "cp": 0, "ol": 0, },
    moves = { "tp": 0, "cp": 0, "ol": 0, },
    playTime = { "tp": 0, "cp": 0, "ol": 0, }
  } = {}) {
    this.bestRank = bestRank;
    this.games = games;
    this.wins = wins;
    this.moves = moves;
    this.playTime = playTime;
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

  // const gameStore = useGameStore();
  function getUserDoc(curUser = auth.currentUser) {
    if (curUser) return doc(db, "users", curUser.uid);
    else throw "firebase doc not available";
  }

  function merge(localData: UserData, snapshotData: UserData): UserData {
    const localStat = localData.statistics, snapshotStat = snapshotData.statistics;
    function sum(values: { [key: string]: number } | number[]) {
      values = Object.values(values);
      let r = 0;
      values.forEach(v => {
        r += v;
      });
      return r;
    }
    const newStat = {
      "bestRank": !localStat.bestRank || !snapshotStat.bestRank ? snapshotStat.bestRank || localStat.bestRank : Math.min(localStat.bestRank, snapshotStat.bestRank),
      "games": sum(localStat.games) > sum(snapshotStat.games) ? localStat.games : snapshotStat.games,
      "wins": sum(localStat.wins) > sum(snapshotStat.wins) ? localStat.wins : snapshotStat.wins,
      "moves": sum(localStat.moves) > sum(snapshotStat.moves) ? localStat.moves : snapshotStat.moves,
      "playTime": sum(localStat.playTime) > sum(snapshotStat.playTime) ? localStat.playTime : snapshotStat.playTime,
    };
    return new UserData({
      email: localData.email,
      username: snapshotData.username || localData.username,
      score: snapshotData.score || localData.score,
      statistics: newStat,
    });
  }

  // state
  const firebaseData = ref(undefined as {
    provider: string,
    displayName: string | null,
    email: string,
    photoURL: string | null,
    verified: boolean,
  } | undefined);

  // actions
  async function loadFirebase() {
    const user = auth.currentUser;
    if (user && user.email) {
      userStore.email = user.email;
      const snapshot = await getDoc(getUserDoc()).catch(e => {
        console.error("saveFirebase error:", e);
        throw e;
      });

      const rawData = { ...snapshot.data() } as { email: string, username: string, [key: string]: any };
      if (!rawData || JSON.stringify(rawData) == '{}') {
        if (userStore.user) saveFirebase();
        return;
      }

      const snapUserData = new UserData(rawData.email && rawData.username ? rawData : { email: user.email, username: user.email.split("@")[0] });

      userStore.user = userStore.user ? merge(userStore.user, snapUserData) : snapUserData;
      userStore.saveLocalStorage();
      console.info("loadFirebase success:", userStore.user);

      if (JSON.stringify(snapUserData) != JSON.stringify(userStore.user)) saveFirebase();

      return { rawData, userData: userStore.user };
    }
  }

  async function saveFirebase() {
    const user = auth.currentUser;
    if (user && user.email) {
      // if (!userStore.user) userStore.user = new UserData({ email: user.email });
      await setDoc(getUserDoc(), { ...userStore.user }).catch(e => {
        console.error("saveFirebase error:", e);
        throw e;
      });
      console.info("saveFirebase success:", userStore.user);
    }
  }

  async function updateUserMeta() {
    if (userStore.user && auth.currentUser) {
      await updateProfile(auth.currentUser, { displayName: userStore.user.username }).catch(e => {
        console.error('updateUserMeta error:');
        throw e;
      });
      console.log('updateUserMeta: success');
    }
  }

  // initialise
  auth.authStateReady().then(async () => {
    const user = auth.currentUser;
    if (user && user.email) onSnapshot(getUserDoc(), {
      next(snapshot) {
        console.log("snapshot update:", snapshot);
      }
    });
  });

  auth.onAuthStateChanged(user => {
    console.log("status update", user)
    userStore.loggedIn = !!user;
    loadFirebase();

    if (user && user.email) {
      firebaseData.value = {
        provider: user.providerId,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        verified: user.emailVerified,
      }

      if (firebaseData.value.displayName != userStore.user?.username)
        updateUserMeta();
    } else
      firebaseData.value = undefined;
  });

  return {
    // states
    firebaseData,
    // actions
    getUserDoc,
    loadFirebase,
    saveFirebase,
    updateUserMeta,
    // getters
    async getStatus() {
      await auth.authStateReady();
      return !!auth.currentUser;
    },
  }
});

export const useUserStore = defineStore('userStore', {
  state: () => {
    // localStorage.setItem("settings", "");
    const userStore = localStorage.getItem("userStore"), userData = {
      settings: new Settings(),
      user: undefined as UserData | undefined,
      email: undefined as string | undefined,
    };
    if (userStore) {
      const parsedData = JSON.parse(userStore);

      if (parsedData.user) userData.user = new UserData(parsedData.user);
      userData.settings = new Settings(parsedData.settings);
      userData.email = parsedData.email;
    } else localStorage.setItem("userStore", JSON.stringify(userData));

    return { ...userData, loggedIn: false };
  },
  getters: {
    getSettings(state): Settings {
      return state.settings;
    },
    getUser(state): UserData {
      // if (!this.user) throw "UserData not fuond";
      // return this.user
      return state.user || new UserData({ email: "An unexpected error has occurred", username: "Error..." });
    },
    getEmail(state) {
      return state.email;
    },
    getStatistics(state): { [key: string]: any } {
      if (state.user) return state.user.statistics;
      else return {};
    },
    isSetup(state): boolean {
      return !!state.user;
    },
    isLoggedIn(state) {
      return state.loggedIn;
    }
  },
  actions: {
    saveLocalStorage() {
      localStorage.setItem(this.$id, JSON.stringify({
        settings: this.settings,
        user: this.user,
        email: this.email,
      }));
    },
    loadLocalStorage() {
      const userStore = localStorage.getItem(this.$id), parsedData = JSON.parse(userStore ? userStore : "{}");
      this.settings = new Settings(parsedData.settings);
      this.user = parsedData.user;
      this.email = parsedData.email;
    },
    setSettings(settings: Settings) {
      this.settings = settings;
      this.saveLocalStorage();
    },
    async setupAccount(username: string) {
      // if successful, add user to state.user;
      if (!(await useFireStore().getStatus())) throw "setupAccount: user not signed in";
      if (!auth.currentUser || !auth.currentUser.email) throw "setupAccount: user email not found";

      this.user = new UserData({ email: auth.currentUser.email, username });
      this.saveLocalStorage();
      try {
        await useFireStore().saveFirebase();
        console.info("setup success:", this.user);
      } catch (e) {
        console.error("setDoc error:", e);
      }

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
      const verify = await sendEmailVerification(result.user, { url: import.meta.url });
      console.log(verify);
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
      auth.signOut().catch(e => {
        console.info("signOut: error");
        throw e;
      });
      this.user = undefined;
      this.saveLocalStorage();
      return "success";
    },
    async reSignIn(password: string) {
      const user = auth.currentUser;
      if (!user || !user.email) throw "reSignIn error: user not signed in";
      const authCred = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, authCred);
    },
    async updateUserData({ username }: { username: string }) {
      const fireStore = useFireStore();
      if (this.user && fireStore.firebaseData) {
        this.user.username = username;
        this.saveLocalStorage();
        await fireStore.updateUserMeta();
        fireStore.saveFirebase();
      }
    },
    async updateAccount({ email, newPassword }: { email?: string, newPassword?: string }) {
      const user = auth.currentUser;
      if (!user) throw "updateAccount error: user not signed in";

      try {
        if (email && user.email != email) updateEmail(user, email);
        if (newPassword) updatePassword(user, newPassword);
      } catch (e) {
        console.error("updateAccount error:", e);
        throw e;
      }
    },
    async deleteAccount(password: string) {
      const user = auth.currentUser;
      if (user && user.email) {
        await this.reSignIn(password);
        console.log("signed in")
        try {
          await user.delete().then(async () => {
            this.user = undefined;
            this.saveLocalStorage();
            await deleteDoc(useFireStore().getUserDoc(user));
          });
          return "success"
        } catch (e) {
          console.error("deleteAccount: error");
          throw e;
        }
      } else throw ("Not signed in");
    },
    async resetAccount() {
      const user = auth.currentUser;
      this.settings = new Settings();
      if (user && user.email && this.user) {
        this.user = new UserData({ email: user.email, username: this.user.username });
      }
      const gameStore = useGameStore();
      this.saveLocalStorage();

      gameStore.saves = {};
      gameStore.saveLocalStorage();

      useFireStore().saveFirebase();
    },
    updateStat(type: "tp" | "ol" | "cp", action: "games" | "moves" | "wins" | "playTime", value: number) {
      if (this.user) this.user.statistics[action][type] = this.user.statistics[action][type] + value || 0;
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
      console.error("Error retrieving data:", gameData, e);
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
      if (state.play) return { ...state.play };
      else return {
        settings: {
          type: 'tp',
          names: [],
          gameDuration: this.settings.gameDuration,
          turnDuration: this.settings.turnDuration,
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
        gameDuration: 3600,
        turnDuration: 300,
      };
      this.play = localData.play;
      this.saves = localData.saves;
    },
    setGame(settings: GameSettings) {
      if (this.play) {
        this.play.settings = settings;
      } else {
        console.log("new game", settings)
        this.play = {
          settings,
          game: undefined,
        }
      }

      this.settings.gameDuration = settings.gameDuration;
      this.settings.turnDuration = settings.turnDuration;
      this.saveLocalStorage();
    },
    updateGame(playData: GamePlayData) {
      if (this.play)
        if (playData && Object.keys(playData.boardHist).length > 1) {
          this.play.game = toRaw({ ...playData });
          if (Object.keys(this.saves).includes(playData.start)) this.saves[playData.start].game = toRaw({ ...playData });
        } else {
          this.play.game = undefined;
          if (Object.keys(this.saves).includes(playData.start)) delete this.saves[playData.start];
        }
      console.log(playData, this.play)
      this.saveLocalStorage();
    },
    endGame(gameKey?: string) {
      const gameKeys = Object.keys(this.saves);
      if (gameKey) {
        if (gameKeys.includes(gameKey)) {
          const gameSave = this.saves[gameKey];
          this.addStatistics(gameSave.settings.type, gameSave.game);
          delete this.saves[gameKey];
        }
      } else if (this.play) {
        if (this.play.game) {
          if (gameKeys.includes(this.play.game.start)) delete this.saves[this.play.game.start];
          this.addStatistics(this.play.settings.type, this.play.game);
        }
        this.play = undefined;
      }
      this.saveLocalStorage();
    },
    saveGame() {
      if (this.play && this.play.game) this.saves[this.play.game.start] = toRaw({ ...this.play }) as { settings: GameSettings, game: GamePlayData };
      this.play = undefined;
      this.saveLocalStorage();
    },
    playSavedGame(key: string) {
      if (Object.keys(this.saves).includes(key)) {
        const save = { ...this.saves[key] };
        this.play = toRaw(save);
        this.saveLocalStorage();
      }
    },
    addStatistics(type: "tp" | "cp" | "ol", playData: GamePlayData) {
      const userStore = useUserStore(), fireStore = useFireStore();

      userStore.updateStat(type, "games", 1);
      userStore.updateStat(type, "moves", Object.keys(playData.boardHist).length - 1);
      if (playData.winner == 0) userStore.updateStat(type, "wins", 1);
      userStore.updateStat(type, "playTime", Math.round((playData.timer[0] + playData.timer[1]) / 1000));
      userStore.saveLocalStorage();
      fireStore.saveFirebase();
    },
  }
});

addEventListener("storage", e => {
  if (e.key == useUserStore.$id) useUserStore().loadLocalStorage();
  if (e.key == useGameStore.$id) useGameStore().loadLocalStorage();
})