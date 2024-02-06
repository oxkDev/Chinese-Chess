
interface Pieces { [key: string]: number[] }

export interface GameSettings {
  names: string[],
  gameDuration: number,
  turnDuration: number,
  starter: 0 | 1,
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
  }

  movesCheck(pieceDat: { type: string, player: number }, pieces = this.pieces): { positions: number[][], attacks: string[] } {
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
          attacked: string[] = [];

        for (const i in blocks) for (const secKey in pieces) {
          const secCoord = pieces[secKey], secPlayer = parseInt(secKey.split(" ")[1]);
          if (String(secCoord) == String(blocks[i])) delete positions[i];
          else if (String(secCoord) == String(positions[i])) {
            if (secPlayer != player) attacked.push(secKey);
            else delete positions[i];
            break;
          }
        }

        const unblockedPos = [];
        const limits: { [key: number]: number[] } = {
          0: [0, 4],
          1: [5, 9],
        }
        for (const i in positions) {
          if (positions[i][0] >= 0 && positions[i][0] <= 8 && positions[i][1] >= limits[player][0] && positions[i][1] <= limits[player][1]) unblockedPos.push(positions[i]);
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
          unblockedPos.push(positions[i]);
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
        "CMJPB".indexOf(piece[0]) == -1 ||
        player == checkPlayer ||
        (!(coord[0] == general.coord[0] || coord[1] == general.coord[1]) && (coord[1] < zone[0] || coord[1] > zone[1]))
      ) continue;

      const pieceDat = this.movesCheck({ type: piece, player: 1 - checkPlayer }, { ...pieces } as Pieces);
      // console.log(pieceDat)
      if (pieceDat.attacks.indexOf(general.key) > -1) attackers.push(key);

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
        const pieces = Object({ ...this.pieces }) as Pieces, newCoord = pieceDat.positions[i];
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
  date: DateConstructor;
  startTime: number;
  pauser: { status: boolean, time: number };
  update: { (v: number): boolean | void }[];
  interval: number;
  timeout: number;
  constructor(startTime = 0) {
    this.startTime = startTime;
    this.date = Date;
    this.pauser = { status: false, time: 0 };

    this.update = [];
    this.interval = 1000;

    this.timeout = 0;
  }

  start(from = 0) {
    this.pauser = { status: false, time: 0 };
    this.set(from);

  }

  set(from = 0) {
    this.startTime = this.date.now() - from;
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.iterate();
    }
  }

  getRunning() {
    return this.date.now() - this.startTime;
  }

  iterate() {
    const v = this.getRunning();
    for (const fn of this.update) fn(v);

    if (!this.pauser.status) this.timeout = setTimeout(() => this.iterate(), this.interval - (this.getRunning() % this.interval));

  }

  onUpdate(fn: (v: number) => (boolean | void), interval = 1000) {
    this.update.push(fn);
    this.interval = interval;

    if (!this.timeout) {
      this.timeout = setTimeout(() => this.iterate(), this.getRunning() % interval);
      console.log("updatestart", this.timeout);
    }
  }

  pause(set = !this.pauser.status) {
    if (set == this.pauser.status) return;
    this.pauser.status = set;

    if (set) {
      this.pauser.time = this.getRunning();

      if (this.timeout) clearTimeout(this.timeout);
    } else {
      this.startTime = this.date.now() - this.pauser.time;

      if (this.timeout) this.iterate();
    }
  }
}

export default class Board extends Game {
  names: [string, string];
  boardHist: { [key: string]: { board: Pieces, time: { 0: number, 1: number }, turn: number } };
  durations: { game: number, turn: number };
  timer: { [key: number]: Timer };
  turn: { player: number, timer: Timer, iteration: number };
  starter: 0 | 1;
  onWin: (winner: number) => void;
  winner: number | undefined;
  constructor(settings: GameSettings, onWin?: (winner: number) => void) {
    super();

    this.names = [settings.names[0], settings.names[0] == settings.names[1] ? settings.names[1] + "2" : settings.names[1]];

    this.boardHist = {
      0: {
        board: Object({ ...this.pieces } as Pieces),
        turn: settings.starter,
        time: {
          0: settings.gameDuration,
          1: settings.gameDuration
        }
      }
    };
    this.durations = { game: settings.gameDuration, turn: settings.turnDuration };

    this.timer = {
      0: new Timer(),
      1: new Timer(),
    };

    this.turn = { player: settings.starter, timer: new Timer(), iteration: 0 };
    this.starter = settings.starter;

    this.onWin = onWin ? onWin : p => console.log("win: ", p);
    this.winner;
  }

  update(settings: GameSettings) {
    this.names = [settings.names[0], settings.names[0] == settings.names[1] ? settings.names[1] + "2" : settings.names[1]];
    if (settings.turnDuration <= this.turn.timer.getRunning() && settings.turnDuration > 0) this.turn.timer.start();
    this.durations = { game: settings.gameDuration, turn: settings.turnDuration };
  }

  start() {

    for (const i in this.timer) {
      this.timer[parseInt(i)].start();

      this.timer[parseInt(i)].onUpdate(t => {
        if (this.winner != undefined) return false;
        if (t >= this.durations.game && this.durations.game > 0) {
          this.win(1 - parseInt(i));
          return false;
        }
      });
    }
    this.timer[1 - this.turn.player].pause(true);

    this.turn.timer.start();

    this.turn.timer.onUpdate(t => {
      if (this.winner != undefined) return false;
      if (t >= this.durations.turn && this.durations.turn > 0) {
        this.win(1 - this.turn.player);
        return false;
      }
    });

  }

  move(piece: string | number, coord: number[], nextTurn = true) {
    this.timer[this.turn.player].pause(true);


    for (const i in this.pieces) if (String(this.pieces[i]) == String(coord)) delete this.pieces[i];
    // console.log(piece)
    this.pieces[piece] = coord;
    this.turn.iteration++;
    this.boardHist[this.turn.iteration] = {
      board: Object({ ...this.pieces } as Pieces),
      turn: this.turn.player,
      time: {
        0: this.timer[0].getRunning(),
        1: this.timer[1].getRunning()
      }
    };

    if (nextTurn) this.turn.player = 1 - this.turn.player;
    this.timer[this.turn.player].pause(false);
    this.turn.timer.start();
  }

  undo(to = this.turn.iteration - 1) {
    this.turn.player = this.starter;
    this.turn.iteration = to;

    if (to == 0) {
      this.resetPieces();
      for (const i in this.timer) {
        this.timer[i].start();
        this.timer[i].pause(true);
      }
    } else {
      const boardHist = this.boardHist[to];
      this.turn.player = 1 - boardHist.turn;
      this.pieces = Object({ ...boardHist.board } as Pieces);
      for (const i in this.timer) {
        this.timer[i].set(boardHist.time[parseInt(i) as (0 | 1)]);
        // this.timer[i].pause(true);
      }
    }
    this.turn.timer.start();
  }

  pause(set = true) {
    console.log("pause", set)
    if (this.winner == undefined) {
      this.turn.timer.pause(set);
      this.timer[this.turn.player].pause(set);
    }
  }

  win(player: number) {
    this.onWin(player);
    this.winner = player;
    this.timer[0].pause(true);
    this.timer[1].pause(true);
    this.turn.timer.pause(true);
  }
}