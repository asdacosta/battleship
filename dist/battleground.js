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
    padding: 0.1rem;
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
`, "",{"version":3,"sources":["webpack://./src/battleground.css"],"names":[],"mappings":"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","sourcesContent":["/* body * {\n  border: 2px solid burlywood;\n} */\n\nbody {\n  display: grid;\n  grid-template: 4fr 1fr / 1fr 1fr;\n  gap: 8rem;\n  padding: 4rem 8rem;\n  margin: 0;\n  position: relative;\n\n  font-family: \"Raleway\", sans-serif;\n  font-size: 1.3rem;\n  letter-spacing: 0.1rem;\n  height: 100vh;\n  background-image: url(./assets/ship-edit.jpg);\n  background-size: cover;\n  background-position: center center;\n}\n\nbody > section {\n  display: grid;\n  grid-template: 1fr 1fr 10fr/ 2fr 8fr;\n  gap: 0.3rem;\n  padding: 0.5rem 7rem 0.5rem 1rem;\n  z-index: 1;\n}\n\n.config-dialog {\n  display: flex;\n  flex-direction: column;\n  width: 20rem;\n  padding: 1rem;\n  gap: 1rem;\n  background: rgba(34, 100, 175, 0.8);\n  border: 0.2rem solid rgb(17, 50, 87);\n  border-radius: 2rem;\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  visibility: hidden;\n  opacity: 0;\n  transition: opacity 0.3s ease-in-out;\n  z-index: 2;\n}\n\n.config-dialog > div {\n  display: flex;\n  justify-content: space-between;\n}\n\n.config-dialog span {\n  align-self: center;\n  font-weight: 800;\n  color: white;\n  background: rgba(248, 71, 47, 0.8);\n  margin-left: 0.5rem;\n  padding: 0.2rem 0.3rem 0.1rem 0.3rem;\n  border-radius: 10rem;\n  cursor: pointer;\n}\n\n.config-dialog span:hover {\n  background: rgb(248, 71, 47);\n}\n\n.config-dialog button,\n.config-dialog select {\n  align-self: center;\n  font-size: 1.05rem;\n  text-align: center;\n  color: white;\n  width: 7rem;\n  border-radius: 0.5rem;\n  cursor: pointer;\n  background: rgb(17, 50, 87);\n}\n\n.config-dialog button:hover,\n.config-dialog select:hover {\n  border: 0.1rem solid white;\n}\n\n.config-dialog fieldset {\n  display: flex;\n  justify-content: center;\n  gap: 0.2rem;\n  padding: 0.2rem;\n  border-radius: 0.5rem;\n  border-left: 0.2rem solid rgb(17, 50, 87);\n  border-right: 0.2rem solid rgb(17, 50, 87);\n  background: rgba(17, 50, 87, 0.4);\n}\n\nfieldset > button {\n  height: 1.5rem;\n}\n\nlegend {\n  font-size: 1.2rem;\n  color: white;\n  font-weight: 800;\n  padding-left: 0.2rem;\n  cursor: context-menu;\n}\n\n.config-box {\n  width: fit-content;\n}\n\n.config-box > button {\n  font-size: 1.1rem;\n  letter-spacing: 0.05rem;\n  border-radius: 0.5rem;\n  height: 2rem;\n  background: linear-gradient(to right, rgba(5, 6, 8, 0.8), rgba(39, 114, 199, 0.8));\n  opacity: 0.8;\n  cursor: pointer;\n  transition:\n    background 0.5s ease-out,\n    color 0.5s ease-out,\n    transform 0.3s ease-in-out;\n}\n\n.config-box > button:hover {\n  background: rgb(34, 100, 175);\n  border: 0.1rem solid white;\n  transform: scale(1.05);\n}\n\n.config-box svg {\n  width: 1.8rem;\n}\n\n.config-box > button:active {\n  background: rgb(17, 50, 87);\n}\n\nh2 {\n  grid-row: span 1;\n  grid-column: 2 / -1;\n  text-align: center;\n  font-size: 2rem;\n  font-weight: 600;\n  padding: 0.25rem 1rem 0 1rem;\n  justify-self: center;\n  background: rgba(255, 255, 255, 0.4);\n  border-top: 0.3rem solid rgb(0, 0, 0);\n  border-bottom: 0.3rem solid rgb(0, 0, 0);\n  cursor: context-menu;\n  transition: transform 0.3s ease-in-out;\n}\n\nh2:hover {\n  background: rgba(255, 255, 255, 0.6);\n  transform: scale(1.1);\n}\n\n.head,\n.tail {\n  display: flex;\n  background: rgba(255, 255, 255, 0.4);\n  border-radius: 1rem;\n  cursor: context-menu;\n}\n\n.head {\n  align-self: flex-end;\n  grid-row: 2 / 3;\n  grid-column: 2 / 3;\n}\n\n.tail {\n  flex-direction: column;\n  justify-self: flex-end;\n  grid-row: 3 / -1;\n}\n\n.head > div,\n.tail > div {\n  flex: 1 1 auto;\n  padding-top: 0.5rem;\n  text-align: center;\n  font-weight: 600;\n  min-width: 2rem;\n  min-height: 2rem;\n  transition: transform 0.1s ease-in;\n}\n\n.head > div:hover,\n.tail > div:hover {\n  font-weight: 800;\n  transform: scale(1.2);\n}\n\n.admiral-grounds,\n.ai-grounds {\n  grid-row: 3 / -1;\n  grid-column: 2 / -1;\n  display: grid;\n  grid-template: repeat(10, 1fr) / repeat(10, 1fr);\n  border: 2px solid rgb(255, 255, 255);\n  border-radius: 1rem;\n  transition: transform 0.25s ease-in-out;\n}\n\n.scaleDivs {\n  transform: scale(1.02);\n}\n\n.admiral-grounds:hover,\n.ai-grounds:hover {\n  transform: scale(1.02);\n}\n\n.admiral-grounds > div,\n.ai-grounds > div {\n  grid-column: span 1;\n  grid-row: span 1;\n  min-width: 2rem;\n  min-height: 2rem;\n\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  position: relative;\n  font-weight: 800;\n  border: 2px solid rgb(255, 255, 255);\n  cursor: pointer;\n  transition: transform 0.2s ease-in-out;\n}\n\n.admiral-grounds span,\n.ai-grounds span {\n  font-size: 1.7rem;\n}\n\n.admiral-grounds > div:hover,\n.ai-grounds > div:hover {\n  transform: scale(1.1);\n}\n\n.admiral-grounds > div:first-child,\n.ai-grounds > div:first-child {\n  border-top-left-radius: 1rem;\n}\n\n.admiral-grounds > div:nth-child(10),\n.ai-grounds > div:nth-child(10) {\n  border-top-right-radius: 1rem;\n}\n\n.admiral-grounds > div:nth-last-child(10),\n.ai-grounds > div:nth-last-child(10) {\n  border-bottom-left-radius: 1rem;\n}\n\n.admiral-grounds > div:nth-last-child(1),\n.ai-grounds > div:nth-last-child(1) {\n  border-bottom-right-radius: 1rem;\n}\n\nbody > div:last-child {\n  grid-column: 1 / -1;\n  align-self: flex-start;\n  justify-self: center;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  text-align: center;\n\n  font-weight: 600;\n  border: 0.2rem solid rgba(255, 255, 255, 0.8);\n  border-radius: 1rem;\n  background: rgba(0, 0, 0, 0.5);\n  color: white;\n  height: 3rem;\n  width: 40rem;\n  cursor: context-menu;\n  z-index: 1;\n  transition: transform 0.3s ease-in-out;\n}\n\nbody > div:last-child:hover {\n  transform: scale(1.05);\n  border: 0.2rem solid rgb(255, 255, 255);\n  background: rgba(0, 0, 0, 0.7);\n}\n\nbody > div:first-child {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  background: rgba(0, 0, 0, 0.6);\n}\n\n.admiral-grounds img,\n.ai-grounds img {\n  position: absolute;\n  left: 1%;\n  bottom: 0.5%;\n  pointer-events: none;\n}\n\n.config-dialog img {\n  align-self: flex-end;\n  background: rgba(17, 50, 87, 0.8);\n  width: 2rem;\n  height: 2rem;\n  padding: 0.2rem;\n  border-radius: 0.5rem;\n  cursor: pointer;\n}\n\n.config-dialog img:hover {\n  border: 0.1rem solid white;\n  background: linear-gradient(to bottom right, rgb(17, 50, 87), rgba(255, 255, 0, 0.4));\n}\n\nsvg {\n  fill: white;\n  width: 1.7rem;\n}\n\n@media (max-width: 1570px) {\n  body {\n    gap: 6rem;\n    padding: 6rem 6rem;\n  }\n\n  body > div:last-child {\n    width: 35rem;\n  }\n  .admiral-grounds,\n  .ai-grounds {\n    align-self: flex-start;\n  }\n  .tail,\n  .head {\n    font-size: 1.1rem;\n  }\n  .tail {\n    align-self: flex-start;\n  }\n  .head > div,\n  .tail > div {\n    padding-top: 0.2rem;\n  }\n}\n\n@media (max-width: 1270px) {\n  body {\n    gap: 3rem;\n    padding: 8rem 4rem;\n  }\n\n  body > div:last-child {\n    width: 30rem;\n    align-self: center;\n  }\n\n  body > section {\n    padding: 0.5rem 5rem 0.5rem 0.5rem;\n  }\n\n  .admiral-grounds span,\n  .ai-grounds span {\n    font-size: 1.2rem;\n  }\n}\n\n@media (max-width: 1110px) {\n  body {\n    gap: 1rem;\n    padding: 8rem 1rem;\n    height: 100%;\n  }\n\n  body > section {\n    padding: 0.5rem 3rem 0.5rem 0.5rem;\n  }\n\n  h2 {\n    font-size: 1.5rem;\n  }\n\n  body > div:last-child {\n    width: 28rem;\n    font-size: 1rem;\n  }\n}\n\n@media (max-width: 900px) {\n  body {\n    gap: 0.3rem;\n    padding: 8rem 0.2rem;\n    background-image: url(./assets/verticalship.jpg);\n  }\n\n  body > section {\n    padding: 0.5rem;\n  }\n\n  body > div:last-child {\n    width: 25rem;\n    align-self: flex-start;\n  }\n\n  .config-dialog {\n    background: rgba(46, 46, 46, 0.8);\n    border: 0.2rem solid rgb(143, 109, 61);\n  }\n\n  .config-dialog button,\n  .config-dialog select {\n    background: rgb(143, 109, 61);\n  }\n\n  .config-dialog fieldset {\n    background: rgba(95, 73, 43, 0.4);\n    border-left: 0.2rem solid rgb(143, 109, 61);\n    border-right: 0.2rem solid rgb(143, 109, 61);\n  }\n\n  .config-box > button {\n    padding: 0.1rem;\n    background: linear-gradient(to right, rgba(5, 6, 8, 0.8), rgba(221, 166, 88, 0.8));\n  }\n\n  .config-box > button:hover {\n    background: rgb(185, 139, 74);\n  }\n\n  .config-dialog img {\n    background: rgba(95, 73, 43, 0.6);\n  }\n\n  .config-dialog img:hover {\n    background: linear-gradient(to bottom right, rgb(48, 37, 22), rgba(255, 255, 0, 0.5));\n  }\n}\n\n@media (max-width: 765px) {\n  body {\n    grid-template: repeat(2, 4fr) 1fr / 1fr;\n    padding: 0;\n  }\n\n  body > section {\n    grid-template: 1fr 1fr 10fr/ 1fr 8fr;\n    padding-right: 1.5rem;\n    height: 27rem;\n  }\n}\n\n@media (max-width: 420px) {\n  .config-dialog {\n    left: 53%;\n  }\n}\n\n@media (max-width: 390px) {\n  .config-dialog {\n    left: 57%;\n  }\n}\n\n@media (max-width: 290px) {\n  .config-dialog {\n    left: 78%;\n  }\n}\n"],"sourceRoot":""}]);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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OztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIsbUNBQW1DO0FBQy9EOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPLHdGQUF3RixNQUFNLEtBQUssVUFBVSxZQUFZLFdBQVcsWUFBWSxXQUFXLGFBQWEsYUFBYSxhQUFhLGFBQWEsV0FBVyxZQUFZLGFBQWEsYUFBYSxPQUFPLEtBQUssVUFBVSxZQUFZLFdBQVcsWUFBWSxXQUFXLE1BQU0sS0FBSyxVQUFVLFlBQVksV0FBVyxVQUFVLFVBQVUsWUFBWSxhQUFhLGFBQWEsYUFBYSxXQUFXLFVBQVUsWUFBWSxhQUFhLFdBQVcsWUFBWSxXQUFXLE1BQU0sS0FBSyxVQUFVLFlBQVksT0FBTyxLQUFLLFlBQVksYUFBYSxXQUFXLFlBQVksYUFBYSxhQUFhLGFBQWEsV0FBVyxPQUFPLEtBQUssWUFBWSxPQUFPLE1BQU0sWUFBWSxhQUFhLGFBQWEsV0FBVyxVQUFVLFlBQVksV0FBVyxZQUFZLE9BQU8sTUFBTSxZQUFZLE9BQU8sS0FBSyxVQUFVLFlBQVksV0FBVyxVQUFVLFlBQVksYUFBYSxhQUFhLGFBQWEsT0FBTyxLQUFLLFVBQVUsT0FBTyxLQUFLLFlBQVksV0FBVyxZQUFZLGFBQWEsYUFBYSxPQUFPLEtBQUssWUFBWSxPQUFPLEtBQUssWUFBWSxhQUFhLGFBQWEsV0FBVyxZQUFZLFdBQVcsVUFBVSxPQUFPLE9BQU8sT0FBTyxLQUFLLFlBQVksYUFBYSxhQUFhLE9BQU8sS0FBSyxVQUFVLE1BQU0sS0FBSyxZQUFZLE9BQU8sS0FBSyxZQUFZLGFBQWEsYUFBYSxXQUFXLFlBQVksYUFBYSxhQUFhLGFBQWEsYUFBYSxhQUFhLGFBQWEsYUFBYSxPQUFPLEtBQUssWUFBWSxhQUFhLE9BQU8sTUFBTSxVQUFVLFlBQVksYUFBYSxhQUFhLE9BQU8sS0FBSyxZQUFZLFdBQVcsWUFBWSxPQUFPLEtBQUssWUFBWSxhQUFhLGFBQWEsT0FBTyxNQUFNLFVBQVUsWUFBWSxhQUFhLGFBQWEsV0FBVyxZQUFZLGFBQWEsT0FBTyxNQUFNLFlBQVksYUFBYSxPQUFPLE1BQU0sWUFBWSxhQUFhLFdBQVcsWUFBWSxhQUFhLGFBQWEsYUFBYSxPQUFPLEtBQUssWUFBWSxPQUFPLE1BQU0sWUFBWSxPQUFPLE1BQU0sWUFBWSxhQUFhLFdBQVcsYUFBYSxXQUFXLFlBQVksYUFBYSxhQUFhLGFBQWEsYUFBYSxXQUFXLFlBQVksT0FBTyxNQUFNLFlBQVksT0FBTyxNQUFNLFlBQVksT0FBTyxNQUFNLFlBQVksT0FBTyxNQUFNLFlBQVksT0FBTyxNQUFNLFlBQVksT0FBTyxNQUFNLFlBQVksT0FBTyxLQUFLLFlBQVksYUFBYSxhQUFhLFdBQVcsWUFBWSxhQUFhLGNBQWMsYUFBYSxhQUFhLGFBQWEsYUFBYSxXQUFXLFVBQVUsVUFBVSxZQUFZLFdBQVcsWUFBWSxPQUFPLEtBQUssWUFBWSxhQUFhLGFBQWEsT0FBTyxLQUFLLFVBQVUsVUFBVSxVQUFVLFVBQVUsVUFBVSxZQUFZLE9BQU8sTUFBTSxZQUFZLFdBQVcsVUFBVSxZQUFZLE9BQU8sS0FBSyxZQUFZLGFBQWEsV0FBVyxVQUFVLFVBQVUsWUFBWSxXQUFXLE9BQU8sS0FBSyxZQUFZLGFBQWEsT0FBTyxLQUFLLFVBQVUsVUFBVSxNQUFNLEtBQUssS0FBSyxVQUFVLFlBQVksT0FBTyxLQUFLLFVBQVUsS0FBSyxNQUFNLFlBQVksTUFBTSxNQUFNLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxNQUFNLFlBQVksTUFBTSxNQUFNLEtBQUssS0FBSyxVQUFVLFlBQVksT0FBTyxLQUFLLFVBQVUsWUFBWSxPQUFPLEtBQUssWUFBWSxPQUFPLE1BQU0sWUFBWSxNQUFNLE1BQU0sS0FBSyxLQUFLLFVBQVUsWUFBWSxXQUFXLE1BQU0sS0FBSyxZQUFZLE9BQU8sS0FBSyxZQUFZLE9BQU8sS0FBSyxVQUFVLFVBQVUsTUFBTSxNQUFNLEtBQUssS0FBSyxVQUFVLFlBQVksYUFBYSxPQUFPLEtBQUssVUFBVSxPQUFPLEtBQUssVUFBVSxZQUFZLE9BQU8sS0FBSyxZQUFZLGFBQWEsT0FBTyxNQUFNLFlBQVksT0FBTyxLQUFLLFlBQVksYUFBYSxhQUFhLE9BQU8sS0FBSyxVQUFVLFlBQVksT0FBTyxLQUFLLFlBQVksT0FBTyxLQUFLLFlBQVksT0FBTyxLQUFLLFlBQVksTUFBTSxNQUFNLEtBQUssS0FBSyxZQUFZLFdBQVcsTUFBTSxLQUFLLFlBQVksYUFBYSxXQUFXLEtBQUssTUFB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R0FBSSxZQUFZO0lBQ2hEM08sUUFBUSxDQUFDZSxZQUFZLENBQUNpQixnQkFBZ0IsQ0FBQyxXQUFXLEVBQUUsTUFBTTtNQUN4RGhDLFFBQVEsQ0FBQ2lCLGdCQUFnQixDQUFDZ0IsS0FBSyxDQUFDbEcsSUFBSSxHQUFHLE9BQU87SUFDaEQsQ0FBQyxDQUFDO0lBQ0ZpRSxRQUFRLENBQUNlLFlBQVksQ0FBQ2lCLGdCQUFnQixDQUFDLFVBQVUsRUFBRSxNQUFNO01BQ3ZEaEMsUUFBUSxDQUFDaUIsZ0JBQWdCLENBQUNnQixLQUFLLENBQUNsRyxJQUFJLEdBQUcsT0FBTztJQUNoRCxDQUFDLENBQUM7RUFDSixDQUFDLENBQUUsQ0FBQztBQUNOLENBQUMsQ0FBRSxDQUFDLEMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2xvZ2ljLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvYmF0dGxlZ3JvdW5kLmNzcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3Jlc2V0LmNzcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2dldFVybC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9iYXR0bGVncm91bmQuY3NzPzNlNTkiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9yZXNldC5jc3M/ZWRlMCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvYXNzZXRzLyBzeW5jIG5vbnJlY3Vyc2l2ZSBcXC4ocG5nJTdDanBlIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9nbG9iYWwiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9wdWJsaWNQYXRoIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2pzb25wIGNodW5rIGxvYWRpbmciLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvbm9uY2UiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9iYXR0bGVncm91bmQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgU2hpcCB7XG4gIGNvbnN0cnVjdG9yKGxlbmd0aCwgbnVtSGl0cywgc3Vuaykge1xuICAgIHRoaXMubGVuZ3RoID0gbGVuZ3RoO1xuICAgIHRoaXMubnVtSGl0cyA9IG51bUhpdHM7XG4gICAgdGhpcy5zdW5rID0gc3VuaztcbiAgfVxuXG4gIGdldCBjdXJyZW50TGVuZ3RoKCkge1xuICAgIHJldHVybiB0aGlzLmxlbmd0aDtcbiAgfVxuXG4gIGdldCBjdXJyZW50TnVtSGl0cygpIHtcbiAgICByZXR1cm4gdGhpcy5udW1IaXRzO1xuICB9XG5cbiAgZ2V0IHN1bmtTdGF0dXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3VuaztcbiAgfVxuXG4gIGhpdCgpIHtcbiAgICBpZiAodGhpcy5udW1IaXRzIDwgdGhpcy5sZW5ndGgpIHtcbiAgICAgIHRoaXMubnVtSGl0cyArPSAxO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gXCJTaGlwIGFscmVhZHkgc3VuayFcIjtcbiAgICB9XG4gIH1cblxuICBpc1N1bmsoKSB7XG4gICAgaWYgKHRoaXMubGVuZ3RoID09PSB0aGlzLm51bUhpdHMpIHtcbiAgICAgIHRoaXMuc3VuayA9IHRydWU7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnN1bms7XG4gIH1cbn1cblxuY2xhc3MgR2FtZWJvYXJkIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5ib2FyZCA9IFtdO1xuICAgIHRoaXMuZGlzcGxhY2VTaGlwc1JlY3Vyc2lvbkNvdW50ID0gMDtcbiAgICB0aGlzLnNoaXBzID0ge1xuICAgICAgQ2FycmllcjogbmV3IFNoaXAoNSwgMCwgZmFsc2UpLFxuICAgICAgQmF0dGxlc2hpcDogbmV3IFNoaXAoNCwgMCwgZmFsc2UpLFxuICAgICAgRGVzdHJveWVyOiBuZXcgU2hpcCgzLCAwLCBmYWxzZSksXG4gICAgICBTdWJtYXJpbmU6IG5ldyBTaGlwKDMsIDAsIGZhbHNlKSxcbiAgICAgIFwiUGF0cm9sIEJvYXRcIjogbmV3IFNoaXAoMiwgMCwgZmFsc2UpLFxuICAgIH07XG4gIH1cblxuICBjcmVhdGVCb2FyZCgpIHtcbiAgICB0aGlzLmJvYXJkID0gW107XG4gICAgY29uc3QgYm9hcmQgPSB0aGlzLmJvYXJkO1xuICAgIGZvciAobGV0IG4gPSAwOyBuIDwgMTA7IG4rKykge1xuICAgICAgY29uc3Qgc3ViQm9hcmQgPSBbXTtcbiAgICAgIGZvciAobGV0IG0gPSAwOyBtIDwgMTA7IG0rKykge1xuICAgICAgICBzdWJCb2FyZC5wdXNoKG51bGwpO1xuICAgICAgfVxuICAgICAgYm9hcmQucHVzaChzdWJCb2FyZCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGJvYXJkO1xuICB9XG5cbiAgZ2V0TGVnYWxNb3ZlcygpIHtcbiAgICBjb25zdCBnZW5lcmF0ZU1vdmVzID0gZnVuY3Rpb24gKGxlbmd0aCkge1xuICAgICAgbGV0IGZpcnN0TW92ZSA9IFtdO1xuICAgICAgY29uc3Qgc2hpcE1vdmVzID0gW107XG4gICAgICBmb3IgKGxldCBtID0gMDsgbSA8IGxlbmd0aDsgbSsrKSB7XG4gICAgICAgIGZpcnN0TW92ZS5wdXNoKG0pO1xuICAgICAgfVxuICAgICAgLy8gQWNjb3VudCBmb3IgZXh0cmEgbW92ZXMgZm9yIHN1YnNlcXVlbnQgc2hpcHNcbiAgICAgIHN3aXRjaCAobGVuZ3RoKSB7XG4gICAgICAgIGNhc2UgNDpcbiAgICAgICAgICBsZW5ndGggKz0gMjtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAzOlxuICAgICAgICAgIGxlbmd0aCArPSA0O1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgbGVuZ3RoICs9IDY7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMTpcbiAgICAgICAgICBsZW5ndGggKz0gODtcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGZvciAobGV0IG4gPSAwOyBuIDw9IGxlbmd0aDsgbisrKSB7XG4gICAgICAgIHNoaXBNb3Zlcy5wdXNoKGZpcnN0TW92ZSk7XG4gICAgICAgIGZpcnN0TW92ZSA9IGZpcnN0TW92ZS5tYXAoKGluZGV4KSA9PiBpbmRleCArIDEpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gc2hpcE1vdmVzO1xuICAgIH07XG5cbiAgICBjb25zdCBjYXJyaWVyTW92ZXMgPSBnZW5lcmF0ZU1vdmVzKHRoaXMuc2hpcHMuQ2Fycmllci5sZW5ndGgpO1xuICAgIGNvbnN0IGJhdHRsZXNoaXBNb3ZlcyA9IGdlbmVyYXRlTW92ZXModGhpcy5zaGlwcy5CYXR0bGVzaGlwLmxlbmd0aCk7XG4gICAgY29uc3QgZGVzdHJveWVyTW92ZXMgPSBnZW5lcmF0ZU1vdmVzKHRoaXMuc2hpcHMuRGVzdHJveWVyLmxlbmd0aCk7XG4gICAgY29uc3Qgc3VibWFyaW5lTW92ZXMgPSBnZW5lcmF0ZU1vdmVzKHRoaXMuc2hpcHMuU3VibWFyaW5lLmxlbmd0aCk7XG4gICAgY29uc3QgcGF0cm9sTW92ZXMgPSBnZW5lcmF0ZU1vdmVzKHRoaXMuc2hpcHNbXCJQYXRyb2wgQm9hdFwiXS5sZW5ndGgpO1xuXG4gICAgY29uc3QgbGVnYWxNb3ZlcyA9IFtcbiAgICAgIGNhcnJpZXJNb3ZlcyxcbiAgICAgIGJhdHRsZXNoaXBNb3ZlcyxcbiAgICAgIGRlc3Ryb3llck1vdmVzLFxuICAgICAgc3VibWFyaW5lTW92ZXMsXG4gICAgICBwYXRyb2xNb3ZlcyxcbiAgICBdO1xuXG4gICAgcmV0dXJuIGxlZ2FsTW92ZXM7XG4gIH1cblxuICBkaXNwbGFjZVNoaXBzKCkge1xuICAgIGNvbnN0IGJvYXJkID0gdGhpcy5jcmVhdGVCb2FyZCgpO1xuICAgIGxldCBpc1JlRGlzcGxhY2VkID0gZmFsc2U7XG5cbiAgICBjb25zdCBnZW5lcmF0ZVJhbmRvbVJvd0luZGV4ID0gZnVuY3Rpb24gKCkge1xuICAgICAgY29uc3Qgcm93SW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCk7XG4gICAgICByZXR1cm4gcm93SW5kZXg7XG4gICAgfTtcblxuICAgIGNvbnN0IGdldFJhbmRvbU1vdmVJbmRleCA9IGZ1bmN0aW9uIChtb3Zlcykge1xuICAgICAgY29uc3QgbW92ZUluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbW92ZXMpO1xuICAgICAgcmV0dXJuIG1vdmVJbmRleDtcbiAgICB9O1xuXG4gICAgY29uc3QgdXBkYXRlTGVnYWxNb3Zlc0luQm9hcmQgPSAocm93SW5kZXgsIHNoaXBMZW5ndGgpID0+IHtcbiAgICAgIGNvbnN0IHBvcHVsYXRlZFJvdyA9IGJvYXJkW3Jvd0luZGV4XTtcbiAgICAgIGNvbnN0IGxhc3RPY2N1cGllZCA9IHBvcHVsYXRlZFJvdy5sYXN0SW5kZXhPZihzaGlwTGVuZ3RoKTtcbiAgICAgIGxldCBmaXJzdE9jY3VwaWVkID0gbnVsbDtcblxuICAgICAgY29uc3Qgb2NjdXB5ID0gKGZpcnN0SW5kZXhFbXB0eSwgbGFzdEluZGV4RW1wdHksIGZpcnN0VG9wQm90dG9tLCBsYXN0VG9wQm90dG9tKSA9PiB7XG4gICAgICAgIC8vIE9jY3VweSBmaXJzdCBhbmQgbGFzdCBpbmRleCBvZiBzaGlwXG4gICAgICAgIGZpcnN0T2NjdXBpZWQgPSBwb3B1bGF0ZWRSb3cuaW5kZXhPZihzaGlwTGVuZ3RoKTtcbiAgICAgICAgaWYgKGZpcnN0SW5kZXhFbXB0eSAmJiAhbGFzdEluZGV4RW1wdHkpIHtcbiAgICAgICAgICBwb3B1bGF0ZWRSb3dbZmlyc3RPY2N1cGllZCAtIDFdID0gXCJPXCI7XG4gICAgICAgIH0gZWxzZSBpZiAoIWZpcnN0SW5kZXhFbXB0eSAmJiBsYXN0SW5kZXhFbXB0eSkge1xuICAgICAgICAgIHBvcHVsYXRlZFJvd1tsYXN0T2NjdXBpZWQgKyAxXSA9IFwiT1wiO1xuICAgICAgICB9IGVsc2UgaWYgKGZpcnN0SW5kZXhFbXB0eSAmJiBsYXN0SW5kZXhFbXB0eSkge1xuICAgICAgICAgIHBvcHVsYXRlZFJvd1tmaXJzdE9jY3VwaWVkIC0gMV0gPSBcIk9cIjtcbiAgICAgICAgICBwb3B1bGF0ZWRSb3dbbGFzdE9jY3VwaWVkICsgMV0gPSBcIk9cIjtcbiAgICAgICAgfVxuICAgICAgICAvLyBPY2N1cHkgdG9wIGFuZC9vciBib3R0b21cbiAgICAgICAgaWYgKHJvd0luZGV4ID09PSAwKSB7XG4gICAgICAgICAgY29uc3QgYm90dG9tQWRqYWNlbnRSb3cgPSBib2FyZFsxXTtcbiAgICAgICAgICBib3R0b21BZGphY2VudFJvdy5maWxsKFxuICAgICAgICAgICAgXCJPXCIsXG4gICAgICAgICAgICBmaXJzdE9jY3VwaWVkIC0gZmlyc3RUb3BCb3R0b20sXG4gICAgICAgICAgICBsYXN0T2NjdXBpZWQgKyBsYXN0VG9wQm90dG9tLFxuICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSBpZiAocm93SW5kZXggPT09IDkpIHtcbiAgICAgICAgICBjb25zdCB0b3BBZGphY2VudFJvdyA9IGJvYXJkWzhdO1xuICAgICAgICAgIHRvcEFkamFjZW50Um93LmZpbGwoXG4gICAgICAgICAgICBcIk9cIixcbiAgICAgICAgICAgIGZpcnN0T2NjdXBpZWQgLSBmaXJzdFRvcEJvdHRvbSxcbiAgICAgICAgICAgIGxhc3RPY2N1cGllZCArIGxhc3RUb3BCb3R0b20sXG4gICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zdCB0b3BBZGphY2VudFJvdyA9IGJvYXJkW3Jvd0luZGV4IC0gMV07XG4gICAgICAgICAgY29uc3QgYm90dG9tQWRqYWNlbnRSb3cgPSBib2FyZFtyb3dJbmRleCArIDFdO1xuICAgICAgICAgIHRvcEFkamFjZW50Um93LmZpbGwoXG4gICAgICAgICAgICBcIk9cIixcbiAgICAgICAgICAgIGZpcnN0T2NjdXBpZWQgLSBmaXJzdFRvcEJvdHRvbSxcbiAgICAgICAgICAgIGxhc3RPY2N1cGllZCArIGxhc3RUb3BCb3R0b20sXG4gICAgICAgICAgKTtcbiAgICAgICAgICBib3R0b21BZGphY2VudFJvdy5maWxsKFxuICAgICAgICAgICAgXCJPXCIsXG4gICAgICAgICAgICBmaXJzdE9jY3VwaWVkIC0gZmlyc3RUb3BCb3R0b20sXG4gICAgICAgICAgICBsYXN0T2NjdXBpZWQgKyBsYXN0VG9wQm90dG9tLFxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICBpZiAoXG4gICAgICAgIHBvcHVsYXRlZFJvd1swXSA9PT0gbnVsbCAmJlxuICAgICAgICBwb3B1bGF0ZWRSb3dbcG9wdWxhdGVkUm93Lmxlbmd0aCAtIDFdICE9PSBudWxsICYmXG4gICAgICAgICFwb3B1bGF0ZWRSb3cuaW5jbHVkZXMoXCJPXCIpXG4gICAgICApIHtcbiAgICAgICAgb2NjdXB5KHRydWUsIGZhbHNlLCAxLCAxKTtcbiAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgIHBvcHVsYXRlZFJvd1swXSAhPT0gbnVsbCAmJlxuICAgICAgICBwb3B1bGF0ZWRSb3dbcG9wdWxhdGVkUm93Lmxlbmd0aCAtIDFdID09PSBudWxsICYmXG4gICAgICAgICFwb3B1bGF0ZWRSb3cuaW5jbHVkZXMoXCJPXCIpXG4gICAgICApIHtcbiAgICAgICAgb2NjdXB5KGZhbHNlLCB0cnVlLCAwLCAyKTtcbiAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgIHBvcHVsYXRlZFJvd1swXSA9PT0gbnVsbCAmJlxuICAgICAgICBwb3B1bGF0ZWRSb3dbcG9wdWxhdGVkUm93Lmxlbmd0aCAtIDFdID09PSBudWxsICYmXG4gICAgICAgICFwb3B1bGF0ZWRSb3cuaW5jbHVkZXMoXCJPXCIpXG4gICAgICApIHtcbiAgICAgICAgb2NjdXB5KHRydWUsIHRydWUsIDEsIDIpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCByZXN0YXJ0U2hpcERpc3BsYWNlbWVudElmQm9hcmRIYXNBZGphY2VudE9jY3VwaWVkUm93cyA9ICgoKSA9PiB7XG4gICAgICAgIGJvYXJkLmZvckVhY2goKHJvdywgcm93SW5kZXgpID0+IHtcbiAgICAgICAgICBpZiAocm93SW5kZXggPT09IDAgfHwgcm93SW5kZXggPT09IDkgfHwgaXNSZURpc3BsYWNlZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIE1vdmUgdG8gbmV4dCBpdGVyYXRpb24gaWYgcm93IGlzIGVtcHR5XG4gICAgICAgICAgY29uc3Qgcm93SXNFbXB0eSA9IHJvdy5ldmVyeSgoZW50cnkpID0+IGVudHJ5ID09PSBudWxsKTtcbiAgICAgICAgICBpZiAocm93SXNFbXB0eSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIERpc3BsYWNlIGZvciBhZGphY2VudCBvY2N1cGllZCByb3dzXG4gICAgICAgICAgY29uc3Qgcm93SXNPY2N1cGllZCA9IHJvdy5ldmVyeSgoZW50cnkpID0+IGVudHJ5ID09PSBcIk9cIiB8fCBlbnRyeSA9PT0gbnVsbCk7XG4gICAgICAgICAgaWYgKHJvd0lzT2NjdXBpZWQpIHtcbiAgICAgICAgICAgIGNvbnN0IG5leHRSb3dJc0VtcHR5ID0gYm9hcmRbcm93SW5kZXggKyAxXS5ldmVyeSgoZW50cnkpID0+IGVudHJ5ID09PSBudWxsKTtcbiAgICAgICAgICAgIGlmIChuZXh0Um93SXNFbXB0eSkge1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBuZXh0Um93SXNPY2N1cGllZCA9IGJvYXJkW3Jvd0luZGV4ICsgMV0uZXZlcnkoXG4gICAgICAgICAgICAgIChlbnRyeSkgPT4gZW50cnkgPT09IFwiT1wiIHx8IGVudHJ5ID09PSBudWxsLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGlmIChuZXh0Um93SXNPY2N1cGllZCkge1xuICAgICAgICAgICAgICBpc1JlRGlzcGxhY2VkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgdGhpcy5kaXNwbGFjZVNoaXBzUmVjdXJzaW9uQ291bnQgKz0gMTtcbiAgICAgICAgICAgICAgdGhpcy5kaXNwbGFjZVNoaXBzKCk7XG4gICAgICAgICAgICAgIHRoaXMuZGlzcGxhY2VTaGlwc1JlY3Vyc2lvbkNvdW50IC09IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0pKCk7XG4gICAgfTtcblxuICAgIGlmIChpc1JlRGlzcGxhY2VkKSB7XG4gICAgICBpc1JlRGlzcGxhY2VkID0gZmFsc2U7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgcG9wdWxhdGVCb2FyZCA9ICgoKSA9PiB7XG4gICAgICAvLyBTdG9wIGlmIGJvYXJkJ3MgZnVsbFxuICAgICAgY29uc3QgaXNCb2FyZEZ1bGwgPSBib2FyZC5ldmVyeSgocm93KSA9PiByb3cuaW5jbHVkZXMoXCJPXCIpKTtcbiAgICAgIGlmIChpc0JvYXJkRnVsbCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGxlZ2FsTW92ZXMgPSB0aGlzLmdldExlZ2FsTW92ZXMoKTtcblxuICAgICAgY29uc3QgX3dpdGhTcGVjaWZpZWRTaGlwID0gKHNoaXAsIGluZGV4KSA9PiB7XG4gICAgICAgIGNvbnN0IHJhbmRvbVJvd0luZGV4ID0gZ2VuZXJhdGVSYW5kb21Sb3dJbmRleCgpO1xuICAgICAgICBjb25zdCBzaGlwTW92ZXMgPSBsZWdhbE1vdmVzW2luZGV4XTtcbiAgICAgICAgbGV0IHNoaXBMZW5ndGggPSBudWxsO1xuXG4gICAgICAgIHN3aXRjaCAoc2hpcCkge1xuICAgICAgICAgIGNhc2UgXCJDYXJyaWVyXCI6XG4gICAgICAgICAgICBzaGlwTGVuZ3RoID0gdGhpcy5zaGlwcy5DYXJyaWVyLmxlbmd0aDtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgXCJCYXR0bGVzaGlwXCI6XG4gICAgICAgICAgICBzaGlwTGVuZ3RoID0gdGhpcy5zaGlwcy5CYXR0bGVzaGlwLmxlbmd0aDtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgXCJEZXN0cm95ZXJcIjpcbiAgICAgICAgICAgIHNoaXBMZW5ndGggPSAzLjU7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIFwiU3VibWFyaW5lXCI6XG4gICAgICAgICAgICBzaGlwTGVuZ3RoID0gdGhpcy5zaGlwcy5TdWJtYXJpbmUubGVuZ3RoO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSBcIlBhdHJvbCBCb2F0XCI6XG4gICAgICAgICAgICBzaGlwTGVuZ3RoID0gdGhpcy5zaGlwc1tcIlBhdHJvbCBCb2F0XCJdLmxlbmd0aDtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcmFuZG9tU2hpcE1vdmUgPSBnZXRSYW5kb21Nb3ZlSW5kZXgoc2hpcE1vdmVzLmxlbmd0aCk7XG4gICAgICAgIGNvbnN0IGZpcnN0U2hpcE1vdmUgPSBzaGlwTW92ZXNbcmFuZG9tU2hpcE1vdmVdWzBdO1xuICAgICAgICBjb25zdCBzaGlwTW92ZUxhc3RJbmRleCA9IHNoaXBNb3Zlc1tyYW5kb21TaGlwTW92ZV0ubGVuZ3RoIC0gMTtcbiAgICAgICAgY29uc3QgbGFzdFNoaXBNb3ZlID0gc2hpcE1vdmVzW3JhbmRvbVNoaXBNb3ZlXVtzaGlwTW92ZUxhc3RJbmRleF07XG5cbiAgICAgICAgYm9hcmQuZm9yRWFjaCgocm93LCByb3dJbmRleCkgPT4ge1xuICAgICAgICAgIGlmIChyb3dJbmRleCA9PT0gcmFuZG9tUm93SW5kZXgpIHtcbiAgICAgICAgICAgIC8vIEFsd2F5cyBvY2N1cHkgZW1wdHkgcm93XG4gICAgICAgICAgICB3aGlsZSAocm93LmluY2x1ZGVzKFwiT1wiKSkge1xuICAgICAgICAgICAgICAvLyBTdG9wIGxvb3AgaWYgYm9hcmQgaXMgZnVsbFxuICAgICAgICAgICAgICBjb25zdCBpc0JvYXJkRnVsbCA9IGJvYXJkLmV2ZXJ5KChyb3cpID0+IHJvdy5pbmNsdWRlcyhcIk9cIikpO1xuICAgICAgICAgICAgICBpZiAoaXNCb2FyZEZ1bGwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBfd2l0aFNwZWNpZmllZFNoaXAoc2hpcCwgaW5kZXgpO1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByb3cuZmlsbChzaGlwTGVuZ3RoLCBmaXJzdFNoaXBNb3ZlLCBsYXN0U2hpcE1vdmUgKyAxKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICB1cGRhdGVMZWdhbE1vdmVzSW5Cb2FyZChyYW5kb21Sb3dJbmRleCwgc2hpcExlbmd0aCk7XG4gICAgICB9O1xuXG4gICAgICBfd2l0aFNwZWNpZmllZFNoaXAoXCJDYXJyaWVyXCIsIDApO1xuICAgICAgX3dpdGhTcGVjaWZpZWRTaGlwKFwiQmF0dGxlc2hpcFwiLCAxKTtcbiAgICAgIF93aXRoU3BlY2lmaWVkU2hpcChcIkRlc3Ryb3llclwiLCAyKTtcbiAgICAgIF93aXRoU3BlY2lmaWVkU2hpcChcIlN1Ym1hcmluZVwiLCAzKTtcbiAgICAgIF93aXRoU3BlY2lmaWVkU2hpcChcIlBhdHJvbCBCb2F0XCIsIDQpO1xuICAgIH0pKCk7XG5cbiAgICBpZiAodGhpcy5kaXNwbGFjZVNoaXBzUmVjdXJzaW9uQ291bnQgPT09IDApIHtcbiAgICAgIHJldHVybiB0aGlzLmJvYXJkO1xuICAgIH1cbiAgfVxuXG4gIHJlY2VpdmVBdHRhY2soWFkpIHtcbiAgICBsZXQgaGl0U3RhdHVzID0gXCJcIjtcblxuICAgIGNvbnN0IGdlbmVyYXRlS2V5cyA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAvLyBBbHBoYWJldHMgQS1KXG4gICAgICBjb25zdCBhbHBoYWJldHMgPSBbXTtcbiAgICAgIGZvciAobGV0IG4gPSA2NTsgbiA8PSA3NDsgbisrKSB7XG4gICAgICAgIGFscGhhYmV0cy5wdXNoKFN0cmluZy5mcm9tQ2hhckNvZGUobikpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBrZXlzID0gW107XG4gICAgICBmb3IgKGxldCBtID0gMTsgbSA8PSAxMDsgbSsrKSB7XG4gICAgICAgIGNvbnN0IHN1YktleXMgPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBsZXR0ZXIgb2YgYWxwaGFiZXRzKSB7XG4gICAgICAgICAgc3ViS2V5cy5wdXNoKGAke219YCArIGxldHRlcik7XG4gICAgICAgIH1cbiAgICAgICAga2V5cy5wdXNoKHN1YktleXMpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4ga2V5cztcbiAgICB9KSgpO1xuXG4gICAgY29uc3QgYXNzaWduS2V5c1RvQm9hcmRJbmRpY2VzID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgIGNvbnN0IEtleXNCb3ggPSB7fTtcbiAgICAgIGNvbnN0IGtleXMgPSBnZW5lcmF0ZUtleXM7XG5cbiAgICAgIGZvciAobGV0IHJvd0luZGV4ID0gMDsgcm93SW5kZXggPCAxMDsgcm93SW5kZXgrKykge1xuICAgICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgMTA7IGluZGV4KyspIHtcbiAgICAgICAgICBLZXlzQm94W2Ake2tleXNbcm93SW5kZXhdW2luZGV4XX1gXSA9IFtpbmRleCwgcm93SW5kZXhdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gS2V5c0JveDtcbiAgICB9KSgpO1xuXG4gICAgY29uc3Qgb2NjdXB5Q2hvc2VuU3BvdCA9ICgoKSA9PiB7XG4gICAgICBjb25zdCBib2FyZCA9IHRoaXMuYm9hcmQ7XG4gICAgICBjb25zdCBLZXlzQm94ID0gYXNzaWduS2V5c1RvQm9hcmRJbmRpY2VzO1xuXG4gICAgICBjb25zdCBrZXlJbmRleCA9IEtleXNCb3hbWFldWzBdO1xuICAgICAgY29uc3Qgcm93SW5kZXggPSBLZXlzQm94W1hZXVsxXTtcbiAgICAgIGxldCBoaXRFbnRyeSA9IGJvYXJkW3Jvd0luZGV4XVtrZXlJbmRleF07XG5cbiAgICAgIGNvbnN0IHVwZGF0ZVNoaXBMaWZlID0gKHNoaXBMZW5ndGgpID0+IHtcbiAgICAgICAgY29uc3QgdXBkYXRlVW50aWxGdWxsID0gKHNoaXApID0+IHtcbiAgICAgICAgICBpZiAoc2hpcC5udW1IaXRzID09PSBzaGlwTGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIHNoaXAuaGl0KCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgc3dpdGNoIChzaGlwTGVuZ3RoKSB7XG4gICAgICAgICAgY2FzZSA1OlxuICAgICAgICAgICAgdXBkYXRlVW50aWxGdWxsKHRoaXMuc2hpcHMuQ2Fycmllcik7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgICB1cGRhdGVVbnRpbEZ1bGwodGhpcy5zaGlwcy5CYXR0bGVzaGlwKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgMy41OlxuICAgICAgICAgICAgdXBkYXRlVW50aWxGdWxsKHRoaXMuc2hpcHMuRGVzdHJveWVyKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgIHVwZGF0ZVVudGlsRnVsbCh0aGlzLnNoaXBzLlN1Ym1hcmluZSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICB1cGRhdGVVbnRpbEZ1bGwodGhpcy5zaGlwc1tcIlBhdHJvbCBCb2F0XCJdKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICBjb25zdCB0cmFja01pc3NlZEF0dGFja3MgPSBmdW5jdGlvbiAoY29vcmRpbmF0ZSkge1xuICAgICAgICBjb25zdCBtaXNzZWRBdHRhY2tzID0gW107XG4gICAgICAgIG1pc3NlZEF0dGFja3MucHVzaChjb29yZGluYXRlKTtcbiAgICAgIH07XG5cbiAgICAgIGNvbnN0IHVwZGF0ZVN1bmtTdGF0dXMgPSAoc2hpcExlbmd0aCkgPT4ge1xuICAgICAgICBzd2l0Y2ggKHNoaXBMZW5ndGgpIHtcbiAgICAgICAgICBjYXNlIDU6XG4gICAgICAgICAgICB0aGlzLnNoaXBzLkNhcnJpZXIuaXNTdW5rKCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgICB0aGlzLnNoaXBzLkJhdHRsZXNoaXAuaXNTdW5rKCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIDMuNTpcbiAgICAgICAgICAgIHRoaXMuc2hpcHMuRGVzdHJveWVyLmlzU3VuaygpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgdGhpcy5zaGlwcy5TdWJtYXJpbmUuaXNTdW5rKCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICB0aGlzLnNoaXBzW1wiUGF0cm9sIEJvYXRcIl0uaXNTdW5rKCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgY29uc3QgYWxsU2hpcHNTdW5rID0gKCkgPT4ge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgdGhpcy5zaGlwcy5DYXJyaWVyLnN1bmtTdGF0dXMgJiZcbiAgICAgICAgICB0aGlzLnNoaXBzLkJhdHRsZXNoaXAuc3Vua1N0YXR1cyAmJlxuICAgICAgICAgIHRoaXMuc2hpcHMuRGVzdHJveWVyLnN1bmtTdGF0dXMgJiZcbiAgICAgICAgICB0aGlzLnNoaXBzLlN1Ym1hcmluZS5zdW5rU3RhdHVzICYmXG4gICAgICAgICAgdGhpcy5zaGlwc1tcIlBhdHJvbCBCb2F0XCJdLnN1bmtTdGF0dXNcbiAgICAgICAgKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICBpZiAoaGl0RW50cnkgPT09IG51bGwgfHwgaGl0RW50cnkgPT09IFwiT1wiKSB7XG4gICAgICAgIGJvYXJkW3Jvd0luZGV4XVtrZXlJbmRleF0gPSBcIlhcIjtcbiAgICAgICAgdHJhY2tNaXNzZWRBdHRhY2tzKFhZKTtcbiAgICAgICAgaGl0U3RhdHVzID0gXCJGYWlsXCI7XG4gICAgICAgIHJldHVybiBcIkZhaWxcIjtcbiAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgIGhpdEVudHJ5ID09PSB0aGlzLnNoaXBzLkNhcnJpZXIubGVuZ3RoIHx8XG4gICAgICAgIGhpdEVudHJ5ID09PSB0aGlzLnNoaXBzLkJhdHRsZXNoaXAubGVuZ3RoIHx8XG4gICAgICAgIGhpdEVudHJ5ID09PSAzLjUgfHxcbiAgICAgICAgaGl0RW50cnkgPT09IHRoaXMuc2hpcHMuU3VibWFyaW5lLmxlbmd0aCB8fFxuICAgICAgICBoaXRFbnRyeSA9PT0gdGhpcy5zaGlwc1tcIlBhdHJvbCBCb2F0XCJdLmxlbmd0aFxuICAgICAgKSB7XG4gICAgICAgIGJvYXJkW3Jvd0luZGV4XVtrZXlJbmRleF0gPSBcIlhcIjtcbiAgICAgICAgdXBkYXRlU2hpcExpZmUoaGl0RW50cnkpO1xuICAgICAgICB1cGRhdGVTdW5rU3RhdHVzKGhpdEVudHJ5KTtcbiAgICAgICAgYWxsU2hpcHNTdW5rKCk7XG4gICAgICAgIGhpdFN0YXR1cyA9IFwiU3VjY2Vzc1wiO1xuICAgICAgICByZXR1cm4gXCJTdWNjZXNzXCI7XG4gICAgICB9IGVsc2UgaWYgKGhpdEVudHJ5ID09PSBcIlhcIikge1xuICAgICAgICBoaXRTdGF0dXMgPSBcIk9jY3VwaWVkXCI7XG4gICAgICAgIHJldHVybiBcIk9jY3VwaWVkXCI7XG4gICAgICB9XG4gICAgfSkoKTtcblxuICAgIHJldHVybiBoaXRTdGF0dXM7XG4gIH1cbn1cblxuY2xhc3MgUGxheWVyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy51c2VyID0gbmV3IEdhbWVib2FyZCgpO1xuICAgIHRoaXMudXNlci5kaXNwbGFjZVNoaXBzKCk7XG5cbiAgICB0aGlzLmNvbXB1dGVyID0gbmV3IEdhbWVib2FyZCgpO1xuICAgIHRoaXMuY29tcHV0ZXIuZGlzcGxhY2VTaGlwcygpO1xuICAgIHRoaXMuY29tcHV0ZXJSYW5kb21QaWNrQ291bnQgPSAwO1xuICAgIHRoaXMua2V5c1VwZGF0ZSA9IG51bGw7XG4gIH1cblxuICB1c2VyVHVybihYWSkge1xuICAgIHRoaXMuY29tcHV0ZXIucmVjZWl2ZUF0dGFjayhYWSk7XG4gIH1cblxuICBjb21wdXRlclR1cm4oKSB7XG4gICAgY29uc3QgZ2VuZXJhdGVSYW5kb21LZXkgPSAoKSA9PiB7XG4gICAgICBjb25zdCBnZXRLZXlzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBjb25zdCBhbHBoYWJldHMgPSBbXTtcbiAgICAgICAgY29uc3Qga2V5cyA9IFtdO1xuICAgICAgICBmb3IgKGxldCBuID0gNjU7IG4gPD0gNzQ7IG4rKykge1xuICAgICAgICAgIGFscGhhYmV0cy5wdXNoKFN0cmluZy5mcm9tQ2hhckNvZGUobikpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IG0gPSAxOyBtIDw9IDEwOyBtKyspIHtcbiAgICAgICAgICBmb3IgKGNvbnN0IGxldHRlciBvZiBhbHBoYWJldHMpIHtcbiAgICAgICAgICAgIGtleXMucHVzaChgJHttfWAgKyBsZXR0ZXIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ga2V5cztcbiAgICAgIH07XG5cbiAgICAgIGNvbnN0IGFzc2lnbkdlbmVyYXRlZEtleXNPbmNlID0gKCgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMua2V5c1VwZGF0ZSA9PT0gbnVsbCkge1xuICAgICAgICAgIHRoaXMua2V5c1VwZGF0ZSA9IGdldEtleXMoKTtcbiAgICAgICAgfVxuICAgICAgfSkoKTtcblxuICAgICAgbGV0IHJhbmRvbUtleSA9IG51bGw7XG4gICAgICBjb25zdCB1cGRhdGVLZXlzID0gKCgpID0+IHtcbiAgICAgICAgY29uc3QgcmFuZG9tS2V5SW5kZXggPSBNYXRoLmZsb29yKFxuICAgICAgICAgIE1hdGgucmFuZG9tKCkgKiAoMTAwIC0gdGhpcy5jb21wdXRlclJhbmRvbVBpY2tDb3VudCksXG4gICAgICAgICk7XG4gICAgICAgIHJhbmRvbUtleSA9IHRoaXMua2V5c1VwZGF0ZVtyYW5kb21LZXlJbmRleF07XG4gICAgICAgIHRoaXMua2V5c1VwZGF0ZS5zcGxpY2UocmFuZG9tS2V5SW5kZXgsIDEpO1xuICAgICAgICAvLyBJbmNyZWFzZSBjb3VudCB0byBlbmFibGUgbmV4dCByYW5kb21LZXlJbmRleCBiZSBhIGxlZ2FsIGluZGV4XG4gICAgICAgIHRoaXMuY29tcHV0ZXJSYW5kb21QaWNrQ291bnQgKz0gMTtcbiAgICAgIH0pKCk7XG5cbiAgICAgIHJldHVybiByYW5kb21LZXk7XG4gICAgfTtcbiAgICBjb25zdCByYW5kb21LZXkgPSBnZW5lcmF0ZVJhbmRvbUtleSgpO1xuXG4gICAgY29uc3QgcGlja0xlZ2FsTW92ZSA9ICgoKSA9PiB7XG4gICAgICBjb25zdCBib2FyZCA9IHRoaXMudXNlci5ib2FyZDtcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gdGhpcy51c2VyLnJlY2VpdmVBdHRhY2socmFuZG9tS2V5KTtcbiAgICB9KSgpO1xuXG4gICAgcmV0dXJuIHJhbmRvbUtleTtcbiAgfVxufVxuXG4vLyBtb2R1bGUuZXhwb3J0cyA9IHtcbi8vICAgU2hpcCxcbi8vICAgR2FtZWJvYXJkLFxuLy8gICBQbGF5ZXIsXG4vLyB9O1xuXG5leHBvcnQgeyBQbGF5ZXIgfTtcbiIsIi8vIEltcG9ydHNcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fIGZyb20gXCIuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyBmcm9tIFwiLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfR0VUX1VSTF9JTVBPUlRfX18gZnJvbSBcIi4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9nZXRVcmwuanNcIjtcbnZhciBfX19DU1NfTE9BREVSX1VSTF9JTVBPUlRfMF9fXyA9IG5ldyBVUkwoXCIuL2Fzc2V0cy9zaGlwLWVkaXQuanBnXCIsIGltcG9ydC5tZXRhLnVybCk7XG52YXIgX19fQ1NTX0xPQURFUl9VUkxfSU1QT1JUXzFfX18gPSBuZXcgVVJMKFwiLi9hc3NldHMvdmVydGljYWxzaGlwLmpwZ1wiLCBpbXBvcnQubWV0YS51cmwpO1xudmFyIF9fX0NTU19MT0FERVJfRVhQT1JUX19fID0gX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18pO1xudmFyIF9fX0NTU19MT0FERVJfVVJMX1JFUExBQ0VNRU5UXzBfX18gPSBfX19DU1NfTE9BREVSX0dFVF9VUkxfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfVVJMX0lNUE9SVF8wX19fKTtcbnZhciBfX19DU1NfTE9BREVSX1VSTF9SRVBMQUNFTUVOVF8xX19fID0gX19fQ1NTX0xPQURFUl9HRVRfVVJMX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX1VSTF9JTVBPUlRfMV9fXyk7XG4vLyBNb2R1bGVcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLnB1c2goW21vZHVsZS5pZCwgYC8qIGJvZHkgKiB7XG4gIGJvcmRlcjogMnB4IHNvbGlkIGJ1cmx5d29vZDtcbn0gKi9cblxuYm9keSB7XG4gIGRpc3BsYXk6IGdyaWQ7XG4gIGdyaWQtdGVtcGxhdGU6IDRmciAxZnIgLyAxZnIgMWZyO1xuICBnYXA6IDhyZW07XG4gIHBhZGRpbmc6IDRyZW0gOHJlbTtcbiAgbWFyZ2luOiAwO1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG5cbiAgZm9udC1mYW1pbHk6IFwiUmFsZXdheVwiLCBzYW5zLXNlcmlmO1xuICBmb250LXNpemU6IDEuM3JlbTtcbiAgbGV0dGVyLXNwYWNpbmc6IDAuMXJlbTtcbiAgaGVpZ2h0OiAxMDB2aDtcbiAgYmFja2dyb3VuZC1pbWFnZTogdXJsKCR7X19fQ1NTX0xPQURFUl9VUkxfUkVQTEFDRU1FTlRfMF9fX30pO1xuICBiYWNrZ3JvdW5kLXNpemU6IGNvdmVyO1xuICBiYWNrZ3JvdW5kLXBvc2l0aW9uOiBjZW50ZXIgY2VudGVyO1xufVxuXG5ib2R5ID4gc2VjdGlvbiB7XG4gIGRpc3BsYXk6IGdyaWQ7XG4gIGdyaWQtdGVtcGxhdGU6IDFmciAxZnIgMTBmci8gMmZyIDhmcjtcbiAgZ2FwOiAwLjNyZW07XG4gIHBhZGRpbmc6IDAuNXJlbSA3cmVtIDAuNXJlbSAxcmVtO1xuICB6LWluZGV4OiAxO1xufVxuXG4uY29uZmlnLWRpYWxvZyB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gIHdpZHRoOiAyMHJlbTtcbiAgcGFkZGluZzogMXJlbTtcbiAgZ2FwOiAxcmVtO1xuICBiYWNrZ3JvdW5kOiByZ2JhKDM0LCAxMDAsIDE3NSwgMC44KTtcbiAgYm9yZGVyOiAwLjJyZW0gc29saWQgcmdiKDE3LCA1MCwgODcpO1xuICBib3JkZXItcmFkaXVzOiAycmVtO1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHRvcDogNTAlO1xuICBsZWZ0OiA1MCU7XG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlKC01MCUsIC01MCUpO1xuICB2aXNpYmlsaXR5OiBoaWRkZW47XG4gIG9wYWNpdHk6IDA7XG4gIHRyYW5zaXRpb246IG9wYWNpdHkgMC4zcyBlYXNlLWluLW91dDtcbiAgei1pbmRleDogMjtcbn1cblxuLmNvbmZpZy1kaWFsb2cgPiBkaXYge1xuICBkaXNwbGF5OiBmbGV4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG59XG5cbi5jb25maWctZGlhbG9nIHNwYW4ge1xuICBhbGlnbi1zZWxmOiBjZW50ZXI7XG4gIGZvbnQtd2VpZ2h0OiA4MDA7XG4gIGNvbG9yOiB3aGl0ZTtcbiAgYmFja2dyb3VuZDogcmdiYSgyNDgsIDcxLCA0NywgMC44KTtcbiAgbWFyZ2luLWxlZnQ6IDAuNXJlbTtcbiAgcGFkZGluZzogMC4ycmVtIDAuM3JlbSAwLjFyZW0gMC4zcmVtO1xuICBib3JkZXItcmFkaXVzOiAxMHJlbTtcbiAgY3Vyc29yOiBwb2ludGVyO1xufVxuXG4uY29uZmlnLWRpYWxvZyBzcGFuOmhvdmVyIHtcbiAgYmFja2dyb3VuZDogcmdiKDI0OCwgNzEsIDQ3KTtcbn1cblxuLmNvbmZpZy1kaWFsb2cgYnV0dG9uLFxuLmNvbmZpZy1kaWFsb2cgc2VsZWN0IHtcbiAgYWxpZ24tc2VsZjogY2VudGVyO1xuICBmb250LXNpemU6IDEuMDVyZW07XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgY29sb3I6IHdoaXRlO1xuICB3aWR0aDogN3JlbTtcbiAgYm9yZGVyLXJhZGl1czogMC41cmVtO1xuICBjdXJzb3I6IHBvaW50ZXI7XG4gIGJhY2tncm91bmQ6IHJnYigxNywgNTAsIDg3KTtcbn1cblxuLmNvbmZpZy1kaWFsb2cgYnV0dG9uOmhvdmVyLFxuLmNvbmZpZy1kaWFsb2cgc2VsZWN0OmhvdmVyIHtcbiAgYm9yZGVyOiAwLjFyZW0gc29saWQgd2hpdGU7XG59XG5cbi5jb25maWctZGlhbG9nIGZpZWxkc2V0IHtcbiAgZGlzcGxheTogZmxleDtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIGdhcDogMC4ycmVtO1xuICBwYWRkaW5nOiAwLjJyZW07XG4gIGJvcmRlci1yYWRpdXM6IDAuNXJlbTtcbiAgYm9yZGVyLWxlZnQ6IDAuMnJlbSBzb2xpZCByZ2IoMTcsIDUwLCA4Nyk7XG4gIGJvcmRlci1yaWdodDogMC4ycmVtIHNvbGlkIHJnYigxNywgNTAsIDg3KTtcbiAgYmFja2dyb3VuZDogcmdiYSgxNywgNTAsIDg3LCAwLjQpO1xufVxuXG5maWVsZHNldCA+IGJ1dHRvbiB7XG4gIGhlaWdodDogMS41cmVtO1xufVxuXG5sZWdlbmQge1xuICBmb250LXNpemU6IDEuMnJlbTtcbiAgY29sb3I6IHdoaXRlO1xuICBmb250LXdlaWdodDogODAwO1xuICBwYWRkaW5nLWxlZnQ6IDAuMnJlbTtcbiAgY3Vyc29yOiBjb250ZXh0LW1lbnU7XG59XG5cbi5jb25maWctYm94IHtcbiAgd2lkdGg6IGZpdC1jb250ZW50O1xufVxuXG4uY29uZmlnLWJveCA+IGJ1dHRvbiB7XG4gIGZvbnQtc2l6ZTogMS4xcmVtO1xuICBsZXR0ZXItc3BhY2luZzogMC4wNXJlbTtcbiAgYm9yZGVyLXJhZGl1czogMC41cmVtO1xuICBoZWlnaHQ6IDJyZW07XG4gIGJhY2tncm91bmQ6IGxpbmVhci1ncmFkaWVudCh0byByaWdodCwgcmdiYSg1LCA2LCA4LCAwLjgpLCByZ2JhKDM5LCAxMTQsIDE5OSwgMC44KSk7XG4gIG9wYWNpdHk6IDAuODtcbiAgY3Vyc29yOiBwb2ludGVyO1xuICB0cmFuc2l0aW9uOlxuICAgIGJhY2tncm91bmQgMC41cyBlYXNlLW91dCxcbiAgICBjb2xvciAwLjVzIGVhc2Utb3V0LFxuICAgIHRyYW5zZm9ybSAwLjNzIGVhc2UtaW4tb3V0O1xufVxuXG4uY29uZmlnLWJveCA+IGJ1dHRvbjpob3ZlciB7XG4gIGJhY2tncm91bmQ6IHJnYigzNCwgMTAwLCAxNzUpO1xuICBib3JkZXI6IDAuMXJlbSBzb2xpZCB3aGl0ZTtcbiAgdHJhbnNmb3JtOiBzY2FsZSgxLjA1KTtcbn1cblxuLmNvbmZpZy1ib3ggc3ZnIHtcbiAgd2lkdGg6IDEuOHJlbTtcbn1cblxuLmNvbmZpZy1ib3ggPiBidXR0b246YWN0aXZlIHtcbiAgYmFja2dyb3VuZDogcmdiKDE3LCA1MCwgODcpO1xufVxuXG5oMiB7XG4gIGdyaWQtcm93OiBzcGFuIDE7XG4gIGdyaWQtY29sdW1uOiAyIC8gLTE7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgZm9udC1zaXplOiAycmVtO1xuICBmb250LXdlaWdodDogNjAwO1xuICBwYWRkaW5nOiAwLjI1cmVtIDFyZW0gMCAxcmVtO1xuICBqdXN0aWZ5LXNlbGY6IGNlbnRlcjtcbiAgYmFja2dyb3VuZDogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjQpO1xuICBib3JkZXItdG9wOiAwLjNyZW0gc29saWQgcmdiKDAsIDAsIDApO1xuICBib3JkZXItYm90dG9tOiAwLjNyZW0gc29saWQgcmdiKDAsIDAsIDApO1xuICBjdXJzb3I6IGNvbnRleHQtbWVudTtcbiAgdHJhbnNpdGlvbjogdHJhbnNmb3JtIDAuM3MgZWFzZS1pbi1vdXQ7XG59XG5cbmgyOmhvdmVyIHtcbiAgYmFja2dyb3VuZDogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjYpO1xuICB0cmFuc2Zvcm06IHNjYWxlKDEuMSk7XG59XG5cbi5oZWFkLFxuLnRhaWwge1xuICBkaXNwbGF5OiBmbGV4O1xuICBiYWNrZ3JvdW5kOiByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuNCk7XG4gIGJvcmRlci1yYWRpdXM6IDFyZW07XG4gIGN1cnNvcjogY29udGV4dC1tZW51O1xufVxuXG4uaGVhZCB7XG4gIGFsaWduLXNlbGY6IGZsZXgtZW5kO1xuICBncmlkLXJvdzogMiAvIDM7XG4gIGdyaWQtY29sdW1uOiAyIC8gMztcbn1cblxuLnRhaWwge1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICBqdXN0aWZ5LXNlbGY6IGZsZXgtZW5kO1xuICBncmlkLXJvdzogMyAvIC0xO1xufVxuXG4uaGVhZCA+IGRpdixcbi50YWlsID4gZGl2IHtcbiAgZmxleDogMSAxIGF1dG87XG4gIHBhZGRpbmctdG9wOiAwLjVyZW07XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgZm9udC13ZWlnaHQ6IDYwMDtcbiAgbWluLXdpZHRoOiAycmVtO1xuICBtaW4taGVpZ2h0OiAycmVtO1xuICB0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gMC4xcyBlYXNlLWluO1xufVxuXG4uaGVhZCA+IGRpdjpob3Zlcixcbi50YWlsID4gZGl2OmhvdmVyIHtcbiAgZm9udC13ZWlnaHQ6IDgwMDtcbiAgdHJhbnNmb3JtOiBzY2FsZSgxLjIpO1xufVxuXG4uYWRtaXJhbC1ncm91bmRzLFxuLmFpLWdyb3VuZHMge1xuICBncmlkLXJvdzogMyAvIC0xO1xuICBncmlkLWNvbHVtbjogMiAvIC0xO1xuICBkaXNwbGF5OiBncmlkO1xuICBncmlkLXRlbXBsYXRlOiByZXBlYXQoMTAsIDFmcikgLyByZXBlYXQoMTAsIDFmcik7XG4gIGJvcmRlcjogMnB4IHNvbGlkIHJnYigyNTUsIDI1NSwgMjU1KTtcbiAgYm9yZGVyLXJhZGl1czogMXJlbTtcbiAgdHJhbnNpdGlvbjogdHJhbnNmb3JtIDAuMjVzIGVhc2UtaW4tb3V0O1xufVxuXG4uc2NhbGVEaXZzIHtcbiAgdHJhbnNmb3JtOiBzY2FsZSgxLjAyKTtcbn1cblxuLmFkbWlyYWwtZ3JvdW5kczpob3Zlcixcbi5haS1ncm91bmRzOmhvdmVyIHtcbiAgdHJhbnNmb3JtOiBzY2FsZSgxLjAyKTtcbn1cblxuLmFkbWlyYWwtZ3JvdW5kcyA+IGRpdixcbi5haS1ncm91bmRzID4gZGl2IHtcbiAgZ3JpZC1jb2x1bW46IHNwYW4gMTtcbiAgZ3JpZC1yb3c6IHNwYW4gMTtcbiAgbWluLXdpZHRoOiAycmVtO1xuICBtaW4taGVpZ2h0OiAycmVtO1xuXG4gIGRpc3BsYXk6IGZsZXg7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIGZvbnQtd2VpZ2h0OiA4MDA7XG4gIGJvcmRlcjogMnB4IHNvbGlkIHJnYigyNTUsIDI1NSwgMjU1KTtcbiAgY3Vyc29yOiBwb2ludGVyO1xuICB0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gMC4ycyBlYXNlLWluLW91dDtcbn1cblxuLmFkbWlyYWwtZ3JvdW5kcyBzcGFuLFxuLmFpLWdyb3VuZHMgc3BhbiB7XG4gIGZvbnQtc2l6ZTogMS43cmVtO1xufVxuXG4uYWRtaXJhbC1ncm91bmRzID4gZGl2OmhvdmVyLFxuLmFpLWdyb3VuZHMgPiBkaXY6aG92ZXIge1xuICB0cmFuc2Zvcm06IHNjYWxlKDEuMSk7XG59XG5cbi5hZG1pcmFsLWdyb3VuZHMgPiBkaXY6Zmlyc3QtY2hpbGQsXG4uYWktZ3JvdW5kcyA+IGRpdjpmaXJzdC1jaGlsZCB7XG4gIGJvcmRlci10b3AtbGVmdC1yYWRpdXM6IDFyZW07XG59XG5cbi5hZG1pcmFsLWdyb3VuZHMgPiBkaXY6bnRoLWNoaWxkKDEwKSxcbi5haS1ncm91bmRzID4gZGl2Om50aC1jaGlsZCgxMCkge1xuICBib3JkZXItdG9wLXJpZ2h0LXJhZGl1czogMXJlbTtcbn1cblxuLmFkbWlyYWwtZ3JvdW5kcyA+IGRpdjpudGgtbGFzdC1jaGlsZCgxMCksXG4uYWktZ3JvdW5kcyA+IGRpdjpudGgtbGFzdC1jaGlsZCgxMCkge1xuICBib3JkZXItYm90dG9tLWxlZnQtcmFkaXVzOiAxcmVtO1xufVxuXG4uYWRtaXJhbC1ncm91bmRzID4gZGl2Om50aC1sYXN0LWNoaWxkKDEpLFxuLmFpLWdyb3VuZHMgPiBkaXY6bnRoLWxhc3QtY2hpbGQoMSkge1xuICBib3JkZXItYm90dG9tLXJpZ2h0LXJhZGl1czogMXJlbTtcbn1cblxuYm9keSA+IGRpdjpsYXN0LWNoaWxkIHtcbiAgZ3JpZC1jb2x1bW46IDEgLyAtMTtcbiAgYWxpZ24tc2VsZjogZmxleC1zdGFydDtcbiAganVzdGlmeS1zZWxmOiBjZW50ZXI7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG5cbiAgZm9udC13ZWlnaHQ6IDYwMDtcbiAgYm9yZGVyOiAwLjJyZW0gc29saWQgcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjgpO1xuICBib3JkZXItcmFkaXVzOiAxcmVtO1xuICBiYWNrZ3JvdW5kOiByZ2JhKDAsIDAsIDAsIDAuNSk7XG4gIGNvbG9yOiB3aGl0ZTtcbiAgaGVpZ2h0OiAzcmVtO1xuICB3aWR0aDogNDByZW07XG4gIGN1cnNvcjogY29udGV4dC1tZW51O1xuICB6LWluZGV4OiAxO1xuICB0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gMC4zcyBlYXNlLWluLW91dDtcbn1cblxuYm9keSA+IGRpdjpsYXN0LWNoaWxkOmhvdmVyIHtcbiAgdHJhbnNmb3JtOiBzY2FsZSgxLjA1KTtcbiAgYm9yZGVyOiAwLjJyZW0gc29saWQgcmdiKDI1NSwgMjU1LCAyNTUpO1xuICBiYWNrZ3JvdW5kOiByZ2JhKDAsIDAsIDAsIDAuNyk7XG59XG5cbmJvZHkgPiBkaXY6Zmlyc3QtY2hpbGQge1xuICBwb3NpdGlvbjogZml4ZWQ7XG4gIHRvcDogMDtcbiAgbGVmdDogMDtcbiAgd2lkdGg6IDEwMCU7XG4gIGhlaWdodDogMTAwJTtcbiAgYmFja2dyb3VuZDogcmdiYSgwLCAwLCAwLCAwLjYpO1xufVxuXG4uYWRtaXJhbC1ncm91bmRzIGltZyxcbi5haS1ncm91bmRzIGltZyB7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgbGVmdDogMSU7XG4gIGJvdHRvbTogMC41JTtcbiAgcG9pbnRlci1ldmVudHM6IG5vbmU7XG59XG5cbi5jb25maWctZGlhbG9nIGltZyB7XG4gIGFsaWduLXNlbGY6IGZsZXgtZW5kO1xuICBiYWNrZ3JvdW5kOiByZ2JhKDE3LCA1MCwgODcsIDAuOCk7XG4gIHdpZHRoOiAycmVtO1xuICBoZWlnaHQ6IDJyZW07XG4gIHBhZGRpbmc6IDAuMnJlbTtcbiAgYm9yZGVyLXJhZGl1czogMC41cmVtO1xuICBjdXJzb3I6IHBvaW50ZXI7XG59XG5cbi5jb25maWctZGlhbG9nIGltZzpob3ZlciB7XG4gIGJvcmRlcjogMC4xcmVtIHNvbGlkIHdoaXRlO1xuICBiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQodG8gYm90dG9tIHJpZ2h0LCByZ2IoMTcsIDUwLCA4NyksIHJnYmEoMjU1LCAyNTUsIDAsIDAuNCkpO1xufVxuXG5zdmcge1xuICBmaWxsOiB3aGl0ZTtcbiAgd2lkdGg6IDEuN3JlbTtcbn1cblxuQG1lZGlhIChtYXgtd2lkdGg6IDE1NzBweCkge1xuICBib2R5IHtcbiAgICBnYXA6IDZyZW07XG4gICAgcGFkZGluZzogNnJlbSA2cmVtO1xuICB9XG5cbiAgYm9keSA+IGRpdjpsYXN0LWNoaWxkIHtcbiAgICB3aWR0aDogMzVyZW07XG4gIH1cbiAgLmFkbWlyYWwtZ3JvdW5kcyxcbiAgLmFpLWdyb3VuZHMge1xuICAgIGFsaWduLXNlbGY6IGZsZXgtc3RhcnQ7XG4gIH1cbiAgLnRhaWwsXG4gIC5oZWFkIHtcbiAgICBmb250LXNpemU6IDEuMXJlbTtcbiAgfVxuICAudGFpbCB7XG4gICAgYWxpZ24tc2VsZjogZmxleC1zdGFydDtcbiAgfVxuICAuaGVhZCA+IGRpdixcbiAgLnRhaWwgPiBkaXYge1xuICAgIHBhZGRpbmctdG9wOiAwLjJyZW07XG4gIH1cbn1cblxuQG1lZGlhIChtYXgtd2lkdGg6IDEyNzBweCkge1xuICBib2R5IHtcbiAgICBnYXA6IDNyZW07XG4gICAgcGFkZGluZzogOHJlbSA0cmVtO1xuICB9XG5cbiAgYm9keSA+IGRpdjpsYXN0LWNoaWxkIHtcbiAgICB3aWR0aDogMzByZW07XG4gICAgYWxpZ24tc2VsZjogY2VudGVyO1xuICB9XG5cbiAgYm9keSA+IHNlY3Rpb24ge1xuICAgIHBhZGRpbmc6IDAuNXJlbSA1cmVtIDAuNXJlbSAwLjVyZW07XG4gIH1cblxuICAuYWRtaXJhbC1ncm91bmRzIHNwYW4sXG4gIC5haS1ncm91bmRzIHNwYW4ge1xuICAgIGZvbnQtc2l6ZTogMS4ycmVtO1xuICB9XG59XG5cbkBtZWRpYSAobWF4LXdpZHRoOiAxMTEwcHgpIHtcbiAgYm9keSB7XG4gICAgZ2FwOiAxcmVtO1xuICAgIHBhZGRpbmc6IDhyZW0gMXJlbTtcbiAgICBoZWlnaHQ6IDEwMCU7XG4gIH1cblxuICBib2R5ID4gc2VjdGlvbiB7XG4gICAgcGFkZGluZzogMC41cmVtIDNyZW0gMC41cmVtIDAuNXJlbTtcbiAgfVxuXG4gIGgyIHtcbiAgICBmb250LXNpemU6IDEuNXJlbTtcbiAgfVxuXG4gIGJvZHkgPiBkaXY6bGFzdC1jaGlsZCB7XG4gICAgd2lkdGg6IDI4cmVtO1xuICAgIGZvbnQtc2l6ZTogMXJlbTtcbiAgfVxufVxuXG5AbWVkaWEgKG1heC13aWR0aDogOTAwcHgpIHtcbiAgYm9keSB7XG4gICAgZ2FwOiAwLjNyZW07XG4gICAgcGFkZGluZzogOHJlbSAwLjJyZW07XG4gICAgYmFja2dyb3VuZC1pbWFnZTogdXJsKCR7X19fQ1NTX0xPQURFUl9VUkxfUkVQTEFDRU1FTlRfMV9fX30pO1xuICB9XG5cbiAgYm9keSA+IHNlY3Rpb24ge1xuICAgIHBhZGRpbmc6IDAuNXJlbTtcbiAgfVxuXG4gIGJvZHkgPiBkaXY6bGFzdC1jaGlsZCB7XG4gICAgd2lkdGg6IDI1cmVtO1xuICAgIGFsaWduLXNlbGY6IGZsZXgtc3RhcnQ7XG4gIH1cblxuICAuY29uZmlnLWRpYWxvZyB7XG4gICAgYmFja2dyb3VuZDogcmdiYSg0NiwgNDYsIDQ2LCAwLjgpO1xuICAgIGJvcmRlcjogMC4ycmVtIHNvbGlkIHJnYigxNDMsIDEwOSwgNjEpO1xuICB9XG5cbiAgLmNvbmZpZy1kaWFsb2cgYnV0dG9uLFxuICAuY29uZmlnLWRpYWxvZyBzZWxlY3Qge1xuICAgIGJhY2tncm91bmQ6IHJnYigxNDMsIDEwOSwgNjEpO1xuICB9XG5cbiAgLmNvbmZpZy1kaWFsb2cgZmllbGRzZXQge1xuICAgIGJhY2tncm91bmQ6IHJnYmEoOTUsIDczLCA0MywgMC40KTtcbiAgICBib3JkZXItbGVmdDogMC4ycmVtIHNvbGlkIHJnYigxNDMsIDEwOSwgNjEpO1xuICAgIGJvcmRlci1yaWdodDogMC4ycmVtIHNvbGlkIHJnYigxNDMsIDEwOSwgNjEpO1xuICB9XG5cbiAgLmNvbmZpZy1ib3ggPiBidXR0b24ge1xuICAgIHBhZGRpbmc6IDAuMXJlbTtcbiAgICBiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQodG8gcmlnaHQsIHJnYmEoNSwgNiwgOCwgMC44KSwgcmdiYSgyMjEsIDE2NiwgODgsIDAuOCkpO1xuICB9XG5cbiAgLmNvbmZpZy1ib3ggPiBidXR0b246aG92ZXIge1xuICAgIGJhY2tncm91bmQ6IHJnYigxODUsIDEzOSwgNzQpO1xuICB9XG5cbiAgLmNvbmZpZy1kaWFsb2cgaW1nIHtcbiAgICBiYWNrZ3JvdW5kOiByZ2JhKDk1LCA3MywgNDMsIDAuNik7XG4gIH1cblxuICAuY29uZmlnLWRpYWxvZyBpbWc6aG92ZXIge1xuICAgIGJhY2tncm91bmQ6IGxpbmVhci1ncmFkaWVudCh0byBib3R0b20gcmlnaHQsIHJnYig0OCwgMzcsIDIyKSwgcmdiYSgyNTUsIDI1NSwgMCwgMC41KSk7XG4gIH1cbn1cblxuQG1lZGlhIChtYXgtd2lkdGg6IDc2NXB4KSB7XG4gIGJvZHkge1xuICAgIGdyaWQtdGVtcGxhdGU6IHJlcGVhdCgyLCA0ZnIpIDFmciAvIDFmcjtcbiAgICBwYWRkaW5nOiAwO1xuICB9XG5cbiAgYm9keSA+IHNlY3Rpb24ge1xuICAgIGdyaWQtdGVtcGxhdGU6IDFmciAxZnIgMTBmci8gMWZyIDhmcjtcbiAgICBwYWRkaW5nLXJpZ2h0OiAxLjVyZW07XG4gICAgaGVpZ2h0OiAyN3JlbTtcbiAgfVxufVxuXG5AbWVkaWEgKG1heC13aWR0aDogNDIwcHgpIHtcbiAgLmNvbmZpZy1kaWFsb2cge1xuICAgIGxlZnQ6IDUzJTtcbiAgfVxufVxuXG5AbWVkaWEgKG1heC13aWR0aDogMzkwcHgpIHtcbiAgLmNvbmZpZy1kaWFsb2cge1xuICAgIGxlZnQ6IDU3JTtcbiAgfVxufVxuXG5AbWVkaWEgKG1heC13aWR0aDogMjkwcHgpIHtcbiAgLmNvbmZpZy1kaWFsb2cge1xuICAgIGxlZnQ6IDc4JTtcbiAgfVxufVxuYCwgXCJcIix7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJ3ZWJwYWNrOi8vLi9zcmMvYmF0dGxlZ3JvdW5kLmNzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFBQTs7R0FFRzs7QUFFSDtFQUNFLGFBQWE7RUFDYixnQ0FBZ0M7RUFDaEMsU0FBUztFQUNULGtCQUFrQjtFQUNsQixTQUFTO0VBQ1Qsa0JBQWtCOztFQUVsQixrQ0FBa0M7RUFDbEMsaUJBQWlCO0VBQ2pCLHNC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QUVFLG1CQUFtQjtFQUNyQjtBQUNGOztBQUVBO0VBQ0U7SUFDRSxTQUFTO0lBQ1Qsa0JBQWtCO0VBQ3BCOztFQUVBO0lBQ0UsWUFBWTtJQUNaLGtCQUFrQjtFQUNwQjs7RUFFQTtJQUNFLGtDQUFrQztFQUNwQzs7RUFFQTs7SUFFRSxpQkFBaUI7RUFDbkI7QUFDRjs7QUFFQTtFQUNFO0lBQ0UsU0FBUztJQUNULGtCQUFrQjtJQUNsQixZQUFZO0VBQ2Q7O0VBRUE7SUFDRSxrQ0FBa0M7RUFDcEM7O0VBRUE7SUFDRSxpQkFBaUI7RUFDbkI7O0VBRUE7SUFDRSxZQUFZO0lBQ1osZUFBZTtFQUNqQjtBQUNGOztBQUVBO0VBQ0U7SUFDRSxXQUFXO0lBQ1gsb0JBQW9CO0lBQ3BCLHlEQUFnRDtFQUNsRDs7RUFFQTtJQUNFLGVBQWU7RUFDakI7O0VBRUE7SUFDRSxZQUFZO0lBQ1osc0JBQXNCO0VBQ3hCOztFQUVBO0lBQ0UsaUNBQWlDO0lBQ2pDLHNDQUFzQztFQUN4Qzs7RUFFQTs7SUFFRSw2QkFBNkI7RUFDL0I7O0VBRUE7SUFDRSxpQ0FBaUM7SUFDakMsMkNBQTJDO0lBQzNDLDRDQUE0QztFQUM5Qzs7RUFFQTtJQUNFLGVBQWU7SUFDZixrRkFBa0Y7RUFDcEY7O0VBRUE7SUFDRSw2QkFBNkI7RUFDL0I7O0VBRUE7SUFDRSxpQ0FBaUM7RUFDbkM7O0VBRUE7SUFDRSxxRkFBcUY7RUFDdkY7QUFDRjs7QUFFQTtFQUNFO0lBQ0UsdUNBQXVDO0lBQ3ZDLFVBQVU7RUFDWjs7RUFFQTtJQUNFLG9DQUFvQztJQUNwQyxxQkFBcUI7SUFDckIsYUFBYTtFQUNmO0FBQ0Y7O0FBRUE7RUFDRTtJQUNFLFNBQVM7RUFDWDtBQUNGOztBQUVBO0VBQ0U7SUFDRSxTQUFTO0VBQ1g7QUFDRjs7QUFFQTtFQUNFO0lBQ0UsU0FBUztFQUNYO0FBQ0ZcIixcInNvdXJjZXNDb250ZW50XCI6W1wiLyogYm9keSAqIHtcXG4gIGJvcmRlcjogMnB4IHNvbGlkIGJ1cmx5d29vZDtcXG59ICovXFxuXFxuYm9keSB7XFxuICBkaXNwbGF5OiBncmlkO1xcbiAgZ3JpZC10ZW1wbGF0ZTogNGZyIDFmciAvIDFmciAxZnI7XFxuICBnYXA6IDhyZW07XFxuICBwYWRkaW5nOiA0cmVtIDhyZW07XFxuICBtYXJnaW46IDA7XFxuICBwb3NpdGlvbjogcmVsYXRpdmU7XFxuXFxuICBmb250LWZhbWlseTogXFxcIlJhbGV3YXlcXFwiLCBzYW5zLXNlcmlmO1xcbiAgZm9udC1zaXplOiAxLjNyZW07XFxuICBsZXR0ZXItc3BhY2luZzogMC4xcmVtO1xcbiAgaGVpZ2h0OiAxMDB2aDtcXG4gIGJhY2tncm91bmQtaW1hZ2U6IHVybCguL2Fzc2V0cy9zaGlwLWVkaXQuanBnKTtcXG4gIGJhY2tncm91bmQtc2l6ZTogY292ZXI7XFxuICBiYWNrZ3JvdW5kLXBvc2l0aW9uOiBjZW50ZXIgY2VudGVyO1xcbn1cXG5cXG5ib2R5ID4gc2VjdGlvbiB7XFxuICBkaXNwbGF5OiBncmlkO1xcbiAgZ3JpZC10ZW1wbGF0ZTogMWZyIDFmciAxMGZyLyAyZnIgOGZyO1xcbiAgZ2FwOiAwLjNyZW07XFxuICBwYWRkaW5nOiAwLjVyZW0gN3JlbSAwLjVyZW0gMXJlbTtcXG4gIHotaW5kZXg6IDE7XFxufVxcblxcbi5jb25maWctZGlhbG9nIHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgd2lkdGg6IDIwcmVtO1xcbiAgcGFkZGluZzogMXJlbTtcXG4gIGdhcDogMXJlbTtcXG4gIGJhY2tncm91bmQ6IHJnYmEoMzQsIDEwMCwgMTc1LCAwLjgpO1xcbiAgYm9yZGVyOiAwLjJyZW0gc29saWQgcmdiKDE3LCA1MCwgODcpO1xcbiAgYm9yZGVyLXJhZGl1czogMnJlbTtcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gIHRvcDogNTAlO1xcbiAgbGVmdDogNTAlO1xcbiAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoLTUwJSwgLTUwJSk7XFxuICB2aXNpYmlsaXR5OiBoaWRkZW47XFxuICBvcGFjaXR5OiAwO1xcbiAgdHJhbnNpdGlvbjogb3BhY2l0eSAwLjNzIGVhc2UtaW4tb3V0O1xcbiAgei1pbmRleDogMjtcXG59XFxuXFxuLmNvbmZpZy1kaWFsb2cgPiBkaXYge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcXG59XFxuXFxuLmNvbmZpZy1kaWFsb2cgc3BhbiB7XFxuICBhbGlnbi1zZWxmOiBjZW50ZXI7XFxuICBmb250LXdlaWdodDogODAwO1xcbiAgY29sb3I6IHdoaXRlO1xcbiAgYmFja2dyb3VuZDogcmdiYSgyNDgsIDcxLCA0NywgMC44KTtcXG4gIG1hcmdpbi1sZWZ0OiAwLjVyZW07XFxuICBwYWRkaW5nOiAwLjJyZW0gMC4zcmVtIDAuMXJlbSAwLjNyZW07XFxuICBib3JkZXItcmFkaXVzOiAxMHJlbTtcXG4gIGN1cnNvcjogcG9pbnRlcjtcXG59XFxuXFxuLmNvbmZpZy1kaWFsb2cgc3Bhbjpob3ZlciB7XFxuICBiYWNrZ3JvdW5kOiByZ2IoMjQ4LCA3MSwgNDcpO1xcbn1cXG5cXG4uY29uZmlnLWRpYWxvZyBidXR0b24sXFxuLmNvbmZpZy1kaWFsb2cgc2VsZWN0IHtcXG4gIGFsaWduLXNlbGY6IGNlbnRlcjtcXG4gIGZvbnQtc2l6ZTogMS4wNXJlbTtcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG4gIGNvbG9yOiB3aGl0ZTtcXG4gIHdpZHRoOiA3cmVtO1xcbiAgYm9yZGVyLXJhZGl1czogMC41cmVtO1xcbiAgY3Vyc29yOiBwb2ludGVyO1xcbiAgYmFja2dyb3VuZDogcmdiKDE3LCA1MCwgODcpO1xcbn1cXG5cXG4uY29uZmlnLWRpYWxvZyBidXR0b246aG92ZXIsXFxuLmNvbmZpZy1kaWFsb2cgc2VsZWN0OmhvdmVyIHtcXG4gIGJvcmRlcjogMC4xcmVtIHNvbGlkIHdoaXRlO1xcbn1cXG5cXG4uY29uZmlnLWRpYWxvZyBmaWVsZHNldCB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuICBnYXA6IDAuMnJlbTtcXG4gIHBhZGRpbmc6IDAuMnJlbTtcXG4gIGJvcmRlci1yYWRpdXM6IDAuNXJlbTtcXG4gIGJvcmRlci1sZWZ0OiAwLjJyZW0gc29saWQgcmdiKDE3LCA1MCwgODcpO1xcbiAgYm9yZGVyLXJpZ2h0OiAwLjJyZW0gc29saWQgcmdiKDE3LCA1MCwgODcpO1xcbiAgYmFja2dyb3VuZDogcmdiYSgxNywgNTAsIDg3LCAwLjQpO1xcbn1cXG5cXG5maWVsZHNldCA+IGJ1dHRvbiB7XFxuICBoZWlnaHQ6IDEuNXJlbTtcXG59XFxuXFxubGVnZW5kIHtcXG4gIGZvbnQtc2l6ZTogMS4ycmVtO1xcbiAgY29sb3I6IHdoaXRlO1xcbiAgZm9udC13ZWlnaHQ6IDgwMDtcXG4gIHBhZGRpbmctbGVmdDogMC4ycmVtO1xcbiAgY3Vyc29yOiBjb250ZXh0LW1lbnU7XFxufVxcblxcbi5jb25maWctYm94IHtcXG4gIHdpZHRoOiBmaXQtY29udGVudDtcXG59XFxuXFxuLmNvbmZpZy1ib3ggPiBidXR0b24ge1xcbiAgZm9udC1zaXplOiAxLjFyZW07XFxuICBsZXR0ZXItc3BhY2luZzogMC4wNXJlbTtcXG4gIGJvcmRlci1yYWRpdXM6IDAuNXJlbTtcXG4gIGhlaWdodDogMnJlbTtcXG4gIGJhY2tncm91bmQ6IGxpbmVhci1ncmFkaWVudCh0byByaWdodCwgcmdiYSg1LCA2LCA4LCAwLjgpLCByZ2JhKDM5LCAxMTQsIDE5OSwgMC44KSk7XFxuICBvcGFjaXR5OiAwLjg7XFxuICBjdXJzb3I6IHBvaW50ZXI7XFxuICB0cmFuc2l0aW9uOlxcbiAgICBiYWNrZ3JvdW5kIDAuNXMgZWFzZS1vdXQsXFxuICAgIGNvbG9yIDAuNXMgZWFzZS1vdXQsXFxuICAgIHRyYW5zZm9ybSAwLjNzIGVhc2UtaW4tb3V0O1xcbn1cXG5cXG4uY29uZmlnLWJveCA+IGJ1dHRvbjpob3ZlciB7XFxuICBiYWNrZ3JvdW5kOiByZ2IoMzQsIDEwMCwgMTc1KTtcXG4gIGJvcmRlcjogMC4xcmVtIHNvbGlkIHdoaXRlO1xcbiAgdHJhbnNmb3JtOiBzY2FsZSgxLjA1KTtcXG59XFxuXFxuLmNvbmZpZy1ib3ggc3ZnIHtcXG4gIHdpZHRoOiAxLjhyZW07XFxufVxcblxcbi5jb25maWctYm94ID4gYnV0dG9uOmFjdGl2ZSB7XFxuICBiYWNrZ3JvdW5kOiByZ2IoMTcsIDUwLCA4Nyk7XFxufVxcblxcbmgyIHtcXG4gIGdyaWQtcm93OiBzcGFuIDE7XFxuICBncmlkLWNvbHVtbjogMiAvIC0xO1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbiAgZm9udC1zaXplOiAycmVtO1xcbiAgZm9udC13ZWlnaHQ6IDYwMDtcXG4gIHBhZGRpbmc6IDAuMjVyZW0gMXJlbSAwIDFyZW07XFxuICBqdXN0aWZ5LXNlbGY6IGNlbnRlcjtcXG4gIGJhY2tncm91bmQ6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC40KTtcXG4gIGJvcmRlci10b3A6IDAuM3JlbSBzb2xpZCByZ2IoMCwgMCwgMCk7XFxuICBib3JkZXItYm90dG9tOiAwLjNyZW0gc29saWQgcmdiKDAsIDAsIDApO1xcbiAgY3Vyc29yOiBjb250ZXh0LW1lbnU7XFxuICB0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gMC4zcyBlYXNlLWluLW91dDtcXG59XFxuXFxuaDI6aG92ZXIge1xcbiAgYmFja2dyb3VuZDogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjYpO1xcbiAgdHJhbnNmb3JtOiBzY2FsZSgxLjEpO1xcbn1cXG5cXG4uaGVhZCxcXG4udGFpbCB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgYmFja2dyb3VuZDogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjQpO1xcbiAgYm9yZGVyLXJhZGl1czogMXJlbTtcXG4gIGN1cnNvcjogY29udGV4dC1tZW51O1xcbn1cXG5cXG4uaGVhZCB7XFxuICBhbGlnbi1zZWxmOiBmbGV4LWVuZDtcXG4gIGdyaWQtcm93OiAyIC8gMztcXG4gIGdyaWQtY29sdW1uOiAyIC8gMztcXG59XFxuXFxuLnRhaWwge1xcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gIGp1c3RpZnktc2VsZjogZmxleC1lbmQ7XFxuICBncmlkLXJvdzogMyAvIC0xO1xcbn1cXG5cXG4uaGVhZCA+IGRpdixcXG4udGFpbCA+IGRpdiB7XFxuICBmbGV4OiAxIDEgYXV0bztcXG4gIHBhZGRpbmctdG9wOiAwLjVyZW07XFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxuICBmb250LXdlaWdodDogNjAwO1xcbiAgbWluLXdpZHRoOiAycmVtO1xcbiAgbWluLWhlaWdodDogMnJlbTtcXG4gIHRyYW5zaXRpb246IHRyYW5zZm9ybSAwLjFzIGVhc2UtaW47XFxufVxcblxcbi5oZWFkID4gZGl2OmhvdmVyLFxcbi50YWlsID4gZGl2OmhvdmVyIHtcXG4gIGZvbnQtd2VpZ2h0OiA4MDA7XFxuICB0cmFuc2Zvcm06IHNjYWxlKDEuMik7XFxufVxcblxcbi5hZG1pcmFsLWdyb3VuZHMsXFxuLmFpLWdyb3VuZHMge1xcbiAgZ3JpZC1yb3c6IDMgLyAtMTtcXG4gIGdyaWQtY29sdW1uOiAyIC8gLTE7XFxuICBkaXNwbGF5OiBncmlkO1xcbiAgZ3JpZC10ZW1wbGF0ZTogcmVwZWF0KDEwLCAxZnIpIC8gcmVwZWF0KDEwLCAxZnIpO1xcbiAgYm9yZGVyOiAycHggc29saWQgcmdiKDI1NSwgMjU1LCAyNTUpO1xcbiAgYm9yZGVyLXJhZGl1czogMXJlbTtcXG4gIHRyYW5zaXRpb246IHRyYW5zZm9ybSAwLjI1cyBlYXNlLWluLW91dDtcXG59XFxuXFxuLnNjYWxlRGl2cyB7XFxuICB0cmFuc2Zvcm06IHNjYWxlKDEuMDIpO1xcbn1cXG5cXG4uYWRtaXJhbC1ncm91bmRzOmhvdmVyLFxcbi5haS1ncm91bmRzOmhvdmVyIHtcXG4gIHRyYW5zZm9ybTogc2NhbGUoMS4wMik7XFxufVxcblxcbi5hZG1pcmFsLWdyb3VuZHMgPiBkaXYsXFxuLmFpLWdyb3VuZHMgPiBkaXYge1xcbiAgZ3JpZC1jb2x1bW46IHNwYW4gMTtcXG4gIGdyaWQtcm93OiBzcGFuIDE7XFxuICBtaW4td2lkdGg6IDJyZW07XFxuICBtaW4taGVpZ2h0OiAycmVtO1xcblxcbiAgZGlzcGxheTogZmxleDtcXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gIGZvbnQtd2VpZ2h0OiA4MDA7XFxuICBib3JkZXI6IDJweCBzb2xpZCByZ2IoMjU1LCAyNTUsIDI1NSk7XFxuICBjdXJzb3I6IHBvaW50ZXI7XFxuICB0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gMC4ycyBlYXNlLWluLW91dDtcXG59XFxuXFxuLmFkbWlyYWwtZ3JvdW5kcyBzcGFuLFxcbi5haS1ncm91bmRzIHNwYW4ge1xcbiAgZm9udC1zaXplOiAxLjdyZW07XFxufVxcblxcbi5hZG1pcmFsLWdyb3VuZHMgPiBkaXY6aG92ZXIsXFxuLmFpLWdyb3VuZHMgPiBkaXY6aG92ZXIge1xcbiAgdHJhbnNmb3JtOiBzY2FsZSgxLjEpO1xcbn1cXG5cXG4uYWRtaXJhbC1ncm91bmRzID4gZGl2OmZpcnN0LWNoaWxkLFxcbi5haS1ncm91bmRzID4gZGl2OmZpcnN0LWNoaWxkIHtcXG4gIGJvcmRlci10b3AtbGVmdC1yYWRpdXM6IDFyZW07XFxufVxcblxcbi5hZG1pcmFsLWdyb3VuZHMgPiBkaXY6bnRoLWNoaWxkKDEwKSxcXG4uYWktZ3JvdW5kcyA+IGRpdjpudGgtY2hpbGQoMTApIHtcXG4gIGJvcmRlci10b3AtcmlnaHQtcmFkaXVzOiAxcmVtO1xcbn1cXG5cXG4uYWRtaXJhbC1ncm91bmRzID4gZGl2Om50aC1sYXN0LWNoaWxkKDEwKSxcXG4uYWktZ3JvdW5kcyA+IGRpdjpudGgtbGFzdC1jaGlsZCgxMCkge1xcbiAgYm9yZGVyLWJvdHRvbS1sZWZ0LXJhZGl1czogMXJlbTtcXG59XFxuXFxuLmFkbWlyYWwtZ3JvdW5kcyA+IGRpdjpudGgtbGFzdC1jaGlsZCgxKSxcXG4uYWktZ3JvdW5kcyA+IGRpdjpudGgtbGFzdC1jaGlsZCgxKSB7XFxuICBib3JkZXItYm90dG9tLXJpZ2h0LXJhZGl1czogMXJlbTtcXG59XFxuXFxuYm9keSA+IGRpdjpsYXN0LWNoaWxkIHtcXG4gIGdyaWQtY29sdW1uOiAxIC8gLTE7XFxuICBhbGlnbi1zZWxmOiBmbGV4LXN0YXJ0O1xcbiAganVzdGlmeS1zZWxmOiBjZW50ZXI7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcblxcbiAgZm9udC13ZWlnaHQ6IDYwMDtcXG4gIGJvcmRlcjogMC4ycmVtIHNvbGlkIHJnYmEoMjU1LCAyNTUsIDI1NSwgMC44KTtcXG4gIGJvcmRlci1yYWRpdXM6IDFyZW07XFxuICBiYWNrZ3JvdW5kOiByZ2JhKDAsIDAsIDAsIDAuNSk7XFxuICBjb2xvcjogd2hpdGU7XFxuICBoZWlnaHQ6IDNyZW07XFxuICB3aWR0aDogNDByZW07XFxuICBjdXJzb3I6IGNvbnRleHQtbWVudTtcXG4gIHotaW5kZXg6IDE7XFxuICB0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gMC4zcyBlYXNlLWluLW91dDtcXG59XFxuXFxuYm9keSA+IGRpdjpsYXN0LWNoaWxkOmhvdmVyIHtcXG4gIHRyYW5zZm9ybTogc2NhbGUoMS4wNSk7XFxuICBib3JkZXI6IDAuMnJlbSBzb2xpZCByZ2IoMjU1LCAyNTUsIDI1NSk7XFxuICBiYWNrZ3JvdW5kOiByZ2JhKDAsIDAsIDAsIDAuNyk7XFxufVxcblxcbmJvZHkgPiBkaXY6Zmlyc3QtY2hpbGQge1xcbiAgcG9zaXRpb246IGZpeGVkO1xcbiAgdG9wOiAwO1xcbiAgbGVmdDogMDtcXG4gIHdpZHRoOiAxMDAlO1xcbiAgaGVpZ2h0OiAxMDAlO1xcbiAgYmFja2dyb3VuZDogcmdiYSgwLCAwLCAwLCAwLjYpO1xcbn1cXG5cXG4uYWRtaXJhbC1ncm91bmRzIGltZyxcXG4uYWktZ3JvdW5kcyBpbWcge1xcbiAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgbGVmdDogMSU7XFxuICBib3R0b206IDAuNSU7XFxuICBwb2ludGVyLWV2ZW50czogbm9uZTtcXG59XFxuXFxuLmNvbmZpZy1kaWFsb2cgaW1nIHtcXG4gIGFsaWduLXNlbGY6IGZsZXgtZW5kO1xcbiAgYmFja2dyb3VuZDogcmdiYSgxNywgNTAsIDg3LCAwLjgpO1xcbiAgd2lkdGg6IDJyZW07XFxuICBoZWlnaHQ6IDJyZW07XFxuICBwYWRkaW5nOiAwLjJyZW07XFxuICBib3JkZXItcmFkaXVzOiAwLjVyZW07XFxuICBjdXJzb3I6IHBvaW50ZXI7XFxufVxcblxcbi5jb25maWctZGlhbG9nIGltZzpob3ZlciB7XFxuICBib3JkZXI6IDAuMXJlbSBzb2xpZCB3aGl0ZTtcXG4gIGJhY2tncm91bmQ6IGxpbmVhci1ncmFkaWVudCh0byBib3R0b20gcmlnaHQsIHJnYigxNywgNTAsIDg3KSwgcmdiYSgyNTUsIDI1NSwgMCwgMC40KSk7XFxufVxcblxcbnN2ZyB7XFxuICBmaWxsOiB3aGl0ZTtcXG4gIHdpZHRoOiAxLjdyZW07XFxufVxcblxcbkBtZWRpYSAobWF4LXdpZHRoOiAxNTcwcHgpIHtcXG4gIGJvZHkge1xcbiAgICBnYXA6IDZyZW07XFxuICAgIHBhZGRpbmc6IDZyZW0gNnJlbTtcXG4gIH1cXG5cXG4gIGJvZHkgPiBkaXY6bGFzdC1jaGlsZCB7XFxuICAgIHdpZHRoOiAzNXJlbTtcXG4gIH1cXG4gIC5hZG1pcmFsLWdyb3VuZHMsXFxuICAuYWktZ3JvdW5kcyB7XFxuICAgIGFsaWduLXNlbGY6IGZsZXgtc3RhcnQ7XFxuICB9XFxuICAudGFpbCxcXG4gIC5oZWFkIHtcXG4gICAgZm9udC1zaXplOiAxLjFyZW07XFxuICB9XFxuICAudGFpbCB7XFxuICAgIGFsaWduLXNlbGY6IGZsZXgtc3RhcnQ7XFxuICB9XFxuICAuaGVhZCA+IGRpdixcXG4gIC50YWlsID4gZGl2IHtcXG4gICAgcGFkZGluZy10b3A6IDAuMnJlbTtcXG4gIH1cXG59XFxuXFxuQG1lZGlhIChtYXgtd2lkdGg6IDEyNzBweCkge1xcbiAgYm9keSB7XFxuICAgIGdhcDogM3JlbTtcXG4gICAgcGFkZGluZzogOHJlbSA0cmVtO1xcbiAgfVxcblxcbiAgYm9keSA+IGRpdjpsYXN0LWNoaWxkIHtcXG4gICAgd2lkdGg6IDMwcmVtO1xcbiAgICBhbGlnbi1zZWxmOiBjZW50ZXI7XFxuICB9XFxuXFxuICBib2R5ID4gc2VjdGlvbiB7XFxuICAgIHBhZGRpbmc6IDAuNXJlbSA1cmVtIDAuNXJlbSAwLjVyZW07XFxuICB9XFxuXFxuICAuYWRtaXJhbC1ncm91bmRzIHNwYW4sXFxuICAuYWktZ3JvdW5kcyBzcGFuIHtcXG4gICAgZm9udC1zaXplOiAxLjJyZW07XFxuICB9XFxufVxcblxcbkBtZWRpYSAobWF4LXdpZHRoOiAxMTEwcHgpIHtcXG4gIGJvZHkge1xcbiAgICBnYXA6IDFyZW07XFxuICAgIHBhZGRpbmc6IDhyZW0gMXJlbTtcXG4gICAgaGVpZ2h0OiAxMDAlO1xcbiAgfVxcblxcbiAgYm9keSA+IHNlY3Rpb24ge1xcbiAgICBwYWRkaW5nOiAwLjVyZW0gM3JlbSAwLjVyZW0gMC41cmVtO1xcbiAgfVxcblxcbiAgaDIge1xcbiAgICBmb250LXNpemU6IDEuNXJlbTtcXG4gIH1cXG5cXG4gIGJvZHkgPiBkaXY6bGFzdC1jaGlsZCB7XFxuICAgIHdpZHRoOiAyOHJlbTtcXG4gICAgZm9udC1zaXplOiAxcmVtO1xcbiAgfVxcbn1cXG5cXG5AbWVkaWEgKG1heC13aWR0aDogOTAwcHgpIHtcXG4gIGJvZHkge1xcbiAgICBnYXA6IDAuM3JlbTtcXG4gICAgcGFkZGluZzogOHJlbSAwLjJyZW07XFxuICAgIGJhY2tncm91bmQtaW1hZ2U6IHVybCguL2Fzc2V0cy92ZXJ0aWNhbHNoaXAuanBnKTtcXG4gIH1cXG5cXG4gIGJvZHkgPiBzZWN0aW9uIHtcXG4gICAgcGFkZGluZzogMC41cmVtO1xcbiAgfVxcblxcbiAgYm9keSA+IGRpdjpsYXN0LWNoaWxkIHtcXG4gICAgd2lkdGg6IDI1cmVtO1xcbiAgICBhbGlnbi1zZWxmOiBmbGV4LXN0YXJ0O1xcbiAgfVxcblxcbiAgLmNvbmZpZy1kaWFsb2cge1xcbiAgICBiYWNrZ3JvdW5kOiByZ2JhKDQ2LCA0NiwgNDYsIDAuOCk7XFxuICAgIGJvcmRlcjogMC4ycmVtIHNvbGlkIHJnYigxNDMsIDEwOSwgNjEpO1xcbiAgfVxcblxcbiAgLmNvbmZpZy1kaWFsb2cgYnV0dG9uLFxcbiAgLmNvbmZpZy1kaWFsb2cgc2VsZWN0IHtcXG4gICAgYmFja2dyb3VuZDogcmdiKDE0MywgMTA5LCA2MSk7XFxuICB9XFxuXFxuICAuY29uZmlnLWRpYWxvZyBmaWVsZHNldCB7XFxuICAgIGJhY2tncm91bmQ6IHJnYmEoOTUsIDczLCA0MywgMC40KTtcXG4gICAgYm9yZGVyLWxlZnQ6IDAuMnJlbSBzb2xpZCByZ2IoMTQzLCAxMDksIDYxKTtcXG4gICAgYm9yZGVyLXJpZ2h0OiAwLjJyZW0gc29saWQgcmdiKDE0MywgMTA5LCA2MSk7XFxuICB9XFxuXFxuICAuY29uZmlnLWJveCA+IGJ1dHRvbiB7XFxuICAgIHBhZGRpbmc6IDAuMXJlbTtcXG4gICAgYmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KHRvIHJpZ2h0LCByZ2JhKDUsIDYsIDgsIDAuOCksIHJnYmEoMjIxLCAxNjYsIDg4LCAwLjgpKTtcXG4gIH1cXG5cXG4gIC5jb25maWctYm94ID4gYnV0dG9uOmhvdmVyIHtcXG4gICAgYmFja2dyb3VuZDogcmdiKDE4NSwgMTM5LCA3NCk7XFxuICB9XFxuXFxuICAuY29uZmlnLWRpYWxvZyBpbWcge1xcbiAgICBiYWNrZ3JvdW5kOiByZ2JhKDk1LCA3MywgNDMsIDAuNik7XFxuICB9XFxuXFxuICAuY29uZmlnLWRpYWxvZyBpbWc6aG92ZXIge1xcbiAgICBiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQodG8gYm90dG9tIHJpZ2h0LCByZ2IoNDgsIDM3LCAyMiksIHJnYmEoMjU1LCAyNTUsIDAsIDAuNSkpO1xcbiAgfVxcbn1cXG5cXG5AbWVkaWEgKG1heC13aWR0aDogNzY1cHgpIHtcXG4gIGJvZHkge1xcbiAgICBncmlkLXRlbXBsYXRlOiByZXBlYXQoMiwgNGZyKSAxZnIgLyAxZnI7XFxuICAgIHBhZGRpbmc6IDA7XFxuICB9XFxuXFxuICBib2R5ID4gc2VjdGlvbiB7XFxuICAgIGdyaWQtdGVtcGxhdGU6IDFmciAxZnIgMTBmci8gMWZyIDhmcjtcXG4gICAgcGFkZGluZy1yaWdodDogMS41cmVtO1xcbiAgICBoZWlnaHQ6IDI3cmVtO1xcbiAgfVxcbn1cXG5cXG5AbWVkaWEgKG1heC13aWR0aDogNDIwcHgpIHtcXG4gIC5jb25maWctZGlhbG9nIHtcXG4gICAgbGVmdDogNTMlO1xcbiAgfVxcbn1cXG5cXG5AbWVkaWEgKG1heC13aWR0aDogMzkwcHgpIHtcXG4gIC5jb25maWctZGlhbG9nIHtcXG4gICAgbGVmdDogNTclO1xcbiAgfVxcbn1cXG5cXG5AbWVkaWEgKG1heC13aWR0aDogMjkwcHgpIHtcXG4gIC5jb25maWctZGlhbG9nIHtcXG4gICAgbGVmdDogNzglO1xcbiAgfVxcbn1cXG5cIl0sXCJzb3VyY2VSb290XCI6XCJcIn1dKTtcbi8vIEV4cG9ydHNcbmV4cG9ydCBkZWZhdWx0IF9fX0NTU19MT0FERVJfRVhQT1JUX19fO1xuIiwiLy8gSW1wb3J0c1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18gZnJvbSBcIi4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzXCI7XG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fIGZyb20gXCIuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzXCI7XG52YXIgX19fQ1NTX0xPQURFUl9FWFBPUlRfX18gPSBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyk7XG4vLyBNb2R1bGVcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLnB1c2goW21vZHVsZS5pZCwgYCosICo6OmJlZm9yZSwgKjo6YWZ0ZXIge1xuICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG59XG5cbmh0bWwsIGJvZHksIGRpdiwgc3BhbiwgYXBwbGV0LCBvYmplY3QsIGlmcmFtZSwgaDEsIGgyLCBoMywgaDQsIGg1LCBoNiwgcCwgYmxvY2txdW90ZSwgcHJlLCBhLCBhYmJyLCBhY3JvbnltLCBhZGRyZXNzLCBiaWcsIGNpdGUsIGNvZGUsIGRlbCwgZGZuLCBlbSwgaW1nLCBpbnMsIGtiZCwgcSwgcywgc2FtcCwgc21hbGwsIHN0cmlrZSwgc3Ryb25nLCBzdWIsIHN1cCwgdHQsIHZhciwgYiwgdSwgaSwgY2VudGVyLCBkbCwgZHQsIGRkLCBvbCwgdWwsIGxpLCBmaWVsZHNldCwgZm9ybSwgbGFiZWwsIGxlZ2VuZCwgdGFibGUsIGNhcHRpb24sIHRib2R5LCB0Zm9vdCwgdGhlYWQsIHRyLCB0aCwgdGQsIGFydGljbGUsIGFzaWRlLCBjYW52YXMsIGRldGFpbHMsIGVtYmVkLCBmaWd1cmUsIGZpZ2NhcHRpb24sIGZvb3RlciwgaGVhZGVyLCBoZ3JvdXAsIG1lbnUsIG5hdiwgb3V0cHV0LCBydWJ5LCBzZWN0aW9uLCBzdW1tYXJ5LCB0aW1lLCBtYXJrLCBhdWRpbywgdmlkZW8gIHtcbiAgICBtYXJnaW46IDA7XG4gICAgcGFkZGluZzogMDtcbiAgICBib3JkZXI6IDA7XG4gICAgZm9udC1zaXplOiAxMDAlO1xuICAgIGZvbnQ6IGluaGVyaXQ7XG4gICAgdmVydGljYWwtYWxpZ246IGJhc2VsaW5lO1xufVxuXG5ib2R5IHtcbiAgICBmb250LWZhbWlseTogQXJpYWwsIHNhbnMtc2VyaWY7XG4gICAgZm9udC1zaXplOiAxNnB4O1xuICAgIGxpbmUtaGVpZ2h0OiAxLjE7XG59XG5cbmEge1xuICAgIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcbn1cblxub2wsIHVsIHtcblx0bGlzdC1zdHlsZTogbm9uZTtcbn1cblxubWFpbiwgYXJ0aWNsZSwgYXNpZGUsIGRldGFpbHMsIGZpZ2NhcHRpb24sIGZpZ3VyZSwgXG5mb290ZXIsIGhlYWRlciwgaGdyb3VwLCBtZW51LCBuYXYsIHNlY3Rpb24ge1xuXHRkaXNwbGF5OiBibG9jaztcbn1cblxuYmxvY2txdW90ZSwgcSB7XG4gICAgcXVvdGVzOiBub25lO1xufVxuXG50YWJsZSB7XG4gICAgYm9yZGVyLWNvbGxhcHNlOiBjb2xsYXBzZTtcbiAgICBib3JkZXItc3BhY2luZzogMDtcbn1cblxuaW1nIHtcbiAgICBib3JkZXItc3R5bGU6IG5vbmU7XG59XG5cbmJ1dHRvbiwgaW5wdXQge1xuICAgIG92ZXJmbG93OiB2aXNpYmxlO1xufVxuXG5hYmJyW3RpdGxlXSB7XG4gICAgYm9yZGVyLWJvdHRvbTogbm9uZTtcbiAgICB0ZXh0LWRlY29yYXRpb246IHVuZGVybGluZTtcbn1cblxuc3Ryb25nLCBiIHtcbiAgICBmb250LXdlaWdodDogYm9sZGVyO1xufWAsIFwiXCIse1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wid2VicGFjazovLy4vc3JjL3Jlc2V0LmNzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFBQTtJQUNJLHNCQUFzQjtBQUMxQjs7QUFFQTtJQUNJLFNBQVM7SUFDVCxVQUFVO0lBQ1YsU0FBUztJQUNULGVBQWU7SUFDZixhQUFhO0lBQ2Isd0JBQXdCO0FBQzVCOztBQUVBO0lBQ0ksOEJBQThCO0lBQzlCLGVBQWU7SUFDZixnQkFBZ0I7QUFDcEI7O0FBRUE7SUFDSSxxQkFBcUI7SUFDckIsNkJBQTZCO0FBQ2pDOztBQUVBO0NBQ0MsZ0JBQWdCO0FBQ2pCOztBQUVBOztDQUVDLGNBQWM7QUFDZjs7QUFFQTtJQUNJLFlBQVk7QUFDaEI7O0FBRUE7SUFDSSx5QkFBeUI7SUFDekIsaUJBQWlCO0FBQ3JCOztBQUVBO0lBQ0ksa0JBQWtCO0FBQ3RCOztBQUVBO0lBQ0ksaUJBQWlCO0FBQ3JCOztBQUVBO0lBQ0ksbUJBQW1CO0lBQ25CLDBCQUEwQjtBQUM5Qjs7QUFFQTtJQUNJLG1CQUFtQjtBQUN2QlwiLFwic291cmNlc0NvbnRlbnRcIjpbXCIqLCAqOjpiZWZvcmUsICo6OmFmdGVyIHtcXG4gICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcXG59XFxuXFxuaHRtbCwgYm9keSwgZGl2LCBzcGFuLCBhcHBsZXQsIG9iamVjdCwgaWZyYW1lLCBoMSwgaDIsIGgzLCBoNCwgaDUsIGg2LCBwLCBibG9ja3F1b3RlLCBwcmUsIGEsIGFiYnIsIGFjcm9ueW0sIGFkZHJlc3MsIGJpZywgY2l0ZSwgY29kZSwgZGVsLCBkZm4sIGVtLCBpbWcsIGlucywga2JkLCBxLCBzLCBzYW1wLCBzbWFsbCwgc3RyaWtlLCBzdHJvbmcsIHN1Yiwgc3VwLCB0dCwgdmFyLCBiLCB1LCBpLCBjZW50ZXIsIGRsLCBkdCwgZGQsIG9sLCB1bCwgbGksIGZpZWxkc2V0LCBmb3JtLCBsYWJlbCwgbGVnZW5kLCB0YWJsZSwgY2FwdGlvbiwgdGJvZHksIHRmb290LCB0aGVhZCwgdHIsIHRoLCB0ZCwgYXJ0aWNsZSwgYXNpZGUsIGNhbnZhcywgZGV0YWlscywgZW1iZWQsIGZpZ3VyZSwgZmlnY2FwdGlvbiwgZm9vdGVyLCBoZWFkZXIsIGhncm91cCwgbWVudSwgbmF2LCBvdXRwdXQsIHJ1YnksIHNlY3Rpb24sIHN1bW1hcnksIHRpbWUsIG1hcmssIGF1ZGlvLCB2aWRlbyAge1xcbiAgICBtYXJnaW46IDA7XFxuICAgIHBhZGRpbmc6IDA7XFxuICAgIGJvcmRlcjogMDtcXG4gICAgZm9udC1zaXplOiAxMDAlO1xcbiAgICBmb250OiBpbmhlcml0O1xcbiAgICB2ZXJ0aWNhbC1hbGlnbjogYmFzZWxpbmU7XFxufVxcblxcbmJvZHkge1xcbiAgICBmb250LWZhbWlseTogQXJpYWwsIHNhbnMtc2VyaWY7XFxuICAgIGZvbnQtc2l6ZTogMTZweDtcXG4gICAgbGluZS1oZWlnaHQ6IDEuMTtcXG59XFxuXFxuYSB7XFxuICAgIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XFxufVxcblxcbm9sLCB1bCB7XFxuXFx0bGlzdC1zdHlsZTogbm9uZTtcXG59XFxuXFxubWFpbiwgYXJ0aWNsZSwgYXNpZGUsIGRldGFpbHMsIGZpZ2NhcHRpb24sIGZpZ3VyZSwgXFxuZm9vdGVyLCBoZWFkZXIsIGhncm91cCwgbWVudSwgbmF2LCBzZWN0aW9uIHtcXG5cXHRkaXNwbGF5OiBibG9jaztcXG59XFxuXFxuYmxvY2txdW90ZSwgcSB7XFxuICAgIHF1b3Rlczogbm9uZTtcXG59XFxuXFxudGFibGUge1xcbiAgICBib3JkZXItY29sbGFwc2U6IGNvbGxhcHNlO1xcbiAgICBib3JkZXItc3BhY2luZzogMDtcXG59XFxuXFxuaW1nIHtcXG4gICAgYm9yZGVyLXN0eWxlOiBub25lO1xcbn1cXG5cXG5idXR0b24sIGlucHV0IHtcXG4gICAgb3ZlcmZsb3c6IHZpc2libGU7XFxufVxcblxcbmFiYnJbdGl0bGVdIHtcXG4gICAgYm9yZGVyLWJvdHRvbTogbm9uZTtcXG4gICAgdGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmU7XFxufVxcblxcbnN0cm9uZywgYiB7XFxuICAgIGZvbnQtd2VpZ2h0OiBib2xkZXI7XFxufVwiXSxcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuLy8gRXhwb3J0c1xuZXhwb3J0IGRlZmF1bHQgX19fQ1NTX0xPQURFUl9FWFBPUlRfX187XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuLypcbiAgTUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcbiAgQXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxuKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcpIHtcbiAgdmFyIGxpc3QgPSBbXTtcblxuICAvLyByZXR1cm4gdGhlIGxpc3Qgb2YgbW9kdWxlcyBhcyBjc3Mgc3RyaW5nXG4gIGxpc3QudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gdGhpcy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgIHZhciBjb250ZW50ID0gXCJcIjtcbiAgICAgIHZhciBuZWVkTGF5ZXIgPSB0eXBlb2YgaXRlbVs1XSAhPT0gXCJ1bmRlZmluZWRcIjtcbiAgICAgIGlmIChpdGVtWzRdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChpdGVtWzRdLCBcIikge1wiKTtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzJdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIik7XG4gICAgICB9XG4gICAgICBpZiAobmVlZExheWVyKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKTtcbiAgICAgIH1cbiAgICAgIGNvbnRlbnQgKz0gY3NzV2l0aE1hcHBpbmdUb1N0cmluZyhpdGVtKTtcbiAgICAgIGlmIChuZWVkTGF5ZXIpIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzJdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVs0XSkge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgfSkuam9pbihcIlwiKTtcbiAgfTtcblxuICAvLyBpbXBvcnQgYSBsaXN0IG9mIG1vZHVsZXMgaW50byB0aGUgbGlzdFxuICBsaXN0LmkgPSBmdW5jdGlvbiBpKG1vZHVsZXMsIG1lZGlhLCBkZWR1cGUsIHN1cHBvcnRzLCBsYXllcikge1xuICAgIGlmICh0eXBlb2YgbW9kdWxlcyA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgbW9kdWxlcyA9IFtbbnVsbCwgbW9kdWxlcywgdW5kZWZpbmVkXV07XG4gICAgfVxuICAgIHZhciBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzID0ge307XG4gICAgaWYgKGRlZHVwZSkge1xuICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCB0aGlzLmxlbmd0aDsgaysrKSB7XG4gICAgICAgIHZhciBpZCA9IHRoaXNba11bMF07XG4gICAgICAgIGlmIChpZCAhPSBudWxsKSB7XG4gICAgICAgICAgYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpZF0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGZvciAodmFyIF9rID0gMDsgX2sgPCBtb2R1bGVzLmxlbmd0aDsgX2srKykge1xuICAgICAgdmFyIGl0ZW0gPSBbXS5jb25jYXQobW9kdWxlc1tfa10pO1xuICAgICAgaWYgKGRlZHVwZSAmJiBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2l0ZW1bMF1dKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgaWYgKHR5cGVvZiBsYXllciAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICBpZiAodHlwZW9mIGl0ZW1bNV0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICBpdGVtWzVdID0gbGF5ZXI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQGxheWVyXCIuY29uY2F0KGl0ZW1bNV0ubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChpdGVtWzVdKSA6IFwiXCIsIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzVdID0gbGF5ZXI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChtZWRpYSkge1xuICAgICAgICBpZiAoIWl0ZW1bMl0pIHtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQG1lZGlhIFwiLmNvbmNhdChpdGVtWzJdLCBcIiB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVsyXSA9IG1lZGlhO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoc3VwcG9ydHMpIHtcbiAgICAgICAgaWYgKCFpdGVtWzRdKSB7XG4gICAgICAgICAgaXRlbVs0XSA9IFwiXCIuY29uY2F0KHN1cHBvcnRzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChpdGVtWzRdLCBcIikge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bNF0gPSBzdXBwb3J0cztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgbGlzdC5wdXNoKGl0ZW0pO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIGxpc3Q7XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICh1cmwsIG9wdGlvbnMpIHtcbiAgaWYgKCFvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IHt9O1xuICB9XG4gIGlmICghdXJsKSB7XG4gICAgcmV0dXJuIHVybDtcbiAgfVxuICB1cmwgPSBTdHJpbmcodXJsLl9fZXNNb2R1bGUgPyB1cmwuZGVmYXVsdCA6IHVybCk7XG5cbiAgLy8gSWYgdXJsIGlzIGFscmVhZHkgd3JhcHBlZCBpbiBxdW90ZXMsIHJlbW92ZSB0aGVtXG4gIGlmICgvXlsnXCJdLipbJ1wiXSQvLnRlc3QodXJsKSkge1xuICAgIHVybCA9IHVybC5zbGljZSgxLCAtMSk7XG4gIH1cbiAgaWYgKG9wdGlvbnMuaGFzaCkge1xuICAgIHVybCArPSBvcHRpb25zLmhhc2g7XG4gIH1cblxuICAvLyBTaG91bGQgdXJsIGJlIHdyYXBwZWQ/XG4gIC8vIFNlZSBodHRwczovL2RyYWZ0cy5jc3N3Zy5vcmcvY3NzLXZhbHVlcy0zLyN1cmxzXG4gIGlmICgvW1wiJygpIFxcdFxcbl18KCUyMCkvLnRlc3QodXJsKSB8fCBvcHRpb25zLm5lZWRRdW90ZXMpIHtcbiAgICByZXR1cm4gXCJcXFwiXCIuY29uY2F0KHVybC5yZXBsYWNlKC9cIi9nLCAnXFxcXFwiJykucmVwbGFjZSgvXFxuL2csIFwiXFxcXG5cIiksIFwiXFxcIlwiKTtcbiAgfVxuICByZXR1cm4gdXJsO1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXRlbSkge1xuICB2YXIgY29udGVudCA9IGl0ZW1bMV07XG4gIHZhciBjc3NNYXBwaW5nID0gaXRlbVszXTtcbiAgaWYgKCFjc3NNYXBwaW5nKSB7XG4gICAgcmV0dXJuIGNvbnRlbnQ7XG4gIH1cbiAgaWYgKHR5cGVvZiBidG9hID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICB2YXIgYmFzZTY0ID0gYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoY3NzTWFwcGluZykpKSk7XG4gICAgdmFyIGRhdGEgPSBcInNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LFwiLmNvbmNhdChiYXNlNjQpO1xuICAgIHZhciBzb3VyY2VNYXBwaW5nID0gXCIvKiMgXCIuY29uY2F0KGRhdGEsIFwiICovXCIpO1xuICAgIHJldHVybiBbY29udGVudF0uY29uY2F0KFtzb3VyY2VNYXBwaW5nXSkuam9pbihcIlxcblwiKTtcbiAgfVxuICByZXR1cm4gW2NvbnRlbnRdLmpvaW4oXCJcXG5cIik7XG59OyIsIlxuICAgICAgaW1wb3J0IEFQSSBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qc1wiO1xuICAgICAgaW1wb3J0IGRvbUFQSSBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0Rm4gZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzXCI7XG4gICAgICBpbXBvcnQgc2V0QXR0cmlidXRlcyBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydFN0eWxlRWxlbWVudCBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qc1wiO1xuICAgICAgaW1wb3J0IHN0eWxlVGFnVHJhbnNmb3JtRm4gZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qc1wiO1xuICAgICAgaW1wb3J0IGNvbnRlbnQsICogYXMgbmFtZWRFeHBvcnQgZnJvbSBcIiEhLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9iYXR0bGVncm91bmQuY3NzXCI7XG4gICAgICBcbiAgICAgIFxuXG52YXIgb3B0aW9ucyA9IHt9O1xuXG5vcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtID0gc3R5bGVUYWdUcmFuc2Zvcm1Gbjtcbm9wdGlvbnMuc2V0QXR0cmlidXRlcyA9IHNldEF0dHJpYnV0ZXM7XG5cbiAgICAgIG9wdGlvbnMuaW5zZXJ0ID0gaW5zZXJ0Rm4uYmluZChudWxsLCBcImhlYWRcIik7XG4gICAgXG5vcHRpb25zLmRvbUFQSSA9IGRvbUFQSTtcbm9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50ID0gaW5zZXJ0U3R5bGVFbGVtZW50O1xuXG52YXIgdXBkYXRlID0gQVBJKGNvbnRlbnQsIG9wdGlvbnMpO1xuXG5cblxuZXhwb3J0ICogZnJvbSBcIiEhLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9iYXR0bGVncm91bmQuY3NzXCI7XG4gICAgICAgZXhwb3J0IGRlZmF1bHQgY29udGVudCAmJiBjb250ZW50LmxvY2FscyA/IGNvbnRlbnQubG9jYWxzIDogdW5kZWZpbmVkO1xuIiwiXG4gICAgICBpbXBvcnQgQVBJIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzXCI7XG4gICAgICBpbXBvcnQgZG9tQVBJIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRGbiBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanNcIjtcbiAgICAgIGltcG9ydCBzZXRBdHRyaWJ1dGVzIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0U3R5bGVFbGVtZW50IGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzXCI7XG4gICAgICBpbXBvcnQgc3R5bGVUYWdUcmFuc2Zvcm1GbiBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzXCI7XG4gICAgICBpbXBvcnQgY29udGVudCwgKiBhcyBuYW1lZEV4cG9ydCBmcm9tIFwiISEuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL3Jlc2V0LmNzc1wiO1xuICAgICAgXG4gICAgICBcblxudmFyIG9wdGlvbnMgPSB7fTtcblxub3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybSA9IHN0eWxlVGFnVHJhbnNmb3JtRm47XG5vcHRpb25zLnNldEF0dHJpYnV0ZXMgPSBzZXRBdHRyaWJ1dGVzO1xuXG4gICAgICBvcHRpb25zLmluc2VydCA9IGluc2VydEZuLmJpbmQobnVsbCwgXCJoZWFkXCIpO1xuICAgIFxub3B0aW9ucy5kb21BUEkgPSBkb21BUEk7XG5vcHRpb25zLmluc2VydFN0eWxlRWxlbWVudCA9IGluc2VydFN0eWxlRWxlbWVudDtcblxudmFyIHVwZGF0ZSA9IEFQSShjb250ZW50LCBvcHRpb25zKTtcblxuXG5cbmV4cG9ydCAqIGZyb20gXCIhIS4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vcmVzZXQuY3NzXCI7XG4gICAgICAgZXhwb3J0IGRlZmF1bHQgY29udGVudCAmJiBjb250ZW50LmxvY2FscyA/IGNvbnRlbnQubG9jYWxzIDogdW5kZWZpbmVkO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBzdHlsZXNJbkRPTSA9IFtdO1xuZnVuY3Rpb24gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcikge1xuICB2YXIgcmVzdWx0ID0gLTE7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3R5bGVzSW5ET00ubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoc3R5bGVzSW5ET01baV0uaWRlbnRpZmllciA9PT0gaWRlbnRpZmllcikge1xuICAgICAgcmVzdWx0ID0gaTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuZnVuY3Rpb24gbW9kdWxlc1RvRG9tKGxpc3QsIG9wdGlvbnMpIHtcbiAgdmFyIGlkQ291bnRNYXAgPSB7fTtcbiAgdmFyIGlkZW50aWZpZXJzID0gW107XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgIHZhciBpdGVtID0gbGlzdFtpXTtcbiAgICB2YXIgaWQgPSBvcHRpb25zLmJhc2UgPyBpdGVtWzBdICsgb3B0aW9ucy5iYXNlIDogaXRlbVswXTtcbiAgICB2YXIgY291bnQgPSBpZENvdW50TWFwW2lkXSB8fCAwO1xuICAgIHZhciBpZGVudGlmaWVyID0gXCJcIi5jb25jYXQoaWQsIFwiIFwiKS5jb25jYXQoY291bnQpO1xuICAgIGlkQ291bnRNYXBbaWRdID0gY291bnQgKyAxO1xuICAgIHZhciBpbmRleEJ5SWRlbnRpZmllciA9IGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xuICAgIHZhciBvYmogPSB7XG4gICAgICBjc3M6IGl0ZW1bMV0sXG4gICAgICBtZWRpYTogaXRlbVsyXSxcbiAgICAgIHNvdXJjZU1hcDogaXRlbVszXSxcbiAgICAgIHN1cHBvcnRzOiBpdGVtWzRdLFxuICAgICAgbGF5ZXI6IGl0ZW1bNV1cbiAgICB9O1xuICAgIGlmIChpbmRleEJ5SWRlbnRpZmllciAhPT0gLTEpIHtcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4QnlJZGVudGlmaWVyXS5yZWZlcmVuY2VzKys7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleEJ5SWRlbnRpZmllcl0udXBkYXRlcihvYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgdXBkYXRlciA9IGFkZEVsZW1lbnRTdHlsZShvYmosIG9wdGlvbnMpO1xuICAgICAgb3B0aW9ucy5ieUluZGV4ID0gaTtcbiAgICAgIHN0eWxlc0luRE9NLnNwbGljZShpLCAwLCB7XG4gICAgICAgIGlkZW50aWZpZXI6IGlkZW50aWZpZXIsXG4gICAgICAgIHVwZGF0ZXI6IHVwZGF0ZXIsXG4gICAgICAgIHJlZmVyZW5jZXM6IDFcbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZGVudGlmaWVycy5wdXNoKGlkZW50aWZpZXIpO1xuICB9XG4gIHJldHVybiBpZGVudGlmaWVycztcbn1cbmZ1bmN0aW9uIGFkZEVsZW1lbnRTdHlsZShvYmosIG9wdGlvbnMpIHtcbiAgdmFyIGFwaSA9IG9wdGlvbnMuZG9tQVBJKG9wdGlvbnMpO1xuICBhcGkudXBkYXRlKG9iaik7XG4gIHZhciB1cGRhdGVyID0gZnVuY3Rpb24gdXBkYXRlcihuZXdPYmopIHtcbiAgICBpZiAobmV3T2JqKSB7XG4gICAgICBpZiAobmV3T2JqLmNzcyA9PT0gb2JqLmNzcyAmJiBuZXdPYmoubWVkaWEgPT09IG9iai5tZWRpYSAmJiBuZXdPYmouc291cmNlTWFwID09PSBvYmouc291cmNlTWFwICYmIG5ld09iai5zdXBwb3J0cyA9PT0gb2JqLnN1cHBvcnRzICYmIG5ld09iai5sYXllciA9PT0gb2JqLmxheWVyKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGFwaS51cGRhdGUob2JqID0gbmV3T2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXBpLnJlbW92ZSgpO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIHVwZGF0ZXI7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChsaXN0LCBvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICBsaXN0ID0gbGlzdCB8fCBbXTtcbiAgdmFyIGxhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKTtcbiAgcmV0dXJuIGZ1bmN0aW9uIHVwZGF0ZShuZXdMaXN0KSB7XG4gICAgbmV3TGlzdCA9IG5ld0xpc3QgfHwgW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBpZGVudGlmaWVyID0gbGFzdElkZW50aWZpZXJzW2ldO1xuICAgICAgdmFyIGluZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcik7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleF0ucmVmZXJlbmNlcy0tO1xuICAgIH1cbiAgICB2YXIgbmV3TGFzdElkZW50aWZpZXJzID0gbW9kdWxlc1RvRG9tKG5ld0xpc3QsIG9wdGlvbnMpO1xuICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICB2YXIgX2lkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbX2ldO1xuICAgICAgdmFyIF9pbmRleCA9IGdldEluZGV4QnlJZGVudGlmaWVyKF9pZGVudGlmaWVyKTtcbiAgICAgIGlmIChzdHlsZXNJbkRPTVtfaW5kZXhdLnJlZmVyZW5jZXMgPT09IDApIHtcbiAgICAgICAgc3R5bGVzSW5ET01bX2luZGV4XS51cGRhdGVyKCk7XG4gICAgICAgIHN0eWxlc0luRE9NLnNwbGljZShfaW5kZXgsIDEpO1xuICAgICAgfVxuICAgIH1cbiAgICBsYXN0SWRlbnRpZmllcnMgPSBuZXdMYXN0SWRlbnRpZmllcnM7XG4gIH07XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgbWVtbyA9IHt9O1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGdldFRhcmdldCh0YXJnZXQpIHtcbiAgaWYgKHR5cGVvZiBtZW1vW3RhcmdldF0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICB2YXIgc3R5bGVUYXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRhcmdldCk7XG5cbiAgICAvLyBTcGVjaWFsIGNhc2UgdG8gcmV0dXJuIGhlYWQgb2YgaWZyYW1lIGluc3RlYWQgb2YgaWZyYW1lIGl0c2VsZlxuICAgIGlmICh3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQgJiYgc3R5bGVUYXJnZXQgaW5zdGFuY2VvZiB3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIFRoaXMgd2lsbCB0aHJvdyBhbiBleGNlcHRpb24gaWYgYWNjZXNzIHRvIGlmcmFtZSBpcyBibG9ja2VkXG4gICAgICAgIC8vIGR1ZSB0byBjcm9zcy1vcmlnaW4gcmVzdHJpY3Rpb25zXG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gc3R5bGVUYXJnZXQuY29udGVudERvY3VtZW50LmhlYWQ7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIGlzdGFuYnVsIGlnbm9yZSBuZXh0XG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gICAgbWVtb1t0YXJnZXRdID0gc3R5bGVUYXJnZXQ7XG4gIH1cbiAgcmV0dXJuIG1lbW9bdGFyZ2V0XTtcbn1cblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBpbnNlcnRCeVNlbGVjdG9yKGluc2VydCwgc3R5bGUpIHtcbiAgdmFyIHRhcmdldCA9IGdldFRhcmdldChpbnNlcnQpO1xuICBpZiAoIXRhcmdldCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIkNvdWxkbid0IGZpbmQgYSBzdHlsZSB0YXJnZXQuIFRoaXMgcHJvYmFibHkgbWVhbnMgdGhhdCB0aGUgdmFsdWUgZm9yIHRoZSAnaW5zZXJ0JyBwYXJhbWV0ZXIgaXMgaW52YWxpZC5cIik7XG4gIH1cbiAgdGFyZ2V0LmFwcGVuZENoaWxkKHN0eWxlKTtcbn1cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0QnlTZWxlY3RvcjsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucykge1xuICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKTtcbiAgb3B0aW9ucy5zZXRBdHRyaWJ1dGVzKGVsZW1lbnQsIG9wdGlvbnMuYXR0cmlidXRlcyk7XG4gIG9wdGlvbnMuaW5zZXJ0KGVsZW1lbnQsIG9wdGlvbnMub3B0aW9ucyk7XG4gIHJldHVybiBlbGVtZW50O1xufVxubW9kdWxlLmV4cG9ydHMgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzKHN0eWxlRWxlbWVudCkge1xuICB2YXIgbm9uY2UgPSB0eXBlb2YgX193ZWJwYWNrX25vbmNlX18gIT09IFwidW5kZWZpbmVkXCIgPyBfX3dlYnBhY2tfbm9uY2VfXyA6IG51bGw7XG4gIGlmIChub25jZSkge1xuICAgIHN0eWxlRWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJub25jZVwiLCBub25jZSk7XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGFwcGx5KHN0eWxlRWxlbWVudCwgb3B0aW9ucywgb2JqKSB7XG4gIHZhciBjc3MgPSBcIlwiO1xuICBpZiAob2JqLnN1cHBvcnRzKSB7XG4gICAgY3NzICs9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQob2JqLnN1cHBvcnRzLCBcIikge1wiKTtcbiAgfVxuICBpZiAob2JqLm1lZGlhKSB7XG4gICAgY3NzICs9IFwiQG1lZGlhIFwiLmNvbmNhdChvYmoubWVkaWEsIFwiIHtcIik7XG4gIH1cbiAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBvYmoubGF5ZXIgIT09IFwidW5kZWZpbmVkXCI7XG4gIGlmIChuZWVkTGF5ZXIpIHtcbiAgICBjc3MgKz0gXCJAbGF5ZXJcIi5jb25jYXQob2JqLmxheWVyLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQob2JqLmxheWVyKSA6IFwiXCIsIFwiIHtcIik7XG4gIH1cbiAgY3NzICs9IG9iai5jc3M7XG4gIGlmIChuZWVkTGF5ZXIpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgaWYgKG9iai5tZWRpYSkge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICBpZiAob2JqLnN1cHBvcnRzKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIHZhciBzb3VyY2VNYXAgPSBvYmouc291cmNlTWFwO1xuICBpZiAoc291cmNlTWFwICYmIHR5cGVvZiBidG9hICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgY3NzICs9IFwiXFxuLyojIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxcIi5jb25jYXQoYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoc291cmNlTWFwKSkpKSwgXCIgKi9cIik7XG4gIH1cblxuICAvLyBGb3Igb2xkIElFXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAgKi9cbiAgb3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybShjc3MsIHN0eWxlRWxlbWVudCwgb3B0aW9ucy5vcHRpb25zKTtcbn1cbmZ1bmN0aW9uIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpIHtcbiAgLy8gaXN0YW5idWwgaWdub3JlIGlmXG4gIGlmIChzdHlsZUVsZW1lbnQucGFyZW50Tm9kZSA9PT0gbnVsbCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBzdHlsZUVsZW1lbnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQpO1xufVxuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGRvbUFQSShvcHRpb25zKSB7XG4gIGlmICh0eXBlb2YgZG9jdW1lbnQgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUoKSB7fSxcbiAgICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge31cbiAgICB9O1xuICB9XG4gIHZhciBzdHlsZUVsZW1lbnQgPSBvcHRpb25zLmluc2VydFN0eWxlRWxlbWVudChvcHRpb25zKTtcbiAgcmV0dXJuIHtcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShvYmopIHtcbiAgICAgIGFwcGx5KHN0eWxlRWxlbWVudCwgb3B0aW9ucywgb2JqKTtcbiAgICB9LFxuICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge1xuICAgICAgcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCk7XG4gICAgfVxuICB9O1xufVxubW9kdWxlLmV4cG9ydHMgPSBkb21BUEk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gc3R5bGVUYWdUcmFuc2Zvcm0oY3NzLCBzdHlsZUVsZW1lbnQpIHtcbiAgaWYgKHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0KSB7XG4gICAgc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzcztcbiAgfSBlbHNlIHtcbiAgICB3aGlsZSAoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpIHtcbiAgICAgIHN0eWxlRWxlbWVudC5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCk7XG4gICAgfVxuICAgIHN0eWxlRWxlbWVudC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpKTtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBzdHlsZVRhZ1RyYW5zZm9ybTsiLCJ2YXIgbWFwID0ge1xuXHRcIi4vYWRtaXJhbC1lZGl0LmpwZ1wiOiBcIi4vc3JjL2Fzc2V0cy9hZG1pcmFsLWVkaXQuanBnXCIsXG5cdFwiLi9iYXR0bGVzaGlwLnBuZ1wiOiBcIi4vc3JjL2Fzc2V0cy9iYXR0bGVzaGlwLnBuZ1wiLFxuXHRcIi4vY2Fycmllci5wbmdcIjogXCIuL3NyYy9hc3NldHMvY2Fycmllci5wbmdcIixcblx0XCIuL2NhcnJpZXIyLnBuZ1wiOiBcIi4vc3JjL2Fzc2V0cy9jYXJyaWVyMi5wbmdcIixcblx0XCIuL2Rlc3Ryb3llci5wbmdcIjogXCIuL3NyYy9hc3NldHMvZGVzdHJveWVyLnBuZ1wiLFxuXHRcIi4vbGFtcC5wbmdcIjogXCIuL3NyYy9hc3NldHMvbGFtcC5wbmdcIixcblx0XCIuL3BhdHJvbC1ib2F0LnBuZ1wiOiBcIi4vc3JjL2Fzc2V0cy9wYXRyb2wtYm9hdC5wbmdcIixcblx0XCIuL3NoaXAtZWRpdC5qcGdcIjogXCIuL3NyYy9hc3NldHMvc2hpcC1lZGl0LmpwZ1wiLFxuXHRcIi4vc3VibWFyaW5lLnBuZ1wiOiBcIi4vc3JjL2Fzc2V0cy9zdWJtYXJpbmUucG5nXCIsXG5cdFwiLi92ZXJ0aWNhbHNoaXAuanBnXCI6IFwiLi9zcmMvYXNzZXRzL3ZlcnRpY2Fsc2hpcC5qcGdcIlxufTtcblxuXG5mdW5jdGlvbiB3ZWJwYWNrQ29udGV4dChyZXEpIHtcblx0dmFyIGlkID0gd2VicGFja0NvbnRleHRSZXNvbHZlKHJlcSk7XG5cdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKGlkKTtcbn1cbmZ1bmN0aW9uIHdlYnBhY2tDb250ZXh0UmVzb2x2ZShyZXEpIHtcblx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhtYXAsIHJlcSkpIHtcblx0XHR2YXIgZSA9IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIgKyByZXEgKyBcIidcIik7XG5cdFx0ZS5jb2RlID0gJ01PRFVMRV9OT1RfRk9VTkQnO1xuXHRcdHRocm93IGU7XG5cdH1cblx0cmV0dXJuIG1hcFtyZXFdO1xufVxud2VicGFja0NvbnRleHQua2V5cyA9IGZ1bmN0aW9uIHdlYnBhY2tDb250ZXh0S2V5cygpIHtcblx0cmV0dXJuIE9iamVjdC5rZXlzKG1hcCk7XG59O1xud2VicGFja0NvbnRleHQucmVzb2x2ZSA9IHdlYnBhY2tDb250ZXh0UmVzb2x2ZTtcbm1vZHVsZS5leHBvcnRzID0gd2VicGFja0NvbnRleHQ7XG53ZWJwYWNrQ29udGV4dC5pZCA9IFwiLi9zcmMvYXNzZXRzIHN5bmMgXFxcXC4ocG5nJTdDanBlP2clN0NzdmcpJFwiOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0aWQ6IG1vZHVsZUlkLFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4vLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuX193ZWJwYWNrX3JlcXVpcmVfXy5tID0gX193ZWJwYWNrX21vZHVsZXNfXztcblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmcgPSAoZnVuY3Rpb24oKSB7XG5cdGlmICh0eXBlb2YgZ2xvYmFsVGhpcyA9PT0gJ29iamVjdCcpIHJldHVybiBnbG9iYWxUaGlzO1xuXHR0cnkge1xuXHRcdHJldHVybiB0aGlzIHx8IG5ldyBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0aWYgKHR5cGVvZiB3aW5kb3cgPT09ICdvYmplY3QnKSByZXR1cm4gd2luZG93O1xuXHR9XG59KSgpOyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJ2YXIgc2NyaXB0VXJsO1xuaWYgKF9fd2VicGFja19yZXF1aXJlX18uZy5pbXBvcnRTY3JpcHRzKSBzY3JpcHRVcmwgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLmcubG9jYXRpb24gKyBcIlwiO1xudmFyIGRvY3VtZW50ID0gX193ZWJwYWNrX3JlcXVpcmVfXy5nLmRvY3VtZW50O1xuaWYgKCFzY3JpcHRVcmwgJiYgZG9jdW1lbnQpIHtcblx0aWYgKGRvY3VtZW50LmN1cnJlbnRTY3JpcHQpXG5cdFx0c2NyaXB0VXJsID0gZG9jdW1lbnQuY3VycmVudFNjcmlwdC5zcmM7XG5cdGlmICghc2NyaXB0VXJsKSB7XG5cdFx0dmFyIHNjcmlwdHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcInNjcmlwdFwiKTtcblx0XHRpZihzY3JpcHRzLmxlbmd0aCkge1xuXHRcdFx0dmFyIGkgPSBzY3JpcHRzLmxlbmd0aCAtIDE7XG5cdFx0XHR3aGlsZSAoaSA+IC0xICYmICFzY3JpcHRVcmwpIHNjcmlwdFVybCA9IHNjcmlwdHNbaS0tXS5zcmM7XG5cdFx0fVxuXHR9XG59XG4vLyBXaGVuIHN1cHBvcnRpbmcgYnJvd3NlcnMgd2hlcmUgYW4gYXV0b21hdGljIHB1YmxpY1BhdGggaXMgbm90IHN1cHBvcnRlZCB5b3UgbXVzdCBzcGVjaWZ5IGFuIG91dHB1dC5wdWJsaWNQYXRoIG1hbnVhbGx5IHZpYSBjb25maWd1cmF0aW9uXG4vLyBvciBwYXNzIGFuIGVtcHR5IHN0cmluZyAoXCJcIikgYW5kIHNldCB0aGUgX193ZWJwYWNrX3B1YmxpY19wYXRoX18gdmFyaWFibGUgZnJvbSB5b3VyIGNvZGUgdG8gdXNlIHlvdXIgb3duIGxvZ2ljLlxuaWYgKCFzY3JpcHRVcmwpIHRocm93IG5ldyBFcnJvcihcIkF1dG9tYXRpYyBwdWJsaWNQYXRoIGlzIG5vdCBzdXBwb3J0ZWQgaW4gdGhpcyBicm93c2VyXCIpO1xuc2NyaXB0VXJsID0gc2NyaXB0VXJsLnJlcGxhY2UoLyMuKiQvLCBcIlwiKS5yZXBsYWNlKC9cXD8uKiQvLCBcIlwiKS5yZXBsYWNlKC9cXC9bXlxcL10rJC8sIFwiL1wiKTtcbl9fd2VicGFja19yZXF1aXJlX18ucCA9IHNjcmlwdFVybDsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmIgPSBkb2N1bWVudC5iYXNlVVJJIHx8IHNlbGYubG9jYXRpb24uaHJlZjtcblxuLy8gb2JqZWN0IHRvIHN0b3JlIGxvYWRlZCBhbmQgbG9hZGluZyBjaHVua3Ncbi8vIHVuZGVmaW5lZCA9IGNodW5rIG5vdCBsb2FkZWQsIG51bGwgPSBjaHVuayBwcmVsb2FkZWQvcHJlZmV0Y2hlZFxuLy8gW3Jlc29sdmUsIHJlamVjdCwgUHJvbWlzZV0gPSBjaHVuayBsb2FkaW5nLCAwID0gY2h1bmsgbG9hZGVkXG52YXIgaW5zdGFsbGVkQ2h1bmtzID0ge1xuXHRcImJhdHRsZWdyb3VuZFwiOiAwXG59O1xuXG4vLyBubyBjaHVuayBvbiBkZW1hbmQgbG9hZGluZ1xuXG4vLyBubyBwcmVmZXRjaGluZ1xuXG4vLyBubyBwcmVsb2FkZWRcblxuLy8gbm8gSE1SXG5cbi8vIG5vIEhNUiBtYW5pZmVzdFxuXG4vLyBubyBvbiBjaHVua3MgbG9hZGVkXG5cbi8vIG5vIGpzb25wIGZ1bmN0aW9uIiwiX193ZWJwYWNrX3JlcXVpcmVfXy5uYyA9IHVuZGVmaW5lZDsiLCJpbXBvcnQgXCIuL3Jlc2V0LmNzc1wiO1xuaW1wb3J0IFwiLi9iYXR0bGVncm91bmQuY3NzXCI7XG5pbXBvcnQgeyBQbGF5ZXIgfSBmcm9tIFwiLi9sb2dpY1wiO1xuXG5jb25zdCBpbXBvcnRBbGxBc3NldHMgPSAoZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBpbXBvcnRBbGwocikge1xuICAgIHJldHVybiByLmtleXMoKS5tYXAocik7XG4gIH1cblxuICBjb25zdCBhc3NldHMgPSBpbXBvcnRBbGwocmVxdWlyZS5jb250ZXh0KFwiLi9hc3NldHNcIiwgZmFsc2UsIC9cXC4ocG5nfGpwZT9nfHN2ZykkLykpO1xufSkoKTtcblxuY29uc3QgZ2V0Tm9kZXMgPSAoZnVuY3Rpb24gKCkge1xuICBjb25zdCBhZG1pcmFsSGVhZERpdnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFxuICAgIFwiYm9keSA+IHNlY3Rpb246bnRoLWNoaWxkKDMpIC5oZWFkID4gZGl2XCIsXG4gICk7XG4gIGNvbnN0IGFkbWlyYWxUYWlsRGl2cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXG4gICAgXCJib2R5ID4gc2VjdGlvbjpudGgtY2hpbGQoMykgLnRhaWwgPiBkaXZcIixcbiAgKTtcbiAgY29uc3QgYWlIZWFkRGl2cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJib2R5ID4gc2VjdGlvbjpudGgtY2hpbGQoNCkgLmhlYWQgPiBkaXZcIik7XG4gIGNvbnN0IGFpVGFpbERpdnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiYm9keSA+IHNlY3Rpb246bnRoLWNoaWxkKDQpIC50YWlsID4gZGl2XCIpO1xuICBjb25zdCBhZG1pcmFsR3JvdW5kc0RpdnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmFkbWlyYWwtZ3JvdW5kcyA+IGRpdlwiKTtcbiAgY29uc3QgYWlHcm91bmRzRGl2cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuYWktZ3JvdW5kcyA+IGRpdlwiKTtcbiAgY29uc3QgaGVhZGVycyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJoMlwiKTtcbiAgY29uc3QgYWRtaXJhbEdyb3VuZHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmFkbWlyYWwtZ3JvdW5kc1wiKTtcbiAgY29uc3QgYWlHcm91bmRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5haS1ncm91bmRzXCIpO1xuICBjb25zdCBhZG1pcmFsTmFtZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuYWRtaXJhbC1uYW1lXCIpO1xuICBjb25zdCBmZWVkYmFjayA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJib2R5ID4gZGl2Omxhc3QtY2hpbGRcIik7XG4gIGNvbnN0IGNvbmZpZ0J1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY29uZmlnLWJveCA+IGJ1dHRvblwiKTtcbiAgY29uc3QgY29uZmlnRGlhbG9nID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5jb25maWctZGlhbG9nXCIpO1xuICBjb25zdCBjb25maWdCdXR0b25JY29uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5jb25maWctYm94IHN2Z1wiKTtcbiAgY29uc3QgY292ZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiYm9keSA+IGRpdjpmaXJzdC1jaGlsZFwiKTtcbiAgY29uc3QgY2xvc2VEaWFsb2cgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmNvbmZpZy1kaWFsb2cgc3BhblwiKTtcbiAgY29uc3Qga2lja1N0YXJ0QnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5raWNrLXN0YXJ0XCIpO1xuICBjb25zdCBzaHVmZmxlQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5zaHVmZmxlXCIpO1xuICBjb25zdCBwZWVrQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wZWVrXCIpO1xuICBjb25zdCByZWFsaWduQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5yZWFsaWduXCIpO1xuICBjb25zdCBhbGlnbmVkQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5hbGlnbmVkXCIpO1xuICBjb25zdCBkaWZmaWN1bHR5T3B0aW9ucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjZGlmZmljdWx0eVwiKTtcbiAgY29uc3QgZGltZW5zaW9uT3B0aW9ucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjZGltZW5zaW9uXCIpO1xuXG4gIHJldHVybiB7XG4gICAgYWRtaXJhbEhlYWREaXZzLFxuICAgIGFkbWlyYWxUYWlsRGl2cyxcbiAgICBhaUhlYWREaXZzLFxuICAgIGFpVGFpbERpdnMsXG4gICAgYWRtaXJhbEdyb3VuZHNEaXZzLFxuICAgIGFpR3JvdW5kc0RpdnMsXG4gICAgaGVhZGVycyxcbiAgICBhZG1pcmFsR3JvdW5kcyxcbiAgICBhaUdyb3VuZHMsXG4gICAgYWRtaXJhbE5hbWUsXG4gICAgZmVlZGJhY2ssXG4gICAgY29uZmlnQnV0dG9uLFxuICAgIGNvbmZpZ0RpYWxvZyxcbiAgICBjb3ZlcixcbiAgICBjbG9zZURpYWxvZyxcbiAgICBraWNrU3RhcnRCdXR0b24sXG4gICAgc2h1ZmZsZUJ1dHRvbixcbiAgICBwZWVrQnV0dG9uLFxuICAgIGRpZmZpY3VsdHlPcHRpb25zLFxuICAgIGRpbWVuc2lvbk9wdGlvbnMsXG4gICAgcmVhbGlnbkJ1dHRvbixcbiAgICBhbGlnbmVkQnV0dG9uLFxuICAgIGNvbmZpZ0J1dHRvbkljb24sXG4gIH07XG59KSgpO1xuXG5jb25zdCBkaXNwbGF5SGVhZEFuZFRhaWxIb3ZlcmluZ0VmZmVjdCA9IChmdW5jdGlvbiAoKSB7XG4gIGNvbnN0IGFkZEhvdmVyVG9IZWFkID0gZnVuY3Rpb24gKGhlYWREaXZzLCBncm91bmREaXZzKSB7XG4gICAgaGVhZERpdnMuZm9yRWFjaCgoZGl2LCBpbmRleCkgPT4ge1xuICAgICAgZGl2LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW92ZXJcIiwgKCkgPT4ge1xuICAgICAgICBmb3IgKGxldCBtID0gMDsgbSA8IDEwOyBtKyspIHtcbiAgICAgICAgICBncm91bmREaXZzWzEwICogbSArIGluZGV4XS5zdHlsZS5ib3JkZXIgPSBcIjJweCBzb2xpZCByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuNClcIjtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBkaXYuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlb3V0XCIsICgpID0+IHtcbiAgICAgICAgZm9yIChsZXQgbSA9IDA7IG0gPCAxMDsgbSsrKSB7XG4gICAgICAgICAgZ3JvdW5kRGl2c1sxMCAqIG0gKyBpbmRleF0uc3R5bGUuYm9yZGVyID0gXCIycHggc29saWQgcmdiKDI1NSwgMjU1LCAyNTUpXCI7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9O1xuXG4gIGNvbnN0IGFkZEhvdmVyVG9UYWlsID0gZnVuY3Rpb24gKHRhaWxEaXZzLCBncm91bmREaXZzKSB7XG4gICAgdGFpbERpdnMuZm9yRWFjaCgoZGl2LCBpbmRleCkgPT4ge1xuICAgICAgZGl2LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW92ZXJcIiwgKCkgPT4ge1xuICAgICAgICBmb3IgKGxldCBuID0gMDsgbiA8IDEwOyBuKyspIHtcbiAgICAgICAgICBncm91bmREaXZzW24gKyBpbmRleCAqIDEwXS5zdHlsZS5ib3JkZXIgPSBcIjJweCBzb2xpZCByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuNClcIjtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBkaXYuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlb3V0XCIsICgpID0+IHtcbiAgICAgICAgZm9yIChsZXQgbiA9IDA7IG4gPCAxMDsgbisrKSB7XG4gICAgICAgICAgZ3JvdW5kRGl2c1tuICsgaW5kZXggKiAxMF0uc3R5bGUuYm9yZGVyID0gXCIycHggc29saWQgcmdiKDI1NSwgMjU1LCAyNTUpXCI7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9O1xuXG4gIGFkZEhvdmVyVG9IZWFkKGdldE5vZGVzLmFkbWlyYWxIZWFkRGl2cywgZ2V0Tm9kZXMuYWRtaXJhbEdyb3VuZHNEaXZzKTtcbiAgYWRkSG92ZXJUb1RhaWwoZ2V0Tm9kZXMuYWRtaXJhbFRhaWxEaXZzLCBnZXROb2Rlcy5hZG1pcmFsR3JvdW5kc0RpdnMpO1xuICBhZGRIb3ZlclRvSGVhZChnZXROb2Rlcy5haUhlYWREaXZzLCBnZXROb2Rlcy5haUdyb3VuZHNEaXZzKTtcbiAgYWRkSG92ZXJUb1RhaWwoZ2V0Tm9kZXMuYWlUYWlsRGl2cywgZ2V0Tm9kZXMuYWlHcm91bmRzRGl2cyk7XG5cbiAgY29uc3QgYWRkSG92ZXJUb0hlYWRlcnMgPSBmdW5jdGlvbiAoaGVhZGVyLCBncm91bmRzKSB7XG4gICAgaGVhZGVyLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW92ZXJcIiwgKCkgPT4ge1xuICAgICAgZ3JvdW5kcy5jbGFzc0xpc3QuYWRkKFwic2NhbGVEaXZzXCIpO1xuICAgIH0pO1xuICAgIGhlYWRlci5hZGRFdmVudExpc3RlbmVyKFwibW91c2VvdXRcIiwgKCkgPT4ge1xuICAgICAgZ3JvdW5kcy5jbGFzc0xpc3QucmVtb3ZlKFwic2NhbGVEaXZzXCIpO1xuICAgIH0pO1xuICB9O1xuXG4gIGFkZEhvdmVyVG9IZWFkZXJzKGdldE5vZGVzLmhlYWRlcnNbMF0sIGdldE5vZGVzLmFkbWlyYWxHcm91bmRzKTtcbiAgYWRkSG92ZXJUb0hlYWRlcnMoZ2V0Tm9kZXMuaGVhZGVyc1sxXSwgZ2V0Tm9kZXMuYWlHcm91bmRzKTtcbn0pKCk7XG5cbmNvbnN0IHJldHJpZXZlQWRtaXJhbE5hbWVGcm9tU3RvcmFnZUFuZFNldCA9IChmdW5jdGlvbiAoKSB7XG4gIGNvbnN0IGFkbWlyYWxOYW1lID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJhZG1pcmFsTmFtZVwiKTtcbiAgaWYgKGFkbWlyYWxOYW1lKSB7XG4gICAgZ2V0Tm9kZXMuYWRtaXJhbE5hbWUudGV4dENvbnRlbnQgPSBcIuKakyBcIiArIGFkbWlyYWxOYW1lO1xuICAgIHJldHVybiB7IGFkbWlyYWxOYW1lIH07XG4gIH1cbn0pKCk7XG5cbmNvbnN0IHBvcHVsYXRlQm9hcmRzID0gKGZ1bmN0aW9uICgpIHtcbiAgY29uc3QgZ2FtZSA9IG5ldyBQbGF5ZXIoKTtcbiAgY29uc3QgdXNlckJvYXJkID0gZ2FtZS51c2VyLmJvYXJkLmZsYXQoKTtcbiAgY29uc3QgY29tcHV0ZXJCb2FyZCA9IGdhbWUuY29tcHV0ZXIuYm9hcmQuZmxhdCgpO1xuXG4gIGNvbnN0IGdldFJhbmRvbUNvbG9yID0gZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IHJlZCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqICgyNTcgLSAxMDApICsgNTApO1xuICAgIGNvbnN0IGdyZWVuID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKDI1NyAtIDEwMCkgKyA1MCk7XG4gICAgY29uc3QgYmx1ZSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqICgyNTcgLSAxMDApICsgNTApO1xuICAgIGNvbnN0IGNvbG9yID0gYHJnYigke3JlZH0sICR7Z3JlZW59LCAke2JsdWV9KWA7XG5cbiAgICByZXR1cm4gY29sb3I7XG4gIH07XG4gIGNvbnN0IHJhbmRvbUNvbG9ycyA9IFtcbiAgICBnZXRSYW5kb21Db2xvcigpLFxuICAgIGdldFJhbmRvbUNvbG9yKCksXG4gICAgZ2V0UmFuZG9tQ29sb3IoKSxcbiAgICBnZXRSYW5kb21Db2xvcigpLFxuICAgIGdldFJhbmRvbUNvbG9yKCksXG4gIF07XG5cbiAgY29uc3Qgc2V0UmFuZG9tQ29sb3JzID0gZnVuY3Rpb24gKGVsZW1lbnQsIHNoaXApIHtcbiAgICBzd2l0Y2ggKHNoaXApIHtcbiAgICAgIGNhc2UgNTpcbiAgICAgICAgZWxlbWVudC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSByYW5kb21Db2xvcnNbMF07XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSA0OlxuICAgICAgICBlbGVtZW50LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IHJhbmRvbUNvbG9yc1sxXTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDMuNTpcbiAgICAgICAgZWxlbWVudC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSByYW5kb21Db2xvcnNbMl07XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAzOlxuICAgICAgICBlbGVtZW50LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IHJhbmRvbUNvbG9yc1szXTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDI6XG4gICAgICAgIGVsZW1lbnQuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gcmFuZG9tQ29sb3JzWzRdO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH07XG5cbiAgY29uc3Qgc2V0Q2xhc3NlcyA9IChmdW5jdGlvbiAoKSB7XG4gICAgY29uc3Qgc2V0Q2xhc3MgPSBmdW5jdGlvbiAoZWxlbWVudCwgc2hpcCkge1xuICAgICAgc3dpdGNoIChzaGlwKSB7XG4gICAgICAgIGNhc2UgNTpcbiAgICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZShcImRhdGEtc2hpcFwiLCBcIjVcIik7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgNDpcbiAgICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZShcImRhdGEtc2hpcFwiLCBcIjRcIik7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMy41OlxuICAgICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKFwiZGF0YS1zaGlwXCIsIFwiMy41XCIpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJkYXRhLXNoaXBcIiwgXCIzXCIpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJkYXRhLXNoaXBcIiwgXCIyXCIpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBnZXROb2Rlcy5hZG1pcmFsR3JvdW5kc0RpdnMuZm9yRWFjaCgoZGl2LCBkaXZJbmRleCkgPT4ge1xuICAgICAgdXNlckJvYXJkLmZvckVhY2goKGVudHJ5LCBlbnRyeUluZGV4KSA9PiB7XG4gICAgICAgIGlmIChkaXZJbmRleCA9PT0gZW50cnlJbmRleCkge1xuICAgICAgICAgIGlmIChlbnRyeSAhPT0gbnVsbCAmJiBlbnRyeSAhPT0gXCJPXCIpIHtcbiAgICAgICAgICAgIHNldENsYXNzKGRpdiwgZW50cnkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBnZXROb2Rlcy5haUdyb3VuZHNEaXZzLmZvckVhY2goKGRpdiwgZGl2SW5kZXgpID0+IHtcbiAgICAgIGNvbXB1dGVyQm9hcmQuZm9yRWFjaCgoZW50cnksIGVudHJ5SW5kZXgpID0+IHtcbiAgICAgICAgaWYgKGRpdkluZGV4ID09PSBlbnRyeUluZGV4KSB7XG4gICAgICAgICAgaWYgKGVudHJ5ICE9PSBudWxsICYmIGVudHJ5ICE9PSBcIk9cIikge1xuICAgICAgICAgICAgc2V0Q2xhc3MoZGl2LCBlbnRyeSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSkoKTtcblxuICBjb25zdCBwb3B1bGF0ZVdpdGhTcGF0aWFsU2hpcHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgY29uc3Qgc2V0U3BhdGlhbERpbWVuc2lvbiA9IGZ1bmN0aW9uIChncm91bmRzKSB7XG4gICAgICBjb25zdCBhcHBlbmRTaGlwSW1nID0gZnVuY3Rpb24gKHNoaXBTcmMsIHNoaXBMZW5ndGgsIHNoaXBUeXBlKSB7XG4gICAgICAgIGZvciAoY29uc3QgZGl2IG9mIGdyb3VuZHMpIHtcbiAgICAgICAgICBpZiAoZGl2LmRhdGFzZXQuc2hpcCA9PT0gc2hpcFR5cGUpIHtcbiAgICAgICAgICAgIGNvbnN0IHNoaXBJbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xuICAgICAgICAgICAgc2hpcEltZy5zZXRBdHRyaWJ1dGUoXCJzcmNcIiwgYCR7c2hpcFNyY31gKTtcblxuICAgICAgICAgICAgY29uc3QgdXBkYXRlSW1nU2l6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgY29uc3Qgd2lkdGggPSBkaXYuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGggKiBzaGlwTGVuZ3RoO1xuICAgICAgICAgICAgICBjb25zdCBoZWlnaHQgPSBkaXYuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0O1xuICAgICAgICAgICAgICBzaGlwSW1nLnN0eWxlLndpZHRoID0gYCR7d2lkdGggLSA1fXB4YDtcbiAgICAgICAgICAgICAgc2hpcEltZy5zdHlsZS5oZWlnaHQgPSBgJHtoZWlnaHQgLSAyfXB4YDtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB1cGRhdGVJbWdTaXplKCk7XG4gICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCB1cGRhdGVJbWdTaXplKTtcblxuICAgICAgICAgICAgY29uc3QgcmVtb3ZlU2NhbGluZyA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIGRpdi5zdHlsZS50cmFuc2Zvcm0gPSBcInNjYWxlKDEpXCI7XG4gICAgICAgICAgICB9KSgpO1xuXG4gICAgICAgICAgICBkaXYuYXBwZW5kQ2hpbGQoc2hpcEltZyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgYXBwZW5kU2hpcEltZyhcIi4vYXNzZXRzL2NhcnJpZXIucG5nXCIsIDUsIFwiNVwiKTtcbiAgICAgIGFwcGVuZFNoaXBJbWcoXCIuL2Fzc2V0cy9iYXR0bGVzaGlwLnBuZ1wiLCA0LCBcIjRcIik7XG4gICAgICBhcHBlbmRTaGlwSW1nKFwiLi9hc3NldHMvZGVzdHJveWVyLnBuZ1wiLCAzLCBcIjMuNVwiKTtcbiAgICAgIGFwcGVuZFNoaXBJbWcoXCIuL2Fzc2V0cy9zdWJtYXJpbmUucG5nXCIsIDMsIFwiM1wiKTtcbiAgICAgIGFwcGVuZFNoaXBJbWcoXCIuL2Fzc2V0cy9wYXRyb2wtYm9hdC5wbmdcIiwgMiwgXCIyXCIpO1xuICAgIH07XG4gICAgc2V0U3BhdGlhbERpbWVuc2lvbihnZXROb2Rlcy5hZG1pcmFsR3JvdW5kc0RpdnMpO1xuXG4gICAgY29uc3Qgc2V0U3BhdGlhbERpbWVuc2lvbkZvckFpQW5kSGlkZSA9IChmdW5jdGlvbiAoKSB7XG4gICAgICBzZXRTcGF0aWFsRGltZW5zaW9uKGdldE5vZGVzLmFpR3JvdW5kc0RpdnMpO1xuICAgICAgZ2V0Tm9kZXMuYWlHcm91bmRzRGl2cy5mb3JFYWNoKChkaXYpID0+IHtcbiAgICAgICAgaWYgKGRpdi5xdWVyeVNlbGVjdG9yKFwiaW1nXCIpKSB7XG4gICAgICAgICAgZGl2LnF1ZXJ5U2VsZWN0b3IoXCJpbWdcIikuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KSgpO1xuXG4gICAgY29uc3QgcGVla0FpQm9hcmQgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgZ2V0Tm9kZXMucGVla0J1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgICBpZiAoZ2V0Tm9kZXMuZGltZW5zaW9uT3B0aW9ucy52YWx1ZSA9PT0gXCJzaW1wbGVcIikge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGV4aXREaWFsb2cgPSAoYXN5bmMgZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGdldE5vZGVzLmNvdmVyLnN0eWxlLnpJbmRleCA9IFwiMFwiO1xuICAgICAgICAgIGdldE5vZGVzLmNvbmZpZ0RpYWxvZy5zdHlsZS5vcGFjaXR5ID0gXCIwXCI7XG4gICAgICAgICAgZ2V0Tm9kZXMuY29uZmlnRGlhbG9nLnN0eWxlLnRyYW5zaXRpb24gPSBcIm9wYWNpdHkgMC41cyBlYXNlLWluLW91dFwiO1xuICAgICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgZ2V0Tm9kZXMuY29uZmlnRGlhbG9nLnN0eWxlLnZpc2liaWxpdHkgPSBcImhpZGRlblwiO1xuICAgICAgICAgICAgfSwgNDAwKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSkoKTtcblxuICAgICAgICAvLyBTaG93IHNoaXBzXG4gICAgICAgIGdldE5vZGVzLmFpR3JvdW5kc0RpdnMuZm9yRWFjaCgoZGl2KSA9PiB7XG4gICAgICAgICAgaWYgKGRpdi5xdWVyeVNlbGVjdG9yKFwiaW1nXCIpKSB7XG4gICAgICAgICAgICBkaXYucXVlcnlTZWxlY3RvcihcImltZ1wiKS5zdHlsZS5kaXNwbGF5ID0gXCJpbmxpbmVcIjtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IGhpZGVBaUJvYXJkID0gKGFzeW5jIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgIGdldE5vZGVzLmFpR3JvdW5kc0RpdnMuZm9yRWFjaCgoZGl2KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGRpdi5xdWVyeVNlbGVjdG9yKFwiaW1nXCIpKSB7XG4gICAgICAgICAgICAgICAgICBkaXYucXVlcnlTZWxlY3RvcihcImltZ1wiKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sIDEwMDApO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KSgpO1xuICAgICAgfSk7XG4gICAgfSkoKTtcbiAgfTtcbiAgcG9wdWxhdGVXaXRoU3BhdGlhbFNoaXBzKCk7XG5cbiAgY29uc3QgcG9wdWxhdGVXaXRoQ29sb3IgPSBmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgcG9wdWxhdGVVc2VyQm9hcmQgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgZ2V0Tm9kZXMuYWRtaXJhbEdyb3VuZHNEaXZzLmZvckVhY2goKGRpdiwgZGl2SW5kZXgpID0+IHtcbiAgICAgICAgdXNlckJvYXJkLmZvckVhY2goKGVudHJ5LCBlbnRyeUluZGV4KSA9PiB7XG4gICAgICAgICAgaWYgKGRpdkluZGV4ID09PSBlbnRyeUluZGV4KSB7XG4gICAgICAgICAgICBpZiAoZW50cnkgIT09IG51bGwgJiYgZW50cnkgIT09IFwiT1wiKSB7XG4gICAgICAgICAgICAgIHNldFJhbmRvbUNvbG9ycyhkaXYsIGVudHJ5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSkoKTtcblxuICAgIGNvbnN0IHBvcHVsYXRlQWlCb2FyZCA9IChmdW5jdGlvbiAoKSB7XG4gICAgICBnZXROb2Rlcy5haUdyb3VuZHNEaXZzLmZvckVhY2goKGRpdiwgZGl2SW5kZXgpID0+IHtcbiAgICAgICAgY29tcHV0ZXJCb2FyZC5mb3JFYWNoKChlbnRyeSwgZW50cnlJbmRleCkgPT4ge1xuICAgICAgICAgIGlmIChkaXZJbmRleCA9PT0gZW50cnlJbmRleCkge1xuICAgICAgICAgICAgaWYgKGVudHJ5ICE9PSBudWxsICYmIGVudHJ5ICE9PSBcIk9cIikge1xuICAgICAgICAgICAgICBjb25zdCBwZWVrQWlCb2FyZCA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgZ2V0Tm9kZXMucGVla0J1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgaWYgKGdldE5vZGVzLmRpbWVuc2lvbk9wdGlvbnMudmFsdWUgPT09IFwic3BhdGlhbFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgY29uc3QgZXhpdERpYWxvZyA9IChhc3luYyBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGdldE5vZGVzLmNvdmVyLnN0eWxlLnpJbmRleCA9IFwiMFwiO1xuICAgICAgICAgICAgICAgICAgICBnZXROb2Rlcy5jb25maWdEaWFsb2cuc3R5bGUub3BhY2l0eSA9IFwiMFwiO1xuICAgICAgICAgICAgICAgICAgICBnZXROb2Rlcy5jb25maWdEaWFsb2cuc3R5bGUudHJhbnNpdGlvbiA9IFwib3BhY2l0eSAwLjVzIGVhc2UtaW4tb3V0XCI7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBnZXROb2Rlcy5jb25maWdEaWFsb2cuc3R5bGUudmlzaWJpbGl0eSA9IFwiaGlkZGVuXCI7XG4gICAgICAgICAgICAgICAgICAgICAgfSwgNDAwKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICB9KSgpO1xuXG4gICAgICAgICAgICAgICAgICAvLyBTaG93IGNvbG9yc1xuICAgICAgICAgICAgICAgICAgc2V0UmFuZG9tQ29sb3JzKGRpdiwgZW50cnkpO1xuXG4gICAgICAgICAgICAgICAgICBjb25zdCBoaWRlQWlCb2FyZCA9IChhc3luYyBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBnZXROb2Rlcy5haUdyb3VuZHNEaXZzLmZvckVhY2goKGRpdikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICBkaXYuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJpbml0aWFsXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICB9LCAxMDAwKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KSgpO1xuICB9O1xuXG4gIGNvbnN0IHBvcHVsYXRlV2l0aERpbWVuc2lvbkNoYW5nZSA9IChmdW5jdGlvbiAoKSB7XG4gICAgZ2V0Tm9kZXMuZGltZW5zaW9uT3B0aW9ucy5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIChldmVudCkgPT4ge1xuICAgICAgaWYgKGV2ZW50LnRhcmdldC52YWx1ZSA9PT0gXCJzaW1wbGVcIikge1xuICAgICAgICBjb25zdCBpbmFjdGl2YXRlQWxpZ25lZEJ1dHRvbiA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgZ2V0Tm9kZXMuYWxpZ25lZEJ1dHRvbi5zdHlsZS5wb2ludGVyRXZlbnRzID0gXCJub25lXCI7XG4gICAgICAgICAgZ2V0Tm9kZXMuYWxpZ25lZEJ1dHRvbi5zdHlsZS5jb2xvciA9IFwicmdiYSgyNTUsIDI1NSwgMjU1LCAwLjYpXCI7XG4gICAgICAgIH0pKCk7XG4gICAgICAgIGNvbnN0IGluYWN0aXZhdGVSZWFsaWduQnV0dG9uID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBnZXROb2Rlcy5yZWFsaWduQnV0dG9uLnN0eWxlLnBvaW50ZXJFdmVudHMgPSBcIm5vbmVcIjtcbiAgICAgICAgICBnZXROb2Rlcy5yZWFsaWduQnV0dG9uLnN0eWxlLmNvbG9yID0gXCJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuNilcIjtcbiAgICAgICAgfSkoKTtcblxuICAgICAgICBjb25zdCBjbGVhclNwYXRpYWxTaGlwcyA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgZ2V0Tm9kZXMuYWRtaXJhbEdyb3VuZHNEaXZzLmZvckVhY2goKGRpdikgPT4ge1xuICAgICAgICAgICAgaWYgKGRpdi5xdWVyeVNlbGVjdG9yKFwiaW1nXCIpKSB7XG4gICAgICAgICAgICAgIGRpdi5xdWVyeVNlbGVjdG9yKFwiaW1nXCIpLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIGdldE5vZGVzLmFpR3JvdW5kc0RpdnMuZm9yRWFjaCgoZGl2KSA9PiB7XG4gICAgICAgICAgICBpZiAoZGl2LnF1ZXJ5U2VsZWN0b3IoXCJpbWdcIikpIHtcbiAgICAgICAgICAgICAgZGl2LnF1ZXJ5U2VsZWN0b3IoXCJpbWdcIikuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9KSgpO1xuXG4gICAgICAgIHBvcHVsYXRlV2l0aENvbG9yKCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChldmVudC50YXJnZXQudmFsdWUgPT09IFwic3BhdGlhbFwiKSB7XG4gICAgICAgIGNvbnN0IGFjdGl2YXRlUmVhbGlnbkJ1dHRvbiA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgZ2V0Tm9kZXMucmVhbGlnbkJ1dHRvbi5zdHlsZS5wb2ludGVyRXZlbnRzID0gXCJhdXRvXCI7XG4gICAgICAgICAgZ2V0Tm9kZXMucmVhbGlnbkJ1dHRvbi5zdHlsZS5jb2xvciA9IFwicmdiKDI1NSwgMjU1LCAyNTUpXCI7XG4gICAgICAgIH0pKCk7XG5cbiAgICAgICAgY29uc3QgY2xlYXJDb2xvcnMgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGdldE5vZGVzLmFkbWlyYWxHcm91bmRzRGl2cy5mb3JFYWNoKChkaXYpID0+IHtcbiAgICAgICAgICAgIGRpdi5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcImluaXRpYWxcIjtcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIGdldE5vZGVzLmFpR3JvdW5kc0RpdnMuZm9yRWFjaCgoZGl2KSA9PiB7XG4gICAgICAgICAgICBkaXYuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJpbml0aWFsXCI7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pKCk7XG5cbiAgICAgICAgY29uc3QgYnJpbmdCYWNrU3BhdGlhbFNoaXBzID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBnZXROb2Rlcy5hZG1pcmFsR3JvdW5kc0RpdnMuZm9yRWFjaCgoZGl2KSA9PiB7XG4gICAgICAgICAgICBpZiAoZGl2LnF1ZXJ5U2VsZWN0b3IoXCJpbWdcIikpIHtcbiAgICAgICAgICAgICAgZGl2LnF1ZXJ5U2VsZWN0b3IoXCJpbWdcIikuc3R5bGUuZGlzcGxheSA9IFwiaW5saW5lXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pKCk7XG5cbiAgY29uc3QgcG9wdWxhdGVBaUJvYXJkV2hlbkdhbWVPdmVyID0gZnVuY3Rpb24gKCkge1xuICAgIGdldE5vZGVzLmFpR3JvdW5kc0RpdnMuZm9yRWFjaCgoZGl2LCBkaXZJbmRleCkgPT4ge1xuICAgICAgY29tcHV0ZXJCb2FyZC5mb3JFYWNoKChlbnRyeSwgZW50cnlJbmRleCkgPT4ge1xuICAgICAgICBpZiAoZGl2SW5kZXggPT09IGVudHJ5SW5kZXgpIHtcbiAgICAgICAgICBpZiAoZ2V0Tm9kZXMuZGltZW5zaW9uT3B0aW9ucy52YWx1ZSA9PT0gXCJzaW1wbGVcIikge1xuICAgICAgICAgICAgc2V0UmFuZG9tQ29sb3JzKGRpdiwgZW50cnkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoZ2V0Tm9kZXMuZGltZW5zaW9uT3B0aW9ucy52YWx1ZSA9PT0gXCJzcGF0aWFsXCIpIHtcbiAgICAgICAgICAgIGlmIChkaXYucXVlcnlTZWxlY3RvcihcImltZ1wiKSkge1xuICAgICAgICAgICAgICBkaXYucXVlcnlTZWxlY3RvcihcImltZ1wiKS5zdHlsZS5kaXNwbGF5ID0gXCJpbmxpbmVcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9O1xuXG4gIHJldHVybiB7IGdhbWUsIHBvcHVsYXRlQWlCb2FyZFdoZW5HYW1lT3ZlciB9O1xufSkoKTtcblxuY29uc3QgZGlzcGxheVRhcmdldCA9IChmdW5jdGlvbiAoKSB7XG4gIGNvbnN0IF9fZm9yRWFjaEdyb3VuZHMgPSBmdW5jdGlvbiAoZ3JvdW5kcykge1xuICAgIGdyb3VuZHMuZm9yRWFjaCgoZGl2KSA9PiB7XG4gICAgICBjb25zdCB0YXJnZXRTcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XG4gICAgICB0YXJnZXRTcGFuLnRleHRDb250ZW50ID0gXCLwn5KiXCI7XG4gICAgICB0YXJnZXRTcGFuLnN0eWxlLnpJbmRleCA9IFwiMVwiO1xuICAgICAgdGFyZ2V0U3Bhbi5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICBkaXYuYXBwZW5kQ2hpbGQodGFyZ2V0U3Bhbik7XG5cbiAgICAgIGRpdi5hZGRFdmVudExpc3RlbmVyKFwibW91c2VvdmVyXCIsICgpID0+IHtcbiAgICAgICAgdGFyZ2V0U3Bhbi5zdHlsZS5kaXNwbGF5ID0gXCJpbmxpbmVcIjtcbiAgICAgICAgdGFyZ2V0U3Bhbi5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcInJnYmEoMjU1LCAyNTUsIDI1NSwgMC4zKVwiO1xuICAgICAgfSk7XG4gICAgICBkaXYuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlb3V0XCIsICgpID0+IHtcbiAgICAgICAgaWYgKGRpdi50ZXh0Q29udGVudCAhPT0gXCJYXCIgJiYgZGl2LnRleHRDb250ZW50ICE9PSBcIvCfkqVcIikge1xuICAgICAgICAgIHRhcmdldFNwYW4uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgICB9XG4gICAgICAgIHRhcmdldFNwYW4uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJpbml0aWFsXCI7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfTtcblxuICBfX2ZvckVhY2hHcm91bmRzKGdldE5vZGVzLmFkbWlyYWxHcm91bmRzRGl2cyk7XG4gIF9fZm9yRWFjaEdyb3VuZHMoZ2V0Tm9kZXMuYWlHcm91bmRzRGl2cyk7XG59KSgpO1xuXG5jb25zdCBzZXREZWZhdWx0QXR0cmlidXRlc0luQ29vcmRpbmF0ZXMgPSAoZnVuY3Rpb24gKCkge1xuICBjb25zdCBzZXRDb29yZGluYXRlc1RvVW5BdHRhY2tlZCA9IChmdW5jdGlvbiAoKSB7XG4gICAgZ2V0Tm9kZXMuYWlHcm91bmRzRGl2cy5mb3JFYWNoKChkaXYpID0+IHtcbiAgICAgIGRpdi5zZXRBdHRyaWJ1dGUoXCJkYXRhLWF0dGFja2VkXCIsIFwiTm9cIik7XG4gICAgfSk7XG4gICAgZ2V0Tm9kZXMuYWRtaXJhbEdyb3VuZHNEaXZzLmZvckVhY2goKGRpdikgPT4ge1xuICAgICAgZGl2LnNldEF0dHJpYnV0ZShcImRhdGEtYXR0YWNrZWRcIiwgXCJOb1wiKTtcbiAgICB9KTtcbiAgfSkoKTtcblxuICBjb25zdCBhZGRJbmRleFRvQ29vcmRpbmF0ZXMgPSAoZnVuY3Rpb24gKCkge1xuICAgIGxldCBpbmRleCA9IDE7XG4gICAgbGV0IGFscEluZGV4ID0gMDtcbiAgICBjb25zdCBhbHBzID0gW1wiQVwiLCBcIkJcIiwgXCJDXCIsIFwiRFwiLCBcIkVcIiwgXCJGXCIsIFwiR1wiLCBcIkhcIiwgXCJJXCIsIFwiSlwiXTtcblxuICAgIGdldE5vZGVzLmFpR3JvdW5kc0RpdnMuZm9yRWFjaCgoZGl2LCBkaXZJbmRleCkgPT4ge1xuICAgICAgaWYgKGRpdkluZGV4ID09PSAxMCAqIGluZGV4KSB7XG4gICAgICAgIGluZGV4ICs9IDE7XG4gICAgICAgIGFscEluZGV4ID0gMDtcbiAgICAgIH1cbiAgICAgIGRpdi5zZXRBdHRyaWJ1dGUoXCJkYXRhLWluZGV4XCIsIGAke2luZGV4fSR7YWxwc1thbHBJbmRleF19YCk7XG4gICAgICBhbHBJbmRleCArPSAxO1xuICAgIH0pO1xuXG4gICAgaW5kZXggPSAxO1xuICAgIGFscEluZGV4ID0gMDtcbiAgICBnZXROb2Rlcy5hZG1pcmFsR3JvdW5kc0RpdnMuZm9yRWFjaCgoZGl2LCBkaXZJbmRleCkgPT4ge1xuICAgICAgaWYgKGRpdkluZGV4ID09PSAxMCAqIGluZGV4KSB7XG4gICAgICAgIGluZGV4ICs9IDE7XG4gICAgICAgIGFscEluZGV4ID0gMDtcbiAgICAgIH1cbiAgICAgIGRpdi5zZXRBdHRyaWJ1dGUoXCJkYXRhLWluZGV4XCIsIGAke2luZGV4fSR7YWxwc1thbHBJbmRleF19YCk7XG4gICAgICBhbHBJbmRleCArPSAxO1xuICAgIH0pO1xuICB9KSgpO1xufSkoKTtcblxuY29uc3QgbG9vcEdhbWUgPSAoZnVuY3Rpb24gKCkge1xuICBjb25zdCBnYW1lID0gcG9wdWxhdGVCb2FyZHMuZ2FtZTtcbiAgbGV0IGdhbWVPdmVyID0gZmFsc2U7XG5cbiAgY29uc3QgZ2V0RGlmZmljdWx0eSA9IChmdW5jdGlvbiAoKSB7XG4gICAgbGV0IGRpZmZpY3VsdHkgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImRpZmZpY3VsdHlcIik7XG4gICAgaWYgKCFkaWZmaWN1bHR5KSB7XG4gICAgICBkaWZmaWN1bHR5ID0gXCJub3JtYWxcIjtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGRpZmZpY3VsdHkgPT09IFwiaW1wb3NzaWJsZVwiKSB7XG4gICAgICAgIGdldE5vZGVzLmRpZmZpY3VsdHlPcHRpb25zLm9wdGlvbnNbMF0ucmVtb3ZlQXR0cmlidXRlKFwic2VsZWN0ZWRcIik7XG4gICAgICAgIGdldE5vZGVzLmRpZmZpY3VsdHlPcHRpb25zLm9wdGlvbnNbMV0ucmVtb3ZlQXR0cmlidXRlKFwic2VsZWN0ZWRcIik7XG4gICAgICAgIGdldE5vZGVzLmRpZmZpY3VsdHlPcHRpb25zLm9wdGlvbnNbMl0uc2V0QXR0cmlidXRlKFwic2VsZWN0ZWRcIiwgdHJ1ZSk7XG4gICAgICAgIGdldE5vZGVzLmZlZWRiYWNrLnRleHRDb250ZW50ID0gXCJEb24ndCBtaXNzIVwiO1xuICAgICAgfVxuICAgICAgaWYgKGRpZmZpY3VsdHkgPT09IFwibm9ybWFsXCIpIHtcbiAgICAgICAgZ2V0Tm9kZXMuZGlmZmljdWx0eU9wdGlvbnMub3B0aW9uc1swXS5yZW1vdmVBdHRyaWJ1dGUoXCJzZWxlY3RlZFwiKTtcbiAgICAgICAgZ2V0Tm9kZXMuZGlmZmljdWx0eU9wdGlvbnMub3B0aW9uc1sxXS5zZXRBdHRyaWJ1dGUoXCJzZWxlY3RlZFwiLCB0cnVlKTtcbiAgICAgICAgZ2V0Tm9kZXMuZGlmZmljdWx0eU9wdGlvbnMub3B0aW9uc1syXS5yZW1vdmVBdHRyaWJ1dGUoXCJzZWxlY3RlZFwiKTtcbiAgICAgICAgZ2V0Tm9kZXMuZmVlZGJhY2sudGV4dENvbnRlbnQgPSBcIkluaXRpYXRlIGF0dGFjayFcIjtcbiAgICAgIH1cbiAgICAgIGlmIChkaWZmaWN1bHR5ID09PSBcImR1bW15XCIpIHtcbiAgICAgICAgZ2V0Tm9kZXMuZGlmZmljdWx0eU9wdGlvbnMub3B0aW9uc1swXS5zZXRBdHRyaWJ1dGUoXCJzZWxlY3RlZFwiLCB0cnVlKTtcbiAgICAgICAgZ2V0Tm9kZXMuZGlmZmljdWx0eU9wdGlvbnMub3B0aW9uc1sxXS5yZW1vdmVBdHRyaWJ1dGUoXCJzZWxlY3RlZFwiKTtcbiAgICAgICAgZ2V0Tm9kZXMuZGlmZmljdWx0eU9wdGlvbnMub3B0aW9uc1syXS5yZW1vdmVBdHRyaWJ1dGUoXCJzZWxlY3RlZFwiKTtcbiAgICAgICAgZ2V0Tm9kZXMuZmVlZGJhY2sudGV4dENvbnRlbnQgPSBcIkluaXRpYXRlIGF0dGFjayFcIjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4geyBkaWZmaWN1bHR5IH07XG4gIH0pKCk7XG5cbiAgY29uc3QgZGlzcGxheUF0dGFjayA9IGZ1bmN0aW9uIChzcG90LCBpbnB1dFZhbHVlLCBmb250Q29sb3IpIHtcbiAgICBjb25zdCBzcGFuID0gc3BvdC5xdWVyeVNlbGVjdG9yKFwic3BhblwiKTtcbiAgICBzcGFuLnN0eWxlLmRpc3BsYXkgPSBcImlubGluZVwiO1xuICAgIHNwYW4udGV4dENvbnRlbnQgPSBpbnB1dFZhbHVlO1xuICAgIHNwYW4uc3R5bGUuekluZGV4ID0gXCIxXCI7XG5cbiAgICBzcG90LnN0eWxlLmNvbG9yID0gZm9udENvbG9yO1xuICAgIHNwb3Quc3R5bGUucG9pbnRlckV2ZW50cyA9IFwibm9uZVwiO1xuICAgIHNwb3Quc3R5bGUuekluZGV4ID0gXCIxXCI7XG4gICAgc3BvdC5zZXRBdHRyaWJ1dGUoXCJkYXRhLWF0dGFja2VkXCIsIFwiWWVzXCIpO1xuICB9O1xuXG4gIGNvbnN0IHNldEZlZWRiYWNrID0gZnVuY3Rpb24gKGFpT3JVc2VyLCBtaXNzZWRPckhpdCwgc2hpcERhdGFzZXQpIHtcbiAgICBjb25zdCBnZXRGZWVkYmFja01lc3NhZ2UgPSBmdW5jdGlvbiAoYWlPclVzZXIyKSB7XG4gICAgICBsZXQgZmVlZGJhY2tNZXNzYWdlID0gXCJcIjtcbiAgICAgIGxldCB2aWN0aW0gPSBudWxsO1xuXG4gICAgICBpZiAoYWlPclVzZXIyID09PSBcImFpXCIpIHtcbiAgICAgICAgdmljdGltID0gZ2FtZS51c2VyO1xuICAgICAgfSBlbHNlIGlmIChhaU9yVXNlcjIgPT09IFwidXNlclwiKSB7XG4gICAgICAgIHZpY3RpbSA9IGdhbWUuY29tcHV0ZXI7XG4gICAgICB9XG5cbiAgICAgIHN3aXRjaCAoc2hpcERhdGFzZXQpIHtcbiAgICAgICAgY2FzZSBcIjVcIjpcbiAgICAgICAgICBmZWVkYmFja01lc3NhZ2UgPSBcIkhpdCB0aGUgQ2FycmllciDwn46vXCI7XG4gICAgICAgICAgaWYgKHZpY3RpbS5zaGlwcy5DYXJyaWVyLmN1cnJlbnROdW1IaXRzID09PSA1KSB7XG4gICAgICAgICAgICBmZWVkYmFja01lc3NhZ2UgPVxuICAgICAgICAgICAgICAnU3VuayB0aGUgQ2FycmllciEgPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjx0aXRsZT5zYWlsLWJvYXQtc2luazwvdGl0bGU+PHBhdGggZD1cIk0yMC45NiAyMUMxOS45IDIxIDE4LjkgMjAuNzQgMTcuOTYgMjAuMjRDMTYuMTIgMjEuMjQgMTMuODEgMjEuMjQgMTEuOTcgMjAuMjRDMTAuMTMgMjEuMjQgNy44MiAyMS4yNCA2IDIwLjI0QzQuNzcgMjAuOTMgMy4zNiAyMS4wNCAyIDIxVjE5QzMuNDEgMTkuMDQgNC43NyAxOC44OSA2IDE4QzcuNzQgMTkuMjQgMTAuMjEgMTkuMjQgMTEuOTcgMThDMTMuNzQgMTkuMjQgMTYuMiAxOS4yNCAxNy45NiAxOEMxOS4xNyAxOC44OSAyMC41NCAxOS4wNCAyMS45NCAxOVYyMUgyMC45Nk0yMiAzLjVMNy4xMSA1Ljk2TDEzLjExIDEyLjE3TDIyIDMuNU0xMC44MSAxNi4zNkwxMS45NyAxNS41NEwxMy4xMiAxNi4zNkMxMy42NSAxNi43MiAxNC4zIDE2LjkzIDE0Ljk3IDE2LjkzQzE1LjEyIDE2LjkzIDE1LjI4IDE2LjkxIDE1LjQzIDE2Ljg5TDUuMiA2LjMxQzQuMjkgNy42NSAzLjkgOS4zMiA0IDEwLjkyTDkuNzQgMTYuODNDMTAuMTMgMTYuNzQgMTAuNSAxNi41OCAxMC44MSAxNi4zNlpcIiAvPjwvc3ZnPic7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiNFwiOlxuICAgICAgICAgIGZlZWRiYWNrTWVzc2FnZSA9IFwiSGl0IHRoZSBCYXR0bGVzaGlwIPCfjq9cIjtcbiAgICAgICAgICBpZiAodmljdGltLnNoaXBzLkJhdHRsZXNoaXAuY3VycmVudE51bUhpdHMgPT09IDQpIHtcbiAgICAgICAgICAgIGZlZWRiYWNrTWVzc2FnZSA9XG4gICAgICAgICAgICAgICdTdW5rIHRoZSBCYXR0bGVzaGlwISA8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+PHRpdGxlPnNhaWwtYm9hdC1zaW5rPC90aXRsZT48cGF0aCBkPVwiTTIwLjk2IDIxQzE5LjkgMjEgMTguOSAyMC43NCAxNy45NiAyMC4yNEMxNi4xMiAyMS4yNCAxMy44MSAyMS4yNCAxMS45NyAyMC4yNEMxMC4xMyAyMS4yNCA3LjgyIDIxLjI0IDYgMjAuMjRDNC43NyAyMC45MyAzLjM2IDIxLjA0IDIgMjFWMTlDMy40MSAxOS4wNCA0Ljc3IDE4Ljg5IDYgMThDNy43NCAxOS4yNCAxMC4yMSAxOS4yNCAxMS45NyAxOEMxMy43NCAxOS4yNCAxNi4yIDE5LjI0IDE3Ljk2IDE4QzE5LjE3IDE4Ljg5IDIwLjU0IDE5LjA0IDIxLjk0IDE5VjIxSDIwLjk2TTIyIDMuNUw3LjExIDUuOTZMMTMuMTEgMTIuMTdMMjIgMy41TTEwLjgxIDE2LjM2TDExLjk3IDE1LjU0TDEzLjEyIDE2LjM2QzEzLjY1IDE2LjcyIDE0LjMgMTYuOTMgMTQuOTcgMTYuOTNDMTUuMTIgMTYuOTMgMTUuMjggMTYuOTEgMTUuNDMgMTYuODlMNS4yIDYuMzFDNC4yOSA3LjY1IDMuOSA5LjMyIDQgMTAuOTJMOS43NCAxNi44M0MxMC4xMyAxNi43NCAxMC41IDE2LjU4IDEwLjgxIDE2LjM2WlwiIC8+PC9zdmc+JztcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCIzLjVcIjpcbiAgICAgICAgICBmZWVkYmFja01lc3NhZ2UgPSBcIkhpdCB0aGUgRGVzdHJveWVyIPCfjq9cIjtcbiAgICAgICAgICBpZiAodmljdGltLnNoaXBzLkRlc3Ryb3llci5jdXJyZW50TnVtSGl0cyA9PT0gMykge1xuICAgICAgICAgICAgZmVlZGJhY2tNZXNzYWdlID1cbiAgICAgICAgICAgICAgJ1N1bmsgdGhlIERlc3Ryb3llciEgPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjx0aXRsZT5zYWlsLWJvYXQtc2luazwvdGl0bGU+PHBhdGggZD1cIk0yMC45NiAyMUMxOS45IDIxIDE4LjkgMjAuNzQgMTcuOTYgMjAuMjRDMTYuMTIgMjEuMjQgMTMuODEgMjEuMjQgMTEuOTcgMjAuMjRDMTAuMTMgMjEuMjQgNy44MiAyMS4yNCA2IDIwLjI0QzQuNzcgMjAuOTMgMy4zNiAyMS4wNCAyIDIxVjE5QzMuNDEgMTkuMDQgNC43NyAxOC44OSA2IDE4QzcuNzQgMTkuMjQgMTAuMjEgMTkuMjQgMTEuOTcgMThDMTMuNzQgMTkuMjQgMTYuMiAxOS4yNCAxNy45NiAxOEMxOS4xNyAxOC44OSAyMC41NCAxOS4wNCAyMS45NCAxOVYyMUgyMC45Nk0yMiAzLjVMNy4xMSA1Ljk2TDEzLjExIDEyLjE3TDIyIDMuNU0xMC44MSAxNi4zNkwxMS45NyAxNS41NEwxMy4xMiAxNi4zNkMxMy42NSAxNi43MiAxNC4zIDE2LjkzIDE0Ljk3IDE2LjkzQzE1LjEyIDE2LjkzIDE1LjI4IDE2LjkxIDE1LjQzIDE2Ljg5TDUuMiA2LjMxQzQuMjkgNy42NSAzLjkgOS4zMiA0IDEwLjkyTDkuNzQgMTYuODNDMTAuMTMgMTYuNzQgMTAuNSAxNi41OCAxMC44MSAxNi4zNlpcIiAvPjwvc3ZnPic7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiM1wiOlxuICAgICAgICAgIGZlZWRiYWNrTWVzc2FnZSA9IFwiSGl0IHRoZSBTdWJtYXJpbmUg8J+Or1wiO1xuICAgICAgICAgIGlmICh2aWN0aW0uc2hpcHMuU3VibWFyaW5lLmN1cnJlbnROdW1IaXRzID09PSAzKSB7XG4gICAgICAgICAgICBmZWVkYmFja01lc3NhZ2UgPVxuICAgICAgICAgICAgICAnU3VuayB0aGUgU3VibWFyaW5lISA8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+PHRpdGxlPnNhaWwtYm9hdC1zaW5rPC90aXRsZT48cGF0aCBkPVwiTTIwLjk2IDIxQzE5LjkgMjEgMTguOSAyMC43NCAxNy45NiAyMC4yNEMxNi4xMiAyMS4yNCAxMy44MSAyMS4yNCAxMS45NyAyMC4yNEMxMC4xMyAyMS4yNCA3LjgyIDIxLjI0IDYgMjAuMjRDNC43NyAyMC45MyAzLjM2IDIxLjA0IDIgMjFWMTlDMy40MSAxOS4wNCA0Ljc3IDE4Ljg5IDYgMThDNy43NCAxOS4yNCAxMC4yMSAxOS4yNCAxMS45NyAxOEMxMy43NCAxOS4yNCAxNi4yIDE5LjI0IDE3Ljk2IDE4QzE5LjE3IDE4Ljg5IDIwLjU0IDE5LjA0IDIxLjk0IDE5VjIxSDIwLjk2TTIyIDMuNUw3LjExIDUuOTZMMTMuMTEgMTIuMTdMMjIgMy41TTEwLjgxIDE2LjM2TDExLjk3IDE1LjU0TDEzLjEyIDE2LjM2QzEzLjY1IDE2LjcyIDE0LjMgMTYuOTMgMTQuOTcgMTYuOTNDMTUuMTIgMTYuOTMgMTUuMjggMTYuOTEgMTUuNDMgMTYuODlMNS4yIDYuMzFDNC4yOSA3LjY1IDMuOSA5LjMyIDQgMTAuOTJMOS43NCAxNi44M0MxMC4xMyAxNi43NCAxMC41IDE2LjU4IDEwLjgxIDE2LjM2WlwiIC8+PC9zdmc+JztcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCIyXCI6XG4gICAgICAgICAgZmVlZGJhY2tNZXNzYWdlID0gXCJIaXQgdGhlIFBhdHJvbCBCb2F0IPCfjq9cIjtcbiAgICAgICAgICBpZiAodmljdGltLnNoaXBzW1wiUGF0cm9sIEJvYXRcIl0uY3VycmVudE51bUhpdHMgPT09IDIpIHtcbiAgICAgICAgICAgIGZlZWRiYWNrTWVzc2FnZSA9XG4gICAgICAgICAgICAgICdTdW5rIHRoZSBQYXRyb2wgQm9hdCEgPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjx0aXRsZT5zYWlsLWJvYXQtc2luazwvdGl0bGU+PHBhdGggZD1cIk0yMC45NiAyMUMxOS45IDIxIDE4LjkgMjAuNzQgMTcuOTYgMjAuMjRDMTYuMTIgMjEuMjQgMTMuODEgMjEuMjQgMTEuOTcgMjAuMjRDMTAuMTMgMjEuMjQgNy44MiAyMS4yNCA2IDIwLjI0QzQuNzcgMjAuOTMgMy4zNiAyMS4wNCAyIDIxVjE5QzMuNDEgMTkuMDQgNC43NyAxOC44OSA2IDE4QzcuNzQgMTkuMjQgMTAuMjEgMTkuMjQgMTEuOTcgMThDMTMuNzQgMTkuMjQgMTYuMiAxOS4yNCAxNy45NiAxOEMxOS4xNyAxOC44OSAyMC41NCAxOS4wNCAyMS45NCAxOVYyMUgyMC45Nk0yMiAzLjVMNy4xMSA1Ljk2TDEzLjExIDEyLjE3TDIyIDMuNU0xMC44MSAxNi4zNkwxMS45NyAxNS41NEwxMy4xMiAxNi4zNkMxMy42NSAxNi43MiAxNC4zIDE2LjkzIDE0Ljk3IDE2LjkzQzE1LjEyIDE2LjkzIDE1LjI4IDE2LjkxIDE1LjQzIDE2Ljg5TDUuMiA2LjMxQzQuMjkgNy42NSAzLjkgOS4zMiA0IDEwLjkyTDkuNzQgMTYuODNDMTAuMTMgMTYuNzQgMTAuNSAxNi41OCAxMC44MSAxNi4zNlpcIiAvPjwvc3ZnPic7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgLy8gRGVjbGFyZSB3aW5uZXJcbiAgICAgIGlmIChhaU9yVXNlcjIgPT09IFwiYWlcIikge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgdmljdGltLnNoaXBzLkNhcnJpZXIuaXNTdW5rKCkgJiZcbiAgICAgICAgICB2aWN0aW0uc2hpcHMuQmF0dGxlc2hpcC5pc1N1bmsoKSAmJlxuICAgICAgICAgIHZpY3RpbS5zaGlwcy5EZXN0cm95ZXIuaXNTdW5rKCkgJiZcbiAgICAgICAgICB2aWN0aW0uc2hpcHMuU3VibWFyaW5lLmlzU3VuaygpICYmXG4gICAgICAgICAgdmljdGltLnNoaXBzW1wiUGF0cm9sIEJvYXRcIl0uaXNTdW5rKClcbiAgICAgICAgKSB7XG4gICAgICAgICAgZmVlZGJhY2tNZXNzYWdlID0gXCJEZXN0cm95ZWQgYWxsIHlvdXIgc2hpcHMuIPCfmJ5cIjtcbiAgICAgICAgICBnYW1lT3ZlciA9IHRydWU7XG4gICAgICAgICAgcG9wdWxhdGVCb2FyZHMucG9wdWxhdGVBaUJvYXJkV2hlbkdhbWVPdmVyKCk7XG4gICAgICAgICAgZ2V0Tm9kZXMuYWlHcm91bmRzLnN0eWxlLnBvaW50ZXJFdmVudHMgPSBcIm5vbmVcIjtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChhaU9yVXNlcjIgPT09IFwidXNlclwiKSB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICB2aWN0aW0uc2hpcHMuQ2Fycmllci5pc1N1bmsoKSAmJlxuICAgICAgICAgIHZpY3RpbS5zaGlwcy5CYXR0bGVzaGlwLmlzU3VuaygpICYmXG4gICAgICAgICAgdmljdGltLnNoaXBzLkRlc3Ryb3llci5pc1N1bmsoKSAmJlxuICAgICAgICAgIHZpY3RpbS5zaGlwcy5TdWJtYXJpbmUuaXNTdW5rKCkgJiZcbiAgICAgICAgICB2aWN0aW0uc2hpcHNbXCJQYXRyb2wgQm9hdFwiXS5pc1N1bmsoKVxuICAgICAgICApIHtcbiAgICAgICAgICBmZWVkYmFja01lc3NhZ2UgPSBcIlN1bmsgYWxsIHNoaXBzISDwn4+GXCI7XG4gICAgICAgICAgZ2FtZU92ZXIgPSB0cnVlO1xuICAgICAgICAgIHBvcHVsYXRlQm9hcmRzLnBvcHVsYXRlQWlCb2FyZFdoZW5HYW1lT3ZlcigpO1xuICAgICAgICAgIGdldE5vZGVzLmFpR3JvdW5kcy5zdHlsZS5wb2ludGVyRXZlbnRzID0gXCJub25lXCI7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGZlZWRiYWNrTWVzc2FnZTtcbiAgICB9O1xuXG4gICAgaWYgKGFpT3JVc2VyID09PSBcImFpXCIpIHtcbiAgICAgIGlmIChtaXNzZWRPckhpdCA9PT0gXCJtaXNzZWRcIikge1xuICAgICAgICBnZXROb2Rlcy5mZWVkYmFjay50ZXh0Q29udGVudCA9IGBBSTogTWlzc2VkIOKcl2A7XG4gICAgICB9XG4gICAgICBpZiAobWlzc2VkT3JIaXQgPT09IFwiaGl0XCIpIHtcbiAgICAgICAgY29uc3QgZmVlZGJhY2tNZXNzYWdlID0gZ2V0RmVlZGJhY2tNZXNzYWdlKFwiYWlcIik7XG4gICAgICAgIGdldE5vZGVzLmZlZWRiYWNrLmlubmVySFRNTCA9IGBBSTogJHtmZWVkYmFja01lc3NhZ2V9YDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoYWlPclVzZXIgPT09IFwidXNlclwiKSB7XG4gICAgICBpZiAobWlzc2VkT3JIaXQgPT09IFwibWlzc2VkXCIpIHtcbiAgICAgICAgZ2V0Tm9kZXMuZmVlZGJhY2sudGV4dENvbnRlbnQgPSBgQWRtaXJhbCAke3JldHJpZXZlQWRtaXJhbE5hbWVGcm9tU3RvcmFnZUFuZFNldC5hZG1pcmFsTmFtZX06IE1pc3NlZCDinJdgO1xuICAgICAgfVxuICAgICAgaWYgKG1pc3NlZE9ySGl0ID09PSBcImhpdFwiKSB7XG4gICAgICAgIGNvbnN0IGZlZWRiYWNrTWVzc2FnZSA9IGdldEZlZWRiYWNrTWVzc2FnZShcInVzZXJcIik7XG4gICAgICAgIGdldE5vZGVzLmZlZWRiYWNrLmlubmVySFRNTCA9IGBBZG1pcmFsICR7cmV0cmlldmVBZG1pcmFsTmFtZUZyb21TdG9yYWdlQW5kU2V0LmFkbWlyYWxOYW1lfTogJHtmZWVkYmFja01lc3NhZ2V9YDtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgY29uc3QgdHJpZ2dlclVzZXJUdXJuID0gZnVuY3Rpb24gKCkge1xuICAgIGlmIChnYW1lT3Zlcikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGdldE5vZGVzLmFpR3JvdW5kcy5zdHlsZS5wb2ludGVyRXZlbnRzID0gXCJhdXRvXCI7XG4gICAgZ2V0Tm9kZXMuYWlHcm91bmRzRGl2cy5mb3JFYWNoKChkaXYpID0+IHtcbiAgICAgIGRpdi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgICBjb25zdCBpbmFjdGl2YXRlQWxpZ25lZEJ1dHRvbiA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgZ2V0Tm9kZXMuYWxpZ25lZEJ1dHRvbi5zdHlsZS5wb2ludGVyRXZlbnRzID0gXCJub25lXCI7XG4gICAgICAgICAgZ2V0Tm9kZXMuYWxpZ25lZEJ1dHRvbi5zdHlsZS5jb2xvciA9IFwicmdiYSgyNTUsIDI1NSwgMjU1LCAwLjYpXCI7XG4gICAgICAgIH0pKCk7XG4gICAgICAgIGNvbnN0IGluYWN0aXZhdGVSZWFsaWduQnV0dG9uID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBnZXROb2Rlcy5yZWFsaWduQnV0dG9uLnN0eWxlLnBvaW50ZXJFdmVudHMgPSBcIm5vbmVcIjtcbiAgICAgICAgICBnZXROb2Rlcy5yZWFsaWduQnV0dG9uLnN0eWxlLmNvbG9yID0gXCJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuNilcIjtcbiAgICAgICAgfSkoKTtcbiAgICAgICAgLy8gSUYgZW1wdHlcbiAgICAgICAgaWYgKGRpdi5kYXRhc2V0LmF0dGFja2VkID09PSBcIk5vXCIgJiYgIWRpdi5oYXNBdHRyaWJ1dGUoXCJkYXRhLXNoaXBcIikpIHtcbiAgICAgICAgICBnYW1lLnVzZXJUdXJuKGRpdi5kYXRhc2V0LmluZGV4KTtcbiAgICAgICAgICBkaXNwbGF5QXR0YWNrKGRpdiwgXCJYXCIsIFwicmdiKDIyOCwgNzMsIDczKVwiKTtcbiAgICAgICAgICBzZXRGZWVkYmFjayhcInVzZXJcIiwgXCJtaXNzZWRcIik7XG4gICAgICAgICAgdHJpZ2dlckFpVHVybigpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAvLyBJRiBoaXRzIGEgc2hpcFxuICAgICAgICBpZiAoZGl2LmRhdGFzZXQuYXR0YWNrZWQgPT09IFwiTm9cIiAmJiBkaXYuaGFzQXR0cmlidXRlKFwiZGF0YS1zaGlwXCIpKSB7XG4gICAgICAgICAgZ2FtZS51c2VyVHVybihkaXYuZGF0YXNldC5pbmRleCk7XG4gICAgICAgICAgZGlzcGxheUF0dGFjayhkaXYsIFwi8J+SpVwiLCBcImJsYWNrXCIpO1xuICAgICAgICAgIHNldEZlZWRiYWNrKFwidXNlclwiLCBcImhpdFwiLCBkaXYuZGF0YXNldC5zaGlwKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9O1xuICB0cmlnZ2VyVXNlclR1cm4oKTtcblxuICBsZXQgYWlUaW1lciA9IDIwMDA7XG4gIGxldCByZWN1cnNpb25Db3VudCA9IDA7XG4gIGNvbnN0IHRyaWdnZXJBaVR1cm4gPSBhc3luYyBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKGdhbWVPdmVyKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZ2V0Tm9kZXMuYWlHcm91bmRzLnN0eWxlLnBvaW50ZXJFdmVudHMgPSBcIm5vbmVcIjtcbiAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgaWYgKGFpVGltZXIgIT09IDEpIHtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgZ2V0Tm9kZXMuZmVlZGJhY2sudGV4dENvbnRlbnQgPSBgQUk6IFRhcmdldGluZy4uLmA7XG4gICAgICAgIH0sIDE1MDApO1xuICAgICAgfVxuICAgICAgc2V0VGltZW91dChyZXNvbHZlLCBhaVRpbWVyKTtcbiAgICB9KTtcbiAgICBjb25zdCByYW5kb21LZXkgPSBnYW1lLmNvbXB1dGVyVHVybigpO1xuXG4gICAgZm9yIChjb25zdCBkaXYgb2YgZ2V0Tm9kZXMuYWRtaXJhbEdyb3VuZHNEaXZzKSB7XG4gICAgICBjb25zdCBkaWZmaWN1bHR5ID0gZ2V0RGlmZmljdWx0eS5kaWZmaWN1bHR5O1xuICAgICAgaWYgKGRpdi5kYXRhc2V0LmluZGV4ID09PSByYW5kb21LZXkpIHtcbiAgICAgICAgLy8gSUYgZW1wdHlcbiAgICAgICAgaWYgKGRpdi5kYXRhc2V0LmF0dGFja2VkID09PSBcIk5vXCIgJiYgIWRpdi5oYXNBdHRyaWJ1dGUoXCJkYXRhLXNoaXBcIikpIHtcbiAgICAgICAgICAvLyBSZWN1cnNlIGF0IGZhc3RlciB0aW1lb3V0IGlmIGRpZmZpY3VsdHkgaXMgSW1wb3NzaWJsZVxuICAgICAgICAgIGlmIChkaWZmaWN1bHR5ID09PSBcImltcG9zc2libGVcIikge1xuICAgICAgICAgICAgaWYgKHJlY3Vyc2lvbkNvdW50ID4gMCkge1xuICAgICAgICAgICAgICBhaVRpbWVyID0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlY3Vyc2lvbkNvdW50ICs9IDE7XG4gICAgICAgICAgICB0cmlnZ2VyQWlUdXJuKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29uc3QgcmVzZXREdW1teVRpbWVyUGFyYW1ldGVycyA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoZGlmZmljdWx0eSA9PT0gXCJkdW1teVwiKSB7XG4gICAgICAgICAgICAgIHJlY3Vyc2lvbkNvdW50ID0gMDtcbiAgICAgICAgICAgICAgYWlUaW1lciA9IDIwMDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSkoKTtcblxuICAgICAgICAgIGRpc3BsYXlBdHRhY2soZGl2LCBcIlhcIiwgXCJyZ2IoMjI4LCA3MywgNzMpXCIpO1xuICAgICAgICAgIHNldEZlZWRiYWNrKFwiYWlcIiwgXCJtaXNzZWRcIik7XG4gICAgICAgICAgZ2V0Tm9kZXMuYWlHcm91bmRzLnN0eWxlLnBvaW50ZXJFdmVudHMgPSBcImF1dG9cIjtcbiAgICAgICAgfVxuICAgICAgICAvLyBJRiBoaXRzIGEgc2hpcFxuICAgICAgICBpZiAoZGl2LmRhdGFzZXQuYXR0YWNrZWQgPT09IFwiTm9cIiAmJiBkaXYuaGFzQXR0cmlidXRlKFwiZGF0YS1zaGlwXCIpKSB7XG4gICAgICAgICAgLy8gUmVjdXJzZSBhdCBmYXN0ZXIgdGltZW91dCBpZiBkaWZmaWN1bHR5IGlzIGR1bW15XG4gICAgICAgICAgaWYgKGRpZmZpY3VsdHkgPT09IFwiZHVtbXlcIikge1xuICAgICAgICAgICAgaWYgKHJlY3Vyc2lvbkNvdW50ID4gMCkge1xuICAgICAgICAgICAgICBhaVRpbWVyID0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlY3Vyc2lvbkNvdW50ICs9IDE7XG4gICAgICAgICAgICB0cmlnZ2VyQWlUdXJuKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29uc3QgcmVzZXRJbXBvc3NpYmxlVGltZXJQYXJhbWV0ZXJzID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmIChkaWZmaWN1bHR5ID09PSBcImltcG9zc2libGVcIikge1xuICAgICAgICAgICAgICByZWN1cnNpb25Db3VudCA9IDA7XG4gICAgICAgICAgICAgIGFpVGltZXIgPSAyMDAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pKCk7XG5cbiAgICAgICAgICBkaXNwbGF5QXR0YWNrKGRpdiwgXCLwn5KlXCIsIFwiYmxhY2tcIik7XG4gICAgICAgICAgc2V0RmVlZGJhY2soXCJhaVwiLCBcImhpdFwiLCBkaXYuZGF0YXNldC5zaGlwKTtcbiAgICAgICAgICB0cmlnZ2VyQWlUdXJuKCk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiB7IGdhbWVPdmVyIH07XG59KSgpO1xuXG5sZXQgY2F0Y2hFdmVudENsZWFyaW5nTG9naWMgPSBudWxsO1xubGV0IGlzU2hpcFBvc2l0aW9uQ2hhbmdlZCA9IGZhbHNlO1xuY29uc3Qgc2V0RHJhZ0FuZERyb3AgPSBmdW5jdGlvbiAoKSB7XG4gIGNvbnN0IGdhbWUgPSBwb3B1bGF0ZUJvYXJkcy5nYW1lO1xuXG4gIGNvbnN0IHNldEF0dHJpYnV0ZXMgPSAoZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IGxlZ2FsTW92ZXMgPSBnYW1lLnVzZXIuZ2V0TGVnYWxNb3ZlcygpO1xuICAgIGNvbnN0IGRlZmF1bHRVc2VyQm9hcmQgPSBnYW1lLnVzZXIuYm9hcmQ7XG5cbiAgICBnZXROb2Rlcy5hZG1pcmFsR3JvdW5kc0RpdnMuZm9yRWFjaCgoZGl2KSA9PiB7XG4gICAgICBpZiAoZGl2LmRhdGFzZXQuc2hpcCkge1xuICAgICAgICBkaXYuc2V0QXR0cmlidXRlKFwiZHJhZ2dhYmxlXCIsIHRydWUpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgY29uc3QgZ2V0TW92ZXMgPSBmdW5jdGlvbiAoc2hpcEluZGV4KSB7XG4gICAgICBjb25zdCBzaGlwTW92ZXMgPSBsZWdhbE1vdmVzW3NoaXBJbmRleF07XG4gICAgICBjb25zdCBzaGlwTGVnYWxNb3ZlcyA9IFtdO1xuICAgICAgY29uc3Qgc2hpcElsbGVnYWxNb3ZlcyA9IFtdO1xuICAgICAgY29uc3QgZGVmaW5lTW92ZXNGb3JFYWNoU2hpcFJvdyA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGZvciAobGV0IG4gPSAwOyBuIDwgMTA7IG4rKykge1xuICAgICAgICAgIHNoaXBMZWdhbE1vdmVzLnB1c2goW10pO1xuICAgICAgICAgIHNoaXBJbGxlZ2FsTW92ZXMucHVzaChbXSk7XG4gICAgICAgIH1cbiAgICAgIH0pKCk7XG5cbiAgICAgIGRlZmF1bHRVc2VyQm9hcmQuZm9yRWFjaCgoc2hpcFJvdywgcm93SW5kZXgpID0+IHtcbiAgICAgICAgc2hpcE1vdmVzLmZvckVhY2goKG1vdmVzLCBpbmRleCkgPT4ge1xuICAgICAgICAgIGNvbnN0IHZhbHVlcyA9IFtdO1xuICAgICAgICAgIGZvciAobGV0IG4gPSAwOyBuIDwgbW92ZXMubGVuZ3RoOyBuKyspIHtcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gc2hpcFJvd1ttb3Zlc1tuXV07XG4gICAgICAgICAgICB2YWx1ZXMucHVzaCh2YWx1ZSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29uc3QgY2hlY2tMZWdhbGl0eSA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjb25zdCBpc0FsbE51bGwgPSB2YWx1ZXMuZXZlcnkoKHZhbHVlKSA9PiB2YWx1ZSA9PT0gbnVsbCk7XG4gICAgICAgICAgICBpZiAoaXNBbGxOdWxsKSB7XG4gICAgICAgICAgICAgIHNoaXBMZWdhbE1vdmVzW3Jvd0luZGV4XS5wdXNoKG1vdmVzWzBdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghaXNBbGxOdWxsKSB7XG4gICAgICAgICAgICAgIHNoaXBJbGxlZ2FsTW92ZXNbcm93SW5kZXhdLnB1c2gobW92ZXNbMF0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pKCk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4geyBzaGlwTGVnYWxNb3Zlcywgc2hpcElsbGVnYWxNb3ZlcyB9O1xuICAgIH07XG5cbiAgICBjb25zdCBzZXRTaGlwQXR0cmlidXRlcyA9IGZ1bmN0aW9uIChzaGlwSW5kZXgsIHNoaXBMZW5ndGgpIHtcbiAgICAgIGNvbnN0IHNoaXBNb3ZlcyA9IGdldE1vdmVzKHNoaXBJbmRleCk7XG4gICAgICBjb25zdCBzaGlwTGVnYWxNb3ZlcyA9IHNoaXBNb3Zlcy5zaGlwTGVnYWxNb3ZlcztcbiAgICAgIGNvbnN0IHNoaXBJbGxlZ2FsTW92ZXMgPSBzaGlwTW92ZXMuc2hpcElsbGVnYWxNb3ZlcztcblxuICAgICAgZ2V0Tm9kZXMuYWRtaXJhbEdyb3VuZHNEaXZzLmZvckVhY2goKGRpdiwgZGl2SW5kZXgpID0+IHtcbiAgICAgICAgc2hpcExlZ2FsTW92ZXMuZm9yRWFjaCgobW92ZXMsIG1vdmVzSW5kZXgpID0+IHtcbiAgICAgICAgICBpZiAobW92ZXMpIHtcbiAgICAgICAgICAgIGlmIChtb3Zlc0luZGV4ID09PSBwYXJzZUludChkaXZJbmRleCAvIDEwKSkge1xuICAgICAgICAgICAgICBtb3Zlcy5mb3JFYWNoKChtb3ZlKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKG1vdmUgPT09IGRpdkluZGV4ICUgMTApIHtcbiAgICAgICAgICAgICAgICAgIGRpdi5jbGFzc0xpc3QuYWRkKGBkcm9wcGFibGUke3NoaXBMZW5ndGh9YCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBzaGlwSWxsZWdhbE1vdmVzLmZvckVhY2goKG1vdmVzLCBtb3Zlc0luZGV4KSA9PiB7XG4gICAgICAgICAgaWYgKG1vdmVzKSB7XG4gICAgICAgICAgICBpZiAobW92ZXNJbmRleCA9PT0gcGFyc2VJbnQoZGl2SW5kZXggLyAxMCkpIHtcbiAgICAgICAgICAgICAgbW92ZXMuZm9yRWFjaCgobW92ZSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChtb3ZlID09PSBkaXZJbmRleCAlIDEwKSB7XG4gICAgICAgICAgICAgICAgICBkaXYuY2xhc3NMaXN0LmFkZChgbm90LWRyb3BwYWJsZSR7c2hpcExlbmd0aH1gKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIHNldFNoaXBBdHRyaWJ1dGVzKDAsIDUpO1xuICAgIHNldFNoaXBBdHRyaWJ1dGVzKDEsIDQpO1xuICAgIHNldFNoaXBBdHRyaWJ1dGVzKDIsIDMpO1xuICAgIHNldFNoaXBBdHRyaWJ1dGVzKDMsIDMpO1xuICAgIHNldFNoaXBBdHRyaWJ1dGVzKDQsIDIpO1xuICB9KSgpO1xuICBjb25zdCBkcmFnZ2FibGVTaGlwcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJkaXZbZHJhZ2dhYmxlPSd0cnVlJ11cIik7XG5cbiAgY29uc3QgY2FycmllckRyb3BwYWJsZVNwb3RzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5kcm9wcGFibGU1XCIpO1xuICBjb25zdCBjYXJyaWVyTm90RHJvcHBhYmxlU3BvdHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLm5vdC1kcm9wcGFibGU1XCIpO1xuXG4gIGNvbnN0IGJhdHRsZXNoaXBEcm9wcGFibGVTcG90cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZHJvcHBhYmxlNFwiKTtcbiAgY29uc3QgYmF0dGxlc2hpcE5vdERyb3BwYWJsZVNwb3RzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5ub3QtZHJvcHBhYmxlNFwiKTtcblxuICBjb25zdCBkZXNBbmRTdWJEcm9wcGFibGVTcG90cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZHJvcHBhYmxlM1wiKTtcbiAgY29uc3QgZGVzQW5kU3ViTm90RHJvcHBhYmxlU3BvdHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLm5vdC1kcm9wcGFibGUzXCIpO1xuXG4gIGNvbnN0IHBhdHJvbEJvYXREcm9wcGFibGVTcG90cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZHJvcHBhYmxlMlwiKTtcbiAgY29uc3QgcGF0cm9sQm9hdE5vdERyb3BwYWJsZVNwb3RzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5ub3QtZHJvcHBhYmxlMlwiKTtcblxuICBsZXQgY2F0Y2hFdmVudERhdGFzZXQgPSBudWxsO1xuICBjb25zdCBkcmFnU3RhcnQgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICBldmVudC5kYXRhVHJhbnNmZXIuc2V0RGF0YShcInRleHQvcGxhaW5cIiwgZXZlbnQudGFyZ2V0LmRhdGFzZXQuc2hpcCk7XG4gICAgY2F0Y2hFdmVudERhdGFzZXQgPSBldmVudC50YXJnZXQuZGF0YXNldC5zaGlwO1xuXG4gICAgLy8gU2VsZWN0IGZpcnN0IHNoaXBcbiAgICBjb25zdCBkcmFnZ2VkU2hpcCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLXNoaXA9JyR7Y2F0Y2hFdmVudERhdGFzZXR9J11gKTtcbiAgICBjb25zdCBzaGlwSW1nID0gZHJhZ2dlZFNoaXAucXVlcnlTZWxlY3RvcihcImltZ1wiKTtcbiAgICBsZXQgeE9mZnNldCA9IDA7XG4gICAgLy8gY29uc3QgY3JlYXRlWE9mZnNldCA9IChmdW5jdGlvbiAoKSB7XG4gICAgLy8gICBjb25zdCB0YXJnZXRzSW5kaWNlcyA9IFtdO1xuICAgIC8vICAgY29uc3QgZ2V0VGFyZ2V0c0luZGljZXMgPSAoZnVuY3Rpb24gKCkge1xuICAgIC8vICAgICBsZXQgY3VycmVudFRhcmdldCA9IGRyYWdnZWRTaGlwO1xuICAgIC8vICAgICBmb3IgKGxldCBuID0gMDsgbiA8IHBhcnNlSW50KGNhdGNoRXZlbnREYXRhc2V0KTsgbisrKSB7XG4gICAgLy8gICAgICAgaWYgKCFjdXJyZW50VGFyZ2V0KSB7XG4gICAgLy8gICAgICAgICByZXR1cm47XG4gICAgLy8gICAgICAgfVxuICAgIC8vICAgICAgIHRhcmdldHNJbmRpY2VzLnB1c2goY3VycmVudFRhcmdldC5kYXRhc2V0LmluZGV4KTtcbiAgICAvLyAgICAgICBjdXJyZW50VGFyZ2V0ID0gY3VycmVudFRhcmdldC5uZXh0RWxlbWVudFNpYmxpbmc7XG4gICAgLy8gICAgIH1cbiAgICAvLyAgIH0pKCk7XG4gICAgLy8gICB0YXJnZXRzSW5kaWNlcy5mb3JFYWNoKChpbmRleCwgY291bnQpID0+IHtcbiAgICAvLyAgICAgaWYgKGluZGV4ID09PSBldmVudC50YXJnZXQuZGF0YXNldC5pbmRleCkge1xuICAgIC8vICAgICAgIHhPZmZzZXQgPSBjb3VudCAqIDMwO1xuICAgIC8vICAgICB9XG4gICAgLy8gICB9KTtcbiAgICAvLyB9KSgpO1xuICAgIGV2ZW50LmRhdGFUcmFuc2Zlci5zZXREcmFnSW1hZ2Uoc2hpcEltZywgeE9mZnNldCwgMjApO1xuXG4gICAgY29uc3QgdHJpZ2dlclJpZ2h0RHJhZ0Ryb3BTaGlwID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgIHN3aXRjaCAoY2F0Y2hFdmVudERhdGFzZXQpIHtcbiAgICAgICAgY2FzZSBcIjVcIjpcbiAgICAgICAgICB0cmlnZ2VyQ2FycmllckRyYWdEcm9wKCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCI0XCI6XG4gICAgICAgICAgdHJpZ2dlckJhdHRsZXNoaXBEcmFnRHJvcCgpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiMy41XCI6XG4gICAgICAgICAgdHJpZ2dlckRlc0FuZFN1YkRyYWdEcm9wKCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCIzXCI6XG4gICAgICAgICAgdHJpZ2dlckRlc0FuZFN1YkRyYWdEcm9wKCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCIyXCI6XG4gICAgICAgICAgdHJpZ2dlclBhdHJvbEJvYXREcmFnRHJvcCgpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH0pKCk7XG4gIH07XG5cbiAgY29uc3QgZHJhZ092ZXIgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgY29uc3Qgc2V0SG92ZXJpbmdDb2xvciA9IChmdW5jdGlvbiAoKSB7XG4gICAgICBsZXQgY3VycmVudFRhcmdldCA9IGV2ZW50LnRhcmdldDtcbiAgICAgIGZvciAobGV0IG4gPSAwOyBuIDwgcGFyc2VJbnQoY2F0Y2hFdmVudERhdGFzZXQpOyBuKyspIHtcbiAgICAgICAgaWYgKCFjdXJyZW50VGFyZ2V0KSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGN1cnJlbnRUYXJnZXQuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJyZ2JhKDk4LCAyNTMsIDYwLCAwLjUpXCI7XG4gICAgICAgIGN1cnJlbnRUYXJnZXQgPSBjdXJyZW50VGFyZ2V0Lm5leHRFbGVtZW50U2libGluZztcbiAgICAgIH1cbiAgICB9KSgpO1xuICB9O1xuXG4gIGNvbnN0IGRyYWdMZWF2ZSA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgIGNvbnN0IHJlbW92ZUhvdmVyaW5nQ29sb3IgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgbGV0IGN1cnJlbnRUYXJnZXQgPSBldmVudC50YXJnZXQ7XG4gICAgICBmb3IgKGxldCBuID0gMDsgbiA8IHBhcnNlSW50KGNhdGNoRXZlbnREYXRhc2V0KTsgbisrKSB7XG4gICAgICAgIGlmICghY3VycmVudFRhcmdldCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjdXJyZW50VGFyZ2V0LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiaW5pdGlhbFwiO1xuICAgICAgICBjdXJyZW50VGFyZ2V0ID0gY3VycmVudFRhcmdldC5uZXh0RWxlbWVudFNpYmxpbmc7XG4gICAgICB9XG4gICAgfSkoKTtcbiAgfTtcblxuICBjb25zdCBkcm9wID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICBjb25zdCBzaGlwRGF0YXNldCA9IGV2ZW50LmRhdGFUcmFuc2Zlci5nZXREYXRhKFwidGV4dC9wbGFpblwiKTtcbiAgICBjb25zdCBkcm9wVGFyZ2V0ID0gZXZlbnQudGFyZ2V0O1xuXG4gICAgY29uc3QgcmVtb3ZlSG92ZXJpbmdDb2xvciA9IChmdW5jdGlvbiAoKSB7XG4gICAgICBsZXQgY3VycmVudFRhcmdldCA9IGV2ZW50LnRhcmdldDtcbiAgICAgIGZvciAobGV0IG4gPSAwOyBuIDwgcGFyc2VJbnQoY2F0Y2hFdmVudERhdGFzZXQpOyBuKyspIHtcbiAgICAgICAgaWYgKCFjdXJyZW50VGFyZ2V0KSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGN1cnJlbnRUYXJnZXQuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJpbml0aWFsXCI7XG4gICAgICAgIGN1cnJlbnRUYXJnZXQgPSBjdXJyZW50VGFyZ2V0Lm5leHRFbGVtZW50U2libGluZztcbiAgICAgIH1cbiAgICB9KSgpO1xuXG4gICAgY29uc3QgZHJhZ2dlZFNoaXAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBbZGF0YS1zaGlwPScke3NoaXBEYXRhc2V0fSddYCk7XG4gICAgY29uc3QgcmVtb3ZlU2NhbGluZyA9IChmdW5jdGlvbiAoKSB7XG4gICAgICBkcm9wVGFyZ2V0LnN0eWxlLnRyYW5zZm9ybSA9IFwic2NhbGUoMSlcIjtcbiAgICB9KSgpO1xuXG4gICAgY29uc3QgYXBwZW5kU2hpcFRvVGFyZ2V0ID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgIC8vIEFwcGVuZCBzaGlwIGltZyBvZiB0aGUgZmlyc3QgZGl2KGluIHRoZSBzZXQgb2YgZGl2cyB3aXRoIHNhbWUgZGF0YXNldCkgdG8gdGhlIHRhcmdldCBkaXZcbiAgICAgIGNvbnN0IHNoaXBJbWcgPSBkcmFnZ2VkU2hpcC5xdWVyeVNlbGVjdG9yKFwiaW1nXCIpO1xuICAgICAgZHJvcFRhcmdldC5hcHBlbmRDaGlsZChzaGlwSW1nKTtcbiAgICB9KSgpO1xuXG4gICAgY29uc3QgdHJhbnNmZXJBdHRyaWJ1dGVzRnJvbURyYWdnZWRTaGlwc1RvVGFyZ2V0cyA9IChmdW5jdGlvbiAoKSB7XG4gICAgICBjb25zdCByZW1vdmVBdHRyaWJ1dGVzID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY29uc3QgZHJhZ2dlZFNoaXBzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgW2RhdGEtc2hpcD0nJHtzaGlwRGF0YXNldH0nXWApO1xuICAgICAgICBkcmFnZ2VkU2hpcHMuZm9yRWFjaCgoc2hpcCkgPT4ge1xuICAgICAgICAgIHNoaXAucmVtb3ZlQXR0cmlidXRlKFwiZGF0YS1zaGlwXCIpO1xuICAgICAgICAgIHNoaXAuc2V0QXR0cmlidXRlKFwiZHJhZ2dhYmxlXCIsIGZhbHNlKTtcbiAgICAgICAgfSk7XG4gICAgICB9KSgpO1xuXG4gICAgICBjb25zdCBhZGRUb1RhcmdldHMgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICBsZXQgY3VycmVudFRhcmdldCA9IGV2ZW50LnRhcmdldDtcbiAgICAgICAgZm9yIChsZXQgbiA9IDA7IG4gPCBwYXJzZUludChjYXRjaEV2ZW50RGF0YXNldCk7IG4rKykge1xuICAgICAgICAgIGlmICghY3VycmVudFRhcmdldCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjdXJyZW50VGFyZ2V0LnNldEF0dHJpYnV0ZShcImRhdGEtc2hpcFwiLCBgJHtjYXRjaEV2ZW50RGF0YXNldH1gKTtcbiAgICAgICAgICBjdXJyZW50VGFyZ2V0LnNldEF0dHJpYnV0ZShcImRyYWdnYWJsZVwiLCB0cnVlKTtcbiAgICAgICAgICBjdXJyZW50VGFyZ2V0ID0gY3VycmVudFRhcmdldC5uZXh0RWxlbWVudFNpYmxpbmc7XG4gICAgICAgIH1cbiAgICAgIH0pKCk7XG4gICAgfSkoKTtcblxuICAgIGNvbnN0IGluZGljYXRlUG9zaXRpb25DaGFuZ2UgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgaXNTaGlwUG9zaXRpb25DaGFuZ2VkID0gdHJ1ZTtcbiAgICB9KSgpO1xuXG4gICAgY29uc3QgdXBkYXRlQm9hcmQgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgY29uc3QgZ2VuZXJhdGVLZXlzID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gQWxwaGFiZXRzIEEtSlxuICAgICAgICBjb25zdCBhbHBoYWJldHMgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgbiA9IDY1OyBuIDw9IDc0OyBuKyspIHtcbiAgICAgICAgICBhbHBoYWJldHMucHVzaChTdHJpbmcuZnJvbUNoYXJDb2RlKG4pKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGtleXMgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgbSA9IDE7IG0gPD0gMTA7IG0rKykge1xuICAgICAgICAgIGNvbnN0IHN1YktleXMgPSBbXTtcbiAgICAgICAgICBmb3IgKGNvbnN0IGxldHRlciBvZiBhbHBoYWJldHMpIHtcbiAgICAgICAgICAgIHN1YktleXMucHVzaChgJHttfWAgKyBsZXR0ZXIpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBrZXlzLnB1c2goc3ViS2V5cyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ga2V5cztcbiAgICAgIH0pKCk7XG5cbiAgICAgIGNvbnN0IGFzc2lnbktleXNUb0JvYXJkSW5kaWNlcyA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNvbnN0IEtleXNCb3ggPSB7fTtcbiAgICAgICAgY29uc3Qga2V5cyA9IGdlbmVyYXRlS2V5cztcblxuICAgICAgICBmb3IgKGxldCByb3dJbmRleCA9IDA7IHJvd0luZGV4IDwgMTA7IHJvd0luZGV4KyspIHtcbiAgICAgICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgMTA7IGluZGV4KyspIHtcbiAgICAgICAgICAgIEtleXNCb3hbYCR7a2V5c1tyb3dJbmRleF1baW5kZXhdfWBdID0gW2luZGV4LCByb3dJbmRleF07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBLZXlzQm94O1xuICAgICAgfSkoKTtcblxuICAgICAgY29uc3QgY2xlYXJTaGlwc0JvdWRhcmllcyA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGdhbWUudXNlci5ib2FyZC5mb3JFYWNoKChyb3csIHJvd0luZGV4KSA9PiB7XG4gICAgICAgICAgcm93LmZvckVhY2goKHZhbHVlLCB2YWx1ZUluZGV4KSA9PiB7XG4gICAgICAgICAgICBpZiAodmFsdWUgPT09IFwiT1wiKSB7XG4gICAgICAgICAgICAgIGdhbWUudXNlci5ib2FyZFtyb3dJbmRleF1bdmFsdWVJbmRleF0gPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH0pKCk7XG5cbiAgICAgIGNvbnN0IHRyYW5zZmVyRHJvcHBlZFNoaXAgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICBjb25zdCBuZXdTcG90c0luZGljZXMgPSBbXTtcbiAgICAgICAgY29uc3QgZ2V0RHJvcHBlZFNoaXBTcG90c0luZGljZXMgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGxldCBjdXJyZW50VGFyZ2V0ID0gZXZlbnQudGFyZ2V0O1xuICAgICAgICAgIGZvciAobGV0IG4gPSAwOyBuIDwgcGFyc2VJbnQoY2F0Y2hFdmVudERhdGFzZXQpOyBuKyspIHtcbiAgICAgICAgICAgIGlmICghY3VycmVudFRhcmdldCkge1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBpbmRleCA9IGN1cnJlbnRUYXJnZXQuZGF0YXNldC5pbmRleDtcbiAgICAgICAgICAgIG5ld1Nwb3RzSW5kaWNlcy5wdXNoKGluZGV4KTtcbiAgICAgICAgICAgIGN1cnJlbnRUYXJnZXQgPSBjdXJyZW50VGFyZ2V0Lm5leHRFbGVtZW50U2libGluZztcbiAgICAgICAgICB9XG4gICAgICAgIH0pKCk7XG5cbiAgICAgICAgY29uc3QgY2xlYXJTaGlwRnJvbU9sZFNwb3RzID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBnYW1lLnVzZXIuYm9hcmQuZm9yRWFjaCgocm93LCByb3dJbmRleCkgPT4ge1xuICAgICAgICAgICAgcm93LmZvckVhY2goKHZhbHVlLCB2YWx1ZUluZGV4KSA9PiB7XG4gICAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gcGFyc2VGbG9hdChjYXRjaEV2ZW50RGF0YXNldCkpIHtcbiAgICAgICAgICAgICAgICBnYW1lLnVzZXIuYm9hcmRbcm93SW5kZXhdW3ZhbHVlSW5kZXhdID0gbnVsbDtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pKCk7XG5cbiAgICAgICAgY29uc3QgYWRkU2hpcFRvTmV3U3BvdHMgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGNvbnN0IGJvYXJkSW5kaWNlcyA9IFtdO1xuICAgICAgICAgIGNvbnN0IEtleXNCb3ggPSBhc3NpZ25LZXlzVG9Cb2FyZEluZGljZXM7XG4gICAgICAgICAgbmV3U3BvdHNJbmRpY2VzLmZvckVhY2goKGluZGV4KSA9PiB7XG4gICAgICAgICAgICBib2FyZEluZGljZXMucHVzaChLZXlzQm94W2luZGV4XSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgYm9hcmRJbmRpY2VzLmZvckVhY2goKGluZGV4KSA9PiB7XG4gICAgICAgICAgICBnYW1lLnVzZXIuYm9hcmRbaW5kZXhbMV1dW2luZGV4WzBdXSA9IHBhcnNlRmxvYXQoY2F0Y2hFdmVudERhdGFzZXQpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KSgpO1xuXG4gICAgICAgIGNvbnN0IGJvYXJkID0gZ2FtZS51c2VyLmJvYXJkO1xuICAgICAgICBjb25zdCBhZGROZXdCb3VuZGFyaWVzID0gZnVuY3Rpb24gKHJvd0luZGV4LCBzaGlwTGVuZ3RoKSB7XG4gICAgICAgICAgY29uc3QgcG9wdWxhdGVkUm93ID0gYm9hcmRbcm93SW5kZXhdO1xuICAgICAgICAgIGNvbnN0IGxhc3RPY2N1cGllZCA9IHBvcHVsYXRlZFJvdy5sYXN0SW5kZXhPZihzaGlwTGVuZ3RoKTtcbiAgICAgICAgICBsZXQgZmlyc3RPY2N1cGllZCA9IG51bGw7XG5cbiAgICAgICAgICBjb25zdCBvY2N1cHkgPSBmdW5jdGlvbiAoXG4gICAgICAgICAgICBmaXJzdEluZGV4RW1wdHksXG4gICAgICAgICAgICBsYXN0SW5kZXhFbXB0eSxcbiAgICAgICAgICAgIGZpcnN0VG9wQm90dG9tLFxuICAgICAgICAgICAgbGFzdFRvcEJvdHRvbSxcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIC8vIE9jY3VweSBmaXJzdCBhbmQgbGFzdCBpbmRleCBvZiBzaGlwXG4gICAgICAgICAgICBmaXJzdE9jY3VwaWVkID0gcG9wdWxhdGVkUm93LmluZGV4T2Yoc2hpcExlbmd0aCk7XG4gICAgICAgICAgICBpZiAoZmlyc3RJbmRleEVtcHR5ICYmICFsYXN0SW5kZXhFbXB0eSkge1xuICAgICAgICAgICAgICBwb3B1bGF0ZWRSb3dbZmlyc3RPY2N1cGllZCAtIDFdID0gXCJPXCI7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCFmaXJzdEluZGV4RW1wdHkgJiYgbGFzdEluZGV4RW1wdHkpIHtcbiAgICAgICAgICAgICAgcG9wdWxhdGVkUm93W2xhc3RPY2N1cGllZCArIDFdID0gXCJPXCI7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGZpcnN0SW5kZXhFbXB0eSAmJiBsYXN0SW5kZXhFbXB0eSkge1xuICAgICAgICAgICAgICBwb3B1bGF0ZWRSb3dbZmlyc3RPY2N1cGllZCAtIDFdID0gXCJPXCI7XG4gICAgICAgICAgICAgIHBvcHVsYXRlZFJvd1tsYXN0T2NjdXBpZWQgKyAxXSA9IFwiT1wiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gT2NjdXB5IHRvcCBhbmQvb3IgYm90dG9tXG4gICAgICAgICAgICBpZiAocm93SW5kZXggPT09IDApIHtcbiAgICAgICAgICAgICAgY29uc3QgYm90dG9tQWRqYWNlbnRSb3cgPSBib2FyZFsxXTtcbiAgICAgICAgICAgICAgYm90dG9tQWRqYWNlbnRSb3cuZmlsbChcbiAgICAgICAgICAgICAgICBcIk9cIixcbiAgICAgICAgICAgICAgICBmaXJzdE9jY3VwaWVkIC0gZmlyc3RUb3BCb3R0b20sXG4gICAgICAgICAgICAgICAgbGFzdE9jY3VwaWVkICsgbGFzdFRvcEJvdHRvbSxcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAocm93SW5kZXggPT09IDkpIHtcbiAgICAgICAgICAgICAgY29uc3QgdG9wQWRqYWNlbnRSb3cgPSBib2FyZFs4XTtcbiAgICAgICAgICAgICAgdG9wQWRqYWNlbnRSb3cuZmlsbChcbiAgICAgICAgICAgICAgICBcIk9cIixcbiAgICAgICAgICAgICAgICBmaXJzdE9jY3VwaWVkIC0gZmlyc3RUb3BCb3R0b20sXG4gICAgICAgICAgICAgICAgbGFzdE9jY3VwaWVkICsgbGFzdFRvcEJvdHRvbSxcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGNvbnN0IHRvcEFkamFjZW50Um93ID0gYm9hcmRbcm93SW5kZXggLSAxXTtcbiAgICAgICAgICAgICAgY29uc3QgYm90dG9tQWRqYWNlbnRSb3cgPSBib2FyZFtyb3dJbmRleCArIDFdO1xuICAgICAgICAgICAgICB0b3BBZGphY2VudFJvdy5maWxsKFxuICAgICAgICAgICAgICAgIFwiT1wiLFxuICAgICAgICAgICAgICAgIGZpcnN0T2NjdXBpZWQgLSBmaXJzdFRvcEJvdHRvbSxcbiAgICAgICAgICAgICAgICBsYXN0T2NjdXBpZWQgKyBsYXN0VG9wQm90dG9tLFxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICBib3R0b21BZGphY2VudFJvdy5maWxsKFxuICAgICAgICAgICAgICAgIFwiT1wiLFxuICAgICAgICAgICAgICAgIGZpcnN0T2NjdXBpZWQgLSBmaXJzdFRvcEJvdHRvbSxcbiAgICAgICAgICAgICAgICBsYXN0T2NjdXBpZWQgKyBsYXN0VG9wQm90dG9tLFxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH07XG5cbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICBwb3B1bGF0ZWRSb3dbcG9wdWxhdGVkUm93LmluZGV4T2Yoc2hpcExlbmd0aCkgLSAxXSA9PT0gbnVsbCAmJlxuICAgICAgICAgICAgcG9wdWxhdGVkUm93W2xhc3RPY2N1cGllZCArIDFdICE9PSBudWxsXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICBvY2N1cHkodHJ1ZSwgZmFsc2UsIDEsIDEpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgICBwb3B1bGF0ZWRSb3dbcG9wdWxhdGVkUm93LmluZGV4T2Yoc2hpcExlbmd0aCkgLSAxXSAhPT0gbnVsbCAmJlxuICAgICAgICAgICAgcG9wdWxhdGVkUm93W2xhc3RPY2N1cGllZCArIDFdID09PSBudWxsXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICBvY2N1cHkoZmFsc2UsIHRydWUsIDAsIDIpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgICBwb3B1bGF0ZWRSb3dbcG9wdWxhdGVkUm93LmluZGV4T2Yoc2hpcExlbmd0aCkgLSAxXSA9PT0gbnVsbCAmJlxuICAgICAgICAgICAgcG9wdWxhdGVkUm93W2xhc3RPY2N1cGllZCArIDFdID09PSBudWxsXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICBvY2N1cHkodHJ1ZSwgdHJ1ZSwgMSwgMik7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG9jY3VweShmYWxzZSwgZmFsc2UsIDAsIDEpO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBzZXRCb3VuZGFyaWVzID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBmb3IgKGNvbnN0IHJvdyBvZiBib2FyZCkge1xuICAgICAgICAgICAgY29uc3QgaXNBbGxOdWxsID0gcm93LmV2ZXJ5KChlbnRyeSkgPT4gZW50cnkgPT09IG51bGwpO1xuICAgICAgICAgICAgaWYgKGlzQWxsTnVsbCkge1xuICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgZW50cmllcyA9IFtdO1xuICAgICAgICAgICAgcm93LmZvckVhY2goKGVudHJ5KSA9PiB7XG4gICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICBlbnRyeSA9PT0gNSB8fFxuICAgICAgICAgICAgICAgIGVudHJ5ID09PSA0IHx8XG4gICAgICAgICAgICAgICAgZW50cnkgPT09IDMuNSB8fFxuICAgICAgICAgICAgICAgIGVudHJ5ID09PSAzIHx8XG4gICAgICAgICAgICAgICAgZW50cnkgPT09IDJcbiAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgLy8gYXZvaWRNb3JlVGhhbk9uZUZ1bmN0aW9uQ2FsbE9uRW50cnlcbiAgICAgICAgICAgICAgICBpZiAoZW50cmllcy5pbmNsdWRlcyhlbnRyeSkpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZW50cmllcy5wdXNoKGVudHJ5KTtcbiAgICAgICAgICAgICAgICBhZGROZXdCb3VuZGFyaWVzKGJvYXJkLmluZGV4T2Yocm93KSwgZW50cnkpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gY29uc29sZS5sb2coZ2FtZS51c2VyLmJvYXJkKTtcbiAgICAgICAgfSkoKTtcbiAgICAgIH0pKCk7XG4gICAgfSkoKTtcblxuICAgIGNvbnN0IHJlbW92ZU9sZEF0dHJpYnV0ZXNBbmRFdmVudExpc3RlbmVycyA9IChmdW5jdGlvbiAoKSB7XG4gICAgICBnZXROb2Rlcy5hZG1pcmFsR3JvdW5kc0RpdnMuZm9yRWFjaCgoZGl2KSA9PiB7XG4gICAgICAgIGRpdi5jbGFzc0xpc3QgPSBbXTtcbiAgICAgIH0pO1xuICAgICAgLy8gUmVtb3ZlIGFsbCBldmVudCBsaXN0ZW5lcnNcbiAgICAgIGdldE5vZGVzLmFkbWlyYWxHcm91bmRzRGl2cy5mb3JFYWNoKChkaXYpID0+IHtcbiAgICAgICAgZGl2LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJkcmFnc3RhcnRcIiwgZHJhZ1N0YXJ0KTtcbiAgICAgICAgZGl2LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJkcmFnb3ZlclwiLCBkcmFnT3Zlcik7XG4gICAgICAgIGRpdi5yZW1vdmVFdmVudExpc3RlbmVyKFwiZHJhZ2xlYXZlXCIsIGRyYWdMZWF2ZSk7XG4gICAgICAgIGRpdi5yZW1vdmVFdmVudExpc3RlbmVyKFwiZHJvcFwiLCBkcm9wKTtcblxuICAgICAgICBkaXYucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImRyYWdvdmVyXCIsIG5vdERyb3BwYWJsZURyYWdPdmVyKTtcbiAgICAgICAgZGl2LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJkcmFnbGVhdmVcIiwgZHJhZ0xlYXZlKTtcbiAgICAgICAgZGl2LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJkcm9wXCIsIG5vdERyb3BwYWJsZURyb3ApO1xuICAgICAgfSk7XG4gICAgfSkoKTtcbiAgICAvLyBSZXN0YXJ0IHRvIGFkZCBuZXcgYXR0cmlidXRlcyBhbmQgbGlzdGVuZXJzXG4gICAgc2V0RHJhZ0FuZERyb3AoKTtcbiAgfTtcblxuICBjb25zdCBub3REcm9wcGFibGVEcmFnT3ZlciA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgY29uc3Qgc2V0SG92ZXJpbmdDb2xvciA9IChmdW5jdGlvbiAoKSB7XG4gICAgICBsZXQgY3VycmVudFRhcmdldCA9IGV2ZW50LnRhcmdldDtcbiAgICAgIGZvciAobGV0IG4gPSAwOyBuIDwgcGFyc2VJbnQoY2F0Y2hFdmVudERhdGFzZXQpOyBuKyspIHtcbiAgICAgICAgaWYgKCFjdXJyZW50VGFyZ2V0KSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGN1cnJlbnRUYXJnZXQuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJyZ2JhKDI0OCwgNzMsIDI5LCAwLjUpXCI7XG4gICAgICAgIGN1cnJlbnRUYXJnZXQgPSBjdXJyZW50VGFyZ2V0Lm5leHRFbGVtZW50U2libGluZztcbiAgICAgIH1cbiAgICB9KSgpO1xuICB9O1xuXG4gIGNvbnN0IG5vdERyb3BwYWJsZURyb3AgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGNvbnN0IHJlbW92ZUhvdmVyaW5nQ29sb3IgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgbGV0IGN1cnJlbnRUYXJnZXQgPSBldmVudC50YXJnZXQ7XG4gICAgICBmb3IgKGxldCBuID0gMDsgbiA8IHBhcnNlSW50KGNhdGNoRXZlbnREYXRhc2V0KTsgbisrKSB7XG4gICAgICAgIGlmICghY3VycmVudFRhcmdldCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjdXJyZW50VGFyZ2V0LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiaW5pdGlhbFwiO1xuICAgICAgICBjdXJyZW50VGFyZ2V0ID0gY3VycmVudFRhcmdldC5uZXh0RWxlbWVudFNpYmxpbmc7XG4gICAgICB9XG4gICAgfSkoKTtcbiAgfTtcblxuICBkcmFnZ2FibGVTaGlwcy5mb3JFYWNoKChzaGlwKSA9PiB7XG4gICAgc2hpcC5hZGRFdmVudExpc3RlbmVyKFwiZHJhZ3N0YXJ0XCIsIGRyYWdTdGFydCk7XG4gIH0pO1xuXG4gIGNvbnN0IHRyaWdnZXJDYXJyaWVyRHJhZ0Ryb3AgPSBmdW5jdGlvbiAoKSB7XG4gICAgZ2V0Tm9kZXMuYWRtaXJhbEdyb3VuZHNEaXZzLmZvckVhY2goKGRpdikgPT4ge1xuICAgICAgZGl2LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJkcmFnb3ZlclwiLCBkcmFnT3Zlcik7XG4gICAgICBkaXYucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImRyYWdsZWF2ZVwiLCBkcmFnTGVhdmUpO1xuICAgICAgZGl2LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJkcm9wXCIsIGRyb3ApO1xuXG4gICAgICBkaXYucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImRyYWdvdmVyXCIsIG5vdERyb3BwYWJsZURyYWdPdmVyKTtcbiAgICAgIGRpdi5yZW1vdmVFdmVudExpc3RlbmVyKFwiZHJhZ2xlYXZlXCIsIGRyYWdMZWF2ZSk7XG4gICAgICBkaXYucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImRyb3BcIiwgbm90RHJvcHBhYmxlRHJvcCk7XG4gICAgfSk7XG5cbiAgICBjYXJyaWVyRHJvcHBhYmxlU3BvdHMuZm9yRWFjaCgoc3BvdCkgPT4ge1xuICAgICAgc3BvdC5hZGRFdmVudExpc3RlbmVyKFwiZHJhZ292ZXJcIiwgZHJhZ092ZXIpO1xuICAgICAgc3BvdC5hZGRFdmVudExpc3RlbmVyKFwiZHJhZ2xlYXZlXCIsIGRyYWdMZWF2ZSk7XG4gICAgICBzcG90LmFkZEV2ZW50TGlzdGVuZXIoXCJkcm9wXCIsIGRyb3ApO1xuICAgIH0pO1xuICAgIGNhcnJpZXJOb3REcm9wcGFibGVTcG90cy5mb3JFYWNoKChzcG90KSA9PiB7XG4gICAgICBzcG90LmFkZEV2ZW50TGlzdGVuZXIoXCJkcmFnb3ZlclwiLCBub3REcm9wcGFibGVEcmFnT3Zlcik7XG4gICAgICBzcG90LmFkZEV2ZW50TGlzdGVuZXIoXCJkcmFnbGVhdmVcIiwgZHJhZ0xlYXZlKTtcbiAgICAgIHNwb3QuYWRkRXZlbnRMaXN0ZW5lcihcImRyb3BcIiwgbm90RHJvcHBhYmxlRHJvcCk7XG4gICAgfSk7XG4gIH07XG5cbiAgY29uc3QgdHJpZ2dlckJhdHRsZXNoaXBEcmFnRHJvcCA9IGZ1bmN0aW9uICgpIHtcbiAgICBnZXROb2Rlcy5hZG1pcmFsR3JvdW5kc0RpdnMuZm9yRWFjaCgoZGl2KSA9PiB7XG4gICAgICBkaXYucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImRyYWdvdmVyXCIsIGRyYWdPdmVyKTtcbiAgICAgIGRpdi5yZW1vdmVFdmVudExpc3RlbmVyKFwiZHJhZ2xlYXZlXCIsIGRyYWdMZWF2ZSk7XG4gICAgICBkaXYucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImRyb3BcIiwgZHJvcCk7XG5cbiAgICAgIGRpdi5yZW1vdmVFdmVudExpc3RlbmVyKFwiZHJhZ292ZXJcIiwgbm90RHJvcHBhYmxlRHJhZ092ZXIpO1xuICAgICAgZGl2LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJkcmFnbGVhdmVcIiwgZHJhZ0xlYXZlKTtcbiAgICAgIGRpdi5yZW1vdmVFdmVudExpc3RlbmVyKFwiZHJvcFwiLCBub3REcm9wcGFibGVEcm9wKTtcbiAgICB9KTtcblxuICAgIGJhdHRsZXNoaXBEcm9wcGFibGVTcG90cy5mb3JFYWNoKChzcG90KSA9PiB7XG4gICAgICBzcG90LmFkZEV2ZW50TGlzdGVuZXIoXCJkcmFnb3ZlclwiLCBkcmFnT3Zlcik7XG4gICAgICBzcG90LmFkZEV2ZW50TGlzdGVuZXIoXCJkcmFnbGVhdmVcIiwgZHJhZ0xlYXZlKTtcbiAgICAgIHNwb3QuYWRkRXZlbnRMaXN0ZW5lcihcImRyb3BcIiwgZHJvcCk7XG4gICAgfSk7XG4gICAgYmF0dGxlc2hpcE5vdERyb3BwYWJsZVNwb3RzLmZvckVhY2goKHNwb3QpID0+IHtcbiAgICAgIHNwb3QuYWRkRXZlbnRMaXN0ZW5lcihcImRyYWdvdmVyXCIsIG5vdERyb3BwYWJsZURyYWdPdmVyKTtcbiAgICAgIHNwb3QuYWRkRXZlbnRMaXN0ZW5lcihcImRyYWdsZWF2ZVwiLCBkcmFnTGVhdmUpO1xuICAgICAgc3BvdC5hZGRFdmVudExpc3RlbmVyKFwiZHJvcFwiLCBub3REcm9wcGFibGVEcm9wKTtcbiAgICB9KTtcbiAgfTtcblxuICBjb25zdCB0cmlnZ2VyRGVzQW5kU3ViRHJhZ0Ryb3AgPSBmdW5jdGlvbiAoKSB7XG4gICAgZ2V0Tm9kZXMuYWRtaXJhbEdyb3VuZHNEaXZzLmZvckVhY2goKGRpdikgPT4ge1xuICAgICAgZGl2LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJkcmFnb3ZlclwiLCBkcmFnT3Zlcik7XG4gICAgICBkaXYucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImRyYWdsZWF2ZVwiLCBkcmFnTGVhdmUpO1xuICAgICAgZGl2LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJkcm9wXCIsIGRyb3ApO1xuXG4gICAgICBkaXYucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImRyYWdvdmVyXCIsIG5vdERyb3BwYWJsZURyYWdPdmVyKTtcbiAgICAgIGRpdi5yZW1vdmVFdmVudExpc3RlbmVyKFwiZHJhZ2xlYXZlXCIsIGRyYWdMZWF2ZSk7XG4gICAgICBkaXYucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImRyb3BcIiwgbm90RHJvcHBhYmxlRHJvcCk7XG4gICAgfSk7XG5cbiAgICBkZXNBbmRTdWJEcm9wcGFibGVTcG90cy5mb3JFYWNoKChzcG90KSA9PiB7XG4gICAgICBzcG90LmFkZEV2ZW50TGlzdGVuZXIoXCJkcmFnb3ZlclwiLCBkcmFnT3Zlcik7XG4gICAgICBzcG90LmFkZEV2ZW50TGlzdGVuZXIoXCJkcmFnbGVhdmVcIiwgZHJhZ0xlYXZlKTtcbiAgICAgIHNwb3QuYWRkRXZlbnRMaXN0ZW5lcihcImRyb3BcIiwgZHJvcCk7XG4gICAgfSk7XG4gICAgZGVzQW5kU3ViTm90RHJvcHBhYmxlU3BvdHMuZm9yRWFjaCgoc3BvdCkgPT4ge1xuICAgICAgc3BvdC5hZGRFdmVudExpc3RlbmVyKFwiZHJhZ292ZXJcIiwgbm90RHJvcHBhYmxlRHJhZ092ZXIpO1xuICAgICAgc3BvdC5hZGRFdmVudExpc3RlbmVyKFwiZHJhZ2xlYXZlXCIsIGRyYWdMZWF2ZSk7XG4gICAgICBzcG90LmFkZEV2ZW50TGlzdGVuZXIoXCJkcm9wXCIsIG5vdERyb3BwYWJsZURyb3ApO1xuICAgIH0pO1xuICB9O1xuXG4gIGNvbnN0IHRyaWdnZXJQYXRyb2xCb2F0RHJhZ0Ryb3AgPSBmdW5jdGlvbiAoKSB7XG4gICAgZ2V0Tm9kZXMuYWRtaXJhbEdyb3VuZHNEaXZzLmZvckVhY2goKGRpdikgPT4ge1xuICAgICAgZGl2LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJkcmFnb3ZlclwiLCBkcmFnT3Zlcik7XG4gICAgICBkaXYucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImRyYWdsZWF2ZVwiLCBkcmFnTGVhdmUpO1xuICAgICAgZGl2LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJkcm9wXCIsIGRyb3ApO1xuXG4gICAgICBkaXYucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImRyYWdvdmVyXCIsIG5vdERyb3BwYWJsZURyYWdPdmVyKTtcbiAgICAgIGRpdi5yZW1vdmVFdmVudExpc3RlbmVyKFwiZHJhZ2xlYXZlXCIsIGRyYWdMZWF2ZSk7XG4gICAgICBkaXYucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImRyb3BcIiwgbm90RHJvcHBhYmxlRHJvcCk7XG4gICAgfSk7XG5cbiAgICBwYXRyb2xCb2F0RHJvcHBhYmxlU3BvdHMuZm9yRWFjaCgoc3BvdCkgPT4ge1xuICAgICAgc3BvdC5hZGRFdmVudExpc3RlbmVyKFwiZHJhZ292ZXJcIiwgZHJhZ092ZXIpO1xuICAgICAgc3BvdC5hZGRFdmVudExpc3RlbmVyKFwiZHJhZ2xlYXZlXCIsIGRyYWdMZWF2ZSk7XG4gICAgICBzcG90LmFkZEV2ZW50TGlzdGVuZXIoXCJkcm9wXCIsIGRyb3ApO1xuICAgIH0pO1xuICAgIHBhdHJvbEJvYXROb3REcm9wcGFibGVTcG90cy5mb3JFYWNoKChzcG90KSA9PiB7XG4gICAgICBzcG90LmFkZEV2ZW50TGlzdGVuZXIoXCJkcmFnb3ZlclwiLCBub3REcm9wcGFibGVEcmFnT3Zlcik7XG4gICAgICBzcG90LmFkZEV2ZW50TGlzdGVuZXIoXCJkcmFnbGVhdmVcIiwgZHJhZ0xlYXZlKTtcbiAgICAgIHNwb3QuYWRkRXZlbnRMaXN0ZW5lcihcImRyb3BcIiwgbm90RHJvcHBhYmxlRHJvcCk7XG4gICAgfSk7XG4gIH07XG5cbiAgY2F0Y2hFdmVudENsZWFyaW5nTG9naWMgPSBmdW5jdGlvbiAoKSB7XG4gICAgZ2V0Tm9kZXMuYWRtaXJhbEdyb3VuZHNEaXZzLmZvckVhY2goKGRpdikgPT4ge1xuICAgICAgZGl2LmNsYXNzTGlzdCA9IFtdO1xuICAgIH0pO1xuICAgIC8vIFJlbW92ZSBhbGwgZXZlbnQgbGlzdGVuZXJzXG4gICAgZ2V0Tm9kZXMuYWRtaXJhbEdyb3VuZHNEaXZzLmZvckVhY2goKGRpdikgPT4ge1xuICAgICAgZGl2LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJkcmFnc3RhcnRcIiwgZHJhZ1N0YXJ0KTtcbiAgICAgIGRpdi5yZW1vdmVFdmVudExpc3RlbmVyKFwiZHJhZ292ZXJcIiwgZHJhZ092ZXIpO1xuICAgICAgZGl2LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJkcmFnbGVhdmVcIiwgZHJhZ0xlYXZlKTtcbiAgICAgIGRpdi5yZW1vdmVFdmVudExpc3RlbmVyKFwiZHJvcFwiLCBkcm9wKTtcblxuICAgICAgZGl2LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJkcmFnb3ZlclwiLCBub3REcm9wcGFibGVEcmFnT3Zlcik7XG4gICAgICBkaXYucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImRyYWdsZWF2ZVwiLCBkcmFnTGVhdmUpO1xuICAgICAgZGl2LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJkcm9wXCIsIG5vdERyb3BwYWJsZURyb3ApO1xuICAgIH0pO1xuICB9O1xufTtcblxuY29uc3QgY29uZmlndXJhdGlvbiA9IChmdW5jdGlvbiAoKSB7XG4gIGNvbnN0IGRpc3BsYXlEaWFsb2cgPSAoZnVuY3Rpb24gKCkge1xuICAgIGdldE5vZGVzLmNvbmZpZ0J1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgZ2V0Tm9kZXMuY292ZXIuc3R5bGUuekluZGV4ID0gXCIyXCI7XG4gICAgICBnZXROb2Rlcy5jb25maWdEaWFsb2cuc3R5bGUudmlzaWJpbGl0eSA9IFwidmlzaWJsZVwiO1xuICAgICAgZ2V0Tm9kZXMuY29uZmlnRGlhbG9nLnN0eWxlLm9wYWNpdHkgPSBcIjFcIjtcbiAgICB9KTtcbiAgfSkoKTtcblxuICBjb25zdCBleGl0RGlhbG9nID0gKGZ1bmN0aW9uICgpIHtcbiAgICBnZXROb2Rlcy5jbG9zZURpYWxvZy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgZ2V0Tm9kZXMuY292ZXIuc3R5bGUuekluZGV4ID0gXCIwXCI7XG4gICAgICBnZXROb2Rlcy5jb25maWdEaWFsb2cuc3R5bGUub3BhY2l0eSA9IFwiMFwiO1xuICAgICAgZ2V0Tm9kZXMuY29uZmlnRGlhbG9nLnN0eWxlLnRyYW5zaXRpb24gPSBcIm9wYWNpdHkgMC41cyBlYXNlLWluLW91dFwiO1xuICAgICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgZ2V0Tm9kZXMuY29uZmlnRGlhbG9nLnN0eWxlLnZpc2liaWxpdHkgPSBcImhpZGRlblwiO1xuICAgICAgICB9LCA0MDApO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pKCk7XG5cbiAgY29uc3QgcmVzdGFydEdhbWUgPSAoZnVuY3Rpb24gKCkge1xuICAgIGdldE5vZGVzLmtpY2tTdGFydEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBcIi4vaW5kZXguaHRtbFwiO1xuICAgIH0pO1xuICB9KSgpO1xuXG4gIGNvbnN0IHNodWZmbGVHYW1lID0gKGZ1bmN0aW9uICgpIHtcbiAgICBnZXROb2Rlcy5zaHVmZmxlQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7XG4gICAgfSk7XG4gIH0pKCk7XG5cbiAgY29uc3Qgc2V0RGlmZmljdWx0eSA9IChmdW5jdGlvbiAoKSB7XG4gICAgZ2V0Tm9kZXMuZGlmZmljdWx0eU9wdGlvbnMuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCAoZXZlbnQpID0+IHtcbiAgICAgIGlmIChldmVudC50YXJnZXQudmFsdWUgPT09IFwiaW1wb3NzaWJsZVwiKSB7XG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiZGlmZmljdWx0eVwiLCBcImltcG9zc2libGVcIik7XG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKTtcbiAgICAgIH1cbiAgICAgIGlmIChldmVudC50YXJnZXQudmFsdWUgPT09IFwibm9ybWFsXCIpIHtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJkaWZmaWN1bHR5XCIsIFwibm9ybWFsXCIpO1xuICAgICAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7XG4gICAgICB9XG4gICAgICBpZiAoZXZlbnQudGFyZ2V0LnZhbHVlID09PSBcImR1bW15XCIpIHtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJkaWZmaWN1bHR5XCIsIFwiZHVtbXlcIik7XG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSkoKTtcblxuICBjb25zdCB0cmlnZ2VyQWxpZ25tZW50ID0gKGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBjdXJyZW50RmVlZGJhY2sgPSBnZXROb2Rlcy5mZWVkYmFjay50ZXh0Q29udGVudDtcblxuICAgIGNvbnN0IGluYWN0aXZhdGVBbGlnbmVkQnV0dG9uID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgIGdldE5vZGVzLmFsaWduZWRCdXR0b24uc3R5bGUucG9pbnRlckV2ZW50cyA9IFwibm9uZVwiO1xuICAgICAgZ2V0Tm9kZXMuYWxpZ25lZEJ1dHRvbi5zdHlsZS5jb2xvciA9IFwicmdiYSgyNTUsIDI1NSwgMjU1LCAwLjYpXCI7XG4gICAgfSkoKTtcblxuICAgIGdldE5vZGVzLnJlYWxpZ25CdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgIGNvbnN0IGluYWN0aXZhdGVEaW1lbnNpb25TZWxlY3Rpb24gPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICBnZXROb2Rlcy5kaW1lbnNpb25PcHRpb25zLnN0eWxlLnBvaW50ZXJFdmVudHMgPSBcIm5vbmVcIjtcbiAgICAgICAgZ2V0Tm9kZXMuZGltZW5zaW9uT3B0aW9ucy5zdHlsZS5jb2xvciA9IFwicmdiYSgyNTUsIDI1NSwgMjU1LCAwLjYpXCI7XG4gICAgICB9KSgpO1xuXG4gICAgICBjb25zdCB1cGRhdGVGZWVkYmFjayA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGdldE5vZGVzLmZlZWRiYWNrLnRleHRDb250ZW50ID0gXCJPbmNlIGRvbmUsIGNsaWNrICdBbGlnbmVkJyB0byBwbGF5LlwiO1xuICAgICAgfSkoKTtcblxuICAgICAgY29uc3QgYWN0aXZhdGVBbGlnbmVkQnV0dG9uID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZ2V0Tm9kZXMuYWxpZ25lZEJ1dHRvbi5zdHlsZS5wb2ludGVyRXZlbnRzID0gXCJhdXRvXCI7XG4gICAgICAgIGdldE5vZGVzLmFsaWduZWRCdXR0b24uc3R5bGUuY29sb3IgPSBcInJnYigyNTUsIDI1NSwgMjU1KVwiO1xuICAgICAgfSkoKTtcbiAgICAgIGNvbnN0IGluYWN0aXZhdGVSZWFsaWduQnV0dG9uID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZ2V0Tm9kZXMucmVhbGlnbkJ1dHRvbi5zdHlsZS5wb2ludGVyRXZlbnRzID0gXCJub25lXCI7XG4gICAgICAgIGdldE5vZGVzLnJlYWxpZ25CdXR0b24uc3R5bGUuY29sb3IgPSBcInJnYmEoMjU1LCAyNTUsIDI1NSwgMC42KVwiO1xuICAgICAgfSkoKTtcblxuICAgICAgc2V0RHJhZ0FuZERyb3AoKTtcbiAgICAgIGNvbnN0IGluYWN0aXZhdGVBaUdyb3VuZHMgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICBnZXROb2Rlcy5haUdyb3VuZHMuc3R5bGUucG9pbnRlckV2ZW50cyA9IFwibm9uZVwiO1xuICAgICAgfSkoKTtcbiAgICAgIGNvbnN0IGV4aXREaWFsb2cgPSAoYXN5bmMgZnVuY3Rpb24gKCkge1xuICAgICAgICBnZXROb2Rlcy5jb3Zlci5zdHlsZS56SW5kZXggPSBcIjBcIjtcbiAgICAgICAgZ2V0Tm9kZXMuY29uZmlnRGlhbG9nLnN0eWxlLm9wYWNpdHkgPSBcIjBcIjtcbiAgICAgICAgZ2V0Tm9kZXMuY29uZmlnRGlhbG9nLnN0eWxlLnRyYW5zaXRpb24gPSBcIm9wYWNpdHkgMC41cyBlYXNlLWluLW91dFwiO1xuICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgZ2V0Tm9kZXMuY29uZmlnRGlhbG9nLnN0eWxlLnZpc2liaWxpdHkgPSBcImhpZGRlblwiO1xuICAgICAgICAgIH0sIDQwMCk7XG4gICAgICAgIH0pO1xuICAgICAgfSkoKTtcbiAgICB9KTtcblxuICAgIGdldE5vZGVzLmFsaWduZWRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgIGNvbnN0IGFjdGl2YXRlRGltZW5zaW9uU2VsZWN0aW9uID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKGlzU2hpcFBvc2l0aW9uQ2hhbmdlZCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBnZXROb2Rlcy5kaW1lbnNpb25PcHRpb25zLnN0eWxlLnBvaW50ZXJFdmVudHMgPSBcImF1dG9cIjtcbiAgICAgICAgZ2V0Tm9kZXMuZGltZW5zaW9uT3B0aW9ucy5zdHlsZS5jb2xvciA9IFwicmdiKDI1NSwgMjU1LCAyNTUpXCI7XG4gICAgICB9KSgpO1xuXG4gICAgICBjb25zdCByZXN0b3JlRmVlZGJhY2sgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICBnZXROb2Rlcy5mZWVkYmFjay50ZXh0Q29udGVudCA9IGN1cnJlbnRGZWVkYmFjaztcbiAgICAgIH0pKCk7XG5cbiAgICAgIGNvbnN0IGluYWN0aXZhdGVBbGlnbmVkQnV0dG9uID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZ2V0Tm9kZXMuYWxpZ25lZEJ1dHRvbi5zdHlsZS5wb2ludGVyRXZlbnRzID0gXCJub25lXCI7XG4gICAgICAgIGdldE5vZGVzLmFsaWduZWRCdXR0b24uc3R5bGUuY29sb3IgPSBcInJnYmEoMjU1LCAyNTUsIDI1NSwgMC42KVwiO1xuICAgICAgfSkoKTtcbiAgICAgIGNvbnN0IGFjdGl2YXRlUmVhbGlnbkJ1dHRvbiA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGdldE5vZGVzLnJlYWxpZ25CdXR0b24uc3R5bGUucG9pbnRlckV2ZW50cyA9IFwiYXV0b1wiO1xuICAgICAgICBnZXROb2Rlcy5yZWFsaWduQnV0dG9uLnN0eWxlLmNvbG9yID0gXCJyZ2IoMjU1LCAyNTUsIDI1NSlcIjtcbiAgICAgIH0pKCk7XG5cbiAgICAgIGNhdGNoRXZlbnRDbGVhcmluZ0xvZ2ljKCk7XG4gICAgICBjb25zdCBhY3RpdmF0ZUFpR3JvdW5kcyA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGdldE5vZGVzLmFpR3JvdW5kcy5zdHlsZS5wb2ludGVyRXZlbnRzID0gXCJhdXRvXCI7XG4gICAgICB9KSgpO1xuICAgICAgY29uc3QgZXhpdERpYWxvZyA9IChhc3luYyBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGdldE5vZGVzLmNvdmVyLnN0eWxlLnpJbmRleCA9IFwiMFwiO1xuICAgICAgICBnZXROb2Rlcy5jb25maWdEaWFsb2cuc3R5bGUub3BhY2l0eSA9IFwiMFwiO1xuICAgICAgICBnZXROb2Rlcy5jb25maWdEaWFsb2cuc3R5bGUudHJhbnNpdGlvbiA9IFwib3BhY2l0eSAwLjVzIGVhc2UtaW4tb3V0XCI7XG4gICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICBnZXROb2Rlcy5jb25maWdEaWFsb2cuc3R5bGUudmlzaWJpbGl0eSA9IFwiaGlkZGVuXCI7XG4gICAgICAgICAgfSwgNDAwKTtcbiAgICAgICAgfSk7XG4gICAgICB9KSgpO1xuICAgIH0pO1xuICB9KSgpO1xuXG4gIGNvbnN0IHRyaWdnZXJIb3ZlcmluZ0VmZmVjdE92ZXJTdmcgPSAoZnVuY3Rpb24gKCkge1xuICAgIGdldE5vZGVzLmNvbmZpZ0J1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwibW91c2VvdmVyXCIsICgpID0+IHtcbiAgICAgIGdldE5vZGVzLmNvbmZpZ0J1dHRvbkljb24uc3R5bGUuZmlsbCA9IFwiYmxhY2tcIjtcbiAgICB9KTtcbiAgICBnZXROb2Rlcy5jb25maWdCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlb3V0XCIsICgpID0+IHtcbiAgICAgIGdldE5vZGVzLmNvbmZpZ0J1dHRvbkljb24uc3R5bGUuZmlsbCA9IFwid2hpdGVcIjtcbiAgICB9KTtcbiAgfSkoKTtcbn0pKCk7XG4iXSwibmFtZXMiOlsiU2hpcCIsImNvbnN0cnVjdG9yIiwibGVuZ3RoIiwibnVtSGl0cyIsInN1bmsiLCJjdXJyZW50TGVuZ3RoIiwiY3VycmVudE51bUhpdHMiLCJzdW5rU3RhdHVzIiwiaGl0IiwiaXNTdW5rIiwiR2FtZWJvYXJkIiwiYm9hcmQiLCJkaXNwbGFjZVNoaXBzUmVjdXJzaW9uQ291bnQiLCJzaGlwcyIsIkNhcnJpZXIiLCJCYXR0bGVzaGlwIiwiRGVzdHJveWVyIiwiU3VibWFyaW5lIiwiY3JlYXRlQm9hcmQiLCJuIiwic3ViQm9hcmQiLCJtIiwicHVzaCIsImdldExlZ2FsTW92ZXMiLCJnZW5lcmF0ZU1vdmVzIiwiZmlyc3RNb3ZlIiwic2hpcE1vdmVzIiwibWFwIiwiaW5kZXgiLCJjYXJyaWVyTW92ZXMiLCJiYXR0bGVzaGlwTW92ZXMiLCJkZXN0cm95ZXJNb3ZlcyIsInN1Ym1hcmluZU1vdmVzIiwicGF0cm9sTW92ZXMiLCJsZWdhbE1vdmVzIiwiZGlzcGxhY2VTaGlwcyIsImlzUmVEaXNwbGFjZWQiLCJnZW5lcmF0ZVJhbmRvbVJvd0luZGV4Iiwicm93SW5kZXgiLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCJnZXRSYW5kb21Nb3ZlSW5kZXgiLCJtb3ZlcyIsIm1vdmVJbmRleCIsInVwZGF0ZUxlZ2FsTW92ZXNJbkJvYXJkIiwic2hpcExlbmd0aCIsInBvcHVsYXRlZFJvdyIsImxhc3RPY2N1cGllZCIsImxhc3RJbmRleE9mIiwiZmlyc3RPY2N1cGllZCIsIm9jY3VweSIsImZpcnN0SW5kZXhFbXB0eSIsImxhc3RJbmRleEVtcHR5IiwiZmlyc3RUb3BCb3R0b20iLCJsYXN0VG9wQm90dG9tIiwiaW5kZXhPZiIsImJvdHRvbUFkamFjZW50Um93IiwiZmlsbCIsInRvcEFkamFjZW50Um93IiwiaW5jbHVkZXMiLCJyZXN0YXJ0U2hpcERpc3BsYWNlbWVudElmQm9hcmRIYXNBZGphY2VudE9jY3VwaWVkUm93cyIsImZvckVhY2giLCJyb3ciLCJyb3dJc0VtcHR5IiwiZXZlcnkiLCJlbnRyeSIsInJvd0lzT2NjdXBpZWQiLCJuZXh0Um93SXNFbXB0eSIsIm5leHRSb3dJc09jY3VwaWVkIiwicG9wdWxhdGVCb2FyZCIsImlzQm9hcmRGdWxsIiwiX3dpdGhTcGVjaWZpZWRTaGlwIiwic2hpcCIsInJhbmRvbVJvd0luZGV4IiwicmFuZG9tU2hpcE1vdmUiLCJmaXJzdFNoaXBNb3ZlIiwic2hpcE1vdmVMYXN0SW5kZXgiLCJsYXN0U2hpcE1vdmUiLCJyZWNlaXZlQXR0YWNrIiwiWFkiLCJoaXRTdGF0dXMiLCJnZW5lcmF0ZUtleXMiLCJhbHBoYWJldHMiLCJTdHJpbmciLCJmcm9tQ2hhckNvZGUiLCJrZXlzIiwic3ViS2V5cyIsImxldHRlciIsImFzc2lnbktleXNUb0JvYXJkSW5kaWNlcyIsIktleXNCb3giLCJvY2N1cHlDaG9zZW5TcG90Iiwia2V5SW5kZXgiLCJoaXRFbnRyeSIsInVwZGF0ZVNoaXBMaWZlIiwidXBkYXRlVW50aWxGdWxsIiwidHJhY2tNaXNzZWRBdHRhY2tzIiwiY29vcmRpbmF0ZSIsIm1pc3NlZEF0dGFja3MiLCJ1cGRhdGVTdW5rU3RhdHVzIiwiYWxsU2hpcHNTdW5rIiwiUGxheWVyIiwidXNlciIsImNvbXB1dGVyIiwiY29tcHV0ZXJSYW5kb21QaWNrQ291bnQiLCJrZXlzVXBkYXRlIiwidXNlclR1cm4iLCJjb21wdXRlclR1cm4iLCJnZW5lcmF0ZVJhbmRvbUtleSIsImdldEtleXMiLCJhc3NpZ25HZW5lcmF0ZWRLZXlzT25jZSIsInJhbmRvbUtleSIsInVwZGF0ZUtleXMiLCJyYW5kb21LZXlJbmRleCIsInNwbGljZSIsInBpY2tMZWdhbE1vdmUiLCJyZXNwb25zZSIsImltcG9ydEFsbEFzc2V0cyIsImltcG9ydEFsbCIsInIiLCJhc3NldHMiLCJyZXF1aXJlIiwiY29udGV4dCIsImdldE5vZGVzIiwiYWRtaXJhbEhlYWREaXZzIiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yQWxsIiwiYWRtaXJhbFRhaWxEaXZzIiwiYWlIZWFkRGl2cyIsImFpVGFpbERpdnMiLCJhZG1pcmFsR3JvdW5kc0RpdnMiLCJhaUdyb3VuZHNEaXZzIiwiaGVhZGVycyIsImFkbWlyYWxHcm91bmRzIiwicXVlcnlTZWxlY3RvciIsImFpR3JvdW5kcyIsImFkbWlyYWxOYW1lIiwiZmVlZGJhY2siLCJjb25maWdCdXR0b24iLCJjb25maWdEaWFsb2ciLCJjb25maWdCdXR0b25JY29uIiwiY292ZXIiLCJjbG9zZURpYWxvZyIsImtpY2tTdGFydEJ1dHRvbiIsInNodWZmbGVCdXR0b24iLCJwZWVrQnV0dG9uIiwicmVhbGlnbkJ1dHRvbiIsImFsaWduZWRCdXR0b24iLCJkaWZmaWN1bHR5T3B0aW9ucyIsImRpbWVuc2lvbk9wdGlvbnMiLCJkaXNwbGF5SGVhZEFuZFRhaWxIb3ZlcmluZ0VmZmVjdCIsImFkZEhvdmVyVG9IZWFkIiwiaGVhZERpdnMiLCJncm91bmREaXZzIiwiZGl2IiwiYWRkRXZlbnRMaXN0ZW5lciIsInN0eWxlIiwiYm9yZGVyIiwiYWRkSG92ZXJUb1RhaWwiLCJ0YWlsRGl2cyIsImFkZEhvdmVyVG9IZWFkZXJzIiwiaGVhZGVyIiwiZ3JvdW5kcyIsImNsYXNzTGlzdCIsImFkZCIsInJlbW92ZSIsInJldHJpZXZlQWRtaXJhbE5hbWVGcm9tU3RvcmFnZUFuZFNldCIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJ0ZXh0Q29udGVudCIsInBvcHVsYXRlQm9hcmRzIiwiZ2FtZSIsInVzZXJCb2FyZCIsImZsYXQiLCJjb21wdXRlckJvYXJkIiwiZ2V0UmFuZG9tQ29sb3IiLCJyZWQiLCJncmVlbiIsImJsdWUiLCJjb2xvciIsInJhbmRvbUNvbG9ycyIsInNldFJhbmRvbUNvbG9ycyIsImVsZW1lbnQiLCJiYWNrZ3JvdW5kQ29sb3IiLCJzZXRDbGFzc2VzIiwic2V0Q2xhc3MiLCJzZXRBdHRyaWJ1dGUiLCJkaXZJbmRleCIsImVudHJ5SW5kZXgiLCJwb3B1bGF0ZVdpdGhTcGF0aWFsU2hpcHMiLCJzZXRTcGF0aWFsRGltZW5zaW9uIiwiYXBwZW5kU2hpcEltZyIsInNoaXBTcmMiLCJzaGlwVHlwZSIsImRhdGFzZXQiLCJzaGlwSW1nIiwiY3JlYXRlRWxlbWVudCIsInVwZGF0ZUltZ1NpemUiLCJ3aWR0aCIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsImhlaWdodCIsIndpbmRvdyIsInJlbW92ZVNjYWxpbmciLCJ0cmFuc2Zvcm0iLCJhcHBlbmRDaGlsZCIsInNldFNwYXRpYWxEaW1lbnNpb25Gb3JBaUFuZEhpZGUiLCJkaXNwbGF5IiwicGVla0FpQm9hcmQiLCJ2YWx1ZSIsImV4aXREaWFsb2ciLCJ6SW5kZXgiLCJvcGFjaXR5IiwidHJhbnNpdGlvbiIsIlByb21pc2UiLCJyZXNvbHZlIiwic2V0VGltZW91dCIsInZpc2liaWxpdHkiLCJoaWRlQWlCb2FyZCIsInBvcHVsYXRlV2l0aENvbG9yIiwicG9wdWxhdGVVc2VyQm9hcmQiLCJwb3B1bGF0ZUFpQm9hcmQiLCJwb3B1bGF0ZVdpdGhEaW1lbnNpb25DaGFuZ2UiLCJldmVudCIsInRhcmdldCIsImluYWN0aXZhdGVBbGlnbmVkQnV0dG9uIiwicG9pbnRlckV2ZW50cyIsImluYWN0aXZhdGVSZWFsaWduQnV0dG9uIiwiY2xlYXJTcGF0aWFsU2hpcHMiLCJhY3RpdmF0ZVJlYWxpZ25CdXR0b24iLCJjbGVhckNvbG9ycyIsImJyaW5nQmFja1NwYXRpYWxTaGlwcyIsInBvcHVsYXRlQWlCb2FyZFdoZW5HYW1lT3ZlciIsImRpc3BsYXlUYXJnZXQiLCJfX2ZvckVhY2hHcm91bmRzIiwidGFyZ2V0U3BhbiIsInNldERlZmF1bHRBdHRyaWJ1dGVzSW5Db29yZGluYXRlcyIsInNldENvb3JkaW5hdGVzVG9VbkF0dGFja2VkIiwiYWRkSW5kZXhUb0Nvb3JkaW5hdGVzIiwiYWxwSW5kZXgiLCJhbHBzIiwibG9vcEdhbWUiLCJnYW1lT3ZlciIsImdldERpZmZpY3VsdHkiLCJkaWZmaWN1bHR5Iiwib3B0aW9ucyIsInJlbW92ZUF0dHJpYnV0ZSIsImRpc3BsYXlBdHRhY2siLCJzcG90IiwiaW5wdXRWYWx1ZSIsImZvbnRDb2xvciIsInNwYW4iLCJzZXRGZWVkYmFjayIsImFpT3JVc2VyIiwibWlzc2VkT3JIaXQiLCJzaGlwRGF0YXNldCIsImdldEZlZWRiYWNrTWVzc2FnZSIsImFpT3JVc2VyMiIsImZlZWRiYWNrTWVzc2FnZSIsInZpY3RpbSIsImlubmVySFRNTCIsInRyaWdnZXJVc2VyVHVybiIsImF0dGFja2VkIiwiaGFzQXR0cmlidXRlIiwidHJpZ2dlckFpVHVybiIsImFpVGltZXIiLCJyZWN1cnNpb25Db3VudCIsInJlc2V0RHVtbXlUaW1lclBhcmFtZXRlcnMiLCJyZXNldEltcG9zc2libGVUaW1lclBhcmFtZXRlcnMiLCJjYXRjaEV2ZW50Q2xlYXJpbmdMb2dpYyIsImlzU2hpcFBvc2l0aW9uQ2hhbmdlZCIsInNldERyYWdBbmREcm9wIiwic2V0QXR0cmlidXRlcyIsImRlZmF1bHRVc2VyQm9hcmQiLCJnZXRNb3ZlcyIsInNoaXBJbmRleCIsInNoaXBMZWdhbE1vdmVzIiwic2hpcElsbGVnYWxNb3ZlcyIsImRlZmluZU1vdmVzRm9yRWFjaFNoaXBSb3ciLCJzaGlwUm93IiwidmFsdWVzIiwiY2hlY2tMZWdhbGl0eSIsImlzQWxsTnVsbCIsInNldFNoaXBBdHRyaWJ1dGVzIiwibW92ZXNJbmRleCIsInBhcnNlSW50IiwibW92ZSIsImRyYWdnYWJsZVNoaXBzIiwiY2FycmllckRyb3BwYWJsZVNwb3RzIiwiY2Fycmllck5vdERyb3BwYWJsZVNwb3RzIiwiYmF0dGxlc2hpcERyb3BwYWJsZVNwb3RzIiwiYmF0dGxlc2hpcE5vdERyb3BwYWJsZVNwb3RzIiwiZGVzQW5kU3ViRHJvcHBhYmxlU3BvdHMiLCJkZXNBbmRTdWJOb3REcm9wcGFibGVTcG90cyIsInBhdHJvbEJvYXREcm9wcGFibGVTcG90cyIsInBhdHJvbEJvYXROb3REcm9wcGFibGVTcG90cyIsImNhdGNoRXZlbnREYXRhc2V0IiwiZHJhZ1N0YXJ0IiwiZGF0YVRyYW5zZmVyIiwic2V0RGF0YSIsImRyYWdnZWRTaGlwIiwieE9mZnNldCIsInNldERyYWdJbWFnZSIsInRyaWdnZXJSaWdodERyYWdEcm9wU2hpcCIsInRyaWdnZXJDYXJyaWVyRHJhZ0Ryb3AiLCJ0cmlnZ2VyQmF0dGxlc2hpcERyYWdEcm9wIiwidHJpZ2dlckRlc0FuZFN1YkRyYWdEcm9wIiwidHJpZ2dlclBhdHJvbEJvYXREcmFnRHJvcCIsImRyYWdPdmVyIiwicHJldmVudERlZmF1bHQiLCJzZXRIb3ZlcmluZ0NvbG9yIiwiY3VycmVudFRhcmdldCIsIm5leHRFbGVtZW50U2libGluZyIsImRyYWdMZWF2ZSIsInJlbW92ZUhvdmVyaW5nQ29sb3IiLCJkcm9wIiwiZ2V0RGF0YSIsImRyb3BUYXJnZXQiLCJhcHBlbmRTaGlwVG9UYXJnZXQiLCJ0cmFuc2ZlckF0dHJpYnV0ZXNGcm9tRHJhZ2dlZFNoaXBzVG9UYXJnZXRzIiwicmVtb3ZlQXR0cmlidXRlcyIsImRyYWdnZWRTaGlwcyIsImFkZFRvVGFyZ2V0cyIsImluZGljYXRlUG9zaXRpb25DaGFuZ2UiLCJ1cGRhdGVCb2FyZCIsImNsZWFyU2hpcHNCb3VkYXJpZXMiLCJ2YWx1ZUluZGV4IiwidHJhbnNmZXJEcm9wcGVkU2hpcCIsIm5ld1Nwb3RzSW5kaWNlcyIsImdldERyb3BwZWRTaGlwU3BvdHNJbmRpY2VzIiwiY2xlYXJTaGlwRnJvbU9sZFNwb3RzIiwicGFyc2VGbG9hdCIsImFkZFNoaXBUb05ld1Nwb3RzIiwiYm9hcmRJbmRpY2VzIiwiYWRkTmV3Qm91bmRhcmllcyIsInNldEJvdW5kYXJpZXMiLCJlbnRyaWVzIiwicmVtb3ZlT2xkQXR0cmlidXRlc0FuZEV2ZW50TGlzdGVuZXJzIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsIm5vdERyb3BwYWJsZURyYWdPdmVyIiwibm90RHJvcHBhYmxlRHJvcCIsImNvbmZpZ3VyYXRpb24iLCJkaXNwbGF5RGlhbG9nIiwicmVzdGFydEdhbWUiLCJsb2NhdGlvbiIsImhyZWYiLCJzaHVmZmxlR2FtZSIsInJlbG9hZCIsInNldERpZmZpY3VsdHkiLCJzZXRJdGVtIiwidHJpZ2dlckFsaWdubWVudCIsImN1cnJlbnRGZWVkYmFjayIsImluYWN0aXZhdGVEaW1lbnNpb25TZWxlY3Rpb24iLCJ1cGRhdGVGZWVkYmFjayIsImFjdGl2YXRlQWxpZ25lZEJ1dHRvbiIsImluYWN0aXZhdGVBaUdyb3VuZHMiLCJhY3RpdmF0ZURpbWVuc2lvblNlbGVjdGlvbiIsInJlc3RvcmVGZWVkYmFjayIsImFjdGl2YXRlQWlHcm91bmRzIiwidHJpZ2dlckhvdmVyaW5nRWZmZWN0T3ZlclN2ZyJdLCJzb3VyY2VSb290IjoiIn0=