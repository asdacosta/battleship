const { Ship } = require("./index");

test("what instances of Ship contain", () => {
  const ship1 = new Ship(3, 0, false);
  expect(ship1).toBeDefined();
  expect(ship1).toEqual({ length: 3, hits: 0, sunk: false });
});
