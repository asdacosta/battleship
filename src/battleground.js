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
    "body > section:nth-child(3) .head > div",
  );
  const admiralTailDivs = document.querySelectorAll(
    "body > section:nth-child(3) .tail > div",
  );
  const aiHeadDivs = document.querySelectorAll("body > section:nth-child(4) .head > div");
  const aiTailDivs = document.querySelectorAll("body > section:nth-child(4) .tail > div");
  const admiralGroundsDivs = document.querySelectorAll(".admiral-grounds > div");
  const aiGroundsDivs = document.querySelectorAll(".ai-grounds > div");
  const headers = document.querySelectorAll("h2");
  const admiralGrounds = document.querySelector(".admiral-grounds");
  const aiGrounds = document.querySelector(".ai-grounds");
  const admiralName = document.querySelector(".admiral-name");
  const feedback = document.querySelector("body > div:last-child");
  const configButton = document.querySelector(".config-box > button");
  const configDialog = document.querySelector(".config-dialog");
  const cover = document.querySelector("body > div:first-child");
  const closeDialog = document.querySelector("span");
  const kickStartButton = document.querySelector(".kick-start");
  const shuffleButton = document.querySelector(".shuffle");
  const peekButton = document.querySelector(".peek");
  const difficultyOptions = document.querySelector("#difficulty");

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
    feedback,
    configButton,
    configDialog,
    cover,
    closeDialog,
    kickStartButton,
    shuffleButton,
    peekButton,
    difficultyOptions,
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
    return { admiralName };
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
            setClass(div, entry);

            const peekAiBoard = (function () {
              getNodes.peekButton.addEventListener("click", () => {
                const exitDialog = (async function () {
                  getNodes.cover.style.zIndex = "0";
                  getNodes.configDialog.style.opacity = "0";
                  getNodes.configDialog.style.transition = "opacity 0.5s ease-in-out";
                  await new Promise((resolve) => {
                    setTimeout(() => {
                      getNodes.configDialog.style.visibility = "hidden";
                    }, 400);
                  });
                })();

                // Show colors
                setRandomColors(div, entry);

                const hideAiBoard = (async function () {
                  await new Promise((resolve) => {
                    setTimeout(() => {
                      getNodes.aiGroundsDivs.forEach((div) => {
                        div.style.backgroundColor = "initial";
                      });
                    }, 1000);
                  });
                })();
              });
            })();
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

  const getDifficulty = (function () {
    let difficulty = localStorage.getItem("difficulty");
    if (!difficulty) {
      difficulty = "normal";
    } else {
      if (difficulty === "impossible") {
        getNodes.difficultyOptions.options[0].removeAttribute("selected");
        getNodes.difficultyOptions.options[1].removeAttribute("selected");
        getNodes.difficultyOptions.options[2].setAttribute("selected", true);
        getNodes.feedback.textContent = "Don't miss your first attack!";
      }
      if (difficulty === "normal") {
        getNodes.difficultyOptions.options[0].removeAttribute("selected");
        getNodes.difficultyOptions.options[1].setAttribute("selected", true);
        getNodes.difficultyOptions.options[2].removeAttribute("selected");
        getNodes.feedback.textContent = "Initiate the first attack!";
      }
      if (difficulty === "dummy") {
        getNodes.difficultyOptions.options[0].setAttribute("selected", true);
        getNodes.difficultyOptions.options[1].removeAttribute("selected");
        getNodes.difficultyOptions.options[2].removeAttribute("selected");
        getNodes.feedback.textContent = "Initiate the first attack!";
      }
    }

    return { difficulty };
  })();

  const displayAttack = function (spot, inputValue, fontColor) {
    spot.style.color = fontColor;
    spot.textContent = inputValue;
    spot.style.pointerEvents = "none";
    spot.setAttribute("data-attacked", "Yes");
  };

  const setFeedback = function (aiOrUser, missedOrHit, shipDataset) {
    const getFeedbackMessage = function (aiOrUser2) {
      let feedbackMessage = "";
      let victim = null;

      if (aiOrUser2 === "ai") {
        victim = game.user;
      } else if (aiOrUser2 === "user") {
        victim = game.computer;
      }

      switch (shipDataset) {
        case "5":
          feedbackMessage = "Hit the Carrier 🎯";
          if (victim.ships.Carrier.currentNumHits === 5) {
            feedbackMessage = "Sunk the Carrier! 🌟";
          }
          break;
        case "4":
          feedbackMessage = "Hit the Battleship 🎯";
          if (victim.ships.Battleship.currentNumHits === 4) {
            feedbackMessage = "Sunk the Battleship! 🌟";
          }
          break;
        case "3.5":
          feedbackMessage = "Hit the Destroyer 🎯";
          if (victim.ships.Destroyer.currentNumHits === 3) {
            feedbackMessage = "Sunk the Destroyer! 🌟";
          }
          break;
        case "3":
          feedbackMessage = "Hit the Submarine 🎯";
          if (victim.ships.Submarine.currentNumHits === 3) {
            feedbackMessage = "Sunk the Submarine! 🌟";
          }
          break;
        case "2":
          feedbackMessage = "Hit the Patrol Boat 🎯";
          if (victim.ships["Patrol Boat"].currentNumHits === 2) {
            feedbackMessage = "Sunk the Patrol Boat! 🌟";
          }
          break;
      }
      // Declare winner
      if (aiOrUser2 === "ai") {
        if (
          victim.ships.Carrier.isSunk() &&
          victim.ships.Battleship.isSunk() &&
          victim.ships.Destroyer.isSunk() &&
          victim.ships.Submarine.isSunk() &&
          victim.ships["Patrol Boat"].isSunk()
        ) {
          feedbackMessage = "Destroyed all your ships. 😞";
        }
      } else if (aiOrUser2 === "user") {
        if (
          victim.ships.Carrier.isSunk() &&
          victim.ships.Battleship.isSunk() &&
          victim.ships.Destroyer.isSunk() &&
          victim.ships.Submarine.isSunk() &&
          victim.ships["Patrol Boat"].isSunk()
        ) {
          feedbackMessage = "Sunk all ships! 🏆";
        }
      }

      return feedbackMessage;
    };

    if (aiOrUser === "ai") {
      if (missedOrHit === "missed") {
        getNodes.feedback.textContent = `AI: Missed ✗`;
      }
      if (missedOrHit === "hit") {
        const feedbackMessage = getFeedbackMessage("ai");
        getNodes.feedback.textContent = `AI: ${feedbackMessage}`;
      }
    }

    if (aiOrUser === "user") {
      if (missedOrHit === "missed") {
        getNodes.feedback.textContent = `Admiral ${retrieveAdmiralNameFromStorageAndSet.admiralName}: Missed ✗`;
      }
      if (missedOrHit === "hit") {
        const feedbackMessage = getFeedbackMessage("user");
        getNodes.feedback.textContent = `Admiral ${retrieveAdmiralNameFromStorageAndSet.admiralName}: ${feedbackMessage}`;
      }
    }
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
          setFeedback("user", "missed");
          triggerAiTurn();
          return;
        }
        // IF hits a ship
        if (div.dataset.attacked === "No" && div.hasAttribute("data-ship")) {
          game.userTurn(div.dataset.index);
          displayAttack(div, "💥", "black");
          setFeedback("user", "hit", div.dataset.ship);
          return;
        }
      });
    });
  };
  triggerUserTurn();

  let aiTimer = 3000;
  let impossibleRecursionCount = 0;
  const triggerAiTurn = async function () {
    getNodes.aiGrounds.style.pointerEvents = "none";
    await new Promise((resolve) => {
      setTimeout(() => {
        getNodes.feedback.textContent = `AI: Targeting...`;
      }, 1500);
      setTimeout(resolve, aiTimer);
    });
    const randomKey = game.computerTurn();

    getNodes.admiralGroundsDivs.forEach((div) => {
      const difficulty = getDifficulty.difficulty;

      if (div.dataset.index === randomKey) {
        // IF already attacked
        if (div.dataset.attacked === "Yes") {
          triggerAiTurn();
        }
        // IF empty
        if (div.dataset.attacked === "No" && !div.hasAttribute("data-ship")) {
          // Recurse if difficulty is Impossible
          if (impossibleRecursionCount > 0) {
            aiTimer = 1;
          }
          if (difficulty === "impossible") {
            impossibleRecursionCount += 1;
            triggerAiTurn();
            return;
          }

          displayAttack(div, "X", "rgb(228, 73, 73)");
          setFeedback("ai", "missed");
          getNodes.aiGrounds.style.pointerEvents = "auto";
        }
        // IF hits a ship
        if (div.dataset.attacked === "No" && div.hasAttribute("data-ship")) {
          const resetImpossibleParameters = (function () {
            if (difficulty === "impossible") {
              impossibleRecursionCount = 0;
              aiTimer = 2000;
            }
          })();

          displayAttack(div, "💥", "black");
          setFeedback("ai", "hit", div.dataset.ship);
          triggerAiTurn();
        }
      }
    });
  };
})();

const configuration = (function () {
  const displayDialog = (function () {
    getNodes.configButton.addEventListener("click", () => {
      getNodes.cover.style.zIndex = "2";
      getNodes.configDialog.style.visibility = "visible";
      getNodes.configDialog.style.opacity = "1";
    });
  })();

  const exitDialog = (function () {
    getNodes.closeDialog.addEventListener("click", async () => {
      getNodes.cover.style.zIndex = "0";
      getNodes.configDialog.style.opacity = "0";
      getNodes.configDialog.style.transition = "opacity 0.5s ease-in-out";
      await new Promise((resolve) => {
        setTimeout(() => {
          getNodes.configDialog.style.visibility = "hidden";
        }, 400);
      });
    });
  })();

  const restartGame = (function () {
    getNodes.kickStartButton.addEventListener("click", () => {
      window.location.href = "./index.html";
    });
  })();

  const shuffleGame = (function () {
    getNodes.shuffleButton.addEventListener("click", () => {
      window.location.reload();
    });
  })();
})();

const setDifficulty = (function () {
  getNodes.difficultyOptions.addEventListener("change", (event) => {
    if (event.target.value === "impossible") {
      localStorage.setItem("difficulty", "impossible");
      window.location.reload();
      // getNodes.difficultyOptions.options[0].removeAttribute("selected");
      // getNodes.difficultyOptions.options[1].removeAttribute("selected");
      // getNodes.difficultyOptions.options[2].setAttribute("selected", true);
    }
    if (event.target.value === "normal") {
      localStorage.setItem("difficulty", "normal");
      window.location.reload();
      // getNodes.difficultyOptions.options[0].removeAttribute("selected");
      // getNodes.difficultyOptions.options[1].setAttribute("selected", true);
      // getNodes.difficultyOptions.options[2].removeAttribute("selected");
    }
    if (event.target.value === "dummy") {
      localStorage.setItem("difficulty", "dummy");
      window.location.reload();
      // getNodes.difficultyOptions.options[0].setAttribute("selected", true);
      // getNodes.difficultyOptions.options[1].removeAttribute("selected");
      // getNodes.difficultyOptions.options[2].removeAttribute("selected");
    }
  });
})();
