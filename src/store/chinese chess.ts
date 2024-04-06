
export interface Pieces { [key: string]: number[] }

export interface GameSettings {
  type: "tp" | "cp" | "ol",
  names: string[],
  gameDuration: number,
  turnDuration: number,
  starter: 0 | 1,
}

export interface BoardHist {
  [key: string]: {
    board: Pieces,
    time: { 0: number, 1: number },
    turn: number
  }
}

export interface GamePlayData {
  start: string,
  turn: 0 | 1,
  boardHist: BoardHist,
  timer: {
    0: number,
    1: number,
  }
  winner?: 0 | 1,
}

export class Game {
  defPieces: Pieces;
  pieces: Pieces;
  constructor() {
    this.defPieces = {
      "C1": [0, 0],
      "C2": [8, 0],
      "M1": [1, 0],
      "M2": [7, 0],
      "X1": [2, 0],
      "X2": [6, 0],
      "S1": [3, 0],
      "S2": [5, 0],
      "J": [4, 0],
      "P1": [1, 2],
      "P2": [7, 2],
      "B1": [0, 3],
      "B2": [2, 3],
      "B3": [4, 3],
      "B4": [6, 3],
      "B5": [8, 3],
    }

    this.pieces = {};
    this.resetPieces();
  }

  resetPieces() {
    for (const n in [0, 1]) for (const i in this.defPieces) {
      this.pieces[`${i} ${n}`] = [this.defPieces[i][0], Math.abs(9 * parseInt(n) - this.defPieces[i][1])];
    }
    return { ...this.pieces };
  }

  movesCheck(pieceDat: { type: string, player: number }, pieces: Pieces = this.pieces): { positions: number[][], attacks: string[] } {
    const { type, player } = pieceDat;
    const pieceKey = `${pieceDat.type} ${pieceDat.player}`;
    const coord = pieces[`${pieceDat.type} ${pieceDat.player}`];
    // console.log("movecheck", type, player, coord);
    const [x, y] = coord;
    const functions: { [fn: string]: () => { positions: number[][], attacks: string[] } } = {
      C: () => {
        // console.log("C")
        const limits: { [key: number]: number[] } = {
          0: [0, 8],
          1: [0, 9],
        }, attacked: { [key: number]: { [key: number]: string } } = {
          0: { 0: "", 1: "" },
          1: { 0: "", 1: "" },
        };
        for (const secKey in pieces) {
          const secCoord = pieces[secKey], secPlayer = parseInt(secKey.split(' ')[1]);

          if (secKey == pieceKey) continue;
          let axis = -1;
          if (secCoord[0] == x) axis = 1;
          else if (secCoord[1] == y) axis = 0;
          else continue;

          // console.log("debcheck", axis, secKey, coord, secCoord, limits[axis])
          if (secCoord[axis] < coord[axis]
            && secCoord[axis] >= limits[axis][0]
          ) {
            limits[axis][0] = secCoord[axis] + Number(player == secPlayer);
            // console.log("deb min", secCoord, secKey, limits[axis][0], player == secPlayer)
            if ((player != secPlayer)) attacked[axis][0] = secKey;
            else attacked[axis][0] = "";
          }
          else if (secCoord[axis] > coord[axis]
            && secCoord[axis] <= limits[axis][1]
          ) {
            limits[axis][1] = secCoord[axis] - Number(player == secPlayer);
            // console.log("deb max", axis, secCoord, secKey, limits[axis][1])
            if ((player != secPlayer)) attacked[axis][1] = secKey;
            else attacked[axis][1] = "";
          }
        }
        const positions = [], attackList = [];
        for (let i = limits[0][0]; i <= limits[0][1]; i++) if (i != x) positions.push([i, y]);
        for (let i = limits[1][0]; i <= limits[1][1]; i++) if (i != y) positions.push([x, i]);

        for (const ax in attacked) for (const i in attacked[ax]) if (attacked[ax][i]) attackList.push(attacked[ax][i]);
        return { positions: positions, attacks: attackList };
      },
      M: () => {
        // console.log("M")
        const limits: { [key: number]: number[] } = {
          0: [0, 8],
          1: [0, 9]
        },
          blockPos: { [key: string]: number[] } = {
            n: [x, y + 1],
            s: [x, y - 1],
            e: [x + 1, y],
            w: [x - 1, y],
          },
          rawPos: { [key: string]: number[][] } = {
            n: [[x - 1, y + 2], [x + 1, y + 2]],
            s: [[x - 1, y - 2], [x + 1, y - 2]],
            e: [[x + 2, y + 1], [x + 2, y - 1]],
            w: [[x - 2, y + 1], [x - 2, y - 1]],
          };

        for (const i in blockPos) {
          const blockCoord = blockPos[i];
          if (blockCoord[0] < limits[0][0] || blockCoord[0] > limits[0][1] || blockCoord[1] < limits[1][0] || blockCoord[1] > limits[1][1]) {
            delete rawPos[i];
            continue;
          }
          for (const p in pieces) {
            if (String(blockCoord) == String(pieces[p])) {
              delete rawPos[i];
              break;
            }
          }
        }

        const unblockedPos = [], attacked = [];
        for (const dir in rawPos) for (const rawKey in rawPos[dir]) {
          const rawCoord = rawPos[dir][rawKey];
          if (rawCoord[0] < limits[0][0] || rawCoord[0] > limits[0][1] || rawCoord[1] < limits[1][0] || rawCoord[1] > limits[1][1]) continue;
          let valid = true;
          for (const secKey in pieces) {
            const secCoord = pieces[secKey], secPlayer = parseInt(secKey.split(" ")[1]);

            if (String(rawCoord) == String(secCoord)) {
              if (secPlayer != player) {
                attacked.push(secKey);
              } else {
                valid = false;
              }
            }
          }
          if (valid) unblockedPos.push(rawCoord);
        }

        return { positions: unblockedPos, attacks: attacked };
      },
      P: () => {
        // console.log("P");
        const limits: { [key: number]: number[] } = {
          0: [0, 8],
          1: [0, 9],
        }, attacked: { [key: number]: { [key: number]: { coord: number[], player: number, key: string }[] } } = {
          0: { 0: [], 1: [] },
          1: { 0: [], 1: [] },
        };
        for (const secKey in pieces) {
          const secCoord = pieces[secKey], secPlayer = parseInt(secKey.split(" ")[1]);
          let axis = -1;
          if (secKey == pieceKey) continue;

          if (secCoord[0] == x) axis = 1;
          else if (secCoord[1] == y) axis = 0;

          if (axis == -1) continue;

          if (secCoord[axis] < coord[axis]) {
            if (secCoord[axis] >= limits[axis][0]) limits[axis][0] = secCoord[axis] + 1;
            attacked[axis][0].push({ coord: secCoord, player: secPlayer, key: secKey });
          } else if (secCoord[axis] > coord[axis]) {
            if (secCoord[axis] <= limits[axis][1]) limits[axis][1] = secCoord[axis] - 1;
            attacked[axis][1].push({ coord: secCoord, player: secPlayer, key: secKey });
          }
        }

        for (const ax in attacked) for (const i in attacked[ax]) {
          attacked[ax][i] = attacked[ax][i].sort((a: { coord: number[]; }, b: { coord: number[]; }) => {
            const aDist = Math.abs(a.coord[ax] - coord[ax]),
              bDist = Math.abs(b.coord[ax] - coord[ax]);
            return 1 - Number(aDist < bDist) * 2; // if a's distance from piece is less than b's distance from piece, return -1 to move forward
          });
        }

        const positions = [], attackPos = [];
        for (let i = limits[0][0]; i <= limits[0][1]; i++) if (i != x) positions.push([i, y]);
        for (let i = limits[1][0]; i <= limits[1][1]; i++) if (i != y) positions.push([x, i]);

        for (const axis in attacked) for (const i in attacked[axis]) if (attacked[axis][i].length > 1 && attacked[axis][i][1].player != player) {
          attackPos.push(attacked[axis][i][1].key);
          positions.push(attacked[axis][i][1].coord);
        }

        return { positions: positions, attacks: attackPos };
      },
      X: () => {
        // console.log("X");
        const positions: { [key: string]: number[] } = {
          ne: [x + 2, y + 2],
          nw: [x - 2, y + 2],
          se: [x + 2, y - 2],
          sw: [x - 2, y - 2],
        },
          blocks: { [key: string]: number[] } = {
            ne: [x + 1, y + 1],
            nw: [x - 1, y + 1],
            se: [x + 1, y - 1],
            sw: [x - 1, y - 1],
          },
          attacks: { [key: string]: string } = {};


        for (const i in blocks) for (const secKey in pieces) {
          const secCoord = pieces[secKey], secPlayer = parseInt(secKey.split(" ")[1]);
          if (String(secCoord) == String(blocks[i])) {
            delete positions[i];
            break;
          } else if (String(secCoord) == String(positions[i])) {
            if (secPlayer != player) attacks[i] = secKey;
            else {
              delete positions[i];
              break;
            }
          }
        }

        const unblockedPos = [], attacked: string[] = [];
        const limits: { [key: number]: number[] } = {
          0: [0, 4],
          1: [5, 9],
        }
        for (const i in positions) {
          if (positions[i][0] >= 0 && positions[i][0] <= 8 && positions[i][1] >= limits[player][0] && positions[i][1] <= limits[player][1]) {
            unblockedPos.push(positions[i]);
            attacked.push(attacks[i]);
          }
        }

        return { positions: unblockedPos, attacks: attacked };
      },
      S: () => {
        // console.log("S");
        const positions: { [key: string]: number[] } = {
          ne: [x + 1, y + 1],
          nw: [x - 1, y + 1],
          se: [x + 1, y - 1],
          sw: [x - 1, y - 1],
        },
          limits: { [key: number]: number[] } = {
            0: [3, 5],
            1: [0, 2],
          };
        if (player == 1) limits[1] = [7, 9];

        const unblockedPos = [], attacked = [];
        for (const i in positions) {
          if (positions[i][0] < limits[0][0] || positions[i][0] > limits[0][1] || positions[i][1] < limits[1][0] || positions[i][1] > limits[1][1]) continue;
          let valid = true;
          for (const secKey in pieces) {
            const secCoord = pieces[secKey], secPlayer = parseInt(secKey.split(" ")[1]);
            if (String(secCoord) == String(positions[i])) {
              if (secPlayer == player) valid = false;
              else attacked.push(secKey);
              break;
            }
          }
          if (valid) unblockedPos.push(positions[i]);
        }

        return { positions: unblockedPos, attacks: attacked };
      },
      J: () => {
        // console.log("J");
        const positions: { [key: string]: number[] } = {
          n: [x, y + 1],
          s: [x, y - 1],
          e: [x + 1, y],
          w: [x - 1, y],
        },
          limits: { [key: number]: number[] } = {
            0: [3, 5],
            1: [0, 2],
          };
        if (player == 1) limits[1] = [7, 9];

        const otherJ = pieces[`J ${1 - player}`], unblockedPos = [], attacked = [];
        let open = otherJ[0] == x;

        for (const i in positions) {
          if (positions[i][0] < limits[0][0] || positions[i][0] > limits[0][1] || positions[i][1] < limits[1][0] || positions[i][1] > limits[1][1]) continue;
          let valid = true;
          for (const secKey in pieces) {
            const secCoord = pieces[secKey], secPlayer = parseInt(secKey.split(" ")[1]);
            if (secCoord[0] == x && secCoord[1] < Math.max(otherJ[1], y) && secCoord[1] > Math.min(otherJ[1], y)) open = false;
            if (String(secCoord) == String(positions[i])) {
              if (secPlayer == player) valid = false;
              else attacked.push(secKey);
              break;
            }
          }
          if (valid) unblockedPos.push(positions[i]);
        }

        if (open) attacked.push(`J ${1 - player}`);

        return { positions: unblockedPos, attacks: attacked };
      },
      B: () => {
        // console.log("B");
        let positions: { [key: string]: number[] } = {
          n: [x, y + 1 - player * 2],
          e: [x + 1, y],
          w: [x - 1, y],
        }
        const limits: { [key: number | string]: number[] } = {
          0: [0, 8],
          1: [0, 9],
          zone: [5, 9],
        };
        if (player == 1) limits.zone = [0, 4];

        if (coord[1] < limits.zone[0] || coord[1] > limits.zone[1]) positions = { n: positions.n };

        const unblockedPos = [], attacked = [];
        for (const i in positions) {
          if (positions[i][0] < limits[0][0] || positions[i][0] > limits[0][1] || positions[i][1] < limits[1][0] || positions[i][1] > limits[1][1]) continue;
          let valid = true;
          for (const secKey in pieces) {
            const secCoord = pieces[secKey], secPlayer = parseInt(secKey.split(" ")[1]);
            if (String(secCoord) == String(positions[i])) {
              if (secPlayer == player) valid = false;
              else attacked.push(secKey);
              break;
            }
          }
          if (valid) unblockedPos.push(positions[i]);
        }

        return { positions: unblockedPos, attacks: attacked };
      },
    };

    return functions[type.charAt(0)]();
  }

  stalemateCheck(checkPlayer: number, pieces: Pieces = this.pieces) { // checks if player with "checkPlayer" index is in danger
    const attackers = [], zone = checkPlayer == 0 ? [0, 4] : [5, 9], general = { key: `J ${checkPlayer}`, coord: pieces[`J ${checkPlayer}`] };
    for (const key in pieces) {
      const coord = pieces[key], splitKey = key.split(" "), piece = splitKey[0], player = parseInt(splitKey[1]);
      // console.log(key, pieces)
      if (
        !"CMJPB".includes(piece[0]) ||
        player == checkPlayer ||
        (!(coord[0] == general.coord[0] || coord[1] == general.coord[1]) && (coord[1] < zone[0] || coord[1] > zone[1]))
      ) continue;

      const pieceDat = this.movesCheck({ type: piece, player: 1 - checkPlayer }, pieces);
      // console.log(pieceDat)
      if (pieceDat.attacks.includes(general.key)) attackers.push(key);

    }
    return attackers;
  }

  checkmateCheck(checkPlayer: number): { moves: { [key: string]: number[][] }, blocks: { [key: string]: number[][] } } { // checks if player with "checkPlayer" index is in danger
    const possibleMoves: { [key: string]: number[][] } = {}, blocked: { [key: string]: number[][] } = {};
    for (const key in this.pieces) {
      const splitKey = key.split(" "), piece = splitKey[0], player = parseInt(splitKey[1]);
      if (player != checkPlayer) continue;

      const pieceDat = this.movesCheck({ type: piece, player: player });
      // console.log("checking:", piece, pieceDat, String(this.pieces["J 0"]), this.pieces)

      for (const i in pieceDat.positions) {
        const pieces = { ...this.pieces } as Pieces, newCoord = pieceDat.positions[i];
        pieces[key] = newCoord;

        for (const k in pieceDat.attacks) if (String(newCoord) == String(pieces[pieceDat.attacks[k]])) {
          delete pieces[pieceDat.attacks[k]];
          break;
        }

        const checks = this.stalemateCheck(checkPlayer, pieces);

        if (!checks.length) {
          if (possibleMoves[key]) possibleMoves[key].push(newCoord);
          else possibleMoves[key] = [newCoord];
        } else {
          if (blocked[key]) blocked[key].push(newCoord);
          else blocked[key] = [newCoord];
        }
      }
    }

    return { moves: possibleMoves, blocks: blocked };
  }
}

class Timer {
  startTime: number;
  pauser: { status: boolean, runningTime: number };
  update: { (v: number): boolean | void }[];
  interval: number;
  timeout: number;
  constructor(startRunning = 0) {
    this.startTime = Date.now() - startRunning;
    this.pauser = { status: false, runningTime: 0 };

    this.update = [];
    this.interval = 1000;

    this.timeout = 0;
  }

  start(from = 0) {
    this.pauser = { status: false, runningTime: from };
    this.set(from);
  }

  set(from = 0) {
    this.startTime = Date.now() - from;
    this.pauser.runningTime = from;
    if (this.timeout) this.iterate();
  }

  getRunning() {
    if (this.pauser.status) return this.pauser.runningTime;
    return Date.now() - this.startTime;
  }

  iterate() {
    clearTimeout(this.timeout);

    this.updateEvent();
    if (!this.pauser.status)
      this.timeout = setTimeout(() => this.iterate(), this.interval - (this.getRunning() % this.interval));
  }

  updateEvent() {
    const v = this.getRunning();
    for (const fn of this.update) fn(v);
  }

  onUpdate(fn: (v: number) => (boolean | void), interval = 1000) {
    this.update.push(fn);
    this.interval = interval;
    if (!this.timeout)
      this.timeout = setTimeout(() => this.iterate(), interval - this.getRunning() % interval);
    console.log("updatestart", this.timeout);
  }

  pause(set = !this.pauser.status) {
    if (set == this.pauser.status) return;
    this.pauser.status = set;

    if (set) {
      this.pauser.runningTime = Date.now() - this.startTime;

      if (this.timeout) clearTimeout(this.timeout);
    } else {
      this.startTime = Date.now() - this.pauser.runningTime;

      if (this.timeout) this.iterate();
    }

  }
}

export default class Board extends Game {
  names: [string, string];
  startTime: string;
  boardHist: BoardHist;
  settings: GameSettings;
  timer: { [key: number]: Timer };
  turn: { player: number, timer: Timer, iteration: number, actions: { moves: { [key: string]: number[][] }, blocks: { [key: string]: number[][] } } };
  // starter: 0 | 1;
  onUpdate: (actions: { moves: { [key: string]: number[][] }, blocks: { [key: string]: number[][] } }, stalemate: string[], updateStore?: GamePlayData) => void;
  onWin: (winner: number) => void;
  winner: number | undefined;
  constructor(
    gameSettings: GameSettings,
    onUpdate = (a: any, s: any) => console.log(a, s),
    onWin = (w: number) => console.log("winner: ", w)
  ) {
    super();

    this.names = [gameSettings.names[0], gameSettings.names[0] == gameSettings.names[1] ? gameSettings.names[1] + "2" : gameSettings.names[1]];
    this.startTime = Date.now().toString();

    this.settings = gameSettings;
    
    this.boardHist = {
      0: {
        board: { ...this.pieces },
        turn: this.settings.starter,
        time: {
          0: this.settings.gameDuration,
          1: this.settings.gameDuration
        }
      }
    };

    this.timer = {
      0: new Timer(),
      1: new Timer(),
    };

    this.turn = {
      player: this.settings.starter,
      timer: new Timer(), iteration: 0,
      actions: this.checkmateCheck(this.settings.starter)
    };

    this.onWin = onWin;
    this.onUpdate = onUpdate;
    this.winner;
  }

  updateSettings(gameSettings: GameSettings) {
    console.log("game: updateSettings");
    this.names = [gameSettings.names[0], gameSettings.names[0] == gameSettings.names[1] ? gameSettings.names[1] + "2" : gameSettings.names[1]];
    this.settings = gameSettings;

    if (this.settings.turnDuration <= this.turn.timer.getRunning() && this.settings.turnDuration > 0) this.turn.timer.set(0);
    this.timer[0].updateEvent();
    this.timer[1].updateEvent();
  }

  updateGame(gameData: GamePlayData = {
    start: this.startTime,
    turn: this.settings.starter,
    boardHist: {
      0: {
        board: { ...this.resetPieces() },
        turn: this.settings.starter,
        time: {
          0: this.settings.gameDuration,
          1: this.settings.gameDuration,
        }
      }
    },
    timer: {
      0: 0,
      1: 0
    }
  }) {
    console.log("game: updateGame");
    this.pause(true);

    this.startTime = gameData.start;
    this.turn.player = gameData.turn;
    this.boardHist = { ...gameData.boardHist };
    this.turn.iteration = Object.keys(this.boardHist).length - 1;
    this.pieces = { ...this.boardHist[this.turn.iteration].board } as Pieces;
    this.winner = gameData.winner;

    this.turn.actions = this.checkmateCheck(this.turn.player);

    this.timer[0].set(gameData.timer[0]);
    this.timer[1].set(gameData.timer[1]);
    this.turn.timer.set(0);

    if (this.winner != undefined || Object.values(this.turn.actions.moves).length == 0)
      this.win(this.winner);
    else {
      this.onUpdate(this.turn.actions, this.stalemateCheck(this.turn.player));
      this.pause(false);
    }
  }

  getGame(): GamePlayData {
    return {
      start: this.startTime,
      turn: this.turn.player as 0 | 1,
      boardHist: this.boardHist,
      timer: {
        0: this.timer[0].getRunning(),
        1: this.timer[1].getRunning(),
      },
      winner: this.winner as 0 | 1,
    }
  }

  start(gameData?: GamePlayData) {
    for (const i in this.timer) {
      const player = parseInt(i);
      this.timer[player].onUpdate(t => {
        if (this.winner != undefined) return;
        if (t >= this.settings.gameDuration && this.settings.gameDuration > 0)
          this.win(1 - player);
      });
    }

    this.turn.timer.onUpdate(t => {
      if (this.winner != undefined) return;
      if (t >= this.settings.turnDuration && this.settings.turnDuration > 0)
        this.win(1 - this.turn.player);
    });

    if (gameData)
      return this.updateGame(gameData);

    this.timer[1 - this.turn.player].pause(true);
    this.timer[1 - this.turn.player].set(0);
    this.timer[this.turn.player].start();
    this.turn.timer.start();

    this.onUpdate(this.turn.actions, this.stalemateCheck(this.turn.player));
  }

  move(piece: string, coord: number[]) {
    console.log("game: move");
    this.pause(true);

    for (const i in this.pieces) if (String(this.pieces[i]) == String(coord)) delete this.pieces[i];
    this.pieces[piece] = coord;
    this.turn.iteration++;
    this.turn.player = 1 - this.turn.player;

    this.boardHist[this.turn.iteration] = {
      board: { ...this.pieces } as Pieces,
      turn: this.turn.player,
      time: {
        0: this.timer[0].getRunning(),
        1: this.timer[1].getRunning()
      }
    };

    this.turn.actions = this.checkmateCheck(this.turn.player);

    if (Object.values(this.turn.actions.moves).length == 0)
      this.win(1 - this.turn.player);
    else {
      this.onUpdate(this.turn.actions, this.stalemateCheck(this.turn.player), this.getGame());
      this.turn.timer.set(0);
      this.pause(false);
    }
  }

  undo(to = this.turn.iteration - 1) {
    console.log("game: undo");
    this.pause(true);
    this.winner = undefined;

    if (to == 0) {
      this.resetPieces();
      this.turn.player = this.settings.starter;
      for (const i in this.timer) {
        this.timer[i].set(0);
      }
      this.boardHist = { 0: this.boardHist[0] };
    } else {
      const recalledHist = this.boardHist[to];
      this.turn.player = recalledHist.turn;
      this.pieces = { ...recalledHist.board } as Pieces;
      for (const i in this.timer)
        this.timer[i].set(recalledHist.time[parseInt(i) as 0 | 1]);

      for (let i = to + 1; i < Object.keys(this.boardHist).length; i++)
        delete this.boardHist[i];
    }

    this.turn.iteration = to;
    this.turn.actions = this.checkmateCheck(this.turn.player);
    this.turn.timer.set(0);

    this.onUpdate(this.turn.actions, this.stalemateCheck(this.turn.player), this.getGame());
    this.pause(false);
  }

  pause(set = true) {
    console.log("pause", set);
    if (this.winner == undefined) {
      this.turn.timer.pause(set);
      this.timer[this.turn.player].pause(set);
      this.timer[1 - this.turn.player].pause(true);
    } else {
      this.timer[0].pause(true);
      this.timer[1].pause(true);
      this.turn.timer.pause(true);
    }
  }

  win(player = 1 - this.turn.player) {
    this.winner = player;
    this.turn.actions = { moves: {}, blocks: {} };
    this.pause(true);
    this.onUpdate(this.turn.actions, this.stalemateCheck(this.turn.player));
    this.onWin(player);
  }
}