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
        firstMove = firstMove.map((index) => index + 1);
      }

      return shipMoves;
    };

    const carrierMoves = generateMoves(this.ships.Carrier.length);
    const battleshipMoves = generateMoves(this.ships.Battleship.length);
    const destroyerMoves = generateMoves(this.ships.Destroyer.length);
    const submarineMoves = generateMoves(this.ships.Submarine.length);
    const patrolMoves = generateMoves(this.ships["Patrol Boat"].length);

    const legalMoves = [
      carrierMoves,
      battleshipMoves,
      destroyerMoves,
      submarineMoves,
      patrolMoves,
    ];

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

      const occupy = function (
        firstIndexEmpty,
        lastIndexEmpty,
        firstTopBottom,
        lastTopBottom,
      ) {
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
          bottomAdjacentRow.fill(
            "O",
            firstOccupied - firstTopBottom,
            lastOccupied + lastTopBottom,
          );
        } else if (rowIndex === 9) {
          const topAdjacentRow = board[8];
          topAdjacentRow.fill(
            "O",
            firstOccupied - firstTopBottom,
            lastOccupied + lastTopBottom,
          );
        } else {
          const topAdjacentRow = board[rowIndex - 1];
          const bottomAdjacentRow = board[rowIndex + 1];
          topAdjacentRow.fill(
            "O",
            firstOccupied - firstTopBottom,
            lastOccupied + lastTopBottom,
          );
          bottomAdjacentRow.fill(
            "O",
            firstOccupied - firstTopBottom,
            lastOccupied + lastTopBottom,
          );
        }
      };
      if (
        populatedRow[0] === null &&
        populatedRow[populatedRow.length - 1] !== null &&
        !populatedRow.includes("O")
      ) {
        occupy(true, false, 1, 1);
      } else if (
        populatedRow[0] !== null &&
        populatedRow[populatedRow.length - 1] === null &&
        !populatedRow.includes("O")
      ) {
        occupy(false, true, 0, 2);
      } else if (
        populatedRow[0] === null &&
        populatedRow[populatedRow.length - 1] === null &&
        !populatedRow.includes("O")
      ) {
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
            shipLength = this.ships.Destroyer.length;
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

    console.log(board);
    return board;
  }

  receiveAttack(XY) {
    const generateKeys = (function () {
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
    })();
  }
}

// module.exports = {
//   Ship,
//   Gameboard,
// };

const everBoard = new Gameboard();
everBoard.receiveAttack("1A");
