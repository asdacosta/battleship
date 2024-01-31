// import "./reset.css";
// import "./style.css";

// const importAllAssets = (function () {
//   function importAll(r) {
//     return r.keys().map(r);
//   }

//   const assets = importAll(require.context("./assets", false, /\.(png|jpe?g|svg)$/));
// })();

class Ship {
  constructor(length, numHits, sunk) {
    this.length = length;
    this.numHits = numHits;
    this.sunk = sunk;
  }

  get currentLength() {
    return this.length;
  }

  get currentNumHits() {
    return this.numHits;
  }

  get sunkStatus() {
    return this.sunk;
  }

  hit() {
    if (this.numHits < this.length) {
      this.numHits += 1;
    } else {
      return "Ship already sunk!";
    }
  }

  isSunk() {
    if (this.length === this.numHits) {
      this.sunk = true;
    }
    return this.sunk;
  }
}

class Gameboard {
  constructor() {
    this.ships = {
      Carrier: new Ship(5, 0, false),
      Battleship: new Ship(4, 0, false),
      Destroyer: new Ship(3, 0, false),
      Submarine: new Ship(3, 0, false),
      "Patrol Boat": new Ship(2, 0, false),
    };
  }

  createBoard() {
    const board = [];
    for (let n = 0; n < 10; n++) {
      const subBoard = [];
      for (let m = 0; m < 10; m++) {
        subBoard.push(null);
      }
      board.push(subBoard);
    }

    return board;
  }

  getLegalMoves() {
    const generateMoves = function (length) {
      let firstMove = [];
      const shipMoves = [];
      for (let m = 0; m < length; m++) {
        firstMove.push(m);
      }
      switch (length) {
        case 4:
          length += 2;
          break;
        case 3:
          length += 4;
          break;
        case 2:
          length += 6;
          break;
      }
      for (let n = 0; n <= length; n++) {
        shipMoves.push(firstMove);
        firstMove = firstMove.map((index) => index + 1);
      }

      return shipMoves;
    };

    const carrierMoves = generateMoves(5);
    const battleshipMoves = generateMoves(4);
    const destroyerMoves = generateMoves(3);
    const submarineMoves = generateMoves(3);
    const patrolMoves = generateMoves(2);

    const legalMoves = [
      carrierMoves,
      battleshipMoves,
      destroyerMoves,
      submarineMoves,
      patrolMoves,
    ];

    return legalMoves;
  }
}

module.exports = {
  Ship,
  Gameboard,
};
