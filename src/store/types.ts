import type { GameSettings, GamePlayData } from "./chinese chess";
import { ColourTheme } from "./themes";

// user settings data structure
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