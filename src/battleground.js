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
  const board = game.user.board.flat();

  const getRandomColor = function () {
    const red = Math.floor(Math.random() * (257 - 100) + 100);
    const green = Math.floor(Math.random() * (257 - 100) + 100);
    const blue = Math.floor(Math.random() * (257 - 100) + 100);
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

  getNodes.admiralGroundsDivs.forEach((div, divIndex) => {
    board.forEach((entry, entryIndex) => {
      if (divIndex === entryIndex) {
        if (entry !== null && entry !== "O") {
          setRandomColors(div, entry);
        }
      }
    });
  });
})();
