import "./reset.css";
import "./battleground.css";
import { Player } from "./logic";

const importAllAssets = (function () {
  function importAll(r) {
    return r.keys().map(r);
  }

  const assets = importAll(require.context("./assets", false, /\.(png|jpe?g|svg)$/));
})();

const getNodes = (function () {
  const admiralHeadDivs = document.querySelectorAll(
    "body > section:nth-child(2) .head > div",
  );
  const admiralTailDivs = document.querySelectorAll(
    "body > section:nth-child(2) .tail > div",
  );
  const aiHeadDivs = document.querySelectorAll("body > section:nth-child(3) .head > div");
  const aiTailDivs = document.querySelectorAll("body > section:nth-child(3) .tail > div");
  const admiralGroundsDivs = document.querySelectorAll(".admiral-grounds > div");
  const aiGroundsDivs = document.querySelectorAll(".ai-grounds > div");
  const headers = document.querySelectorAll("h2");
  const admiralGrounds = document.querySelector(".admiral-grounds");
  const aiGrounds = document.querySelector(".ai-grounds");
  const admiralName = document.querySelector(".admiral-name");

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
  };
})();

const displayHeadAndTailHoveringEffect = (function () {
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
})();

const retrieveAdmiralNameFromStorageAndSet = (function () {
  const admiralName = localStorage.getItem("admiralName");
  if (admiralName) {
    getNodes.admiralName.textContent = "⚓ " + admiralName;
  }
})();

const populateBoards = (function () {
  const game = new Player();
  const userBoard = game.user.board.flat();
  const computerBoard = game.computer.board.flat();

  const getRandomColor = function () {
    const red = Math.floor(Math.random() * (257 - 100) + 50);
    const green = Math.floor(Math.random() * (257 - 100) + 50);
    const blue = Math.floor(Math.random() * (257 - 100) + 50);
    const color = `rgb(${red}, ${green}, ${blue})`;

    return color;
  };
  const randomColors = [
    getRandomColor(),
    getRandomColor(),
    getRandomColor(),
    getRandomColor(),
    getRandomColor(),
  ];

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

  const populateUserBoard = (function () {
    getNodes.admiralGroundsDivs.forEach((div, divIndex) => {
      userBoard.forEach((entry, entryIndex) => {
        if (divIndex === entryIndex) {
          if (entry !== null && entry !== "O") {
            setRandomColors(div, entry);
            setClass(div, entry);
          }
        }
      });
    });
  })();

  const populateAiBoard = (function () {
    getNodes.aiGroundsDivs.forEach((div, divIndex) => {
      computerBoard.forEach((entry, entryIndex) => {
        if (divIndex === entryIndex) {
          if (entry !== null && entry !== "O") {
            setRandomColors(div, entry);
            setClass(div, entry);
          }
        }
      });
    });
  })();

  return { game };
})();

const displayTarget = (function () {
  const __forEachGrounds = function (grounds) {
    grounds.forEach((div) => {
      div.addEventListener("mouseover", () => {
        div.textContent = "💢";
      });
      div.addEventListener("mouseout", () => {
        if (div.textContent !== "X" && div.textContent !== "💥") {
          div.textContent = "";
        }
      });
    });
  };

  __forEachGrounds(getNodes.admiralGroundsDivs);
  __forEachGrounds(getNodes.aiGroundsDivs);
})();

const setDefaultAttributesInCoordinates = (function () {
  const setCoordinatesToUnAttacked = (function () {
    getNodes.aiGroundsDivs.forEach((div) => {
      div.setAttribute("data-attacked", "No");
    });
    getNodes.admiralGroundsDivs.forEach((div) => {
      div.setAttribute("data-attacked", "No");
    });
  })();

  const addIndexToCoordinates = (function () {
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
  })();
})();

const loopGame = (function () {
  const game = populateBoards.game;

  const displayAttack = function (spot, inputValue, fontColor) {
    spot.style.color = fontColor;
    spot.textContent = inputValue;
    spot.style.pointerEvents = "none";
    spot.setAttribute("data-attacked", "Yes");
  };

  const triggerUserTurn = function () {
    getNodes.aiGrounds.style.pointerEvents = "auto";

    getNodes.aiGroundsDivs.forEach((div) => {
      div.addEventListener("click", () => {
        // IF already attacked
        if (div.dataset.attacked === "Yes") {
          game.userTurn(div.dataset.index);
        }
        // IF empty
        if (div.dataset.attacked === "No" && !div.hasAttribute("data-ship")) {
          game.userTurn(div.dataset.index);
          displayAttack(div, "X", "rgb(228, 73, 73)");
          triggerAiTurn();
          return;
        }
        // IF hits a ship
        if (div.dataset.attacked === "No" && div.hasAttribute("data-ship")) {
          game.userTurn(div.dataset.index);
          displayAttack(div, "💥", "black");
          return;
        }
      });
    });
  };
  triggerUserTurn();

  const triggerAiTurn = async function () {
    getNodes.aiGrounds.style.pointerEvents = "none";
    await new Promise((resolve) => {
      setTimeout(resolve, 3000);
    });
    const randomKey = game.computerTurn();

    getNodes.admiralGroundsDivs.forEach((div) => {
      if (div.dataset.index === randomKey) {
        // IF already attacked
        if (div.dataset.attacked === "Yes") {
          triggerAiTurn();
        }
        // IF empty
        if (div.dataset.attacked === "No" && !div.hasAttribute("data-ship")) {
          displayAttack(div, "X", "rgb(228, 73, 73)");
          getNodes.aiGrounds.style.pointerEvents = "auto";
        }
        // IF hits a ship
        if (div.dataset.attacked === "No" && div.hasAttribute("data-ship")) {
          displayAttack(div, "💥", "black");
          triggerAiTurn();
        }
      }
    });
    // IF on last recursion
  };
})();
