/*
 To run the tests, comment out all the ES module import syntax and 
 uncomment all Node.js module import syntax in ./logic.js
*/

const { Ship, Gameboard, Player } = require("./logic");

// beforeAll(async () => {
//   await new Promise((resolve) => {
//     if (document.readyState === "complete" || document.readyState === "interactive") {
//       resolve();
//     } else {
//       document.addEventListener("DOMContentLoaded", () => {
//         resolve();
//       });
//     }
//   });
// });

test("what instances of Ship contain", () => {
  const ship1 = new Ship(3, 0, false);

  expect(ship1).toBeDefined();
  expect(ship1).toEqual({ length: 3, numHits: 0, sunk: false });
});

test("hit me until I'm sunk", () => {
  const submarine = new Ship(1, 0, false);
  submarine.hit();

  expect(submarine.currentNumHits).toBe(1);
  expect(submarine.hit()).toBe("Ship already sunk!");
});

test("check if ship is sunk", () => {
  const sub = new Ship(1, 0, false);

  expect(sub.isSunk()).toBe(false);
  sub.hit();
  expect(sub.isSunk()).toBe(true);
});

test("board contains 10x10 entries", () => {
  const game1 = new Gameboard();
  const board = game1.createBoard();
  let entries = 0;
  board.forEach((entry) => {
    entry.forEach((subEntry) => {
      entries += 1;
    });
  });

  expect(entries).toBe(100);
});

test("inspect legal moves", () => {
  const game2 = new Gameboard();
  const legalMoves = game2.getLegalMoves();
  const carrierMoves = [
    [0, 1, 2, 3, 4],
    [1, 2, 3, 4, 5],
    [2, 3, 4, 5, 6],
    [3, 4, 5, 6, 7],
    [4, 5, 6, 7, 8],
    [5, 6, 7, 8, 9],
  ];
  const battleshipMoves = [
    [0, 1, 2, 3],
    [1, 2, 3, 4],
    [2, 3, 4, 5],
    [3, 4, 5, 6],
    [4, 5, 6, 7],
    [5, 6, 7, 8],
    [6, 7, 8, 9],
  ];
  const destroyerMoves = [
    [0, 1, 2],
    [1, 2, 3],
    [2, 3, 4],
    [3, 4, 5],
    [4, 5, 6],
    [5, 6, 7],
    [6, 7, 8],
    [7, 8, 9],
  ];
  const submarineMoves = destroyerMoves;
  const patrolMoves = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4],
    [4, 5],
    [5, 6],
    [6, 7],
    [7, 8],
    [8, 9],
  ];

  expect(legalMoves).toEqual([
    carrierMoves,
    battleshipMoves,
    destroyerMoves,
    submarineMoves,
    patrolMoves,
  ]);
});

describe("Populate board", () => {
  const game2 = new Gameboard();
  const board = game2.displaceShips();

  test("__with all ships", () => {
    expect(board.flat()).toEqual(expect.arrayContaining([5, 4, 3, 2]));
  });

  test("__with Carrier of length 5", () => {
    const carrierOccurences = board.flat().filter((entry) => entry === 5).length;
    expect(carrierOccurences).toBe(5);
  });

  test("__with Battleship of length 4", () => {
    const battleshipOccurences = board.flat().filter((entry) => entry === 4).length;
    expect(battleshipOccurences).toBe(4);
  });

  test("__with Destroyer of length 3.5", () => {
    const destroyerOccurences = board.flat().filter((entry) => entry === 3.5).length;
    expect(destroyerOccurences).toBe(3);
  });

  test("__with Submarine of length 3", () => {
    const submarineOccurences = board.flat().filter((entry) => entry === 3).length;
    expect(submarineOccurences).toBe(3);
  });

  test("__with Patrol Boat of length 2", () => {
    const patrolOccurences = board.flat().filter((entry) => entry === 2).length;
    expect(patrolOccurences).toBe(2);
  });
});

describe("Put receiveAttack() to the test", () => {
  const game3 = new Gameboard();
  game3.displaceShips();

  test("Populate chosen spot with X", () => {
    game3.receiveAttack("1A");
    const board = game3.board;
    const populatedWithX = board.flat().includes("X");
    expect(populatedWithX).toBe(true);
  });

  test("Maintain chosen spot even when populated again", () => {
    game3.receiveAttack("1A");
    game3.receiveAttack("1A");
    const board1 = game3.board;
    const xOccurences = board1.flat().filter((entry) => entry === "X").length;
    expect(xOccurences).toBe(1);
  });

  test("Populate different spots", () => {
    const attacks = ["1A", "1B", "2A", "2B", "9J"];
    attacks.map((coordinate) => game3.receiveAttack(coordinate));
    const boards = game3.board;
    const xOccurences = boards.flat().filter((entry) => entry === "X").length;
    expect(xOccurences).toBe(5);
  });

  test("Hit ship should lose life", () => {
    const attacks = [
      "1A",
      "1B",
      "1C",
      "1D",
      "1E",
      "1F",
      "1G",
      "1H",
      "1I",
      "1J",
      "2A",
      "2B",
      "2C",
      "2D",
      "2E",
      "2F",
      "2G",
      "2H",
      "2I",
      "2J",
    ];
    attacks.map((coordinate) => game3.receiveAttack(coordinate));
    const boards = game3.board;
    const ships = ["Carrier", "Battleship", "Destroyer", "Submarine", "Patrol Boat"];
    const shipLives = [];
    ships.forEach((ship) => {
      shipLives.push(game3.ships[ship].numHits);
    });

    expect(shipLives).not.toEqual([0, 0, 0, 0, 0]);
  });
});

describe("Check Player class methods", () => {
  const game = new Player();

  test("User indeed picks a spot", () => {
    game.userTurn("9A");
    const computerBoard = game.computer.board;
    const containsChosenSpot = computerBoard.flat().includes("X");

    console.log(computerBoard);
    expect(containsChosenSpot).toBe(true);
  });

  test("Computer indeed picks a spot", () => {
    game.computerTurn();
    const userBoard = game.user.board;
    const containsChosenSpot = userBoard.flat().includes("X");

    expect(containsChosenSpot).toBe(true);
  });
});
