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
}

// module.exports = {
//   Ship,
// };

const everShip = new Ship(1, 1, true);
console.log(everShip);
