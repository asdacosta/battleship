/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/logic.js":
/*!**********************!*\
  !*** ./src/logic.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Player: () => (/* binding */ Player)
/* harmony export */ });
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
    this.displaceShipsRecursionCount = 0;
    this.ships = {
      Carrier: new Ship(5, 0, false),
      Battleship: new Ship(4, 0, false),
      Destroyer: new Ship(3, 0, false),
      Submarine: new Ship(3, 0, false),
      "Patrol Boat": new Ship(2, 0, false)
    };
  }
  createBoard() {
    this.board = [];
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
    let isReDisplaced = false;
    const generateRandomRowIndex = function () {
      const rowIndex = Math.floor(Math.random() * 10);
      return rowIndex;
    };
    const getRandomMoveIndex = function (moves) {
      const moveIndex = Math.floor(Math.random() * moves);
      return moveIndex;
    };
    const updateLegalMovesInBoard = (rowIndex, shipLength) => {
      const populatedRow = board[rowIndex];
      const lastOccupied = populatedRow.lastIndexOf(shipLength);
      let firstOccupied = null;
      const occupy = (firstIndexEmpty, lastIndexEmpty, firstTopBottom, lastTopBottom) => {
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
      const restartShipDisplacementIfBoardHasAdjacentOccupiedRows = (() => {
        board.forEach((row, rowIndex) => {
          if (rowIndex === 0 || rowIndex === 9 || isReDisplaced) {
            return;
          }

          // Move to next iteration if row is empty
          const rowIsEmpty = row.every(entry => entry === null);
          if (rowIsEmpty) {
            return;
          }

          // Displace for adjacent occupied rows
          const rowIsOccupied = row.every(entry => entry === "O" || entry === null);
          if (rowIsOccupied) {
            const nextRowIsEmpty = board[rowIndex + 1].every(entry => entry === null);
            if (nextRowIsEmpty) {
              return;
            }
            const nextRowIsOccupied = board[rowIndex + 1].every(entry => entry === "O" || entry === null);
            if (nextRowIsOccupied) {
              isReDisplaced = true;
              this.displaceShipsRecursionCount += 1;
              this.displaceShips();
              this.displaceShipsRecursionCount -= 1;
            }
          }
        });
      })();
    };
    if (isReDisplaced) {
      isReDisplaced = false;
      return;
    }
    const populateBoard = (() => {
      // Stop if board's full
      const isBoardFull = board.every(row => row.includes("O"));
      if (isBoardFull) {
        return;
      }
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
              // Stop loop if board is full
              const isBoardFull = board.every(row => row.includes("O"));
              if (isBoardFull) {
                return;
              }
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
    if (this.displaceShipsRecursionCount === 0) {
      return this.board;
    }
  }
  receiveAttack(XY) {
    let hitStatus = "";
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
        hitStatus = "Fail";
        return "Fail";
      } else if (hitEntry === this.ships.Carrier.length || hitEntry === this.ships.Battleship.length || hitEntry === 3.5 || hitEntry === this.ships.Submarine.length || hitEntry === this.ships["Patrol Boat"].length) {
        board[rowIndex][keyIndex] = "X";
        updateShipLife(hitEntry);
        updateSunkStatus(hitEntry);
        allShipsSunk();
        hitStatus = "Success";
        return "Success";
      } else if (hitEntry === "X") {
        hitStatus = "Occupied";
        return "Occupied";
      }
    })();
    return hitStatus;
  }
}
class Player {
  constructor() {
    this.user = new Gameboard();
    this.user.displaceShips();
    this.computer = new Gameboard();
    this.computer.displaceShips();
    this.computerRandomPickCount = 0;
    this.keysUpdate = null;
  }
  userTurn(XY) {
    this.computer.receiveAttack(XY);
  }
  computerTurn() {
    const generateRandomKey = () => {
      const getKeys = function () {
        const alphabets = [];
        const keys = [];
        for (let n = 65; n <= 74; n++) {
          alphabets.push(String.fromCharCode(n));
        }
        for (let m = 1; m <= 10; m++) {
          for (const letter of alphabets) {
            keys.push(`${m}` + letter);
          }
        }
        return keys;
      };
      const assignGeneratedKeysOnce = (() => {
        if (this.keysUpdate === null) {
          this.keysUpdate = getKeys();
        }
      })();
      let randomKey = null;
      const updateKeys = (() => {
        const randomKeyIndex = Math.floor(Math.random() * (100 - this.computerRandomPickCount));
        randomKey = this.keysUpdate[randomKeyIndex];
        this.keysUpdate.splice(randomKeyIndex, 1);
        // Increase count to enable next randomKeyIndex be a legal index
        this.computerRandomPickCount += 1;
      })();
      return randomKey;
    };
    const randomKey = generateRandomKey();
    const pickLegalMove = (() => {
      const board = this.user.board;
      const response = this.user.receiveAttack(randomKey);
    })();
    return randomKey;
  }
}

// module.exports = {
//   Ship,
//   Gameboard,
//   Player,
// };



/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/battleground.css":
/*!********************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/battleground.css ***!
  \********************************************************************/
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



var ___CSS_LOADER_URL_IMPORT_0___ = new URL(/* asset import */ __webpack_require__(/*! ./assets/ship-edit.jpg */ "./src/assets/ship-edit.jpg"), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_1___ = new URL(/* asset import */ __webpack_require__(/*! ./assets/verticalship.jpg */ "./src/assets/verticalship.jpg"), __webpack_require__.b);
var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
var ___CSS_LOADER_URL_REPLACEMENT_0___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_0___);
var ___CSS_LOADER_URL_REPLACEMENT_1___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_1___);
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* body * {
  border: 2px solid burlywood;
} */

body {
  display: grid;
  grid-template: 4fr 1fr / 1fr 1fr;
  gap: 8rem;
  padding: 4rem 8rem;
  margin: 0;
  position: relative;

  font-family: "Raleway", sans-serif;
  font-size: 1.3rem;
  letter-spacing: 0.1rem;
  height: 100vh;
  background-image: url(${___CSS_LOADER_URL_REPLACEMENT_0___});
  background-size: cover;
  background-position: center center;
}

body > section {
  display: grid;
  grid-template: 1fr 1fr 10fr/ 2fr 8fr;
  gap: 0.3rem;
  padding: 0.5rem 7rem 0.5rem 1rem;
  z-index: 1;
}

.config-dialog {
  display: flex;
  flex-direction: column;
  width: 20rem;
  padding: 1rem;
  gap: 1rem;
  background: rgba(34, 100, 175, 0.8);
  border: 0.2rem solid rgb(17, 50, 87);
  border-radius: 2rem;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
  z-index: 2;
}

.config-dialog > div {
  display: flex;
  justify-content: space-between;
}

.config-dialog span {
  align-self: center;
  font-weight: 800;
  color: white;
  background: rgba(248, 71, 47, 0.8);
  margin-left: 0.5rem;
  padding: 0.2rem 0.3rem 0.1rem 0.3rem;
  border-radius: 10rem;
  cursor: pointer;
}

.config-dialog span:hover {
  background: rgb(248, 71, 47);
}

.config-dialog button,
.config-dialog select {
  align-self: center;
  font-size: 1.05rem;
  text-align: center;
  color: white;
  width: 7rem;
  border-radius: 0.5rem;
  cursor: pointer;
  background: rgb(17, 50, 87);
}

.config-dialog button:hover,
.config-dialog select:hover {
  border: 0.1rem solid white;
}

.config-dialog fieldset {
  display: flex;
  justify-content: center;
  gap: 0.2rem;
  padding: 0.2rem;
  border-radius: 0.5rem;
  border-left: 0.2rem solid rgb(17, 50, 87);
  border-right: 0.2rem solid rgb(17, 50, 87);
  background: rgba(17, 50, 87, 0.4);
}

fieldset > button {
  height: 1.5rem;
}

legend {
  font-size: 1.2rem;
  color: white;
  font-weight: 800;
  padding-left: 0.2rem;
  cursor: context-menu;
}

.config-box {
  width: fit-content;
}

.config-box > button {
  font-size: 1.1rem;
  letter-spacing: 0.05rem;
  border-radius: 0.5rem;
  height: 2rem;
  background: linear-gradient(to right, rgba(5, 6, 8, 0.8), rgba(39, 114, 199, 0.8));
  opacity: 0.8;
  cursor: pointer;
  transition:
    background 0.5s ease-out,
    color 0.5s ease-out,
    transform 0.3s ease-in-out;
}

.config-box > button:hover {
  background: rgb(34, 100, 175);
  border: 0.1rem solid white;
  transform: scale(1.05);
}

.config-box svg {
  width: 1.8rem;
}

.config-box > button:active {
  background: rgb(17, 50, 87);
}

h2 {
  grid-row: span 1;
  grid-column: 2 / -1;
  text-align: center;
  font-size: 2rem;
  font-weight: 600;
  padding: 0.25rem 1rem 0 1rem;
  justify-self: center;
  background: rgba(255, 255, 255, 0.4);
  border-top: 0.3rem solid rgb(0, 0, 0);
  border-bottom: 0.3rem solid rgb(0, 0, 0);
  cursor: context-menu;
  transition: transform 0.3s ease-in-out;
}

h2:hover {
  background: rgba(255, 255, 255, 0.6);
  transform: scale(1.1);
}

.head,
.tail {
  display: flex;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 1rem;
  cursor: context-menu;
}

.head {
  align-self: flex-end;
  grid-row: 2 / 3;
  grid-column: 2 / 3;
}

.tail {
  flex-direction: column;
  justify-self: flex-end;
  grid-row: 3 / -1;
}

.head > div,
.tail > div {
  flex: 1 1 auto;
  padding-top: 0.5rem;
  text-align: center;
  font-weight: 600;
  min-width: 2rem;
  min-height: 2rem;
  transition: transform 0.1s ease-in;
}

.head > div:hover,
.tail > div:hover {
  font-weight: 800;
  transform: scale(1.2);
}

.admiral-grounds,
.ai-grounds {
  grid-row: 3 / -1;
  grid-column: 2 / -1;
  display: grid;
  grid-template: repeat(10, 1fr) / repeat(10, 1fr);
  border: 2px solid rgb(255, 255, 255);
  border-radius: 1rem;
  transition: transform 0.25s ease-in-out;
}

.scaleDivs {
  transform: scale(1.02);
}

.admiral-grounds:hover,
.ai-grounds:hover {
  transform: scale(1.02);
}

.admiral-grounds > div,
.ai-grounds > div {
  grid-column: span 1;
  grid-row: span 1;
  min-width: 2rem;
  min-height: 2rem;

  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  font-weight: 800;
  border: 2px solid rgb(255, 255, 255);
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
}

.admiral-grounds span,
.ai-grounds span {
  font-size: 1.7rem;
}

.admiral-grounds > div:hover,
.ai-grounds > div:hover {
  transform: scale(1.1);
}

.admiral-grounds > div:first-child,
.ai-grounds > div:first-child {
  border-top-left-radius: 1rem;
}

.admiral-grounds > div:nth-child(10),
.ai-grounds > div:nth-child(10) {
  border-top-right-radius: 1rem;
}

.admiral-grounds > div:nth-last-child(10),
.ai-grounds > div:nth-last-child(10) {
  border-bottom-left-radius: 1rem;
}

.admiral-grounds > div:nth-last-child(1),
.ai-grounds > div:nth-last-child(1) {
  border-bottom-right-radius: 1rem;
}

body > div:last-child {
  grid-column: 1 / -1;
  align-self: flex-start;
  justify-self: center;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;

  font-weight: 600;
  border: 0.2rem solid rgba(255, 255, 255, 0.8);
  border-radius: 1rem;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  height: 3rem;
  width: 40rem;
  cursor: context-menu;
  z-index: 1;
  transition: transform 0.3s ease-in-out;
}

body > div:last-child:hover {
  transform: scale(1.05);
  border: 0.2rem solid rgb(255, 255, 255);
  background: rgba(0, 0, 0, 0.7);
}

body > div:first-child {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
}

.admiral-grounds img,
.ai-grounds img {
  position: absolute;
  left: 1%;
  bottom: 0.5%;
  pointer-events: none;
}

.config-dialog img {
  align-self: flex-end;
  background: rgba(17, 50, 87, 0.8);
  width: 2rem;
  height: 2rem;
  padding: 0.2rem;
  border-radius: 0.5rem;
  cursor: pointer;
}

.config-dialog img:hover {
  border: 0.1rem solid white;
  background: linear-gradient(to bottom right, rgb(17, 50, 87), rgba(255, 255, 0, 0.4));
}

svg {
  fill: white;
  width: 1.7rem;
}

@media (max-width: 1570px) {
  body {
    gap: 6rem;
    padding: 6rem 6rem;
  }

  body > div:last-child {
    width: 35rem;
  }
  .admiral-grounds,
  .ai-grounds {
    align-self: flex-start;
  }
  .tail,
  .head {
    font-size: 1.1rem;
  }
  .tail {
    align-self: flex-start;
  }
  .head > div,
  .tail > div {
    padding-top: 0.2rem;
  }
}

@media (max-width: 1270px) {
  body {
    gap: 3rem;
    padding: 8rem 4rem;
  }

  body > div:last-child {
    width: 30rem;
    align-self: center;
  }

  body > section {
    padding: 0.5rem 5rem 0.5rem 0.5rem;
  }

  .admiral-grounds span,
  .ai-grounds span {
    font-size: 1.2rem;
  }
}

@media (max-width: 1110px) {
  body {
    gap: 1rem;
    padding: 8rem 1rem;
    height: 100%;
  }

  body > section {
    padding: 0.5rem 3rem 0.5rem 0.5rem;
  }

  h2 {
    font-size: 1.5rem;
  }

  body > div:last-child {
    width: 28rem;
    font-size: 1rem;
  }
}

@media (max-width: 900px) {
  body {
    gap: 0.3rem;
    padding: 8rem 0.2rem;
    background-image: url(${___CSS_LOADER_URL_REPLACEMENT_1___});
  }

  body > section {
    padding: 0.5rem;
  }

  body > div:last-child {
    width: 25rem;
    align-self: flex-start;
  }

  .config-dialog {
    background: rgba(46, 46, 46, 0.8);
    border: 0.2rem solid rgb(143, 109, 61);
  }

  .config-dialog button,
  .config-dialog select {
    background: rgb(143, 109, 61);
  }

  .config-dialog fieldset {
    background: rgba(95, 73, 43, 0.4);
    border-left: 0.2rem solid rgb(143, 109, 61);
    border-right: 0.2rem solid rgb(143, 109, 61);
  }

  .config-box > button {
    background: linear-gradient(to right, rgba(5, 6, 8, 0.8), rgba(221, 166, 88, 0.8));
  }

  .config-box > button:hover {
    background: rgb(185, 139, 74);
  }

  .config-dialog img {
    background: rgba(95, 73, 43, 0.6);
  }

  .config-dialog img:hover {
    background: linear-gradient(to bottom right, rgb(48, 37, 22), rgba(255, 255, 0, 0.5));
  }
}

@media (max-width: 765px) {
  body {
    grid-template: repeat(2, 4fr) 1fr / 1fr;
    padding: 0;
  }

  body > section {
    grid-template: 1fr 1fr 10fr/ 1fr 8fr;
    padding-right: 1.5rem;
    height: 27rem;
  }
}

@media (max-width: 420px) {
  .config-dialog {
    left: 53%;
  }
}

@media (max-width: 390px) {
  .config-dialog {
    left: 57%;
  }
}

@media (max-width: 290px) {
  .config-dialog {
    left: 78%;
  }
}
`, "",{"version":3,"sources":["webpack://./src/battleground.css"],"names":[],"mappings":"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","sourcesContent":["/* body * {\n  border: 2px solid burlywood;\n} */\n\nbody {\n  display: grid;\n  grid-template: 4fr 1fr / 1fr 1fr;\n  gap: 8rem;\n  padding: 4rem 8rem;\n  margin: 0;\n  position: relative;\n\n  font-family: \"Raleway\", sans-serif;\n  font-size: 1.3rem;\n  letter-spacing: 0.1rem;\n  height: 100vh;\n  background-image: url(./assets/ship-edit.jpg);\n  background-size: cover;\n  background-position: center center;\n}\n\nbody > section {\n  display: grid;\n  grid-template: 1fr 1fr 10fr/ 2fr 8fr;\n  gap: 0.3rem;\n  padding: 0.5rem 7rem 0.5rem 1rem;\n  z-index: 1;\n}\n\n.config-dialog {\n  display: flex;\n  flex-direction: column;\n  width: 20rem;\n  padding: 1rem;\n  gap: 1rem;\n  background: rgba(34, 100, 175, 0.8);\n  border: 0.2rem solid rgb(17, 50, 87);\n  border-radius: 2rem;\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  visibility: hidden;\n  opacity: 0;\n  transition: opacity 0.3s ease-in-out;\n  z-index: 2;\n}\n\n.config-dialog > div {\n  display: flex;\n  justify-content: space-between;\n}\n\n.config-dialog span {\n  align-self: center;\n  font-weight: 800;\n  color: white;\n  background: rgba(248, 71, 47, 0.8);\n  margin-left: 0.5rem;\n  padding: 0.2rem 0.3rem 0.1rem 0.3rem;\n  border-radius: 10rem;\n  cursor: pointer;\n}\n\n.config-dialog span:hover {\n  background: rgb(248, 71, 47);\n}\n\n.config-dialog button,\n.config-dialog select {\n  align-self: center;\n  font-size: 1.05rem;\n  text-align: center;\n  color: white;\n  width: 7rem;\n  border-radius: 0.5rem;\n  cursor: pointer;\n  background: rgb(17, 50, 87);\n}\n\n.config-dialog button:hover,\n.config-dialog select:hover {\n  border: 0.1rem solid white;\n}\n\n.config-dialog fieldset {\n  display: flex;\n  justify-content: center;\n  gap: 0.2rem;\n  padding: 0.2rem;\n  border-radius: 0.5rem;\n  border-left: 0.2rem solid rgb(17, 50, 87);\n  border-right: 0.2rem solid rgb(17, 50, 87);\n  background: rgba(17, 50, 87, 0.4);\n}\n\nfieldset > button {\n  height: 1.5rem;\n}\n\nlegend {\n  font-size: 1.2rem;\n  color: white;\n  font-weight: 800;\n  padding-left: 0.2rem;\n  cursor: context-menu;\n}\n\n.config-box {\n  width: fit-content;\n}\n\n.config-box > button {\n  font-size: 1.1rem;\n  letter-spacing: 0.05rem;\n  border-radius: 0.5rem;\n  height: 2rem;\n  background: linear-gradient(to right, rgba(5, 6, 8, 0.8), rgba(39, 114, 199, 0.8));\n  opacity: 0.8;\n  cursor: pointer;\n  transition:\n    background 0.5s ease-out,\n    color 0.5s ease-out,\n    transform 0.3s ease-in-out;\n}\n\n.config-box > button:hover {\n  background: rgb(34, 100, 175);\n  border: 0.1rem solid white;\n  transform: scale(1.05);\n}\n\n.config-box svg {\n  width: 1.8rem;\n}\n\n.config-box > button:active {\n  background: rgb(17, 50, 87);\n}\n\nh2 {\n  grid-row: span 1;\n  grid-column: 2 / -1;\n  text-align: center;\n  font-size: 2rem;\n  font-weight: 600;\n  padding: 0.25rem 1rem 0 1rem;\n  justify-self: center;\n  background: rgba(255, 255, 255, 0.4);\n  border-top: 0.3rem solid rgb(0, 0, 0);\n  border-bottom: 0.3rem solid rgb(0, 0, 0);\n  cursor: context-menu;\n  transition: transform 0.3s ease-in-out;\n}\n\nh2:hover {\n  background: rgba(255, 255, 255, 0.6);\n  transform: scale(1.1);\n}\n\n.head,\n.tail {\n  display: flex;\n  background: rgba(255, 255, 255, 0.4);\n  border-radius: 1rem;\n  cursor: context-menu;\n}\n\n.head {\n  align-self: flex-end;\n  grid-row: 2 / 3;\n  grid-column: 2 / 3;\n}\n\n.tail {\n  flex-direction: column;\n  justify-self: flex-end;\n  grid-row: 3 / -1;\n}\n\n.head > div,\n.tail > div {\n  flex: 1 1 auto;\n  padding-top: 0.5rem;\n  text-align: center;\n  font-weight: 600;\n  min-width: 2rem;\n  min-height: 2rem;\n  transition: transform 0.1s ease-in;\n}\n\n.head > div:hover,\n.tail > div:hover {\n  font-weight: 800;\n  transform: scale(1.2);\n}\n\n.admiral-grounds,\n.ai-grounds {\n  grid-row: 3 / -1;\n  grid-column: 2 / -1;\n  display: grid;\n  grid-template: repeat(10, 1fr) / repeat(10, 1fr);\n  border: 2px solid rgb(255, 255, 255);\n  border-radius: 1rem;\n  transition: transform 0.25s ease-in-out;\n}\n\n.scaleDivs {\n  transform: scale(1.02);\n}\n\n.admiral-grounds:hover,\n.ai-grounds:hover {\n  transform: scale(1.02);\n}\n\n.admiral-grounds > div,\n.ai-grounds > div {\n  grid-column: span 1;\n  grid-row: span 1;\n  min-width: 2rem;\n  min-height: 2rem;\n\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  position: relative;\n  font-weight: 800;\n  border: 2px solid rgb(255, 255, 255);\n  cursor: pointer;\n  transition: transform 0.2s ease-in-out;\n}\n\n.admiral-grounds span,\n.ai-grounds span {\n  font-size: 1.7rem;\n}\n\n.admiral-grounds > div:hover,\n.ai-grounds > div:hover {\n  transform: scale(1.1);\n}\n\n.admiral-grounds > div:first-child,\n.ai-grounds > div:first-child {\n  border-top-left-radius: 1rem;\n}\n\n.admiral-grounds > div:nth-child(10),\n.ai-grounds > div:nth-child(10) {\n  border-top-right-radius: 1rem;\n}\n\n.admiral-grounds > div:nth-last-child(10),\n.ai-grounds > div:nth-last-child(10) {\n  border-bottom-left-radius: 1rem;\n}\n\n.admiral-grounds > div:nth-last-child(1),\n.ai-grounds > div:nth-last-child(1) {\n  border-bottom-right-radius: 1rem;\n}\n\nbody > div:last-child {\n  grid-column: 1 / -1;\n  align-self: flex-start;\n  justify-self: center;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  text-align: center;\n\n  font-weight: 600;\n  border: 0.2rem solid rgba(255, 255, 255, 0.8);\n  border-radius: 1rem;\n  background: rgba(0, 0, 0, 0.5);\n  color: white;\n  height: 3rem;\n  width: 40rem;\n  cursor: context-menu;\n  z-index: 1;\n  transition: transform 0.3s ease-in-out;\n}\n\nbody > div:last-child:hover {\n  transform: scale(1.05);\n  border: 0.2rem solid rgb(255, 255, 255);\n  background: rgba(0, 0, 0, 0.7);\n}\n\nbody > div:first-child {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  background: rgba(0, 0, 0, 0.6);\n}\n\n.admiral-grounds img,\n.ai-grounds img {\n  position: absolute;\n  left: 1%;\n  bottom: 0.5%;\n  pointer-events: none;\n}\n\n.config-dialog img {\n  align-self: flex-end;\n  background: rgba(17, 50, 87, 0.8);\n  width: 2rem;\n  height: 2rem;\n  padding: 0.2rem;\n  border-radius: 0.5rem;\n  cursor: pointer;\n}\n\n.config-dialog img:hover {\n  border: 0.1rem solid white;\n  background: linear-gradient(to bottom right, rgb(17, 50, 87), rgba(255, 255, 0, 0.4));\n}\n\nsvg {\n  fill: white;\n  width: 1.7rem;\n}\n\n@media (max-width: 1570px) {\n  body {\n    gap: 6rem;\n    padding: 6rem 6rem;\n  }\n\n  body > div:last-child {\n    width: 35rem;\n  }\n  .admiral-grounds,\n  .ai-grounds {\n    align-self: flex-start;\n  }\n  .tail,\n  .head {\n    font-size: 1.1rem;\n  }\n  .tail {\n    align-self: flex-start;\n  }\n  .head > div,\n  .tail > div {\n    padding-top: 0.2rem;\n  }\n}\n\n@media (max-width: 1270px) {\n  body {\n    gap: 3rem;\n    padding: 8rem 4rem;\n  }\n\n  body > div:last-child {\n    width: 30rem;\n    align-self: center;\n  }\n\n  body > section {\n    padding: 0.5rem 5rem 0.5rem 0.5rem;\n  }\n\n  .admiral-grounds span,\n  .ai-grounds span {\n    font-size: 1.2rem;\n  }\n}\n\n@media (max-width: 1110px) {\n  body {\n    gap: 1rem;\n    padding: 8rem 1rem;\n    height: 100%;\n  }\n\n  body > section {\n    padding: 0.5rem 3rem 0.5rem 0.5rem;\n  }\n\n  h2 {\n    font-size: 1.5rem;\n  }\n\n  body > div:last-child {\n    width: 28rem;\n    font-size: 1rem;\n  }\n}\n\n@media (max-width: 900px) {\n  body {\n    gap: 0.3rem;\n    padding: 8rem 0.2rem;\n    background-image: url(./assets/verticalship.jpg);\n  }\n\n  body > section {\n    padding: 0.5rem;\n  }\n\n  body > div:last-child {\n    width: 25rem;\n    align-self: flex-start;\n  }\n\n  .config-dialog {\n    background: rgba(46, 46, 46, 0.8);\n    border: 0.2rem solid rgb(143, 109, 61);\n  }\n\n  .config-dialog button,\n  .config-dialog select {\n    background: rgb(143, 109, 61);\n  }\n\n  .config-dialog fieldset {\n    background: rgba(95, 73, 43, 0.4);\n    border-left: 0.2rem solid rgb(143, 109, 61);\n    border-right: 0.2rem solid rgb(143, 109, 61);\n  }\n\n  .config-box > button {\n    background: linear-gradient(to right, rgba(5, 6, 8, 0.8), rgba(221, 166, 88, 0.8));\n  }\n\n  .config-box > button:hover {\n    background: rgb(185, 139, 74);\n  }\n\n  .config-dialog img {\n    background: rgba(95, 73, 43, 0.6);\n  }\n\n  .config-dialog img:hover {\n    background: linear-gradient(to bottom right, rgb(48, 37, 22), rgba(255, 255, 0, 0.5));\n  }\n}\n\n@media (max-width: 765px) {\n  body {\n    grid-template: repeat(2, 4fr) 1fr / 1fr;\n    padding: 0;\n  }\n\n  body > section {\n    grid-template: 1fr 1fr 10fr/ 1fr 8fr;\n    padding-right: 1.5rem;\n    height: 27rem;\n  }\n}\n\n@media (max-width: 420px) {\n  .config-dialog {\n    left: 53%;\n  }\n}\n\n@media (max-width: 390px) {\n  .config-dialog {\n    left: 57%;\n  }\n}\n\n@media (max-width: 290px) {\n  .config-dialog {\n    left: 78%;\n  }\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


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

/***/ "./src/battleground.css":
/*!******************************!*\
  !*** ./src/battleground.css ***!
  \******************************/
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
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_battleground_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../node_modules/css-loader/dist/cjs.js!./battleground.css */ "./node_modules/css-loader/dist/cjs.js!./src/battleground.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_battleground_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_battleground_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_battleground_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_battleground_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


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
	"./battleship.png": "./src/assets/battleship.png",
	"./carrier.png": "./src/assets/carrier.png",
	"./carrier2.png": "./src/assets/carrier2.png",
	"./destroyer.png": "./src/assets/destroyer.png",
	"./lamp.png": "./src/assets/lamp.png",
	"./patrol-boat.png": "./src/assets/patrol-boat.png",
	"./ship-edit.jpg": "./src/assets/ship-edit.jpg",
	"./submarine.png": "./src/assets/submarine.png",
	"./verticalship.jpg": "./src/assets/verticalship.jpg"
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

/***/ "./src/assets/battleship.png":
/*!***********************************!*\
  !*** ./src/assets/battleship.png ***!
  \***********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "assets/battleship.png";

/***/ }),

/***/ "./src/assets/carrier.png":
/*!********************************!*\
  !*** ./src/assets/carrier.png ***!
  \********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "assets/carrier.png";

/***/ }),

/***/ "./src/assets/carrier2.png":
/*!*********************************!*\
  !*** ./src/assets/carrier2.png ***!
  \*********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "assets/carrier2.png";

/***/ }),

/***/ "./src/assets/destroyer.png":
/*!**********************************!*\
  !*** ./src/assets/destroyer.png ***!
  \**********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "assets/destroyer.png";

/***/ }),

/***/ "./src/assets/lamp.png":
/*!*****************************!*\
  !*** ./src/assets/lamp.png ***!
  \*****************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "assets/lamp.png";

/***/ }),

/***/ "./src/assets/patrol-boat.png":
/*!************************************!*\
  !*** ./src/assets/patrol-boat.png ***!
  \************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "assets/patrol-boat.png";

/***/ }),

/***/ "./src/assets/ship-edit.jpg":
/*!**********************************!*\
  !*** ./src/assets/ship-edit.jpg ***!
  \**********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "assets/ship-edit.jpg";

/***/ }),

/***/ "./src/assets/submarine.png":
/*!**********************************!*\
  !*** ./src/assets/submarine.png ***!
  \**********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "assets/submarine.png";

/***/ }),

/***/ "./src/assets/verticalship.jpg":
/*!*************************************!*\
  !*** ./src/assets/verticalship.jpg ***!
  \*************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "assets/verticalship.jpg";

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
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
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
/******/ 			"battleground": 0
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
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!*****************************!*\
  !*** ./src/battleground.js ***!
  \*****************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _reset_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./reset.css */ "./src/reset.css");
/* harmony import */ var _battleground_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./battleground.css */ "./src/battleground.css");
/* harmony import */ var _logic__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./logic */ "./src/logic.js");



const importAllAssets = function () {
  function importAll(r) {
    return r.keys().map(r);
  }
  const assets = importAll(__webpack_require__("./src/assets sync \\.(png%7Cjpe?g%7Csvg)$"));
}();
const getNodes = function () {
  const admiralHeadDivs = document.querySelectorAll("body > section:nth-child(3) .head > div");
  const admiralTailDivs = document.querySelectorAll("body > section:nth-child(3) .tail > div");
  const aiHeadDivs = document.querySelectorAll("body > section:nth-child(4) .head > div");
  const aiTailDivs = document.querySelectorAll("body > section:nth-child(4) .tail > div");
  const admiralGroundsDivs = document.querySelectorAll(".admiral-grounds > div");
  const aiGroundsDivs = document.querySelectorAll(".ai-grounds > div");
  const headers = document.querySelectorAll("h2");
  const admiralGrounds = document.querySelector(".admiral-grounds");
  const aiGrounds = document.querySelector(".ai-grounds");
  const admiralName = document.querySelector(".admiral-name");
  const feedback = document.querySelector("body > div:last-child");
  const configButton = document.querySelector(".config-box > button");
  const configDialog = document.querySelector(".config-dialog");
  const configButtonIcon = document.querySelector(".config-box svg");
  const cover = document.querySelector("body > div:first-child");
  const closeDialog = document.querySelector(".config-dialog span");
  const kickStartButton = document.querySelector(".kick-start");
  const shuffleButton = document.querySelector(".shuffle");
  const peekButton = document.querySelector(".peek");
  const realignButton = document.querySelector(".realign");
  const alignedButton = document.querySelector(".aligned");
  const difficultyOptions = document.querySelector("#difficulty");
  const dimensionOptions = document.querySelector("#dimension");
  return {
    admiralHeadDivs,
    admiralTailDivs,
    aiHeadDivs,
    aiTailDivs,
    admiralGroundsDivs,
    aiGroundsDivs,
    headers,
    admiralGrounds,
    aiGrounds,
    admiralName,
    feedback,
    configButton,
    configDialog,
    cover,
    closeDialog,
    kickStartButton,
    shuffleButton,
    peekButton,
    difficultyOptions,
    dimensionOptions,
    realignButton,
    alignedButton,
    configButtonIcon
  };
}();
const displayHeadAndTailHoveringEffect = function () {
  const addHoverToHead = function (headDivs, groundDivs) {
    headDivs.forEach((div, index) => {
      div.addEventListener("mouseover", () => {
        for (let m = 0; m < 10; m++) {
          groundDivs[10 * m + index].style.border = "2px solid rgba(255, 255, 255, 0.4)";
        }
      });
      div.addEventListener("mouseout", () => {
        for (let m = 0; m < 10; m++) {
          groundDivs[10 * m + index].style.border = "2px solid rgb(255, 255, 255)";
        }
      });
    });
  };
  const addHoverToTail = function (tailDivs, groundDivs) {
    tailDivs.forEach((div, index) => {
      div.addEventListener("mouseover", () => {
        for (let n = 0; n < 10; n++) {
          groundDivs[n + index * 10].style.border = "2px solid rgba(255, 255, 255, 0.4)";
        }
      });
      div.addEventListener("mouseout", () => {
        for (let n = 0; n < 10; n++) {
          groundDivs[n + index * 10].style.border = "2px solid rgb(255, 255, 255)";
        }
      });
    });
  };
  addHoverToHead(getNodes.admiralHeadDivs, getNodes.admiralGroundsDivs);
  addHoverToTail(getNodes.admiralTailDivs, getNodes.admiralGroundsDivs);
  addHoverToHead(getNodes.aiHeadDivs, getNodes.aiGroundsDivs);
  addHoverToTail(getNodes.aiTailDivs, getNodes.aiGroundsDivs);
  const addHoverToHeaders = function (header, grounds) {
    header.addEventListener("mouseover", () => {
      grounds.classList.add("scaleDivs");
    });
    header.addEventListener("mouseout", () => {
      grounds.classList.remove("scaleDivs");
    });
  };
  addHoverToHeaders(getNodes.headers[0], getNodes.admiralGrounds);
  addHoverToHeaders(getNodes.headers[1], getNodes.aiGrounds);
}();
const retrieveAdmiralNameFromStorageAndSet = function () {
  const admiralName = localStorage.getItem("admiralName");
  if (admiralName) {
    getNodes.admiralName.textContent = "⚓ " + admiralName;
    return {
      admiralName
    };
  }
}();
const populateBoards = function () {
  const game = new _logic__WEBPACK_IMPORTED_MODULE_2__.Player();
  const userBoard = game.user.board.flat();
  const computerBoard = game.computer.board.flat();
  const getRandomColor = function () {
    const red = Math.floor(Math.random() * (257 - 100) + 50);
    const green = Math.floor(Math.random() * (257 - 100) + 50);
    const blue = Math.floor(Math.random() * (257 - 100) + 50);
    const color = `rgb(${red}, ${green}, ${blue})`;
    return color;
  };
  const randomColors = [getRandomColor(), getRandomColor(), getRandomColor(), getRandomColor(), getRandomColor()];
  const setRandomColors = function (element, ship) {
    switch (ship) {
      case 5:
        element.style.backgroundColor = randomColors[0];
        break;
      case 4:
        element.style.backgroundColor = randomColors[1];
        break;
      case 3.5:
        element.style.backgroundColor = randomColors[2];
        break;
      case 3:
        element.style.backgroundColor = randomColors[3];
        break;
      case 2:
        element.style.backgroundColor = randomColors[4];
        break;
    }
  };
  const setClasses = function () {
    const setClass = function (element, ship) {
      switch (ship) {
        case 5:
          element.setAttribute("data-ship", "5");
          break;
        case 4:
          element.setAttribute("data-ship", "4");
          break;
        case 3.5:
          element.setAttribute("data-ship", "3.5");
          break;
        case 3:
          element.setAttribute("data-ship", "3");
          break;
        case 2:
          element.setAttribute("data-ship", "2");
          break;
      }
    };
    getNodes.admiralGroundsDivs.forEach((div, divIndex) => {
      userBoard.forEach((entry, entryIndex) => {
        if (divIndex === entryIndex) {
          if (entry !== null && entry !== "O") {
            setClass(div, entry);
          }
        }
      });
    });
    getNodes.aiGroundsDivs.forEach((div, divIndex) => {
      computerBoard.forEach((entry, entryIndex) => {
        if (divIndex === entryIndex) {
          if (entry !== null && entry !== "O") {
            setClass(div, entry);
          }
        }
      });
    });
  }();
  const populateWithSpatialShips = function () {
    const setSpatialDimension = function (grounds) {
      const appendShipImg = function (shipSrc, shipLength, shipType) {
        for (const div of grounds) {
          if (div.dataset.ship === shipType) {
            const shipImg = document.createElement("img");
            shipImg.setAttribute("src", `${shipSrc}`);
            const updateImgSize = function () {
              const width = div.getBoundingClientRect().width * shipLength;
              const height = div.getBoundingClientRect().height;
              shipImg.style.width = `${width - 5}px`;
              shipImg.style.height = `${height - 2}px`;
            };
            updateImgSize();
            window.addEventListener("resize", updateImgSize);
            const removeScaling = function () {
              div.style.transform = "scale(1)";
            }();
            div.appendChild(shipImg);
            return;
          }
        }
      };
      appendShipImg("./assets/carrier.png", 5, "5");
      appendShipImg("./assets/battleship.png", 4, "4");
      appendShipImg("./assets/destroyer.png", 3, "3.5");
      appendShipImg("./assets/submarine.png", 3, "3");
      appendShipImg("./assets/patrol-boat.png", 2, "2");
    };
    setSpatialDimension(getNodes.admiralGroundsDivs);
    const setSpatialDimensionForAiAndHide = function () {
      setSpatialDimension(getNodes.aiGroundsDivs);
      getNodes.aiGroundsDivs.forEach(div => {
        if (div.querySelector("img")) {
          div.querySelector("img").style.display = "none";
        }
      });
    }();
    const peekAiBoard = function () {
      getNodes.peekButton.addEventListener("click", () => {
        if (getNodes.dimensionOptions.value === "simple") {
          return;
        }
        const exitDialog = async function () {
          getNodes.cover.style.zIndex = "0";
          getNodes.configDialog.style.opacity = "0";
          getNodes.configDialog.style.transition = "opacity 0.5s ease-in-out";
          await new Promise(resolve => {
            setTimeout(() => {
              getNodes.configDialog.style.visibility = "hidden";
            }, 400);
          });
        }();

        // Show ships
        getNodes.aiGroundsDivs.forEach(div => {
          if (div.querySelector("img")) {
            div.querySelector("img").style.display = "inline";
          }
        });
        const hideAiBoard = async function () {
          await new Promise(resolve => {
            setTimeout(() => {
              getNodes.aiGroundsDivs.forEach(div => {
                if (div.querySelector("img")) {
                  div.querySelector("img").style.display = "none";
                }
              });
            }, 1000);
          });
        }();
      });
    }();
  };
  populateWithSpatialShips();
  const populateWithColor = function () {
    const populateUserBoard = function () {
      getNodes.admiralGroundsDivs.forEach((div, divIndex) => {
        userBoard.forEach((entry, entryIndex) => {
          if (divIndex === entryIndex) {
            if (entry !== null && entry !== "O") {
              setRandomColors(div, entry);
            }
          }
        });
      });
    }();
    const populateAiBoard = function () {
      getNodes.aiGroundsDivs.forEach((div, divIndex) => {
        computerBoard.forEach((entry, entryIndex) => {
          if (divIndex === entryIndex) {
            if (entry !== null && entry !== "O") {
              const peekAiBoard = function () {
                getNodes.peekButton.addEventListener("click", () => {
                  if (getNodes.dimensionOptions.value === "spatial") {
                    return;
                  }
                  const exitDialog = async function () {
                    getNodes.cover.style.zIndex = "0";
                    getNodes.configDialog.style.opacity = "0";
                    getNodes.configDialog.style.transition = "opacity 0.5s ease-in-out";
                    await new Promise(resolve => {
                      setTimeout(() => {
                        getNodes.configDialog.style.visibility = "hidden";
                      }, 400);
                    });
                  }();

                  // Show colors
                  setRandomColors(div, entry);
                  const hideAiBoard = async function () {
                    await new Promise(resolve => {
                      setTimeout(() => {
                        getNodes.aiGroundsDivs.forEach(div => {
                          div.style.backgroundColor = "initial";
                        });
                      }, 1000);
                    });
                  }();
                });
              }();
            }
          }
        });
      });
    }();
  };
  const populateWithDimensionChange = function () {
    getNodes.dimensionOptions.addEventListener("change", event => {
      if (event.target.value === "simple") {
        const inactivateAlignedButton = function () {
          getNodes.alignedButton.style.pointerEvents = "none";
          getNodes.alignedButton.style.color = "rgba(255, 255, 255, 0.6)";
        }();
        const inactivateRealignButton = function () {
          getNodes.realignButton.style.pointerEvents = "none";
          getNodes.realignButton.style.color = "rgba(255, 255, 255, 0.6)";
        }();
        const clearSpatialShips = function () {
          getNodes.admiralGroundsDivs.forEach(div => {
            if (div.querySelector("img")) {
              div.querySelector("img").style.display = "none";
            }
          });
          getNodes.aiGroundsDivs.forEach(div => {
            if (div.querySelector("img")) {
              div.querySelector("img").style.display = "none";
            }
          });
        }();
        populateWithColor();
      }
      if (event.target.value === "spatial") {
        const activateRealignButton = function () {
          getNodes.realignButton.style.pointerEvents = "auto";
          getNodes.realignButton.style.color = "rgb(255, 255, 255)";
        }();
        const clearColors = function () {
          getNodes.admiralGroundsDivs.forEach(div => {
            div.style.backgroundColor = "initial";
          });
          getNodes.aiGroundsDivs.forEach(div => {
            div.style.backgroundColor = "initial";
          });
        }();
        const bringBackSpatialShips = function () {
          getNodes.admiralGroundsDivs.forEach(div => {
            if (div.querySelector("img")) {
              div.querySelector("img").style.display = "inline";
            }
          });
        }();
      }
    });
  }();
  const populateAiBoardWhenGameOver = function () {
    getNodes.aiGroundsDivs.forEach((div, divIndex) => {
      computerBoard.forEach((entry, entryIndex) => {
        if (divIndex === entryIndex) {
          if (getNodes.dimensionOptions.value === "simple") {
            setRandomColors(div, entry);
          }
          if (getNodes.dimensionOptions.value === "spatial") {
            if (div.querySelector("img")) {
              div.querySelector("img").style.display = "inline";
            }
          }
        }
      });
    });
  };
  return {
    game,
    populateAiBoardWhenGameOver
  };
}();
const displayTarget = function () {
  const __forEachGrounds = function (grounds) {
    grounds.forEach(div => {
      const targetSpan = document.createElement("span");
      targetSpan.textContent = "💢";
      targetSpan.style.zIndex = "1";
      targetSpan.style.display = "none";
      div.appendChild(targetSpan);
      div.addEventListener("mouseover", () => {
        targetSpan.style.display = "inline";
        targetSpan.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
      });
      div.addEventListener("mouseout", () => {
        if (div.textContent !== "X" && div.textContent !== "💥") {
          targetSpan.style.display = "none";
        }
        targetSpan.style.backgroundColor = "initial";
      });
    });
  };
  __forEachGrounds(getNodes.admiralGroundsDivs);
  __forEachGrounds(getNodes.aiGroundsDivs);
}();
const setDefaultAttributesInCoordinates = function () {
  const setCoordinatesToUnAttacked = function () {
    getNodes.aiGroundsDivs.forEach(div => {
      div.setAttribute("data-attacked", "No");
    });
    getNodes.admiralGroundsDivs.forEach(div => {
      div.setAttribute("data-attacked", "No");
    });
  }();
  const addIndexToCoordinates = function () {
    let index = 1;
    let alpIndex = 0;
    const alps = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
    getNodes.aiGroundsDivs.forEach((div, divIndex) => {
      if (divIndex === 10 * index) {
        index += 1;
        alpIndex = 0;
      }
      div.setAttribute("data-index", `${index}${alps[alpIndex]}`);
      alpIndex += 1;
    });
    index = 1;
    alpIndex = 0;
    getNodes.admiralGroundsDivs.forEach((div, divIndex) => {
      if (divIndex === 10 * index) {
        index += 1;
        alpIndex = 0;
      }
      div.setAttribute("data-index", `${index}${alps[alpIndex]}`);
      alpIndex += 1;
    });
  }();
}();
const loopGame = function () {
  const game = populateBoards.game;
  let gameOver = false;
  const getDifficulty = function () {
    let difficulty = localStorage.getItem("difficulty");
    if (!difficulty) {
      difficulty = "normal";
    } else {
      if (difficulty === "impossible") {
        getNodes.difficultyOptions.options[0].removeAttribute("selected");
        getNodes.difficultyOptions.options[1].removeAttribute("selected");
        getNodes.difficultyOptions.options[2].setAttribute("selected", true);
        getNodes.feedback.textContent = "Don't miss!";
      }
      if (difficulty === "normal") {
        getNodes.difficultyOptions.options[0].removeAttribute("selected");
        getNodes.difficultyOptions.options[1].setAttribute("selected", true);
        getNodes.difficultyOptions.options[2].removeAttribute("selected");
        getNodes.feedback.textContent = "Initiate attack!";
      }
      if (difficulty === "dummy") {
        getNodes.difficultyOptions.options[0].setAttribute("selected", true);
        getNodes.difficultyOptions.options[1].removeAttribute("selected");
        getNodes.difficultyOptions.options[2].removeAttribute("selected");
        getNodes.feedback.textContent = "Initiate attack!";
      }
    }
    return {
      difficulty
    };
  }();
  const displayAttack = function (spot, inputValue, fontColor) {
    const span = spot.querySelector("span");
    span.style.display = "inline";
    span.textContent = inputValue;
    span.style.zIndex = "1";
    spot.style.color = fontColor;
    spot.style.pointerEvents = "none";
    spot.style.zIndex = "1";
    spot.setAttribute("data-attacked", "Yes");
  };
  const setFeedback = function (aiOrUser, missedOrHit, shipDataset) {
    const getFeedbackMessage = function (aiOrUser2) {
      let feedbackMessage = "";
      let victim = null;
      if (aiOrUser2 === "ai") {
        victim = game.user;
      } else if (aiOrUser2 === "user") {
        victim = game.computer;
      }
      switch (shipDataset) {
        case "5":
          feedbackMessage = "Hit the Carrier 🎯";
          if (victim.ships.Carrier.currentNumHits === 5) {
            feedbackMessage = 'Sunk the Carrier! <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>sail-boat-sink</title><path d="M20.96 21C19.9 21 18.9 20.74 17.96 20.24C16.12 21.24 13.81 21.24 11.97 20.24C10.13 21.24 7.82 21.24 6 20.24C4.77 20.93 3.36 21.04 2 21V19C3.41 19.04 4.77 18.89 6 18C7.74 19.24 10.21 19.24 11.97 18C13.74 19.24 16.2 19.24 17.96 18C19.17 18.89 20.54 19.04 21.94 19V21H20.96M22 3.5L7.11 5.96L13.11 12.17L22 3.5M10.81 16.36L11.97 15.54L13.12 16.36C13.65 16.72 14.3 16.93 14.97 16.93C15.12 16.93 15.28 16.91 15.43 16.89L5.2 6.31C4.29 7.65 3.9 9.32 4 10.92L9.74 16.83C10.13 16.74 10.5 16.58 10.81 16.36Z" /></svg>';
          }
          break;
        case "4":
          feedbackMessage = "Hit the Battleship 🎯";
          if (victim.ships.Battleship.currentNumHits === 4) {
            feedbackMessage = 'Sunk the Battleship! <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>sail-boat-sink</title><path d="M20.96 21C19.9 21 18.9 20.74 17.96 20.24C16.12 21.24 13.81 21.24 11.97 20.24C10.13 21.24 7.82 21.24 6 20.24C4.77 20.93 3.36 21.04 2 21V19C3.41 19.04 4.77 18.89 6 18C7.74 19.24 10.21 19.24 11.97 18C13.74 19.24 16.2 19.24 17.96 18C19.17 18.89 20.54 19.04 21.94 19V21H20.96M22 3.5L7.11 5.96L13.11 12.17L22 3.5M10.81 16.36L11.97 15.54L13.12 16.36C13.65 16.72 14.3 16.93 14.97 16.93C15.12 16.93 15.28 16.91 15.43 16.89L5.2 6.31C4.29 7.65 3.9 9.32 4 10.92L9.74 16.83C10.13 16.74 10.5 16.58 10.81 16.36Z" /></svg>';
          }
          break;
        case "3.5":
          feedbackMessage = "Hit the Destroyer 🎯";
          if (victim.ships.Destroyer.currentNumHits === 3) {
            feedbackMessage = 'Sunk the Destroyer! <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>sail-boat-sink</title><path d="M20.96 21C19.9 21 18.9 20.74 17.96 20.24C16.12 21.24 13.81 21.24 11.97 20.24C10.13 21.24 7.82 21.24 6 20.24C4.77 20.93 3.36 21.04 2 21V19C3.41 19.04 4.77 18.89 6 18C7.74 19.24 10.21 19.24 11.97 18C13.74 19.24 16.2 19.24 17.96 18C19.17 18.89 20.54 19.04 21.94 19V21H20.96M22 3.5L7.11 5.96L13.11 12.17L22 3.5M10.81 16.36L11.97 15.54L13.12 16.36C13.65 16.72 14.3 16.93 14.97 16.93C15.12 16.93 15.28 16.91 15.43 16.89L5.2 6.31C4.29 7.65 3.9 9.32 4 10.92L9.74 16.83C10.13 16.74 10.5 16.58 10.81 16.36Z" /></svg>';
          }
          break;
        case "3":
          feedbackMessage = "Hit the Submarine 🎯";
          if (victim.ships.Submarine.currentNumHits === 3) {
            feedbackMessage = 'Sunk the Submarine! <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>sail-boat-sink</title><path d="M20.96 21C19.9 21 18.9 20.74 17.96 20.24C16.12 21.24 13.81 21.24 11.97 20.24C10.13 21.24 7.82 21.24 6 20.24C4.77 20.93 3.36 21.04 2 21V19C3.41 19.04 4.77 18.89 6 18C7.74 19.24 10.21 19.24 11.97 18C13.74 19.24 16.2 19.24 17.96 18C19.17 18.89 20.54 19.04 21.94 19V21H20.96M22 3.5L7.11 5.96L13.11 12.17L22 3.5M10.81 16.36L11.97 15.54L13.12 16.36C13.65 16.72 14.3 16.93 14.97 16.93C15.12 16.93 15.28 16.91 15.43 16.89L5.2 6.31C4.29 7.65 3.9 9.32 4 10.92L9.74 16.83C10.13 16.74 10.5 16.58 10.81 16.36Z" /></svg>';
          }
          break;
        case "2":
          feedbackMessage = "Hit the Patrol Boat 🎯";
          if (victim.ships["Patrol Boat"].currentNumHits === 2) {
            feedbackMessage = 'Sunk the Patrol Boat! <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>sail-boat-sink</title><path d="M20.96 21C19.9 21 18.9 20.74 17.96 20.24C16.12 21.24 13.81 21.24 11.97 20.24C10.13 21.24 7.82 21.24 6 20.24C4.77 20.93 3.36 21.04 2 21V19C3.41 19.04 4.77 18.89 6 18C7.74 19.24 10.21 19.24 11.97 18C13.74 19.24 16.2 19.24 17.96 18C19.17 18.89 20.54 19.04 21.94 19V21H20.96M22 3.5L7.11 5.96L13.11 12.17L22 3.5M10.81 16.36L11.97 15.54L13.12 16.36C13.65 16.72 14.3 16.93 14.97 16.93C15.12 16.93 15.28 16.91 15.43 16.89L5.2 6.31C4.29 7.65 3.9 9.32 4 10.92L9.74 16.83C10.13 16.74 10.5 16.58 10.81 16.36Z" /></svg>';
          }
          break;
      }
      // Declare winner
      if (aiOrUser2 === "ai") {
        if (victim.ships.Carrier.isSunk() && victim.ships.Battleship.isSunk() && victim.ships.Destroyer.isSunk() && victim.ships.Submarine.isSunk() && victim.ships["Patrol Boat"].isSunk()) {
          feedbackMessage = "Destroyed all your ships. 😞";
          gameOver = true;
          populateBoards.populateAiBoardWhenGameOver();
          getNodes.aiGrounds.style.pointerEvents = "none";
        }
      } else if (aiOrUser2 === "user") {
        if (victim.ships.Carrier.isSunk() && victim.ships.Battleship.isSunk() && victim.ships.Destroyer.isSunk() && victim.ships.Submarine.isSunk() && victim.ships["Patrol Boat"].isSunk()) {
          feedbackMessage = "Sunk all ships! 🏆";
          gameOver = true;
          populateBoards.populateAiBoardWhenGameOver();
          getNodes.aiGrounds.style.pointerEvents = "none";
        }
      }
      return feedbackMessage;
    };
    if (aiOrUser === "ai") {
      if (missedOrHit === "missed") {
        getNodes.feedback.textContent = `AI: Missed ✗`;
      }
      if (missedOrHit === "hit") {
        const feedbackMessage = getFeedbackMessage("ai");
        getNodes.feedback.innerHTML = `AI: ${feedbackMessage}`;
      }
    }
    if (aiOrUser === "user") {
      if (missedOrHit === "missed") {
        getNodes.feedback.textContent = `Admiral ${retrieveAdmiralNameFromStorageAndSet.admiralName}: Missed ✗`;
      }
      if (missedOrHit === "hit") {
        const feedbackMessage = getFeedbackMessage("user");
        getNodes.feedback.innerHTML = `Admiral ${retrieveAdmiralNameFromStorageAndSet.admiralName}: ${feedbackMessage}`;
      }
    }
  };
  const triggerUserTurn = function () {
    if (gameOver) {
      return;
    }
    getNodes.aiGrounds.style.pointerEvents = "auto";
    getNodes.aiGroundsDivs.forEach(div => {
      div.addEventListener("click", () => {
        const inactivateAlignedButton = function () {
          getNodes.alignedButton.style.pointerEvents = "none";
          getNodes.alignedButton.style.color = "rgba(255, 255, 255, 0.6)";
        }();
        const inactivateRealignButton = function () {
          getNodes.realignButton.style.pointerEvents = "none";
          getNodes.realignButton.style.color = "rgba(255, 255, 255, 0.6)";
        }();
        // IF empty
        if (div.dataset.attacked === "No" && !div.hasAttribute("data-ship")) {
          game.userTurn(div.dataset.index);
          displayAttack(div, "X", "rgb(228, 73, 73)");
          setFeedback("user", "missed");
          triggerAiTurn();
          return;
        }
        // IF hits a ship
        if (div.dataset.attacked === "No" && div.hasAttribute("data-ship")) {
          game.userTurn(div.dataset.index);
          displayAttack(div, "💥", "black");
          setFeedback("user", "hit", div.dataset.ship);
          return;
        }
      });
    });
  };
  triggerUserTurn();
  let aiTimer = 2000;
  let recursionCount = 0;
  const triggerAiTurn = async function () {
    if (gameOver) {
      return;
    }
    getNodes.aiGrounds.style.pointerEvents = "none";
    await new Promise(resolve => {
      if (aiTimer !== 1) {
        setTimeout(() => {
          getNodes.feedback.textContent = `AI: Targeting...`;
        }, 1500);
      }
      setTimeout(resolve, aiTimer);
    });
    const randomKey = game.computerTurn();
    for (const div of getNodes.admiralGroundsDivs) {
      const difficulty = getDifficulty.difficulty;
      if (div.dataset.index === randomKey) {
        // IF empty
        if (div.dataset.attacked === "No" && !div.hasAttribute("data-ship")) {
          // Recurse at faster timeout if difficulty is Impossible
          if (difficulty === "impossible") {
            if (recursionCount > 0) {
              aiTimer = 1;
            }
            recursionCount += 1;
            triggerAiTurn();
            return;
          }
          const resetDummyTimerParameters = function () {
            if (difficulty === "dummy") {
              recursionCount = 0;
              aiTimer = 2000;
            }
          }();
          displayAttack(div, "X", "rgb(228, 73, 73)");
          setFeedback("ai", "missed");
          getNodes.aiGrounds.style.pointerEvents = "auto";
        }
        // IF hits a ship
        if (div.dataset.attacked === "No" && div.hasAttribute("data-ship")) {
          // Recurse at faster timeout if difficulty is dummy
          if (difficulty === "dummy") {
            if (recursionCount > 0) {
              aiTimer = 1;
            }
            recursionCount += 1;
            triggerAiTurn();
            return;
          }
          const resetImpossibleTimerParameters = function () {
            if (difficulty === "impossible") {
              recursionCount = 0;
              aiTimer = 2000;
            }
          }();
          displayAttack(div, "💥", "black");
          setFeedback("ai", "hit", div.dataset.ship);
          triggerAiTurn();
          return;
        }
      }
    }
  };
  return {
    gameOver
  };
}();
let catchEventClearingLogic = null;
let isShipPositionChanged = false;
const setDragAndDrop = function () {
  const game = populateBoards.game;
  const setAttributes = function () {
    const legalMoves = game.user.getLegalMoves();
    const defaultUserBoard = game.user.board;
    getNodes.admiralGroundsDivs.forEach(div => {
      if (div.dataset.ship) {
        div.setAttribute("draggable", true);
      }
    });
    const getMoves = function (shipIndex) {
      const shipMoves = legalMoves[shipIndex];
      const shipLegalMoves = [];
      const shipIllegalMoves = [];
      const defineMovesForEachShipRow = function () {
        for (let n = 0; n < 10; n++) {
          shipLegalMoves.push([]);
          shipIllegalMoves.push([]);
        }
      }();
      defaultUserBoard.forEach((shipRow, rowIndex) => {
        shipMoves.forEach((moves, index) => {
          const values = [];
          for (let n = 0; n < moves.length; n++) {
            const value = shipRow[moves[n]];
            values.push(value);
          }
          const checkLegality = function () {
            const isAllNull = values.every(value => value === null);
            if (isAllNull) {
              shipLegalMoves[rowIndex].push(moves[0]);
            }
            if (!isAllNull) {
              shipIllegalMoves[rowIndex].push(moves[0]);
            }
          }();
        });
      });
      return {
        shipLegalMoves,
        shipIllegalMoves
      };
    };
    const setShipAttributes = function (shipIndex, shipLength) {
      const shipMoves = getMoves(shipIndex);
      const shipLegalMoves = shipMoves.shipLegalMoves;
      const shipIllegalMoves = shipMoves.shipIllegalMoves;
      getNodes.admiralGroundsDivs.forEach((div, divIndex) => {
        shipLegalMoves.forEach((moves, movesIndex) => {
          if (moves) {
            if (movesIndex === parseInt(divIndex / 10)) {
              moves.forEach(move => {
                if (move === divIndex % 10) {
                  div.classList.add(`droppable${shipLength}`);
                }
              });
            }
          }
        });
        shipIllegalMoves.forEach((moves, movesIndex) => {
          if (moves) {
            if (movesIndex === parseInt(divIndex / 10)) {
              moves.forEach(move => {
                if (move === divIndex % 10) {
                  div.classList.add(`not-droppable${shipLength}`);
                }
              });
            }
          }
        });
      });
    };
    setShipAttributes(0, 5);
    setShipAttributes(1, 4);
    setShipAttributes(2, 3);
    setShipAttributes(3, 3);
    setShipAttributes(4, 2);
  }();
  const draggableShips = document.querySelectorAll("div[draggable='true']");
  const carrierDroppableSpots = document.querySelectorAll(".droppable5");
  const carrierNotDroppableSpots = document.querySelectorAll(".not-droppable5");
  const battleshipDroppableSpots = document.querySelectorAll(".droppable4");
  const battleshipNotDroppableSpots = document.querySelectorAll(".not-droppable4");
  const desAndSubDroppableSpots = document.querySelectorAll(".droppable3");
  const desAndSubNotDroppableSpots = document.querySelectorAll(".not-droppable3");
  const patrolBoatDroppableSpots = document.querySelectorAll(".droppable2");
  const patrolBoatNotDroppableSpots = document.querySelectorAll(".not-droppable2");
  let catchEventDataset = null;
  const dragStart = function (event) {
    event.dataTransfer.setData("text/plain", event.target.dataset.ship);
    catchEventDataset = event.target.dataset.ship;

    // Select first ship
    const draggedShip = document.querySelector(`[data-ship='${catchEventDataset}']`);
    const shipImg = draggedShip.querySelector("img");
    let xOffset = 0;
    // const createXOffset = (function () {
    //   const targetsIndices = [];
    //   const getTargetsIndices = (function () {
    //     let currentTarget = draggedShip;
    //     for (let n = 0; n < parseInt(catchEventDataset); n++) {
    //       if (!currentTarget) {
    //         return;
    //       }
    //       targetsIndices.push(currentTarget.dataset.index);
    //       currentTarget = currentTarget.nextElementSibling;
    //     }
    //   })();
    //   targetsIndices.forEach((index, count) => {
    //     if (index === event.target.dataset.index) {
    //       xOffset = count * 30;
    //     }
    //   });
    // })();
    event.dataTransfer.setDragImage(shipImg, xOffset, 20);
    const triggerRightDragDropShip = function () {
      switch (catchEventDataset) {
        case "5":
          triggerCarrierDragDrop();
          break;
        case "4":
          triggerBattleshipDragDrop();
          break;
        case "3.5":
          triggerDesAndSubDragDrop();
          break;
        case "3":
          triggerDesAndSubDragDrop();
          break;
        case "2":
          triggerPatrolBoatDragDrop();
          break;
      }
    }();
  };
  const dragOver = function (event) {
    event.preventDefault();
    const setHoveringColor = function () {
      let currentTarget = event.target;
      for (let n = 0; n < parseInt(catchEventDataset); n++) {
        if (!currentTarget) {
          return;
        }
        currentTarget.style.backgroundColor = "rgba(98, 253, 60, 0.5)";
        currentTarget = currentTarget.nextElementSibling;
      }
    }();
  };
  const dragLeave = function (event) {
    const removeHoveringColor = function () {
      let currentTarget = event.target;
      for (let n = 0; n < parseInt(catchEventDataset); n++) {
        if (!currentTarget) {
          return;
        }
        currentTarget.style.backgroundColor = "initial";
        currentTarget = currentTarget.nextElementSibling;
      }
    }();
  };
  const drop = function (event) {
    event.preventDefault();
    const shipDataset = event.dataTransfer.getData("text/plain");
    const dropTarget = event.target;
    const removeHoveringColor = function () {
      let currentTarget = event.target;
      for (let n = 0; n < parseInt(catchEventDataset); n++) {
        if (!currentTarget) {
          return;
        }
        currentTarget.style.backgroundColor = "initial";
        currentTarget = currentTarget.nextElementSibling;
      }
    }();
    const draggedShip = document.querySelector(`[data-ship='${shipDataset}']`);
    const removeScaling = function () {
      dropTarget.style.transform = "scale(1)";
    }();
    const appendShipToTarget = function () {
      // Append ship img of the first div(in the set of divs with same dataset) to the target div
      const shipImg = draggedShip.querySelector("img");
      dropTarget.appendChild(shipImg);
    }();
    const transferAttributesFromDraggedShipsToTargets = function () {
      const removeAttributes = function () {
        const draggedShips = document.querySelectorAll(`[data-ship='${shipDataset}']`);
        draggedShips.forEach(ship => {
          ship.removeAttribute("data-ship");
          ship.setAttribute("draggable", false);
        });
      }();
      const addToTargets = function () {
        let currentTarget = event.target;
        for (let n = 0; n < parseInt(catchEventDataset); n++) {
          if (!currentTarget) {
            return;
          }
          currentTarget.setAttribute("data-ship", `${catchEventDataset}`);
          currentTarget.setAttribute("draggable", true);
          currentTarget = currentTarget.nextElementSibling;
        }
      }();
    }();
    const indicatePositionChange = function () {
      isShipPositionChanged = true;
    }();
    const updateBoard = function () {
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
      const clearShipsBoudaries = function () {
        game.user.board.forEach((row, rowIndex) => {
          row.forEach((value, valueIndex) => {
            if (value === "O") {
              game.user.board[rowIndex][valueIndex] = null;
            }
          });
        });
      }();
      const transferDroppedShip = function () {
        const newSpotsIndices = [];
        const getDroppedShipSpotsIndices = function () {
          let currentTarget = event.target;
          for (let n = 0; n < parseInt(catchEventDataset); n++) {
            if (!currentTarget) {
              return;
            }
            const index = currentTarget.dataset.index;
            newSpotsIndices.push(index);
            currentTarget = currentTarget.nextElementSibling;
          }
        }();
        const clearShipFromOldSpots = function () {
          game.user.board.forEach((row, rowIndex) => {
            row.forEach((value, valueIndex) => {
              if (value === parseFloat(catchEventDataset)) {
                game.user.board[rowIndex][valueIndex] = null;
              }
            });
          });
        }();
        const addShipToNewSpots = function () {
          const boardIndices = [];
          const KeysBox = assignKeysToBoardIndices;
          newSpotsIndices.forEach(index => {
            boardIndices.push(KeysBox[index]);
          });
          boardIndices.forEach(index => {
            game.user.board[index[1]][index[0]] = parseFloat(catchEventDataset);
          });
        }();
        const board = game.user.board;
        const addNewBoundaries = function (rowIndex, shipLength) {
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
          if (populatedRow[populatedRow.indexOf(shipLength) - 1] === null && populatedRow[lastOccupied + 1] !== null) {
            occupy(true, false, 1, 1);
          } else if (populatedRow[populatedRow.indexOf(shipLength) - 1] !== null && populatedRow[lastOccupied + 1] === null) {
            occupy(false, true, 0, 2);
          } else if (populatedRow[populatedRow.indexOf(shipLength) - 1] === null && populatedRow[lastOccupied + 1] === null) {
            occupy(true, true, 1, 2);
          } else {
            occupy(false, false, 0, 1);
          }
        };
        const setBoundaries = function () {
          for (const row of board) {
            const isAllNull = row.every(entry => entry === null);
            if (isAllNull) {
              continue;
            }
            const entries = [];
            row.forEach(entry => {
              if (entry === 5 || entry === 4 || entry === 3.5 || entry === 3 || entry === 2) {
                // avoidMoreThanOneFunctionCallOnEntry
                if (entries.includes(entry)) {
                  return;
                }
                entries.push(entry);
                addNewBoundaries(board.indexOf(row), entry);
              }
            });
          }
          // console.log(game.user.board);
        }();
      }();
    }();
    const removeOldAttributesAndEventListeners = function () {
      getNodes.admiralGroundsDivs.forEach(div => {
        div.classList = [];
      });
      // Remove all event listeners
      getNodes.admiralGroundsDivs.forEach(div => {
        div.removeEventListener("dragstart", dragStart);
        div.removeEventListener("dragover", dragOver);
        div.removeEventListener("dragleave", dragLeave);
        div.removeEventListener("drop", drop);
        div.removeEventListener("dragover", notDroppableDragOver);
        div.removeEventListener("dragleave", dragLeave);
        div.removeEventListener("drop", notDroppableDrop);
      });
    }();
    // Restart to add new attributes and listeners
    setDragAndDrop();
  };
  const notDroppableDragOver = function (event) {
    event.preventDefault();
    const setHoveringColor = function () {
      let currentTarget = event.target;
      for (let n = 0; n < parseInt(catchEventDataset); n++) {
        if (!currentTarget) {
          return;
        }
        currentTarget.style.backgroundColor = "rgba(248, 73, 29, 0.5)";
        currentTarget = currentTarget.nextElementSibling;
      }
    }();
  };
  const notDroppableDrop = function (event) {
    event.preventDefault();
    const removeHoveringColor = function () {
      let currentTarget = event.target;
      for (let n = 0; n < parseInt(catchEventDataset); n++) {
        if (!currentTarget) {
          return;
        }
        currentTarget.style.backgroundColor = "initial";
        currentTarget = currentTarget.nextElementSibling;
      }
    }();
  };
  draggableShips.forEach(ship => {
    ship.addEventListener("dragstart", dragStart);
  });
  const triggerCarrierDragDrop = function () {
    getNodes.admiralGroundsDivs.forEach(div => {
      div.removeEventListener("dragover", dragOver);
      div.removeEventListener("dragleave", dragLeave);
      div.removeEventListener("drop", drop);
      div.removeEventListener("dragover", notDroppableDragOver);
      div.removeEventListener("dragleave", dragLeave);
      div.removeEventListener("drop", notDroppableDrop);
    });
    carrierDroppableSpots.forEach(spot => {
      spot.addEventListener("dragover", dragOver);
      spot.addEventListener("dragleave", dragLeave);
      spot.addEventListener("drop", drop);
    });
    carrierNotDroppableSpots.forEach(spot => {
      spot.addEventListener("dragover", notDroppableDragOver);
      spot.addEventListener("dragleave", dragLeave);
      spot.addEventListener("drop", notDroppableDrop);
    });
  };
  const triggerBattleshipDragDrop = function () {
    getNodes.admiralGroundsDivs.forEach(div => {
      div.removeEventListener("dragover", dragOver);
      div.removeEventListener("dragleave", dragLeave);
      div.removeEventListener("drop", drop);
      div.removeEventListener("dragover", notDroppableDragOver);
      div.removeEventListener("dragleave", dragLeave);
      div.removeEventListener("drop", notDroppableDrop);
    });
    battleshipDroppableSpots.forEach(spot => {
      spot.addEventListener("dragover", dragOver);
      spot.addEventListener("dragleave", dragLeave);
      spot.addEventListener("drop", drop);
    });
    battleshipNotDroppableSpots.forEach(spot => {
      spot.addEventListener("dragover", notDroppableDragOver);
      spot.addEventListener("dragleave", dragLeave);
      spot.addEventListener("drop", notDroppableDrop);
    });
  };
  const triggerDesAndSubDragDrop = function () {
    getNodes.admiralGroundsDivs.forEach(div => {
      div.removeEventListener("dragover", dragOver);
      div.removeEventListener("dragleave", dragLeave);
      div.removeEventListener("drop", drop);
      div.removeEventListener("dragover", notDroppableDragOver);
      div.removeEventListener("dragleave", dragLeave);
      div.removeEventListener("drop", notDroppableDrop);
    });
    desAndSubDroppableSpots.forEach(spot => {
      spot.addEventListener("dragover", dragOver);
      spot.addEventListener("dragleave", dragLeave);
      spot.addEventListener("drop", drop);
    });
    desAndSubNotDroppableSpots.forEach(spot => {
      spot.addEventListener("dragover", notDroppableDragOver);
      spot.addEventListener("dragleave", dragLeave);
      spot.addEventListener("drop", notDroppableDrop);
    });
  };
  const triggerPatrolBoatDragDrop = function () {
    getNodes.admiralGroundsDivs.forEach(div => {
      div.removeEventListener("dragover", dragOver);
      div.removeEventListener("dragleave", dragLeave);
      div.removeEventListener("drop", drop);
      div.removeEventListener("dragover", notDroppableDragOver);
      div.removeEventListener("dragleave", dragLeave);
      div.removeEventListener("drop", notDroppableDrop);
    });
    patrolBoatDroppableSpots.forEach(spot => {
      spot.addEventListener("dragover", dragOver);
      spot.addEventListener("dragleave", dragLeave);
      spot.addEventListener("drop", drop);
    });
    patrolBoatNotDroppableSpots.forEach(spot => {
      spot.addEventListener("dragover", notDroppableDragOver);
      spot.addEventListener("dragleave", dragLeave);
      spot.addEventListener("drop", notDroppableDrop);
    });
  };
  catchEventClearingLogic = function () {
    getNodes.admiralGroundsDivs.forEach(div => {
      div.classList = [];
    });
    // Remove all event listeners
    getNodes.admiralGroundsDivs.forEach(div => {
      div.removeEventListener("dragstart", dragStart);
      div.removeEventListener("dragover", dragOver);
      div.removeEventListener("dragleave", dragLeave);
      div.removeEventListener("drop", drop);
      div.removeEventListener("dragover", notDroppableDragOver);
      div.removeEventListener("dragleave", dragLeave);
      div.removeEventListener("drop", notDroppableDrop);
    });
  };
};
const configuration = function () {
  const displayDialog = function () {
    getNodes.configButton.addEventListener("click", () => {
      getNodes.cover.style.zIndex = "2";
      getNodes.configDialog.style.visibility = "visible";
      getNodes.configDialog.style.opacity = "1";
    });
  }();
  const exitDialog = function () {
    getNodes.closeDialog.addEventListener("click", async () => {
      getNodes.cover.style.zIndex = "0";
      getNodes.configDialog.style.opacity = "0";
      getNodes.configDialog.style.transition = "opacity 0.5s ease-in-out";
      await new Promise(resolve => {
        setTimeout(() => {
          getNodes.configDialog.style.visibility = "hidden";
        }, 400);
      });
    });
  }();
  const restartGame = function () {
    getNodes.kickStartButton.addEventListener("click", () => {
      window.location.href = "./index.html";
    });
  }();
  const shuffleGame = function () {
    getNodes.shuffleButton.addEventListener("click", () => {
      window.location.reload();
    });
  }();
  const setDifficulty = function () {
    getNodes.difficultyOptions.addEventListener("change", event => {
      if (event.target.value === "impossible") {
        localStorage.setItem("difficulty", "impossible");
        window.location.reload();
      }
      if (event.target.value === "normal") {
        localStorage.setItem("difficulty", "normal");
        window.location.reload();
      }
      if (event.target.value === "dummy") {
        localStorage.setItem("difficulty", "dummy");
        window.location.reload();
      }
    });
  }();
  const triggerAlignment = function () {
    const currentFeedback = getNodes.feedback.textContent;
    const inactivateAlignedButton = function () {
      getNodes.alignedButton.style.pointerEvents = "none";
      getNodes.alignedButton.style.color = "rgba(255, 255, 255, 0.6)";
    }();
    getNodes.realignButton.addEventListener("click", () => {
      const inactivateDimensionSelection = function () {
        getNodes.dimensionOptions.style.pointerEvents = "none";
        getNodes.dimensionOptions.style.color = "rgba(255, 255, 255, 0.6)";
      }();
      const updateFeedback = function () {
        getNodes.feedback.textContent = "Once done, click 'Aligned' to play.";
      }();
      const activateAlignedButton = function () {
        getNodes.alignedButton.style.pointerEvents = "auto";
        getNodes.alignedButton.style.color = "rgb(255, 255, 255)";
      }();
      const inactivateRealignButton = function () {
        getNodes.realignButton.style.pointerEvents = "none";
        getNodes.realignButton.style.color = "rgba(255, 255, 255, 0.6)";
      }();
      setDragAndDrop();
      const inactivateAiGrounds = function () {
        getNodes.aiGrounds.style.pointerEvents = "none";
      }();
      const exitDialog = async function () {
        getNodes.cover.style.zIndex = "0";
        getNodes.configDialog.style.opacity = "0";
        getNodes.configDialog.style.transition = "opacity 0.5s ease-in-out";
        await new Promise(resolve => {
          setTimeout(() => {
            getNodes.configDialog.style.visibility = "hidden";
          }, 400);
        });
      }();
    });
    getNodes.alignedButton.addEventListener("click", () => {
      const activateDimensionSelection = function () {
        if (isShipPositionChanged) {
          return;
        }
        getNodes.dimensionOptions.style.pointerEvents = "auto";
        getNodes.dimensionOptions.style.color = "rgb(255, 255, 255)";
      }();
      const restoreFeedback = function () {
        getNodes.feedback.textContent = currentFeedback;
      }();
      const inactivateAlignedButton = function () {
        getNodes.alignedButton.style.pointerEvents = "none";
        getNodes.alignedButton.style.color = "rgba(255, 255, 255, 0.6)";
      }();
      const activateRealignButton = function () {
        getNodes.realignButton.style.pointerEvents = "auto";
        getNodes.realignButton.style.color = "rgb(255, 255, 255)";
      }();
      catchEventClearingLogic();
      const activateAiGrounds = function () {
        getNodes.aiGrounds.style.pointerEvents = "auto";
      }();
      const exitDialog = async function () {
        getNodes.cover.style.zIndex = "0";
        getNodes.configDialog.style.opacity = "0";
        getNodes.configDialog.style.transition = "opacity 0.5s ease-in-out";
        await new Promise(resolve => {
          setTimeout(() => {
            getNodes.configDialog.style.visibility = "hidden";
          }, 400);
        });
      }();
    });
  }();
  const triggerHoveringEffectOverSvg = function () {
    getNodes.configButton.addEventListener("mouseover", () => {
      getNodes.configButtonIcon.style.fill = "black";
    });
    getNodes.configButton.addEventListener("mouseout", () => {
      getNodes.configButtonIcon.style.fill = "white";
    });
  }();
}();
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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OztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIsbUNBQW1DO0FBQy9EOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTyx3RkFBd0YsTUFBTSxLQUFLLFVBQVUsWUFBWSxXQUFXLFlBQVksV0FBVyxhQUFhLGFBQWEsYUFBYSxhQUFhLFdBQVcsWUFBWSxhQUFhLGFBQWEsT0FBTyxLQUFLLFVBQVUsWUFBWSxXQUFXLFlBQVksV0FBVyxNQUFNLEtBQUssVUFBVSxZQUFZLFdBQVcsVUFBVSxVQUFVLFlBQVksYUFBYSxhQUFhLGFBQWEsV0FBVyxVQUFVLFlBQVksYUFBYSxXQUFXLFlBQVksV0FBVyxNQUFNLEtBQUssVUFBVSxZQUFZLE9BQU8sS0FBSyxZQUFZLGFBQWEsV0FBVyxZQUFZLGFBQWEsYUFBYSxhQUFhLFdBQVcsT0FBTyxLQUFLLFlBQVksT0FBTyxNQUFNLFlBQVksYUFBYSxhQUFhLFdBQVcsVUFBVSxZQUFZLFdBQVcsWUFBWSxPQUFPLE1BQU0sWUFBWSxPQUFPLEtBQUssVUFBVSxZQUFZLFdBQVcsVUFBVSxZQUFZLGFBQWEsYUFBYSxhQUFhLE9BQU8sS0FBSyxVQUFVLE9BQU8sS0FBSyxZQUFZLFdBQVcsWUFBWSxhQUFhLGFBQWEsT0FBTyxLQUFLLFlBQVksT0FBTyxLQUFLLFlBQVksYUFBYSxhQUFhLFdBQVcsWUFBWSxXQUFXLFVBQVUsT0FBTyxPQUFPLE9BQU8sS0FBSyxZQUFZLGFBQWEsYUFBYSxPQUFPLEtBQUssVUFBVSxNQUFNLEtBQUssWUFBWSxPQUFPLEtBQUssWUFBWSxhQUFhLGFBQWEsV0FBVyxZQUFZLGFBQWEsYUFBYSxhQUFhLGFBQWEsYUFBYSxhQUFhLGFBQWEsT0FBTyxLQUFLLFlBQVksYUFBYSxPQUFPLE1BQU0sVUFBVSxZQUFZLGFBQWEsYUFBYSxPQUFPLEtBQUssWUFBWSxXQUFXLFlBQVksT0FBTyxLQUFLLFlBQVksYUFBYSxhQUFhLE9BQU8sTUFBTSxVQUFVLFlBQVksYUFBYSxhQUFhLFdBQVcsWUFBWSxhQUFhLE9BQU8sTUFBTSxZQUFZLGFBQWEsT0FBTyxNQUFNLFlBQVksYUFBYSxXQUFXLFlBQVksYUFBYSxhQUFhLGFBQWEsT0FBTyxLQUFLLFlBQVksT0FBTyxNQUFNLFlBQVksT0FBTyxNQUFNLFlBQVksYUFBYSxXQUFXLGFBQWEsV0FBVyxZQUFZLGFBQWEsYUFBYSxhQUFhLGFBQWEsV0FBVyxZQUFZLE9BQU8sTUFBTSxZQUFZLE9BQU8sTUFBTSxZQUFZLE9BQU8sTUFBTSxZQUFZLE9BQU8sTUFBTSxZQUFZLE9BQU8sTUFBTSxZQUFZLE9BQU8sTUFBTSxZQUFZLE9BQU8sS0FBSyxZQUFZLGFBQWEsYUFBYSxXQUFXLFlBQVksYUFBYSxjQUFjLGFBQWEsYUFBYSxhQUFhLGFBQWEsV0FBVyxVQUFVLFVBQVUsWUFBWSxXQUFXLFlBQVksT0FBTyxLQUFLLFlBQVksYUFBYSxhQUFhLE9BQU8sS0FBSyxVQUFVLFVBQVUsVUFBVSxVQUFVLFVBQVUsWUFBWSxPQUFPLE1BQU0sWUFBWSxXQUFXLFVBQVUsWUFBWSxPQUFPLEtBQUssWUFBWSxhQUFhLFdBQVcsVUFBVSxVQUFVLFlBQVksV0FBVyxPQUFPLEtBQUssWUFBWSxhQUFhLE9BQU8sS0FBSyxVQUFVLFVBQVUsTUFBTSxLQUFLLEtBQUssVUFBVSxZQUFZLE9BQU8sS0FBSyxVQUFVLEtBQUssTUFBTSxZQUFZLE1BQU0sTUFBTSxZQUFZLE1BQU0sS0FBSyxZQUFZLE1BQU0sTUFBTSxZQUFZLE1BQU0sTUFBTSxLQUFLLEtBQUssVUFBVSxZQUFZLE9BQU8sS0FBSyxVQUFVLFlBQVksT0FBTyxLQUFLLFlBQVksT0FBTyxNQUFNLFlBQVksTUFBTSxNQUFNLEtBQUssS0FBSyxVQUFVLFlBQVksV0FBVyxNQUFNLEtBQUssWUFBWSxPQUFPLEtBQUssWUFBWSxPQUFPLEtBQUssVUFBVSxVQUFVLE1BQU0sTUFBTSxLQUFLLEtBQUssVUFBVSxZQUFZLGFBQWEsT0FBTyxLQUFLLFVBQVUsT0FBTyxLQUFLLFVBQVUsWUFBWSxPQUFPLEtBQUssWUFBWSxhQUFhLE9BQU8sTUFBTSxZQUFZLE9BQU8sS0FBSyxZQUFZLGFBQWEsYUFBYSxPQUFPLEtBQUssWUFBWSxPQUFPLEtBQUssWUFBWSxPQUFPLEtBQUssWUFBWSxPQUFPLEtBQUssWUFBWSxNQUFNLE1BQU0sS0FBSyxLQUFLLFlBQVksV0FBVyxNQUFNLEtBQUssWUFBWSxhQUFhLFdBQVcsS0FBSyxNQUFNLEtBQUssS0FB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LFFBQVEsQ0FBQ2UsWUFBWSxDQUFDaUIsZ0JBQWdCLENBQUMsV0FBVyxFQUFFLE1BQU07TUFDeERoQyxRQUFRLENBQUNpQixnQkFBZ0IsQ0FBQ2dCLEtBQUssQ0FBQ2xHLElBQUksR0FBRyxPQUFPO0lBQ2hELENBQUMsQ0FBQztJQUNGaUUsUUFBUSxDQUFDZSxZQUFZLENBQUNpQixnQkFBZ0IsQ0FBQyxVQUFVLEVBQUUsTUFBTTtNQUN2RGhDLFFBQVEsQ0FBQ2lCLGdCQUFnQixDQUFDZ0IsS0FBSyxDQUFDbEcsSUFBSSxHQUFHLE9BQU87SUFDaEQsQ0FBQyxDQUFDO0VBQ0osQ0FBQyxDQUFFLENBQUM7QUFDTixDQUFDLENBQUUsQ0FBQyxDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9sb2dpYy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2JhdHRsZWdyb3VuZC5jc3MiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9yZXNldC5jc3MiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9nZXRVcmwuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvYmF0dGxlZ3JvdW5kLmNzcz8zZTU5Iiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvcmVzZXQuY3NzP2VkZTAiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2Fzc2V0cy8gc3luYyBub25yZWN1cnNpdmUgXFwuKHBuZyU3Q2pwZSIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvZ2xvYmFsIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvcHVibGljUGF0aCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9qc29ucCBjaHVuayBsb2FkaW5nIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL25vbmNlIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvYmF0dGxlZ3JvdW5kLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImNsYXNzIFNoaXAge1xuICBjb25zdHJ1Y3RvcihsZW5ndGgsIG51bUhpdHMsIHN1bmspIHtcbiAgICB0aGlzLmxlbmd0aCA9IGxlbmd0aDtcbiAgICB0aGlzLm51bUhpdHMgPSBudW1IaXRzO1xuICAgIHRoaXMuc3VuayA9IHN1bms7XG4gIH1cblxuICBnZXQgY3VycmVudExlbmd0aCgpIHtcbiAgICByZXR1cm4gdGhpcy5sZW5ndGg7XG4gIH1cblxuICBnZXQgY3VycmVudE51bUhpdHMoKSB7XG4gICAgcmV0dXJuIHRoaXMubnVtSGl0cztcbiAgfVxuXG4gIGdldCBzdW5rU3RhdHVzKCkge1xuICAgIHJldHVybiB0aGlzLnN1bms7XG4gIH1cblxuICBoaXQoKSB7XG4gICAgaWYgKHRoaXMubnVtSGl0cyA8IHRoaXMubGVuZ3RoKSB7XG4gICAgICB0aGlzLm51bUhpdHMgKz0gMTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFwiU2hpcCBhbHJlYWR5IHN1bmshXCI7XG4gICAgfVxuICB9XG5cbiAgaXNTdW5rKCkge1xuICAgIGlmICh0aGlzLmxlbmd0aCA9PT0gdGhpcy5udW1IaXRzKSB7XG4gICAgICB0aGlzLnN1bmsgPSB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5zdW5rO1xuICB9XG59XG5cbmNsYXNzIEdhbWVib2FyZCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuYm9hcmQgPSBbXTtcbiAgICB0aGlzLmRpc3BsYWNlU2hpcHNSZWN1cnNpb25Db3VudCA9IDA7XG4gICAgdGhpcy5zaGlwcyA9IHtcbiAgICAgIENhcnJpZXI6IG5ldyBTaGlwKDUsIDAsIGZhbHNlKSxcbiAgICAgIEJhdHRsZXNoaXA6IG5ldyBTaGlwKDQsIDAsIGZhbHNlKSxcbiAgICAgIERlc3Ryb3llcjogbmV3IFNoaXAoMywgMCwgZmFsc2UpLFxuICAgICAgU3VibWFyaW5lOiBuZXcgU2hpcCgzLCAwLCBmYWxzZSksXG4gICAgICBcIlBhdHJvbCBCb2F0XCI6IG5ldyBTaGlwKDIsIDAsIGZhbHNlKSxcbiAgICB9O1xuICB9XG5cbiAgY3JlYXRlQm9hcmQoKSB7XG4gICAgdGhpcy5ib2FyZCA9IFtdO1xuICAgIGNvbnN0IGJvYXJkID0gdGhpcy5ib2FyZDtcbiAgICBmb3IgKGxldCBuID0gMDsgbiA8IDEwOyBuKyspIHtcbiAgICAgIGNvbnN0IHN1YkJvYXJkID0gW107XG4gICAgICBmb3IgKGxldCBtID0gMDsgbSA8IDEwOyBtKyspIHtcbiAgICAgICAgc3ViQm9hcmQucHVzaChudWxsKTtcbiAgICAgIH1cbiAgICAgIGJvYXJkLnB1c2goc3ViQm9hcmQpO1xuICAgIH1cblxuICAgIHJldHVybiBib2FyZDtcbiAgfVxuXG4gIGdldExlZ2FsTW92ZXMoKSB7XG4gICAgY29uc3QgZ2VuZXJhdGVNb3ZlcyA9IGZ1bmN0aW9uIChsZW5ndGgpIHtcbiAgICAgIGxldCBmaXJzdE1vdmUgPSBbXTtcbiAgICAgIGNvbnN0IHNoaXBNb3ZlcyA9IFtdO1xuICAgICAgZm9yIChsZXQgbSA9IDA7IG0gPCBsZW5ndGg7IG0rKykge1xuICAgICAgICBmaXJzdE1vdmUucHVzaChtKTtcbiAgICAgIH1cbiAgICAgIC8vIEFjY291bnQgZm9yIGV4dHJhIG1vdmVzIGZvciBzdWJzZXF1ZW50IHNoaXBzXG4gICAgICBzd2l0Y2ggKGxlbmd0aCkge1xuICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgbGVuZ3RoICs9IDI7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMzpcbiAgICAgICAgICBsZW5ndGggKz0gNDtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAyOlxuICAgICAgICAgIGxlbmd0aCArPSA2O1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgbGVuZ3RoICs9IDg7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBmb3IgKGxldCBuID0gMDsgbiA8PSBsZW5ndGg7IG4rKykge1xuICAgICAgICBzaGlwTW92ZXMucHVzaChmaXJzdE1vdmUpO1xuICAgICAgICBmaXJzdE1vdmUgPSBmaXJzdE1vdmUubWFwKChpbmRleCkgPT4gaW5kZXggKyAxKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHNoaXBNb3ZlcztcbiAgICB9O1xuXG4gICAgY29uc3QgY2Fycmllck1vdmVzID0gZ2VuZXJhdGVNb3Zlcyh0aGlzLnNoaXBzLkNhcnJpZXIubGVuZ3RoKTtcbiAgICBjb25zdCBiYXR0bGVzaGlwTW92ZXMgPSBnZW5lcmF0ZU1vdmVzKHRoaXMuc2hpcHMuQmF0dGxlc2hpcC5sZW5ndGgpO1xuICAgIGNvbnN0IGRlc3Ryb3llck1vdmVzID0gZ2VuZXJhdGVNb3Zlcyh0aGlzLnNoaXBzLkRlc3Ryb3llci5sZW5ndGgpO1xuICAgIGNvbnN0IHN1Ym1hcmluZU1vdmVzID0gZ2VuZXJhdGVNb3Zlcyh0aGlzLnNoaXBzLlN1Ym1hcmluZS5sZW5ndGgpO1xuICAgIGNvbnN0IHBhdHJvbE1vdmVzID0gZ2VuZXJhdGVNb3Zlcyh0aGlzLnNoaXBzW1wiUGF0cm9sIEJvYXRcIl0ubGVuZ3RoKTtcblxuICAgIGNvbnN0IGxlZ2FsTW92ZXMgPSBbXG4gICAgICBjYXJyaWVyTW92ZXMsXG4gICAgICBiYXR0bGVzaGlwTW92ZXMsXG4gICAgICBkZXN0cm95ZXJNb3ZlcyxcbiAgICAgIHN1Ym1hcmluZU1vdmVzLFxuICAgICAgcGF0cm9sTW92ZXMsXG4gICAgXTtcblxuICAgIHJldHVybiBsZWdhbE1vdmVzO1xuICB9XG5cbiAgZGlzcGxhY2VTaGlwcygpIHtcbiAgICBjb25zdCBib2FyZCA9IHRoaXMuY3JlYXRlQm9hcmQoKTtcbiAgICBsZXQgaXNSZURpc3BsYWNlZCA9IGZhbHNlO1xuXG4gICAgY29uc3QgZ2VuZXJhdGVSYW5kb21Sb3dJbmRleCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGNvbnN0IHJvd0luZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApO1xuICAgICAgcmV0dXJuIHJvd0luZGV4O1xuICAgIH07XG5cbiAgICBjb25zdCBnZXRSYW5kb21Nb3ZlSW5kZXggPSBmdW5jdGlvbiAobW92ZXMpIHtcbiAgICAgIGNvbnN0IG1vdmVJbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG1vdmVzKTtcbiAgICAgIHJldHVybiBtb3ZlSW5kZXg7XG4gICAgfTtcblxuICAgIGNvbnN0IHVwZGF0ZUxlZ2FsTW92ZXNJbkJvYXJkID0gKHJvd0luZGV4LCBzaGlwTGVuZ3RoKSA9PiB7XG4gICAgICBjb25zdCBwb3B1bGF0ZWRSb3cgPSBib2FyZFtyb3dJbmRleF07XG4gICAgICBjb25zdCBsYXN0T2NjdXBpZWQgPSBwb3B1bGF0ZWRSb3cubGFzdEluZGV4T2Yoc2hpcExlbmd0aCk7XG4gICAgICBsZXQgZmlyc3RPY2N1cGllZCA9IG51bGw7XG5cbiAgICAgIGNvbnN0IG9jY3VweSA9IChmaXJzdEluZGV4RW1wdHksIGxhc3RJbmRleEVtcHR5LCBmaXJzdFRvcEJvdHRvbSwgbGFzdFRvcEJvdHRvbSkgPT4ge1xuICAgICAgICAvLyBPY2N1cHkgZmlyc3QgYW5kIGxhc3QgaW5kZXggb2Ygc2hpcFxuICAgICAgICBmaXJzdE9jY3VwaWVkID0gcG9wdWxhdGVkUm93LmluZGV4T2Yoc2hpcExlbmd0aCk7XG4gICAgICAgIGlmIChmaXJzdEluZGV4RW1wdHkgJiYgIWxhc3RJbmRleEVtcHR5KSB7XG4gICAgICAgICAgcG9wdWxhdGVkUm93W2ZpcnN0T2NjdXBpZWQgLSAxXSA9IFwiT1wiO1xuICAgICAgICB9IGVsc2UgaWYgKCFmaXJzdEluZGV4RW1wdHkgJiYgbGFzdEluZGV4RW1wdHkpIHtcbiAgICAgICAgICBwb3B1bGF0ZWRSb3dbbGFzdE9jY3VwaWVkICsgMV0gPSBcIk9cIjtcbiAgICAgICAgfSBlbHNlIGlmIChmaXJzdEluZGV4RW1wdHkgJiYgbGFzdEluZGV4RW1wdHkpIHtcbiAgICAgICAgICBwb3B1bGF0ZWRSb3dbZmlyc3RPY2N1cGllZCAtIDFdID0gXCJPXCI7XG4gICAgICAgICAgcG9wdWxhdGVkUm93W2xhc3RPY2N1cGllZCArIDFdID0gXCJPXCI7XG4gICAgICAgIH1cbiAgICAgICAgLy8gT2NjdXB5IHRvcCBhbmQvb3IgYm90dG9tXG4gICAgICAgIGlmIChyb3dJbmRleCA9PT0gMCkge1xuICAgICAgICAgIGNvbnN0IGJvdHRvbUFkamFjZW50Um93ID0gYm9hcmRbMV07XG4gICAgICAgICAgYm90dG9tQWRqYWNlbnRSb3cuZmlsbChcbiAgICAgICAgICAgIFwiT1wiLFxuICAgICAgICAgICAgZmlyc3RPY2N1cGllZCAtIGZpcnN0VG9wQm90dG9tLFxuICAgICAgICAgICAgbGFzdE9jY3VwaWVkICsgbGFzdFRvcEJvdHRvbSxcbiAgICAgICAgICApO1xuICAgICAgICB9IGVsc2UgaWYgKHJvd0luZGV4ID09PSA5KSB7XG4gICAgICAgICAgY29uc3QgdG9wQWRqYWNlbnRSb3cgPSBib2FyZFs4XTtcbiAgICAgICAgICB0b3BBZGphY2VudFJvdy5maWxsKFxuICAgICAgICAgICAgXCJPXCIsXG4gICAgICAgICAgICBmaXJzdE9jY3VwaWVkIC0gZmlyc3RUb3BCb3R0b20sXG4gICAgICAgICAgICBsYXN0T2NjdXBpZWQgKyBsYXN0VG9wQm90dG9tLFxuICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc3QgdG9wQWRqYWNlbnRSb3cgPSBib2FyZFtyb3dJbmRleCAtIDFdO1xuICAgICAgICAgIGNvbnN0IGJvdHRvbUFkamFjZW50Um93ID0gYm9hcmRbcm93SW5kZXggKyAxXTtcbiAgICAgICAgICB0b3BBZGphY2VudFJvdy5maWxsKFxuICAgICAgICAgICAgXCJPXCIsXG4gICAgICAgICAgICBmaXJzdE9jY3VwaWVkIC0gZmlyc3RUb3BCb3R0b20sXG4gICAgICAgICAgICBsYXN0T2NjdXBpZWQgKyBsYXN0VG9wQm90dG9tLFxuICAgICAgICAgICk7XG4gICAgICAgICAgYm90dG9tQWRqYWNlbnRSb3cuZmlsbChcbiAgICAgICAgICAgIFwiT1wiLFxuICAgICAgICAgICAgZmlyc3RPY2N1cGllZCAtIGZpcnN0VG9wQm90dG9tLFxuICAgICAgICAgICAgbGFzdE9jY3VwaWVkICsgbGFzdFRvcEJvdHRvbSxcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgaWYgKFxuICAgICAgICBwb3B1bGF0ZWRSb3dbMF0gPT09IG51bGwgJiZcbiAgICAgICAgcG9wdWxhdGVkUm93W3BvcHVsYXRlZFJvdy5sZW5ndGggLSAxXSAhPT0gbnVsbCAmJlxuICAgICAgICAhcG9wdWxhdGVkUm93LmluY2x1ZGVzKFwiT1wiKVxuICAgICAgKSB7XG4gICAgICAgIG9jY3VweSh0cnVlLCBmYWxzZSwgMSwgMSk7XG4gICAgICB9IGVsc2UgaWYgKFxuICAgICAgICBwb3B1bGF0ZWRSb3dbMF0gIT09IG51bGwgJiZcbiAgICAgICAgcG9wdWxhdGVkUm93W3BvcHVsYXRlZFJvdy5sZW5ndGggLSAxXSA9PT0gbnVsbCAmJlxuICAgICAgICAhcG9wdWxhdGVkUm93LmluY2x1ZGVzKFwiT1wiKVxuICAgICAgKSB7XG4gICAgICAgIG9jY3VweShmYWxzZSwgdHJ1ZSwgMCwgMik7XG4gICAgICB9IGVsc2UgaWYgKFxuICAgICAgICBwb3B1bGF0ZWRSb3dbMF0gPT09IG51bGwgJiZcbiAgICAgICAgcG9wdWxhdGVkUm93W3BvcHVsYXRlZFJvdy5sZW5ndGggLSAxXSA9PT0gbnVsbCAmJlxuICAgICAgICAhcG9wdWxhdGVkUm93LmluY2x1ZGVzKFwiT1wiKVxuICAgICAgKSB7XG4gICAgICAgIG9jY3VweSh0cnVlLCB0cnVlLCAxLCAyKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgcmVzdGFydFNoaXBEaXNwbGFjZW1lbnRJZkJvYXJkSGFzQWRqYWNlbnRPY2N1cGllZFJvd3MgPSAoKCkgPT4ge1xuICAgICAgICBib2FyZC5mb3JFYWNoKChyb3csIHJvd0luZGV4KSA9PiB7XG4gICAgICAgICAgaWYgKHJvd0luZGV4ID09PSAwIHx8IHJvd0luZGV4ID09PSA5IHx8IGlzUmVEaXNwbGFjZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBNb3ZlIHRvIG5leHQgaXRlcmF0aW9uIGlmIHJvdyBpcyBlbXB0eVxuICAgICAgICAgIGNvbnN0IHJvd0lzRW1wdHkgPSByb3cuZXZlcnkoKGVudHJ5KSA9PiBlbnRyeSA9PT0gbnVsbCk7XG4gICAgICAgICAgaWYgKHJvd0lzRW1wdHkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBEaXNwbGFjZSBmb3IgYWRqYWNlbnQgb2NjdXBpZWQgcm93c1xuICAgICAgICAgIGNvbnN0IHJvd0lzT2NjdXBpZWQgPSByb3cuZXZlcnkoKGVudHJ5KSA9PiBlbnRyeSA9PT0gXCJPXCIgfHwgZW50cnkgPT09IG51bGwpO1xuICAgICAgICAgIGlmIChyb3dJc09jY3VwaWVkKSB7XG4gICAgICAgICAgICBjb25zdCBuZXh0Um93SXNFbXB0eSA9IGJvYXJkW3Jvd0luZGV4ICsgMV0uZXZlcnkoKGVudHJ5KSA9PiBlbnRyeSA9PT0gbnVsbCk7XG4gICAgICAgICAgICBpZiAobmV4dFJvd0lzRW1wdHkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgbmV4dFJvd0lzT2NjdXBpZWQgPSBib2FyZFtyb3dJbmRleCArIDFdLmV2ZXJ5KFxuICAgICAgICAgICAgICAoZW50cnkpID0+IGVudHJ5ID09PSBcIk9cIiB8fCBlbnRyeSA9PT0gbnVsbCxcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBpZiAobmV4dFJvd0lzT2NjdXBpZWQpIHtcbiAgICAgICAgICAgICAgaXNSZURpc3BsYWNlZCA9IHRydWU7XG4gICAgICAgICAgICAgIHRoaXMuZGlzcGxhY2VTaGlwc1JlY3Vyc2lvbkNvdW50ICs9IDE7XG4gICAgICAgICAgICAgIHRoaXMuZGlzcGxhY2VTaGlwcygpO1xuICAgICAgICAgICAgICB0aGlzLmRpc3BsYWNlU2hpcHNSZWN1cnNpb25Db3VudCAtPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KSgpO1xuICAgIH07XG5cbiAgICBpZiAoaXNSZURpc3BsYWNlZCkge1xuICAgICAgaXNSZURpc3BsYWNlZCA9IGZhbHNlO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHBvcHVsYXRlQm9hcmQgPSAoKCkgPT4ge1xuICAgICAgLy8gU3RvcCBpZiBib2FyZCdzIGZ1bGxcbiAgICAgIGNvbnN0IGlzQm9hcmRGdWxsID0gYm9hcmQuZXZlcnkoKHJvdykgPT4gcm93LmluY2x1ZGVzKFwiT1wiKSk7XG4gICAgICBpZiAoaXNCb2FyZEZ1bGwpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBsZWdhbE1vdmVzID0gdGhpcy5nZXRMZWdhbE1vdmVzKCk7XG5cbiAgICAgIGNvbnN0IF93aXRoU3BlY2lmaWVkU2hpcCA9IChzaGlwLCBpbmRleCkgPT4ge1xuICAgICAgICBjb25zdCByYW5kb21Sb3dJbmRleCA9IGdlbmVyYXRlUmFuZG9tUm93SW5kZXgoKTtcbiAgICAgICAgY29uc3Qgc2hpcE1vdmVzID0gbGVnYWxNb3Zlc1tpbmRleF07XG4gICAgICAgIGxldCBzaGlwTGVuZ3RoID0gbnVsbDtcblxuICAgICAgICBzd2l0Y2ggKHNoaXApIHtcbiAgICAgICAgICBjYXNlIFwiQ2FycmllclwiOlxuICAgICAgICAgICAgc2hpcExlbmd0aCA9IHRoaXMuc2hpcHMuQ2Fycmllci5sZW5ndGg7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIFwiQmF0dGxlc2hpcFwiOlxuICAgICAgICAgICAgc2hpcExlbmd0aCA9IHRoaXMuc2hpcHMuQmF0dGxlc2hpcC5sZW5ndGg7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIFwiRGVzdHJveWVyXCI6XG4gICAgICAgICAgICBzaGlwTGVuZ3RoID0gMy41O1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSBcIlN1Ym1hcmluZVwiOlxuICAgICAgICAgICAgc2hpcExlbmd0aCA9IHRoaXMuc2hpcHMuU3VibWFyaW5lLmxlbmd0aDtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgXCJQYXRyb2wgQm9hdFwiOlxuICAgICAgICAgICAgc2hpcExlbmd0aCA9IHRoaXMuc2hpcHNbXCJQYXRyb2wgQm9hdFwiXS5sZW5ndGg7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHJhbmRvbVNoaXBNb3ZlID0gZ2V0UmFuZG9tTW92ZUluZGV4KHNoaXBNb3Zlcy5sZW5ndGgpO1xuICAgICAgICBjb25zdCBmaXJzdFNoaXBNb3ZlID0gc2hpcE1vdmVzW3JhbmRvbVNoaXBNb3ZlXVswXTtcbiAgICAgICAgY29uc3Qgc2hpcE1vdmVMYXN0SW5kZXggPSBzaGlwTW92ZXNbcmFuZG9tU2hpcE1vdmVdLmxlbmd0aCAtIDE7XG4gICAgICAgIGNvbnN0IGxhc3RTaGlwTW92ZSA9IHNoaXBNb3Zlc1tyYW5kb21TaGlwTW92ZV1bc2hpcE1vdmVMYXN0SW5kZXhdO1xuXG4gICAgICAgIGJvYXJkLmZvckVhY2goKHJvdywgcm93SW5kZXgpID0+IHtcbiAgICAgICAgICBpZiAocm93SW5kZXggPT09IHJhbmRvbVJvd0luZGV4KSB7XG4gICAgICAgICAgICAvLyBBbHdheXMgb2NjdXB5IGVtcHR5IHJvd1xuICAgICAgICAgICAgd2hpbGUgKHJvdy5pbmNsdWRlcyhcIk9cIikpIHtcbiAgICAgICAgICAgICAgLy8gU3RvcCBsb29wIGlmIGJvYXJkIGlzIGZ1bGxcbiAgICAgICAgICAgICAgY29uc3QgaXNCb2FyZEZ1bGwgPSBib2FyZC5ldmVyeSgocm93KSA9PiByb3cuaW5jbHVkZXMoXCJPXCIpKTtcbiAgICAgICAgICAgICAgaWYgKGlzQm9hcmRGdWxsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgX3dpdGhTcGVjaWZpZWRTaGlwKHNoaXAsIGluZGV4KTtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcm93LmZpbGwoc2hpcExlbmd0aCwgZmlyc3RTaGlwTW92ZSwgbGFzdFNoaXBNb3ZlICsgMSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgdXBkYXRlTGVnYWxNb3Zlc0luQm9hcmQocmFuZG9tUm93SW5kZXgsIHNoaXBMZW5ndGgpO1xuICAgICAgfTtcblxuICAgICAgX3dpdGhTcGVjaWZpZWRTaGlwKFwiQ2FycmllclwiLCAwKTtcbiAgICAgIF93aXRoU3BlY2lmaWVkU2hpcChcIkJhdHRsZXNoaXBcIiwgMSk7XG4gICAgICBfd2l0aFNwZWNpZmllZFNoaXAoXCJEZXN0cm95ZXJcIiwgMik7XG4gICAgICBfd2l0aFNwZWNpZmllZFNoaXAoXCJTdWJtYXJpbmVcIiwgMyk7XG4gICAgICBfd2l0aFNwZWNpZmllZFNoaXAoXCJQYXRyb2wgQm9hdFwiLCA0KTtcbiAgICB9KSgpO1xuXG4gICAgaWYgKHRoaXMuZGlzcGxhY2VTaGlwc1JlY3Vyc2lvbkNvdW50ID09PSAwKSB7XG4gICAgICByZXR1cm4gdGhpcy5ib2FyZDtcbiAgICB9XG4gIH1cblxuICByZWNlaXZlQXR0YWNrKFhZKSB7XG4gICAgbGV0IGhpdFN0YXR1cyA9IFwiXCI7XG5cbiAgICBjb25zdCBnZW5lcmF0ZUtleXMgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgLy8gQWxwaGFiZXRzIEEtSlxuICAgICAgY29uc3QgYWxwaGFiZXRzID0gW107XG4gICAgICBmb3IgKGxldCBuID0gNjU7IG4gPD0gNzQ7IG4rKykge1xuICAgICAgICBhbHBoYWJldHMucHVzaChTdHJpbmcuZnJvbUNoYXJDb2RlKG4pKTtcbiAgICAgIH1cblxuICAgICAgY29uc3Qga2V5cyA9IFtdO1xuICAgICAgZm9yIChsZXQgbSA9IDE7IG0gPD0gMTA7IG0rKykge1xuICAgICAgICBjb25zdCBzdWJLZXlzID0gW107XG4gICAgICAgIGZvciAoY29uc3QgbGV0dGVyIG9mIGFscGhhYmV0cykge1xuICAgICAgICAgIHN1YktleXMucHVzaChgJHttfWAgKyBsZXR0ZXIpO1xuICAgICAgICB9XG4gICAgICAgIGtleXMucHVzaChzdWJLZXlzKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGtleXM7XG4gICAgfSkoKTtcblxuICAgIGNvbnN0IGFzc2lnbktleXNUb0JvYXJkSW5kaWNlcyA9IChmdW5jdGlvbiAoKSB7XG4gICAgICBjb25zdCBLZXlzQm94ID0ge307XG4gICAgICBjb25zdCBrZXlzID0gZ2VuZXJhdGVLZXlzO1xuXG4gICAgICBmb3IgKGxldCByb3dJbmRleCA9IDA7IHJvd0luZGV4IDwgMTA7IHJvd0luZGV4KyspIHtcbiAgICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IDEwOyBpbmRleCsrKSB7XG4gICAgICAgICAgS2V5c0JveFtgJHtrZXlzW3Jvd0luZGV4XVtpbmRleF19YF0gPSBbaW5kZXgsIHJvd0luZGV4XTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIEtleXNCb3g7XG4gICAgfSkoKTtcblxuICAgIGNvbnN0IG9jY3VweUNob3NlblNwb3QgPSAoKCkgPT4ge1xuICAgICAgY29uc3QgYm9hcmQgPSB0aGlzLmJvYXJkO1xuICAgICAgY29uc3QgS2V5c0JveCA9IGFzc2lnbktleXNUb0JvYXJkSW5kaWNlcztcblxuICAgICAgY29uc3Qga2V5SW5kZXggPSBLZXlzQm94W1hZXVswXTtcbiAgICAgIGNvbnN0IHJvd0luZGV4ID0gS2V5c0JveFtYWV1bMV07XG4gICAgICBsZXQgaGl0RW50cnkgPSBib2FyZFtyb3dJbmRleF1ba2V5SW5kZXhdO1xuXG4gICAgICBjb25zdCB1cGRhdGVTaGlwTGlmZSA9IChzaGlwTGVuZ3RoKSA9PiB7XG4gICAgICAgIGNvbnN0IHVwZGF0ZVVudGlsRnVsbCA9IChzaGlwKSA9PiB7XG4gICAgICAgICAgaWYgKHNoaXAubnVtSGl0cyA9PT0gc2hpcExlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBzaGlwLmhpdCgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHN3aXRjaCAoc2hpcExlbmd0aCkge1xuICAgICAgICAgIGNhc2UgNTpcbiAgICAgICAgICAgIHVwZGF0ZVVudGlsRnVsbCh0aGlzLnNoaXBzLkNhcnJpZXIpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSA0OlxuICAgICAgICAgICAgdXBkYXRlVW50aWxGdWxsKHRoaXMuc2hpcHMuQmF0dGxlc2hpcCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIDMuNTpcbiAgICAgICAgICAgIHVwZGF0ZVVudGlsRnVsbCh0aGlzLnNoaXBzLkRlc3Ryb3llcik7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICB1cGRhdGVVbnRpbEZ1bGwodGhpcy5zaGlwcy5TdWJtYXJpbmUpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgdXBkYXRlVW50aWxGdWxsKHRoaXMuc2hpcHNbXCJQYXRyb2wgQm9hdFwiXSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgY29uc3QgdHJhY2tNaXNzZWRBdHRhY2tzID0gZnVuY3Rpb24gKGNvb3JkaW5hdGUpIHtcbiAgICAgICAgY29uc3QgbWlzc2VkQXR0YWNrcyA9IFtdO1xuICAgICAgICBtaXNzZWRBdHRhY2tzLnB1c2goY29vcmRpbmF0ZSk7XG4gICAgICB9O1xuXG4gICAgICBjb25zdCB1cGRhdGVTdW5rU3RhdHVzID0gKHNoaXBMZW5ndGgpID0+IHtcbiAgICAgICAgc3dpdGNoIChzaGlwTGVuZ3RoKSB7XG4gICAgICAgICAgY2FzZSA1OlxuICAgICAgICAgICAgdGhpcy5zaGlwcy5DYXJyaWVyLmlzU3VuaygpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSA0OlxuICAgICAgICAgICAgdGhpcy5zaGlwcy5CYXR0bGVzaGlwLmlzU3VuaygpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAzLjU6XG4gICAgICAgICAgICB0aGlzLnNoaXBzLkRlc3Ryb3llci5pc1N1bmsoKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgIHRoaXMuc2hpcHMuU3VibWFyaW5lLmlzU3VuaygpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgdGhpcy5zaGlwc1tcIlBhdHJvbCBCb2F0XCJdLmlzU3VuaygpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIGNvbnN0IGFsbFNoaXBzU3VuayA9ICgpID0+IHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIHRoaXMuc2hpcHMuQ2Fycmllci5zdW5rU3RhdHVzICYmXG4gICAgICAgICAgdGhpcy5zaGlwcy5CYXR0bGVzaGlwLnN1bmtTdGF0dXMgJiZcbiAgICAgICAgICB0aGlzLnNoaXBzLkRlc3Ryb3llci5zdW5rU3RhdHVzICYmXG4gICAgICAgICAgdGhpcy5zaGlwcy5TdWJtYXJpbmUuc3Vua1N0YXR1cyAmJlxuICAgICAgICAgIHRoaXMuc2hpcHNbXCJQYXRyb2wgQm9hdFwiXS5zdW5rU3RhdHVzXG4gICAgICAgICkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgaWYgKGhpdEVudHJ5ID09PSBudWxsIHx8IGhpdEVudHJ5ID09PSBcIk9cIikge1xuICAgICAgICBib2FyZFtyb3dJbmRleF1ba2V5SW5kZXhdID0gXCJYXCI7XG4gICAgICAgIHRyYWNrTWlzc2VkQXR0YWNrcyhYWSk7XG4gICAgICAgIGhpdFN0YXR1cyA9IFwiRmFpbFwiO1xuICAgICAgICByZXR1cm4gXCJGYWlsXCI7XG4gICAgICB9IGVsc2UgaWYgKFxuICAgICAgICBoaXRFbnRyeSA9PT0gdGhpcy5zaGlwcy5DYXJyaWVyLmxlbmd0aCB8fFxuICAgICAgICBoaXRFbnRyeSA9PT0gdGhpcy5zaGlwcy5CYXR0bGVzaGlwLmxlbmd0aCB8fFxuICAgICAgICBoaXRFbnRyeSA9PT0gMy41IHx8XG4gICAgICAgIGhpdEVudHJ5ID09PSB0aGlzLnNoaXBzLlN1Ym1hcmluZS5sZW5ndGggfHxcbiAgICAgICAgaGl0RW50cnkgPT09IHRoaXMuc2hpcHNbXCJQYXRyb2wgQm9hdFwiXS5sZW5ndGhcbiAgICAgICkge1xuICAgICAgICBib2FyZFtyb3dJbmRleF1ba2V5SW5kZXhdID0gXCJYXCI7XG4gICAgICAgIHVwZGF0ZVNoaXBMaWZlKGhpdEVudHJ5KTtcbiAgICAgICAgdXBkYXRlU3Vua1N0YXR1cyhoaXRFbnRyeSk7XG4gICAgICAgIGFsbFNoaXBzU3VuaygpO1xuICAgICAgICBoaXRTdGF0dXMgPSBcIlN1Y2Nlc3NcIjtcbiAgICAgICAgcmV0dXJuIFwiU3VjY2Vzc1wiO1xuICAgICAgfSBlbHNlIGlmIChoaXRFbnRyeSA9PT0gXCJYXCIpIHtcbiAgICAgICAgaGl0U3RhdHVzID0gXCJPY2N1cGllZFwiO1xuICAgICAgICByZXR1cm4gXCJPY2N1cGllZFwiO1xuICAgICAgfVxuICAgIH0pKCk7XG5cbiAgICByZXR1cm4gaGl0U3RhdHVzO1xuICB9XG59XG5cbmNsYXNzIFBsYXllciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMudXNlciA9IG5ldyBHYW1lYm9hcmQoKTtcbiAgICB0aGlzLnVzZXIuZGlzcGxhY2VTaGlwcygpO1xuXG4gICAgdGhpcy5jb21wdXRlciA9IG5ldyBHYW1lYm9hcmQoKTtcbiAgICB0aGlzLmNvbXB1dGVyLmRpc3BsYWNlU2hpcHMoKTtcbiAgICB0aGlzLmNvbXB1dGVyUmFuZG9tUGlja0NvdW50ID0gMDtcbiAgICB0aGlzLmtleXNVcGRhdGUgPSBudWxsO1xuICB9XG5cbiAgdXNlclR1cm4oWFkpIHtcbiAgICB0aGlzLmNvbXB1dGVyLnJlY2VpdmVBdHRhY2soWFkpO1xuICB9XG5cbiAgY29tcHV0ZXJUdXJuKCkge1xuICAgIGNvbnN0IGdlbmVyYXRlUmFuZG9tS2V5ID0gKCkgPT4ge1xuICAgICAgY29uc3QgZ2V0S2V5cyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY29uc3QgYWxwaGFiZXRzID0gW107XG4gICAgICAgIGNvbnN0IGtleXMgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgbiA9IDY1OyBuIDw9IDc0OyBuKyspIHtcbiAgICAgICAgICBhbHBoYWJldHMucHVzaChTdHJpbmcuZnJvbUNoYXJDb2RlKG4pKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBtID0gMTsgbSA8PSAxMDsgbSsrKSB7XG4gICAgICAgICAgZm9yIChjb25zdCBsZXR0ZXIgb2YgYWxwaGFiZXRzKSB7XG4gICAgICAgICAgICBrZXlzLnB1c2goYCR7bX1gICsgbGV0dGVyKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGtleXM7XG4gICAgICB9O1xuXG4gICAgICBjb25zdCBhc3NpZ25HZW5lcmF0ZWRLZXlzT25jZSA9ICgoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLmtleXNVcGRhdGUgPT09IG51bGwpIHtcbiAgICAgICAgICB0aGlzLmtleXNVcGRhdGUgPSBnZXRLZXlzKCk7XG4gICAgICAgIH1cbiAgICAgIH0pKCk7XG5cbiAgICAgIGxldCByYW5kb21LZXkgPSBudWxsO1xuICAgICAgY29uc3QgdXBkYXRlS2V5cyA9ICgoKSA9PiB7XG4gICAgICAgIGNvbnN0IHJhbmRvbUtleUluZGV4ID0gTWF0aC5mbG9vcihcbiAgICAgICAgICBNYXRoLnJhbmRvbSgpICogKDEwMCAtIHRoaXMuY29tcHV0ZXJSYW5kb21QaWNrQ291bnQpLFxuICAgICAgICApO1xuICAgICAgICByYW5kb21LZXkgPSB0aGlzLmtleXNVcGRhdGVbcmFuZG9tS2V5SW5kZXhdO1xuICAgICAgICB0aGlzLmtleXNVcGRhdGUuc3BsaWNlKHJhbmRvbUtleUluZGV4LCAxKTtcbiAgICAgICAgLy8gSW5jcmVhc2UgY291bnQgdG8gZW5hYmxlIG5leHQgcmFuZG9tS2V5SW5kZXggYmUgYSBsZWdhbCBpbmRleFxuICAgICAgICB0aGlzLmNvbXB1dGVyUmFuZG9tUGlja0NvdW50ICs9IDE7XG4gICAgICB9KSgpO1xuXG4gICAgICByZXR1cm4gcmFuZG9tS2V5O1xuICAgIH07XG4gICAgY29uc3QgcmFuZG9tS2V5ID0gZ2VuZXJhdGVSYW5kb21LZXkoKTtcblxuICAgIGNvbnN0IHBpY2tMZWdhbE1vdmUgPSAoKCkgPT4ge1xuICAgICAgY29uc3QgYm9hcmQgPSB0aGlzLnVzZXIuYm9hcmQ7XG4gICAgICBjb25zdCByZXNwb25zZSA9IHRoaXMudXNlci5yZWNlaXZlQXR0YWNrKHJhbmRvbUtleSk7XG4gICAgfSkoKTtcblxuICAgIHJldHVybiByYW5kb21LZXk7XG4gIH1cbn1cblxuLy8gbW9kdWxlLmV4cG9ydHMgPSB7XG4vLyAgIFNoaXAsXG4vLyAgIEdhbWVib2FyZCxcbi8vICAgUGxheWVyLFxuLy8gfTtcblxuZXhwb3J0IHsgUGxheWVyIH07XG4iLCIvLyBJbXBvcnRzXG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyBmcm9tIFwiLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanNcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18gZnJvbSBcIi4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanNcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX0dFVF9VUkxfSU1QT1JUX19fIGZyb20gXCIuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvZ2V0VXJsLmpzXCI7XG52YXIgX19fQ1NTX0xPQURFUl9VUkxfSU1QT1JUXzBfX18gPSBuZXcgVVJMKFwiLi9hc3NldHMvc2hpcC1lZGl0LmpwZ1wiLCBpbXBvcnQubWV0YS51cmwpO1xudmFyIF9fX0NTU19MT0FERVJfVVJMX0lNUE9SVF8xX19fID0gbmV3IFVSTChcIi4vYXNzZXRzL3ZlcnRpY2Fsc2hpcC5qcGdcIiwgaW1wb3J0Lm1ldGEudXJsKTtcbnZhciBfX19DU1NfTE9BREVSX0VYUE9SVF9fXyA9IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fKTtcbnZhciBfX19DU1NfTE9BREVSX1VSTF9SRVBMQUNFTUVOVF8wX19fID0gX19fQ1NTX0xPQURFUl9HRVRfVVJMX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX1VSTF9JTVBPUlRfMF9fXyk7XG52YXIgX19fQ1NTX0xPQURFUl9VUkxfUkVQTEFDRU1FTlRfMV9fXyA9IF9fX0NTU19MT0FERVJfR0VUX1VSTF9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9VUkxfSU1QT1JUXzFfX18pO1xuLy8gTW9kdWxlXG5fX19DU1NfTE9BREVSX0VYUE9SVF9fXy5wdXNoKFttb2R1bGUuaWQsIGAvKiBib2R5ICoge1xuICBib3JkZXI6IDJweCBzb2xpZCBidXJseXdvb2Q7XG59ICovXG5cbmJvZHkge1xuICBkaXNwbGF5OiBncmlkO1xuICBncmlkLXRlbXBsYXRlOiA0ZnIgMWZyIC8gMWZyIDFmcjtcbiAgZ2FwOiA4cmVtO1xuICBwYWRkaW5nOiA0cmVtIDhyZW07XG4gIG1hcmdpbjogMDtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuXG4gIGZvbnQtZmFtaWx5OiBcIlJhbGV3YXlcIiwgc2Fucy1zZXJpZjtcbiAgZm9udC1zaXplOiAxLjNyZW07XG4gIGxldHRlci1zcGFjaW5nOiAwLjFyZW07XG4gIGhlaWdodDogMTAwdmg7XG4gIGJhY2tncm91bmQtaW1hZ2U6IHVybCgke19fX0NTU19MT0FERVJfVVJMX1JFUExBQ0VNRU5UXzBfX199KTtcbiAgYmFja2dyb3VuZC1zaXplOiBjb3ZlcjtcbiAgYmFja2dyb3VuZC1wb3NpdGlvbjogY2VudGVyIGNlbnRlcjtcbn1cblxuYm9keSA+IHNlY3Rpb24ge1xuICBkaXNwbGF5OiBncmlkO1xuICBncmlkLXRlbXBsYXRlOiAxZnIgMWZyIDEwZnIvIDJmciA4ZnI7XG4gIGdhcDogMC4zcmVtO1xuICBwYWRkaW5nOiAwLjVyZW0gN3JlbSAwLjVyZW0gMXJlbTtcbiAgei1pbmRleDogMTtcbn1cblxuLmNvbmZpZy1kaWFsb2cge1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICB3aWR0aDogMjByZW07XG4gIHBhZGRpbmc6IDFyZW07XG4gIGdhcDogMXJlbTtcbiAgYmFja2dyb3VuZDogcmdiYSgzNCwgMTAwLCAxNzUsIDAuOCk7XG4gIGJvcmRlcjogMC4ycmVtIHNvbGlkIHJnYigxNywgNTAsIDg3KTtcbiAgYm9yZGVyLXJhZGl1czogMnJlbTtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICB0b3A6IDUwJTtcbiAgbGVmdDogNTAlO1xuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgtNTAlLCAtNTAlKTtcbiAgdmlzaWJpbGl0eTogaGlkZGVuO1xuICBvcGFjaXR5OiAwO1xuICB0cmFuc2l0aW9uOiBvcGFjaXR5IDAuM3MgZWFzZS1pbi1vdXQ7XG4gIHotaW5kZXg6IDI7XG59XG5cbi5jb25maWctZGlhbG9nID4gZGl2IHtcbiAgZGlzcGxheTogZmxleDtcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xufVxuXG4uY29uZmlnLWRpYWxvZyBzcGFuIHtcbiAgYWxpZ24tc2VsZjogY2VudGVyO1xuICBmb250LXdlaWdodDogODAwO1xuICBjb2xvcjogd2hpdGU7XG4gIGJhY2tncm91bmQ6IHJnYmEoMjQ4LCA3MSwgNDcsIDAuOCk7XG4gIG1hcmdpbi1sZWZ0OiAwLjVyZW07XG4gIHBhZGRpbmc6IDAuMnJlbSAwLjNyZW0gMC4xcmVtIDAuM3JlbTtcbiAgYm9yZGVyLXJhZGl1czogMTByZW07XG4gIGN1cnNvcjogcG9pbnRlcjtcbn1cblxuLmNvbmZpZy1kaWFsb2cgc3Bhbjpob3ZlciB7XG4gIGJhY2tncm91bmQ6IHJnYigyNDgsIDcxLCA0Nyk7XG59XG5cbi5jb25maWctZGlhbG9nIGJ1dHRvbixcbi5jb25maWctZGlhbG9nIHNlbGVjdCB7XG4gIGFsaWduLXNlbGY6IGNlbnRlcjtcbiAgZm9udC1zaXplOiAxLjA1cmVtO1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gIGNvbG9yOiB3aGl0ZTtcbiAgd2lkdGg6IDdyZW07XG4gIGJvcmRlci1yYWRpdXM6IDAuNXJlbTtcbiAgY3Vyc29yOiBwb2ludGVyO1xuICBiYWNrZ3JvdW5kOiByZ2IoMTcsIDUwLCA4Nyk7XG59XG5cbi5jb25maWctZGlhbG9nIGJ1dHRvbjpob3Zlcixcbi5jb25maWctZGlhbG9nIHNlbGVjdDpob3ZlciB7XG4gIGJvcmRlcjogMC4xcmVtIHNvbGlkIHdoaXRlO1xufVxuXG4uY29uZmlnLWRpYWxvZyBmaWVsZHNldCB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICBnYXA6IDAuMnJlbTtcbiAgcGFkZGluZzogMC4ycmVtO1xuICBib3JkZXItcmFkaXVzOiAwLjVyZW07XG4gIGJvcmRlci1sZWZ0OiAwLjJyZW0gc29saWQgcmdiKDE3LCA1MCwgODcpO1xuICBib3JkZXItcmlnaHQ6IDAuMnJlbSBzb2xpZCByZ2IoMTcsIDUwLCA4Nyk7XG4gIGJhY2tncm91bmQ6IHJnYmEoMTcsIDUwLCA4NywgMC40KTtcbn1cblxuZmllbGRzZXQgPiBidXR0b24ge1xuICBoZWlnaHQ6IDEuNXJlbTtcbn1cblxubGVnZW5kIHtcbiAgZm9udC1zaXplOiAxLjJyZW07XG4gIGNvbG9yOiB3aGl0ZTtcbiAgZm9udC13ZWlnaHQ6IDgwMDtcbiAgcGFkZGluZy1sZWZ0OiAwLjJyZW07XG4gIGN1cnNvcjogY29udGV4dC1tZW51O1xufVxuXG4uY29uZmlnLWJveCB7XG4gIHdpZHRoOiBmaXQtY29udGVudDtcbn1cblxuLmNvbmZpZy1ib3ggPiBidXR0b24ge1xuICBmb250LXNpemU6IDEuMXJlbTtcbiAgbGV0dGVyLXNwYWNpbmc6IDAuMDVyZW07XG4gIGJvcmRlci1yYWRpdXM6IDAuNXJlbTtcbiAgaGVpZ2h0OiAycmVtO1xuICBiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQodG8gcmlnaHQsIHJnYmEoNSwgNiwgOCwgMC44KSwgcmdiYSgzOSwgMTE0LCAxOTksIDAuOCkpO1xuICBvcGFjaXR5OiAwLjg7XG4gIGN1cnNvcjogcG9pbnRlcjtcbiAgdHJhbnNpdGlvbjpcbiAgICBiYWNrZ3JvdW5kIDAuNXMgZWFzZS1vdXQsXG4gICAgY29sb3IgMC41cyBlYXNlLW91dCxcbiAgICB0cmFuc2Zvcm0gMC4zcyBlYXNlLWluLW91dDtcbn1cblxuLmNvbmZpZy1ib3ggPiBidXR0b246aG92ZXIge1xuICBiYWNrZ3JvdW5kOiByZ2IoMzQsIDEwMCwgMTc1KTtcbiAgYm9yZGVyOiAwLjFyZW0gc29saWQgd2hpdGU7XG4gIHRyYW5zZm9ybTogc2NhbGUoMS4wNSk7XG59XG5cbi5jb25maWctYm94IHN2ZyB7XG4gIHdpZHRoOiAxLjhyZW07XG59XG5cbi5jb25maWctYm94ID4gYnV0dG9uOmFjdGl2ZSB7XG4gIGJhY2tncm91bmQ6IHJnYigxNywgNTAsIDg3KTtcbn1cblxuaDIge1xuICBncmlkLXJvdzogc3BhbiAxO1xuICBncmlkLWNvbHVtbjogMiAvIC0xO1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gIGZvbnQtc2l6ZTogMnJlbTtcbiAgZm9udC13ZWlnaHQ6IDYwMDtcbiAgcGFkZGluZzogMC4yNXJlbSAxcmVtIDAgMXJlbTtcbiAganVzdGlmeS1zZWxmOiBjZW50ZXI7XG4gIGJhY2tncm91bmQ6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC40KTtcbiAgYm9yZGVyLXRvcDogMC4zcmVtIHNvbGlkIHJnYigwLCAwLCAwKTtcbiAgYm9yZGVyLWJvdHRvbTogMC4zcmVtIHNvbGlkIHJnYigwLCAwLCAwKTtcbiAgY3Vyc29yOiBjb250ZXh0LW1lbnU7XG4gIHRyYW5zaXRpb246IHRyYW5zZm9ybSAwLjNzIGVhc2UtaW4tb3V0O1xufVxuXG5oMjpob3ZlciB7XG4gIGJhY2tncm91bmQ6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC42KTtcbiAgdHJhbnNmb3JtOiBzY2FsZSgxLjEpO1xufVxuXG4uaGVhZCxcbi50YWlsIHtcbiAgZGlzcGxheTogZmxleDtcbiAgYmFja2dyb3VuZDogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjQpO1xuICBib3JkZXItcmFkaXVzOiAxcmVtO1xuICBjdXJzb3I6IGNvbnRleHQtbWVudTtcbn1cblxuLmhlYWQge1xuICBhbGlnbi1zZWxmOiBmbGV4LWVuZDtcbiAgZ3JpZC1yb3c6IDIgLyAzO1xuICBncmlkLWNvbHVtbjogMiAvIDM7XG59XG5cbi50YWlsIHtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAganVzdGlmeS1zZWxmOiBmbGV4LWVuZDtcbiAgZ3JpZC1yb3c6IDMgLyAtMTtcbn1cblxuLmhlYWQgPiBkaXYsXG4udGFpbCA+IGRpdiB7XG4gIGZsZXg6IDEgMSBhdXRvO1xuICBwYWRkaW5nLXRvcDogMC41cmVtO1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gIGZvbnQtd2VpZ2h0OiA2MDA7XG4gIG1pbi13aWR0aDogMnJlbTtcbiAgbWluLWhlaWdodDogMnJlbTtcbiAgdHJhbnNpdGlvbjogdHJhbnNmb3JtIDAuMXMgZWFzZS1pbjtcbn1cblxuLmhlYWQgPiBkaXY6aG92ZXIsXG4udGFpbCA+IGRpdjpob3ZlciB7XG4gIGZvbnQtd2VpZ2h0OiA4MDA7XG4gIHRyYW5zZm9ybTogc2NhbGUoMS4yKTtcbn1cblxuLmFkbWlyYWwtZ3JvdW5kcyxcbi5haS1ncm91bmRzIHtcbiAgZ3JpZC1yb3c6IDMgLyAtMTtcbiAgZ3JpZC1jb2x1bW46IDIgLyAtMTtcbiAgZGlzcGxheTogZ3JpZDtcbiAgZ3JpZC10ZW1wbGF0ZTogcmVwZWF0KDEwLCAxZnIpIC8gcmVwZWF0KDEwLCAxZnIpO1xuICBib3JkZXI6IDJweCBzb2xpZCByZ2IoMjU1LCAyNTUsIDI1NSk7XG4gIGJvcmRlci1yYWRpdXM6IDFyZW07XG4gIHRyYW5zaXRpb246IHRyYW5zZm9ybSAwLjI1cyBlYXNlLWluLW91dDtcbn1cblxuLnNjYWxlRGl2cyB7XG4gIHRyYW5zZm9ybTogc2NhbGUoMS4wMik7XG59XG5cbi5hZG1pcmFsLWdyb3VuZHM6aG92ZXIsXG4uYWktZ3JvdW5kczpob3ZlciB7XG4gIHRyYW5zZm9ybTogc2NhbGUoMS4wMik7XG59XG5cbi5hZG1pcmFsLWdyb3VuZHMgPiBkaXYsXG4uYWktZ3JvdW5kcyA+IGRpdiB7XG4gIGdyaWQtY29sdW1uOiBzcGFuIDE7XG4gIGdyaWQtcm93OiBzcGFuIDE7XG4gIG1pbi13aWR0aDogMnJlbTtcbiAgbWluLWhlaWdodDogMnJlbTtcblxuICBkaXNwbGF5OiBmbGV4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICBmb250LXdlaWdodDogODAwO1xuICBib3JkZXI6IDJweCBzb2xpZCByZ2IoMjU1LCAyNTUsIDI1NSk7XG4gIGN1cnNvcjogcG9pbnRlcjtcbiAgdHJhbnNpdGlvbjogdHJhbnNmb3JtIDAuMnMgZWFzZS1pbi1vdXQ7XG59XG5cbi5hZG1pcmFsLWdyb3VuZHMgc3Bhbixcbi5haS1ncm91bmRzIHNwYW4ge1xuICBmb250LXNpemU6IDEuN3JlbTtcbn1cblxuLmFkbWlyYWwtZ3JvdW5kcyA+IGRpdjpob3Zlcixcbi5haS1ncm91bmRzID4gZGl2OmhvdmVyIHtcbiAgdHJhbnNmb3JtOiBzY2FsZSgxLjEpO1xufVxuXG4uYWRtaXJhbC1ncm91bmRzID4gZGl2OmZpcnN0LWNoaWxkLFxuLmFpLWdyb3VuZHMgPiBkaXY6Zmlyc3QtY2hpbGQge1xuICBib3JkZXItdG9wLWxlZnQtcmFkaXVzOiAxcmVtO1xufVxuXG4uYWRtaXJhbC1ncm91bmRzID4gZGl2Om50aC1jaGlsZCgxMCksXG4uYWktZ3JvdW5kcyA+IGRpdjpudGgtY2hpbGQoMTApIHtcbiAgYm9yZGVyLXRvcC1yaWdodC1yYWRpdXM6IDFyZW07XG59XG5cbi5hZG1pcmFsLWdyb3VuZHMgPiBkaXY6bnRoLWxhc3QtY2hpbGQoMTApLFxuLmFpLWdyb3VuZHMgPiBkaXY6bnRoLWxhc3QtY2hpbGQoMTApIHtcbiAgYm9yZGVyLWJvdHRvbS1sZWZ0LXJhZGl1czogMXJlbTtcbn1cblxuLmFkbWlyYWwtZ3JvdW5kcyA+IGRpdjpudGgtbGFzdC1jaGlsZCgxKSxcbi5haS1ncm91bmRzID4gZGl2Om50aC1sYXN0LWNoaWxkKDEpIHtcbiAgYm9yZGVyLWJvdHRvbS1yaWdodC1yYWRpdXM6IDFyZW07XG59XG5cbmJvZHkgPiBkaXY6bGFzdC1jaGlsZCB7XG4gIGdyaWQtY29sdW1uOiAxIC8gLTE7XG4gIGFsaWduLXNlbGY6IGZsZXgtc3RhcnQ7XG4gIGp1c3RpZnktc2VsZjogY2VudGVyO1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xuXG4gIGZvbnQtd2VpZ2h0OiA2MDA7XG4gIGJvcmRlcjogMC4ycmVtIHNvbGlkIHJnYmEoMjU1LCAyNTUsIDI1NSwgMC44KTtcbiAgYm9yZGVyLXJhZGl1czogMXJlbTtcbiAgYmFja2dyb3VuZDogcmdiYSgwLCAwLCAwLCAwLjUpO1xuICBjb2xvcjogd2hpdGU7XG4gIGhlaWdodDogM3JlbTtcbiAgd2lkdGg6IDQwcmVtO1xuICBjdXJzb3I6IGNvbnRleHQtbWVudTtcbiAgei1pbmRleDogMTtcbiAgdHJhbnNpdGlvbjogdHJhbnNmb3JtIDAuM3MgZWFzZS1pbi1vdXQ7XG59XG5cbmJvZHkgPiBkaXY6bGFzdC1jaGlsZDpob3ZlciB7XG4gIHRyYW5zZm9ybTogc2NhbGUoMS4wNSk7XG4gIGJvcmRlcjogMC4ycmVtIHNvbGlkIHJnYigyNTUsIDI1NSwgMjU1KTtcbiAgYmFja2dyb3VuZDogcmdiYSgwLCAwLCAwLCAwLjcpO1xufVxuXG5ib2R5ID4gZGl2OmZpcnN0LWNoaWxkIHtcbiAgcG9zaXRpb246IGZpeGVkO1xuICB0b3A6IDA7XG4gIGxlZnQ6IDA7XG4gIHdpZHRoOiAxMDAlO1xuICBoZWlnaHQ6IDEwMCU7XG4gIGJhY2tncm91bmQ6IHJnYmEoMCwgMCwgMCwgMC42KTtcbn1cblxuLmFkbWlyYWwtZ3JvdW5kcyBpbWcsXG4uYWktZ3JvdW5kcyBpbWcge1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIGxlZnQ6IDElO1xuICBib3R0b206IDAuNSU7XG4gIHBvaW50ZXItZXZlbnRzOiBub25lO1xufVxuXG4uY29uZmlnLWRpYWxvZyBpbWcge1xuICBhbGlnbi1zZWxmOiBmbGV4LWVuZDtcbiAgYmFja2dyb3VuZDogcmdiYSgxNywgNTAsIDg3LCAwLjgpO1xuICB3aWR0aDogMnJlbTtcbiAgaGVpZ2h0OiAycmVtO1xuICBwYWRkaW5nOiAwLjJyZW07XG4gIGJvcmRlci1yYWRpdXM6IDAuNXJlbTtcbiAgY3Vyc29yOiBwb2ludGVyO1xufVxuXG4uY29uZmlnLWRpYWxvZyBpbWc6aG92ZXIge1xuICBib3JkZXI6IDAuMXJlbSBzb2xpZCB3aGl0ZTtcbiAgYmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KHRvIGJvdHRvbSByaWdodCwgcmdiKDE3LCA1MCwgODcpLCByZ2JhKDI1NSwgMjU1LCAwLCAwLjQpKTtcbn1cblxuc3ZnIHtcbiAgZmlsbDogd2hpdGU7XG4gIHdpZHRoOiAxLjdyZW07XG59XG5cbkBtZWRpYSAobWF4LXdpZHRoOiAxNTcwcHgpIHtcbiAgYm9keSB7XG4gICAgZ2FwOiA2cmVtO1xuICAgIHBhZGRpbmc6IDZyZW0gNnJlbTtcbiAgfVxuXG4gIGJvZHkgPiBkaXY6bGFzdC1jaGlsZCB7XG4gICAgd2lkdGg6IDM1cmVtO1xuICB9XG4gIC5hZG1pcmFsLWdyb3VuZHMsXG4gIC5haS1ncm91bmRzIHtcbiAgICBhbGlnbi1zZWxmOiBmbGV4LXN0YXJ0O1xuICB9XG4gIC50YWlsLFxuICAuaGVhZCB7XG4gICAgZm9udC1zaXplOiAxLjFyZW07XG4gIH1cbiAgLnRhaWwge1xuICAgIGFsaWduLXNlbGY6IGZsZXgtc3RhcnQ7XG4gIH1cbiAgLmhlYWQgPiBkaXYsXG4gIC50YWlsID4gZGl2IHtcbiAgICBwYWRkaW5nLXRvcDogMC4ycmVtO1xuICB9XG59XG5cbkBtZWRpYSAobWF4LXdpZHRoOiAxMjcwcHgpIHtcbiAgYm9keSB7XG4gICAgZ2FwOiAzcmVtO1xuICAgIHBhZGRpbmc6IDhyZW0gNHJlbTtcbiAgfVxuXG4gIGJvZHkgPiBkaXY6bGFzdC1jaGlsZCB7XG4gICAgd2lkdGg6IDMwcmVtO1xuICAgIGFsaWduLXNlbGY6IGNlbnRlcjtcbiAgfVxuXG4gIGJvZHkgPiBzZWN0aW9uIHtcbiAgICBwYWRkaW5nOiAwLjVyZW0gNXJlbSAwLjVyZW0gMC41cmVtO1xuICB9XG5cbiAgLmFkbWlyYWwtZ3JvdW5kcyBzcGFuLFxuICAuYWktZ3JvdW5kcyBzcGFuIHtcbiAgICBmb250LXNpemU6IDEuMnJlbTtcbiAgfVxufVxuXG5AbWVkaWEgKG1heC13aWR0aDogMTExMHB4KSB7XG4gIGJvZHkge1xuICAgIGdhcDogMXJlbTtcbiAgICBwYWRkaW5nOiA4cmVtIDFyZW07XG4gICAgaGVpZ2h0OiAxMDAlO1xuICB9XG5cbiAgYm9keSA+IHNlY3Rpb24ge1xuICAgIHBhZGRpbmc6IDAuNXJlbSAzcmVtIDAuNXJlbSAwLjVyZW07XG4gIH1cblxuICBoMiB7XG4gICAgZm9udC1zaXplOiAxLjVyZW07XG4gIH1cblxuICBib2R5ID4gZGl2Omxhc3QtY2hpbGQge1xuICAgIHdpZHRoOiAyOHJlbTtcbiAgICBmb250LXNpemU6IDFyZW07XG4gIH1cbn1cblxuQG1lZGlhIChtYXgtd2lkdGg6IDkwMHB4KSB7XG4gIGJvZHkge1xuICAgIGdhcDogMC4zcmVtO1xuICAgIHBhZGRpbmc6IDhyZW0gMC4ycmVtO1xuICAgIGJhY2tncm91bmQtaW1hZ2U6IHVybCgke19fX0NTU19MT0FERVJfVVJMX1JFUExBQ0VNRU5UXzFfX199KTtcbiAgfVxuXG4gIGJvZHkgPiBzZWN0aW9uIHtcbiAgICBwYWRkaW5nOiAwLjVyZW07XG4gIH1cblxuICBib2R5ID4gZGl2Omxhc3QtY2hpbGQge1xuICAgIHdpZHRoOiAyNXJlbTtcbiAgICBhbGlnbi1zZWxmOiBmbGV4LXN0YXJ0O1xuICB9XG5cbiAgLmNvbmZpZy1kaWFsb2cge1xuICAgIGJhY2tncm91bmQ6IHJnYmEoNDYsIDQ2LCA0NiwgMC44KTtcbiAgICBib3JkZXI6IDAuMnJlbSBzb2xpZCByZ2IoMTQzLCAxMDksIDYxKTtcbiAgfVxuXG4gIC5jb25maWctZGlhbG9nIGJ1dHRvbixcbiAgLmNvbmZpZy1kaWFsb2cgc2VsZWN0IHtcbiAgICBiYWNrZ3JvdW5kOiByZ2IoMTQzLCAxMDksIDYxKTtcbiAgfVxuXG4gIC5jb25maWctZGlhbG9nIGZpZWxkc2V0IHtcbiAgICBiYWNrZ3JvdW5kOiByZ2JhKDk1LCA3MywgNDMsIDAuNCk7XG4gICAgYm9yZGVyLWxlZnQ6IDAuMnJlbSBzb2xpZCByZ2IoMTQzLCAxMDksIDYxKTtcbiAgICBib3JkZXItcmlnaHQ6IDAuMnJlbSBzb2xpZCByZ2IoMTQzLCAxMDksIDYxKTtcbiAgfVxuXG4gIC5jb25maWctYm94ID4gYnV0dG9uIHtcbiAgICBiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQodG8gcmlnaHQsIHJnYmEoNSwgNiwgOCwgMC44KSwgcmdiYSgyMjEsIDE2NiwgODgsIDAuOCkpO1xuICB9XG5cbiAgLmNvbmZpZy1ib3ggPiBidXR0b246aG92ZXIge1xuICAgIGJhY2tncm91bmQ6IHJnYigxODUsIDEzOSwgNzQpO1xuICB9XG5cbiAgLmNvbmZpZy1kaWFsb2cgaW1nIHtcbiAgICBiYWNrZ3JvdW5kOiByZ2JhKDk1LCA3MywgNDMsIDAuNik7XG4gIH1cblxuICAuY29uZmlnLWRpYWxvZyBpbWc6aG92ZXIge1xuICAgIGJhY2tncm91bmQ6IGxpbmVhci1ncmFkaWVudCh0byBib3R0b20gcmlnaHQsIHJnYig0OCwgMzcsIDIyKSwgcmdiYSgyNTUsIDI1NSwgMCwgMC41KSk7XG4gIH1cbn1cblxuQG1lZGlhIChtYXgtd2lkdGg6IDc2NXB4KSB7XG4gIGJvZHkge1xuICAgIGdyaWQtdGVtcGxhdGU6IHJlcGVhdCgyLCA0ZnIpIDFmciAvIDFmcjtcbiAgICBwYWRkaW5nOiAwO1xuICB9XG5cbiAgYm9keSA+IHNlY3Rpb24ge1xuICAgIGdyaWQtdGVtcGxhdGU6IDFmciAxZnIgMTBmci8gMWZyIDhmcjtcbiAgICBwYWRkaW5nLXJpZ2h0OiAxLjVyZW07XG4gICAgaGVpZ2h0OiAyN3JlbTtcbiAgfVxufVxuXG5AbWVkaWEgKG1heC13aWR0aDogNDIwcHgpIHtcbiAgLmNvbmZpZy1kaWFsb2cge1xuICAgIGxlZnQ6IDUzJTtcbiAgfVxufVxuXG5AbWVkaWEgKG1heC13aWR0aDogMzkwcHgpIHtcbiAgLmNvbmZpZy1kaWFsb2cge1xuICAgIGxlZnQ6IDU3JTtcbiAgfVxufVxuXG5AbWVkaWEgKG1heC13aWR0aDogMjkwcHgpIHtcbiAgLmNvbmZpZy1kaWFsb2cge1xuICAgIGxlZnQ6IDc4JTtcbiAgfVxufVxuYCwgXCJcIix7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJ3ZWJwYWNrOi8vLi9zcmMvYmF0dGxlZ3JvdW5kLmNzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFBQTs7R0FFRzs7QUFFSDtFQUNFLGFBQWE7RUFDYixnQ0FBZ0M7RUFDaEMsU0FBUztFQUNULGtCQUFrQjtFQUNsQixTQUFTO0VBQ1Qsa0JBQWtCOztFQUVsQixrQ0FBa0M7RUFDbEMsaUJBQWlCO0VBQ2pCLHNCQUFzQjtFQUN0QixhQUFhO0VBQ2IseURBQTZDO0VBQzdDLHNCQUFz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QUFTO0lBQ1Qsa0JBQWtCO0VBQ3BCOztFQUVBO0lBQ0UsWUFBWTtJQUNaLGtCQUFrQjtFQUNwQjs7RUFFQTtJQUNFLGtDQUFrQztFQUNwQzs7RUFFQTs7SUFFRSxpQkFBaUI7RUFDbkI7QUFDRjs7QUFFQTtFQUNFO0lBQ0UsU0FBUztJQUNULGtCQUFrQjtJQUNsQixZQUFZO0VBQ2Q7O0VBRUE7SUFDRSxrQ0FBa0M7RUFDcEM7O0VBRUE7SUFDRSxpQkFBaUI7RUFDbkI7O0VBRUE7SUFDRSxZQUFZO0lBQ1osZUFBZTtFQUNqQjtBQUNGOztBQUVBO0VBQ0U7SUFDRSxXQUFXO0lBQ1gsb0JBQW9CO0lBQ3BCLHlEQUFnRDtFQUNsRDs7RUFFQTtJQUNFLGVBQWU7RUFDakI7O0VBRUE7SUFDRSxZQUFZO0lBQ1osc0JBQXNCO0VBQ3hCOztFQUVBO0lBQ0UsaUNBQWlDO0lBQ2pDLHNDQUFzQztFQUN4Qzs7RUFFQTs7SUFFRSw2QkFBNkI7RUFDL0I7O0VBRUE7SUFDRSxpQ0FBaUM7SUFDakMsMkNBQTJDO0lBQzNDLDRDQUE0QztFQUM5Qzs7RUFFQTtJQUNFLGtGQUFrRjtFQUNwRjs7RUFFQTtJQUNFLDZCQUE2QjtFQUMvQjs7RUFFQTtJQUNFLGlDQUFpQztFQUNuQzs7RUFFQTtJQUNFLHFGQUFxRjtFQUN2RjtBQUNGOztBQUVBO0VBQ0U7SUFDRSx1Q0FBdUM7SUFDdkMsVUFBVTtFQUNaOztFQUVBO0lBQ0Usb0NBQW9DO0lBQ3BDLHFCQUFxQjtJQUNyQixhQUFhO0VBQ2Y7QUFDRjs7QUFFQTtFQUNFO0lBQ0UsU0FBUztFQUNYO0FBQ0Y7O0FBRUE7RUFDRTtJQUNFLFNBQVM7RUFDWDtBQUNGOztBQUVBO0VBQ0U7SUFDRSxTQUFTO0VBQ1g7QUFDRlwiLFwic291cmNlc0NvbnRlbnRcIjpbXCIvKiBib2R5ICoge1xcbiAgYm9yZGVyOiAycHggc29saWQgYnVybHl3b29kO1xcbn0gKi9cXG5cXG5ib2R5IHtcXG4gIGRpc3BsYXk6IGdyaWQ7XFxuICBncmlkLXRlbXBsYXRlOiA0ZnIgMWZyIC8gMWZyIDFmcjtcXG4gIGdhcDogOHJlbTtcXG4gIHBhZGRpbmc6IDRyZW0gOHJlbTtcXG4gIG1hcmdpbjogMDtcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG5cXG4gIGZvbnQtZmFtaWx5OiBcXFwiUmFsZXdheVxcXCIsIHNhbnMtc2VyaWY7XFxuICBmb250LXNpemU6IDEuM3JlbTtcXG4gIGxldHRlci1zcGFjaW5nOiAwLjFyZW07XFxuICBoZWlnaHQ6IDEwMHZoO1xcbiAgYmFja2dyb3VuZC1pbWFnZTogdXJsKC4vYXNzZXRzL3NoaXAtZWRpdC5qcGcpO1xcbiAgYmFja2dyb3VuZC1zaXplOiBjb3ZlcjtcXG4gIGJhY2tncm91bmQtcG9zaXRpb246IGNlbnRlciBjZW50ZXI7XFxufVxcblxcbmJvZHkgPiBzZWN0aW9uIHtcXG4gIGRpc3BsYXk6IGdyaWQ7XFxuICBncmlkLXRlbXBsYXRlOiAxZnIgMWZyIDEwZnIvIDJmciA4ZnI7XFxuICBnYXA6IDAuM3JlbTtcXG4gIHBhZGRpbmc6IDAuNXJlbSA3cmVtIDAuNXJlbSAxcmVtO1xcbiAgei1pbmRleDogMTtcXG59XFxuXFxuLmNvbmZpZy1kaWFsb2cge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICB3aWR0aDogMjByZW07XFxuICBwYWRkaW5nOiAxcmVtO1xcbiAgZ2FwOiAxcmVtO1xcbiAgYmFja2dyb3VuZDogcmdiYSgzNCwgMTAwLCAxNzUsIDAuOCk7XFxuICBib3JkZXI6IDAuMnJlbSBzb2xpZCByZ2IoMTcsIDUwLCA4Nyk7XFxuICBib3JkZXItcmFkaXVzOiAycmVtO1xcbiAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgdG9wOiA1MCU7XFxuICBsZWZ0OiA1MCU7XFxuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgtNTAlLCAtNTAlKTtcXG4gIHZpc2liaWxpdHk6IGhpZGRlbjtcXG4gIG9wYWNpdHk6IDA7XFxuICB0cmFuc2l0aW9uOiBvcGFjaXR5IDAuM3MgZWFzZS1pbi1vdXQ7XFxuICB6LWluZGV4OiAyO1xcbn1cXG5cXG4uY29uZmlnLWRpYWxvZyA+IGRpdiB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xcbn1cXG5cXG4uY29uZmlnLWRpYWxvZyBzcGFuIHtcXG4gIGFsaWduLXNlbGY6IGNlbnRlcjtcXG4gIGZvbnQtd2VpZ2h0OiA4MDA7XFxuICBjb2xvcjogd2hpdGU7XFxuICBiYWNrZ3JvdW5kOiByZ2JhKDI0OCwgNzEsIDQ3LCAwLjgpO1xcbiAgbWFyZ2luLWxlZnQ6IDAuNXJlbTtcXG4gIHBhZGRpbmc6IDAuMnJlbSAwLjNyZW0gMC4xcmVtIDAuM3JlbTtcXG4gIGJvcmRlci1yYWRpdXM6IDEwcmVtO1xcbiAgY3Vyc29yOiBwb2ludGVyO1xcbn1cXG5cXG4uY29uZmlnLWRpYWxvZyBzcGFuOmhvdmVyIHtcXG4gIGJhY2tncm91bmQ6IHJnYigyNDgsIDcxLCA0Nyk7XFxufVxcblxcbi5jb25maWctZGlhbG9nIGJ1dHRvbixcXG4uY29uZmlnLWRpYWxvZyBzZWxlY3Qge1xcbiAgYWxpZ24tc2VsZjogY2VudGVyO1xcbiAgZm9udC1zaXplOiAxLjA1cmVtO1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbiAgY29sb3I6IHdoaXRlO1xcbiAgd2lkdGg6IDdyZW07XFxuICBib3JkZXItcmFkaXVzOiAwLjVyZW07XFxuICBjdXJzb3I6IHBvaW50ZXI7XFxuICBiYWNrZ3JvdW5kOiByZ2IoMTcsIDUwLCA4Nyk7XFxufVxcblxcbi5jb25maWctZGlhbG9nIGJ1dHRvbjpob3ZlcixcXG4uY29uZmlnLWRpYWxvZyBzZWxlY3Q6aG92ZXIge1xcbiAgYm9yZGVyOiAwLjFyZW0gc29saWQgd2hpdGU7XFxufVxcblxcbi5jb25maWctZGlhbG9nIGZpZWxkc2V0IHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG4gIGdhcDogMC4ycmVtO1xcbiAgcGFkZGluZzogMC4ycmVtO1xcbiAgYm9yZGVyLXJhZGl1czogMC41cmVtO1xcbiAgYm9yZGVyLWxlZnQ6IDAuMnJlbSBzb2xpZCByZ2IoMTcsIDUwLCA4Nyk7XFxuICBib3JkZXItcmlnaHQ6IDAuMnJlbSBzb2xpZCByZ2IoMTcsIDUwLCA4Nyk7XFxuICBiYWNrZ3JvdW5kOiByZ2JhKDE3LCA1MCwgODcsIDAuNCk7XFxufVxcblxcbmZpZWxkc2V0ID4gYnV0dG9uIHtcXG4gIGhlaWdodDogMS41cmVtO1xcbn1cXG5cXG5sZWdlbmQge1xcbiAgZm9udC1zaXplOiAxLjJyZW07XFxuICBjb2xvcjogd2hpdGU7XFxuICBmb250LXdlaWdodDogODAwO1xcbiAgcGFkZGluZy1sZWZ0OiAwLjJyZW07XFxuICBjdXJzb3I6IGNvbnRleHQtbWVudTtcXG59XFxuXFxuLmNvbmZpZy1ib3gge1xcbiAgd2lkdGg6IGZpdC1jb250ZW50O1xcbn1cXG5cXG4uY29uZmlnLWJveCA+IGJ1dHRvbiB7XFxuICBmb250LXNpemU6IDEuMXJlbTtcXG4gIGxldHRlci1zcGFjaW5nOiAwLjA1cmVtO1xcbiAgYm9yZGVyLXJhZGl1czogMC41cmVtO1xcbiAgaGVpZ2h0OiAycmVtO1xcbiAgYmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KHRvIHJpZ2h0LCByZ2JhKDUsIDYsIDgsIDAuOCksIHJnYmEoMzksIDExNCwgMTk5LCAwLjgpKTtcXG4gIG9wYWNpdHk6IDAuODtcXG4gIGN1cnNvcjogcG9pbnRlcjtcXG4gIHRyYW5zaXRpb246XFxuICAgIGJhY2tncm91bmQgMC41cyBlYXNlLW91dCxcXG4gICAgY29sb3IgMC41cyBlYXNlLW91dCxcXG4gICAgdHJhbnNmb3JtIDAuM3MgZWFzZS1pbi1vdXQ7XFxufVxcblxcbi5jb25maWctYm94ID4gYnV0dG9uOmhvdmVyIHtcXG4gIGJhY2tncm91bmQ6IHJnYigzNCwgMTAwLCAxNzUpO1xcbiAgYm9yZGVyOiAwLjFyZW0gc29saWQgd2hpdGU7XFxuICB0cmFuc2Zvcm06IHNjYWxlKDEuMDUpO1xcbn1cXG5cXG4uY29uZmlnLWJveCBzdmcge1xcbiAgd2lkdGg6IDEuOHJlbTtcXG59XFxuXFxuLmNvbmZpZy1ib3ggPiBidXR0b246YWN0aXZlIHtcXG4gIGJhY2tncm91bmQ6IHJnYigxNywgNTAsIDg3KTtcXG59XFxuXFxuaDIge1xcbiAgZ3JpZC1yb3c6IHNwYW4gMTtcXG4gIGdyaWQtY29sdW1uOiAyIC8gLTE7XFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxuICBmb250LXNpemU6IDJyZW07XFxuICBmb250LXdlaWdodDogNjAwO1xcbiAgcGFkZGluZzogMC4yNXJlbSAxcmVtIDAgMXJlbTtcXG4gIGp1c3RpZnktc2VsZjogY2VudGVyO1xcbiAgYmFja2dyb3VuZDogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjQpO1xcbiAgYm9yZGVyLXRvcDogMC4zcmVtIHNvbGlkIHJnYigwLCAwLCAwKTtcXG4gIGJvcmRlci1ib3R0b206IDAuM3JlbSBzb2xpZCByZ2IoMCwgMCwgMCk7XFxuICBjdXJzb3I6IGNvbnRleHQtbWVudTtcXG4gIHRyYW5zaXRpb246IHRyYW5zZm9ybSAwLjNzIGVhc2UtaW4tb3V0O1xcbn1cXG5cXG5oMjpob3ZlciB7XFxuICBiYWNrZ3JvdW5kOiByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuNik7XFxuICB0cmFuc2Zvcm06IHNjYWxlKDEuMSk7XFxufVxcblxcbi5oZWFkLFxcbi50YWlsIHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBiYWNrZ3JvdW5kOiByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuNCk7XFxuICBib3JkZXItcmFkaXVzOiAxcmVtO1xcbiAgY3Vyc29yOiBjb250ZXh0LW1lbnU7XFxufVxcblxcbi5oZWFkIHtcXG4gIGFsaWduLXNlbGY6IGZsZXgtZW5kO1xcbiAgZ3JpZC1yb3c6IDIgLyAzO1xcbiAgZ3JpZC1jb2x1bW46IDIgLyAzO1xcbn1cXG5cXG4udGFpbCB7XFxuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAganVzdGlmeS1zZWxmOiBmbGV4LWVuZDtcXG4gIGdyaWQtcm93OiAzIC8gLTE7XFxufVxcblxcbi5oZWFkID4gZGl2LFxcbi50YWlsID4gZGl2IHtcXG4gIGZsZXg6IDEgMSBhdXRvO1xcbiAgcGFkZGluZy10b3A6IDAuNXJlbTtcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG4gIGZvbnQtd2VpZ2h0OiA2MDA7XFxuICBtaW4td2lkdGg6IDJyZW07XFxuICBtaW4taGVpZ2h0OiAycmVtO1xcbiAgdHJhbnNpdGlvbjogdHJhbnNmb3JtIDAuMXMgZWFzZS1pbjtcXG59XFxuXFxuLmhlYWQgPiBkaXY6aG92ZXIsXFxuLnRhaWwgPiBkaXY6aG92ZXIge1xcbiAgZm9udC13ZWlnaHQ6IDgwMDtcXG4gIHRyYW5zZm9ybTogc2NhbGUoMS4yKTtcXG59XFxuXFxuLmFkbWlyYWwtZ3JvdW5kcyxcXG4uYWktZ3JvdW5kcyB7XFxuICBncmlkLXJvdzogMyAvIC0xO1xcbiAgZ3JpZC1jb2x1bW46IDIgLyAtMTtcXG4gIGRpc3BsYXk6IGdyaWQ7XFxuICBncmlkLXRlbXBsYXRlOiByZXBlYXQoMTAsIDFmcikgLyByZXBlYXQoMTAsIDFmcik7XFxuICBib3JkZXI6IDJweCBzb2xpZCByZ2IoMjU1LCAyNTUsIDI1NSk7XFxuICBib3JkZXItcmFkaXVzOiAxcmVtO1xcbiAgdHJhbnNpdGlvbjogdHJhbnNmb3JtIDAuMjVzIGVhc2UtaW4tb3V0O1xcbn1cXG5cXG4uc2NhbGVEaXZzIHtcXG4gIHRyYW5zZm9ybTogc2NhbGUoMS4wMik7XFxufVxcblxcbi5hZG1pcmFsLWdyb3VuZHM6aG92ZXIsXFxuLmFpLWdyb3VuZHM6aG92ZXIge1xcbiAgdHJhbnNmb3JtOiBzY2FsZSgxLjAyKTtcXG59XFxuXFxuLmFkbWlyYWwtZ3JvdW5kcyA+IGRpdixcXG4uYWktZ3JvdW5kcyA+IGRpdiB7XFxuICBncmlkLWNvbHVtbjogc3BhbiAxO1xcbiAgZ3JpZC1yb3c6IHNwYW4gMTtcXG4gIG1pbi13aWR0aDogMnJlbTtcXG4gIG1pbi1oZWlnaHQ6IDJyZW07XFxuXFxuICBkaXNwbGF5OiBmbGV4O1xcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgZm9udC13ZWlnaHQ6IDgwMDtcXG4gIGJvcmRlcjogMnB4IHNvbGlkIHJnYigyNTUsIDI1NSwgMjU1KTtcXG4gIGN1cnNvcjogcG9pbnRlcjtcXG4gIHRyYW5zaXRpb246IHRyYW5zZm9ybSAwLjJzIGVhc2UtaW4tb3V0O1xcbn1cXG5cXG4uYWRtaXJhbC1ncm91bmRzIHNwYW4sXFxuLmFpLWdyb3VuZHMgc3BhbiB7XFxuICBmb250LXNpemU6IDEuN3JlbTtcXG59XFxuXFxuLmFkbWlyYWwtZ3JvdW5kcyA+IGRpdjpob3ZlcixcXG4uYWktZ3JvdW5kcyA+IGRpdjpob3ZlciB7XFxuICB0cmFuc2Zvcm06IHNjYWxlKDEuMSk7XFxufVxcblxcbi5hZG1pcmFsLWdyb3VuZHMgPiBkaXY6Zmlyc3QtY2hpbGQsXFxuLmFpLWdyb3VuZHMgPiBkaXY6Zmlyc3QtY2hpbGQge1xcbiAgYm9yZGVyLXRvcC1sZWZ0LXJhZGl1czogMXJlbTtcXG59XFxuXFxuLmFkbWlyYWwtZ3JvdW5kcyA+IGRpdjpudGgtY2hpbGQoMTApLFxcbi5haS1ncm91bmRzID4gZGl2Om50aC1jaGlsZCgxMCkge1xcbiAgYm9yZGVyLXRvcC1yaWdodC1yYWRpdXM6IDFyZW07XFxufVxcblxcbi5hZG1pcmFsLWdyb3VuZHMgPiBkaXY6bnRoLWxhc3QtY2hpbGQoMTApLFxcbi5haS1ncm91bmRzID4gZGl2Om50aC1sYXN0LWNoaWxkKDEwKSB7XFxuICBib3JkZXItYm90dG9tLWxlZnQtcmFkaXVzOiAxcmVtO1xcbn1cXG5cXG4uYWRtaXJhbC1ncm91bmRzID4gZGl2Om50aC1sYXN0LWNoaWxkKDEpLFxcbi5haS1ncm91bmRzID4gZGl2Om50aC1sYXN0LWNoaWxkKDEpIHtcXG4gIGJvcmRlci1ib3R0b20tcmlnaHQtcmFkaXVzOiAxcmVtO1xcbn1cXG5cXG5ib2R5ID4gZGl2Omxhc3QtY2hpbGQge1xcbiAgZ3JpZC1jb2x1bW46IDEgLyAtMTtcXG4gIGFsaWduLXNlbGY6IGZsZXgtc3RhcnQ7XFxuICBqdXN0aWZ5LXNlbGY6IGNlbnRlcjtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxuXFxuICBmb250LXdlaWdodDogNjAwO1xcbiAgYm9yZGVyOiAwLjJyZW0gc29saWQgcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjgpO1xcbiAgYm9yZGVyLXJhZGl1czogMXJlbTtcXG4gIGJhY2tncm91bmQ6IHJnYmEoMCwgMCwgMCwgMC41KTtcXG4gIGNvbG9yOiB3aGl0ZTtcXG4gIGhlaWdodDogM3JlbTtcXG4gIHdpZHRoOiA0MHJlbTtcXG4gIGN1cnNvcjogY29udGV4dC1tZW51O1xcbiAgei1pbmRleDogMTtcXG4gIHRyYW5zaXRpb246IHRyYW5zZm9ybSAwLjNzIGVhc2UtaW4tb3V0O1xcbn1cXG5cXG5ib2R5ID4gZGl2Omxhc3QtY2hpbGQ6aG92ZXIge1xcbiAgdHJhbnNmb3JtOiBzY2FsZSgxLjA1KTtcXG4gIGJvcmRlcjogMC4ycmVtIHNvbGlkIHJnYigyNTUsIDI1NSwgMjU1KTtcXG4gIGJhY2tncm91bmQ6IHJnYmEoMCwgMCwgMCwgMC43KTtcXG59XFxuXFxuYm9keSA+IGRpdjpmaXJzdC1jaGlsZCB7XFxuICBwb3NpdGlvbjogZml4ZWQ7XFxuICB0b3A6IDA7XFxuICBsZWZ0OiAwO1xcbiAgd2lkdGg6IDEwMCU7XFxuICBoZWlnaHQ6IDEwMCU7XFxuICBiYWNrZ3JvdW5kOiByZ2JhKDAsIDAsIDAsIDAuNik7XFxufVxcblxcbi5hZG1pcmFsLWdyb3VuZHMgaW1nLFxcbi5haS1ncm91bmRzIGltZyB7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICBsZWZ0OiAxJTtcXG4gIGJvdHRvbTogMC41JTtcXG4gIHBvaW50ZXItZXZlbnRzOiBub25lO1xcbn1cXG5cXG4uY29uZmlnLWRpYWxvZyBpbWcge1xcbiAgYWxpZ24tc2VsZjogZmxleC1lbmQ7XFxuICBiYWNrZ3JvdW5kOiByZ2JhKDE3LCA1MCwgODcsIDAuOCk7XFxuICB3aWR0aDogMnJlbTtcXG4gIGhlaWdodDogMnJlbTtcXG4gIHBhZGRpbmc6IDAuMnJlbTtcXG4gIGJvcmRlci1yYWRpdXM6IDAuNXJlbTtcXG4gIGN1cnNvcjogcG9pbnRlcjtcXG59XFxuXFxuLmNvbmZpZy1kaWFsb2cgaW1nOmhvdmVyIHtcXG4gIGJvcmRlcjogMC4xcmVtIHNvbGlkIHdoaXRlO1xcbiAgYmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KHRvIGJvdHRvbSByaWdodCwgcmdiKDE3LCA1MCwgODcpLCByZ2JhKDI1NSwgMjU1LCAwLCAwLjQpKTtcXG59XFxuXFxuc3ZnIHtcXG4gIGZpbGw6IHdoaXRlO1xcbiAgd2lkdGg6IDEuN3JlbTtcXG59XFxuXFxuQG1lZGlhIChtYXgtd2lkdGg6IDE1NzBweCkge1xcbiAgYm9keSB7XFxuICAgIGdhcDogNnJlbTtcXG4gICAgcGFkZGluZzogNnJlbSA2cmVtO1xcbiAgfVxcblxcbiAgYm9keSA+IGRpdjpsYXN0LWNoaWxkIHtcXG4gICAgd2lkdGg6IDM1cmVtO1xcbiAgfVxcbiAgLmFkbWlyYWwtZ3JvdW5kcyxcXG4gIC5haS1ncm91bmRzIHtcXG4gICAgYWxpZ24tc2VsZjogZmxleC1zdGFydDtcXG4gIH1cXG4gIC50YWlsLFxcbiAgLmhlYWQge1xcbiAgICBmb250LXNpemU6IDEuMXJlbTtcXG4gIH1cXG4gIC50YWlsIHtcXG4gICAgYWxpZ24tc2VsZjogZmxleC1zdGFydDtcXG4gIH1cXG4gIC5oZWFkID4gZGl2LFxcbiAgLnRhaWwgPiBkaXYge1xcbiAgICBwYWRkaW5nLXRvcDogMC4ycmVtO1xcbiAgfVxcbn1cXG5cXG5AbWVkaWEgKG1heC13aWR0aDogMTI3MHB4KSB7XFxuICBib2R5IHtcXG4gICAgZ2FwOiAzcmVtO1xcbiAgICBwYWRkaW5nOiA4cmVtIDRyZW07XFxuICB9XFxuXFxuICBib2R5ID4gZGl2Omxhc3QtY2hpbGQge1xcbiAgICB3aWR0aDogMzByZW07XFxuICAgIGFsaWduLXNlbGY6IGNlbnRlcjtcXG4gIH1cXG5cXG4gIGJvZHkgPiBzZWN0aW9uIHtcXG4gICAgcGFkZGluZzogMC41cmVtIDVyZW0gMC41cmVtIDAuNXJlbTtcXG4gIH1cXG5cXG4gIC5hZG1pcmFsLWdyb3VuZHMgc3BhbixcXG4gIC5haS1ncm91bmRzIHNwYW4ge1xcbiAgICBmb250LXNpemU6IDEuMnJlbTtcXG4gIH1cXG59XFxuXFxuQG1lZGlhIChtYXgtd2lkdGg6IDExMTBweCkge1xcbiAgYm9keSB7XFxuICAgIGdhcDogMXJlbTtcXG4gICAgcGFkZGluZzogOHJlbSAxcmVtO1xcbiAgICBoZWlnaHQ6IDEwMCU7XFxuICB9XFxuXFxuICBib2R5ID4gc2VjdGlvbiB7XFxuICAgIHBhZGRpbmc6IDAuNXJlbSAzcmVtIDAuNXJlbSAwLjVyZW07XFxuICB9XFxuXFxuICBoMiB7XFxuICAgIGZvbnQtc2l6ZTogMS41cmVtO1xcbiAgfVxcblxcbiAgYm9keSA+IGRpdjpsYXN0LWNoaWxkIHtcXG4gICAgd2lkdGg6IDI4cmVtO1xcbiAgICBmb250LXNpemU6IDFyZW07XFxuICB9XFxufVxcblxcbkBtZWRpYSAobWF4LXdpZHRoOiA5MDBweCkge1xcbiAgYm9keSB7XFxuICAgIGdhcDogMC4zcmVtO1xcbiAgICBwYWRkaW5nOiA4cmVtIDAuMnJlbTtcXG4gICAgYmFja2dyb3VuZC1pbWFnZTogdXJsKC4vYXNzZXRzL3ZlcnRpY2Fsc2hpcC5qcGcpO1xcbiAgfVxcblxcbiAgYm9keSA+IHNlY3Rpb24ge1xcbiAgICBwYWRkaW5nOiAwLjVyZW07XFxuICB9XFxuXFxuICBib2R5ID4gZGl2Omxhc3QtY2hpbGQge1xcbiAgICB3aWR0aDogMjVyZW07XFxuICAgIGFsaWduLXNlbGY6IGZsZXgtc3RhcnQ7XFxuICB9XFxuXFxuICAuY29uZmlnLWRpYWxvZyB7XFxuICAgIGJhY2tncm91bmQ6IHJnYmEoNDYsIDQ2LCA0NiwgMC44KTtcXG4gICAgYm9yZGVyOiAwLjJyZW0gc29saWQgcmdiKDE0MywgMTA5LCA2MSk7XFxuICB9XFxuXFxuICAuY29uZmlnLWRpYWxvZyBidXR0b24sXFxuICAuY29uZmlnLWRpYWxvZyBzZWxlY3Qge1xcbiAgICBiYWNrZ3JvdW5kOiByZ2IoMTQzLCAxMDksIDYxKTtcXG4gIH1cXG5cXG4gIC5jb25maWctZGlhbG9nIGZpZWxkc2V0IHtcXG4gICAgYmFja2dyb3VuZDogcmdiYSg5NSwgNzMsIDQzLCAwLjQpO1xcbiAgICBib3JkZXItbGVmdDogMC4ycmVtIHNvbGlkIHJnYigxNDMsIDEwOSwgNjEpO1xcbiAgICBib3JkZXItcmlnaHQ6IDAuMnJlbSBzb2xpZCByZ2IoMTQzLCAxMDksIDYxKTtcXG4gIH1cXG5cXG4gIC5jb25maWctYm94ID4gYnV0dG9uIHtcXG4gICAgYmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KHRvIHJpZ2h0LCByZ2JhKDUsIDYsIDgsIDAuOCksIHJnYmEoMjIxLCAxNjYsIDg4LCAwLjgpKTtcXG4gIH1cXG5cXG4gIC5jb25maWctYm94ID4gYnV0dG9uOmhvdmVyIHtcXG4gICAgYmFja2dyb3VuZDogcmdiKDE4NSwgMTM5LCA3NCk7XFxuICB9XFxuXFxuICAuY29uZmlnLWRpYWxvZyBpbWcge1xcbiAgICBiYWNrZ3JvdW5kOiByZ2JhKDk1LCA3MywgNDMsIDAuNik7XFxuICB9XFxuXFxuICAuY29uZmlnLWRpYWxvZyBpbWc6aG92ZXIge1xcbiAgICBiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQodG8gYm90dG9tIHJpZ2h0LCByZ2IoNDgsIDM3LCAyMiksIHJnYmEoMjU1LCAyNTUsIDAsIDAuNSkpO1xcbiAgfVxcbn1cXG5cXG5AbWVkaWEgKG1heC13aWR0aDogNzY1cHgpIHtcXG4gIGJvZHkge1xcbiAgICBncmlkLXRlbXBsYXRlOiByZXBlYXQoMiwgNGZyKSAxZnIgLyAxZnI7XFxuICAgIHBhZGRpbmc6IDA7XFxuICB9XFxuXFxuICBib2R5ID4gc2VjdGlvbiB7XFxuICAgIGdyaWQtdGVtcGxhdGU6IDFmciAxZnIgMTBmci8gMWZyIDhmcjtcXG4gICAgcGFkZGluZy1yaWdodDogMS41cmVtO1xcbiAgICBoZWlnaHQ6IDI3cmVtO1xcbiAgfVxcbn1cXG5cXG5AbWVkaWEgKG1heC13aWR0aDogNDIwcHgpIHtcXG4gIC5jb25maWctZGlhbG9nIHtcXG4gICAgbGVmdDogNTMlO1xcbiAgfVxcbn1cXG5cXG5AbWVkaWEgKG1heC13aWR0aDogMzkwcHgpIHtcXG4gIC5jb25maWctZGlhbG9nIHtcXG4gICAgbGVmdDogNTclO1xcbiAgfVxcbn1cXG5cXG5AbWVkaWEgKG1heC13aWR0aDogMjkwcHgpIHtcXG4gIC5jb25maWctZGlhbG9nIHtcXG4gICAgbGVmdDogNzglO1xcbiAgfVxcbn1cXG5cIl0sXCJzb3VyY2VSb290XCI6XCJcIn1dKTtcbi8vIEV4cG9ydHNcbmV4cG9ydCBkZWZhdWx0IF9fX0NTU19MT0FERVJfRVhQT1JUX19fO1xuIiwiLy8gSW1wb3J0c1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18gZnJvbSBcIi4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzXCI7XG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fIGZyb20gXCIuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzXCI7XG52YXIgX19fQ1NTX0xPQURFUl9FWFBPUlRfX18gPSBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyk7XG4vLyBNb2R1bGVcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLnB1c2goW21vZHVsZS5pZCwgYCosICo6OmJlZm9yZSwgKjo6YWZ0ZXIge1xuICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG59XG5cbmh0bWwsIGJvZHksIGRpdiwgc3BhbiwgYXBwbGV0LCBvYmplY3QsIGlmcmFtZSwgaDEsIGgyLCBoMywgaDQsIGg1LCBoNiwgcCwgYmxvY2txdW90ZSwgcHJlLCBhLCBhYmJyLCBhY3JvbnltLCBhZGRyZXNzLCBiaWcsIGNpdGUsIGNvZGUsIGRlbCwgZGZuLCBlbSwgaW1nLCBpbnMsIGtiZCwgcSwgcywgc2FtcCwgc21hbGwsIHN0cmlrZSwgc3Ryb25nLCBzdWIsIHN1cCwgdHQsIHZhciwgYiwgdSwgaSwgY2VudGVyLCBkbCwgZHQsIGRkLCBvbCwgdWwsIGxpLCBmaWVsZHNldCwgZm9ybSwgbGFiZWwsIGxlZ2VuZCwgdGFibGUsIGNhcHRpb24sIHRib2R5LCB0Zm9vdCwgdGhlYWQsIHRyLCB0aCwgdGQsIGFydGljbGUsIGFzaWRlLCBjYW52YXMsIGRldGFpbHMsIGVtYmVkLCBmaWd1cmUsIGZpZ2NhcHRpb24sIGZvb3RlciwgaGVhZGVyLCBoZ3JvdXAsIG1lbnUsIG5hdiwgb3V0cHV0LCBydWJ5LCBzZWN0aW9uLCBzdW1tYXJ5LCB0aW1lLCBtYXJrLCBhdWRpbywgdmlkZW8gIHtcbiAgICBtYXJnaW46IDA7XG4gICAgcGFkZGluZzogMDtcbiAgICBib3JkZXI6IDA7XG4gICAgZm9udC1zaXplOiAxMDAlO1xuICAgIGZvbnQ6IGluaGVyaXQ7XG4gICAgdmVydGljYWwtYWxpZ246IGJhc2VsaW5lO1xufVxuXG5ib2R5IHtcbiAgICBmb250LWZhbWlseTogQXJpYWwsIHNhbnMtc2VyaWY7XG4gICAgZm9udC1zaXplOiAxNnB4O1xuICAgIGxpbmUtaGVpZ2h0OiAxLjE7XG59XG5cbmEge1xuICAgIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcbn1cblxub2wsIHVsIHtcblx0bGlzdC1zdHlsZTogbm9uZTtcbn1cblxubWFpbiwgYXJ0aWNsZSwgYXNpZGUsIGRldGFpbHMsIGZpZ2NhcHRpb24sIGZpZ3VyZSwgXG5mb290ZXIsIGhlYWRlciwgaGdyb3VwLCBtZW51LCBuYXYsIHNlY3Rpb24ge1xuXHRkaXNwbGF5OiBibG9jaztcbn1cblxuYmxvY2txdW90ZSwgcSB7XG4gICAgcXVvdGVzOiBub25lO1xufVxuXG50YWJsZSB7XG4gICAgYm9yZGVyLWNvbGxhcHNlOiBjb2xsYXBzZTtcbiAgICBib3JkZXItc3BhY2luZzogMDtcbn1cblxuaW1nIHtcbiAgICBib3JkZXItc3R5bGU6IG5vbmU7XG59XG5cbmJ1dHRvbiwgaW5wdXQge1xuICAgIG92ZXJmbG93OiB2aXNpYmxlO1xufVxuXG5hYmJyW3RpdGxlXSB7XG4gICAgYm9yZGVyLWJvdHRvbTogbm9uZTtcbiAgICB0ZXh0LWRlY29yYXRpb246IHVuZGVybGluZTtcbn1cblxuc3Ryb25nLCBiIHtcbiAgICBmb250LXdlaWdodDogYm9sZGVyO1xufWAsIFwiXCIse1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wid2VicGFjazovLy4vc3JjL3Jlc2V0LmNzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFBQTtJQUNJLHNCQUFzQjtBQUMxQjs7QUFFQTtJQUNJLFNBQVM7SUFDVCxVQUFVO0lBQ1YsU0FBUztJQUNULGVBQWU7SUFDZixhQUFhO0lBQ2Isd0JBQXdCO0FBQzVCOztBQUVBO0lBQ0ksOEJBQThCO0lBQzlCLGVBQWU7SUFDZixnQkFBZ0I7QUFDcEI7O0FBRUE7SUFDSSxxQkFBcUI7SUFDckIsNkJBQTZCO0FBQ2pDOztBQUVBO0NBQ0MsZ0JBQWdCO0FBQ2pCOztBQUVBOztDQUVDLGNBQWM7QUFDZjs7QUFFQTtJQUNJLFlBQVk7QUFDaEI7O0FBRUE7SUFDSSx5QkFBeUI7SUFDekIsaUJBQWlCO0FBQ3JCOztBQUVBO0lBQ0ksa0JBQWtCO0FBQ3RCOztBQUVBO0lBQ0ksaUJBQWlCO0FBQ3JCOztBQUVBO0lBQ0ksbUJBQW1CO0lBQ25CLDBCQUEwQjtBQUM5Qjs7QUFFQTtJQUNJLG1CQUFtQjtBQUN2QlwiLFwic291cmNlc0NvbnRlbnRcIjpbXCIqLCAqOjpiZWZvcmUsICo6OmFmdGVyIHtcXG4gICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcXG59XFxuXFxuaHRtbCwgYm9keSwgZGl2LCBzcGFuLCBhcHBsZXQsIG9iamVjdCwgaWZyYW1lLCBoMSwgaDIsIGgzLCBoNCwgaDUsIGg2LCBwLCBibG9ja3F1b3RlLCBwcmUsIGEsIGFiYnIsIGFjcm9ueW0sIGFkZHJlc3MsIGJpZywgY2l0ZSwgY29kZSwgZGVsLCBkZm4sIGVtLCBpbWcsIGlucywga2JkLCBxLCBzLCBzYW1wLCBzbWFsbCwgc3RyaWtlLCBzdHJvbmcsIHN1Yiwgc3VwLCB0dCwgdmFyLCBiLCB1LCBpLCBjZW50ZXIsIGRsLCBkdCwgZGQsIG9sLCB1bCwgbGksIGZpZWxkc2V0LCBmb3JtLCBsYWJlbCwgbGVnZW5kLCB0YWJsZSwgY2FwdGlvbiwgdGJvZHksIHRmb290LCB0aGVhZCwgdHIsIHRoLCB0ZCwgYXJ0aWNsZSwgYXNpZGUsIGNhbnZhcywgZGV0YWlscywgZW1iZWQsIGZpZ3VyZSwgZmlnY2FwdGlvbiwgZm9vdGVyLCBoZWFkZXIsIGhncm91cCwgbWVudSwgbmF2LCBvdXRwdXQsIHJ1YnksIHNlY3Rpb24sIHN1bW1hcnksIHRpbWUsIG1hcmssIGF1ZGlvLCB2aWRlbyAge1xcbiAgICBtYXJnaW46IDA7XFxuICAgIHBhZGRpbmc6IDA7XFxuICAgIGJvcmRlcjogMDtcXG4gICAgZm9udC1zaXplOiAxMDAlO1xcbiAgICBmb250OiBpbmhlcml0O1xcbiAgICB2ZXJ0aWNhbC1hbGlnbjogYmFzZWxpbmU7XFxufVxcblxcbmJvZHkge1xcbiAgICBmb250LWZhbWlseTogQXJpYWwsIHNhbnMtc2VyaWY7XFxuICAgIGZvbnQtc2l6ZTogMTZweDtcXG4gICAgbGluZS1oZWlnaHQ6IDEuMTtcXG59XFxuXFxuYSB7XFxuICAgIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XFxufVxcblxcbm9sLCB1bCB7XFxuXFx0bGlzdC1zdHlsZTogbm9uZTtcXG59XFxuXFxubWFpbiwgYXJ0aWNsZSwgYXNpZGUsIGRldGFpbHMsIGZpZ2NhcHRpb24sIGZpZ3VyZSwgXFxuZm9vdGVyLCBoZWFkZXIsIGhncm91cCwgbWVudSwgbmF2LCBzZWN0aW9uIHtcXG5cXHRkaXNwbGF5OiBibG9jaztcXG59XFxuXFxuYmxvY2txdW90ZSwgcSB7XFxuICAgIHF1b3Rlczogbm9uZTtcXG59XFxuXFxudGFibGUge1xcbiAgICBib3JkZXItY29sbGFwc2U6IGNvbGxhcHNlO1xcbiAgICBib3JkZXItc3BhY2luZzogMDtcXG59XFxuXFxuaW1nIHtcXG4gICAgYm9yZGVyLXN0eWxlOiBub25lO1xcbn1cXG5cXG5idXR0b24sIGlucHV0IHtcXG4gICAgb3ZlcmZsb3c6IHZpc2libGU7XFxufVxcblxcbmFiYnJbdGl0bGVdIHtcXG4gICAgYm9yZGVyLWJvdHRvbTogbm9uZTtcXG4gICAgdGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmU7XFxufVxcblxcbnN0cm9uZywgYiB7XFxuICAgIGZvbnQtd2VpZ2h0OiBib2xkZXI7XFxufVwiXSxcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuLy8gRXhwb3J0c1xuZXhwb3J0IGRlZmF1bHQgX19fQ1NTX0xPQURFUl9FWFBPUlRfX187XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuLypcbiAgTUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcbiAgQXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxuKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcpIHtcbiAgdmFyIGxpc3QgPSBbXTtcblxuICAvLyByZXR1cm4gdGhlIGxpc3Qgb2YgbW9kdWxlcyBhcyBjc3Mgc3RyaW5nXG4gIGxpc3QudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gdGhpcy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgIHZhciBjb250ZW50ID0gXCJcIjtcbiAgICAgIHZhciBuZWVkTGF5ZXIgPSB0eXBlb2YgaXRlbVs1XSAhPT0gXCJ1bmRlZmluZWRcIjtcbiAgICAgIGlmIChpdGVtWzRdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChpdGVtWzRdLCBcIikge1wiKTtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzJdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIik7XG4gICAgICB9XG4gICAgICBpZiAobmVlZExheWVyKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKTtcbiAgICAgIH1cbiAgICAgIGNvbnRlbnQgKz0gY3NzV2l0aE1hcHBpbmdUb1N0cmluZyhpdGVtKTtcbiAgICAgIGlmIChuZWVkTGF5ZXIpIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzJdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVs0XSkge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgfSkuam9pbihcIlwiKTtcbiAgfTtcblxuICAvLyBpbXBvcnQgYSBsaXN0IG9mIG1vZHVsZXMgaW50byB0aGUgbGlzdFxuICBsaXN0LmkgPSBmdW5jdGlvbiBpKG1vZHVsZXMsIG1lZGlhLCBkZWR1cGUsIHN1cHBvcnRzLCBsYXllcikge1xuICAgIGlmICh0eXBlb2YgbW9kdWxlcyA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgbW9kdWxlcyA9IFtbbnVsbCwgbW9kdWxlcywgdW5kZWZpbmVkXV07XG4gICAgfVxuICAgIHZhciBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzID0ge307XG4gICAgaWYgKGRlZHVwZSkge1xuICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCB0aGlzLmxlbmd0aDsgaysrKSB7XG4gICAgICAgIHZhciBpZCA9IHRoaXNba11bMF07XG4gICAgICAgIGlmIChpZCAhPSBudWxsKSB7XG4gICAgICAgICAgYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpZF0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGZvciAodmFyIF9rID0gMDsgX2sgPCBtb2R1bGVzLmxlbmd0aDsgX2srKykge1xuICAgICAgdmFyIGl0ZW0gPSBbXS5jb25jYXQobW9kdWxlc1tfa10pO1xuICAgICAgaWYgKGRlZHVwZSAmJiBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2l0ZW1bMF1dKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgaWYgKHR5cGVvZiBsYXllciAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICBpZiAodHlwZW9mIGl0ZW1bNV0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICBpdGVtWzVdID0gbGF5ZXI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQGxheWVyXCIuY29uY2F0KGl0ZW1bNV0ubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChpdGVtWzVdKSA6IFwiXCIsIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzVdID0gbGF5ZXI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChtZWRpYSkge1xuICAgICAgICBpZiAoIWl0ZW1bMl0pIHtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQG1lZGlhIFwiLmNvbmNhdChpdGVtWzJdLCBcIiB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVsyXSA9IG1lZGlhO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoc3VwcG9ydHMpIHtcbiAgICAgICAgaWYgKCFpdGVtWzRdKSB7XG4gICAgICAgICAgaXRlbVs0XSA9IFwiXCIuY29uY2F0KHN1cHBvcnRzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChpdGVtWzRdLCBcIikge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bNF0gPSBzdXBwb3J0cztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgbGlzdC5wdXNoKGl0ZW0pO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIGxpc3Q7XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICh1cmwsIG9wdGlvbnMpIHtcbiAgaWYgKCFvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IHt9O1xuICB9XG4gIGlmICghdXJsKSB7XG4gICAgcmV0dXJuIHVybDtcbiAgfVxuICB1cmwgPSBTdHJpbmcodXJsLl9fZXNNb2R1bGUgPyB1cmwuZGVmYXVsdCA6IHVybCk7XG5cbiAgLy8gSWYgdXJsIGlzIGFscmVhZHkgd3JhcHBlZCBpbiBxdW90ZXMsIHJlbW92ZSB0aGVtXG4gIGlmICgvXlsnXCJdLipbJ1wiXSQvLnRlc3QodXJsKSkge1xuICAgIHVybCA9IHVybC5zbGljZSgxLCAtMSk7XG4gIH1cbiAgaWYgKG9wdGlvbnMuaGFzaCkge1xuICAgIHVybCArPSBvcHRpb25zLmhhc2g7XG4gIH1cblxuICAvLyBTaG91bGQgdXJsIGJlIHdyYXBwZWQ/XG4gIC8vIFNlZSBodHRwczovL2RyYWZ0cy5jc3N3Zy5vcmcvY3NzLXZhbHVlcy0zLyN1cmxzXG4gIGlmICgvW1wiJygpIFxcdFxcbl18KCUyMCkvLnRlc3QodXJsKSB8fCBvcHRpb25zLm5lZWRRdW90ZXMpIHtcbiAgICByZXR1cm4gXCJcXFwiXCIuY29uY2F0KHVybC5yZXBsYWNlKC9cIi9nLCAnXFxcXFwiJykucmVwbGFjZSgvXFxuL2csIFwiXFxcXG5cIiksIFwiXFxcIlwiKTtcbiAgfVxuICByZXR1cm4gdXJsO1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXRlbSkge1xuICB2YXIgY29udGVudCA9IGl0ZW1bMV07XG4gIHZhciBjc3NNYXBwaW5nID0gaXRlbVszXTtcbiAgaWYgKCFjc3NNYXBwaW5nKSB7XG4gICAgcmV0dXJuIGNvbnRlbnQ7XG4gIH1cbiAgaWYgKHR5cGVvZiBidG9hID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICB2YXIgYmFzZTY0ID0gYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoY3NzTWFwcGluZykpKSk7XG4gICAgdmFyIGRhdGEgPSBcInNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LFwiLmNvbmNhdChiYXNlNjQpO1xuICAgIHZhciBzb3VyY2VNYXBwaW5nID0gXCIvKiMgXCIuY29uY2F0KGRhdGEsIFwiICovXCIpO1xuICAgIHJldHVybiBbY29udGVudF0uY29uY2F0KFtzb3VyY2VNYXBwaW5nXSkuam9pbihcIlxcblwiKTtcbiAgfVxuICByZXR1cm4gW2NvbnRlbnRdLmpvaW4oXCJcXG5cIik7XG59OyIsIlxuICAgICAgaW1wb3J0IEFQSSBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qc1wiO1xuICAgICAgaW1wb3J0IGRvbUFQSSBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0Rm4gZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzXCI7XG4gICAgICBpbXBvcnQgc2V0QXR0cmlidXRlcyBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydFN0eWxlRWxlbWVudCBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qc1wiO1xuICAgICAgaW1wb3J0IHN0eWxlVGFnVHJhbnNmb3JtRm4gZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qc1wiO1xuICAgICAgaW1wb3J0IGNvbnRlbnQsICogYXMgbmFtZWRFeHBvcnQgZnJvbSBcIiEhLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9iYXR0bGVncm91bmQuY3NzXCI7XG4gICAgICBcbiAgICAgIFxuXG52YXIgb3B0aW9ucyA9IHt9O1xuXG5vcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtID0gc3R5bGVUYWdUcmFuc2Zvcm1Gbjtcbm9wdGlvbnMuc2V0QXR0cmlidXRlcyA9IHNldEF0dHJpYnV0ZXM7XG5cbiAgICAgIG9wdGlvbnMuaW5zZXJ0ID0gaW5zZXJ0Rm4uYmluZChudWxsLCBcImhlYWRcIik7XG4gICAgXG5vcHRpb25zLmRvbUFQSSA9IGRvbUFQSTtcbm9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50ID0gaW5zZXJ0U3R5bGVFbGVtZW50O1xuXG52YXIgdXBkYXRlID0gQVBJKGNvbnRlbnQsIG9wdGlvbnMpO1xuXG5cblxuZXhwb3J0ICogZnJvbSBcIiEhLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9iYXR0bGVncm91bmQuY3NzXCI7XG4gICAgICAgZXhwb3J0IGRlZmF1bHQgY29udGVudCAmJiBjb250ZW50LmxvY2FscyA/IGNvbnRlbnQubG9jYWxzIDogdW5kZWZpbmVkO1xuIiwiXG4gICAgICBpbXBvcnQgQVBJIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzXCI7XG4gICAgICBpbXBvcnQgZG9tQVBJIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRGbiBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanNcIjtcbiAgICAgIGltcG9ydCBzZXRBdHRyaWJ1dGVzIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0U3R5bGVFbGVtZW50IGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzXCI7XG4gICAgICBpbXBvcnQgc3R5bGVUYWdUcmFuc2Zvcm1GbiBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzXCI7XG4gICAgICBpbXBvcnQgY29udGVudCwgKiBhcyBuYW1lZEV4cG9ydCBmcm9tIFwiISEuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL3Jlc2V0LmNzc1wiO1xuICAgICAgXG4gICAgICBcblxudmFyIG9wdGlvbnMgPSB7fTtcblxub3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybSA9IHN0eWxlVGFnVHJhbnNmb3JtRm47XG5vcHRpb25zLnNldEF0dHJpYnV0ZXMgPSBzZXRBdHRyaWJ1dGVzO1xuXG4gICAgICBvcHRpb25zLmluc2VydCA9IGluc2VydEZuLmJpbmQobnVsbCwgXCJoZWFkXCIpO1xuICAgIFxub3B0aW9ucy5kb21BUEkgPSBkb21BUEk7XG5vcHRpb25zLmluc2VydFN0eWxlRWxlbWVudCA9IGluc2VydFN0eWxlRWxlbWVudDtcblxudmFyIHVwZGF0ZSA9IEFQSShjb250ZW50LCBvcHRpb25zKTtcblxuXG5cbmV4cG9ydCAqIGZyb20gXCIhIS4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vcmVzZXQuY3NzXCI7XG4gICAgICAgZXhwb3J0IGRlZmF1bHQgY29udGVudCAmJiBjb250ZW50LmxvY2FscyA/IGNvbnRlbnQubG9jYWxzIDogdW5kZWZpbmVkO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBzdHlsZXNJbkRPTSA9IFtdO1xuZnVuY3Rpb24gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcikge1xuICB2YXIgcmVzdWx0ID0gLTE7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3R5bGVzSW5ET00ubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoc3R5bGVzSW5ET01baV0uaWRlbnRpZmllciA9PT0gaWRlbnRpZmllcikge1xuICAgICAgcmVzdWx0ID0gaTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuZnVuY3Rpb24gbW9kdWxlc1RvRG9tKGxpc3QsIG9wdGlvbnMpIHtcbiAgdmFyIGlkQ291bnRNYXAgPSB7fTtcbiAgdmFyIGlkZW50aWZpZXJzID0gW107XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgIHZhciBpdGVtID0gbGlzdFtpXTtcbiAgICB2YXIgaWQgPSBvcHRpb25zLmJhc2UgPyBpdGVtWzBdICsgb3B0aW9ucy5iYXNlIDogaXRlbVswXTtcbiAgICB2YXIgY291bnQgPSBpZENvdW50TWFwW2lkXSB8fCAwO1xuICAgIHZhciBpZGVudGlmaWVyID0gXCJcIi5jb25jYXQoaWQsIFwiIFwiKS5jb25jYXQoY291bnQpO1xuICAgIGlkQ291bnRNYXBbaWRdID0gY291bnQgKyAxO1xuICAgIHZhciBpbmRleEJ5SWRlbnRpZmllciA9IGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xuICAgIHZhciBvYmogPSB7XG4gICAgICBjc3M6IGl0ZW1bMV0sXG4gICAgICBtZWRpYTogaXRlbVsyXSxcbiAgICAgIHNvdXJjZU1hcDogaXRlbVszXSxcbiAgICAgIHN1cHBvcnRzOiBpdGVtWzRdLFxuICAgICAgbGF5ZXI6IGl0ZW1bNV1cbiAgICB9O1xuICAgIGlmIChpbmRleEJ5SWRlbnRpZmllciAhPT0gLTEpIHtcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4QnlJZGVudGlmaWVyXS5yZWZlcmVuY2VzKys7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleEJ5SWRlbnRpZmllcl0udXBkYXRlcihvYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgdXBkYXRlciA9IGFkZEVsZW1lbnRTdHlsZShvYmosIG9wdGlvbnMpO1xuICAgICAgb3B0aW9ucy5ieUluZGV4ID0gaTtcbiAgICAgIHN0eWxlc0luRE9NLnNwbGljZShpLCAwLCB7XG4gICAgICAgIGlkZW50aWZpZXI6IGlkZW50aWZpZXIsXG4gICAgICAgIHVwZGF0ZXI6IHVwZGF0ZXIsXG4gICAgICAgIHJlZmVyZW5jZXM6IDFcbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZGVudGlmaWVycy5wdXNoKGlkZW50aWZpZXIpO1xuICB9XG4gIHJldHVybiBpZGVudGlmaWVycztcbn1cbmZ1bmN0aW9uIGFkZEVsZW1lbnRTdHlsZShvYmosIG9wdGlvbnMpIHtcbiAgdmFyIGFwaSA9IG9wdGlvbnMuZG9tQVBJKG9wdGlvbnMpO1xuICBhcGkudXBkYXRlKG9iaik7XG4gIHZhciB1cGRhdGVyID0gZnVuY3Rpb24gdXBkYXRlcihuZXdPYmopIHtcbiAgICBpZiAobmV3T2JqKSB7XG4gICAgICBpZiAobmV3T2JqLmNzcyA9PT0gb2JqLmNzcyAmJiBuZXdPYmoubWVkaWEgPT09IG9iai5tZWRpYSAmJiBuZXdPYmouc291cmNlTWFwID09PSBvYmouc291cmNlTWFwICYmIG5ld09iai5zdXBwb3J0cyA9PT0gb2JqLnN1cHBvcnRzICYmIG5ld09iai5sYXllciA9PT0gb2JqLmxheWVyKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGFwaS51cGRhdGUob2JqID0gbmV3T2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXBpLnJlbW92ZSgpO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIHVwZGF0ZXI7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChsaXN0LCBvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICBsaXN0ID0gbGlzdCB8fCBbXTtcbiAgdmFyIGxhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKTtcbiAgcmV0dXJuIGZ1bmN0aW9uIHVwZGF0ZShuZXdMaXN0KSB7XG4gICAgbmV3TGlzdCA9IG5ld0xpc3QgfHwgW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBpZGVudGlmaWVyID0gbGFzdElkZW50aWZpZXJzW2ldO1xuICAgICAgdmFyIGluZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcik7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleF0ucmVmZXJlbmNlcy0tO1xuICAgIH1cbiAgICB2YXIgbmV3TGFzdElkZW50aWZpZXJzID0gbW9kdWxlc1RvRG9tKG5ld0xpc3QsIG9wdGlvbnMpO1xuICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICB2YXIgX2lkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbX2ldO1xuICAgICAgdmFyIF9pbmRleCA9IGdldEluZGV4QnlJZGVudGlmaWVyKF9pZGVudGlmaWVyKTtcbiAgICAgIGlmIChzdHlsZXNJbkRPTVtfaW5kZXhdLnJlZmVyZW5jZXMgPT09IDApIHtcbiAgICAgICAgc3R5bGVzSW5ET01bX2luZGV4XS51cGRhdGVyKCk7XG4gICAgICAgIHN0eWxlc0luRE9NLnNwbGljZShfaW5kZXgsIDEpO1xuICAgICAgfVxuICAgIH1cbiAgICBsYXN0SWRlbnRpZmllcnMgPSBuZXdMYXN0SWRlbnRpZmllcnM7XG4gIH07XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgbWVtbyA9IHt9O1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGdldFRhcmdldCh0YXJnZXQpIHtcbiAgaWYgKHR5cGVvZiBtZW1vW3RhcmdldF0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICB2YXIgc3R5bGVUYXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRhcmdldCk7XG5cbiAgICAvLyBTcGVjaWFsIGNhc2UgdG8gcmV0dXJuIGhlYWQgb2YgaWZyYW1lIGluc3RlYWQgb2YgaWZyYW1lIGl0c2VsZlxuICAgIGlmICh3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQgJiYgc3R5bGVUYXJnZXQgaW5zdGFuY2VvZiB3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIFRoaXMgd2lsbCB0aHJvdyBhbiBleGNlcHRpb24gaWYgYWNjZXNzIHRvIGlmcmFtZSBpcyBibG9ja2VkXG4gICAgICAgIC8vIGR1ZSB0byBjcm9zcy1vcmlnaW4gcmVzdHJpY3Rpb25zXG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gc3R5bGVUYXJnZXQuY29udGVudERvY3VtZW50LmhlYWQ7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIGlzdGFuYnVsIGlnbm9yZSBuZXh0XG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gICAgbWVtb1t0YXJnZXRdID0gc3R5bGVUYXJnZXQ7XG4gIH1cbiAgcmV0dXJuIG1lbW9bdGFyZ2V0XTtcbn1cblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBpbnNlcnRCeVNlbGVjdG9yKGluc2VydCwgc3R5bGUpIHtcbiAgdmFyIHRhcmdldCA9IGdldFRhcmdldChpbnNlcnQpO1xuICBpZiAoIXRhcmdldCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIkNvdWxkbid0IGZpbmQgYSBzdHlsZSB0YXJnZXQuIFRoaXMgcHJvYmFibHkgbWVhbnMgdGhhdCB0aGUgdmFsdWUgZm9yIHRoZSAnaW5zZXJ0JyBwYXJhbWV0ZXIgaXMgaW52YWxpZC5cIik7XG4gIH1cbiAgdGFyZ2V0LmFwcGVuZENoaWxkKHN0eWxlKTtcbn1cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0QnlTZWxlY3RvcjsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucykge1xuICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKTtcbiAgb3B0aW9ucy5zZXRBdHRyaWJ1dGVzKGVsZW1lbnQsIG9wdGlvbnMuYXR0cmlidXRlcyk7XG4gIG9wdGlvbnMuaW5zZXJ0KGVsZW1lbnQsIG9wdGlvbnMub3B0aW9ucyk7XG4gIHJldHVybiBlbGVtZW50O1xufVxubW9kdWxlLmV4cG9ydHMgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzKHN0eWxlRWxlbWVudCkge1xuICB2YXIgbm9uY2UgPSB0eXBlb2YgX193ZWJwYWNrX25vbmNlX18gIT09IFwidW5kZWZpbmVkXCIgPyBfX3dlYnBhY2tfbm9uY2VfXyA6IG51bGw7XG4gIGlmIChub25jZSkge1xuICAgIHN0eWxlRWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJub25jZVwiLCBub25jZSk7XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGFwcGx5KHN0eWxlRWxlbWVudCwgb3B0aW9ucywgb2JqKSB7XG4gIHZhciBjc3MgPSBcIlwiO1xuICBpZiAob2JqLnN1cHBvcnRzKSB7XG4gICAgY3NzICs9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQob2JqLnN1cHBvcnRzLCBcIikge1wiKTtcbiAgfVxuICBpZiAob2JqLm1lZGlhKSB7XG4gICAgY3NzICs9IFwiQG1lZGlhIFwiLmNvbmNhdChvYmoubWVkaWEsIFwiIHtcIik7XG4gIH1cbiAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBvYmoubGF5ZXIgIT09IFwidW5kZWZpbmVkXCI7XG4gIGlmIChuZWVkTGF5ZXIpIHtcbiAgICBjc3MgKz0gXCJAbGF5ZXJcIi5jb25jYXQob2JqLmxheWVyLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQob2JqLmxheWVyKSA6IFwiXCIsIFwiIHtcIik7XG4gIH1cbiAgY3NzICs9IG9iai5jc3M7XG4gIGlmIChuZWVkTGF5ZXIpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgaWYgKG9iai5tZWRpYSkge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICBpZiAob2JqLnN1cHBvcnRzKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIHZhciBzb3VyY2VNYXAgPSBvYmouc291cmNlTWFwO1xuICBpZiAoc291cmNlTWFwICYmIHR5cGVvZiBidG9hICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgY3NzICs9IFwiXFxuLyojIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxcIi5jb25jYXQoYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoc291cmNlTWFwKSkpKSwgXCIgKi9cIik7XG4gIH1cblxuICAvLyBGb3Igb2xkIElFXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAgKi9cbiAgb3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybShjc3MsIHN0eWxlRWxlbWVudCwgb3B0aW9ucy5vcHRpb25zKTtcbn1cbmZ1bmN0aW9uIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpIHtcbiAgLy8gaXN0YW5idWwgaWdub3JlIGlmXG4gIGlmIChzdHlsZUVsZW1lbnQucGFyZW50Tm9kZSA9PT0gbnVsbCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBzdHlsZUVsZW1lbnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQpO1xufVxuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGRvbUFQSShvcHRpb25zKSB7XG4gIGlmICh0eXBlb2YgZG9jdW1lbnQgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUoKSB7fSxcbiAgICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge31cbiAgICB9O1xuICB9XG4gIHZhciBzdHlsZUVsZW1lbnQgPSBvcHRpb25zLmluc2VydFN0eWxlRWxlbWVudChvcHRpb25zKTtcbiAgcmV0dXJuIHtcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShvYmopIHtcbiAgICAgIGFwcGx5KHN0eWxlRWxlbWVudCwgb3B0aW9ucywgb2JqKTtcbiAgICB9LFxuICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge1xuICAgICAgcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCk7XG4gICAgfVxuICB9O1xufVxubW9kdWxlLmV4cG9ydHMgPSBkb21BUEk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gc3R5bGVUYWdUcmFuc2Zvcm0oY3NzLCBzdHlsZUVsZW1lbnQpIHtcbiAgaWYgKHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0KSB7XG4gICAgc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzcztcbiAgfSBlbHNlIHtcbiAgICB3aGlsZSAoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpIHtcbiAgICAgIHN0eWxlRWxlbWVudC5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCk7XG4gICAgfVxuICAgIHN0eWxlRWxlbWVudC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpKTtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBzdHlsZVRhZ1RyYW5zZm9ybTsiLCJ2YXIgbWFwID0ge1xuXHRcIi4vYWRtaXJhbC1lZGl0LmpwZ1wiOiBcIi4vc3JjL2Fzc2V0cy9hZG1pcmFsLWVkaXQuanBnXCIsXG5cdFwiLi9iYXR0bGVzaGlwLnBuZ1wiOiBcIi4vc3JjL2Fzc2V0cy9iYXR0bGVzaGlwLnBuZ1wiLFxuXHRcIi4vY2Fycmllci5wbmdcIjogXCIuL3NyYy9hc3NldHMvY2Fycmllci5wbmdcIixcblx0XCIuL2NhcnJpZXIyLnBuZ1wiOiBcIi4vc3JjL2Fzc2V0cy9jYXJyaWVyMi5wbmdcIixcblx0XCIuL2Rlc3Ryb3llci5wbmdcIjogXCIuL3NyYy9hc3NldHMvZGVzdHJveWVyLnBuZ1wiLFxuXHRcIi4vbGFtcC5wbmdcIjogXCIuL3NyYy9hc3NldHMvbGFtcC5wbmdcIixcblx0XCIuL3BhdHJvbC1ib2F0LnBuZ1wiOiBcIi4vc3JjL2Fzc2V0cy9wYXRyb2wtYm9hdC5wbmdcIixcblx0XCIuL3NoaXAtZWRpdC5qcGdcIjogXCIuL3NyYy9hc3NldHMvc2hpcC1lZGl0LmpwZ1wiLFxuXHRcIi4vc3VibWFyaW5lLnBuZ1wiOiBcIi4vc3JjL2Fzc2V0cy9zdWJtYXJpbmUucG5nXCIsXG5cdFwiLi92ZXJ0aWNhbHNoaXAuanBnXCI6IFwiLi9zcmMvYXNzZXRzL3ZlcnRpY2Fsc2hpcC5qcGdcIlxufTtcblxuXG5mdW5jdGlvbiB3ZWJwYWNrQ29udGV4dChyZXEpIHtcblx0dmFyIGlkID0gd2VicGFja0NvbnRleHRSZXNvbHZlKHJlcSk7XG5cdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKGlkKTtcbn1cbmZ1bmN0aW9uIHdlYnBhY2tDb250ZXh0UmVzb2x2ZShyZXEpIHtcblx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhtYXAsIHJlcSkpIHtcblx0XHR2YXIgZSA9IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIgKyByZXEgKyBcIidcIik7XG5cdFx0ZS5jb2RlID0gJ01PRFVMRV9OT1RfRk9VTkQnO1xuXHRcdHRocm93IGU7XG5cdH1cblx0cmV0dXJuIG1hcFtyZXFdO1xufVxud2VicGFja0NvbnRleHQua2V5cyA9IGZ1bmN0aW9uIHdlYnBhY2tDb250ZXh0S2V5cygpIHtcblx0cmV0dXJuIE9iamVjdC5rZXlzKG1hcCk7XG59O1xud2VicGFja0NvbnRleHQucmVzb2x2ZSA9IHdlYnBhY2tDb250ZXh0UmVzb2x2ZTtcbm1vZHVsZS5leHBvcnRzID0gd2VicGFja0NvbnRleHQ7XG53ZWJwYWNrQ29udGV4dC5pZCA9IFwiLi9zcmMvYXNzZXRzIHN5bmMgXFxcXC4ocG5nJTdDanBlP2clN0NzdmcpJFwiOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0aWQ6IG1vZHVsZUlkLFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4vLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuX193ZWJwYWNrX3JlcXVpcmVfXy5tID0gX193ZWJwYWNrX21vZHVsZXNfXztcblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmcgPSAoZnVuY3Rpb24oKSB7XG5cdGlmICh0eXBlb2YgZ2xvYmFsVGhpcyA9PT0gJ29iamVjdCcpIHJldHVybiBnbG9iYWxUaGlzO1xuXHR0cnkge1xuXHRcdHJldHVybiB0aGlzIHx8IG5ldyBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0aWYgKHR5cGVvZiB3aW5kb3cgPT09ICdvYmplY3QnKSByZXR1cm4gd2luZG93O1xuXHR9XG59KSgpOyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJ2YXIgc2NyaXB0VXJsO1xuaWYgKF9fd2VicGFja19yZXF1aXJlX18uZy5pbXBvcnRTY3JpcHRzKSBzY3JpcHRVcmwgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLmcubG9jYXRpb24gKyBcIlwiO1xudmFyIGRvY3VtZW50ID0gX193ZWJwYWNrX3JlcXVpcmVfXy5nLmRvY3VtZW50O1xuaWYgKCFzY3JpcHRVcmwgJiYgZG9jdW1lbnQpIHtcblx0aWYgKGRvY3VtZW50LmN1cnJlbnRTY3JpcHQpXG5cdFx0c2NyaXB0VXJsID0gZG9jdW1lbnQuY3VycmVudFNjcmlwdC5zcmM7XG5cdGlmICghc2NyaXB0VXJsKSB7XG5cdFx0dmFyIHNjcmlwdHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcInNjcmlwdFwiKTtcblx0XHRpZihzY3JpcHRzLmxlbmd0aCkge1xuXHRcdFx0dmFyIGkgPSBzY3JpcHRzLmxlbmd0aCAtIDE7XG5cdFx0XHR3aGlsZSAoaSA+IC0xICYmICFzY3JpcHRVcmwpIHNjcmlwdFVybCA9IHNjcmlwdHNbaS0tXS5zcmM7XG5cdFx0fVxuXHR9XG59XG4vLyBXaGVuIHN1cHBvcnRpbmcgYnJvd3NlcnMgd2hlcmUgYW4gYXV0b21hdGljIHB1YmxpY1BhdGggaXMgbm90IHN1cHBvcnRlZCB5b3UgbXVzdCBzcGVjaWZ5IGFuIG91dHB1dC5wdWJsaWNQYXRoIG1hbnVhbGx5IHZpYSBjb25maWd1cmF0aW9uXG4vLyBvciBwYXNzIGFuIGVtcHR5IHN0cmluZyAoXCJcIikgYW5kIHNldCB0aGUgX193ZWJwYWNrX3B1YmxpY19wYXRoX18gdmFyaWFibGUgZnJvbSB5b3VyIGNvZGUgdG8gdXNlIHlvdXIgb3duIGxvZ2ljLlxuaWYgKCFzY3JpcHRVcmwpIHRocm93IG5ldyBFcnJvcihcIkF1dG9tYXRpYyBwdWJsaWNQYXRoIGlzIG5vdCBzdXBwb3J0ZWQgaW4gdGhpcyBicm93c2VyXCIpO1xuc2NyaXB0VXJsID0gc2NyaXB0VXJsLnJlcGxhY2UoLyMuKiQvLCBcIlwiKS5yZXBsYWNlKC9cXD8uKiQvLCBcIlwiKS5yZXBsYWNlKC9cXC9bXlxcL10rJC8sIFwiL1wiKTtcbl9fd2VicGFja19yZXF1aXJlX18ucCA9IHNjcmlwdFVybDsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmIgPSBkb2N1bWVudC5iYXNlVVJJIHx8IHNlbGYubG9jYXRpb24uaHJlZjtcblxuLy8gb2JqZWN0IHRvIHN0b3JlIGxvYWRlZCBhbmQgbG9hZGluZyBjaHVua3Ncbi8vIHVuZGVmaW5lZCA9IGNodW5rIG5vdCBsb2FkZWQsIG51bGwgPSBjaHVuayBwcmVsb2FkZWQvcHJlZmV0Y2hlZFxuLy8gW3Jlc29sdmUsIHJlamVjdCwgUHJvbWlzZV0gPSBjaHVuayBsb2FkaW5nLCAwID0gY2h1bmsgbG9hZGVkXG52YXIgaW5zdGFsbGVkQ2h1bmtzID0ge1xuXHRcImJhdHRsZWdyb3VuZFwiOiAwXG59O1xuXG4vLyBubyBjaHVuayBvbiBkZW1hbmQgbG9hZGluZ1xuXG4vLyBubyBwcmVmZXRjaGluZ1xuXG4vLyBubyBwcmVsb2FkZWRcblxuLy8gbm8gSE1SXG5cbi8vIG5vIEhNUiBtYW5pZmVzdFxuXG4vLyBubyBvbiBjaHVua3MgbG9hZGVkXG5cbi8vIG5vIGpzb25wIGZ1bmN0aW9uIiwiX193ZWJwYWNrX3JlcXVpcmVfXy5uYyA9IHVuZGVmaW5lZDsiLCJpbXBvcnQgXCIuL3Jlc2V0LmNzc1wiO1xuaW1wb3J0IFwiLi9iYXR0bGVncm91bmQuY3NzXCI7XG5pbXBvcnQgeyBQbGF5ZXIgfSBmcm9tIFwiLi9sb2dpY1wiO1xuXG5jb25zdCBpbXBvcnRBbGxBc3NldHMgPSAoZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBpbXBvcnRBbGwocikge1xuICAgIHJldHVybiByLmtleXMoKS5tYXAocik7XG4gIH1cblxuICBjb25zdCBhc3NldHMgPSBpbXBvcnRBbGwocmVxdWlyZS5jb250ZXh0KFwiLi9hc3NldHNcIiwgZmFsc2UsIC9cXC4ocG5nfGpwZT9nfHN2ZykkLykpO1xufSkoKTtcblxuY29uc3QgZ2V0Tm9kZXMgPSAoZnVuY3Rpb24gKCkge1xuICBjb25zdCBhZG1pcmFsSGVhZERpdnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFxuICAgIFwiYm9keSA+IHNlY3Rpb246bnRoLWNoaWxkKDMpIC5oZWFkID4gZGl2XCIsXG4gICk7XG4gIGNvbnN0IGFkbWlyYWxUYWlsRGl2cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXG4gICAgXCJib2R5ID4gc2VjdGlvbjpudGgtY2hpbGQoMykgLnRhaWwgPiBkaXZcIixcbiAgKTtcbiAgY29uc3QgYWlIZWFkRGl2cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJib2R5ID4gc2VjdGlvbjpudGgtY2hpbGQoNCkgLmhlYWQgPiBkaXZcIik7XG4gIGNvbnN0IGFpVGFpbERpdnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiYm9keSA+IHNlY3Rpb246bnRoLWNoaWxkKDQpIC50YWlsID4gZGl2XCIpO1xuICBjb25zdCBhZG1pcmFsR3JvdW5kc0RpdnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmFkbWlyYWwtZ3JvdW5kcyA+IGRpdlwiKTtcbiAgY29uc3QgYWlHcm91bmRzRGl2cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuYWktZ3JvdW5kcyA+IGRpdlwiKTtcbiAgY29uc3QgaGVhZGVycyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJoMlwiKTtcbiAgY29uc3QgYWRtaXJhbEdyb3VuZHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmFkbWlyYWwtZ3JvdW5kc1wiKTtcbiAgY29uc3QgYWlHcm91bmRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5haS1ncm91bmRzXCIpO1xuICBjb25zdCBhZG1pcmFsTmFtZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuYWRtaXJhbC1uYW1lXCIpO1xuICBjb25zdCBmZWVkYmFjayA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJib2R5ID4gZGl2Omxhc3QtY2hpbGRcIik7XG4gIGNvbnN0IGNvbmZpZ0J1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY29uZmlnLWJveCA+IGJ1dHRvblwiKTtcbiAgY29uc3QgY29uZmlnRGlhbG9nID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5jb25maWctZGlhbG9nXCIpO1xuICBjb25zdCBjb25maWdCdXR0b25JY29uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5jb25maWctYm94IHN2Z1wiKTtcbiAgY29uc3QgY292ZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiYm9keSA+IGRpdjpmaXJzdC1jaGlsZFwiKTtcbiAgY29uc3QgY2xvc2VEaWFsb2cgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmNvbmZpZy1kaWFsb2cgc3BhblwiKTtcbiAgY29uc3Qga2lja1N0YXJ0QnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5raWNrLXN0YXJ0XCIpO1xuICBjb25zdCBzaHVmZmxlQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5zaHVmZmxlXCIpO1xuICBjb25zdCBwZWVrQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wZWVrXCIpO1xuICBjb25zdCByZWFsaWduQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5yZWFsaWduXCIpO1xuICBjb25zdCBhbGlnbmVkQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5hbGlnbmVkXCIpO1xuICBjb25zdCBkaWZmaWN1bHR5T3B0aW9ucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjZGlmZmljdWx0eVwiKTtcbiAgY29uc3QgZGltZW5zaW9uT3B0aW9ucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjZGltZW5zaW9uXCIpO1xuXG4gIHJldHVybiB7XG4gICAgYWRtaXJhbEhlYWREaXZzLFxuICAgIGFkbWlyYWxUYWlsRGl2cyxcbiAgICBhaUhlYWREaXZzLFxuICAgIGFpVGFpbERpdnMsXG4gICAgYWRtaXJhbEdyb3VuZHNEaXZzLFxuICAgIGFpR3JvdW5kc0RpdnMsXG4gICAgaGVhZGVycyxcbiAgICBhZG1pcmFsR3JvdW5kcyxcbiAgICBhaUdyb3VuZHMsXG4gICAgYWRtaXJhbE5hbWUsXG4gICAgZmVlZGJhY2ssXG4gICAgY29uZmlnQnV0dG9uLFxuICAgIGNvbmZpZ0RpYWxvZyxcbiAgICBjb3ZlcixcbiAgICBjbG9zZURpYWxvZyxcbiAgICBraWNrU3RhcnRCdXR0b24sXG4gICAgc2h1ZmZsZUJ1dHRvbixcbiAgICBwZWVrQnV0dG9uLFxuICAgIGRpZmZpY3VsdHlPcHRpb25zLFxuICAgIGRpbWVuc2lvbk9wdGlvbnMsXG4gICAgcmVhbGlnbkJ1dHRvbixcbiAgICBhbGlnbmVkQnV0dG9uLFxuICAgIGNvbmZpZ0J1dHRvbkljb24sXG4gIH07XG59KSgpO1xuXG5jb25zdCBkaXNwbGF5SGVhZEFuZFRhaWxIb3ZlcmluZ0VmZmVjdCA9IChmdW5jdGlvbiAoKSB7XG4gIGNvbnN0IGFkZEhvdmVyVG9IZWFkID0gZnVuY3Rpb24gKGhlYWREaXZzLCBncm91bmREaXZzKSB7XG4gICAgaGVhZERpdnMuZm9yRWFjaCgoZGl2LCBpbmRleCkgPT4ge1xuICAgICAgZGl2LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW92ZXJcIiwgKCkgPT4ge1xuICAgICAgICBmb3IgKGxldCBtID0gMDsgbSA8IDEwOyBtKyspIHtcbiAgICAgICAgICBncm91bmREaXZzWzEwICogbSArIGluZGV4XS5zdHlsZS5ib3JkZXIgPSBcIjJweCBzb2xpZCByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuNClcIjtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBkaXYuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlb3V0XCIsICgpID0+IHtcbiAgICAgICAgZm9yIChsZXQgbSA9IDA7IG0gPCAxMDsgbSsrKSB7XG4gICAgICAgICAgZ3JvdW5kRGl2c1sxMCAqIG0gKyBpbmRleF0uc3R5bGUuYm9yZGVyID0gXCIycHggc29saWQgcmdiKDI1NSwgMjU1LCAyNTUpXCI7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9O1xuXG4gIGNvbnN0IGFkZEhvdmVyVG9UYWlsID0gZnVuY3Rpb24gKHRhaWxEaXZzLCBncm91bmREaXZzKSB7XG4gICAgdGFpbERpdnMuZm9yRWFjaCgoZGl2LCBpbmRleCkgPT4ge1xuICAgICAgZGl2LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW92ZXJcIiwgKCkgPT4ge1xuICAgICAgICBmb3IgKGxldCBuID0gMDsgbiA8IDEwOyBuKyspIHtcbiAgICAgICAgICBncm91bmREaXZzW24gKyBpbmRleCAqIDEwXS5zdHlsZS5ib3JkZXIgPSBcIjJweCBzb2xpZCByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuNClcIjtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBkaXYuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlb3V0XCIsICgpID0+IHtcbiAgICAgICAgZm9yIChsZXQgbiA9IDA7IG4gPCAxMDsgbisrKSB7XG4gICAgICAgICAgZ3JvdW5kRGl2c1tuICsgaW5kZXggKiAxMF0uc3R5bGUuYm9yZGVyID0gXCIycHggc29saWQgcmdiKDI1NSwgMjU1LCAyNTUpXCI7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9O1xuXG4gIGFkZEhvdmVyVG9IZWFkKGdldE5vZGVzLmFkbWlyYWxIZWFkRGl2cywgZ2V0Tm9kZXMuYWRtaXJhbEdyb3VuZHNEaXZzKTtcbiAgYWRkSG92ZXJUb1RhaWwoZ2V0Tm9kZXMuYWRtaXJhbFRhaWxEaXZzLCBnZXROb2Rlcy5hZG1pcmFsR3JvdW5kc0RpdnMpO1xuICBhZGRIb3ZlclRvSGVhZChnZXROb2Rlcy5haUhlYWREaXZzLCBnZXROb2Rlcy5haUdyb3VuZHNEaXZzKTtcbiAgYWRkSG92ZXJUb1RhaWwoZ2V0Tm9kZXMuYWlUYWlsRGl2cywgZ2V0Tm9kZXMuYWlHcm91bmRzRGl2cyk7XG5cbiAgY29uc3QgYWRkSG92ZXJUb0hlYWRlcnMgPSBmdW5jdGlvbiAoaGVhZGVyLCBncm91bmRzKSB7XG4gICAgaGVhZGVyLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW92ZXJcIiwgKCkgPT4ge1xuICAgICAgZ3JvdW5kcy5jbGFzc0xpc3QuYWRkKFwic2NhbGVEaXZzXCIpO1xuICAgIH0pO1xuICAgIGhlYWRlci5hZGRFdmVudExpc3RlbmVyKFwibW91c2VvdXRcIiwgKCkgPT4ge1xuICAgICAgZ3JvdW5kcy5jbGFzc0xpc3QucmVtb3ZlKFwic2NhbGVEaXZzXCIpO1xuICAgIH0pO1xuICB9O1xuXG4gIGFkZEhvdmVyVG9IZWFkZXJzKGdldE5vZGVzLmhlYWRlcnNbMF0sIGdldE5vZGVzLmFkbWlyYWxHcm91bmRzKTtcbiAgYWRkSG92ZXJUb0hlYWRlcnMoZ2V0Tm9kZXMuaGVhZGVyc1sxXSwgZ2V0Tm9kZXMuYWlHcm91bmRzKTtcbn0pKCk7XG5cbmNvbnN0IHJldHJpZXZlQWRtaXJhbE5hbWVGcm9tU3RvcmFnZUFuZFNldCA9IChmdW5jdGlvbiAoKSB7XG4gIGNvbnN0IGFkbWlyYWxOYW1lID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJhZG1pcmFsTmFtZVwiKTtcbiAgaWYgKGFkbWlyYWxOYW1lKSB7XG4gICAgZ2V0Tm9kZXMuYWRtaXJhbE5hbWUudGV4dENvbnRlbnQgPSBcIuKakyBcIiArIGFkbWlyYWxOYW1lO1xuICAgIHJldHVybiB7IGFkbWlyYWxOYW1lIH07XG4gIH1cbn0pKCk7XG5cbmNvbnN0IHBvcHVsYXRlQm9hcmRzID0gKGZ1bmN0aW9uICgpIHtcbiAgY29uc3QgZ2FtZSA9IG5ldyBQbGF5ZXIoKTtcbiAgY29uc3QgdXNlckJvYXJkID0gZ2FtZS51c2VyLmJvYXJkLmZsYXQoKTtcbiAgY29uc3QgY29tcHV0ZXJCb2FyZCA9IGdhbWUuY29tcHV0ZXIuYm9hcmQuZmxhdCgpO1xuXG4gIGNvbnN0IGdldFJhbmRvbUNvbG9yID0gZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IHJlZCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqICgyNTcgLSAxMDApICsgNTApO1xuICAgIGNvbnN0IGdyZWVuID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKDI1NyAtIDEwMCkgKyA1MCk7XG4gICAgY29uc3QgYmx1ZSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqICgyNTcgLSAxMDApICsgNTApO1xuICAgIGNvbnN0IGNvbG9yID0gYHJnYigke3JlZH0sICR7Z3JlZW59LCAke2JsdWV9KWA7XG5cbiAgICByZXR1cm4gY29sb3I7XG4gIH07XG4gIGNvbnN0IHJhbmRvbUNvbG9ycyA9IFtcbiAgICBnZXRSYW5kb21Db2xvcigpLFxuICAgIGdldFJhbmRvbUNvbG9yKCksXG4gICAgZ2V0UmFuZG9tQ29sb3IoKSxcbiAgICBnZXRSYW5kb21Db2xvcigpLFxuICAgIGdldFJhbmRvbUNvbG9yKCksXG4gIF07XG5cbiAgY29uc3Qgc2V0UmFuZG9tQ29sb3JzID0gZnVuY3Rpb24gKGVsZW1lbnQsIHNoaXApIHtcbiAgICBzd2l0Y2ggKHNoaXApIHtcbiAgICAgIGNhc2UgNTpcbiAgICAgICAgZWxlbWVudC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSByYW5kb21Db2xvcnNbMF07XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSA0OlxuICAgICAgICBlbGVtZW50LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IHJhbmRvbUNvbG9yc1sxXTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDMuNTpcbiAgICAgICAgZWxlbWVudC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSByYW5kb21Db2xvcnNbMl07XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAzOlxuICAgICAgICBlbGVtZW50LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IHJhbmRvbUNvbG9yc1szXTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDI6XG4gICAgICAgIGVsZW1lbnQuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gcmFuZG9tQ29sb3JzWzRdO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH07XG5cbiAgY29uc3Qgc2V0Q2xhc3NlcyA9IChmdW5jdGlvbiAoKSB7XG4gICAgY29uc3Qgc2V0Q2xhc3MgPSBmdW5jdGlvbiAoZWxlbWVudCwgc2hpcCkge1xuICAgICAgc3dpdGNoIChzaGlwKSB7XG4gICAgICAgIGNhc2UgNTpcbiAgICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZShcImRhdGEtc2hpcFwiLCBcIjVcIik7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgNDpcbiAgICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZShcImRhdGEtc2hpcFwiLCBcIjRcIik7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMy41OlxuICAgICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKFwiZGF0YS1zaGlwXCIsIFwiMy41XCIpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJkYXRhLXNoaXBcIiwgXCIzXCIpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJkYXRhLXNoaXBcIiwgXCIyXCIpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBnZXROb2Rlcy5hZG1pcmFsR3JvdW5kc0RpdnMuZm9yRWFjaCgoZGl2LCBkaXZJbmRleCkgPT4ge1xuICAgICAgdXNlckJvYXJkLmZvckVhY2goKGVudHJ5LCBlbnRyeUluZGV4KSA9PiB7XG4gICAgICAgIGlmIChkaXZJbmRleCA9PT0gZW50cnlJbmRleCkge1xuICAgICAgICAgIGlmIChlbnRyeSAhPT0gbnVsbCAmJiBlbnRyeSAhPT0gXCJPXCIpIHtcbiAgICAgICAgICAgIHNldENsYXNzKGRpdiwgZW50cnkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBnZXROb2Rlcy5haUdyb3VuZHNEaXZzLmZvckVhY2goKGRpdiwgZGl2SW5kZXgpID0+IHtcbiAgICAgIGNvbXB1dGVyQm9hcmQuZm9yRWFjaCgoZW50cnksIGVudHJ5SW5kZXgpID0+IHtcbiAgICAgICAgaWYgKGRpdkluZGV4ID09PSBlbnRyeUluZGV4KSB7XG4gICAgICAgICAgaWYgKGVudHJ5ICE9PSBudWxsICYmIGVudHJ5ICE9PSBcIk9cIikge1xuICAgICAgICAgICAgc2V0Q2xhc3MoZGl2LCBlbnRyeSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSkoKTtcblxuICBjb25zdCBwb3B1bGF0ZVdpdGhTcGF0aWFsU2hpcHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgY29uc3Qgc2V0U3BhdGlhbERpbWVuc2lvbiA9IGZ1bmN0aW9uIChncm91bmRzKSB7XG4gICAgICBjb25zdCBhcHBlbmRTaGlwSW1nID0gZnVuY3Rpb24gKHNoaXBTcmMsIHNoaXBMZW5ndGgsIHNoaXBUeXBlKSB7XG4gICAgICAgIGZvciAoY29uc3QgZGl2IG9mIGdyb3VuZHMpIHtcbiAgICAgICAgICBpZiAoZGl2LmRhdGFzZXQuc2hpcCA9PT0gc2hpcFR5cGUpIHtcbiAgICAgICAgICAgIGNvbnN0IHNoaXBJbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xuICAgICAgICAgICAgc2hpcEltZy5zZXRBdHRyaWJ1dGUoXCJzcmNcIiwgYCR7c2hpcFNyY31gKTtcblxuICAgICAgICAgICAgY29uc3QgdXBkYXRlSW1nU2l6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgY29uc3Qgd2lkdGggPSBkaXYuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGggKiBzaGlwTGVuZ3RoO1xuICAgICAgICAgICAgICBjb25zdCBoZWlnaHQgPSBkaXYuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0O1xuICAgICAgICAgICAgICBzaGlwSW1nLnN0eWxlLndpZHRoID0gYCR7d2lkdGggLSA1fXB4YDtcbiAgICAgICAgICAgICAgc2hpcEltZy5zdHlsZS5oZWlnaHQgPSBgJHtoZWlnaHQgLSAyfXB4YDtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB1cGRhdGVJbWdTaXplKCk7XG4gICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCB1cGRhdGVJbWdTaXplKTtcblxuICAgICAgICAgICAgY29uc3QgcmVtb3ZlU2NhbGluZyA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIGRpdi5zdHlsZS50cmFuc2Zvcm0gPSBcInNjYWxlKDEpXCI7XG4gICAgICAgICAgICB9KSgpO1xuXG4gICAgICAgICAgICBkaXYuYXBwZW5kQ2hpbGQoc2hpcEltZyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgYXBwZW5kU2hpcEltZyhcIi4vYXNzZXRzL2NhcnJpZXIucG5nXCIsIDUsIFwiNVwiKTtcbiAgICAgIGFwcGVuZFNoaXBJbWcoXCIuL2Fzc2V0cy9iYXR0bGVzaGlwLnBuZ1wiLCA0LCBcIjRcIik7XG4gICAgICBhcHBlbmRTaGlwSW1nKFwiLi9hc3NldHMvZGVzdHJveWVyLnBuZ1wiLCAzLCBcIjMuNVwiKTtcbiAgICAgIGFwcGVuZFNoaXBJbWcoXCIuL2Fzc2V0cy9zdWJtYXJpbmUucG5nXCIsIDMsIFwiM1wiKTtcbiAgICAgIGFwcGVuZFNoaXBJbWcoXCIuL2Fzc2V0cy9wYXRyb2wtYm9hdC5wbmdcIiwgMiwgXCIyXCIpO1xuICAgIH07XG4gICAgc2V0U3BhdGlhbERpbWVuc2lvbihnZXROb2Rlcy5hZG1pcmFsR3JvdW5kc0RpdnMpO1xuXG4gICAgY29uc3Qgc2V0U3BhdGlhbERpbWVuc2lvbkZvckFpQW5kSGlkZSA9IChmdW5jdGlvbiAoKSB7XG4gICAgICBzZXRTcGF0aWFsRGltZW5zaW9uKGdldE5vZGVzLmFpR3JvdW5kc0RpdnMpO1xuICAgICAgZ2V0Tm9kZXMuYWlHcm91bmRzRGl2cy5mb3JFYWNoKChkaXYpID0+IHtcbiAgICAgICAgaWYgKGRpdi5xdWVyeVNlbGVjdG9yKFwiaW1nXCIpKSB7XG4gICAgICAgICAgZGl2LnF1ZXJ5U2VsZWN0b3IoXCJpbWdcIikuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KSgpO1xuXG4gICAgY29uc3QgcGVla0FpQm9hcmQgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgZ2V0Tm9kZXMucGVla0J1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgICBpZiAoZ2V0Tm9kZXMuZGltZW5zaW9uT3B0aW9ucy52YWx1ZSA9PT0gXCJzaW1wbGVcIikge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGV4aXREaWFsb2cgPSAoYXN5bmMgZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGdldE5vZGVzLmNvdmVyLnN0eWxlLnpJbmRleCA9IFwiMFwiO1xuICAgICAgICAgIGdldE5vZGVzLmNvbmZpZ0RpYWxvZy5zdHlsZS5vcGFjaXR5ID0gXCIwXCI7XG4gICAgICAgICAgZ2V0Tm9kZXMuY29uZmlnRGlhbG9nLnN0eWxlLnRyYW5zaXRpb24gPSBcIm9wYWNpdHkgMC41cyBlYXNlLWluLW91dFwiO1xuICAgICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgZ2V0Tm9kZXMuY29uZmlnRGlhbG9nLnN0eWxlLnZpc2liaWxpdHkgPSBcImhpZGRlblwiO1xuICAgICAgICAgICAgfSwgNDAwKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSkoKTtcblxuICAgICAgICAvLyBTaG93IHNoaXBzXG4gICAgICAgIGdldE5vZGVzLmFpR3JvdW5kc0RpdnMuZm9yRWFjaCgoZGl2KSA9PiB7XG4gICAgICAgICAgaWYgKGRpdi5xdWVyeVNlbGVjdG9yKFwiaW1nXCIpKSB7XG4gICAgICAgICAgICBkaXYucXVlcnlTZWxlY3RvcihcImltZ1wiKS5zdHlsZS5kaXNwbGF5ID0gXCJpbmxpbmVcIjtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IGhpZGVBaUJvYXJkID0gKGFzeW5jIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgIGdldE5vZGVzLmFpR3JvdW5kc0RpdnMuZm9yRWFjaCgoZGl2KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGRpdi5xdWVyeVNlbGVjdG9yKFwiaW1nXCIpKSB7XG4gICAgICAgICAgICAgICAgICBkaXYucXVlcnlTZWxlY3RvcihcImltZ1wiKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sIDEwMDApO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KSgpO1xuICAgICAgfSk7XG4gICAgfSkoKTtcbiAgfTtcbiAgcG9wdWxhdGVXaXRoU3BhdGlhbFNoaXBzKCk7XG5cbiAgY29uc3QgcG9wdWxhdGVXaXRoQ29sb3IgPSBmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgcG9wdWxhdGVVc2VyQm9hcmQgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgZ2V0Tm9kZXMuYWRtaXJhbEdyb3VuZHNEaXZzLmZvckVhY2goKGRpdiwgZGl2SW5kZXgpID0+IHtcbiAgICAgICAgdXNlckJvYXJkLmZvckVhY2goKGVudHJ5LCBlbnRyeUluZGV4KSA9PiB7XG4gICAgICAgICAgaWYgKGRpdkluZGV4ID09PSBlbnRyeUluZGV4KSB7XG4gICAgICAgICAgICBpZiAoZW50cnkgIT09IG51bGwgJiYgZW50cnkgIT09IFwiT1wiKSB7XG4gICAgICAgICAgICAgIHNldFJhbmRvbUNvbG9ycyhkaXYsIGVudHJ5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSkoKTtcblxuICAgIGNvbnN0IHBvcHVsYXRlQWlCb2FyZCA9IChmdW5jdGlvbiAoKSB7XG4gICAgICBnZXROb2Rlcy5haUdyb3VuZHNEaXZzLmZvckVhY2goKGRpdiwgZGl2SW5kZXgpID0+IHtcbiAgICAgICAgY29tcHV0ZXJCb2FyZC5mb3JFYWNoKChlbnRyeSwgZW50cnlJbmRleCkgPT4ge1xuICAgICAgICAgIGlmIChkaXZJbmRleCA9PT0gZW50cnlJbmRleCkge1xuICAgICAgICAgICAgaWYgKGVudHJ5ICE9PSBudWxsICYmIGVudHJ5ICE9PSBcIk9cIikge1xuICAgICAgICAgICAgICBjb25zdCBwZWVrQWlCb2FyZCA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgZ2V0Tm9kZXMucGVla0J1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgaWYgKGdldE5vZGVzLmRpbWVuc2lvbk9wdGlvbnMudmFsdWUgPT09IFwic3BhdGlhbFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgY29uc3QgZXhpdERpYWxvZyA9IChhc3luYyBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGdldE5vZGVzLmNvdmVyLnN0eWxlLnpJbmRleCA9IFwiMFwiO1xuICAgICAgICAgICAgICAgICAgICBnZXROb2Rlcy5jb25maWdEaWFsb2cuc3R5bGUub3BhY2l0eSA9IFwiMFwiO1xuICAgICAgICAgICAgICAgICAgICBnZXROb2Rlcy5jb25maWdEaWFsb2cuc3R5bGUudHJhbnNpdGlvbiA9IFwib3BhY2l0eSAwLjVzIGVhc2UtaW4tb3V0XCI7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBnZXROb2Rlcy5jb25maWdEaWFsb2cuc3R5bGUudmlzaWJpbGl0eSA9IFwiaGlkZGVuXCI7XG4gICAgICAgICAgICAgICAgICAgICAgfSwgNDAwKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICB9KSgpO1xuXG4gICAgICAgICAgICAgICAgICAvLyBTaG93IGNvbG9yc1xuICAgICAgICAgICAgICAgICAgc2V0UmFuZG9tQ29sb3JzKGRpdiwgZW50cnkpO1xuXG4gICAgICAgICAgICAgICAgICBjb25zdCBoaWRlQWlCb2FyZCA9IChhc3luYyBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBnZXROb2Rlcy5haUdyb3VuZHNEaXZzLmZvckVhY2goKGRpdikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICBkaXYuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJpbml0aWFsXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICB9LCAxMDAwKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KSgpO1xuICB9O1xuXG4gIGNvbnN0IHBvcHVsYXRlV2l0aERpbWVuc2lvbkNoYW5nZSA9IChmdW5jdGlvbiAoKSB7XG4gICAgZ2V0Tm9kZXMuZGltZW5zaW9uT3B0aW9ucy5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIChldmVudCkgPT4ge1xuICAgICAgaWYgKGV2ZW50LnRhcmdldC52YWx1ZSA9PT0gXCJzaW1wbGVcIikge1xuICAgICAgICBjb25zdCBpbmFjdGl2YXRlQWxpZ25lZEJ1dHRvbiA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgZ2V0Tm9kZXMuYWxpZ25lZEJ1dHRvbi5zdHlsZS5wb2ludGVyRXZlbnRzID0gXCJub25lXCI7XG4gICAgICAgICAgZ2V0Tm9kZXMuYWxpZ25lZEJ1dHRvbi5zdHlsZS5jb2xvciA9IFwicmdiYSgyNTUsIDI1NSwgMjU1LCAwLjYpXCI7XG4gICAgICAgIH0pKCk7XG4gICAgICAgIGNvbnN0IGluYWN0aXZhdGVSZWFsaWduQnV0dG9uID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBnZXROb2Rlcy5yZWFsaWduQnV0dG9uLnN0eWxlLnBvaW50ZXJFdmVudHMgPSBcIm5vbmVcIjtcbiAgICAgICAgICBnZXROb2Rlcy5yZWFsaWduQnV0dG9uLnN0eWxlLmNvbG9yID0gXCJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuNilcIjtcbiAgICAgICAgfSkoKTtcblxuICAgICAgICBjb25zdCBjbGVhclNwYXRpYWxTaGlwcyA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgZ2V0Tm9kZXMuYWRtaXJhbEdyb3VuZHNEaXZzLmZvckVhY2goKGRpdikgPT4ge1xuICAgICAgICAgICAgaWYgKGRpdi5xdWVyeVNlbGVjdG9yKFwiaW1nXCIpKSB7XG4gICAgICAgICAgICAgIGRpdi5xdWVyeVNlbGVjdG9yKFwiaW1nXCIpLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIGdldE5vZGVzLmFpR3JvdW5kc0RpdnMuZm9yRWFjaCgoZGl2KSA9PiB7XG4gICAgICAgICAgICBpZiAoZGl2LnF1ZXJ5U2VsZWN0b3IoXCJpbWdcIikpIHtcbiAgICAgICAgICAgICAgZGl2LnF1ZXJ5U2VsZWN0b3IoXCJpbWdcIikuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9KSgpO1xuXG4gICAgICAgIHBvcHVsYXRlV2l0aENvbG9yKCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChldmVudC50YXJnZXQudmFsdWUgPT09IFwic3BhdGlhbFwiKSB7XG4gICAgICAgIGNvbnN0IGFjdGl2YXRlUmVhbGlnbkJ1dHRvbiA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgZ2V0Tm9kZXMucmVhbGlnbkJ1dHRvbi5zdHlsZS5wb2ludGVyRXZlbnRzID0gXCJhdXRvXCI7XG4gICAgICAgICAgZ2V0Tm9kZXMucmVhbGlnbkJ1dHRvbi5zdHlsZS5jb2xvciA9IFwicmdiKDI1NSwgMjU1LCAyNTUpXCI7XG4gICAgICAgIH0pKCk7XG5cbiAgICAgICAgY29uc3QgY2xlYXJDb2xvcnMgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGdldE5vZGVzLmFkbWlyYWxHcm91bmRzRGl2cy5mb3JFYWNoKChkaXYpID0+IHtcbiAgICAgICAgICAgIGRpdi5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcImluaXRpYWxcIjtcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIGdldE5vZGVzLmFpR3JvdW5kc0RpdnMuZm9yRWFjaCgoZGl2KSA9PiB7XG4gICAgICAgICAgICBkaXYuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJpbml0aWFsXCI7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pKCk7XG5cbiAgICAgICAgY29uc3QgYnJpbmdCYWNrU3BhdGlhbFNoaXBzID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBnZXROb2Rlcy5hZG1pcmFsR3JvdW5kc0RpdnMuZm9yRWFjaCgoZGl2KSA9PiB7XG4gICAgICAgICAgICBpZiAoZGl2LnF1ZXJ5U2VsZWN0b3IoXCJpbWdcIikpIHtcbiAgICAgICAgICAgICAgZGl2LnF1ZXJ5U2VsZWN0b3IoXCJpbWdcIikuc3R5bGUuZGlzcGxheSA9IFwiaW5saW5lXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pKCk7XG5cbiAgY29uc3QgcG9wdWxhdGVBaUJvYXJkV2hlbkdhbWVPdmVyID0gZnVuY3Rpb24gKCkge1xuICAgIGdldE5vZGVzLmFpR3JvdW5kc0RpdnMuZm9yRWFjaCgoZGl2LCBkaXZJbmRleCkgPT4ge1xuICAgICAgY29tcHV0ZXJCb2FyZC5mb3JFYWNoKChlbnRyeSwgZW50cnlJbmRleCkgPT4ge1xuICAgICAgICBpZiAoZGl2SW5kZXggPT09IGVudHJ5SW5kZXgpIHtcbiAgICAgICAgICBpZiAoZ2V0Tm9kZXMuZGltZW5zaW9uT3B0aW9ucy52YWx1ZSA9PT0gXCJzaW1wbGVcIikge1xuICAgICAgICAgICAgc2V0UmFuZG9tQ29sb3JzKGRpdiwgZW50cnkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoZ2V0Tm9kZXMuZGltZW5zaW9uT3B0aW9ucy52YWx1ZSA9PT0gXCJzcGF0aWFsXCIpIHtcbiAgICAgICAgICAgIGlmIChkaXYucXVlcnlTZWxlY3RvcihcImltZ1wiKSkge1xuICAgICAgICAgICAgICBkaXYucXVlcnlTZWxlY3RvcihcImltZ1wiKS5zdHlsZS5kaXNwbGF5ID0gXCJpbmxpbmVcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9O1xuXG4gIHJldHVybiB7IGdhbWUsIHBvcHVsYXRlQWlCb2FyZFdoZW5HYW1lT3ZlciB9O1xufSkoKTtcblxuY29uc3QgZGlzcGxheVRhcmdldCA9IChmdW5jdGlvbiAoKSB7XG4gIGNvbnN0IF9fZm9yRWFjaEdyb3VuZHMgPSBmdW5jdGlvbiAoZ3JvdW5kcykge1xuICAgIGdyb3VuZHMuZm9yRWFjaCgoZGl2KSA9PiB7XG4gICAgICBjb25zdCB0YXJnZXRTcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XG4gICAgICB0YXJnZXRTcGFuLnRleHRDb250ZW50ID0gXCLwn5KiXCI7XG4gICAgICB0YXJnZXRTcGFuLnN0eWxlLnpJbmRleCA9IFwiMVwiO1xuICAgICAgdGFyZ2V0U3Bhbi5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICBkaXYuYXBwZW5kQ2hpbGQodGFyZ2V0U3Bhbik7XG5cbiAgICAgIGRpdi5hZGRFdmVudExpc3RlbmVyKFwibW91c2VvdmVyXCIsICgpID0+IHtcbiAgICAgICAgdGFyZ2V0U3Bhbi5zdHlsZS5kaXNwbGF5ID0gXCJpbmxpbmVcIjtcbiAgICAgICAgdGFyZ2V0U3Bhbi5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcInJnYmEoMjU1LCAyNTUsIDI1NSwgMC4zKVwiO1xuICAgICAgfSk7XG4gICAgICBkaXYuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlb3V0XCIsICgpID0+IHtcbiAgICAgICAgaWYgKGRpdi50ZXh0Q29udGVudCAhPT0gXCJYXCIgJiYgZGl2LnRleHRDb250ZW50ICE9PSBcIvCfkqVcIikge1xuICAgICAgICAgIHRhcmdldFNwYW4uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgICB9XG4gICAgICAgIHRhcmdldFNwYW4uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJpbml0aWFsXCI7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfTtcblxuICBfX2ZvckVhY2hHcm91bmRzKGdldE5vZGVzLmFkbWlyYWxHcm91bmRzRGl2cyk7XG4gIF9fZm9yRWFjaEdyb3VuZHMoZ2V0Tm9kZXMuYWlHcm91bmRzRGl2cyk7XG59KSgpO1xuXG5jb25zdCBzZXREZWZhdWx0QXR0cmlidXRlc0luQ29vcmRpbmF0ZXMgPSAoZnVuY3Rpb24gKCkge1xuICBjb25zdCBzZXRDb29yZGluYXRlc1RvVW5BdHRhY2tlZCA9IChmdW5jdGlvbiAoKSB7XG4gICAgZ2V0Tm9kZXMuYWlHcm91bmRzRGl2cy5mb3JFYWNoKChkaXYpID0+IHtcbiAgICAgIGRpdi5zZXRBdHRyaWJ1dGUoXCJkYXRhLWF0dGFja2VkXCIsIFwiTm9cIik7XG4gICAgfSk7XG4gICAgZ2V0Tm9kZXMuYWRtaXJhbEdyb3VuZHNEaXZzLmZvckVhY2goKGRpdikgPT4ge1xuICAgICAgZGl2LnNldEF0dHJpYnV0ZShcImRhdGEtYXR0YWNrZWRcIiwgXCJOb1wiKTtcbiAgICB9KTtcbiAgfSkoKTtcblxuICBjb25zdCBhZGRJbmRleFRvQ29vcmRpbmF0ZXMgPSAoZnVuY3Rpb24gKCkge1xuICAgIGxldCBpbmRleCA9IDE7XG4gICAgbGV0IGFscEluZGV4ID0gMDtcbiAgICBjb25zdCBhbHBzID0gW1wiQVwiLCBcIkJcIiwgXCJDXCIsIFwiRFwiLCBcIkVcIiwgXCJGXCIsIFwiR1wiLCBcIkhcIiwgXCJJXCIsIFwiSlwiXTtcblxuICAgIGdldE5vZGVzLmFpR3JvdW5kc0RpdnMuZm9yRWFjaCgoZGl2LCBkaXZJbmRleCkgPT4ge1xuICAgICAgaWYgKGRpdkluZGV4ID09PSAxMCAqIGluZGV4KSB7XG4gICAgICAgIGluZGV4ICs9IDE7XG4gICAgICAgIGFscEluZGV4ID0gMDtcbiAgICAgIH1cbiAgICAgIGRpdi5zZXRBdHRyaWJ1dGUoXCJkYXRhLWluZGV4XCIsIGAke2luZGV4fSR7YWxwc1thbHBJbmRleF19YCk7XG4gICAgICBhbHBJbmRleCArPSAxO1xuICAgIH0pO1xuXG4gICAgaW5kZXggPSAxO1xuICAgIGFscEluZGV4ID0gMDtcbiAgICBnZXROb2Rlcy5hZG1pcmFsR3JvdW5kc0RpdnMuZm9yRWFjaCgoZGl2LCBkaXZJbmRleCkgPT4ge1xuICAgICAgaWYgKGRpdkluZGV4ID09PSAxMCAqIGluZGV4KSB7XG4gICAgICAgIGluZGV4ICs9IDE7XG4gICAgICAgIGFscEluZGV4ID0gMDtcbiAgICAgIH1cbiAgICAgIGRpdi5zZXRBdHRyaWJ1dGUoXCJkYXRhLWluZGV4XCIsIGAke2luZGV4fSR7YWxwc1thbHBJbmRleF19YCk7XG4gICAgICBhbHBJbmRleCArPSAxO1xuICAgIH0pO1xuICB9KSgpO1xufSkoKTtcblxuY29uc3QgbG9vcEdhbWUgPSAoZnVuY3Rpb24gKCkge1xuICBjb25zdCBnYW1lID0gcG9wdWxhdGVCb2FyZHMuZ2FtZTtcbiAgbGV0IGdhbWVPdmVyID0gZmFsc2U7XG5cbiAgY29uc3QgZ2V0RGlmZmljdWx0eSA9IChmdW5jdGlvbiAoKSB7XG4gICAgbGV0IGRpZmZpY3VsdHkgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImRpZmZpY3VsdHlcIik7XG4gICAgaWYgKCFkaWZmaWN1bHR5KSB7XG4gICAgICBkaWZmaWN1bHR5ID0gXCJub3JtYWxcIjtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGRpZmZpY3VsdHkgPT09IFwiaW1wb3NzaWJsZVwiKSB7XG4gICAgICAgIGdldE5vZGVzLmRpZmZpY3VsdHlPcHRpb25zLm9wdGlvbnNbMF0ucmVtb3ZlQXR0cmlidXRlKFwic2VsZWN0ZWRcIik7XG4gICAgICAgIGdldE5vZGVzLmRpZmZpY3VsdHlPcHRpb25zLm9wdGlvbnNbMV0ucmVtb3ZlQXR0cmlidXRlKFwic2VsZWN0ZWRcIik7XG4gICAgICAgIGdldE5vZGVzLmRpZmZpY3VsdHlPcHRpb25zLm9wdGlvbnNbMl0uc2V0QXR0cmlidXRlKFwic2VsZWN0ZWRcIiwgdHJ1ZSk7XG4gICAgICAgIGdldE5vZGVzLmZlZWRiYWNrLnRleHRDb250ZW50ID0gXCJEb24ndCBtaXNzIVwiO1xuICAgICAgfVxuICAgICAgaWYgKGRpZmZpY3VsdHkgPT09IFwibm9ybWFsXCIpIHtcbiAgICAgICAgZ2V0Tm9kZXMuZGlmZmljdWx0eU9wdGlvbnMub3B0aW9uc1swXS5yZW1vdmVBdHRyaWJ1dGUoXCJzZWxlY3RlZFwiKTtcbiAgICAgICAgZ2V0Tm9kZXMuZGlmZmljdWx0eU9wdGlvbnMub3B0aW9uc1sxXS5zZXRBdHRyaWJ1dGUoXCJzZWxlY3RlZFwiLCB0cnVlKTtcbiAgICAgICAgZ2V0Tm9kZXMuZGlmZmljdWx0eU9wdGlvbnMub3B0aW9uc1syXS5yZW1vdmVBdHRyaWJ1dGUoXCJzZWxlY3RlZFwiKTtcbiAgICAgICAgZ2V0Tm9kZXMuZmVlZGJhY2sudGV4dENvbnRlbnQgPSBcIkluaXRpYXRlIGF0dGFjayFcIjtcbiAgICAgIH1cbiAgICAgIGlmIChkaWZmaWN1bHR5ID09PSBcImR1bW15XCIpIHtcbiAgICAgICAgZ2V0Tm9kZXMuZGlmZmljdWx0eU9wdGlvbnMub3B0aW9uc1swXS5zZXRBdHRyaWJ1dGUoXCJzZWxlY3RlZFwiLCB0cnVlKTtcbiAgICAgICAgZ2V0Tm9kZXMuZGlmZmljdWx0eU9wdGlvbnMub3B0aW9uc1sxXS5yZW1vdmVBdHRyaWJ1dGUoXCJzZWxlY3RlZFwiKTtcbiAgICAgICAgZ2V0Tm9kZXMuZGlmZmljdWx0eU9wdGlvbnMub3B0aW9uc1syXS5yZW1vdmVBdHRyaWJ1dGUoXCJzZWxlY3RlZFwiKTtcbiAgICAgICAgZ2V0Tm9kZXMuZmVlZGJhY2sudGV4dENvbnRlbnQgPSBcIkluaXRpYXRlIGF0dGFjayFcIjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4geyBkaWZmaWN1bHR5IH07XG4gIH0pKCk7XG5cbiAgY29uc3QgZGlzcGxheUF0dGFjayA9IGZ1bmN0aW9uIChzcG90LCBpbnB1dFZhbHVlLCBmb250Q29sb3IpIHtcbiAgICBjb25zdCBzcGFuID0gc3BvdC5xdWVyeVNlbGVjdG9yKFwic3BhblwiKTtcbiAgICBzcGFuLnN0eWxlLmRpc3BsYXkgPSBcImlubGluZVwiO1xuICAgIHNwYW4udGV4dENvbnRlbnQgPSBpbnB1dFZhbHVlO1xuICAgIHNwYW4uc3R5bGUuekluZGV4ID0gXCIxXCI7XG5cbiAgICBzcG90LnN0eWxlLmNvbG9yID0gZm9udENvbG9yO1xuICAgIHNwb3Quc3R5bGUucG9pbnRlckV2ZW50cyA9IFwibm9uZVwiO1xuICAgIHNwb3Quc3R5bGUuekluZGV4ID0gXCIxXCI7XG4gICAgc3BvdC5zZXRBdHRyaWJ1dGUoXCJkYXRhLWF0dGFja2VkXCIsIFwiWWVzXCIpO1xuICB9O1xuXG4gIGNvbnN0IHNldEZlZWRiYWNrID0gZnVuY3Rpb24gKGFpT3JVc2VyLCBtaXNzZWRPckhpdCwgc2hpcERhdGFzZXQpIHtcbiAgICBjb25zdCBnZXRGZWVkYmFja01lc3NhZ2UgPSBmdW5jdGlvbiAoYWlPclVzZXIyKSB7XG4gICAgICBsZXQgZmVlZGJhY2tNZXNzYWdlID0gXCJcIjtcbiAgICAgIGxldCB2aWN0aW0gPSBudWxsO1xuXG4gICAgICBpZiAoYWlPclVzZXIyID09PSBcImFpXCIpIHtcbiAgICAgICAgdmljdGltID0gZ2FtZS51c2VyO1xuICAgICAgfSBlbHNlIGlmIChhaU9yVXNlcjIgPT09IFwidXNlclwiKSB7XG4gICAgICAgIHZpY3RpbSA9IGdhbWUuY29tcHV0ZXI7XG4gICAgICB9XG5cbiAgICAgIHN3aXRjaCAoc2hpcERhdGFzZXQpIHtcbiAgICAgICAgY2FzZSBcIjVcIjpcbiAgICAgICAgICBmZWVkYmFja01lc3NhZ2UgPSBcIkhpdCB0aGUgQ2FycmllciDwn46vXCI7XG4gICAgICAgICAgaWYgKHZpY3RpbS5zaGlwcy5DYXJyaWVyLmN1cnJlbnROdW1IaXRzID09PSA1KSB7XG4gICAgICAgICAgICBmZWVkYmFja01lc3NhZ2UgPVxuICAgICAgICAgICAgICAnU3VuayB0aGUgQ2FycmllciEgPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjx0aXRsZT5zYWlsLWJvYXQtc2luazwvdGl0bGU+PHBhdGggZD1cIk0yMC45NiAyMUMxOS45IDIxIDE4LjkgMjAuNzQgMTcuOTYgMjAuMjRDMTYuMTIgMjEuMjQgMTMuODEgMjEuMjQgMTEuOTcgMjAuMjRDMTAuMTMgMjEuMjQgNy44MiAyMS4yNCA2IDIwLjI0QzQuNzcgMjAuOTMgMy4zNiAyMS4wNCAyIDIxVjE5QzMuNDEgMTkuMDQgNC43NyAxOC44OSA2IDE4QzcuNzQgMTkuMjQgMTAuMjEgMTkuMjQgMTEuOTcgMThDMTMuNzQgMTkuMjQgMTYuMiAxOS4yNCAxNy45NiAxOEMxOS4xNyAxOC44OSAyMC41NCAxOS4wNCAyMS45NCAxOVYyMUgyMC45Nk0yMiAzLjVMNy4xMSA1Ljk2TDEzLjExIDEyLjE3TDIyIDMuNU0xMC44MSAxNi4zNkwxMS45NyAxNS41NEwxMy4xMiAxNi4zNkMxMy42NSAxNi43MiAxNC4zIDE2LjkzIDE0Ljk3IDE2LjkzQzE1LjEyIDE2LjkzIDE1LjI4IDE2LjkxIDE1LjQzIDE2Ljg5TDUuMiA2LjMxQzQuMjkgNy42NSAzLjkgOS4zMiA0IDEwLjkyTDkuNzQgMTYuODNDMTAuMTMgMTYuNzQgMTAuNSAxNi41OCAxMC44MSAxNi4zNlpcIiAvPjwvc3ZnPic7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiNFwiOlxuICAgICAgICAgIGZlZWRiYWNrTWVzc2FnZSA9IFwiSGl0IHRoZSBCYXR0bGVzaGlwIPCfjq9cIjtcbiAgICAgICAgICBpZiAodmljdGltLnNoaXBzLkJhdHRsZXNoaXAuY3VycmVudE51bUhpdHMgPT09IDQpIHtcbiAgICAgICAgICAgIGZlZWRiYWNrTWVzc2FnZSA9XG4gICAgICAgICAgICAgICdTdW5rIHRoZSBCYXR0bGVzaGlwISA8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+PHRpdGxlPnNhaWwtYm9hdC1zaW5rPC90aXRsZT48cGF0aCBkPVwiTTIwLjk2IDIxQzE5LjkgMjEgMTguOSAyMC43NCAxNy45NiAyMC4yNEMxNi4xMiAyMS4yNCAxMy44MSAyMS4yNCAxMS45NyAyMC4yNEMxMC4xMyAyMS4yNCA3LjgyIDIxLjI0IDYgMjAuMjRDNC43NyAyMC45MyAzLjM2IDIxLjA0IDIgMjFWMTlDMy40MSAxOS4wNCA0Ljc3IDE4Ljg5IDYgMThDNy43NCAxOS4yNCAxMC4yMSAxOS4yNCAxMS45NyAxOEMxMy43NCAxOS4yNCAxNi4yIDE5LjI0IDE3Ljk2IDE4QzE5LjE3IDE4Ljg5IDIwLjU0IDE5LjA0IDIxLjk0IDE5VjIxSDIwLjk2TTIyIDMuNUw3LjExIDUuOTZMMTMuMTEgMTIuMTdMMjIgMy41TTEwLjgxIDE2LjM2TDExLjk3IDE1LjU0TDEzLjEyIDE2LjM2QzEzLjY1IDE2LjcyIDE0LjMgMTYuOTMgMTQuOTcgMTYuOTNDMTUuMTIgMTYuOTMgMTUuMjggMTYuOTEgMTUuNDMgMTYuODlMNS4yIDYuMzFDNC4yOSA3LjY1IDMuOSA5LjMyIDQgMTAuOTJMOS43NCAxNi44M0MxMC4xMyAxNi43NCAxMC41IDE2LjU4IDEwLjgxIDE2LjM2WlwiIC8+PC9zdmc+JztcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCIzLjVcIjpcbiAgICAgICAgICBmZWVkYmFja01lc3NhZ2UgPSBcIkhpdCB0aGUgRGVzdHJveWVyIPCfjq9cIjtcbiAgICAgICAgICBpZiAodmljdGltLnNoaXBzLkRlc3Ryb3llci5jdXJyZW50TnVtSGl0cyA9PT0gMykge1xuICAgICAgICAgICAgZmVlZGJhY2tNZXNzYWdlID1cbiAgICAgICAgICAgICAgJ1N1bmsgdGhlIERlc3Ryb3llciEgPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjx0aXRsZT5zYWlsLWJvYXQtc2luazwvdGl0bGU+PHBhdGggZD1cIk0yMC45NiAyMUMxOS45IDIxIDE4LjkgMjAuNzQgMTcuOTYgMjAuMjRDMTYuMTIgMjEuMjQgMTMuODEgMjEuMjQgMTEuOTcgMjAuMjRDMTAuMTMgMjEuMjQgNy44MiAyMS4yNCA2IDIwLjI0QzQuNzcgMjAuOTMgMy4zNiAyMS4wNCAyIDIxVjE5QzMuNDEgMTkuMDQgNC43NyAxOC44OSA2IDE4QzcuNzQgMTkuMjQgMTAuMjEgMTkuMjQgMTEuOTcgMThDMTMuNzQgMTkuMjQgMTYuMiAxOS4yNCAxNy45NiAxOEMxOS4xNyAxOC44OSAyMC41NCAxOS4wNCAyMS45NCAxOVYyMUgyMC45Nk0yMiAzLjVMNy4xMSA1Ljk2TDEzLjExIDEyLjE3TDIyIDMuNU0xMC44MSAxNi4zNkwxMS45NyAxNS41NEwxMy4xMiAxNi4zNkMxMy42NSAxNi43MiAxNC4zIDE2LjkzIDE0Ljk3IDE2LjkzQzE1LjEyIDE2LjkzIDE1LjI4IDE2LjkxIDE1LjQzIDE2Ljg5TDUuMiA2LjMxQzQuMjkgNy42NSAzLjkgOS4zMiA0IDEwLjkyTDkuNzQgMTYuODNDMTAuMTMgMTYuNzQgMTAuNSAxNi41OCAxMC44MSAxNi4zNlpcIiAvPjwvc3ZnPic7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiM1wiOlxuICAgICAgICAgIGZlZWRiYWNrTWVzc2FnZSA9IFwiSGl0IHRoZSBTdWJtYXJpbmUg8J+Or1wiO1xuICAgICAgICAgIGlmICh2aWN0aW0uc2hpcHMuU3VibWFyaW5lLmN1cnJlbnROdW1IaXRzID09PSAzKSB7XG4gICAgICAgICAgICBmZWVkYmFja01lc3NhZ2UgPVxuICAgICAgICAgICAgICAnU3VuayB0aGUgU3VibWFyaW5lISA8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+PHRpdGxlPnNhaWwtYm9hdC1zaW5rPC90aXRsZT48cGF0aCBkPVwiTTIwLjk2IDIxQzE5LjkgMjEgMTguOSAyMC43NCAxNy45NiAyMC4yNEMxNi4xMiAyMS4yNCAxMy44MSAyMS4yNCAxMS45NyAyMC4yNEMxMC4xMyAyMS4yNCA3LjgyIDIxLjI0IDYgMjAuMjRDNC43NyAyMC45MyAzLjM2IDIxLjA0IDIgMjFWMTlDMy40MSAxOS4wNCA0Ljc3IDE4Ljg5IDYgMThDNy43NCAxOS4yNCAxMC4yMSAxOS4yNCAxMS45NyAxOEMxMy43NCAxOS4yNCAxNi4yIDE5LjI0IDE3Ljk2IDE4QzE5LjE3IDE4Ljg5IDIwLjU0IDE5LjA0IDIxLjk0IDE5VjIxSDIwLjk2TTIyIDMuNUw3LjExIDUuOTZMMTMuMTEgMTIuMTdMMjIgMy41TTEwLjgxIDE2LjM2TDExLjk3IDE1LjU0TDEzLjEyIDE2LjM2QzEzLjY1IDE2LjcyIDE0LjMgMTYuOTMgMTQuOTcgMTYuOTNDMTUuMTIgMTYuOTMgMTUuMjggMTYuOTEgMTUuNDMgMTYuODlMNS4yIDYuMzFDNC4yOSA3LjY1IDMuOSA5LjMyIDQgMTAuOTJMOS43NCAxNi44M0MxMC4xMyAxNi43NCAxMC41IDE2LjU4IDEwLjgxIDE2LjM2WlwiIC8+PC9zdmc+JztcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCIyXCI6XG4gICAgICAgICAgZmVlZGJhY2tNZXNzYWdlID0gXCJIaXQgdGhlIFBhdHJvbCBCb2F0IPCfjq9cIjtcbiAgICAgICAgICBpZiAodmljdGltLnNoaXBzW1wiUGF0cm9sIEJvYXRcIl0uY3VycmVudE51bUhpdHMgPT09IDIpIHtcbiAgICAgICAgICAgIGZlZWRiYWNrTWVzc2FnZSA9XG4gICAgICAgICAgICAgICdTdW5rIHRoZSBQYXRyb2wgQm9hdCEgPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjx0aXRsZT5zYWlsLWJvYXQtc2luazwvdGl0bGU+PHBhdGggZD1cIk0yMC45NiAyMUMxOS45IDIxIDE4LjkgMjAuNzQgMTcuOTYgMjAuMjRDMTYuMTIgMjEuMjQgMTMuODEgMjEuMjQgMTEuOTcgMjAuMjRDMTAuMTMgMjEuMjQgNy44MiAyMS4yNCA2IDIwLjI0QzQuNzcgMjAuOTMgMy4zNiAyMS4wNCAyIDIxVjE5QzMuNDEgMTkuMDQgNC43NyAxOC44OSA2IDE4QzcuNzQgMTkuMjQgMTAuMjEgMTkuMjQgMTEuOTcgMThDMTMuNzQgMTkuMjQgMTYuMiAxOS4yNCAxNy45NiAxOEMxOS4xNyAxOC44OSAyMC41NCAxOS4wNCAyMS45NCAxOVYyMUgyMC45Nk0yMiAzLjVMNy4xMSA1Ljk2TDEzLjExIDEyLjE3TDIyIDMuNU0xMC44MSAxNi4zNkwxMS45NyAxNS41NEwxMy4xMiAxNi4zNkMxMy42NSAxNi43MiAxNC4zIDE2LjkzIDE0Ljk3IDE2LjkzQzE1LjEyIDE2LjkzIDE1LjI4IDE2LjkxIDE1LjQzIDE2Ljg5TDUuMiA2LjMxQzQuMjkgNy42NSAzLjkgOS4zMiA0IDEwLjkyTDkuNzQgMTYuODNDMTAuMTMgMTYuNzQgMTAuNSAxNi41OCAxMC44MSAxNi4zNlpcIiAvPjwvc3ZnPic7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgLy8gRGVjbGFyZSB3aW5uZXJcbiAgICAgIGlmIChhaU9yVXNlcjIgPT09IFwiYWlcIikge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgdmljdGltLnNoaXBzLkNhcnJpZXIuaXNTdW5rKCkgJiZcbiAgICAgICAgICB2aWN0aW0uc2hpcHMuQmF0dGxlc2hpcC5pc1N1bmsoKSAmJlxuICAgICAgICAgIHZpY3RpbS5zaGlwcy5EZXN0cm95ZXIuaXNTdW5rKCkgJiZcbiAgICAgICAgICB2aWN0aW0uc2hpcHMuU3VibWFyaW5lLmlzU3VuaygpICYmXG4gICAgICAgICAgdmljdGltLnNoaXBzW1wiUGF0cm9sIEJvYXRcIl0uaXNTdW5rKClcbiAgICAgICAgKSB7XG4gICAgICAgICAgZmVlZGJhY2tNZXNzYWdlID0gXCJEZXN0cm95ZWQgYWxsIHlvdXIgc2hpcHMuIPCfmJ5cIjtcbiAgICAgICAgICBnYW1lT3ZlciA9IHRydWU7XG4gICAgICAgICAgcG9wdWxhdGVCb2FyZHMucG9wdWxhdGVBaUJvYXJkV2hlbkdhbWVPdmVyKCk7XG4gICAgICAgICAgZ2V0Tm9kZXMuYWlHcm91bmRzLnN0eWxlLnBvaW50ZXJFdmVudHMgPSBcIm5vbmVcIjtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChhaU9yVXNlcjIgPT09IFwidXNlclwiKSB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICB2aWN0aW0uc2hpcHMuQ2Fycmllci5pc1N1bmsoKSAmJlxuICAgICAgICAgIHZpY3RpbS5zaGlwcy5CYXR0bGVzaGlwLmlzU3VuaygpICYmXG4gICAgICAgICAgdmljdGltLnNoaXBzLkRlc3Ryb3llci5pc1N1bmsoKSAmJlxuICAgICAgICAgIHZpY3RpbS5zaGlwcy5TdWJtYXJpbmUuaXNTdW5rKCkgJiZcbiAgICAgICAgICB2aWN0aW0uc2hpcHNbXCJQYXRyb2wgQm9hdFwiXS5pc1N1bmsoKVxuICAgICAgICApIHtcbiAgICAgICAgICBmZWVkYmFja01lc3NhZ2UgPSBcIlN1bmsgYWxsIHNoaXBzISDwn4+GXCI7XG4gICAgICAgICAgZ2FtZU92ZXIgPSB0cnVlO1xuICAgICAgICAgIHBvcHVsYXRlQm9hcmRzLnBvcHVsYXRlQWlCb2FyZFdoZW5HYW1lT3ZlcigpO1xuICAgICAgICAgIGdldE5vZGVzLmFpR3JvdW5kcy5zdHlsZS5wb2ludGVyRXZlbnRzID0gXCJub25lXCI7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGZlZWRiYWNrTWVzc2FnZTtcbiAgICB9O1xuXG4gICAgaWYgKGFpT3JVc2VyID09PSBcImFpXCIpIHtcbiAgICAgIGlmIChtaXNzZWRPckhpdCA9PT0gXCJtaXNzZWRcIikge1xuICAgICAgICBnZXROb2Rlcy5mZWVkYmFjay50ZXh0Q29udGVudCA9IGBBSTogTWlzc2VkIOKcl2A7XG4gICAgICB9XG4gICAgICBpZiAobWlzc2VkT3JIaXQgPT09IFwiaGl0XCIpIHtcbiAgICAgICAgY29uc3QgZmVlZGJhY2tNZXNzYWdlID0gZ2V0RmVlZGJhY2tNZXNzYWdlKFwiYWlcIik7XG4gICAgICAgIGdldE5vZGVzLmZlZWRiYWNrLmlubmVySFRNTCA9IGBBSTogJHtmZWVkYmFja01lc3NhZ2V9YDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoYWlPclVzZXIgPT09IFwidXNlclwiKSB7XG4gICAgICBpZiAobWlzc2VkT3JIaXQgPT09IFwibWlzc2VkXCIpIHtcbiAgICAgICAgZ2V0Tm9kZXMuZmVlZGJhY2sudGV4dENvbnRlbnQgPSBgQWRtaXJhbCAke3JldHJpZXZlQWRtaXJhbE5hbWVGcm9tU3RvcmFnZUFuZFNldC5hZG1pcmFsTmFtZX06IE1pc3NlZCDinJdgO1xuICAgICAgfVxuICAgICAgaWYgKG1pc3NlZE9ySGl0ID09PSBcImhpdFwiKSB7XG4gICAgICAgIGNvbnN0IGZlZWRiYWNrTWVzc2FnZSA9IGdldEZlZWRiYWNrTWVzc2FnZShcInVzZXJcIik7XG4gICAgICAgIGdldE5vZGVzLmZlZWRiYWNrLmlubmVySFRNTCA9IGBBZG1pcmFsICR7cmV0cmlldmVBZG1pcmFsTmFtZUZyb21TdG9yYWdlQW5kU2V0LmFkbWlyYWxOYW1lfTogJHtmZWVkYmFja01lc3NhZ2V9YDtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgY29uc3QgdHJpZ2dlclVzZXJUdXJuID0gZnVuY3Rpb24gKCkge1xuICAgIGlmIChnYW1lT3Zlcikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGdldE5vZGVzLmFpR3JvdW5kcy5zdHlsZS5wb2ludGVyRXZlbnRzID0gXCJhdXRvXCI7XG4gICAgZ2V0Tm9kZXMuYWlHcm91bmRzRGl2cy5mb3JFYWNoKChkaXYpID0+IHtcbiAgICAgIGRpdi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgICBjb25zdCBpbmFjdGl2YXRlQWxpZ25lZEJ1dHRvbiA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgZ2V0Tm9kZXMuYWxpZ25lZEJ1dHRvbi5zdHlsZS5wb2ludGVyRXZlbnRzID0gXCJub25lXCI7XG4gICAgICAgICAgZ2V0Tm9kZXMuYWxpZ25lZEJ1dHRvbi5zdHlsZS5jb2xvciA9IFwicmdiYSgyNTUsIDI1NSwgMjU1LCAwLjYpXCI7XG4gICAgICAgIH0pKCk7XG4gICAgICAgIGNvbnN0IGluYWN0aXZhdGVSZWFsaWduQnV0dG9uID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBnZXROb2Rlcy5yZWFsaWduQnV0dG9uLnN0eWxlLnBvaW50ZXJFdmVudHMgPSBcIm5vbmVcIjtcbiAgICAgICAgICBnZXROb2Rlcy5yZWFsaWduQnV0dG9uLnN0eWxlLmNvbG9yID0gXCJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuNilcIjtcbiAgICAgICAgfSkoKTtcbiAgICAgICAgLy8gSUYgZW1wdHlcbiAgICAgICAgaWYgKGRpdi5kYXRhc2V0LmF0dGFja2VkID09PSBcIk5vXCIgJiYgIWRpdi5oYXNBdHRyaWJ1dGUoXCJkYXRhLXNoaXBcIikpIHtcbiAgICAgICAgICBnYW1lLnVzZXJUdXJuKGRpdi5kYXRhc2V0LmluZGV4KTtcbiAgICAgICAgICBkaXNwbGF5QXR0YWNrKGRpdiwgXCJYXCIsIFwicmdiKDIyOCwgNzMsIDczKVwiKTtcbiAgICAgICAgICBzZXRGZWVkYmFjayhcInVzZXJcIiwgXCJtaXNzZWRcIik7XG4gICAgICAgICAgdHJpZ2dlckFpVHVybigpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAvLyBJRiBoaXRzIGEgc2hpcFxuICAgICAgICBpZiAoZGl2LmRhdGFzZXQuYXR0YWNrZWQgPT09IFwiTm9cIiAmJiBkaXYuaGFzQXR0cmlidXRlKFwiZGF0YS1zaGlwXCIpKSB7XG4gICAgICAgICAgZ2FtZS51c2VyVHVybihkaXYuZGF0YXNldC5pbmRleCk7XG4gICAgICAgICAgZGlzcGxheUF0dGFjayhkaXYsIFwi8J+SpVwiLCBcImJsYWNrXCIpO1xuICAgICAgICAgIHNldEZlZWRiYWNrKFwidXNlclwiLCBcImhpdFwiLCBkaXYuZGF0YXNldC5zaGlwKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9O1xuICB0cmlnZ2VyVXNlclR1cm4oKTtcblxuICBsZXQgYWlUaW1lciA9IDIwMDA7XG4gIGxldCByZWN1cnNpb25Db3VudCA9IDA7XG4gIGNvbnN0IHRyaWdnZXJBaVR1cm4gPSBhc3luYyBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKGdhbWVPdmVyKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZ2V0Tm9kZXMuYWlHcm91bmRzLnN0eWxlLnBvaW50ZXJFdmVudHMgPSBcIm5vbmVcIjtcbiAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgaWYgKGFpVGltZXIgIT09IDEpIHtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgZ2V0Tm9kZXMuZmVlZGJhY2sudGV4dENvbnRlbnQgPSBgQUk6IFRhcmdldGluZy4uLmA7XG4gICAgICAgIH0sIDE1MDApO1xuICAgICAgfVxuICAgICAgc2V0VGltZW91dChyZXNvbHZlLCBhaVRpbWVyKTtcbiAgICB9KTtcbiAgICBjb25zdCByYW5kb21LZXkgPSBnYW1lLmNvbXB1dGVyVHVybigpO1xuXG4gICAgZm9yIChjb25zdCBkaXYgb2YgZ2V0Tm9kZXMuYWRtaXJhbEdyb3VuZHNEaXZzKSB7XG4gICAgICBjb25zdCBkaWZmaWN1bHR5ID0gZ2V0RGlmZmljdWx0eS5kaWZmaWN1bHR5O1xuICAgICAgaWYgKGRpdi5kYXRhc2V0LmluZGV4ID09PSByYW5kb21LZXkpIHtcbiAgICAgICAgLy8gSUYgZW1wdHlcbiAgICAgICAgaWYgKGRpdi5kYXRhc2V0LmF0dGFja2VkID09PSBcIk5vXCIgJiYgIWRpdi5oYXNBdHRyaWJ1dGUoXCJkYXRhLXNoaXBcIikpIHtcbiAgICAgICAgICAvLyBSZWN1cnNlIGF0IGZhc3RlciB0aW1lb3V0IGlmIGRpZmZpY3VsdHkgaXMgSW1wb3NzaWJsZVxuICAgICAgICAgIGlmIChkaWZmaWN1bHR5ID09PSBcImltcG9zc2libGVcIikge1xuICAgICAgICAgICAgaWYgKHJlY3Vyc2lvbkNvdW50ID4gMCkge1xuICAgICAgICAgICAgICBhaVRpbWVyID0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlY3Vyc2lvbkNvdW50ICs9IDE7XG4gICAgICAgICAgICB0cmlnZ2VyQWlUdXJuKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29uc3QgcmVzZXREdW1teVRpbWVyUGFyYW1ldGVycyA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoZGlmZmljdWx0eSA9PT0gXCJkdW1teVwiKSB7XG4gICAgICAgICAgICAgIHJlY3Vyc2lvbkNvdW50ID0gMDtcbiAgICAgICAgICAgICAgYWlUaW1lciA9IDIwMDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSkoKTtcblxuICAgICAgICAgIGRpc3BsYXlBdHRhY2soZGl2LCBcIlhcIiwgXCJyZ2IoMjI4LCA3MywgNzMpXCIpO1xuICAgICAgICAgIHNldEZlZWRiYWNrKFwiYWlcIiwgXCJtaXNzZWRcIik7XG4gICAgICAgICAgZ2V0Tm9kZXMuYWlHcm91bmRzLnN0eWxlLnBvaW50ZXJFdmVudHMgPSBcImF1dG9cIjtcbiAgICAgICAgfVxuICAgICAgICAvLyBJRiBoaXRzIGEgc2hpcFxuICAgICAgICBpZiAoZGl2LmRhdGFzZXQuYXR0YWNrZWQgPT09IFwiTm9cIiAmJiBkaXYuaGFzQXR0cmlidXRlKFwiZGF0YS1zaGlwXCIpKSB7XG4gICAgICAgICAgLy8gUmVjdXJzZSBhdCBmYXN0ZXIgdGltZW91dCBpZiBkaWZmaWN1bHR5IGlzIGR1bW15XG4gICAgICAgICAgaWYgKGRpZmZpY3VsdHkgPT09IFwiZHVtbXlcIikge1xuICAgICAgICAgICAgaWYgKHJlY3Vyc2lvbkNvdW50ID4gMCkge1xuICAgICAgICAgICAgICBhaVRpbWVyID0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlY3Vyc2lvbkNvdW50ICs9IDE7XG4gICAgICAgICAgICB0cmlnZ2VyQWlUdXJuKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29uc3QgcmVzZXRJbXBvc3NpYmxlVGltZXJQYXJhbWV0ZXJzID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmIChkaWZmaWN1bHR5ID09PSBcImltcG9zc2libGVcIikge1xuICAgICAgICAgICAgICByZWN1cnNpb25Db3VudCA9IDA7XG4gICAgICAgICAgICAgIGFpVGltZXIgPSAyMDAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pKCk7XG5cbiAgICAgICAgICBkaXNwbGF5QXR0YWNrKGRpdiwgXCLwn5KlXCIsIFwiYmxhY2tcIik7XG4gICAgICAgICAgc2V0RmVlZGJhY2soXCJhaVwiLCBcImhpdFwiLCBkaXYuZGF0YXNldC5zaGlwKTtcbiAgICAgICAgICB0cmlnZ2VyQWlUdXJuKCk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiB7IGdhbWVPdmVyIH07XG59KSgpO1xuXG5sZXQgY2F0Y2hFdmVudENsZWFyaW5nTG9naWMgPSBudWxsO1xubGV0IGlzU2hpcFBvc2l0aW9uQ2hhbmdlZCA9IGZhbHNlO1xuY29uc3Qgc2V0RHJhZ0FuZERyb3AgPSBmdW5jdGlvbiAoKSB7XG4gIGNvbnN0IGdhbWUgPSBwb3B1bGF0ZUJvYXJkcy5nYW1lO1xuXG4gIGNvbnN0IHNldEF0dHJpYnV0ZXMgPSAoZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IGxlZ2FsTW92ZXMgPSBnYW1lLnVzZXIuZ2V0TGVnYWxNb3ZlcygpO1xuICAgIGNvbnN0IGRlZmF1bHRVc2VyQm9hcmQgPSBnYW1lLnVzZXIuYm9hcmQ7XG5cbiAgICBnZXROb2Rlcy5hZG1pcmFsR3JvdW5kc0RpdnMuZm9yRWFjaCgoZGl2KSA9PiB7XG4gICAgICBpZiAoZGl2LmRhdGFzZXQuc2hpcCkge1xuICAgICAgICBkaXYuc2V0QXR0cmlidXRlKFwiZHJhZ2dhYmxlXCIsIHRydWUpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgY29uc3QgZ2V0TW92ZXMgPSBmdW5jdGlvbiAoc2hpcEluZGV4KSB7XG4gICAgICBjb25zdCBzaGlwTW92ZXMgPSBsZWdhbE1vdmVzW3NoaXBJbmRleF07XG4gICAgICBjb25zdCBzaGlwTGVnYWxNb3ZlcyA9IFtdO1xuICAgICAgY29uc3Qgc2hpcElsbGVnYWxNb3ZlcyA9IFtdO1xuICAgICAgY29uc3QgZGVmaW5lTW92ZXNGb3JFYWNoU2hpcFJvdyA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGZvciAobGV0IG4gPSAwOyBuIDwgMTA7IG4rKykge1xuICAgICAgICAgIHNoaXBMZWdhbE1vdmVzLnB1c2goW10pO1xuICAgICAgICAgIHNoaXBJbGxlZ2FsTW92ZXMucHVzaChbXSk7XG4gICAgICAgIH1cbiAgICAgIH0pKCk7XG5cbiAgICAgIGRlZmF1bHRVc2VyQm9hcmQuZm9yRWFjaCgoc2hpcFJvdywgcm93SW5kZXgpID0+IHtcbiAgICAgICAgc2hpcE1vdmVzLmZvckVhY2goKG1vdmVzLCBpbmRleCkgPT4ge1xuICAgICAgICAgIGNvbnN0IHZhbHVlcyA9IFtdO1xuICAgICAgICAgIGZvciAobGV0IG4gPSAwOyBuIDwgbW92ZXMubGVuZ3RoOyBuKyspIHtcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gc2hpcFJvd1ttb3Zlc1tuXV07XG4gICAgICAgICAgICB2YWx1ZXMucHVzaCh2YWx1ZSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29uc3QgY2hlY2tMZWdhbGl0eSA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjb25zdCBpc0FsbE51bGwgPSB2YWx1ZXMuZXZlcnkoKHZhbHVlKSA9PiB2YWx1ZSA9PT0gbnVsbCk7XG4gICAgICAgICAgICBpZiAoaXNBbGxOdWxsKSB7XG4gICAgICAgICAgICAgIHNoaXBMZWdhbE1vdmVzW3Jvd0luZGV4XS5wdXNoKG1vdmVzWzBdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghaXNBbGxOdWxsKSB7XG4gICAgICAgICAgICAgIHNoaXBJbGxlZ2FsTW92ZXNbcm93SW5kZXhdLnB1c2gobW92ZXNbMF0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pKCk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4geyBzaGlwTGVnYWxNb3Zlcywgc2hpcElsbGVnYWxNb3ZlcyB9O1xuICAgIH07XG5cbiAgICBjb25zdCBzZXRTaGlwQXR0cmlidXRlcyA9IGZ1bmN0aW9uIChzaGlwSW5kZXgsIHNoaXBMZW5ndGgpIHtcbiAgICAgIGNvbnN0IHNoaXBNb3ZlcyA9IGdldE1vdmVzKHNoaXBJbmRleCk7XG4gICAgICBjb25zdCBzaGlwTGVnYWxNb3ZlcyA9IHNoaXBNb3Zlcy5zaGlwTGVnYWxNb3ZlcztcbiAgICAgIGNvbnN0IHNoaXBJbGxlZ2FsTW92ZXMgPSBzaGlwTW92ZXMuc2hpcElsbGVnYWxNb3ZlcztcblxuICAgICAgZ2V0Tm9kZXMuYWRtaXJhbEdyb3VuZHNEaXZzLmZvckVhY2goKGRpdiwgZGl2SW5kZXgpID0+IHtcbiAgICAgICAgc2hpcExlZ2FsTW92ZXMuZm9yRWFjaCgobW92ZXMsIG1vdmVzSW5kZXgpID0+IHtcbiAgICAgICAgICBpZiAobW92ZXMpIHtcbiAgICAgICAgICAgIGlmIChtb3Zlc0luZGV4ID09PSBwYXJzZUludChkaXZJbmRleCAvIDEwKSkge1xuICAgICAgICAgICAgICBtb3Zlcy5mb3JFYWNoKChtb3ZlKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKG1vdmUgPT09IGRpdkluZGV4ICUgMTApIHtcbiAgICAgICAgICAgICAgICAgIGRpdi5jbGFzc0xpc3QuYWRkKGBkcm9wcGFibGUke3NoaXBMZW5ndGh9YCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBzaGlwSWxsZWdhbE1vdmVzLmZvckVhY2goKG1vdmVzLCBtb3Zlc0luZGV4KSA9PiB7XG4gICAgICAgICAgaWYgKG1vdmVzKSB7XG4gICAgICAgICAgICBpZiAobW92ZXNJbmRleCA9PT0gcGFyc2VJbnQoZGl2SW5kZXggLyAxMCkpIHtcbiAgICAgICAgICAgICAgbW92ZXMuZm9yRWFjaCgobW92ZSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChtb3ZlID09PSBkaXZJbmRleCAlIDEwKSB7XG4gICAgICAgICAgICAgICAgICBkaXYuY2xhc3NMaXN0LmFkZChgbm90LWRyb3BwYWJsZSR7c2hpcExlbmd0aH1gKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIHNldFNoaXBBdHRyaWJ1dGVzKDAsIDUpO1xuICAgIHNldFNoaXBBdHRyaWJ1dGVzKDEsIDQpO1xuICAgIHNldFNoaXBBdHRyaWJ1dGVzKDIsIDMpO1xuICAgIHNldFNoaXBBdHRyaWJ1dGVzKDMsIDMpO1xuICAgIHNldFNoaXBBdHRyaWJ1dGVzKDQsIDIpO1xuICB9KSgpO1xuICBjb25zdCBkcmFnZ2FibGVTaGlwcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJkaXZbZHJhZ2dhYmxlPSd0cnVlJ11cIik7XG5cbiAgY29uc3QgY2FycmllckRyb3BwYWJsZVNwb3RzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5kcm9wcGFibGU1XCIpO1xuICBjb25zdCBjYXJyaWVyTm90RHJvcHBhYmxlU3BvdHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLm5vdC1kcm9wcGFibGU1XCIpO1xuXG4gIGNvbnN0IGJhdHRsZXNoaXBEcm9wcGFibGVTcG90cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZHJvcHBhYmxlNFwiKTtcbiAgY29uc3QgYmF0dGxlc2hpcE5vdERyb3BwYWJsZVNwb3RzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5ub3QtZHJvcHBhYmxlNFwiKTtcblxuICBjb25zdCBkZXNBbmRTdWJEcm9wcGFibGVTcG90cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZHJvcHBhYmxlM1wiKTtcbiAgY29uc3QgZGVzQW5kU3ViTm90RHJvcHBhYmxlU3BvdHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLm5vdC1kcm9wcGFibGUzXCIpO1xuXG4gIGNvbnN0IHBhdHJvbEJvYXREcm9wcGFibGVTcG90cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZHJvcHBhYmxlMlwiKTtcbiAgY29uc3QgcGF0cm9sQm9hdE5vdERyb3BwYWJsZVNwb3RzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5ub3QtZHJvcHBhYmxlMlwiKTtcblxuICBsZXQgY2F0Y2hFdmVudERhdGFzZXQgPSBudWxsO1xuICBjb25zdCBkcmFnU3RhcnQgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICBldmVudC5kYXRhVHJhbnNmZXIuc2V0RGF0YShcInRleHQvcGxhaW5cIiwgZXZlbnQudGFyZ2V0LmRhdGFzZXQuc2hpcCk7XG4gICAgY2F0Y2hFdmVudERhdGFzZXQgPSBldmVudC50YXJnZXQuZGF0YXNldC5zaGlwO1xuXG4gICAgLy8gU2VsZWN0IGZpcnN0IHNoaXBcbiAgICBjb25zdCBkcmFnZ2VkU2hpcCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLXNoaXA9JyR7Y2F0Y2hFdmVudERhdGFzZXR9J11gKTtcbiAgICBjb25zdCBzaGlwSW1nID0gZHJhZ2dlZFNoaXAucXVlcnlTZWxlY3RvcihcImltZ1wiKTtcbiAgICBsZXQgeE9mZnNldCA9IDA7XG4gICAgLy8gY29uc3QgY3JlYXRlWE9mZnNldCA9IChmdW5jdGlvbiAoKSB7XG4gICAgLy8gICBjb25zdCB0YXJnZXRzSW5kaWNlcyA9IFtdO1xuICAgIC8vICAgY29uc3QgZ2V0VGFyZ2V0c0luZGljZXMgPSAoZnVuY3Rpb24gKCkge1xuICAgIC8vICAgICBsZXQgY3VycmVudFRhcmdldCA9IGRyYWdnZWRTaGlwO1xuICAgIC8vICAgICBmb3IgKGxldCBuID0gMDsgbiA8IHBhcnNlSW50KGNhdGNoRXZlbnREYXRhc2V0KTsgbisrKSB7XG4gICAgLy8gICAgICAgaWYgKCFjdXJyZW50VGFyZ2V0KSB7XG4gICAgLy8gICAgICAgICByZXR1cm47XG4gICAgLy8gICAgICAgfVxuICAgIC8vICAgICAgIHRhcmdldHNJbmRpY2VzLnB1c2goY3VycmVudFRhcmdldC5kYXRhc2V0LmluZGV4KTtcbiAgICAvLyAgICAgICBjdXJyZW50VGFyZ2V0ID0gY3VycmVudFRhcmdldC5uZXh0RWxlbWVudFNpYmxpbmc7XG4gICAgLy8gICAgIH1cbiAgICAvLyAgIH0pKCk7XG4gICAgLy8gICB0YXJnZXRzSW5kaWNlcy5mb3JFYWNoKChpbmRleCwgY291bnQpID0+IHtcbiAgICAvLyAgICAgaWYgKGluZGV4ID09PSBldmVudC50YXJnZXQuZGF0YXNldC5pbmRleCkge1xuICAgIC8vICAgICAgIHhPZmZzZXQgPSBjb3VudCAqIDMwO1xuICAgIC8vICAgICB9XG4gICAgLy8gICB9KTtcbiAgICAvLyB9KSgpO1xuICAgIGV2ZW50LmRhdGFUcmFuc2Zlci5zZXREcmFnSW1hZ2Uoc2hpcEltZywgeE9mZnNldCwgMjApO1xuXG4gICAgY29uc3QgdHJpZ2dlclJpZ2h0RHJhZ0Ryb3BTaGlwID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgIHN3aXRjaCAoY2F0Y2hFdmVudERhdGFzZXQpIHtcbiAgICAgICAgY2FzZSBcIjVcIjpcbiAgICAgICAgICB0cmlnZ2VyQ2FycmllckRyYWdEcm9wKCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCI0XCI6XG4gICAgICAgICAgdHJpZ2dlckJhdHRsZXNoaXBEcmFnRHJvcCgpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiMy41XCI6XG4gICAgICAgICAgdHJpZ2dlckRlc0FuZFN1YkRyYWdEcm9wKCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCIzXCI6XG4gICAgICAgICAgdHJpZ2dlckRlc0FuZFN1YkRyYWdEcm9wKCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCIyXCI6XG4gICAgICAgICAgdHJpZ2dlclBhdHJvbEJvYXREcmFnRHJvcCgpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH0pKCk7XG4gIH07XG5cbiAgY29uc3QgZHJhZ092ZXIgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgY29uc3Qgc2V0SG92ZXJpbmdDb2xvciA9IChmdW5jdGlvbiAoKSB7XG4gICAgICBsZXQgY3VycmVudFRhcmdldCA9IGV2ZW50LnRhcmdldDtcbiAgICAgIGZvciAobGV0IG4gPSAwOyBuIDwgcGFyc2VJbnQoY2F0Y2hFdmVudERhdGFzZXQpOyBuKyspIHtcbiAgICAgICAgaWYgKCFjdXJyZW50VGFyZ2V0KSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGN1cnJlbnRUYXJnZXQuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJyZ2JhKDk4LCAyNTMsIDYwLCAwLjUpXCI7XG4gICAgICAgIGN1cnJlbnRUYXJnZXQgPSBjdXJyZW50VGFyZ2V0Lm5leHRFbGVtZW50U2libGluZztcbiAgICAgIH1cbiAgICB9KSgpO1xuICB9O1xuXG4gIGNvbnN0IGRyYWdMZWF2ZSA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgIGNvbnN0IHJlbW92ZUhvdmVyaW5nQ29sb3IgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgbGV0IGN1cnJlbnRUYXJnZXQgPSBldmVudC50YXJnZXQ7XG4gICAgICBmb3IgKGxldCBuID0gMDsgbiA8IHBhcnNlSW50KGNhdGNoRXZlbnREYXRhc2V0KTsgbisrKSB7XG4gICAgICAgIGlmICghY3VycmVudFRhcmdldCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjdXJyZW50VGFyZ2V0LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiaW5pdGlhbFwiO1xuICAgICAgICBjdXJyZW50VGFyZ2V0ID0gY3VycmVudFRhcmdldC5uZXh0RWxlbWVudFNpYmxpbmc7XG4gICAgICB9XG4gICAgfSkoKTtcbiAgfTtcblxuICBjb25zdCBkcm9wID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICBjb25zdCBzaGlwRGF0YXNldCA9IGV2ZW50LmRhdGFUcmFuc2Zlci5nZXREYXRhKFwidGV4dC9wbGFpblwiKTtcbiAgICBjb25zdCBkcm9wVGFyZ2V0ID0gZXZlbnQudGFyZ2V0O1xuXG4gICAgY29uc3QgcmVtb3ZlSG92ZXJpbmdDb2xvciA9IChmdW5jdGlvbiAoKSB7XG4gICAgICBsZXQgY3VycmVudFRhcmdldCA9IGV2ZW50LnRhcmdldDtcbiAgICAgIGZvciAobGV0IG4gPSAwOyBuIDwgcGFyc2VJbnQoY2F0Y2hFdmVudERhdGFzZXQpOyBuKyspIHtcbiAgICAgICAgaWYgKCFjdXJyZW50VGFyZ2V0KSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGN1cnJlbnRUYXJnZXQuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJpbml0aWFsXCI7XG4gICAgICAgIGN1cnJlbnRUYXJnZXQgPSBjdXJyZW50VGFyZ2V0Lm5leHRFbGVtZW50U2libGluZztcbiAgICAgIH1cbiAgICB9KSgpO1xuXG4gICAgY29uc3QgZHJhZ2dlZFNoaXAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBbZGF0YS1zaGlwPScke3NoaXBEYXRhc2V0fSddYCk7XG4gICAgY29uc3QgcmVtb3ZlU2NhbGluZyA9IChmdW5jdGlvbiAoKSB7XG4gICAgICBkcm9wVGFyZ2V0LnN0eWxlLnRyYW5zZm9ybSA9IFwic2NhbGUoMSlcIjtcbiAgICB9KSgpO1xuXG4gICAgY29uc3QgYXBwZW5kU2hpcFRvVGFyZ2V0ID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgIC8vIEFwcGVuZCBzaGlwIGltZyBvZiB0aGUgZmlyc3QgZGl2KGluIHRoZSBzZXQgb2YgZGl2cyB3aXRoIHNhbWUgZGF0YXNldCkgdG8gdGhlIHRhcmdldCBkaXZcbiAgICAgIGNvbnN0IHNoaXBJbWcgPSBkcmFnZ2VkU2hpcC5xdWVyeVNlbGVjdG9yKFwiaW1nXCIpO1xuICAgICAgZHJvcFRhcmdldC5hcHBlbmRDaGlsZChzaGlwSW1nKTtcbiAgICB9KSgpO1xuXG4gICAgY29uc3QgdHJhbnNmZXJBdHRyaWJ1dGVzRnJvbURyYWdnZWRTaGlwc1RvVGFyZ2V0cyA9IChmdW5jdGlvbiAoKSB7XG4gICAgICBjb25zdCByZW1vdmVBdHRyaWJ1dGVzID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY29uc3QgZHJhZ2dlZFNoaXBzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgW2RhdGEtc2hpcD0nJHtzaGlwRGF0YXNldH0nXWApO1xuICAgICAgICBkcmFnZ2VkU2hpcHMuZm9yRWFjaCgoc2hpcCkgPT4ge1xuICAgICAgICAgIHNoaXAucmVtb3ZlQXR0cmlidXRlKFwiZGF0YS1zaGlwXCIpO1xuICAgICAgICAgIHNoaXAuc2V0QXR0cmlidXRlKFwiZHJhZ2dhYmxlXCIsIGZhbHNlKTtcbiAgICAgICAgfSk7XG4gICAgICB9KSgpO1xuXG4gICAgICBjb25zdCBhZGRUb1RhcmdldHMgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICBsZXQgY3VycmVudFRhcmdldCA9IGV2ZW50LnRhcmdldDtcbiAgICAgICAgZm9yIChsZXQgbiA9IDA7IG4gPCBwYXJzZUludChjYXRjaEV2ZW50RGF0YXNldCk7IG4rKykge1xuICAgICAgICAgIGlmICghY3VycmVudFRhcmdldCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjdXJyZW50VGFyZ2V0LnNldEF0dHJpYnV0ZShcImRhdGEtc2hpcFwiLCBgJHtjYXRjaEV2ZW50RGF0YXNldH1gKTtcbiAgICAgICAgICBjdXJyZW50VGFyZ2V0LnNldEF0dHJpYnV0ZShcImRyYWdnYWJsZVwiLCB0cnVlKTtcbiAgICAgICAgICBjdXJyZW50VGFyZ2V0ID0gY3VycmVudFRhcmdldC5uZXh0RWxlbWVudFNpYmxpbmc7XG4gICAgICAgIH1cbiAgICAgIH0pKCk7XG4gICAgfSkoKTtcblxuICAgIGNvbnN0IGluZGljYXRlUG9zaXRpb25DaGFuZ2UgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgaXNTaGlwUG9zaXRpb25DaGFuZ2VkID0gdHJ1ZTtcbiAgICB9KSgpO1xuXG4gICAgY29uc3QgdXBkYXRlQm9hcmQgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgY29uc3QgZ2VuZXJhdGVLZXlzID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gQWxwaGFiZXRzIEEtSlxuICAgICAgICBjb25zdCBhbHBoYWJldHMgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgbiA9IDY1OyBuIDw9IDc0OyBuKyspIHtcbiAgICAgICAgICBhbHBoYWJldHMucHVzaChTdHJpbmcuZnJvbUNoYXJDb2RlKG4pKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGtleXMgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgbSA9IDE7IG0gPD0gMTA7IG0rKykge1xuICAgICAgICAgIGNvbnN0IHN1YktleXMgPSBbXTtcbiAgICAgICAgICBmb3IgKGNvbnN0IGxldHRlciBvZiBhbHBoYWJldHMpIHtcbiAgICAgICAgICAgIHN1YktleXMucHVzaChgJHttfWAgKyBsZXR0ZXIpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBrZXlzLnB1c2goc3ViS2V5cyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ga2V5cztcbiAgICAgIH0pKCk7XG5cbiAgICAgIGNvbnN0IGFzc2lnbktleXNUb0JvYXJkSW5kaWNlcyA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNvbnN0IEtleXNCb3ggPSB7fTtcbiAgICAgICAgY29uc3Qga2V5cyA9IGdlbmVyYXRlS2V5cztcblxuICAgICAgICBmb3IgKGxldCByb3dJbmRleCA9IDA7IHJvd0luZGV4IDwgMTA7IHJvd0luZGV4KyspIHtcbiAgICAgICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgMTA7IGluZGV4KyspIHtcbiAgICAgICAgICAgIEtleXNCb3hbYCR7a2V5c1tyb3dJbmRleF1baW5kZXhdfWBdID0gW2luZGV4LCByb3dJbmRleF07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBLZXlzQm94O1xuICAgICAgfSkoKTtcblxuICAgICAgY29uc3QgY2xlYXJTaGlwc0JvdWRhcmllcyA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGdhbWUudXNlci5ib2FyZC5mb3JFYWNoKChyb3csIHJvd0luZGV4KSA9PiB7XG4gICAgICAgICAgcm93LmZvckVhY2goKHZhbHVlLCB2YWx1ZUluZGV4KSA9PiB7XG4gICAgICAgICAgICBpZiAodmFsdWUgPT09IFwiT1wiKSB7XG4gICAgICAgICAgICAgIGdhbWUudXNlci5ib2FyZFtyb3dJbmRleF1bdmFsdWVJbmRleF0gPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH0pKCk7XG5cbiAgICAgIGNvbnN0IHRyYW5zZmVyRHJvcHBlZFNoaXAgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICBjb25zdCBuZXdTcG90c0luZGljZXMgPSBbXTtcbiAgICAgICAgY29uc3QgZ2V0RHJvcHBlZFNoaXBTcG90c0luZGljZXMgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGxldCBjdXJyZW50VGFyZ2V0ID0gZXZlbnQudGFyZ2V0O1xuICAgICAgICAgIGZvciAobGV0IG4gPSAwOyBuIDwgcGFyc2VJbnQoY2F0Y2hFdmVudERhdGFzZXQpOyBuKyspIHtcbiAgICAgICAgICAgIGlmICghY3VycmVudFRhcmdldCkge1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBpbmRleCA9IGN1cnJlbnRUYXJnZXQuZGF0YXNldC5pbmRleDtcbiAgICAgICAgICAgIG5ld1Nwb3RzSW5kaWNlcy5wdXNoKGluZGV4KTtcbiAgICAgICAgICAgIGN1cnJlbnRUYXJnZXQgPSBjdXJyZW50VGFyZ2V0Lm5leHRFbGVtZW50U2libGluZztcbiAgICAgICAgICB9XG4gICAgICAgIH0pKCk7XG5cbiAgICAgICAgY29uc3QgY2xlYXJTaGlwRnJvbU9sZFNwb3RzID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBnYW1lLnVzZXIuYm9hcmQuZm9yRWFjaCgocm93LCByb3dJbmRleCkgPT4ge1xuICAgICAgICAgICAgcm93LmZvckVhY2goKHZhbHVlLCB2YWx1ZUluZGV4KSA9PiB7XG4gICAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gcGFyc2VGbG9hdChjYXRjaEV2ZW50RGF0YXNldCkpIHtcbiAgICAgICAgICAgICAgICBnYW1lLnVzZXIuYm9hcmRbcm93SW5kZXhdW3ZhbHVlSW5kZXhdID0gbnVsbDtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pKCk7XG5cbiAgICAgICAgY29uc3QgYWRkU2hpcFRvTmV3U3BvdHMgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGNvbnN0IGJvYXJkSW5kaWNlcyA9IFtdO1xuICAgICAgICAgIGNvbnN0IEtleXNCb3ggPSBhc3NpZ25LZXlzVG9Cb2FyZEluZGljZXM7XG4gICAgICAgICAgbmV3U3BvdHNJbmRpY2VzLmZvckVhY2goKGluZGV4KSA9PiB7XG4gICAgICAgICAgICBib2FyZEluZGljZXMucHVzaChLZXlzQm94W2luZGV4XSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgYm9hcmRJbmRpY2VzLmZvckVhY2goKGluZGV4KSA9PiB7XG4gICAgICAgICAgICBnYW1lLnVzZXIuYm9hcmRbaW5kZXhbMV1dW2luZGV4WzBdXSA9IHBhcnNlRmxvYXQoY2F0Y2hFdmVudERhdGFzZXQpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KSgpO1xuXG4gICAgICAgIGNvbnN0IGJvYXJkID0gZ2FtZS51c2VyLmJvYXJkO1xuICAgICAgICBjb25zdCBhZGROZXdCb3VuZGFyaWVzID0gZnVuY3Rpb24gKHJvd0luZGV4LCBzaGlwTGVuZ3RoKSB7XG4gICAgICAgICAgY29uc3QgcG9wdWxhdGVkUm93ID0gYm9hcmRbcm93SW5kZXhdO1xuICAgICAgICAgIGNvbnN0IGxhc3RPY2N1cGllZCA9IHBvcHVsYXRlZFJvdy5sYXN0SW5kZXhPZihzaGlwTGVuZ3RoKTtcbiAgICAgICAgICBsZXQgZmlyc3RPY2N1cGllZCA9IG51bGw7XG5cbiAgICAgICAgICBjb25zdCBvY2N1cHkgPSBmdW5jdGlvbiAoXG4gICAgICAgICAgICBmaXJzdEluZGV4RW1wdHksXG4gICAgICAgICAgICBsYXN0SW5kZXhFbXB0eSxcbiAgICAgICAgICAgIGZpcnN0VG9wQm90dG9tLFxuICAgICAgICAgICAgbGFzdFRvcEJvdHRvbSxcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIC8vIE9jY3VweSBmaXJzdCBhbmQgbGFzdCBpbmRleCBvZiBzaGlwXG4gICAgICAgICAgICBmaXJzdE9jY3VwaWVkID0gcG9wdWxhdGVkUm93LmluZGV4T2Yoc2hpcExlbmd0aCk7XG4gICAgICAgICAgICBpZiAoZmlyc3RJbmRleEVtcHR5ICYmICFsYXN0SW5kZXhFbXB0eSkge1xuICAgICAgICAgICAgICBwb3B1bGF0ZWRSb3dbZmlyc3RPY2N1cGllZCAtIDFdID0gXCJPXCI7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCFmaXJzdEluZGV4RW1wdHkgJiYgbGFzdEluZGV4RW1wdHkpIHtcbiAgICAgICAgICAgICAgcG9wdWxhdGVkUm93W2xhc3RPY2N1cGllZCArIDFdID0gXCJPXCI7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGZpcnN0SW5kZXhFbXB0eSAmJiBsYXN0SW5kZXhFbXB0eSkge1xuICAgICAgICAgICAgICBwb3B1bGF0ZWRSb3dbZmlyc3RPY2N1cGllZCAtIDFdID0gXCJPXCI7XG4gICAgICAgICAgICAgIHBvcHVsYXRlZFJvd1tsYXN0T2NjdXBpZWQgKyAxXSA9IFwiT1wiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gT2NjdXB5IHRvcCBhbmQvb3IgYm90dG9tXG4gICAgICAgICAgICBpZiAocm93SW5kZXggPT09IDApIHtcbiAgICAgICAgICAgICAgY29uc3QgYm90dG9tQWRqYWNlbnRSb3cgPSBib2FyZFsxXTtcbiAgICAgICAgICAgICAgYm90dG9tQWRqYWNlbnRSb3cuZmlsbChcbiAgICAgICAgICAgICAgICBcIk9cIixcbiAgICAgICAgICAgICAgICBmaXJzdE9jY3VwaWVkIC0gZmlyc3RUb3BCb3R0b20sXG4gICAgICAgICAgICAgICAgbGFzdE9jY3VwaWVkICsgbGFzdFRvcEJvdHRvbSxcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAocm93SW5kZXggPT09IDkpIHtcbiAgICAgICAgICAgICAgY29uc3QgdG9wQWRqYWNlbnRSb3cgPSBib2FyZFs4XTtcbiAgICAgICAgICAgICAgdG9wQWRqYWNlbnRSb3cuZmlsbChcbiAgICAgICAgICAgICAgICBcIk9cIixcbiAgICAgICAgICAgICAgICBmaXJzdE9jY3VwaWVkIC0gZmlyc3RUb3BCb3R0b20sXG4gICAgICAgICAgICAgICAgbGFzdE9jY3VwaWVkICsgbGFzdFRvcEJvdHRvbSxcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGNvbnN0IHRvcEFkamFjZW50Um93ID0gYm9hcmRbcm93SW5kZXggLSAxXTtcbiAgICAgICAgICAgICAgY29uc3QgYm90dG9tQWRqYWNlbnRSb3cgPSBib2FyZFtyb3dJbmRleCArIDFdO1xuICAgICAgICAgICAgICB0b3BBZGphY2VudFJvdy5maWxsKFxuICAgICAgICAgICAgICAgIFwiT1wiLFxuICAgICAgICAgICAgICAgIGZpcnN0T2NjdXBpZWQgLSBmaXJzdFRvcEJvdHRvbSxcbiAgICAgICAgICAgICAgICBsYXN0T2NjdXBpZWQgKyBsYXN0VG9wQm90dG9tLFxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICBib3R0b21BZGphY2VudFJvdy5maWxsKFxuICAgICAgICAgICAgICAgIFwiT1wiLFxuICAgICAgICAgICAgICAgIGZpcnN0T2NjdXBpZWQgLSBmaXJzdFRvcEJvdHRvbSxcbiAgICAgICAgICAgICAgICBsYXN0T2NjdXBpZWQgKyBsYXN0VG9wQm90dG9tLFxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH07XG5cbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICBwb3B1bGF0ZWRSb3dbcG9wdWxhdGVkUm93LmluZGV4T2Yoc2hpcExlbmd0aCkgLSAxXSA9PT0gbnVsbCAmJlxuICAgICAgICAgICAgcG9wdWxhdGVkUm93W2xhc3RPY2N1cGllZCArIDFdICE9PSBudWxsXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICBvY2N1cHkodHJ1ZSwgZmFsc2UsIDEsIDEpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgICBwb3B1bGF0ZWRSb3dbcG9wdWxhdGVkUm93LmluZGV4T2Yoc2hpcExlbmd0aCkgLSAxXSAhPT0gbnVsbCAmJlxuICAgICAgICAgICAgcG9wdWxhdGVkUm93W2xhc3RPY2N1cGllZCArIDFdID09PSBudWxsXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICBvY2N1cHkoZmFsc2UsIHRydWUsIDAsIDIpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgICBwb3B1bGF0ZWRSb3dbcG9wdWxhdGVkUm93LmluZGV4T2Yoc2hpcExlbmd0aCkgLSAxXSA9PT0gbnVsbCAmJlxuICAgICAgICAgICAgcG9wdWxhdGVkUm93W2xhc3RPY2N1cGllZCArIDFdID09PSBudWxsXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICBvY2N1cHkodHJ1ZSwgdHJ1ZSwgMSwgMik7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG9jY3VweShmYWxzZSwgZmFsc2UsIDAsIDEpO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBzZXRCb3VuZGFyaWVzID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBmb3IgKGNvbnN0IHJvdyBvZiBib2FyZCkge1xuICAgICAgICAgICAgY29uc3QgaXNBbGxOdWxsID0gcm93LmV2ZXJ5KChlbnRyeSkgPT4gZW50cnkgPT09IG51bGwpO1xuICAgICAgICAgICAgaWYgKGlzQWxsTnVsbCkge1xuICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgZW50cmllcyA9IFtdO1xuICAgICAgICAgICAgcm93LmZvckVhY2goKGVudHJ5KSA9PiB7XG4gICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICBlbnRyeSA9PT0gNSB8fFxuICAgICAgICAgICAgICAgIGVudHJ5ID09PSA0IHx8XG4gICAgICAgICAgICAgICAgZW50cnkgPT09IDMuNSB8fFxuICAgICAgICAgICAgICAgIGVudHJ5ID09PSAzIHx8XG4gICAgICAgICAgICAgICAgZW50cnkgPT09IDJcbiAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgLy8gYXZvaWRNb3JlVGhhbk9uZUZ1bmN0aW9uQ2FsbE9uRW50cnlcbiAgICAgICAgICAgICAgICBpZiAoZW50cmllcy5pbmNsdWRlcyhlbnRyeSkpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZW50cmllcy5wdXNoKGVudHJ5KTtcbiAgICAgICAgICAgICAgICBhZGROZXdCb3VuZGFyaWVzKGJvYXJkLmluZGV4T2Yocm93KSwgZW50cnkpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gY29uc29sZS5sb2coZ2FtZS51c2VyLmJvYXJkKTtcbiAgICAgICAgfSkoKTtcbiAgICAgIH0pKCk7XG4gICAgfSkoKTtcblxuICAgIGNvbnN0IHJlbW92ZU9sZEF0dHJpYnV0ZXNBbmRFdmVudExpc3RlbmVycyA9IChmdW5jdGlvbiAoKSB7XG4gICAgICBnZXROb2Rlcy5hZG1pcmFsR3JvdW5kc0RpdnMuZm9yRWFjaCgoZGl2KSA9PiB7XG4gICAgICAgIGRpdi5jbGFzc0xpc3QgPSBbXTtcbiAgICAgIH0pO1xuICAgICAgLy8gUmVtb3ZlIGFsbCBldmVudCBsaXN0ZW5lcnNcbiAgICAgIGdldE5vZGVzLmFkbWlyYWxHcm91bmRzRGl2cy5mb3JFYWNoKChkaXYpID0+IHtcbiAgICAgICAgZGl2LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJkcmFnc3RhcnRcIiwgZHJhZ1N0YXJ0KTtcbiAgICAgICAgZGl2LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJkcmFnb3ZlclwiLCBkcmFnT3Zlcik7XG4gICAgICAgIGRpdi5yZW1vdmVFdmVudExpc3RlbmVyKFwiZHJhZ2xlYXZlXCIsIGRyYWdMZWF2ZSk7XG4gICAgICAgIGRpdi5yZW1vdmVFdmVudExpc3RlbmVyKFwiZHJvcFwiLCBkcm9wKTtcblxuICAgICAgICBkaXYucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImRyYWdvdmVyXCIsIG5vdERyb3BwYWJsZURyYWdPdmVyKTtcbiAgICAgICAgZGl2LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJkcmFnbGVhdmVcIiwgZHJhZ0xlYXZlKTtcbiAgICAgICAgZGl2LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJkcm9wXCIsIG5vdERyb3BwYWJsZURyb3ApO1xuICAgICAgfSk7XG4gICAgfSkoKTtcbiAgICAvLyBSZXN0YXJ0IHRvIGFkZCBuZXcgYXR0cmlidXRlcyBhbmQgbGlzdGVuZXJzXG4gICAgc2V0RHJhZ0FuZERyb3AoKTtcbiAgfTtcblxuICBjb25zdCBub3REcm9wcGFibGVEcmFnT3ZlciA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgY29uc3Qgc2V0SG92ZXJpbmdDb2xvciA9IChmdW5jdGlvbiAoKSB7XG4gICAgICBsZXQgY3VycmVudFRhcmdldCA9IGV2ZW50LnRhcmdldDtcbiAgICAgIGZvciAobGV0IG4gPSAwOyBuIDwgcGFyc2VJbnQoY2F0Y2hFdmVudERhdGFzZXQpOyBuKyspIHtcbiAgICAgICAgaWYgKCFjdXJyZW50VGFyZ2V0KSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGN1cnJlbnRUYXJnZXQuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJyZ2JhKDI0OCwgNzMsIDI5LCAwLjUpXCI7XG4gICAgICAgIGN1cnJlbnRUYXJnZXQgPSBjdXJyZW50VGFyZ2V0Lm5leHRFbGVtZW50U2libGluZztcbiAgICAgIH1cbiAgICB9KSgpO1xuICB9O1xuXG4gIGNvbnN0IG5vdERyb3BwYWJsZURyb3AgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGNvbnN0IHJlbW92ZUhvdmVyaW5nQ29sb3IgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgbGV0IGN1cnJlbnRUYXJnZXQgPSBldmVudC50YXJnZXQ7XG4gICAgICBmb3IgKGxldCBuID0gMDsgbiA8IHBhcnNlSW50KGNhdGNoRXZlbnREYXRhc2V0KTsgbisrKSB7XG4gICAgICAgIGlmICghY3VycmVudFRhcmdldCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjdXJyZW50VGFyZ2V0LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiaW5pdGlhbFwiO1xuICAgICAgICBjdXJyZW50VGFyZ2V0ID0gY3VycmVudFRhcmdldC5uZXh0RWxlbWVudFNpYmxpbmc7XG4gICAgICB9XG4gICAgfSkoKTtcbiAgfTtcblxuICBkcmFnZ2FibGVTaGlwcy5mb3JFYWNoKChzaGlwKSA9PiB7XG4gICAgc2hpcC5hZGRFdmVudExpc3RlbmVyKFwiZHJhZ3N0YXJ0XCIsIGRyYWdTdGFydCk7XG4gIH0pO1xuXG4gIGNvbnN0IHRyaWdnZXJDYXJyaWVyRHJhZ0Ryb3AgPSBmdW5jdGlvbiAoKSB7XG4gICAgZ2V0Tm9kZXMuYWRtaXJhbEdyb3VuZHNEaXZzLmZvckVhY2goKGRpdikgPT4ge1xuICAgICAgZGl2LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJkcmFnb3ZlclwiLCBkcmFnT3Zlcik7XG4gICAgICBkaXYucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImRyYWdsZWF2ZVwiLCBkcmFnTGVhdmUpO1xuICAgICAgZGl2LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJkcm9wXCIsIGRyb3ApO1xuXG4gICAgICBkaXYucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImRyYWdvdmVyXCIsIG5vdERyb3BwYWJsZURyYWdPdmVyKTtcbiAgICAgIGRpdi5yZW1vdmVFdmVudExpc3RlbmVyKFwiZHJhZ2xlYXZlXCIsIGRyYWdMZWF2ZSk7XG4gICAgICBkaXYucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImRyb3BcIiwgbm90RHJvcHBhYmxlRHJvcCk7XG4gICAgfSk7XG5cbiAgICBjYXJyaWVyRHJvcHBhYmxlU3BvdHMuZm9yRWFjaCgoc3BvdCkgPT4ge1xuICAgICAgc3BvdC5hZGRFdmVudExpc3RlbmVyKFwiZHJhZ292ZXJcIiwgZHJhZ092ZXIpO1xuICAgICAgc3BvdC5hZGRFdmVudExpc3RlbmVyKFwiZHJhZ2xlYXZlXCIsIGRyYWdMZWF2ZSk7XG4gICAgICBzcG90LmFkZEV2ZW50TGlzdGVuZXIoXCJkcm9wXCIsIGRyb3ApO1xuICAgIH0pO1xuICAgIGNhcnJpZXJOb3REcm9wcGFibGVTcG90cy5mb3JFYWNoKChzcG90KSA9PiB7XG4gICAgICBzcG90LmFkZEV2ZW50TGlzdGVuZXIoXCJkcmFnb3ZlclwiLCBub3REcm9wcGFibGVEcmFnT3Zlcik7XG4gICAgICBzcG90LmFkZEV2ZW50TGlzdGVuZXIoXCJkcmFnbGVhdmVcIiwgZHJhZ0xlYXZlKTtcbiAgICAgIHNwb3QuYWRkRXZlbnRMaXN0ZW5lcihcImRyb3BcIiwgbm90RHJvcHBhYmxlRHJvcCk7XG4gICAgfSk7XG4gIH07XG5cbiAgY29uc3QgdHJpZ2dlckJhdHRsZXNoaXBEcmFnRHJvcCA9IGZ1bmN0aW9uICgpIHtcbiAgICBnZXROb2Rlcy5hZG1pcmFsR3JvdW5kc0RpdnMuZm9yRWFjaCgoZGl2KSA9PiB7XG4gICAgICBkaXYucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImRyYWdvdmVyXCIsIGRyYWdPdmVyKTtcbiAgICAgIGRpdi5yZW1vdmVFdmVudExpc3RlbmVyKFwiZHJhZ2xlYXZlXCIsIGRyYWdMZWF2ZSk7XG4gICAgICBkaXYucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImRyb3BcIiwgZHJvcCk7XG5cbiAgICAgIGRpdi5yZW1vdmVFdmVudExpc3RlbmVyKFwiZHJhZ292ZXJcIiwgbm90RHJvcHBhYmxlRHJhZ092ZXIpO1xuICAgICAgZGl2LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJkcmFnbGVhdmVcIiwgZHJhZ0xlYXZlKTtcbiAgICAgIGRpdi5yZW1vdmVFdmVudExpc3RlbmVyKFwiZHJvcFwiLCBub3REcm9wcGFibGVEcm9wKTtcbiAgICB9KTtcblxuICAgIGJhdHRsZXNoaXBEcm9wcGFibGVTcG90cy5mb3JFYWNoKChzcG90KSA9PiB7XG4gICAgICBzcG90LmFkZEV2ZW50TGlzdGVuZXIoXCJkcmFnb3ZlclwiLCBkcmFnT3Zlcik7XG4gICAgICBzcG90LmFkZEV2ZW50TGlzdGVuZXIoXCJkcmFnbGVhdmVcIiwgZHJhZ0xlYXZlKTtcbiAgICAgIHNwb3QuYWRkRXZlbnRMaXN0ZW5lcihcImRyb3BcIiwgZHJvcCk7XG4gICAgfSk7XG4gICAgYmF0dGxlc2hpcE5vdERyb3BwYWJsZVNwb3RzLmZvckVhY2goKHNwb3QpID0+IHtcbiAgICAgIHNwb3QuYWRkRXZlbnRMaXN0ZW5lcihcImRyYWdvdmVyXCIsIG5vdERyb3BwYWJsZURyYWdPdmVyKTtcbiAgICAgIHNwb3QuYWRkRXZlbnRMaXN0ZW5lcihcImRyYWdsZWF2ZVwiLCBkcmFnTGVhdmUpO1xuICAgICAgc3BvdC5hZGRFdmVudExpc3RlbmVyKFwiZHJvcFwiLCBub3REcm9wcGFibGVEcm9wKTtcbiAgICB9KTtcbiAgfTtcblxuICBjb25zdCB0cmlnZ2VyRGVzQW5kU3ViRHJhZ0Ryb3AgPSBmdW5jdGlvbiAoKSB7XG4gICAgZ2V0Tm9kZXMuYWRtaXJhbEdyb3VuZHNEaXZzLmZvckVhY2goKGRpdikgPT4ge1xuICAgICAgZGl2LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJkcmFnb3ZlclwiLCBkcmFnT3Zlcik7XG4gICAgICBkaXYucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImRyYWdsZWF2ZVwiLCBkcmFnTGVhdmUpO1xuICAgICAgZGl2LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJkcm9wXCIsIGRyb3ApO1xuXG4gICAgICBkaXYucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImRyYWdvdmVyXCIsIG5vdERyb3BwYWJsZURyYWdPdmVyKTtcbiAgICAgIGRpdi5yZW1vdmVFdmVudExpc3RlbmVyKFwiZHJhZ2xlYXZlXCIsIGRyYWdMZWF2ZSk7XG4gICAgICBkaXYucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImRyb3BcIiwgbm90RHJvcHBhYmxlRHJvcCk7XG4gICAgfSk7XG5cbiAgICBkZXNBbmRTdWJEcm9wcGFibGVTcG90cy5mb3JFYWNoKChzcG90KSA9PiB7XG4gICAgICBzcG90LmFkZEV2ZW50TGlzdGVuZXIoXCJkcmFnb3ZlclwiLCBkcmFnT3Zlcik7XG4gICAgICBzcG90LmFkZEV2ZW50TGlzdGVuZXIoXCJkcmFnbGVhdmVcIiwgZHJhZ0xlYXZlKTtcbiAgICAgIHNwb3QuYWRkRXZlbnRMaXN0ZW5lcihcImRyb3BcIiwgZHJvcCk7XG4gICAgfSk7XG4gICAgZGVzQW5kU3ViTm90RHJvcHBhYmxlU3BvdHMuZm9yRWFjaCgoc3BvdCkgPT4ge1xuICAgICAgc3BvdC5hZGRFdmVudExpc3RlbmVyKFwiZHJhZ292ZXJcIiwgbm90RHJvcHBhYmxlRHJhZ092ZXIpO1xuICAgICAgc3BvdC5hZGRFdmVudExpc3RlbmVyKFwiZHJhZ2xlYXZlXCIsIGRyYWdMZWF2ZSk7XG4gICAgICBzcG90LmFkZEV2ZW50TGlzdGVuZXIoXCJkcm9wXCIsIG5vdERyb3BwYWJsZURyb3ApO1xuICAgIH0pO1xuICB9O1xuXG4gIGNvbnN0IHRyaWdnZXJQYXRyb2xCb2F0RHJhZ0Ryb3AgPSBmdW5jdGlvbiAoKSB7XG4gICAgZ2V0Tm9kZXMuYWRtaXJhbEdyb3VuZHNEaXZzLmZvckVhY2goKGRpdikgPT4ge1xuICAgICAgZGl2LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJkcmFnb3ZlclwiLCBkcmFnT3Zlcik7XG4gICAgICBkaXYucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImRyYWdsZWF2ZVwiLCBkcmFnTGVhdmUpO1xuICAgICAgZGl2LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJkcm9wXCIsIGRyb3ApO1xuXG4gICAgICBkaXYucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImRyYWdvdmVyXCIsIG5vdERyb3BwYWJsZURyYWdPdmVyKTtcbiAgICAgIGRpdi5yZW1vdmVFdmVudExpc3RlbmVyKFwiZHJhZ2xlYXZlXCIsIGRyYWdMZWF2ZSk7XG4gICAgICBkaXYucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImRyb3BcIiwgbm90RHJvcHBhYmxlRHJvcCk7XG4gICAgfSk7XG5cbiAgICBwYXRyb2xCb2F0RHJvcHBhYmxlU3BvdHMuZm9yRWFjaCgoc3BvdCkgPT4ge1xuICAgICAgc3BvdC5hZGRFdmVudExpc3RlbmVyKFwiZHJhZ292ZXJcIiwgZHJhZ092ZXIpO1xuICAgICAgc3BvdC5hZGRFdmVudExpc3RlbmVyKFwiZHJhZ2xlYXZlXCIsIGRyYWdMZWF2ZSk7XG4gICAgICBzcG90LmFkZEV2ZW50TGlzdGVuZXIoXCJkcm9wXCIsIGRyb3ApO1xuICAgIH0pO1xuICAgIHBhdHJvbEJvYXROb3REcm9wcGFibGVTcG90cy5mb3JFYWNoKChzcG90KSA9PiB7XG4gICAgICBzcG90LmFkZEV2ZW50TGlzdGVuZXIoXCJkcmFnb3ZlclwiLCBub3REcm9wcGFibGVEcmFnT3Zlcik7XG4gICAgICBzcG90LmFkZEV2ZW50TGlzdGVuZXIoXCJkcmFnbGVhdmVcIiwgZHJhZ0xlYXZlKTtcbiAgICAgIHNwb3QuYWRkRXZlbnRMaXN0ZW5lcihcImRyb3BcIiwgbm90RHJvcHBhYmxlRHJvcCk7XG4gICAgfSk7XG4gIH07XG5cbiAgY2F0Y2hFdmVudENsZWFyaW5nTG9naWMgPSBmdW5jdGlvbiAoKSB7XG4gICAgZ2V0Tm9kZXMuYWRtaXJhbEdyb3VuZHNEaXZzLmZvckVhY2goKGRpdikgPT4ge1xuICAgICAgZGl2LmNsYXNzTGlzdCA9IFtdO1xuICAgIH0pO1xuICAgIC8vIFJlbW92ZSBhbGwgZXZlbnQgbGlzdGVuZXJzXG4gICAgZ2V0Tm9kZXMuYWRtaXJhbEdyb3VuZHNEaXZzLmZvckVhY2goKGRpdikgPT4ge1xuICAgICAgZGl2LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJkcmFnc3RhcnRcIiwgZHJhZ1N0YXJ0KTtcbiAgICAgIGRpdi5yZW1vdmVFdmVudExpc3RlbmVyKFwiZHJhZ292ZXJcIiwgZHJhZ092ZXIpO1xuICAgICAgZGl2LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJkcmFnbGVhdmVcIiwgZHJhZ0xlYXZlKTtcbiAgICAgIGRpdi5yZW1vdmVFdmVudExpc3RlbmVyKFwiZHJvcFwiLCBkcm9wKTtcblxuICAgICAgZGl2LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJkcmFnb3ZlclwiLCBub3REcm9wcGFibGVEcmFnT3Zlcik7XG4gICAgICBkaXYucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImRyYWdsZWF2ZVwiLCBkcmFnTGVhdmUpO1xuICAgICAgZGl2LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJkcm9wXCIsIG5vdERyb3BwYWJsZURyb3ApO1xuICAgIH0pO1xuICB9O1xufTtcblxuY29uc3QgY29uZmlndXJhdGlvbiA9IChmdW5jdGlvbiAoKSB7XG4gIGNvbnN0IGRpc3BsYXlEaWFsb2cgPSAoZnVuY3Rpb24gKCkge1xuICAgIGdldE5vZGVzLmNvbmZpZ0J1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgZ2V0Tm9kZXMuY292ZXIuc3R5bGUuekluZGV4ID0gXCIyXCI7XG4gICAgICBnZXROb2Rlcy5jb25maWdEaWFsb2cuc3R5bGUudmlzaWJpbGl0eSA9IFwidmlzaWJsZVwiO1xuICAgICAgZ2V0Tm9kZXMuY29uZmlnRGlhbG9nLnN0eWxlLm9wYWNpdHkgPSBcIjFcIjtcbiAgICB9KTtcbiAgfSkoKTtcblxuICBjb25zdCBleGl0RGlhbG9nID0gKGZ1bmN0aW9uICgpIHtcbiAgICBnZXROb2Rlcy5jbG9zZURpYWxvZy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgZ2V0Tm9kZXMuY292ZXIuc3R5bGUuekluZGV4ID0gXCIwXCI7XG4gICAgICBnZXROb2Rlcy5jb25maWdEaWFsb2cuc3R5bGUub3BhY2l0eSA9IFwiMFwiO1xuICAgICAgZ2V0Tm9kZXMuY29uZmlnRGlhbG9nLnN0eWxlLnRyYW5zaXRpb24gPSBcIm9wYWNpdHkgMC41cyBlYXNlLWluLW91dFwiO1xuICAgICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgZ2V0Tm9kZXMuY29uZmlnRGlhbG9nLnN0eWxlLnZpc2liaWxpdHkgPSBcImhpZGRlblwiO1xuICAgICAgICB9LCA0MDApO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pKCk7XG5cbiAgY29uc3QgcmVzdGFydEdhbWUgPSAoZnVuY3Rpb24gKCkge1xuICAgIGdldE5vZGVzLmtpY2tTdGFydEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBcIi4vaW5kZXguaHRtbFwiO1xuICAgIH0pO1xuICB9KSgpO1xuXG4gIGNvbnN0IHNodWZmbGVHYW1lID0gKGZ1bmN0aW9uICgpIHtcbiAgICBnZXROb2Rlcy5zaHVmZmxlQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7XG4gICAgfSk7XG4gIH0pKCk7XG5cbiAgY29uc3Qgc2V0RGlmZmljdWx0eSA9IChmdW5jdGlvbiAoKSB7XG4gICAgZ2V0Tm9kZXMuZGlmZmljdWx0eU9wdGlvbnMuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCAoZXZlbnQpID0+IHtcbiAgICAgIGlmIChldmVudC50YXJnZXQudmFsdWUgPT09IFwiaW1wb3NzaWJsZVwiKSB7XG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiZGlmZmljdWx0eVwiLCBcImltcG9zc2libGVcIik7XG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKTtcbiAgICAgIH1cbiAgICAgIGlmIChldmVudC50YXJnZXQudmFsdWUgPT09IFwibm9ybWFsXCIpIHtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJkaWZmaWN1bHR5XCIsIFwibm9ybWFsXCIpO1xuICAgICAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7XG4gICAgICB9XG4gICAgICBpZiAoZXZlbnQudGFyZ2V0LnZhbHVlID09PSBcImR1bW15XCIpIHtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJkaWZmaWN1bHR5XCIsIFwiZHVtbXlcIik7XG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSkoKTtcblxuICBjb25zdCB0cmlnZ2VyQWxpZ25tZW50ID0gKGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBjdXJyZW50RmVlZGJhY2sgPSBnZXROb2Rlcy5mZWVkYmFjay50ZXh0Q29udGVudDtcblxuICAgIGNvbnN0IGluYWN0aXZhdGVBbGlnbmVkQnV0dG9uID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgIGdldE5vZGVzLmFsaWduZWRCdXR0b24uc3R5bGUucG9pbnRlckV2ZW50cyA9IFwibm9uZVwiO1xuICAgICAgZ2V0Tm9kZXMuYWxpZ25lZEJ1dHRvbi5zdHlsZS5jb2xvciA9IFwicmdiYSgyNTUsIDI1NSwgMjU1LCAwLjYpXCI7XG4gICAgfSkoKTtcblxuICAgIGdldE5vZGVzLnJlYWxpZ25CdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgIGNvbnN0IGluYWN0aXZhdGVEaW1lbnNpb25TZWxlY3Rpb24gPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICBnZXROb2Rlcy5kaW1lbnNpb25PcHRpb25zLnN0eWxlLnBvaW50ZXJFdmVudHMgPSBcIm5vbmVcIjtcbiAgICAgICAgZ2V0Tm9kZXMuZGltZW5zaW9uT3B0aW9ucy5zdHlsZS5jb2xvciA9IFwicmdiYSgyNTUsIDI1NSwgMjU1LCAwLjYpXCI7XG4gICAgICB9KSgpO1xuXG4gICAgICBjb25zdCB1cGRhdGVGZWVkYmFjayA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGdldE5vZGVzLmZlZWRiYWNrLnRleHRDb250ZW50ID0gXCJPbmNlIGRvbmUsIGNsaWNrICdBbGlnbmVkJyB0byBwbGF5LlwiO1xuICAgICAgfSkoKTtcblxuICAgICAgY29uc3QgYWN0aXZhdGVBbGlnbmVkQnV0dG9uID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZ2V0Tm9kZXMuYWxpZ25lZEJ1dHRvbi5zdHlsZS5wb2ludGVyRXZlbnRzID0gXCJhdXRvXCI7XG4gICAgICAgIGdldE5vZGVzLmFsaWduZWRCdXR0b24uc3R5bGUuY29sb3IgPSBcInJnYigyNTUsIDI1NSwgMjU1KVwiO1xuICAgICAgfSkoKTtcbiAgICAgIGNvbnN0IGluYWN0aXZhdGVSZWFsaWduQnV0dG9uID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZ2V0Tm9kZXMucmVhbGlnbkJ1dHRvbi5zdHlsZS5wb2ludGVyRXZlbnRzID0gXCJub25lXCI7XG4gICAgICAgIGdldE5vZGVzLnJlYWxpZ25CdXR0b24uc3R5bGUuY29sb3IgPSBcInJnYmEoMjU1LCAyNTUsIDI1NSwgMC42KVwiO1xuICAgICAgfSkoKTtcblxuICAgICAgc2V0RHJhZ0FuZERyb3AoKTtcbiAgICAgIGNvbnN0IGluYWN0aXZhdGVBaUdyb3VuZHMgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICBnZXROb2Rlcy5haUdyb3VuZHMuc3R5bGUucG9pbnRlckV2ZW50cyA9IFwibm9uZVwiO1xuICAgICAgfSkoKTtcbiAgICAgIGNvbnN0IGV4aXREaWFsb2cgPSAoYXN5bmMgZnVuY3Rpb24gKCkge1xuICAgICAgICBnZXROb2Rlcy5jb3Zlci5zdHlsZS56SW5kZXggPSBcIjBcIjtcbiAgICAgICAgZ2V0Tm9kZXMuY29uZmlnRGlhbG9nLnN0eWxlLm9wYWNpdHkgPSBcIjBcIjtcbiAgICAgICAgZ2V0Tm9kZXMuY29uZmlnRGlhbG9nLnN0eWxlLnRyYW5zaXRpb24gPSBcIm9wYWNpdHkgMC41cyBlYXNlLWluLW91dFwiO1xuICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgZ2V0Tm9kZXMuY29uZmlnRGlhbG9nLnN0eWxlLnZpc2liaWxpdHkgPSBcImhpZGRlblwiO1xuICAgICAgICAgIH0sIDQwMCk7XG4gICAgICAgIH0pO1xuICAgICAgfSkoKTtcbiAgICB9KTtcblxuICAgIGdldE5vZGVzLmFsaWduZWRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgIGNvbnN0IGFjdGl2YXRlRGltZW5zaW9uU2VsZWN0aW9uID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKGlzU2hpcFBvc2l0aW9uQ2hhbmdlZCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBnZXROb2Rlcy5kaW1lbnNpb25PcHRpb25zLnN0eWxlLnBvaW50ZXJFdmVudHMgPSBcImF1dG9cIjtcbiAgICAgICAgZ2V0Tm9kZXMuZGltZW5zaW9uT3B0aW9ucy5zdHlsZS5jb2xvciA9IFwicmdiKDI1NSwgMjU1LCAyNTUpXCI7XG4gICAgICB9KSgpO1xuXG4gICAgICBjb25zdCByZXN0b3JlRmVlZGJhY2sgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICBnZXROb2Rlcy5mZWVkYmFjay50ZXh0Q29udGVudCA9IGN1cnJlbnRGZWVkYmFjaztcbiAgICAgIH0pKCk7XG5cbiAgICAgIGNvbnN0IGluYWN0aXZhdGVBbGlnbmVkQnV0dG9uID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZ2V0Tm9kZXMuYWxpZ25lZEJ1dHRvbi5zdHlsZS5wb2ludGVyRXZlbnRzID0gXCJub25lXCI7XG4gICAgICAgIGdldE5vZGVzLmFsaWduZWRCdXR0b24uc3R5bGUuY29sb3IgPSBcInJnYmEoMjU1LCAyNTUsIDI1NSwgMC42KVwiO1xuICAgICAgfSkoKTtcbiAgICAgIGNvbnN0IGFjdGl2YXRlUmVhbGlnbkJ1dHRvbiA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGdldE5vZGVzLnJlYWxpZ25CdXR0b24uc3R5bGUucG9pbnRlckV2ZW50cyA9IFwiYXV0b1wiO1xuICAgICAgICBnZXROb2Rlcy5yZWFsaWduQnV0dG9uLnN0eWxlLmNvbG9yID0gXCJyZ2IoMjU1LCAyNTUsIDI1NSlcIjtcbiAgICAgIH0pKCk7XG5cbiAgICAgIGNhdGNoRXZlbnRDbGVhcmluZ0xvZ2ljKCk7XG4gICAgICBjb25zdCBhY3RpdmF0ZUFpR3JvdW5kcyA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGdldE5vZGVzLmFpR3JvdW5kcy5zdHlsZS5wb2ludGVyRXZlbnRzID0gXCJhdXRvXCI7XG4gICAgICB9KSgpO1xuICAgICAgY29uc3QgZXhpdERpYWxvZyA9IChhc3luYyBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGdldE5vZGVzLmNvdmVyLnN0eWxlLnpJbmRleCA9IFwiMFwiO1xuICAgICAgICBnZXROb2Rlcy5jb25maWdEaWFsb2cuc3R5bGUub3BhY2l0eSA9IFwiMFwiO1xuICAgICAgICBnZXROb2Rlcy5jb25maWdEaWFsb2cuc3R5bGUudHJhbnNpdGlvbiA9IFwib3BhY2l0eSAwLjVzIGVhc2UtaW4tb3V0XCI7XG4gICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICBnZXROb2Rlcy5jb25maWdEaWFsb2cuc3R5bGUudmlzaWJpbGl0eSA9IFwiaGlkZGVuXCI7XG4gICAgICAgICAgfSwgNDAwKTtcbiAgICAgICAgfSk7XG4gICAgICB9KSgpO1xuICAgIH0pO1xuICB9KSgpO1xuXG4gIGNvbnN0IHRyaWdnZXJIb3ZlcmluZ0VmZmVjdE92ZXJTdmcgPSAoZnVuY3Rpb24gKCkge1xuICAgIGdldE5vZGVzLmNvbmZpZ0J1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwibW91c2VvdmVyXCIsICgpID0+IHtcbiAgICAgIGdldE5vZGVzLmNvbmZpZ0J1dHRvbkljb24uc3R5bGUuZmlsbCA9IFwiYmxhY2tcIjtcbiAgICB9KTtcbiAgICBnZXROb2Rlcy5jb25maWdCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlb3V0XCIsICgpID0+IHtcbiAgICAgIGdldE5vZGVzLmNvbmZpZ0J1dHRvbkljb24uc3R5bGUuZmlsbCA9IFwid2hpdGVcIjtcbiAgICB9KTtcbiAgfSkoKTtcbn0pKCk7XG4iXSwibmFtZXMiOlsiU2hpcCIsImNvbnN0cnVjdG9yIiwibGVuZ3RoIiwibnVtSGl0cyIsInN1bmsiLCJjdXJyZW50TGVuZ3RoIiwiY3VycmVudE51bUhpdHMiLCJzdW5rU3RhdHVzIiwiaGl0IiwiaXNTdW5rIiwiR2FtZWJvYXJkIiwiYm9hcmQiLCJkaXNwbGFjZVNoaXBzUmVjdXJzaW9uQ291bnQiLCJzaGlwcyIsIkNhcnJpZXIiLCJCYXR0bGVzaGlwIiwiRGVzdHJveWVyIiwiU3VibWFyaW5lIiwiY3JlYXRlQm9hcmQiLCJuIiwic3ViQm9hcmQiLCJtIiwicHVzaCIsImdldExlZ2FsTW92ZXMiLCJnZW5lcmF0ZU1vdmVzIiwiZmlyc3RNb3ZlIiwic2hpcE1vdmVzIiwibWFwIiwiaW5kZXgiLCJjYXJyaWVyTW92ZXMiLCJiYXR0bGVzaGlwTW92ZXMiLCJkZXN0cm95ZXJNb3ZlcyIsInN1Ym1hcmluZU1vdmVzIiwicGF0cm9sTW92ZXMiLCJsZWdhbE1vdmVzIiwiZGlzcGxhY2VTaGlwcyIsImlzUmVEaXNwbGFjZWQiLCJnZW5lcmF0ZVJhbmRvbVJvd0luZGV4Iiwicm93SW5kZXgiLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCJnZXRSYW5kb21Nb3ZlSW5kZXgiLCJtb3ZlcyIsIm1vdmVJbmRleCIsInVwZGF0ZUxlZ2FsTW92ZXNJbkJvYXJkIiwic2hpcExlbmd0aCIsInBvcHVsYXRlZFJvdyIsImxhc3RPY2N1cGllZCIsImxhc3RJbmRleE9mIiwiZmlyc3RPY2N1cGllZCIsIm9jY3VweSIsImZpcnN0SW5kZXhFbXB0eSIsImxhc3RJbmRleEVtcHR5IiwiZmlyc3RUb3BCb3R0b20iLCJsYXN0VG9wQm90dG9tIiwiaW5kZXhPZiIsImJvdHRvbUFkamFjZW50Um93IiwiZmlsbCIsInRvcEFkamFjZW50Um93IiwiaW5jbHVkZXMiLCJyZXN0YXJ0U2hpcERpc3BsYWNlbWVudElmQm9hcmRIYXNBZGphY2VudE9jY3VwaWVkUm93cyIsImZvckVhY2giLCJyb3ciLCJyb3dJc0VtcHR5IiwiZXZlcnkiLCJlbnRyeSIsInJvd0lzT2NjdXBpZWQiLCJuZXh0Um93SXNFbXB0eSIsIm5leHRSb3dJc09jY3VwaWVkIiwicG9wdWxhdGVCb2FyZCIsImlzQm9hcmRGdWxsIiwiX3dpdGhTcGVjaWZpZWRTaGlwIiwic2hpcCIsInJhbmRvbVJvd0luZGV4IiwicmFuZG9tU2hpcE1vdmUiLCJmaXJzdFNoaXBNb3ZlIiwic2hpcE1vdmVMYXN0SW5kZXgiLCJsYXN0U2hpcE1vdmUiLCJyZWNlaXZlQXR0YWNrIiwiWFkiLCJoaXRTdGF0dXMiLCJnZW5lcmF0ZUtleXMiLCJhbHBoYWJldHMiLCJTdHJpbmciLCJmcm9tQ2hhckNvZGUiLCJrZXlzIiwic3ViS2V5cyIsImxldHRlciIsImFzc2lnbktleXNUb0JvYXJkSW5kaWNlcyIsIktleXNCb3giLCJvY2N1cHlDaG9zZW5TcG90Iiwia2V5SW5kZXgiLCJoaXRFbnRyeSIsInVwZGF0ZVNoaXBMaWZlIiwidXBkYXRlVW50aWxGdWxsIiwidHJhY2tNaXNzZWRBdHRhY2tzIiwiY29vcmRpbmF0ZSIsIm1pc3NlZEF0dGFja3MiLCJ1cGRhdGVTdW5rU3RhdHVzIiwiYWxsU2hpcHNTdW5rIiwiUGxheWVyIiwidXNlciIsImNvbXB1dGVyIiwiY29tcHV0ZXJSYW5kb21QaWNrQ291bnQiLCJrZXlzVXBkYXRlIiwidXNlclR1cm4iLCJjb21wdXRlclR1cm4iLCJnZW5lcmF0ZVJhbmRvbUtleSIsImdldEtleXMiLCJhc3NpZ25HZW5lcmF0ZWRLZXlzT25jZSIsInJhbmRvbUtleSIsInVwZGF0ZUtleXMiLCJyYW5kb21LZXlJbmRleCIsInNwbGljZSIsInBpY2tMZWdhbE1vdmUiLCJyZXNwb25zZSIsImltcG9ydEFsbEFzc2V0cyIsImltcG9ydEFsbCIsInIiLCJhc3NldHMiLCJyZXF1aXJlIiwiY29udGV4dCIsImdldE5vZGVzIiwiYWRtaXJhbEhlYWREaXZzIiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yQWxsIiwiYWRtaXJhbFRhaWxEaXZzIiwiYWlIZWFkRGl2cyIsImFpVGFpbERpdnMiLCJhZG1pcmFsR3JvdW5kc0RpdnMiLCJhaUdyb3VuZHNEaXZzIiwiaGVhZGVycyIsImFkbWlyYWxHcm91bmRzIiwicXVlcnlTZWxlY3RvciIsImFpR3JvdW5kcyIsImFkbWlyYWxOYW1lIiwiZmVlZGJhY2siLCJjb25maWdCdXR0b24iLCJjb25maWdEaWFsb2ciLCJjb25maWdCdXR0b25JY29uIiwiY292ZXIiLCJjbG9zZURpYWxvZyIsImtpY2tTdGFydEJ1dHRvbiIsInNodWZmbGVCdXR0b24iLCJwZWVrQnV0dG9uIiwicmVhbGlnbkJ1dHRvbiIsImFsaWduZWRCdXR0b24iLCJkaWZmaWN1bHR5T3B0aW9ucyIsImRpbWVuc2lvbk9wdGlvbnMiLCJkaXNwbGF5SGVhZEFuZFRhaWxIb3ZlcmluZ0VmZmVjdCIsImFkZEhvdmVyVG9IZWFkIiwiaGVhZERpdnMiLCJncm91bmREaXZzIiwiZGl2IiwiYWRkRXZlbnRMaXN0ZW5lciIsInN0eWxlIiwiYm9yZGVyIiwiYWRkSG92ZXJUb1RhaWwiLCJ0YWlsRGl2cyIsImFkZEhvdmVyVG9IZWFkZXJzIiwiaGVhZGVyIiwiZ3JvdW5kcyIsImNsYXNzTGlzdCIsImFkZCIsInJlbW92ZSIsInJldHJpZXZlQWRtaXJhbE5hbWVGcm9tU3RvcmFnZUFuZFNldCIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJ0ZXh0Q29udGVudCIsInBvcHVsYXRlQm9hcmRzIiwiZ2FtZSIsInVzZXJCb2FyZCIsImZsYXQiLCJjb21wdXRlckJvYXJkIiwiZ2V0UmFuZG9tQ29sb3IiLCJyZWQiLCJncmVlbiIsImJsdWUiLCJjb2xvciIsInJhbmRvbUNvbG9ycyIsInNldFJhbmRvbUNvbG9ycyIsImVsZW1lbnQiLCJiYWNrZ3JvdW5kQ29sb3IiLCJzZXRDbGFzc2VzIiwic2V0Q2xhc3MiLCJzZXRBdHRyaWJ1dGUiLCJkaXZJbmRleCIsImVudHJ5SW5kZXgiLCJwb3B1bGF0ZVdpdGhTcGF0aWFsU2hpcHMiLCJzZXRTcGF0aWFsRGltZW5zaW9uIiwiYXBwZW5kU2hpcEltZyIsInNoaXBTcmMiLCJzaGlwVHlwZSIsImRhdGFzZXQiLCJzaGlwSW1nIiwiY3JlYXRlRWxlbWVudCIsInVwZGF0ZUltZ1NpemUiLCJ3aWR0aCIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsImhlaWdodCIsIndpbmRvdyIsInJlbW92ZVNjYWxpbmciLCJ0cmFuc2Zvcm0iLCJhcHBlbmRDaGlsZCIsInNldFNwYXRpYWxEaW1lbnNpb25Gb3JBaUFuZEhpZGUiLCJkaXNwbGF5IiwicGVla0FpQm9hcmQiLCJ2YWx1ZSIsImV4aXREaWFsb2ciLCJ6SW5kZXgiLCJvcGFjaXR5IiwidHJhbnNpdGlvbiIsIlByb21pc2UiLCJyZXNvbHZlIiwic2V0VGltZW91dCIsInZpc2liaWxpdHkiLCJoaWRlQWlCb2FyZCIsInBvcHVsYXRlV2l0aENvbG9yIiwicG9wdWxhdGVVc2VyQm9hcmQiLCJwb3B1bGF0ZUFpQm9hcmQiLCJwb3B1bGF0ZVdpdGhEaW1lbnNpb25DaGFuZ2UiLCJldmVudCIsInRhcmdldCIsImluYWN0aXZhdGVBbGlnbmVkQnV0dG9uIiwicG9pbnRlckV2ZW50cyIsImluYWN0aXZhdGVSZWFsaWduQnV0dG9uIiwiY2xlYXJTcGF0aWFsU2hpcHMiLCJhY3RpdmF0ZVJlYWxpZ25CdXR0b24iLCJjbGVhckNvbG9ycyIsImJyaW5nQmFja1NwYXRpYWxTaGlwcyIsInBvcHVsYXRlQWlCb2FyZFdoZW5HYW1lT3ZlciIsImRpc3BsYXlUYXJnZXQiLCJfX2ZvckVhY2hHcm91bmRzIiwidGFyZ2V0U3BhbiIsInNldERlZmF1bHRBdHRyaWJ1dGVzSW5Db29yZGluYXRlcyIsInNldENvb3JkaW5hdGVzVG9VbkF0dGFja2VkIiwiYWRkSW5kZXhUb0Nvb3JkaW5hdGVzIiwiYWxwSW5kZXgiLCJhbHBzIiwibG9vcEdhbWUiLCJnYW1lT3ZlciIsImdldERpZmZpY3VsdHkiLCJkaWZmaWN1bHR5Iiwib3B0aW9ucyIsInJlbW92ZUF0dHJpYnV0ZSIsImRpc3BsYXlBdHRhY2siLCJzcG90IiwiaW5wdXRWYWx1ZSIsImZvbnRDb2xvciIsInNwYW4iLCJzZXRGZWVkYmFjayIsImFpT3JVc2VyIiwibWlzc2VkT3JIaXQiLCJzaGlwRGF0YXNldCIsImdldEZlZWRiYWNrTWVzc2FnZSIsImFpT3JVc2VyMiIsImZlZWRiYWNrTWVzc2FnZSIsInZpY3RpbSIsImlubmVySFRNTCIsInRyaWdnZXJVc2VyVHVybiIsImF0dGFja2VkIiwiaGFzQXR0cmlidXRlIiwidHJpZ2dlckFpVHVybiIsImFpVGltZXIiLCJyZWN1cnNpb25Db3VudCIsInJlc2V0RHVtbXlUaW1lclBhcmFtZXRlcnMiLCJyZXNldEltcG9zc2libGVUaW1lclBhcmFtZXRlcnMiLCJjYXRjaEV2ZW50Q2xlYXJpbmdMb2dpYyIsImlzU2hpcFBvc2l0aW9uQ2hhbmdlZCIsInNldERyYWdBbmREcm9wIiwic2V0QXR0cmlidXRlcyIsImRlZmF1bHRVc2VyQm9hcmQiLCJnZXRNb3ZlcyIsInNoaXBJbmRleCIsInNoaXBMZWdhbE1vdmVzIiwic2hpcElsbGVnYWxNb3ZlcyIsImRlZmluZU1vdmVzRm9yRWFjaFNoaXBSb3ciLCJzaGlwUm93IiwidmFsdWVzIiwiY2hlY2tMZWdhbGl0eSIsImlzQWxsTnVsbCIsInNldFNoaXBBdHRyaWJ1dGVzIiwibW92ZXNJbmRleCIsInBhcnNlSW50IiwibW92ZSIsImRyYWdnYWJsZVNoaXBzIiwiY2FycmllckRyb3BwYWJsZVNwb3RzIiwiY2Fycmllck5vdERyb3BwYWJsZVNwb3RzIiwiYmF0dGxlc2hpcERyb3BwYWJsZVNwb3RzIiwiYmF0dGxlc2hpcE5vdERyb3BwYWJsZVNwb3RzIiwiZGVzQW5kU3ViRHJvcHBhYmxlU3BvdHMiLCJkZXNBbmRTdWJOb3REcm9wcGFibGVTcG90cyIsInBhdHJvbEJvYXREcm9wcGFibGVTcG90cyIsInBhdHJvbEJvYXROb3REcm9wcGFibGVTcG90cyIsImNhdGNoRXZlbnREYXRhc2V0IiwiZHJhZ1N0YXJ0IiwiZGF0YVRyYW5zZmVyIiwic2V0RGF0YSIsImRyYWdnZWRTaGlwIiwieE9mZnNldCIsInNldERyYWdJbWFnZSIsInRyaWdnZXJSaWdodERyYWdEcm9wU2hpcCIsInRyaWdnZXJDYXJyaWVyRHJhZ0Ryb3AiLCJ0cmlnZ2VyQmF0dGxlc2hpcERyYWdEcm9wIiwidHJpZ2dlckRlc0FuZFN1YkRyYWdEcm9wIiwidHJpZ2dlclBhdHJvbEJvYXREcmFnRHJvcCIsImRyYWdPdmVyIiwicHJldmVudERlZmF1bHQiLCJzZXRIb3ZlcmluZ0NvbG9yIiwiY3VycmVudFRhcmdldCIsIm5leHRFbGVtZW50U2libGluZyIsImRyYWdMZWF2ZSIsInJlbW92ZUhvdmVyaW5nQ29sb3IiLCJkcm9wIiwiZ2V0RGF0YSIsImRyb3BUYXJnZXQiLCJhcHBlbmRTaGlwVG9UYXJnZXQiLCJ0cmFuc2ZlckF0dHJpYnV0ZXNGcm9tRHJhZ2dlZFNoaXBzVG9UYXJnZXRzIiwicmVtb3ZlQXR0cmlidXRlcyIsImRyYWdnZWRTaGlwcyIsImFkZFRvVGFyZ2V0cyIsImluZGljYXRlUG9zaXRpb25DaGFuZ2UiLCJ1cGRhdGVCb2FyZCIsImNsZWFyU2hpcHNCb3VkYXJpZXMiLCJ2YWx1ZUluZGV4IiwidHJhbnNmZXJEcm9wcGVkU2hpcCIsIm5ld1Nwb3RzSW5kaWNlcyIsImdldERyb3BwZWRTaGlwU3BvdHNJbmRpY2VzIiwiY2xlYXJTaGlwRnJvbU9sZFNwb3RzIiwicGFyc2VGbG9hdCIsImFkZFNoaXBUb05ld1Nwb3RzIiwiYm9hcmRJbmRpY2VzIiwiYWRkTmV3Qm91bmRhcmllcyIsInNldEJvdW5kYXJpZXMiLCJlbnRyaWVzIiwicmVtb3ZlT2xkQXR0cmlidXRlc0FuZEV2ZW50TGlzdGVuZXJzIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsIm5vdERyb3BwYWJsZURyYWdPdmVyIiwibm90RHJvcHBhYmxlRHJvcCIsImNvbmZpZ3VyYXRpb24iLCJkaXNwbGF5RGlhbG9nIiwicmVzdGFydEdhbWUiLCJsb2NhdGlvbiIsImhyZWYiLCJzaHVmZmxlR2FtZSIsInJlbG9hZCIsInNldERpZmZpY3VsdHkiLCJzZXRJdGVtIiwidHJpZ2dlckFsaWdubWVudCIsImN1cnJlbnRGZWVkYmFjayIsImluYWN0aXZhdGVEaW1lbnNpb25TZWxlY3Rpb24iLCJ1cGRhdGVGZWVkYmFjayIsImFjdGl2YXRlQWxpZ25lZEJ1dHRvbiIsImluYWN0aXZhdGVBaUdyb3VuZHMiLCJhY3RpdmF0ZURpbWVuc2lvblNlbGVjdGlvbiIsInJlc3RvcmVGZWVkYmFjayIsImFjdGl2YXRlQWlHcm91bmRzIiwidHJpZ2dlckhvdmVyaW5nRWZmZWN0T3ZlclN2ZyJdLCJzb3VyY2VSb290IjoiIn0=