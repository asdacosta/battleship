/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _reset_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./reset.css */ "./src/reset.css");
/* harmony import */ var _style_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./style.css */ "./src/style.css");
/* module decorator */ module = __webpack_require__.hmd(module);


const importAllAssets = function () {
  function importAll(r) {
    return r.keys().map(r);
  }
  const assets = importAll(__webpack_require__("./src/assets sync \\.(png%7Cjpe?g%7Csvg)$"));
}();
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
    this.board = [];
    this.ships = {
      Carrier: new Ship(5, 0, false),
      Battleship: new Ship(4, 0, false),
      Destroyer: new Ship(3, 0, false),
      Submarine: new Ship(3, 0, false),
      "Patrol Boat": new Ship(2, 0, false)
    };
  }
  createBoard() {
    const board = this.board;
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
      // Account for extra moves for subsequent ships
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
        case 1:
          length += 8;
          break;
      }
      for (let n = 0; n <= length; n++) {
        shipMoves.push(firstMove);
        firstMove = firstMove.map(index => index + 1);
      }
      return shipMoves;
    };
    const carrierMoves = generateMoves(this.ships.Carrier.length);
    const battleshipMoves = generateMoves(this.ships.Battleship.length);
    const destroyerMoves = generateMoves(this.ships.Destroyer.length);
    const submarineMoves = generateMoves(this.ships.Submarine.length);
    const patrolMoves = generateMoves(this.ships["Patrol Boat"].length);
    const legalMoves = [carrierMoves, battleshipMoves, destroyerMoves, submarineMoves, patrolMoves];
    return legalMoves;
  }
  displaceShips() {
    const board = this.createBoard();
    const generateRandomRowIndex = function () {
      const rowIndex = Math.floor(Math.random() * 10);
      return rowIndex;
    };
    const getRandomMoveIndex = function (moves) {
      const moveIndex = Math.floor(Math.random() * moves);
      return moveIndex;
    };
    const updateLegalMovesInBoard = function (rowIndex, shipLength) {
      const populatedRow = board[rowIndex];
      const lastOccupied = populatedRow.lastIndexOf(shipLength);
      let firstOccupied = null;
      const occupy = function (firstIndexEmpty, lastIndexEmpty, firstTopBottom, lastTopBottom) {
        // Occupy first and last index of ship
        firstOccupied = populatedRow.indexOf(shipLength);
        if (firstIndexEmpty && !lastIndexEmpty) {
          populatedRow[firstOccupied - 1] = "O";
        } else if (!firstIndexEmpty && lastIndexEmpty) {
          populatedRow[lastOccupied + 1] = "O";
        } else if (firstIndexEmpty && lastIndexEmpty) {
          populatedRow[firstOccupied - 1] = "O";
          populatedRow[lastOccupied + 1] = "O";
        }
        // Occupy top and/or bottom
        if (rowIndex === 0) {
          const bottomAdjacentRow = board[1];
          bottomAdjacentRow.fill("O", firstOccupied - firstTopBottom, lastOccupied + lastTopBottom);
        } else if (rowIndex === 9) {
          const topAdjacentRow = board[8];
          topAdjacentRow.fill("O", firstOccupied - firstTopBottom, lastOccupied + lastTopBottom);
        } else {
          const topAdjacentRow = board[rowIndex - 1];
          const bottomAdjacentRow = board[rowIndex + 1];
          topAdjacentRow.fill("O", firstOccupied - firstTopBottom, lastOccupied + lastTopBottom);
          bottomAdjacentRow.fill("O", firstOccupied - firstTopBottom, lastOccupied + lastTopBottom);
        }
      };
      if (populatedRow[0] === null && populatedRow[populatedRow.length - 1] !== null && !populatedRow.includes("O")) {
        occupy(true, false, 1, 1);
      } else if (populatedRow[0] !== null && populatedRow[populatedRow.length - 1] === null && !populatedRow.includes("O")) {
        occupy(false, true, 0, 2);
      } else if (populatedRow[0] === null && populatedRow[populatedRow.length - 1] === null && !populatedRow.includes("O")) {
        occupy(true, true, 1, 2);
      }
    };
    const populateBoard = (() => {
      const legalMoves = this.getLegalMoves();
      const _withSpecifiedShip = (ship, index) => {
        const randomRowIndex = generateRandomRowIndex();
        const shipMoves = legalMoves[index];
        let shipLength = null;
        switch (ship) {
          case "Carrier":
            shipLength = this.ships.Carrier.length;
            break;
          case "Battleship":
            shipLength = this.ships.Battleship.length;
            break;
          case "Destroyer":
            shipLength = 3.5;
            break;
          case "Submarine":
            shipLength = this.ships.Submarine.length;
            break;
          case "Patrol Boat":
            shipLength = this.ships["Patrol Boat"].length;
            break;
        }
        const randomShipMove = getRandomMoveIndex(shipMoves.length);
        const firstShipMove = shipMoves[randomShipMove][0];
        const shipMoveLastIndex = shipMoves[randomShipMove].length - 1;
        const lastShipMove = shipMoves[randomShipMove][shipMoveLastIndex];
        board.forEach((row, rowIndex) => {
          if (rowIndex === randomRowIndex) {
            // Always occupy empty row
            while (row.includes("O")) {
              _withSpecifiedShip(ship, index);
              return;
            }
            row.fill(shipLength, firstShipMove, lastShipMove + 1);
          }
        });
        updateLegalMovesInBoard(randomRowIndex, shipLength);
      };
      _withSpecifiedShip("Carrier", 0);
      _withSpecifiedShip("Battleship", 1);
      _withSpecifiedShip("Destroyer", 2);
      _withSpecifiedShip("Submarine", 3);
      _withSpecifiedShip("Patrol Boat", 4);
    })();
    console.log(this.board);
    return board;
  }
  receiveAttack(XY) {
    const generateKeys = function () {
      // Alphabets A-J
      const alphabets = [];
      for (let n = 65; n <= 74; n++) {
        alphabets.push(String.fromCharCode(n));
      }
      const keys = [];
      for (let m = 1; m <= 10; m++) {
        const subKeys = [];
        for (const letter of alphabets) {
          subKeys.push(`${m}` + letter);
        }
        keys.push(subKeys);
      }
      return keys;
    }();
    const assignKeysToBoardIndices = function () {
      const KeysBox = {};
      const keys = generateKeys;
      for (let rowIndex = 0; rowIndex < 10; rowIndex++) {
        for (let index = 0; index < 10; index++) {
          KeysBox[`${keys[rowIndex][index]}`] = [index, rowIndex];
        }
      }
      return KeysBox;
    }();
    const occupyChosenSpot = (() => {
      const board = this.board;
      const KeysBox = assignKeysToBoardIndices;
      const keyIndex = KeysBox[XY][0];
      const rowIndex = KeysBox[XY][1];
      let hitEntry = board[rowIndex][keyIndex];
      const updateShipLife = shipLength => {
        const updateUntilFull = ship => {
          if (ship.numHits === shipLength) {
            return;
          }
          ship.hit();
        };
        switch (shipLength) {
          case 5:
            updateUntilFull(this.ships.Carrier);
            break;
          case 4:
            updateUntilFull(this.ships.Battleship);
            break;
          case 3.5:
            updateUntilFull(this.ships.Destroyer);
            break;
          case 3:
            updateUntilFull(this.ships.Submarine);
            break;
          case 2:
            updateUntilFull(this.ships["Patrol Boat"]);
            break;
        }
      };
      const trackMissedAttacks = function (coordinate) {
        const missedAttacks = [];
        missedAttacks.push(coordinate);
      };
      const updateSunkStatus = shipLength => {
        switch (shipLength) {
          case 5:
            this.ships.Carrier.isSunk();
            break;
          case 4:
            this.ships.Battleship.isSunk();
            break;
          case 3.5:
            this.ships.Destroyer.isSunk();
            break;
          case 3:
            this.ships.Submarine.isSunk();
            break;
          case 2:
            this.ships["Patrol Boat"].isSunk();
            break;
        }
      };
      const allShipsSunk = () => {
        if (this.ships.Carrier.sunkStatus && this.ships.Battleship.sunkStatus && this.ships.Destroyer.sunkStatus && this.ships.Submarine.sunkStatus && this.ships["Patrol Boat"].sunkStatus) {
          return true;
        } else {
          return false;
        }
      };
      if (hitEntry === null || hitEntry === "O") {
        board[rowIndex][keyIndex] = "X";
        trackMissedAttacks(XY);
        return "Fail";
      } else if (hitEntry === this.ships.Carrier.length || hitEntry === this.ships.Battleship.length || hitEntry === 3.5 || hitEntry === this.ships.Submarine.length || hitEntry === this.ships["Patrol Boat"].length) {
        board[rowIndex][keyIndex] = "X";
        updateShipLife(hitEntry);
        updateSunkStatus(hitEntry);
        allShipsSunk();
        return "Success";
        // TODO: User to choose again
      } else if (hitEntry === "X") {
        return "Occupied";
        // TODO: Enable user to choose new spot
      }
    })();
  }
}
class Player {
  constructor() {
    this.user = new Gameboard();
    this.userBoard = this.user.createBoard();
    this.user.displaceShips();
    this.computer = new Gameboard();
    this.computerBoard = this.computer.createBoard();
    this.computer.displaceShips();
  }
  userTurn(XY) {
    this.computer.receiveAttack(XY);
  }
  computerTurn() {
    const generateRandomKey = function () {
      const alphabets = [];
      const keys = [];
      const randomKeyIndex = Math.floor(Math.random() * 100);
      for (let n = 65; n <= 74; n++) {
        alphabets.push(String.fromCharCode(n));
      }
      for (let m = 1; m <= 10; m++) {
        for (const letter of alphabets) {
          keys.push(`${m}` + letter);
        }
      }
      const randomKey = keys[randomKeyIndex];
      return randomKey;
    };
    const pickLegalMove = (() => {
      const board = this.userBoard;
      const randomKey = generateRandomKey();
      const response = this.user.receiveAttack(randomKey);
      const isAllEntriesOccupied = board.flat().every(entry => entry === "X");
      if (response === "Occupied" && !isAllEntriesOccupied) {
        this.computerTurn();
      }
    })();
  }
}
const transitionHeaderColor = function () {
  function changeColor() {
    let red = Math.floor(Math.random() * 256);
    let green = Math.floor(Math.random() * 256);
    let blue = Math.floor(Math.random() * 256);
    let color = `rgba(${red}, ${green}, ${blue}, 0.7)`;
    const header = document.querySelector("h1");
    header.style.background = color;
  }
  setInterval(changeColor, 2000);
}();
module.exports = {
  Ship,
  Gameboard,
  Player
};

// const everBoard = new Gameboard();
// everBoard.displaceShips();
// everBoard.receiveAttack("1B");
// everBoard.receiveAttack("1A");
// everBoard.receiveAttack("1C");
// everBoard.receiveAttack("1B");

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/reset.css":
/*!*************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/reset.css ***!
  \*************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `*, *::before, *::after {
    box-sizing: border-box;
}

html, body, div, span, applet, object, iframe, h1, h2, h3, h4, h5, h6, p, blockquote, pre, a, abbr, acronym, address, big, cite, code, del, dfn, em, img, ins, kbd, q, s, samp, small, strike, strong, sub, sup, tt, var, b, u, i, center, dl, dt, dd, ol, ul, li, fieldset, form, label, legend, table, caption, tbody, tfoot, thead, tr, th, td, article, aside, canvas, details, embed, figure, figcaption, footer, header, hgroup, menu, nav, output, ruby, section, summary, time, mark, audio, video  {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    font: inherit;
    vertical-align: baseline;
}

body {
    font-family: Arial, sans-serif;
    font-size: 16px;
    line-height: 1.1;
}

a {
    text-decoration: none;
    background-color: transparent;
}

ol, ul {
	list-style: none;
}

main, article, aside, details, figcaption, figure, 
footer, header, hgroup, menu, nav, section {
	display: block;
}

blockquote, q {
    quotes: none;
}

table {
    border-collapse: collapse;
    border-spacing: 0;
}

img {
    border-style: none;
}

button, input {
    overflow: visible;
}

abbr[title] {
    border-bottom: none;
    text-decoration: underline;
}

strong, b {
    font-weight: bolder;
}`, "",{"version":3,"sources":["webpack://./src/reset.css"],"names":[],"mappings":"AAAA;IACI,sBAAsB;AAC1B;;AAEA;IACI,SAAS;IACT,UAAU;IACV,SAAS;IACT,eAAe;IACf,aAAa;IACb,wBAAwB;AAC5B;;AAEA;IACI,8BAA8B;IAC9B,eAAe;IACf,gBAAgB;AACpB;;AAEA;IACI,qBAAqB;IACrB,6BAA6B;AACjC;;AAEA;CACC,gBAAgB;AACjB;;AAEA;;CAEC,cAAc;AACf;;AAEA;IACI,YAAY;AAChB;;AAEA;IACI,yBAAyB;IACzB,iBAAiB;AACrB;;AAEA;IACI,kBAAkB;AACtB;;AAEA;IACI,iBAAiB;AACrB;;AAEA;IACI,mBAAmB;IACnB,0BAA0B;AAC9B;;AAEA;IACI,mBAAmB;AACvB","sourcesContent":["*, *::before, *::after {\n    box-sizing: border-box;\n}\n\nhtml, body, div, span, applet, object, iframe, h1, h2, h3, h4, h5, h6, p, blockquote, pre, a, abbr, acronym, address, big, cite, code, del, dfn, em, img, ins, kbd, q, s, samp, small, strike, strong, sub, sup, tt, var, b, u, i, center, dl, dt, dd, ol, ul, li, fieldset, form, label, legend, table, caption, tbody, tfoot, thead, tr, th, td, article, aside, canvas, details, embed, figure, figcaption, footer, header, hgroup, menu, nav, output, ruby, section, summary, time, mark, audio, video  {\n    margin: 0;\n    padding: 0;\n    border: 0;\n    font-size: 100%;\n    font: inherit;\n    vertical-align: baseline;\n}\n\nbody {\n    font-family: Arial, sans-serif;\n    font-size: 16px;\n    line-height: 1.1;\n}\n\na {\n    text-decoration: none;\n    background-color: transparent;\n}\n\nol, ul {\n\tlist-style: none;\n}\n\nmain, article, aside, details, figcaption, figure, \nfooter, header, hgroup, menu, nav, section {\n\tdisplay: block;\n}\n\nblockquote, q {\n    quotes: none;\n}\n\ntable {\n    border-collapse: collapse;\n    border-spacing: 0;\n}\n\nimg {\n    border-style: none;\n}\n\nbutton, input {\n    overflow: visible;\n}\n\nabbr[title] {\n    border-bottom: none;\n    text-decoration: underline;\n}\n\nstrong, b {\n    font-weight: bolder;\n}"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/style.css":
/*!*************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/style.css ***!
  \*************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/getUrl.js */ "./node_modules/css-loader/dist/runtime/getUrl.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__);
// Imports



var ___CSS_LOADER_URL_IMPORT_0___ = new URL(/* asset import */ __webpack_require__(/*! ./assets/admiral-edit.jpg */ "./src/assets/admiral-edit.jpg"), __webpack_require__.b);
var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
var ___CSS_LOADER_URL_REPLACEMENT_0___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_0___);
// Module
___CSS_LOADER_EXPORT___.push([module.id, `* {
  letter-spacing: 0.1rem;
}

body {
  display: flex;
  align-items: center;
  flex-direction: column;
  position: relative;
  font-family: "Raleway", sans-serif;
  font-size: 1.2rem;
  padding: 2rem;
  gap: 2rem;
  height: 100vh;
  background-image: url(${___CSS_LOADER_URL_REPLACEMENT_0___});
  background-size: cover;
  background-position: center center;
  position: relative;
}

section {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 20rem;
  width: 35rem;
  gap: 3rem;
  border-radius: 1rem;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 1;
  transition: transform 0.3s ease-in-out;
}

section:hover {
  transform: scale(1.05);
}

input[type="text"] {
  background: none;
  border: none;
  border-bottom: 2px solid white;
  font-size: 1.3rem;
  color: white;
  text-align: center;
  width: 12rem;
}

input[type="text"]:hover {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 0.5rem;

  color: black;
}

h1 {
  font-family: "Sixtyfour", sans-serif;
  font-optical-sizing: auto;
  font-weight: 400;
  font-size: 10rem;
  border-radius: 5rem;
  padding: 1rem 1rem 0 1rem;
  background: rgb(255, 255, 255, 0.4);
  cursor: context-menu;
  transition: background 5s ease;
}

button {
  background: black;
  font-size: 1.7rem;
  font-weight: 600;
  padding: 0.5rem 1.2rem;
  border-radius: 5rem;
  border-color: white;
  border-width: 0.2rem;
  color: white;
  transition: transform 0.2s ease-in;
}

button:hover {
  transform: scale(1.02);
  color: rgb(204, 202, 202);
  cursor: pointer;
}

a {
  color: white;
}
`, "",{"version":3,"sources":["webpack://./src/style.css"],"names":[],"mappings":"AAAA;EACE,sBAAsB;AACxB;;AAEA;EACE,aAAa;EACb,mBAAmB;EACnB,sBAAsB;EACtB,kBAAkB;EAClB,kCAAkC;EAClC,iBAAiB;EACjB,aAAa;EACb,SAAS;EACT,aAAa;EACb,yDAAgD;EAChD,sBAAsB;EACtB,kCAAkC;EAClC,kBAAkB;AACpB;;AAEA;EACE,aAAa;EACb,uBAAuB;EACvB,mBAAmB;EACnB,sBAAsB;EACtB,aAAa;EACb,YAAY;EACZ,SAAS;EACT,mBAAmB;EACnB,oCAAoC;EACpC,UAAU;EACV,sCAAsC;AACxC;;AAEA;EACE,sBAAsB;AACxB;;AAEA;EACE,gBAAgB;EAChB,YAAY;EACZ,8BAA8B;EAC9B,iBAAiB;EACjB,YAAY;EACZ,kBAAkB;EAClB,YAAY;AACd;;AAEA;EACE,oCAAoC;EACpC,qBAAqB;;EAErB,YAAY;AACd;;AAEA;EACE,oCAAoC;EACpC,yBAAyB;EACzB,gBAAgB;EAChB,gBAAgB;EAChB,mBAAmB;EACnB,yBAAyB;EACzB,mCAAmC;EACnC,oBAAoB;EACpB,8BAA8B;AAChC;;AAEA;EACE,iBAAiB;EACjB,iBAAiB;EACjB,gBAAgB;EAChB,sBAAsB;EACtB,mBAAmB;EACnB,mBAAmB;EACnB,oBAAoB;EACpB,YAAY;EACZ,kCAAkC;AACpC;;AAEA;EACE,sBAAsB;EACtB,yBAAyB;EACzB,eAAe;AACjB;;AAEA;EACE,YAAY;AACd","sourcesContent":["* {\n  letter-spacing: 0.1rem;\n}\n\nbody {\n  display: flex;\n  align-items: center;\n  flex-direction: column;\n  position: relative;\n  font-family: \"Raleway\", sans-serif;\n  font-size: 1.2rem;\n  padding: 2rem;\n  gap: 2rem;\n  height: 100vh;\n  background-image: url(./assets/admiral-edit.jpg);\n  background-size: cover;\n  background-position: center center;\n  position: relative;\n}\n\nsection {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  flex-direction: column;\n  height: 20rem;\n  width: 35rem;\n  gap: 3rem;\n  border-radius: 1rem;\n  background-color: rgba(0, 0, 0, 0.8);\n  z-index: 1;\n  transition: transform 0.3s ease-in-out;\n}\n\nsection:hover {\n  transform: scale(1.05);\n}\n\ninput[type=\"text\"] {\n  background: none;\n  border: none;\n  border-bottom: 2px solid white;\n  font-size: 1.3rem;\n  color: white;\n  text-align: center;\n  width: 12rem;\n}\n\ninput[type=\"text\"]:hover {\n  background: rgba(255, 255, 255, 0.9);\n  border-radius: 0.5rem;\n\n  color: black;\n}\n\nh1 {\n  font-family: \"Sixtyfour\", sans-serif;\n  font-optical-sizing: auto;\n  font-weight: 400;\n  font-size: 10rem;\n  border-radius: 5rem;\n  padding: 1rem 1rem 0 1rem;\n  background: rgb(255, 255, 255, 0.4);\n  cursor: context-menu;\n  transition: background 5s ease;\n}\n\nbutton {\n  background: black;\n  font-size: 1.7rem;\n  font-weight: 600;\n  padding: 0.5rem 1.2rem;\n  border-radius: 5rem;\n  border-color: white;\n  border-width: 0.2rem;\n  color: white;\n  transition: transform 0.2s ease-in;\n}\n\nbutton:hover {\n  transform: scale(1.02);\n  color: rgb(204, 202, 202);\n  cursor: pointer;\n}\n\na {\n  color: white;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ ((module) => {

"use strict";


/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = [];

  // return the list of modules as css string
  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";
      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }
      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }
      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }
      content += cssWithMappingToString(item);
      if (needLayer) {
        content += "}";
      }
      if (item[2]) {
        content += "}";
      }
      if (item[4]) {
        content += "}";
      }
      return content;
    }).join("");
  };

  // import a list of modules into the list
  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }
    var alreadyImportedModules = {};
    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];
        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }
    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);
      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }
      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }
      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }
      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }
      list.push(item);
    }
  };
  return list;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/getUrl.js":
/*!********************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/getUrl.js ***!
  \********************************************************/
/***/ ((module) => {

"use strict";


module.exports = function (url, options) {
  if (!options) {
    options = {};
  }
  if (!url) {
    return url;
  }
  url = String(url.__esModule ? url.default : url);

  // If url is already wrapped in quotes, remove them
  if (/^['"].*['"]$/.test(url)) {
    url = url.slice(1, -1);
  }
  if (options.hash) {
    url += options.hash;
  }

  // Should url be wrapped?
  // See https://drafts.csswg.org/css-values-3/#urls
  if (/["'() \t\n]|(%20)/.test(url) || options.needQuotes) {
    return "\"".concat(url.replace(/"/g, '\\"').replace(/\n/g, "\\n"), "\"");
  }
  return url;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/sourceMaps.js":
/*!************************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/sourceMaps.js ***!
  \************************************************************/
/***/ ((module) => {

"use strict";


module.exports = function (item) {
  var content = item[1];
  var cssMapping = item[3];
  if (!cssMapping) {
    return content;
  }
  if (typeof btoa === "function") {
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    return [content].concat([sourceMapping]).join("\n");
  }
  return [content].join("\n");
};

/***/ }),

/***/ "./src/reset.css":
/*!***********************!*\
  !*** ./src/reset.css ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_reset_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../node_modules/css-loader/dist/cjs.js!./reset.css */ "./node_modules/css-loader/dist/cjs.js!./src/reset.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_reset_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_reset_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_reset_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_reset_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/style.css":
/*!***********************!*\
  !*** ./src/style.css ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../node_modules/css-loader/dist/cjs.js!./style.css */ "./node_modules/css-loader/dist/cjs.js!./src/style.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/***/ ((module) => {

"use strict";


var stylesInDOM = [];
function getIndexByIdentifier(identifier) {
  var result = -1;
  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }
  return result;
}
function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];
  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };
    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }
    identifiers.push(identifier);
  }
  return identifiers;
}
function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);
  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }
      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };
  return updater;
}
module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];
    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }
    var newLastIdentifiers = modulesToDom(newList, options);
    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];
      var _index = getIndexByIdentifier(_identifier);
      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();
        stylesInDOM.splice(_index, 1);
      }
    }
    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertBySelector.js":
/*!********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertBySelector.js ***!
  \********************************************************************/
/***/ ((module) => {

"use strict";


var memo = {};

/* istanbul ignore next  */
function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target);

    // Special case to return head of iframe instead of iframe itself
    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }
    memo[target] = styleTarget;
  }
  return memo[target];
}

/* istanbul ignore next  */
function insertBySelector(insert, style) {
  var target = getTarget(insert);
  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }
  target.appendChild(style);
}
module.exports = insertBySelector;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertStyleElement.js":
/*!**********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertStyleElement.js ***!
  \**********************************************************************/
/***/ ((module) => {

"use strict";


/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}
module.exports = insertStyleElement;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js ***!
  \**********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;
  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}
module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleDomAPI.js":
/*!***************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleDomAPI.js ***!
  \***************************************************************/
/***/ ((module) => {

"use strict";


/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";
  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }
  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }
  var needLayer = typeof obj.layer !== "undefined";
  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }
  css += obj.css;
  if (needLayer) {
    css += "}";
  }
  if (obj.media) {
    css += "}";
  }
  if (obj.supports) {
    css += "}";
  }
  var sourceMap = obj.sourceMap;
  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  }

  // For old IE
  /* istanbul ignore if  */
  options.styleTagTransform(css, styleElement, options.options);
}
function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }
  styleElement.parentNode.removeChild(styleElement);
}

/* istanbul ignore next  */
function domAPI(options) {
  if (typeof document === "undefined") {
    return {
      update: function update() {},
      remove: function remove() {}
    };
  }
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}
module.exports = domAPI;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleTagTransform.js":
/*!*********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleTagTransform.js ***!
  \*********************************************************************/
/***/ ((module) => {

"use strict";


/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }
    styleElement.appendChild(document.createTextNode(css));
  }
}
module.exports = styleTagTransform;

/***/ }),

/***/ "./src/assets sync \\.(png%7Cjpe?g%7Csvg)$":
/*!**************************************************************!*\
  !*** ./src/assets/ sync nonrecursive \.(png%7Cjpe?g%7Csvg)$ ***!
  \**************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var map = {
	"./admiral-edit.jpg": "./src/assets/admiral-edit.jpg",
	"./ship-edit.jpg": "./src/assets/ship-edit.jpg"
};


function webpackContext(req) {
	var id = webpackContextResolve(req);
	return __webpack_require__(id);
}
function webpackContextResolve(req) {
	if(!__webpack_require__.o(map, req)) {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	}
	return map[req];
}
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = "./src/assets sync \\.(png%7Cjpe?g%7Csvg)$";

/***/ }),

/***/ "./src/assets/admiral-edit.jpg":
/*!*************************************!*\
  !*** ./src/assets/admiral-edit.jpg ***!
  \*************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "assets/admiral-edit.jpg";

/***/ }),

/***/ "./src/assets/ship-edit.jpg":
/*!**********************************!*\
  !*** ./src/assets/ship-edit.jpg ***!
  \**********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "assets/ship-edit.jpg";

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/harmony module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.hmd = (module) => {
/******/ 			module = Object.create(module);
/******/ 			if (!module.children) module.children = [];
/******/ 			Object.defineProperty(module, 'exports', {
/******/ 				enumerable: true,
/******/ 				set: () => {
/******/ 					throw new Error('ES Modules may not assign module.exports or exports.*, Use ESM export syntax, instead: ' + module.id);
/******/ 				}
/******/ 			});
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src;
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) {
/******/ 					var i = scripts.length - 1;
/******/ 					while (i > -1 && !scriptUrl) scriptUrl = scripts[i--].src;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		__webpack_require__.b = document.baseURI || self.location.href;
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"index": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		// no jsonp function
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.js");
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTs7Ozs7V0NyQkE7Ozs7O1VFQUE7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2luZGV4LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvcmVzZXQuY3NzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvc3R5bGUuY3NzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvZ2V0VXJsLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3Jlc2V0LmNzcz9lZGUwIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvc3R5bGUuY3NzPzcxNjMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2Fzc2V0cy8gc3luYyBub25yZWN1cnNpdmUgXFwuKHBuZyU3Q2pwZSIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvZ2xvYmFsIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2hhcm1vbnkgbW9kdWxlIGRlY29yYXRvciIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL3B1YmxpY1BhdGgiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvanNvbnAgY2h1bmsgbG9hZGluZyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9ub25jZSIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFwiLi9yZXNldC5jc3NcIjtcbmltcG9ydCBcIi4vc3R5bGUuY3NzXCI7XG5cbmNvbnN0IGltcG9ydEFsbEFzc2V0cyA9IChmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIGltcG9ydEFsbChyKSB7XG4gICAgcmV0dXJuIHIua2V5cygpLm1hcChyKTtcbiAgfVxuXG4gIGNvbnN0IGFzc2V0cyA9IGltcG9ydEFsbChyZXF1aXJlLmNvbnRleHQoXCIuL2Fzc2V0c1wiLCBmYWxzZSwgL1xcLihwbmd8anBlP2d8c3ZnKSQvKSk7XG59KSgpO1xuXG5jbGFzcyBTaGlwIHtcbiAgY29uc3RydWN0b3IobGVuZ3RoLCBudW1IaXRzLCBzdW5rKSB7XG4gICAgdGhpcy5sZW5ndGggPSBsZW5ndGg7XG4gICAgdGhpcy5udW1IaXRzID0gbnVtSGl0cztcbiAgICB0aGlzLnN1bmsgPSBzdW5rO1xuICB9XG5cbiAgZ2V0IGN1cnJlbnRMZW5ndGgoKSB7XG4gICAgcmV0dXJuIHRoaXMubGVuZ3RoO1xuICB9XG5cbiAgZ2V0IGN1cnJlbnROdW1IaXRzKCkge1xuICAgIHJldHVybiB0aGlzLm51bUhpdHM7XG4gIH1cblxuICBnZXQgc3Vua1N0YXR1cygpIHtcbiAgICByZXR1cm4gdGhpcy5zdW5rO1xuICB9XG5cbiAgaGl0KCkge1xuICAgIGlmICh0aGlzLm51bUhpdHMgPCB0aGlzLmxlbmd0aCkge1xuICAgICAgdGhpcy5udW1IaXRzICs9IDE7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBcIlNoaXAgYWxyZWFkeSBzdW5rIVwiO1xuICAgIH1cbiAgfVxuXG4gIGlzU3VuaygpIHtcbiAgICBpZiAodGhpcy5sZW5ndGggPT09IHRoaXMubnVtSGl0cykge1xuICAgICAgdGhpcy5zdW5rID0gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuc3VuaztcbiAgfVxufVxuXG5jbGFzcyBHYW1lYm9hcmQge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmJvYXJkID0gW107XG4gICAgdGhpcy5zaGlwcyA9IHtcbiAgICAgIENhcnJpZXI6IG5ldyBTaGlwKDUsIDAsIGZhbHNlKSxcbiAgICAgIEJhdHRsZXNoaXA6IG5ldyBTaGlwKDQsIDAsIGZhbHNlKSxcbiAgICAgIERlc3Ryb3llcjogbmV3IFNoaXAoMywgMCwgZmFsc2UpLFxuICAgICAgU3VibWFyaW5lOiBuZXcgU2hpcCgzLCAwLCBmYWxzZSksXG4gICAgICBcIlBhdHJvbCBCb2F0XCI6IG5ldyBTaGlwKDIsIDAsIGZhbHNlKSxcbiAgICB9O1xuICB9XG5cbiAgY3JlYXRlQm9hcmQoKSB7XG4gICAgY29uc3QgYm9hcmQgPSB0aGlzLmJvYXJkO1xuICAgIGZvciAobGV0IG4gPSAwOyBuIDwgMTA7IG4rKykge1xuICAgICAgY29uc3Qgc3ViQm9hcmQgPSBbXTtcbiAgICAgIGZvciAobGV0IG0gPSAwOyBtIDwgMTA7IG0rKykge1xuICAgICAgICBzdWJCb2FyZC5wdXNoKG51bGwpO1xuICAgICAgfVxuICAgICAgYm9hcmQucHVzaChzdWJCb2FyZCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGJvYXJkO1xuICB9XG5cbiAgZ2V0TGVnYWxNb3ZlcygpIHtcbiAgICBjb25zdCBnZW5lcmF0ZU1vdmVzID0gZnVuY3Rpb24gKGxlbmd0aCkge1xuICAgICAgbGV0IGZpcnN0TW92ZSA9IFtdO1xuICAgICAgY29uc3Qgc2hpcE1vdmVzID0gW107XG4gICAgICBmb3IgKGxldCBtID0gMDsgbSA8IGxlbmd0aDsgbSsrKSB7XG4gICAgICAgIGZpcnN0TW92ZS5wdXNoKG0pO1xuICAgICAgfVxuICAgICAgLy8gQWNjb3VudCBmb3IgZXh0cmEgbW92ZXMgZm9yIHN1YnNlcXVlbnQgc2hpcHNcbiAgICAgIHN3aXRjaCAobGVuZ3RoKSB7XG4gICAgICAgIGNhc2UgNDpcbiAgICAgICAgICBsZW5ndGggKz0gMjtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAzOlxuICAgICAgICAgIGxlbmd0aCArPSA0O1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgbGVuZ3RoICs9IDY7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMTpcbiAgICAgICAgICBsZW5ndGggKz0gODtcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGZvciAobGV0IG4gPSAwOyBuIDw9IGxlbmd0aDsgbisrKSB7XG4gICAgICAgIHNoaXBNb3Zlcy5wdXNoKGZpcnN0TW92ZSk7XG4gICAgICAgIGZpcnN0TW92ZSA9IGZpcnN0TW92ZS5tYXAoKGluZGV4KSA9PiBpbmRleCArIDEpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gc2hpcE1vdmVzO1xuICAgIH07XG5cbiAgICBjb25zdCBjYXJyaWVyTW92ZXMgPSBnZW5lcmF0ZU1vdmVzKHRoaXMuc2hpcHMuQ2Fycmllci5sZW5ndGgpO1xuICAgIGNvbnN0IGJhdHRsZXNoaXBNb3ZlcyA9IGdlbmVyYXRlTW92ZXModGhpcy5zaGlwcy5CYXR0bGVzaGlwLmxlbmd0aCk7XG4gICAgY29uc3QgZGVzdHJveWVyTW92ZXMgPSBnZW5lcmF0ZU1vdmVzKHRoaXMuc2hpcHMuRGVzdHJveWVyLmxlbmd0aCk7XG4gICAgY29uc3Qgc3VibWFyaW5lTW92ZXMgPSBnZW5lcmF0ZU1vdmVzKHRoaXMuc2hpcHMuU3VibWFyaW5lLmxlbmd0aCk7XG4gICAgY29uc3QgcGF0cm9sTW92ZXMgPSBnZW5lcmF0ZU1vdmVzKHRoaXMuc2hpcHNbXCJQYXRyb2wgQm9hdFwiXS5sZW5ndGgpO1xuXG4gICAgY29uc3QgbGVnYWxNb3ZlcyA9IFtcbiAgICAgIGNhcnJpZXJNb3ZlcyxcbiAgICAgIGJhdHRsZXNoaXBNb3ZlcyxcbiAgICAgIGRlc3Ryb3llck1vdmVzLFxuICAgICAgc3VibWFyaW5lTW92ZXMsXG4gICAgICBwYXRyb2xNb3ZlcyxcbiAgICBdO1xuXG4gICAgcmV0dXJuIGxlZ2FsTW92ZXM7XG4gIH1cblxuICBkaXNwbGFjZVNoaXBzKCkge1xuICAgIGNvbnN0IGJvYXJkID0gdGhpcy5jcmVhdGVCb2FyZCgpO1xuXG4gICAgY29uc3QgZ2VuZXJhdGVSYW5kb21Sb3dJbmRleCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGNvbnN0IHJvd0luZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApO1xuICAgICAgcmV0dXJuIHJvd0luZGV4O1xuICAgIH07XG5cbiAgICBjb25zdCBnZXRSYW5kb21Nb3ZlSW5kZXggPSBmdW5jdGlvbiAobW92ZXMpIHtcbiAgICAgIGNvbnN0IG1vdmVJbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG1vdmVzKTtcbiAgICAgIHJldHVybiBtb3ZlSW5kZXg7XG4gICAgfTtcblxuICAgIGNvbnN0IHVwZGF0ZUxlZ2FsTW92ZXNJbkJvYXJkID0gZnVuY3Rpb24gKHJvd0luZGV4LCBzaGlwTGVuZ3RoKSB7XG4gICAgICBjb25zdCBwb3B1bGF0ZWRSb3cgPSBib2FyZFtyb3dJbmRleF07XG4gICAgICBjb25zdCBsYXN0T2NjdXBpZWQgPSBwb3B1bGF0ZWRSb3cubGFzdEluZGV4T2Yoc2hpcExlbmd0aCk7XG4gICAgICBsZXQgZmlyc3RPY2N1cGllZCA9IG51bGw7XG5cbiAgICAgIGNvbnN0IG9jY3VweSA9IGZ1bmN0aW9uIChcbiAgICAgICAgZmlyc3RJbmRleEVtcHR5LFxuICAgICAgICBsYXN0SW5kZXhFbXB0eSxcbiAgICAgICAgZmlyc3RUb3BCb3R0b20sXG4gICAgICAgIGxhc3RUb3BCb3R0b20sXG4gICAgICApIHtcbiAgICAgICAgLy8gT2NjdXB5IGZpcnN0IGFuZCBsYXN0IGluZGV4IG9mIHNoaXBcbiAgICAgICAgZmlyc3RPY2N1cGllZCA9IHBvcHVsYXRlZFJvdy5pbmRleE9mKHNoaXBMZW5ndGgpO1xuICAgICAgICBpZiAoZmlyc3RJbmRleEVtcHR5ICYmICFsYXN0SW5kZXhFbXB0eSkge1xuICAgICAgICAgIHBvcHVsYXRlZFJvd1tmaXJzdE9jY3VwaWVkIC0gMV0gPSBcIk9cIjtcbiAgICAgICAgfSBlbHNlIGlmICghZmlyc3RJbmRleEVtcHR5ICYmIGxhc3RJbmRleEVtcHR5KSB7XG4gICAgICAgICAgcG9wdWxhdGVkUm93W2xhc3RPY2N1cGllZCArIDFdID0gXCJPXCI7XG4gICAgICAgIH0gZWxzZSBpZiAoZmlyc3RJbmRleEVtcHR5ICYmIGxhc3RJbmRleEVtcHR5KSB7XG4gICAgICAgICAgcG9wdWxhdGVkUm93W2ZpcnN0T2NjdXBpZWQgLSAxXSA9IFwiT1wiO1xuICAgICAgICAgIHBvcHVsYXRlZFJvd1tsYXN0T2NjdXBpZWQgKyAxXSA9IFwiT1wiO1xuICAgICAgICB9XG4gICAgICAgIC8vIE9jY3VweSB0b3AgYW5kL29yIGJvdHRvbVxuICAgICAgICBpZiAocm93SW5kZXggPT09IDApIHtcbiAgICAgICAgICBjb25zdCBib3R0b21BZGphY2VudFJvdyA9IGJvYXJkWzFdO1xuICAgICAgICAgIGJvdHRvbUFkamFjZW50Um93LmZpbGwoXG4gICAgICAgICAgICBcIk9cIixcbiAgICAgICAgICAgIGZpcnN0T2NjdXBpZWQgLSBmaXJzdFRvcEJvdHRvbSxcbiAgICAgICAgICAgIGxhc3RPY2N1cGllZCArIGxhc3RUb3BCb3R0b20sXG4gICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIGlmIChyb3dJbmRleCA9PT0gOSkge1xuICAgICAgICAgIGNvbnN0IHRvcEFkamFjZW50Um93ID0gYm9hcmRbOF07XG4gICAgICAgICAgdG9wQWRqYWNlbnRSb3cuZmlsbChcbiAgICAgICAgICAgIFwiT1wiLFxuICAgICAgICAgICAgZmlyc3RPY2N1cGllZCAtIGZpcnN0VG9wQm90dG9tLFxuICAgICAgICAgICAgbGFzdE9jY3VwaWVkICsgbGFzdFRvcEJvdHRvbSxcbiAgICAgICAgICApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnN0IHRvcEFkamFjZW50Um93ID0gYm9hcmRbcm93SW5kZXggLSAxXTtcbiAgICAgICAgICBjb25zdCBib3R0b21BZGphY2VudFJvdyA9IGJvYXJkW3Jvd0luZGV4ICsgMV07XG4gICAgICAgICAgdG9wQWRqYWNlbnRSb3cuZmlsbChcbiAgICAgICAgICAgIFwiT1wiLFxuICAgICAgICAgICAgZmlyc3RPY2N1cGllZCAtIGZpcnN0VG9wQm90dG9tLFxuICAgICAgICAgICAgbGFzdE9jY3VwaWVkICsgbGFzdFRvcEJvdHRvbSxcbiAgICAgICAgICApO1xuICAgICAgICAgIGJvdHRvbUFkamFjZW50Um93LmZpbGwoXG4gICAgICAgICAgICBcIk9cIixcbiAgICAgICAgICAgIGZpcnN0T2NjdXBpZWQgLSBmaXJzdFRvcEJvdHRvbSxcbiAgICAgICAgICAgIGxhc3RPY2N1cGllZCArIGxhc3RUb3BCb3R0b20sXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIGlmIChcbiAgICAgICAgcG9wdWxhdGVkUm93WzBdID09PSBudWxsICYmXG4gICAgICAgIHBvcHVsYXRlZFJvd1twb3B1bGF0ZWRSb3cubGVuZ3RoIC0gMV0gIT09IG51bGwgJiZcbiAgICAgICAgIXBvcHVsYXRlZFJvdy5pbmNsdWRlcyhcIk9cIilcbiAgICAgICkge1xuICAgICAgICBvY2N1cHkodHJ1ZSwgZmFsc2UsIDEsIDEpO1xuICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgcG9wdWxhdGVkUm93WzBdICE9PSBudWxsICYmXG4gICAgICAgIHBvcHVsYXRlZFJvd1twb3B1bGF0ZWRSb3cubGVuZ3RoIC0gMV0gPT09IG51bGwgJiZcbiAgICAgICAgIXBvcHVsYXRlZFJvdy5pbmNsdWRlcyhcIk9cIilcbiAgICAgICkge1xuICAgICAgICBvY2N1cHkoZmFsc2UsIHRydWUsIDAsIDIpO1xuICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgcG9wdWxhdGVkUm93WzBdID09PSBudWxsICYmXG4gICAgICAgIHBvcHVsYXRlZFJvd1twb3B1bGF0ZWRSb3cubGVuZ3RoIC0gMV0gPT09IG51bGwgJiZcbiAgICAgICAgIXBvcHVsYXRlZFJvdy5pbmNsdWRlcyhcIk9cIilcbiAgICAgICkge1xuICAgICAgICBvY2N1cHkodHJ1ZSwgdHJ1ZSwgMSwgMik7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGNvbnN0IHBvcHVsYXRlQm9hcmQgPSAoKCkgPT4ge1xuICAgICAgY29uc3QgbGVnYWxNb3ZlcyA9IHRoaXMuZ2V0TGVnYWxNb3ZlcygpO1xuXG4gICAgICBjb25zdCBfd2l0aFNwZWNpZmllZFNoaXAgPSAoc2hpcCwgaW5kZXgpID0+IHtcbiAgICAgICAgY29uc3QgcmFuZG9tUm93SW5kZXggPSBnZW5lcmF0ZVJhbmRvbVJvd0luZGV4KCk7XG4gICAgICAgIGNvbnN0IHNoaXBNb3ZlcyA9IGxlZ2FsTW92ZXNbaW5kZXhdO1xuICAgICAgICBsZXQgc2hpcExlbmd0aCA9IG51bGw7XG5cbiAgICAgICAgc3dpdGNoIChzaGlwKSB7XG4gICAgICAgICAgY2FzZSBcIkNhcnJpZXJcIjpcbiAgICAgICAgICAgIHNoaXBMZW5ndGggPSB0aGlzLnNoaXBzLkNhcnJpZXIubGVuZ3RoO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSBcIkJhdHRsZXNoaXBcIjpcbiAgICAgICAgICAgIHNoaXBMZW5ndGggPSB0aGlzLnNoaXBzLkJhdHRsZXNoaXAubGVuZ3RoO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSBcIkRlc3Ryb3llclwiOlxuICAgICAgICAgICAgc2hpcExlbmd0aCA9IDMuNTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgXCJTdWJtYXJpbmVcIjpcbiAgICAgICAgICAgIHNoaXBMZW5ndGggPSB0aGlzLnNoaXBzLlN1Ym1hcmluZS5sZW5ndGg7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIFwiUGF0cm9sIEJvYXRcIjpcbiAgICAgICAgICAgIHNoaXBMZW5ndGggPSB0aGlzLnNoaXBzW1wiUGF0cm9sIEJvYXRcIl0ubGVuZ3RoO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCByYW5kb21TaGlwTW92ZSA9IGdldFJhbmRvbU1vdmVJbmRleChzaGlwTW92ZXMubGVuZ3RoKTtcbiAgICAgICAgY29uc3QgZmlyc3RTaGlwTW92ZSA9IHNoaXBNb3Zlc1tyYW5kb21TaGlwTW92ZV1bMF07XG4gICAgICAgIGNvbnN0IHNoaXBNb3ZlTGFzdEluZGV4ID0gc2hpcE1vdmVzW3JhbmRvbVNoaXBNb3ZlXS5sZW5ndGggLSAxO1xuICAgICAgICBjb25zdCBsYXN0U2hpcE1vdmUgPSBzaGlwTW92ZXNbcmFuZG9tU2hpcE1vdmVdW3NoaXBNb3ZlTGFzdEluZGV4XTtcblxuICAgICAgICBib2FyZC5mb3JFYWNoKChyb3csIHJvd0luZGV4KSA9PiB7XG4gICAgICAgICAgaWYgKHJvd0luZGV4ID09PSByYW5kb21Sb3dJbmRleCkge1xuICAgICAgICAgICAgLy8gQWx3YXlzIG9jY3VweSBlbXB0eSByb3dcbiAgICAgICAgICAgIHdoaWxlIChyb3cuaW5jbHVkZXMoXCJPXCIpKSB7XG4gICAgICAgICAgICAgIF93aXRoU3BlY2lmaWVkU2hpcChzaGlwLCBpbmRleCk7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJvdy5maWxsKHNoaXBMZW5ndGgsIGZpcnN0U2hpcE1vdmUsIGxhc3RTaGlwTW92ZSArIDEpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHVwZGF0ZUxlZ2FsTW92ZXNJbkJvYXJkKHJhbmRvbVJvd0luZGV4LCBzaGlwTGVuZ3RoKTtcbiAgICAgIH07XG5cbiAgICAgIF93aXRoU3BlY2lmaWVkU2hpcChcIkNhcnJpZXJcIiwgMCk7XG4gICAgICBfd2l0aFNwZWNpZmllZFNoaXAoXCJCYXR0bGVzaGlwXCIsIDEpO1xuICAgICAgX3dpdGhTcGVjaWZpZWRTaGlwKFwiRGVzdHJveWVyXCIsIDIpO1xuICAgICAgX3dpdGhTcGVjaWZpZWRTaGlwKFwiU3VibWFyaW5lXCIsIDMpO1xuICAgICAgX3dpdGhTcGVjaWZpZWRTaGlwKFwiUGF0cm9sIEJvYXRcIiwgNCk7XG4gICAgfSkoKTtcblxuICAgIGNvbnNvbGUubG9nKHRoaXMuYm9hcmQpO1xuICAgIHJldHVybiBib2FyZDtcbiAgfVxuXG4gIHJlY2VpdmVBdHRhY2soWFkpIHtcbiAgICBjb25zdCBnZW5lcmF0ZUtleXMgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgLy8gQWxwaGFiZXRzIEEtSlxuICAgICAgY29uc3QgYWxwaGFiZXRzID0gW107XG4gICAgICBmb3IgKGxldCBuID0gNjU7IG4gPD0gNzQ7IG4rKykge1xuICAgICAgICBhbHBoYWJldHMucHVzaChTdHJpbmcuZnJvbUNoYXJDb2RlKG4pKTtcbiAgICAgIH1cblxuICAgICAgY29uc3Qga2V5cyA9IFtdO1xuICAgICAgZm9yIChsZXQgbSA9IDE7IG0gPD0gMTA7IG0rKykge1xuICAgICAgICBjb25zdCBzdWJLZXlzID0gW107XG4gICAgICAgIGZvciAoY29uc3QgbGV0dGVyIG9mIGFscGhhYmV0cykge1xuICAgICAgICAgIHN1YktleXMucHVzaChgJHttfWAgKyBsZXR0ZXIpO1xuICAgICAgICB9XG4gICAgICAgIGtleXMucHVzaChzdWJLZXlzKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGtleXM7XG4gICAgfSkoKTtcblxuICAgIGNvbnN0IGFzc2lnbktleXNUb0JvYXJkSW5kaWNlcyA9IChmdW5jdGlvbiAoKSB7XG4gICAgICBjb25zdCBLZXlzQm94ID0ge307XG4gICAgICBjb25zdCBrZXlzID0gZ2VuZXJhdGVLZXlzO1xuXG4gICAgICBmb3IgKGxldCByb3dJbmRleCA9IDA7IHJvd0luZGV4IDwgMTA7IHJvd0luZGV4KyspIHtcbiAgICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IDEwOyBpbmRleCsrKSB7XG4gICAgICAgICAgS2V5c0JveFtgJHtrZXlzW3Jvd0luZGV4XVtpbmRleF19YF0gPSBbaW5kZXgsIHJvd0luZGV4XTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gS2V5c0JveDtcbiAgICB9KSgpO1xuXG4gICAgY29uc3Qgb2NjdXB5Q2hvc2VuU3BvdCA9ICgoKSA9PiB7XG4gICAgICBjb25zdCBib2FyZCA9IHRoaXMuYm9hcmQ7XG4gICAgICBjb25zdCBLZXlzQm94ID0gYXNzaWduS2V5c1RvQm9hcmRJbmRpY2VzO1xuICAgICAgY29uc3Qga2V5SW5kZXggPSBLZXlzQm94W1hZXVswXTtcbiAgICAgIGNvbnN0IHJvd0luZGV4ID0gS2V5c0JveFtYWV1bMV07XG4gICAgICBsZXQgaGl0RW50cnkgPSBib2FyZFtyb3dJbmRleF1ba2V5SW5kZXhdO1xuXG4gICAgICBjb25zdCB1cGRhdGVTaGlwTGlmZSA9IChzaGlwTGVuZ3RoKSA9PiB7XG4gICAgICAgIGNvbnN0IHVwZGF0ZVVudGlsRnVsbCA9IChzaGlwKSA9PiB7XG4gICAgICAgICAgaWYgKHNoaXAubnVtSGl0cyA9PT0gc2hpcExlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBzaGlwLmhpdCgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHN3aXRjaCAoc2hpcExlbmd0aCkge1xuICAgICAgICAgIGNhc2UgNTpcbiAgICAgICAgICAgIHVwZGF0ZVVudGlsRnVsbCh0aGlzLnNoaXBzLkNhcnJpZXIpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSA0OlxuICAgICAgICAgICAgdXBkYXRlVW50aWxGdWxsKHRoaXMuc2hpcHMuQmF0dGxlc2hpcCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIDMuNTpcbiAgICAgICAgICAgIHVwZGF0ZVVudGlsRnVsbCh0aGlzLnNoaXBzLkRlc3Ryb3llcik7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICB1cGRhdGVVbnRpbEZ1bGwodGhpcy5zaGlwcy5TdWJtYXJpbmUpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgdXBkYXRlVW50aWxGdWxsKHRoaXMuc2hpcHNbXCJQYXRyb2wgQm9hdFwiXSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgY29uc3QgdHJhY2tNaXNzZWRBdHRhY2tzID0gZnVuY3Rpb24gKGNvb3JkaW5hdGUpIHtcbiAgICAgICAgY29uc3QgbWlzc2VkQXR0YWNrcyA9IFtdO1xuICAgICAgICBtaXNzZWRBdHRhY2tzLnB1c2goY29vcmRpbmF0ZSk7XG4gICAgICB9O1xuXG4gICAgICBjb25zdCB1cGRhdGVTdW5rU3RhdHVzID0gKHNoaXBMZW5ndGgpID0+IHtcbiAgICAgICAgc3dpdGNoIChzaGlwTGVuZ3RoKSB7XG4gICAgICAgICAgY2FzZSA1OlxuICAgICAgICAgICAgdGhpcy5zaGlwcy5DYXJyaWVyLmlzU3VuaygpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSA0OlxuICAgICAgICAgICAgdGhpcy5zaGlwcy5CYXR0bGVzaGlwLmlzU3VuaygpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAzLjU6XG4gICAgICAgICAgICB0aGlzLnNoaXBzLkRlc3Ryb3llci5pc1N1bmsoKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgIHRoaXMuc2hpcHMuU3VibWFyaW5lLmlzU3VuaygpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgdGhpcy5zaGlwc1tcIlBhdHJvbCBCb2F0XCJdLmlzU3VuaygpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIGNvbnN0IGFsbFNoaXBzU3VuayA9ICgpID0+IHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIHRoaXMuc2hpcHMuQ2Fycmllci5zdW5rU3RhdHVzICYmXG4gICAgICAgICAgdGhpcy5zaGlwcy5CYXR0bGVzaGlwLnN1bmtTdGF0dXMgJiZcbiAgICAgICAgICB0aGlzLnNoaXBzLkRlc3Ryb3llci5zdW5rU3RhdHVzICYmXG4gICAgICAgICAgdGhpcy5zaGlwcy5TdWJtYXJpbmUuc3Vua1N0YXR1cyAmJlxuICAgICAgICAgIHRoaXMuc2hpcHNbXCJQYXRyb2wgQm9hdFwiXS5zdW5rU3RhdHVzXG4gICAgICAgICkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgaWYgKGhpdEVudHJ5ID09PSBudWxsIHx8IGhpdEVudHJ5ID09PSBcIk9cIikge1xuICAgICAgICBib2FyZFtyb3dJbmRleF1ba2V5SW5kZXhdID0gXCJYXCI7XG4gICAgICAgIHRyYWNrTWlzc2VkQXR0YWNrcyhYWSk7XG4gICAgICAgIHJldHVybiBcIkZhaWxcIjtcbiAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgIGhpdEVudHJ5ID09PSB0aGlzLnNoaXBzLkNhcnJpZXIubGVuZ3RoIHx8XG4gICAgICAgIGhpdEVudHJ5ID09PSB0aGlzLnNoaXBzLkJhdHRsZXNoaXAubGVuZ3RoIHx8XG4gICAgICAgIGhpdEVudHJ5ID09PSAzLjUgfHxcbiAgICAgICAgaGl0RW50cnkgPT09IHRoaXMuc2hpcHMuU3VibWFyaW5lLmxlbmd0aCB8fFxuICAgICAgICBoaXRFbnRyeSA9PT0gdGhpcy5zaGlwc1tcIlBhdHJvbCBCb2F0XCJdLmxlbmd0aFxuICAgICAgKSB7XG4gICAgICAgIGJvYXJkW3Jvd0luZGV4XVtrZXlJbmRleF0gPSBcIlhcIjtcbiAgICAgICAgdXBkYXRlU2hpcExpZmUoaGl0RW50cnkpO1xuICAgICAgICB1cGRhdGVTdW5rU3RhdHVzKGhpdEVudHJ5KTtcbiAgICAgICAgYWxsU2hpcHNTdW5rKCk7XG4gICAgICAgIHJldHVybiBcIlN1Y2Nlc3NcIjtcbiAgICAgICAgLy8gVE9ETzogVXNlciB0byBjaG9vc2UgYWdhaW5cbiAgICAgIH0gZWxzZSBpZiAoaGl0RW50cnkgPT09IFwiWFwiKSB7XG4gICAgICAgIHJldHVybiBcIk9jY3VwaWVkXCI7XG4gICAgICAgIC8vIFRPRE86IEVuYWJsZSB1c2VyIHRvIGNob29zZSBuZXcgc3BvdFxuICAgICAgfVxuICAgIH0pKCk7XG4gIH1cbn1cblxuY2xhc3MgUGxheWVyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy51c2VyID0gbmV3IEdhbWVib2FyZCgpO1xuICAgIHRoaXMudXNlckJvYXJkID0gdGhpcy51c2VyLmNyZWF0ZUJvYXJkKCk7XG4gICAgdGhpcy51c2VyLmRpc3BsYWNlU2hpcHMoKTtcblxuICAgIHRoaXMuY29tcHV0ZXIgPSBuZXcgR2FtZWJvYXJkKCk7XG4gICAgdGhpcy5jb21wdXRlckJvYXJkID0gdGhpcy5jb21wdXRlci5jcmVhdGVCb2FyZCgpO1xuICAgIHRoaXMuY29tcHV0ZXIuZGlzcGxhY2VTaGlwcygpO1xuICB9XG5cbiAgdXNlclR1cm4oWFkpIHtcbiAgICB0aGlzLmNvbXB1dGVyLnJlY2VpdmVBdHRhY2soWFkpO1xuICB9XG5cbiAgY29tcHV0ZXJUdXJuKCkge1xuICAgIGNvbnN0IGdlbmVyYXRlUmFuZG9tS2V5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgY29uc3QgYWxwaGFiZXRzID0gW107XG4gICAgICBjb25zdCBrZXlzID0gW107XG4gICAgICBjb25zdCByYW5kb21LZXlJbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwMCk7XG5cbiAgICAgIGZvciAobGV0IG4gPSA2NTsgbiA8PSA3NDsgbisrKSB7XG4gICAgICAgIGFscGhhYmV0cy5wdXNoKFN0cmluZy5mcm9tQ2hhckNvZGUobikpO1xuICAgICAgfVxuICAgICAgZm9yIChsZXQgbSA9IDE7IG0gPD0gMTA7IG0rKykge1xuICAgICAgICBmb3IgKGNvbnN0IGxldHRlciBvZiBhbHBoYWJldHMpIHtcbiAgICAgICAgICBrZXlzLnB1c2goYCR7bX1gICsgbGV0dGVyKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgY29uc3QgcmFuZG9tS2V5ID0ga2V5c1tyYW5kb21LZXlJbmRleF07XG4gICAgICByZXR1cm4gcmFuZG9tS2V5O1xuICAgIH07XG5cbiAgICBjb25zdCBwaWNrTGVnYWxNb3ZlID0gKCgpID0+IHtcbiAgICAgIGNvbnN0IGJvYXJkID0gdGhpcy51c2VyQm9hcmQ7XG4gICAgICBjb25zdCByYW5kb21LZXkgPSBnZW5lcmF0ZVJhbmRvbUtleSgpO1xuICAgICAgY29uc3QgcmVzcG9uc2UgPSB0aGlzLnVzZXIucmVjZWl2ZUF0dGFjayhyYW5kb21LZXkpO1xuICAgICAgY29uc3QgaXNBbGxFbnRyaWVzT2NjdXBpZWQgPSBib2FyZC5mbGF0KCkuZXZlcnkoKGVudHJ5KSA9PiBlbnRyeSA9PT0gXCJYXCIpO1xuICAgICAgaWYgKHJlc3BvbnNlID09PSBcIk9jY3VwaWVkXCIgJiYgIWlzQWxsRW50cmllc09jY3VwaWVkKSB7XG4gICAgICAgIHRoaXMuY29tcHV0ZXJUdXJuKCk7XG4gICAgICB9XG4gICAgfSkoKTtcbiAgfVxufVxuXG5jb25zdCB0cmFuc2l0aW9uSGVhZGVyQ29sb3IgPSAoZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBjaGFuZ2VDb2xvcigpIHtcbiAgICBsZXQgcmVkID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMjU2KTtcbiAgICBsZXQgZ3JlZW4gPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAyNTYpO1xuICAgIGxldCBibHVlID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMjU2KTtcblxuICAgIGxldCBjb2xvciA9IGByZ2JhKCR7cmVkfSwgJHtncmVlbn0sICR7Ymx1ZX0sIDAuNylgO1xuICAgIGNvbnN0IGhlYWRlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJoMVwiKTtcbiAgICBoZWFkZXIuc3R5bGUuYmFja2dyb3VuZCA9IGNvbG9yO1xuICB9XG5cbiAgc2V0SW50ZXJ2YWwoY2hhbmdlQ29sb3IsIDIwMDApO1xufSkoKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIFNoaXAsXG4gIEdhbWVib2FyZCxcbiAgUGxheWVyLFxufTtcblxuLy8gY29uc3QgZXZlckJvYXJkID0gbmV3IEdhbWVib2FyZCgpO1xuLy8gZXZlckJvYXJkLmRpc3BsYWNlU2hpcHMoKTtcbi8vIGV2ZXJCb2FyZC5yZWNlaXZlQXR0YWNrKFwiMUJcIik7XG4vLyBldmVyQm9hcmQucmVjZWl2ZUF0dGFjayhcIjFBXCIpO1xuLy8gZXZlckJvYXJkLnJlY2VpdmVBdHRhY2soXCIxQ1wiKTtcbi8vIGV2ZXJCb2FyZC5yZWNlaXZlQXR0YWNrKFwiMUJcIik7XG4iLCIvLyBJbXBvcnRzXG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyBmcm9tIFwiLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanNcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18gZnJvbSBcIi4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanNcIjtcbnZhciBfX19DU1NfTE9BREVSX0VYUE9SVF9fXyA9IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fKTtcbi8vIE1vZHVsZVxuX19fQ1NTX0xPQURFUl9FWFBPUlRfX18ucHVzaChbbW9kdWxlLmlkLCBgKiwgKjo6YmVmb3JlLCAqOjphZnRlciB7XG4gICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbn1cblxuaHRtbCwgYm9keSwgZGl2LCBzcGFuLCBhcHBsZXQsIG9iamVjdCwgaWZyYW1lLCBoMSwgaDIsIGgzLCBoNCwgaDUsIGg2LCBwLCBibG9ja3F1b3RlLCBwcmUsIGEsIGFiYnIsIGFjcm9ueW0sIGFkZHJlc3MsIGJpZywgY2l0ZSwgY29kZSwgZGVsLCBkZm4sIGVtLCBpbWcsIGlucywga2JkLCBxLCBzLCBzYW1wLCBzbWFsbCwgc3RyaWtlLCBzdHJvbmcsIHN1Yiwgc3VwLCB0dCwgdmFyLCBiLCB1LCBpLCBjZW50ZXIsIGRsLCBkdCwgZGQsIG9sLCB1bCwgbGksIGZpZWxkc2V0LCBmb3JtLCBsYWJlbCwgbGVnZW5kLCB0YWJsZSwgY2FwdGlvbiwgdGJvZHksIHRmb290LCB0aGVhZCwgdHIsIHRoLCB0ZCwgYXJ0aWNsZSwgYXNpZGUsIGNhbnZhcywgZGV0YWlscywgZW1iZWQsIGZpZ3VyZSwgZmlnY2FwdGlvbiwgZm9vdGVyLCBoZWFkZXIsIGhncm91cCwgbWVudSwgbmF2LCBvdXRwdXQsIHJ1YnksIHNlY3Rpb24sIHN1bW1hcnksIHRpbWUsIG1hcmssIGF1ZGlvLCB2aWRlbyAge1xuICAgIG1hcmdpbjogMDtcbiAgICBwYWRkaW5nOiAwO1xuICAgIGJvcmRlcjogMDtcbiAgICBmb250LXNpemU6IDEwMCU7XG4gICAgZm9udDogaW5oZXJpdDtcbiAgICB2ZXJ0aWNhbC1hbGlnbjogYmFzZWxpbmU7XG59XG5cbmJvZHkge1xuICAgIGZvbnQtZmFtaWx5OiBBcmlhbCwgc2Fucy1zZXJpZjtcbiAgICBmb250LXNpemU6IDE2cHg7XG4gICAgbGluZS1oZWlnaHQ6IDEuMTtcbn1cblxuYSB7XG4gICAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xuICAgIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xufVxuXG5vbCwgdWwge1xuXHRsaXN0LXN0eWxlOiBub25lO1xufVxuXG5tYWluLCBhcnRpY2xlLCBhc2lkZSwgZGV0YWlscywgZmlnY2FwdGlvbiwgZmlndXJlLCBcbmZvb3RlciwgaGVhZGVyLCBoZ3JvdXAsIG1lbnUsIG5hdiwgc2VjdGlvbiB7XG5cdGRpc3BsYXk6IGJsb2NrO1xufVxuXG5ibG9ja3F1b3RlLCBxIHtcbiAgICBxdW90ZXM6IG5vbmU7XG59XG5cbnRhYmxlIHtcbiAgICBib3JkZXItY29sbGFwc2U6IGNvbGxhcHNlO1xuICAgIGJvcmRlci1zcGFjaW5nOiAwO1xufVxuXG5pbWcge1xuICAgIGJvcmRlci1zdHlsZTogbm9uZTtcbn1cblxuYnV0dG9uLCBpbnB1dCB7XG4gICAgb3ZlcmZsb3c6IHZpc2libGU7XG59XG5cbmFiYnJbdGl0bGVdIHtcbiAgICBib3JkZXItYm90dG9tOiBub25lO1xuICAgIHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lO1xufVxuXG5zdHJvbmcsIGIge1xuICAgIGZvbnQtd2VpZ2h0OiBib2xkZXI7XG59YCwgXCJcIix7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJ3ZWJwYWNrOi8vLi9zcmMvcmVzZXQuY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUFBO0lBQ0ksc0JBQXNCO0FBQzFCOztBQUVBO0lBQ0ksU0FBUztJQUNULFVBQVU7SUFDVixTQUFTO0lBQ1QsZUFBZTtJQUNmLGFBQWE7SUFDYix3QkFBd0I7QUFDNUI7O0FBRUE7SUFDSSw4QkFBOEI7SUFDOUIsZUFBZTtJQUNmLGdCQUFnQjtBQUNwQjs7QUFFQTtJQUNJLHFCQUFxQjtJQUNyQiw2QkFBNkI7QUFDakM7O0FBRUE7Q0FDQyxnQkFBZ0I7QUFDakI7O0FBRUE7O0NBRUMsY0FBYztBQUNmOztBQUVBO0lBQ0ksWUFBWTtBQUNoQjs7QUFFQTtJQUNJLHlCQUF5QjtJQUN6QixpQkFBaUI7QUFDckI7O0FBRUE7SUFDSSxrQkFBa0I7QUFDdEI7O0FBRUE7SUFDSSxpQkFBaUI7QUFDckI7O0FBRUE7SUFDSSxtQkFBbUI7SUFDbkIsMEJBQTBCO0FBQzlCOztBQUVBO0lBQ0ksbUJBQW1CO0FBQ3ZCXCIsXCJzb3VyY2VzQ29udGVudFwiOltcIiosICo6OmJlZm9yZSwgKjo6YWZ0ZXIge1xcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xcbn1cXG5cXG5odG1sLCBib2R5LCBkaXYsIHNwYW4sIGFwcGxldCwgb2JqZWN0LCBpZnJhbWUsIGgxLCBoMiwgaDMsIGg0LCBoNSwgaDYsIHAsIGJsb2NrcXVvdGUsIHByZSwgYSwgYWJiciwgYWNyb255bSwgYWRkcmVzcywgYmlnLCBjaXRlLCBjb2RlLCBkZWwsIGRmbiwgZW0sIGltZywgaW5zLCBrYmQsIHEsIHMsIHNhbXAsIHNtYWxsLCBzdHJpa2UsIHN0cm9uZywgc3ViLCBzdXAsIHR0LCB2YXIsIGIsIHUsIGksIGNlbnRlciwgZGwsIGR0LCBkZCwgb2wsIHVsLCBsaSwgZmllbGRzZXQsIGZvcm0sIGxhYmVsLCBsZWdlbmQsIHRhYmxlLCBjYXB0aW9uLCB0Ym9keSwgdGZvb3QsIHRoZWFkLCB0ciwgdGgsIHRkLCBhcnRpY2xlLCBhc2lkZSwgY2FudmFzLCBkZXRhaWxzLCBlbWJlZCwgZmlndXJlLCBmaWdjYXB0aW9uLCBmb290ZXIsIGhlYWRlciwgaGdyb3VwLCBtZW51LCBuYXYsIG91dHB1dCwgcnVieSwgc2VjdGlvbiwgc3VtbWFyeSwgdGltZSwgbWFyaywgYXVkaW8sIHZpZGVvICB7XFxuICAgIG1hcmdpbjogMDtcXG4gICAgcGFkZGluZzogMDtcXG4gICAgYm9yZGVyOiAwO1xcbiAgICBmb250LXNpemU6IDEwMCU7XFxuICAgIGZvbnQ6IGluaGVyaXQ7XFxuICAgIHZlcnRpY2FsLWFsaWduOiBiYXNlbGluZTtcXG59XFxuXFxuYm9keSB7XFxuICAgIGZvbnQtZmFtaWx5OiBBcmlhbCwgc2Fucy1zZXJpZjtcXG4gICAgZm9udC1zaXplOiAxNnB4O1xcbiAgICBsaW5lLWhlaWdodDogMS4xO1xcbn1cXG5cXG5hIHtcXG4gICAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcXG59XFxuXFxub2wsIHVsIHtcXG5cXHRsaXN0LXN0eWxlOiBub25lO1xcbn1cXG5cXG5tYWluLCBhcnRpY2xlLCBhc2lkZSwgZGV0YWlscywgZmlnY2FwdGlvbiwgZmlndXJlLCBcXG5mb290ZXIsIGhlYWRlciwgaGdyb3VwLCBtZW51LCBuYXYsIHNlY3Rpb24ge1xcblxcdGRpc3BsYXk6IGJsb2NrO1xcbn1cXG5cXG5ibG9ja3F1b3RlLCBxIHtcXG4gICAgcXVvdGVzOiBub25lO1xcbn1cXG5cXG50YWJsZSB7XFxuICAgIGJvcmRlci1jb2xsYXBzZTogY29sbGFwc2U7XFxuICAgIGJvcmRlci1zcGFjaW5nOiAwO1xcbn1cXG5cXG5pbWcge1xcbiAgICBib3JkZXItc3R5bGU6IG5vbmU7XFxufVxcblxcbmJ1dHRvbiwgaW5wdXQge1xcbiAgICBvdmVyZmxvdzogdmlzaWJsZTtcXG59XFxuXFxuYWJiclt0aXRsZV0ge1xcbiAgICBib3JkZXItYm90dG9tOiBub25lO1xcbiAgICB0ZXh0LWRlY29yYXRpb246IHVuZGVybGluZTtcXG59XFxuXFxuc3Ryb25nLCBiIHtcXG4gICAgZm9udC13ZWlnaHQ6IGJvbGRlcjtcXG59XCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG4vLyBFeHBvcnRzXG5leHBvcnQgZGVmYXVsdCBfX19DU1NfTE9BREVSX0VYUE9SVF9fXztcbiIsIi8vIEltcG9ydHNcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fIGZyb20gXCIuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyBmcm9tIFwiLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfR0VUX1VSTF9JTVBPUlRfX18gZnJvbSBcIi4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9nZXRVcmwuanNcIjtcbnZhciBfX19DU1NfTE9BREVSX1VSTF9JTVBPUlRfMF9fXyA9IG5ldyBVUkwoXCIuL2Fzc2V0cy9hZG1pcmFsLWVkaXQuanBnXCIsIGltcG9ydC5tZXRhLnVybCk7XG52YXIgX19fQ1NTX0xPQURFUl9FWFBPUlRfX18gPSBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyk7XG52YXIgX19fQ1NTX0xPQURFUl9VUkxfUkVQTEFDRU1FTlRfMF9fXyA9IF9fX0NTU19MT0FERVJfR0VUX1VSTF9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9VUkxfSU1QT1JUXzBfX18pO1xuLy8gTW9kdWxlXG5fX19DU1NfTE9BREVSX0VYUE9SVF9fXy5wdXNoKFttb2R1bGUuaWQsIGAqIHtcbiAgbGV0dGVyLXNwYWNpbmc6IDAuMXJlbTtcbn1cblxuYm9keSB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgZm9udC1mYW1pbHk6IFwiUmFsZXdheVwiLCBzYW5zLXNlcmlmO1xuICBmb250LXNpemU6IDEuMnJlbTtcbiAgcGFkZGluZzogMnJlbTtcbiAgZ2FwOiAycmVtO1xuICBoZWlnaHQ6IDEwMHZoO1xuICBiYWNrZ3JvdW5kLWltYWdlOiB1cmwoJHtfX19DU1NfTE9BREVSX1VSTF9SRVBMQUNFTUVOVF8wX19ffSk7XG4gIGJhY2tncm91bmQtc2l6ZTogY292ZXI7XG4gIGJhY2tncm91bmQtcG9zaXRpb246IGNlbnRlciBjZW50ZXI7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbn1cblxuc2VjdGlvbiB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICBoZWlnaHQ6IDIwcmVtO1xuICB3aWR0aDogMzVyZW07XG4gIGdhcDogM3JlbTtcbiAgYm9yZGVyLXJhZGl1czogMXJlbTtcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLCAwLCAwLCAwLjgpO1xuICB6LWluZGV4OiAxO1xuICB0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gMC4zcyBlYXNlLWluLW91dDtcbn1cblxuc2VjdGlvbjpob3ZlciB7XG4gIHRyYW5zZm9ybTogc2NhbGUoMS4wNSk7XG59XG5cbmlucHV0W3R5cGU9XCJ0ZXh0XCJdIHtcbiAgYmFja2dyb3VuZDogbm9uZTtcbiAgYm9yZGVyOiBub25lO1xuICBib3JkZXItYm90dG9tOiAycHggc29saWQgd2hpdGU7XG4gIGZvbnQtc2l6ZTogMS4zcmVtO1xuICBjb2xvcjogd2hpdGU7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgd2lkdGg6IDEycmVtO1xufVxuXG5pbnB1dFt0eXBlPVwidGV4dFwiXTpob3ZlciB7XG4gIGJhY2tncm91bmQ6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC45KTtcbiAgYm9yZGVyLXJhZGl1czogMC41cmVtO1xuXG4gIGNvbG9yOiBibGFjaztcbn1cblxuaDEge1xuICBmb250LWZhbWlseTogXCJTaXh0eWZvdXJcIiwgc2Fucy1zZXJpZjtcbiAgZm9udC1vcHRpY2FsLXNpemluZzogYXV0bztcbiAgZm9udC13ZWlnaHQ6IDQwMDtcbiAgZm9udC1zaXplOiAxMHJlbTtcbiAgYm9yZGVyLXJhZGl1czogNXJlbTtcbiAgcGFkZGluZzogMXJlbSAxcmVtIDAgMXJlbTtcbiAgYmFja2dyb3VuZDogcmdiKDI1NSwgMjU1LCAyNTUsIDAuNCk7XG4gIGN1cnNvcjogY29udGV4dC1tZW51O1xuICB0cmFuc2l0aW9uOiBiYWNrZ3JvdW5kIDVzIGVhc2U7XG59XG5cbmJ1dHRvbiB7XG4gIGJhY2tncm91bmQ6IGJsYWNrO1xuICBmb250LXNpemU6IDEuN3JlbTtcbiAgZm9udC13ZWlnaHQ6IDYwMDtcbiAgcGFkZGluZzogMC41cmVtIDEuMnJlbTtcbiAgYm9yZGVyLXJhZGl1czogNXJlbTtcbiAgYm9yZGVyLWNvbG9yOiB3aGl0ZTtcbiAgYm9yZGVyLXdpZHRoOiAwLjJyZW07XG4gIGNvbG9yOiB3aGl0ZTtcbiAgdHJhbnNpdGlvbjogdHJhbnNmb3JtIDAuMnMgZWFzZS1pbjtcbn1cblxuYnV0dG9uOmhvdmVyIHtcbiAgdHJhbnNmb3JtOiBzY2FsZSgxLjAyKTtcbiAgY29sb3I6IHJnYigyMDQsIDIwMiwgMjAyKTtcbiAgY3Vyc29yOiBwb2ludGVyO1xufVxuXG5hIHtcbiAgY29sb3I6IHdoaXRlO1xufVxuYCwgXCJcIix7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJ3ZWJwYWNrOi8vLi9zcmMvc3R5bGUuY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUFBO0VBQ0Usc0JBQXNCO0FBQ3hCOztBQUVBO0VBQ0UsYUFBYTtFQUNiLG1CQUFtQjtFQUNuQixzQkFBc0I7RUFDdEIsa0JBQWtCO0VBQ2xCLGtDQUFrQztFQUNsQyxpQkFBaUI7RUFDakIsYUFBYTtFQUNiLFNBQVM7RUFDVCxhQUFhO0VBQ2IseURBQWdEO0VBQ2hELHNCQUFzQjtFQUN0QixrQ0FBa0M7RUFDbEMsa0JBQWtCO0FBQ3BCOztBQUVBO0VBQ0UsYUFBYTtFQUNiLHVCQUF1QjtFQUN2QixtQkFBbUI7RUFDbkIsc0JBQXNCO0VBQ3RCLGFBQWE7RUFDYixZQUFZO0VBQ1osU0FBUztFQUNULG1CQUFtQjtFQUNuQixvQ0FBb0M7RUFDcEMsVUFBVTtFQUNWLHNDQUFzQztBQUN4Qzs7QUFFQTtFQUNFLHNCQUFzQjtBQUN4Qjs7QUFFQTtFQUNFLGdCQUFnQjtFQUNoQixZQUFZO0VBQ1osOEJBQThCO0VBQzlCLGlCQUFpQjtFQUNqQixZQUFZO0VBQ1osa0JBQWtCO0VBQ2xCLFlBQVk7QUFDZDs7QUFFQTtFQUNFLG9DQUFvQztFQUNwQyxxQkFBcUI7O0VBRXJCLFlBQVk7QUFDZDs7QUFFQTtFQUNFLG9DQUFvQztFQUNwQyx5QkFBeUI7RUFDekIsZ0JBQWdCO0VBQ2hCLGdCQUFnQjtFQUNoQixtQkFBbUI7RUFDbkIseUJBQXlCO0VBQ3pCLG1DQUFtQztFQUNuQyxvQkFBb0I7RUFDcEIsOEJBQThCO0FBQ2hDOztBQUVBO0VBQ0UsaUJBQWlCO0VBQ2pCLGlCQUFpQjtFQUNqQixnQkFBZ0I7RUFDaEIsc0JBQXNCO0VBQ3RCLG1CQUFtQjtFQUNuQixtQkFBbUI7RUFDbkIsb0JBQW9CO0VBQ3BCLFlBQVk7RUFDWixrQ0FBa0M7QUFDcEM7O0FBRUE7RUFDRSxzQkFBc0I7RUFDdEIseUJBQXlCO0VBQ3pCLGVBQWU7QUFDakI7O0FBRUE7RUFDRSxZQUFZO0FBQ2RcIixcInNvdXJjZXNDb250ZW50XCI6W1wiKiB7XFxuICBsZXR0ZXItc3BhY2luZzogMC4xcmVtO1xcbn1cXG5cXG5ib2R5IHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gIGZvbnQtZmFtaWx5OiBcXFwiUmFsZXdheVxcXCIsIHNhbnMtc2VyaWY7XFxuICBmb250LXNpemU6IDEuMnJlbTtcXG4gIHBhZGRpbmc6IDJyZW07XFxuICBnYXA6IDJyZW07XFxuICBoZWlnaHQ6IDEwMHZoO1xcbiAgYmFja2dyb3VuZC1pbWFnZTogdXJsKC4vYXNzZXRzL2FkbWlyYWwtZWRpdC5qcGcpO1xcbiAgYmFja2dyb3VuZC1zaXplOiBjb3ZlcjtcXG4gIGJhY2tncm91bmQtcG9zaXRpb246IGNlbnRlciBjZW50ZXI7XFxuICBwb3NpdGlvbjogcmVsYXRpdmU7XFxufVxcblxcbnNlY3Rpb24ge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICBoZWlnaHQ6IDIwcmVtO1xcbiAgd2lkdGg6IDM1cmVtO1xcbiAgZ2FwOiAzcmVtO1xcbiAgYm9yZGVyLXJhZGl1czogMXJlbTtcXG4gIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgMCwgMCwgMC44KTtcXG4gIHotaW5kZXg6IDE7XFxuICB0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gMC4zcyBlYXNlLWluLW91dDtcXG59XFxuXFxuc2VjdGlvbjpob3ZlciB7XFxuICB0cmFuc2Zvcm06IHNjYWxlKDEuMDUpO1xcbn1cXG5cXG5pbnB1dFt0eXBlPVxcXCJ0ZXh0XFxcIl0ge1xcbiAgYmFja2dyb3VuZDogbm9uZTtcXG4gIGJvcmRlcjogbm9uZTtcXG4gIGJvcmRlci1ib3R0b206IDJweCBzb2xpZCB3aGl0ZTtcXG4gIGZvbnQtc2l6ZTogMS4zcmVtO1xcbiAgY29sb3I6IHdoaXRlO1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbiAgd2lkdGg6IDEycmVtO1xcbn1cXG5cXG5pbnB1dFt0eXBlPVxcXCJ0ZXh0XFxcIl06aG92ZXIge1xcbiAgYmFja2dyb3VuZDogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjkpO1xcbiAgYm9yZGVyLXJhZGl1czogMC41cmVtO1xcblxcbiAgY29sb3I6IGJsYWNrO1xcbn1cXG5cXG5oMSB7XFxuICBmb250LWZhbWlseTogXFxcIlNpeHR5Zm91clxcXCIsIHNhbnMtc2VyaWY7XFxuICBmb250LW9wdGljYWwtc2l6aW5nOiBhdXRvO1xcbiAgZm9udC13ZWlnaHQ6IDQwMDtcXG4gIGZvbnQtc2l6ZTogMTByZW07XFxuICBib3JkZXItcmFkaXVzOiA1cmVtO1xcbiAgcGFkZGluZzogMXJlbSAxcmVtIDAgMXJlbTtcXG4gIGJhY2tncm91bmQ6IHJnYigyNTUsIDI1NSwgMjU1LCAwLjQpO1xcbiAgY3Vyc29yOiBjb250ZXh0LW1lbnU7XFxuICB0cmFuc2l0aW9uOiBiYWNrZ3JvdW5kIDVzIGVhc2U7XFxufVxcblxcbmJ1dHRvbiB7XFxuICBiYWNrZ3JvdW5kOiBibGFjaztcXG4gIGZvbnQtc2l6ZTogMS43cmVtO1xcbiAgZm9udC13ZWlnaHQ6IDYwMDtcXG4gIHBhZGRpbmc6IDAuNXJlbSAxLjJyZW07XFxuICBib3JkZXItcmFkaXVzOiA1cmVtO1xcbiAgYm9yZGVyLWNvbG9yOiB3aGl0ZTtcXG4gIGJvcmRlci13aWR0aDogMC4ycmVtO1xcbiAgY29sb3I6IHdoaXRlO1xcbiAgdHJhbnNpdGlvbjogdHJhbnNmb3JtIDAuMnMgZWFzZS1pbjtcXG59XFxuXFxuYnV0dG9uOmhvdmVyIHtcXG4gIHRyYW5zZm9ybTogc2NhbGUoMS4wMik7XFxuICBjb2xvcjogcmdiKDIwNCwgMjAyLCAyMDIpO1xcbiAgY3Vyc29yOiBwb2ludGVyO1xcbn1cXG5cXG5hIHtcXG4gIGNvbG9yOiB3aGl0ZTtcXG59XFxuXCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG4vLyBFeHBvcnRzXG5leHBvcnQgZGVmYXVsdCBfX19DU1NfTE9BREVSX0VYUE9SVF9fXztcbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vKlxuICBNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuICBBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY3NzV2l0aE1hcHBpbmdUb1N0cmluZykge1xuICB2YXIgbGlzdCA9IFtdO1xuXG4gIC8vIHJldHVybiB0aGUgbGlzdCBvZiBtb2R1bGVzIGFzIGNzcyBzdHJpbmdcbiAgbGlzdC50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiB0aGlzLm1hcChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgdmFyIGNvbnRlbnQgPSBcIlwiO1xuICAgICAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBpdGVtWzVdICE9PSBcInVuZGVmaW5lZFwiO1xuICAgICAgaWYgKGl0ZW1bNF0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBtZWRpYSBcIi5jb25jYXQoaXRlbVsyXSwgXCIge1wiKTtcbiAgICAgIH1cbiAgICAgIGlmIChuZWVkTGF5ZXIpIHtcbiAgICAgICAgY29udGVudCArPSBcIkBsYXllclwiLmNvbmNhdChpdGVtWzVdLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQoaXRlbVs1XSkgOiBcIlwiLCBcIiB7XCIpO1xuICAgICAgfVxuICAgICAgY29udGVudCArPSBjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKGl0ZW0pO1xuICAgICAgaWYgKG5lZWRMYXllcikge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzRdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29udGVudDtcbiAgICB9KS5qb2luKFwiXCIpO1xuICB9O1xuXG4gIC8vIGltcG9ydCBhIGxpc3Qgb2YgbW9kdWxlcyBpbnRvIHRoZSBsaXN0XG4gIGxpc3QuaSA9IGZ1bmN0aW9uIGkobW9kdWxlcywgbWVkaWEsIGRlZHVwZSwgc3VwcG9ydHMsIGxheWVyKSB7XG4gICAgaWYgKHR5cGVvZiBtb2R1bGVzID09PSBcInN0cmluZ1wiKSB7XG4gICAgICBtb2R1bGVzID0gW1tudWxsLCBtb2R1bGVzLCB1bmRlZmluZWRdXTtcbiAgICB9XG4gICAgdmFyIGFscmVhZHlJbXBvcnRlZE1vZHVsZXMgPSB7fTtcbiAgICBpZiAoZGVkdXBlKSB7XG4gICAgICBmb3IgKHZhciBrID0gMDsgayA8IHRoaXMubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgdmFyIGlkID0gdGhpc1trXVswXTtcbiAgICAgICAgaWYgKGlkICE9IG51bGwpIHtcbiAgICAgICAgICBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2lkXSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgZm9yICh2YXIgX2sgPSAwOyBfayA8IG1vZHVsZXMubGVuZ3RoOyBfaysrKSB7XG4gICAgICB2YXIgaXRlbSA9IFtdLmNvbmNhdChtb2R1bGVzW19rXSk7XG4gICAgICBpZiAoZGVkdXBlICYmIGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaXRlbVswXV0pIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIGxheWVyICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIGlmICh0eXBlb2YgaXRlbVs1XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKG1lZGlhKSB7XG4gICAgICAgIGlmICghaXRlbVsyXSkge1xuICAgICAgICAgIGl0ZW1bMl0gPSBtZWRpYTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChzdXBwb3J0cykge1xuICAgICAgICBpZiAoIWl0ZW1bNF0pIHtcbiAgICAgICAgICBpdGVtWzRdID0gXCJcIi5jb25jYXQoc3VwcG9ydHMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVs0XSA9IHN1cHBvcnRzO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBsaXN0LnB1c2goaXRlbSk7XG4gICAgfVxuICB9O1xuICByZXR1cm4gbGlzdDtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHVybCwgb3B0aW9ucykge1xuICBpZiAoIW9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0ge307XG4gIH1cbiAgaWYgKCF1cmwpIHtcbiAgICByZXR1cm4gdXJsO1xuICB9XG4gIHVybCA9IFN0cmluZyh1cmwuX19lc01vZHVsZSA/IHVybC5kZWZhdWx0IDogdXJsKTtcblxuICAvLyBJZiB1cmwgaXMgYWxyZWFkeSB3cmFwcGVkIGluIHF1b3RlcywgcmVtb3ZlIHRoZW1cbiAgaWYgKC9eWydcIl0uKlsnXCJdJC8udGVzdCh1cmwpKSB7XG4gICAgdXJsID0gdXJsLnNsaWNlKDEsIC0xKTtcbiAgfVxuICBpZiAob3B0aW9ucy5oYXNoKSB7XG4gICAgdXJsICs9IG9wdGlvbnMuaGFzaDtcbiAgfVxuXG4gIC8vIFNob3VsZCB1cmwgYmUgd3JhcHBlZD9cbiAgLy8gU2VlIGh0dHBzOi8vZHJhZnRzLmNzc3dnLm9yZy9jc3MtdmFsdWVzLTMvI3VybHNcbiAgaWYgKC9bXCInKCkgXFx0XFxuXXwoJTIwKS8udGVzdCh1cmwpIHx8IG9wdGlvbnMubmVlZFF1b3Rlcykge1xuICAgIHJldHVybiBcIlxcXCJcIi5jb25jYXQodXJsLnJlcGxhY2UoL1wiL2csICdcXFxcXCInKS5yZXBsYWNlKC9cXG4vZywgXCJcXFxcblwiKSwgXCJcXFwiXCIpO1xuICB9XG4gIHJldHVybiB1cmw7XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdGVtKSB7XG4gIHZhciBjb250ZW50ID0gaXRlbVsxXTtcbiAgdmFyIGNzc01hcHBpbmcgPSBpdGVtWzNdO1xuICBpZiAoIWNzc01hcHBpbmcpIHtcbiAgICByZXR1cm4gY29udGVudDtcbiAgfVxuICBpZiAodHlwZW9mIGJ0b2EgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIHZhciBiYXNlNjQgPSBidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShjc3NNYXBwaW5nKSkpKTtcbiAgICB2YXIgZGF0YSA9IFwic291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsXCIuY29uY2F0KGJhc2U2NCk7XG4gICAgdmFyIHNvdXJjZU1hcHBpbmcgPSBcIi8qIyBcIi5jb25jYXQoZGF0YSwgXCIgKi9cIik7XG4gICAgcmV0dXJuIFtjb250ZW50XS5jb25jYXQoW3NvdXJjZU1hcHBpbmddKS5qb2luKFwiXFxuXCIpO1xuICB9XG4gIHJldHVybiBbY29udGVudF0uam9pbihcIlxcblwiKTtcbn07IiwiXG4gICAgICBpbXBvcnQgQVBJIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzXCI7XG4gICAgICBpbXBvcnQgZG9tQVBJIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRGbiBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanNcIjtcbiAgICAgIGltcG9ydCBzZXRBdHRyaWJ1dGVzIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0U3R5bGVFbGVtZW50IGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzXCI7XG4gICAgICBpbXBvcnQgc3R5bGVUYWdUcmFuc2Zvcm1GbiBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzXCI7XG4gICAgICBpbXBvcnQgY29udGVudCwgKiBhcyBuYW1lZEV4cG9ydCBmcm9tIFwiISEuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL3Jlc2V0LmNzc1wiO1xuICAgICAgXG4gICAgICBcblxudmFyIG9wdGlvbnMgPSB7fTtcblxub3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybSA9IHN0eWxlVGFnVHJhbnNmb3JtRm47XG5vcHRpb25zLnNldEF0dHJpYnV0ZXMgPSBzZXRBdHRyaWJ1dGVzO1xuXG4gICAgICBvcHRpb25zLmluc2VydCA9IGluc2VydEZuLmJpbmQobnVsbCwgXCJoZWFkXCIpO1xuICAgIFxub3B0aW9ucy5kb21BUEkgPSBkb21BUEk7XG5vcHRpb25zLmluc2VydFN0eWxlRWxlbWVudCA9IGluc2VydFN0eWxlRWxlbWVudDtcblxudmFyIHVwZGF0ZSA9IEFQSShjb250ZW50LCBvcHRpb25zKTtcblxuXG5cbmV4cG9ydCAqIGZyb20gXCIhIS4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vcmVzZXQuY3NzXCI7XG4gICAgICAgZXhwb3J0IGRlZmF1bHQgY29udGVudCAmJiBjb250ZW50LmxvY2FscyA/IGNvbnRlbnQubG9jYWxzIDogdW5kZWZpbmVkO1xuIiwiXG4gICAgICBpbXBvcnQgQVBJIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzXCI7XG4gICAgICBpbXBvcnQgZG9tQVBJIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRGbiBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanNcIjtcbiAgICAgIGltcG9ydCBzZXRBdHRyaWJ1dGVzIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0U3R5bGVFbGVtZW50IGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzXCI7XG4gICAgICBpbXBvcnQgc3R5bGVUYWdUcmFuc2Zvcm1GbiBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzXCI7XG4gICAgICBpbXBvcnQgY29udGVudCwgKiBhcyBuYW1lZEV4cG9ydCBmcm9tIFwiISEuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL3N0eWxlLmNzc1wiO1xuICAgICAgXG4gICAgICBcblxudmFyIG9wdGlvbnMgPSB7fTtcblxub3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybSA9IHN0eWxlVGFnVHJhbnNmb3JtRm47XG5vcHRpb25zLnNldEF0dHJpYnV0ZXMgPSBzZXRBdHRyaWJ1dGVzO1xuXG4gICAgICBvcHRpb25zLmluc2VydCA9IGluc2VydEZuLmJpbmQobnVsbCwgXCJoZWFkXCIpO1xuICAgIFxub3B0aW9ucy5kb21BUEkgPSBkb21BUEk7XG5vcHRpb25zLmluc2VydFN0eWxlRWxlbWVudCA9IGluc2VydFN0eWxlRWxlbWVudDtcblxudmFyIHVwZGF0ZSA9IEFQSShjb250ZW50LCBvcHRpb25zKTtcblxuXG5cbmV4cG9ydCAqIGZyb20gXCIhIS4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vc3R5bGUuY3NzXCI7XG4gICAgICAgZXhwb3J0IGRlZmF1bHQgY29udGVudCAmJiBjb250ZW50LmxvY2FscyA/IGNvbnRlbnQubG9jYWxzIDogdW5kZWZpbmVkO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBzdHlsZXNJbkRPTSA9IFtdO1xuZnVuY3Rpb24gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcikge1xuICB2YXIgcmVzdWx0ID0gLTE7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3R5bGVzSW5ET00ubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoc3R5bGVzSW5ET01baV0uaWRlbnRpZmllciA9PT0gaWRlbnRpZmllcikge1xuICAgICAgcmVzdWx0ID0gaTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuZnVuY3Rpb24gbW9kdWxlc1RvRG9tKGxpc3QsIG9wdGlvbnMpIHtcbiAgdmFyIGlkQ291bnRNYXAgPSB7fTtcbiAgdmFyIGlkZW50aWZpZXJzID0gW107XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgIHZhciBpdGVtID0gbGlzdFtpXTtcbiAgICB2YXIgaWQgPSBvcHRpb25zLmJhc2UgPyBpdGVtWzBdICsgb3B0aW9ucy5iYXNlIDogaXRlbVswXTtcbiAgICB2YXIgY291bnQgPSBpZENvdW50TWFwW2lkXSB8fCAwO1xuICAgIHZhciBpZGVudGlmaWVyID0gXCJcIi5jb25jYXQoaWQsIFwiIFwiKS5jb25jYXQoY291bnQpO1xuICAgIGlkQ291bnRNYXBbaWRdID0gY291bnQgKyAxO1xuICAgIHZhciBpbmRleEJ5SWRlbnRpZmllciA9IGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xuICAgIHZhciBvYmogPSB7XG4gICAgICBjc3M6IGl0ZW1bMV0sXG4gICAgICBtZWRpYTogaXRlbVsyXSxcbiAgICAgIHNvdXJjZU1hcDogaXRlbVszXSxcbiAgICAgIHN1cHBvcnRzOiBpdGVtWzRdLFxuICAgICAgbGF5ZXI6IGl0ZW1bNV1cbiAgICB9O1xuICAgIGlmIChpbmRleEJ5SWRlbnRpZmllciAhPT0gLTEpIHtcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4QnlJZGVudGlmaWVyXS5yZWZlcmVuY2VzKys7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleEJ5SWRlbnRpZmllcl0udXBkYXRlcihvYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgdXBkYXRlciA9IGFkZEVsZW1lbnRTdHlsZShvYmosIG9wdGlvbnMpO1xuICAgICAgb3B0aW9ucy5ieUluZGV4ID0gaTtcbiAgICAgIHN0eWxlc0luRE9NLnNwbGljZShpLCAwLCB7XG4gICAgICAgIGlkZW50aWZpZXI6IGlkZW50aWZpZXIsXG4gICAgICAgIHVwZGF0ZXI6IHVwZGF0ZXIsXG4gICAgICAgIHJlZmVyZW5jZXM6IDFcbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZGVudGlmaWVycy5wdXNoKGlkZW50aWZpZXIpO1xuICB9XG4gIHJldHVybiBpZGVudGlmaWVycztcbn1cbmZ1bmN0aW9uIGFkZEVsZW1lbnRTdHlsZShvYmosIG9wdGlvbnMpIHtcbiAgdmFyIGFwaSA9IG9wdGlvbnMuZG9tQVBJKG9wdGlvbnMpO1xuICBhcGkudXBkYXRlKG9iaik7XG4gIHZhciB1cGRhdGVyID0gZnVuY3Rpb24gdXBkYXRlcihuZXdPYmopIHtcbiAgICBpZiAobmV3T2JqKSB7XG4gICAgICBpZiAobmV3T2JqLmNzcyA9PT0gb2JqLmNzcyAmJiBuZXdPYmoubWVkaWEgPT09IG9iai5tZWRpYSAmJiBuZXdPYmouc291cmNlTWFwID09PSBvYmouc291cmNlTWFwICYmIG5ld09iai5zdXBwb3J0cyA9PT0gb2JqLnN1cHBvcnRzICYmIG5ld09iai5sYXllciA9PT0gb2JqLmxheWVyKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGFwaS51cGRhdGUob2JqID0gbmV3T2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXBpLnJlbW92ZSgpO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIHVwZGF0ZXI7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChsaXN0LCBvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICBsaXN0ID0gbGlzdCB8fCBbXTtcbiAgdmFyIGxhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKTtcbiAgcmV0dXJuIGZ1bmN0aW9uIHVwZGF0ZShuZXdMaXN0KSB7XG4gICAgbmV3TGlzdCA9IG5ld0xpc3QgfHwgW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBpZGVudGlmaWVyID0gbGFzdElkZW50aWZpZXJzW2ldO1xuICAgICAgdmFyIGluZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcik7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleF0ucmVmZXJlbmNlcy0tO1xuICAgIH1cbiAgICB2YXIgbmV3TGFzdElkZW50aWZpZXJzID0gbW9kdWxlc1RvRG9tKG5ld0xpc3QsIG9wdGlvbnMpO1xuICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICB2YXIgX2lkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbX2ldO1xuICAgICAgdmFyIF9pbmRleCA9IGdldEluZGV4QnlJZGVudGlmaWVyKF9pZGVudGlmaWVyKTtcbiAgICAgIGlmIChzdHlsZXNJbkRPTVtfaW5kZXhdLnJlZmVyZW5jZXMgPT09IDApIHtcbiAgICAgICAgc3R5bGVzSW5ET01bX2luZGV4XS51cGRhdGVyKCk7XG4gICAgICAgIHN0eWxlc0luRE9NLnNwbGljZShfaW5kZXgsIDEpO1xuICAgICAgfVxuICAgIH1cbiAgICBsYXN0SWRlbnRpZmllcnMgPSBuZXdMYXN0SWRlbnRpZmllcnM7XG4gIH07XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgbWVtbyA9IHt9O1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGdldFRhcmdldCh0YXJnZXQpIHtcbiAgaWYgKHR5cGVvZiBtZW1vW3RhcmdldF0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICB2YXIgc3R5bGVUYXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRhcmdldCk7XG5cbiAgICAvLyBTcGVjaWFsIGNhc2UgdG8gcmV0dXJuIGhlYWQgb2YgaWZyYW1lIGluc3RlYWQgb2YgaWZyYW1lIGl0c2VsZlxuICAgIGlmICh3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQgJiYgc3R5bGVUYXJnZXQgaW5zdGFuY2VvZiB3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIFRoaXMgd2lsbCB0aHJvdyBhbiBleGNlcHRpb24gaWYgYWNjZXNzIHRvIGlmcmFtZSBpcyBibG9ja2VkXG4gICAgICAgIC8vIGR1ZSB0byBjcm9zcy1vcmlnaW4gcmVzdHJpY3Rpb25zXG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gc3R5bGVUYXJnZXQuY29udGVudERvY3VtZW50LmhlYWQ7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIGlzdGFuYnVsIGlnbm9yZSBuZXh0XG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gICAgbWVtb1t0YXJnZXRdID0gc3R5bGVUYXJnZXQ7XG4gIH1cbiAgcmV0dXJuIG1lbW9bdGFyZ2V0XTtcbn1cblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBpbnNlcnRCeVNlbGVjdG9yKGluc2VydCwgc3R5bGUpIHtcbiAgdmFyIHRhcmdldCA9IGdldFRhcmdldChpbnNlcnQpO1xuICBpZiAoIXRhcmdldCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIkNvdWxkbid0IGZpbmQgYSBzdHlsZSB0YXJnZXQuIFRoaXMgcHJvYmFibHkgbWVhbnMgdGhhdCB0aGUgdmFsdWUgZm9yIHRoZSAnaW5zZXJ0JyBwYXJhbWV0ZXIgaXMgaW52YWxpZC5cIik7XG4gIH1cbiAgdGFyZ2V0LmFwcGVuZENoaWxkKHN0eWxlKTtcbn1cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0QnlTZWxlY3RvcjsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucykge1xuICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKTtcbiAgb3B0aW9ucy5zZXRBdHRyaWJ1dGVzKGVsZW1lbnQsIG9wdGlvbnMuYXR0cmlidXRlcyk7XG4gIG9wdGlvbnMuaW5zZXJ0KGVsZW1lbnQsIG9wdGlvbnMub3B0aW9ucyk7XG4gIHJldHVybiBlbGVtZW50O1xufVxubW9kdWxlLmV4cG9ydHMgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzKHN0eWxlRWxlbWVudCkge1xuICB2YXIgbm9uY2UgPSB0eXBlb2YgX193ZWJwYWNrX25vbmNlX18gIT09IFwidW5kZWZpbmVkXCIgPyBfX3dlYnBhY2tfbm9uY2VfXyA6IG51bGw7XG4gIGlmIChub25jZSkge1xuICAgIHN0eWxlRWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJub25jZVwiLCBub25jZSk7XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGFwcGx5KHN0eWxlRWxlbWVudCwgb3B0aW9ucywgb2JqKSB7XG4gIHZhciBjc3MgPSBcIlwiO1xuICBpZiAob2JqLnN1cHBvcnRzKSB7XG4gICAgY3NzICs9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQob2JqLnN1cHBvcnRzLCBcIikge1wiKTtcbiAgfVxuICBpZiAob2JqLm1lZGlhKSB7XG4gICAgY3NzICs9IFwiQG1lZGlhIFwiLmNvbmNhdChvYmoubWVkaWEsIFwiIHtcIik7XG4gIH1cbiAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBvYmoubGF5ZXIgIT09IFwidW5kZWZpbmVkXCI7XG4gIGlmIChuZWVkTGF5ZXIpIHtcbiAgICBjc3MgKz0gXCJAbGF5ZXJcIi5jb25jYXQob2JqLmxheWVyLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQob2JqLmxheWVyKSA6IFwiXCIsIFwiIHtcIik7XG4gIH1cbiAgY3NzICs9IG9iai5jc3M7XG4gIGlmIChuZWVkTGF5ZXIpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgaWYgKG9iai5tZWRpYSkge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICBpZiAob2JqLnN1cHBvcnRzKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIHZhciBzb3VyY2VNYXAgPSBvYmouc291cmNlTWFwO1xuICBpZiAoc291cmNlTWFwICYmIHR5cGVvZiBidG9hICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgY3NzICs9IFwiXFxuLyojIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxcIi5jb25jYXQoYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoc291cmNlTWFwKSkpKSwgXCIgKi9cIik7XG4gIH1cblxuICAvLyBGb3Igb2xkIElFXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAgKi9cbiAgb3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybShjc3MsIHN0eWxlRWxlbWVudCwgb3B0aW9ucy5vcHRpb25zKTtcbn1cbmZ1bmN0aW9uIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpIHtcbiAgLy8gaXN0YW5idWwgaWdub3JlIGlmXG4gIGlmIChzdHlsZUVsZW1lbnQucGFyZW50Tm9kZSA9PT0gbnVsbCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBzdHlsZUVsZW1lbnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQpO1xufVxuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGRvbUFQSShvcHRpb25zKSB7XG4gIGlmICh0eXBlb2YgZG9jdW1lbnQgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUoKSB7fSxcbiAgICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge31cbiAgICB9O1xuICB9XG4gIHZhciBzdHlsZUVsZW1lbnQgPSBvcHRpb25zLmluc2VydFN0eWxlRWxlbWVudChvcHRpb25zKTtcbiAgcmV0dXJuIHtcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShvYmopIHtcbiAgICAgIGFwcGx5KHN0eWxlRWxlbWVudCwgb3B0aW9ucywgb2JqKTtcbiAgICB9LFxuICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge1xuICAgICAgcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCk7XG4gICAgfVxuICB9O1xufVxubW9kdWxlLmV4cG9ydHMgPSBkb21BUEk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gc3R5bGVUYWdUcmFuc2Zvcm0oY3NzLCBzdHlsZUVsZW1lbnQpIHtcbiAgaWYgKHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0KSB7XG4gICAgc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzcztcbiAgfSBlbHNlIHtcbiAgICB3aGlsZSAoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpIHtcbiAgICAgIHN0eWxlRWxlbWVudC5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCk7XG4gICAgfVxuICAgIHN0eWxlRWxlbWVudC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpKTtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBzdHlsZVRhZ1RyYW5zZm9ybTsiLCJ2YXIgbWFwID0ge1xuXHRcIi4vYWRtaXJhbC1lZGl0LmpwZ1wiOiBcIi4vc3JjL2Fzc2V0cy9hZG1pcmFsLWVkaXQuanBnXCIsXG5cdFwiLi9zaGlwLWVkaXQuanBnXCI6IFwiLi9zcmMvYXNzZXRzL3NoaXAtZWRpdC5qcGdcIlxufTtcblxuXG5mdW5jdGlvbiB3ZWJwYWNrQ29udGV4dChyZXEpIHtcblx0dmFyIGlkID0gd2VicGFja0NvbnRleHRSZXNvbHZlKHJlcSk7XG5cdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKGlkKTtcbn1cbmZ1bmN0aW9uIHdlYnBhY2tDb250ZXh0UmVzb2x2ZShyZXEpIHtcblx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhtYXAsIHJlcSkpIHtcblx0XHR2YXIgZSA9IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIgKyByZXEgKyBcIidcIik7XG5cdFx0ZS5jb2RlID0gJ01PRFVMRV9OT1RfRk9VTkQnO1xuXHRcdHRocm93IGU7XG5cdH1cblx0cmV0dXJuIG1hcFtyZXFdO1xufVxud2VicGFja0NvbnRleHQua2V5cyA9IGZ1bmN0aW9uIHdlYnBhY2tDb250ZXh0S2V5cygpIHtcblx0cmV0dXJuIE9iamVjdC5rZXlzKG1hcCk7XG59O1xud2VicGFja0NvbnRleHQucmVzb2x2ZSA9IHdlYnBhY2tDb250ZXh0UmVzb2x2ZTtcbm1vZHVsZS5leHBvcnRzID0gd2VicGFja0NvbnRleHQ7XG53ZWJwYWNrQ29udGV4dC5pZCA9IFwiLi9zcmMvYXNzZXRzIHN5bmMgXFxcXC4ocG5nJTdDanBlP2clN0NzdmcpJFwiOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0aWQ6IG1vZHVsZUlkLFxuXHRcdGxvYWRlZDogZmFsc2UsXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuXHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbi8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBfX3dlYnBhY2tfbW9kdWxlc19fO1xuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18uZyA9IChmdW5jdGlvbigpIHtcblx0aWYgKHR5cGVvZiBnbG9iYWxUaGlzID09PSAnb2JqZWN0JykgcmV0dXJuIGdsb2JhbFRoaXM7XG5cdHRyeSB7XG5cdFx0cmV0dXJuIHRoaXMgfHwgbmV3IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5cdH0gY2F0Y2ggKGUpIHtcblx0XHRpZiAodHlwZW9mIHdpbmRvdyA9PT0gJ29iamVjdCcpIHJldHVybiB3aW5kb3c7XG5cdH1cbn0pKCk7IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5obWQgPSAobW9kdWxlKSA9PiB7XG5cdG1vZHVsZSA9IE9iamVjdC5jcmVhdGUobW9kdWxlKTtcblx0aWYgKCFtb2R1bGUuY2hpbGRyZW4pIG1vZHVsZS5jaGlsZHJlbiA9IFtdO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkobW9kdWxlLCAnZXhwb3J0cycsIHtcblx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuXHRcdHNldDogKCkgPT4ge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCdFUyBNb2R1bGVzIG1heSBub3QgYXNzaWduIG1vZHVsZS5leHBvcnRzIG9yIGV4cG9ydHMuKiwgVXNlIEVTTSBleHBvcnQgc3ludGF4LCBpbnN0ZWFkOiAnICsgbW9kdWxlLmlkKTtcblx0XHR9XG5cdH0pO1xuXHRyZXR1cm4gbW9kdWxlO1xufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwidmFyIHNjcmlwdFVybDtcbmlmIChfX3dlYnBhY2tfcmVxdWlyZV9fLmcuaW1wb3J0U2NyaXB0cykgc2NyaXB0VXJsID0gX193ZWJwYWNrX3JlcXVpcmVfXy5nLmxvY2F0aW9uICsgXCJcIjtcbnZhciBkb2N1bWVudCA9IF9fd2VicGFja19yZXF1aXJlX18uZy5kb2N1bWVudDtcbmlmICghc2NyaXB0VXJsICYmIGRvY3VtZW50KSB7XG5cdGlmIChkb2N1bWVudC5jdXJyZW50U2NyaXB0KVxuXHRcdHNjcmlwdFVybCA9IGRvY3VtZW50LmN1cnJlbnRTY3JpcHQuc3JjO1xuXHRpZiAoIXNjcmlwdFVybCkge1xuXHRcdHZhciBzY3JpcHRzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJzY3JpcHRcIik7XG5cdFx0aWYoc2NyaXB0cy5sZW5ndGgpIHtcblx0XHRcdHZhciBpID0gc2NyaXB0cy5sZW5ndGggLSAxO1xuXHRcdFx0d2hpbGUgKGkgPiAtMSAmJiAhc2NyaXB0VXJsKSBzY3JpcHRVcmwgPSBzY3JpcHRzW2ktLV0uc3JjO1xuXHRcdH1cblx0fVxufVxuLy8gV2hlbiBzdXBwb3J0aW5nIGJyb3dzZXJzIHdoZXJlIGFuIGF1dG9tYXRpYyBwdWJsaWNQYXRoIGlzIG5vdCBzdXBwb3J0ZWQgeW91IG11c3Qgc3BlY2lmeSBhbiBvdXRwdXQucHVibGljUGF0aCBtYW51YWxseSB2aWEgY29uZmlndXJhdGlvblxuLy8gb3IgcGFzcyBhbiBlbXB0eSBzdHJpbmcgKFwiXCIpIGFuZCBzZXQgdGhlIF9fd2VicGFja19wdWJsaWNfcGF0aF9fIHZhcmlhYmxlIGZyb20geW91ciBjb2RlIHRvIHVzZSB5b3VyIG93biBsb2dpYy5cbmlmICghc2NyaXB0VXJsKSB0aHJvdyBuZXcgRXJyb3IoXCJBdXRvbWF0aWMgcHVibGljUGF0aCBpcyBub3Qgc3VwcG9ydGVkIGluIHRoaXMgYnJvd3NlclwiKTtcbnNjcmlwdFVybCA9IHNjcmlwdFVybC5yZXBsYWNlKC8jLiokLywgXCJcIikucmVwbGFjZSgvXFw/LiokLywgXCJcIikucmVwbGFjZSgvXFwvW15cXC9dKyQvLCBcIi9cIik7XG5fX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBzY3JpcHRVcmw7IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5iID0gZG9jdW1lbnQuYmFzZVVSSSB8fCBzZWxmLmxvY2F0aW9uLmhyZWY7XG5cbi8vIG9iamVjdCB0byBzdG9yZSBsb2FkZWQgYW5kIGxvYWRpbmcgY2h1bmtzXG4vLyB1bmRlZmluZWQgPSBjaHVuayBub3QgbG9hZGVkLCBudWxsID0gY2h1bmsgcHJlbG9hZGVkL3ByZWZldGNoZWRcbi8vIFtyZXNvbHZlLCByZWplY3QsIFByb21pc2VdID0gY2h1bmsgbG9hZGluZywgMCA9IGNodW5rIGxvYWRlZFxudmFyIGluc3RhbGxlZENodW5rcyA9IHtcblx0XCJpbmRleFwiOiAwXG59O1xuXG4vLyBubyBjaHVuayBvbiBkZW1hbmQgbG9hZGluZ1xuXG4vLyBubyBwcmVmZXRjaGluZ1xuXG4vLyBubyBwcmVsb2FkZWRcblxuLy8gbm8gSE1SXG5cbi8vIG5vIEhNUiBtYW5pZmVzdFxuXG4vLyBubyBvbiBjaHVua3MgbG9hZGVkXG5cbi8vIG5vIGpzb25wIGZ1bmN0aW9uIiwiX193ZWJwYWNrX3JlcXVpcmVfXy5uYyA9IHVuZGVmaW5lZDsiLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGlzIHJlZmVyZW5jZWQgYnkgb3RoZXIgbW9kdWxlcyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9pbmRleC5qc1wiKTtcbiIsIiJdLCJuYW1lcyI6WyJpbXBvcnRBbGxBc3NldHMiLCJpbXBvcnRBbGwiLCJyIiwia2V5cyIsIm1hcCIsImFzc2V0cyIsInJlcXVpcmUiLCJjb250ZXh0IiwiU2hpcCIsImNvbnN0cnVjdG9yIiwibGVuZ3RoIiwibnVtSGl0cyIsInN1bmsiLCJjdXJyZW50TGVuZ3RoIiwiY3VycmVudE51bUhpdHMiLCJzdW5rU3RhdHVzIiwiaGl0IiwiaXNTdW5rIiwiR2FtZWJvYXJkIiwiYm9hcmQiLCJzaGlwcyIsIkNhcnJpZXIiLCJCYXR0bGVzaGlwIiwiRGVzdHJveWVyIiwiU3VibWFyaW5lIiwiY3JlYXRlQm9hcmQiLCJuIiwic3ViQm9hcmQiLCJtIiwicHVzaCIsImdldExlZ2FsTW92ZXMiLCJnZW5lcmF0ZU1vdmVzIiwiZmlyc3RNb3ZlIiwic2hpcE1vdmVzIiwiaW5kZXgiLCJjYXJyaWVyTW92ZXMiLCJiYXR0bGVzaGlwTW92ZXMiLCJkZXN0cm95ZXJNb3ZlcyIsInN1Ym1hcmluZU1vdmVzIiwicGF0cm9sTW92ZXMiLCJsZWdhbE1vdmVzIiwiZGlzcGxhY2VTaGlwcyIsImdlbmVyYXRlUmFuZG9tUm93SW5kZXgiLCJyb3dJbmRleCIsIk1hdGgiLCJmbG9vciIsInJhbmRvbSIsImdldFJhbmRvbU1vdmVJbmRleCIsIm1vdmVzIiwibW92ZUluZGV4IiwidXBkYXRlTGVnYWxNb3Zlc0luQm9hcmQiLCJzaGlwTGVuZ3RoIiwicG9wdWxhdGVkUm93IiwibGFzdE9jY3VwaWVkIiwibGFzdEluZGV4T2YiLCJmaXJzdE9jY3VwaWVkIiwib2NjdXB5IiwiZmlyc3RJbmRleEVtcHR5IiwibGFzdEluZGV4RW1wdHkiLCJmaXJzdFRvcEJvdHRvbSIsImxhc3RUb3BCb3R0b20iLCJpbmRleE9mIiwiYm90dG9tQWRqYWNlbnRSb3ciLCJmaWxsIiwidG9wQWRqYWNlbnRSb3ciLCJpbmNsdWRlcyIsInBvcHVsYXRlQm9hcmQiLCJfd2l0aFNwZWNpZmllZFNoaXAiLCJzaGlwIiwicmFuZG9tUm93SW5kZXgiLCJyYW5kb21TaGlwTW92ZSIsImZpcnN0U2hpcE1vdmUiLCJzaGlwTW92ZUxhc3RJbmRleCIsImxhc3RTaGlwTW92ZSIsImZvckVhY2giLCJyb3ciLCJjb25zb2xlIiwibG9nIiwicmVjZWl2ZUF0dGFjayIsIlhZIiwiZ2VuZXJhdGVLZXlzIiwiYWxwaGFiZXRzIiwiU3RyaW5nIiwiZnJvbUNoYXJDb2RlIiwic3ViS2V5cyIsImxldHRlciIsImFzc2lnbktleXNUb0JvYXJkSW5kaWNlcyIsIktleXNCb3giLCJvY2N1cHlDaG9zZW5TcG90Iiwia2V5SW5kZXgiLCJoaXRFbnRyeSIsInVwZGF0ZVNoaXBMaWZlIiwidXBkYXRlVW50aWxGdWxsIiwidHJhY2tNaXNzZWRBdHRhY2tzIiwiY29vcmRpbmF0ZSIsIm1pc3NlZEF0dGFja3MiLCJ1cGRhdGVTdW5rU3RhdHVzIiwiYWxsU2hpcHNTdW5rIiwiUGxheWVyIiwidXNlciIsInVzZXJCb2FyZCIsImNvbXB1dGVyIiwiY29tcHV0ZXJCb2FyZCIsInVzZXJUdXJuIiwiY29tcHV0ZXJUdXJuIiwiZ2VuZXJhdGVSYW5kb21LZXkiLCJyYW5kb21LZXlJbmRleCIsInJhbmRvbUtleSIsInBpY2tMZWdhbE1vdmUiLCJyZXNwb25zZSIsImlzQWxsRW50cmllc09jY3VwaWVkIiwiZmxhdCIsImV2ZXJ5IiwiZW50cnkiLCJ0cmFuc2l0aW9uSGVhZGVyQ29sb3IiLCJjaGFuZ2VDb2xvciIsInJlZCIsImdyZWVuIiwiYmx1ZSIsImNvbG9yIiwiaGVhZGVyIiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwic3R5bGUiLCJiYWNrZ3JvdW5kIiwic2V0SW50ZXJ2YWwiLCJtb2R1bGUiLCJleHBvcnRzIl0sInNvdXJjZVJvb3QiOiIifQ==