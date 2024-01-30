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
