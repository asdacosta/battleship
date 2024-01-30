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
      Battleship: new Ship(4, 9, false),
      Destroyer: new Ship(3, 0, false),
      Submarine: new Ship(3, 0, false),
      "Patrol Boat": new Ship(2, 0, false),
    };
  }
}

module.exports = {
  Ship,
};

// const everShip = new Ship(1, 1, true);
// console.log(everShip);
