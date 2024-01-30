// import "./reset.css";
// import "./style.css";

// const importAllAssets = (function () {
//   function importAll(r) {
//     return r.keys().map(r);
//   }

//   const assets = importAll(require.context("./assets", false, /\.(png|jpe?g|svg)$/));
// })();

class Ship {
  constructor(length, hits, sunk) {
    this.length = length;
    this.hits = hits;
    this.sunk = sunk;
  }

  get shipLength() {
    return this.length;
  }

  get shipHits() {
    return this.hits;
  }

  get shipSunk() {
    return this.sunk;
  }

  hit() {
    if (this.hits < this.length) {
      this.hits += 1;
    } else {
      return "Ship already sunk!";
    }
  }
}

module.exports = {
  Ship,
};

// const everShip = new Ship(1, 1, true);
// console.log(everShip);
