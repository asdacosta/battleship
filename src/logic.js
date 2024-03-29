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
      "Patrol Boat": new Ship(2, 0, false),
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

      const restartShipDisplacementIfBoardHasAdjacentOccupiedRows = (() => {
        board.forEach((row, rowIndex) => {
          if (rowIndex === 0 || rowIndex === 9 || isReDisplaced) {
            return;
          }

          // Move to next iteration if row is empty
          const rowIsEmpty = row.every((entry) => entry === null);
          if (rowIsEmpty) {
            return;
          }

          // Displace for adjacent occupied rows
          const rowIsOccupied = row.every((entry) => entry === "O" || entry === null);
          if (rowIsOccupied) {
            const nextRowIsEmpty = board[rowIndex + 1].every((entry) => entry === null);
            if (nextRowIsEmpty) {
              return;
            }
            const nextRowIsOccupied = board[rowIndex + 1].every(
              (entry) => entry === "O" || entry === null,
            );
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
      const isBoardFull = board.every((row) => row.includes("O"));
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
              const isBoardFull = board.every((row) => row.includes("O"));
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

    const assignKeysToBoardIndices = (function () {
      const KeysBox = {};
      const keys = generateKeys;

      for (let rowIndex = 0; rowIndex < 10; rowIndex++) {
        for (let index = 0; index < 10; index++) {
          KeysBox[`${keys[rowIndex][index]}`] = [index, rowIndex];
        }
      }
      return KeysBox;
    })();

    const occupyChosenSpot = (() => {
      const board = this.board;
      const KeysBox = assignKeysToBoardIndices;

      const keyIndex = KeysBox[XY][0];
      const rowIndex = KeysBox[XY][1];
      let hitEntry = board[rowIndex][keyIndex];

      const updateShipLife = (shipLength) => {
        const updateUntilFull = (ship) => {
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

      const updateSunkStatus = (shipLength) => {
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
        if (
          this.ships.Carrier.sunkStatus &&
          this.ships.Battleship.sunkStatus &&
          this.ships.Destroyer.sunkStatus &&
          this.ships.Submarine.sunkStatus &&
          this.ships["Patrol Boat"].sunkStatus
        ) {
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
      } else if (
        hitEntry === this.ships.Carrier.length ||
        hitEntry === this.ships.Battleship.length ||
        hitEntry === 3.5 ||
        hitEntry === this.ships.Submarine.length ||
        hitEntry === this.ships["Patrol Boat"].length
      ) {
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
        const randomKeyIndex = Math.floor(
          Math.random() * (100 - this.computerRandomPickCount),
        );
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

export { Player };
