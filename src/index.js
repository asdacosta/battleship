import "./reset.css";
import "./style.css";

const importAllAssets = (function () {
  function importAll(r) {
    return r.keys().map(r);
  }

  const assets = importAll(require.context("./assets", false, /\.(png|jpe?g|svg)$/));
})();

const getNodes = (function () {
  const nameInput = document.querySelector("input");
  const battleButton = document.querySelector("button");
  const buttonLink = document.querySelector("button > a");

  return { nameInput, battleButton, buttonLink };
})();

const makeInputWritePlaceholder = (function () {
  const placeholder = "Admiral Name";
  let index = 0;
  let direction = 1;

  setInterval(async () => {
    if (direction === 1) {
      // Adds text (Forward direction: 1)
      getNodes.nameInput.placeholder = getNodes.nameInput.placeholder.slice(0, -1); // To clear '|'
      getNodes.nameInput.placeholder += placeholder[index];
      getNodes.nameInput.placeholder += "|";
      index += 1;
      // Change direction to backwards
      if (index === placeholder.length) {
        direction = -1;
      }
    } else {
      // Clears text (Backward direction: -1)
      await new Promise((resolve) => {
        setTimeout(resolve, 1000);
      });
      getNodes.nameInput.placeholder = getNodes.nameInput.placeholder.slice(0, -1); // To clear '|'
      getNodes.nameInput.placeholder = getNodes.nameInput.placeholder.slice(0, -1);
      getNodes.nameInput.placeholder += "|";
      index -= 1;
      // Change direction to forwards
      if (index === 0) {
        direction = 1;
      }
    }
  }, 100);
})();

const goToBattleGroundsIfInputIsNotEmpty = (function () {
  const setPointerEvents = function () {
    if (getNodes.nameInput.value === "") {
      getNodes.battleButton.style.pointerEvents = "none";
      getNodes.buttonLink.style.color = "rgba(255, 255, 255, 0.6)";
    } else {
      getNodes.battleButton.style.pointerEvents = "auto";
      getNodes.buttonLink.style.color = "rgb(255, 255, 255)";
    }
  };
  setPointerEvents();
  getNodes.nameInput.addEventListener("input", setPointerEvents);
})();

const sendAdmiralNameToBattleGround = (async function () {
  const admiralName = await new Promise((resolve) => {
    getNodes.battleButton.addEventListener("click", () => {
      const name = getNodes.nameInput.value;
      resolve(name);
    });
  });

  const setNameInLocalStorage = (function () {
    localStorage.setItem("admiralName", admiralName);
  })();
})();

// const everBoard = new Gameboard();
// everBoard.displaceShips();
// everBoard.receiveAttack("1B");
// everBoard.receiveAttack("1A");
// everBoard.receiveAttack("1C");
// everBoard.receiveAttack("1B");
