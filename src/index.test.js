const { Ship } = require("./index");

test("what instances of Ship contain", () => {
  const ship1 = new Ship(3, 0, false);

  expect(ship1).toBeDefined();
  expect(ship1).toEqual({ length: 3, hits: 0, sunk: false });
});

test("hit me until I'm sunk", () => {
  const submarine = new Ship(1, 0, false);
  submarine.hit();

  expect(submarine.shipHits).toBe(1);
  expect(submarine.hit()).toBe("Ship already sunk!");
});
