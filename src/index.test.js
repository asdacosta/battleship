const { Ship, Gameboard } = require("./index");

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
});
