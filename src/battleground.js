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
  const dimensionOptions = document.querySelector("#dimension");

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
    dimensionOptions,
    // admiralDraggableShips,
    // admiralDroppableSpots,
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

  const setClasses = (function () {
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

    getNodes.admiralGroundsDivs.forEach((div, divIndex) => {
      userBoard.forEach((entry, entryIndex) => {
        if (divIndex === entryIndex) {
          if (entry !== null && entry !== "O") {
            setClass(div, entry);
          }
        }
      });
    });

    getNodes.aiGroundsDivs.forEach((div, divIndex) => {
      computerBoard.forEach((entry, entryIndex) => {
        if (divIndex === entryIndex) {
          if (entry !== null && entry !== "O") {
            setClass(div, entry);
          }
        }
      });
    });
  })();

  const populateWithSpatialShips = function () {
    const setSpatialDimension = function (grounds) {
      const appendShipImg = function (shipSrc, shipLength, shipType) {
        for (const div of grounds) {
          if (div.dataset.ship === shipType) {
            // div.style.position = "relative";
            const shipImg = document.createElement("img");
            shipImg.setAttribute("src", `${shipSrc}`);

            const updateImgSize = function () {
              const width = div.getBoundingClientRect().width * shipLength;
              const height = div.getBoundingClientRect().height;
              shipImg.style.width = `${width - 5}px`;
              shipImg.style.height = `${height}px`;
            };
            updateImgSize();
            window.addEventListener("resize", updateImgSize);

            const removeScaling = (function () {
              div.style.transform = "scale(1)";
            })();

            div.appendChild(shipImg);
            return;
          }
        }
      };
      appendShipImg("./assets/carrier.png", 5, "5");
      appendShipImg("./assets/battleship.png", 4, "4");
      appendShipImg("./assets/destroyer.png", 3, "3.5");
      appendShipImg("./assets/submarine.png", 3, "3");
      appendShipImg("./assets/patrol-boat.png", 2, "2");
    };
    setSpatialDimension(getNodes.admiralGroundsDivs);

    const setSpatialDimensionForAiAndHide = (function () {
      setSpatialDimension(getNodes.aiGroundsDivs);
      getNodes.aiGroundsDivs.forEach((div) => {
        if (div.querySelector("img")) {
          div.querySelector("img").style.display = "none";
        }
      });
    })();

    const peekAiBoard = (function () {
      getNodes.peekButton.addEventListener("click", () => {
        if (getNodes.dimensionOptions.value === "simple") {
          return;
        }

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

        // Show ships
        getNodes.aiGroundsDivs.forEach((div) => {
          if (div.querySelector("img")) {
            div.querySelector("img").style.display = "inline";
          }
        });

        const hideAiBoard = (async function () {
          await new Promise((resolve) => {
            setTimeout(() => {
              getNodes.aiGroundsDivs.forEach((div) => {
                if (div.querySelector("img")) {
                  div.querySelector("img").style.display = "none";
                }
              });
            }, 1000);
          });
        })();
      });
    })();
  };
  populateWithSpatialShips();

  const populateWithColor = function () {
    const populateUserBoard = (function () {
      getNodes.admiralGroundsDivs.forEach((div, divIndex) => {
        userBoard.forEach((entry, entryIndex) => {
          if (divIndex === entryIndex) {
            if (entry !== null && entry !== "O") {
              setRandomColors(div, entry);
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
              const peekAiBoard = (function () {
                getNodes.peekButton.addEventListener("click", () => {
                  if (getNodes.dimensionOptions.value === "spatial") {
                    return;
                  }

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
  };

  const populateWithDimensionChange = (function () {
    getNodes.dimensionOptions.addEventListener("change", (event) => {
      if (event.target.value === "simple") {
        const clearSpatialShips = (function () {
          getNodes.admiralGroundsDivs.forEach((div) => {
            if (div.querySelector("img")) {
              div.querySelector("img").style.display = "none";
            }
          });

          getNodes.aiGroundsDivs.forEach((div) => {
            if (div.querySelector("img")) {
              div.querySelector("img").style.display = "none";
            }
          });
        })();

        populateWithColor();
      }

      if (event.target.value === "spatial") {
        const clearColors = (function () {
          getNodes.admiralGroundsDivs.forEach((div) => {
            div.style.backgroundColor = "initial";
          });

          getNodes.aiGroundsDivs.forEach((div) => {
            div.style.backgroundColor = "initial";
          });
        })();

        const bringBackSpatialShips = (function () {
          getNodes.admiralGroundsDivs.forEach((div) => {
            if (div.querySelector("img")) {
              div.querySelector("img").style.display = "inline";
            }
          });
        })();
      }
    });
  })();

  const populateAiBoardWhenGameOver = function () {
    getNodes.aiGroundsDivs.forEach((div, divIndex) => {
      computerBoard.forEach((entry, entryIndex) => {
        if (divIndex === entryIndex) {
          if (getNodes.dimensionOptions.value === "simple") {
            setRandomColors(div, entry);
          }
          if (getNodes.dimensionOptions.value === "spatial") {
            if (div.querySelector("img")) {
              div.querySelector("img").style.display = "inline";
            }
          }
        }
      });
    });
  };

  return { game, populateAiBoardWhenGameOver };
})();

const displayTarget = (function () {
  const __forEachGrounds = function (grounds) {
    grounds.forEach((div) => {
      const targetSpan = document.createElement("span");
      targetSpan.textContent = "💢";
      targetSpan.style.zIndex = "1";
      targetSpan.style.display = "none";
      div.appendChild(targetSpan);

      div.addEventListener("mouseover", () => {
        targetSpan.style.display = "inline";
        div.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
        // div.textContent = "💢";
      });
      div.addEventListener("mouseout", () => {
        if (div.textContent !== "X" && div.textContent !== "💥") {
          targetSpan.style.display = "none";
          div.style.backgroundColor = "initial";
          // div.textContent = "";
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
  let gameOver = false;

  const getDifficulty = (function () {
    let difficulty = localStorage.getItem("difficulty");
    if (!difficulty) {
      difficulty = "normal";
    } else {
      if (difficulty === "impossible") {
        getNodes.difficultyOptions.options[0].removeAttribute("selected");
        getNodes.difficultyOptions.options[1].removeAttribute("selected");
        getNodes.difficultyOptions.options[2].setAttribute("selected", true);
        getNodes.feedback.textContent = "Don't miss!";
      }
      if (difficulty === "normal") {
        getNodes.difficultyOptions.options[0].removeAttribute("selected");
        getNodes.difficultyOptions.options[1].setAttribute("selected", true);
        getNodes.difficultyOptions.options[2].removeAttribute("selected");
        getNodes.feedback.textContent = "Initiate attack!";
      }
      if (difficulty === "dummy") {
        getNodes.difficultyOptions.options[0].setAttribute("selected", true);
        getNodes.difficultyOptions.options[1].removeAttribute("selected");
        getNodes.difficultyOptions.options[2].removeAttribute("selected");
        getNodes.feedback.textContent = "Initiate attack!";
      }
    }

    return { difficulty };
  })();

  const displayAttack = function (spot, inputValue, fontColor) {
    const span = spot.querySelector("span");
    span.style.display = "inline";
    span.textContent = inputValue;
    span.style.zIndex = "1";

    spot.style.color = fontColor;
    spot.style.pointerEvents = "none";
    spot.style.zIndex = "1";
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
            feedbackMessage =
              'Sunk the Carrier! <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>sail-boat-sink</title><path d="M20.96 21C19.9 21 18.9 20.74 17.96 20.24C16.12 21.24 13.81 21.24 11.97 20.24C10.13 21.24 7.82 21.24 6 20.24C4.77 20.93 3.36 21.04 2 21V19C3.41 19.04 4.77 18.89 6 18C7.74 19.24 10.21 19.24 11.97 18C13.74 19.24 16.2 19.24 17.96 18C19.17 18.89 20.54 19.04 21.94 19V21H20.96M22 3.5L7.11 5.96L13.11 12.17L22 3.5M10.81 16.36L11.97 15.54L13.12 16.36C13.65 16.72 14.3 16.93 14.97 16.93C15.12 16.93 15.28 16.91 15.43 16.89L5.2 6.31C4.29 7.65 3.9 9.32 4 10.92L9.74 16.83C10.13 16.74 10.5 16.58 10.81 16.36Z" /></svg>';
          }
          break;
        case "4":
          feedbackMessage = "Hit the Battleship 🎯";
          if (victim.ships.Battleship.currentNumHits === 4) {
            feedbackMessage =
              'Sunk the Battleship! <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>sail-boat-sink</title><path d="M20.96 21C19.9 21 18.9 20.74 17.96 20.24C16.12 21.24 13.81 21.24 11.97 20.24C10.13 21.24 7.82 21.24 6 20.24C4.77 20.93 3.36 21.04 2 21V19C3.41 19.04 4.77 18.89 6 18C7.74 19.24 10.21 19.24 11.97 18C13.74 19.24 16.2 19.24 17.96 18C19.17 18.89 20.54 19.04 21.94 19V21H20.96M22 3.5L7.11 5.96L13.11 12.17L22 3.5M10.81 16.36L11.97 15.54L13.12 16.36C13.65 16.72 14.3 16.93 14.97 16.93C15.12 16.93 15.28 16.91 15.43 16.89L5.2 6.31C4.29 7.65 3.9 9.32 4 10.92L9.74 16.83C10.13 16.74 10.5 16.58 10.81 16.36Z" /></svg>';
          }
          break;
        case "3.5":
          feedbackMessage = "Hit the Destroyer 🎯";
          if (victim.ships.Destroyer.currentNumHits === 3) {
            feedbackMessage =
              'Sunk the Destroyer! <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>sail-boat-sink</title><path d="M20.96 21C19.9 21 18.9 20.74 17.96 20.24C16.12 21.24 13.81 21.24 11.97 20.24C10.13 21.24 7.82 21.24 6 20.24C4.77 20.93 3.36 21.04 2 21V19C3.41 19.04 4.77 18.89 6 18C7.74 19.24 10.21 19.24 11.97 18C13.74 19.24 16.2 19.24 17.96 18C19.17 18.89 20.54 19.04 21.94 19V21H20.96M22 3.5L7.11 5.96L13.11 12.17L22 3.5M10.81 16.36L11.97 15.54L13.12 16.36C13.65 16.72 14.3 16.93 14.97 16.93C15.12 16.93 15.28 16.91 15.43 16.89L5.2 6.31C4.29 7.65 3.9 9.32 4 10.92L9.74 16.83C10.13 16.74 10.5 16.58 10.81 16.36Z" /></svg>';
          }
          break;
        case "3":
          feedbackMessage = "Hit the Submarine 🎯";
          if (victim.ships.Submarine.currentNumHits === 3) {
            feedbackMessage =
              'Sunk the Submarine! <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>sail-boat-sink</title><path d="M20.96 21C19.9 21 18.9 20.74 17.96 20.24C16.12 21.24 13.81 21.24 11.97 20.24C10.13 21.24 7.82 21.24 6 20.24C4.77 20.93 3.36 21.04 2 21V19C3.41 19.04 4.77 18.89 6 18C7.74 19.24 10.21 19.24 11.97 18C13.74 19.24 16.2 19.24 17.96 18C19.17 18.89 20.54 19.04 21.94 19V21H20.96M22 3.5L7.11 5.96L13.11 12.17L22 3.5M10.81 16.36L11.97 15.54L13.12 16.36C13.65 16.72 14.3 16.93 14.97 16.93C15.12 16.93 15.28 16.91 15.43 16.89L5.2 6.31C4.29 7.65 3.9 9.32 4 10.92L9.74 16.83C10.13 16.74 10.5 16.58 10.81 16.36Z" /></svg>';
          }
          break;
        case "2":
          feedbackMessage = "Hit the Patrol Boat 🎯";
          if (victim.ships["Patrol Boat"].currentNumHits === 2) {
            feedbackMessage =
              'Sunk the Patrol Boat! <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>sail-boat-sink</title><path d="M20.96 21C19.9 21 18.9 20.74 17.96 20.24C16.12 21.24 13.81 21.24 11.97 20.24C10.13 21.24 7.82 21.24 6 20.24C4.77 20.93 3.36 21.04 2 21V19C3.41 19.04 4.77 18.89 6 18C7.74 19.24 10.21 19.24 11.97 18C13.74 19.24 16.2 19.24 17.96 18C19.17 18.89 20.54 19.04 21.94 19V21H20.96M22 3.5L7.11 5.96L13.11 12.17L22 3.5M10.81 16.36L11.97 15.54L13.12 16.36C13.65 16.72 14.3 16.93 14.97 16.93C15.12 16.93 15.28 16.91 15.43 16.89L5.2 6.31C4.29 7.65 3.9 9.32 4 10.92L9.74 16.83C10.13 16.74 10.5 16.58 10.81 16.36Z" /></svg>';
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
          gameOver = true;
          populateBoards.populateAiBoardWhenGameOver();
          getNodes.aiGrounds.style.pointerEvents = "none";
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
          gameOver = true;
          populateBoards.populateAiBoardWhenGameOver();
          getNodes.aiGrounds.style.pointerEvents = "none";
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
        getNodes.feedback.innerHTML = `AI: ${feedbackMessage}`;
      }
    }

    if (aiOrUser === "user") {
      if (missedOrHit === "missed") {
        getNodes.feedback.textContent = `Admiral ${retrieveAdmiralNameFromStorageAndSet.admiralName}: Missed ✗`;
      }
      if (missedOrHit === "hit") {
        const feedbackMessage = getFeedbackMessage("user");
        getNodes.feedback.innerHTML = `Admiral ${retrieveAdmiralNameFromStorageAndSet.admiralName}: ${feedbackMessage}`;
      }
    }
  };

  const triggerUserTurn = function () {
    if (gameOver) {
      return;
    }

    getNodes.aiGrounds.style.pointerEvents = "auto";
    getNodes.aiGroundsDivs.forEach((div) => {
      div.addEventListener("click", () => {
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

  let aiTimer = 2000;
  let recursionCount = 0;
  const triggerAiTurn = async function () {
    if (gameOver) {
      return;
    }

    getNodes.aiGrounds.style.pointerEvents = "none";
    await new Promise((resolve) => {
      if (aiTimer !== 1) {
        setTimeout(() => {
          getNodes.feedback.textContent = `AI: Targeting...`;
        }, 1500);
      }
      setTimeout(resolve, aiTimer);
    });
    const randomKey = game.computerTurn();

    for (const div of getNodes.admiralGroundsDivs) {
      const difficulty = getDifficulty.difficulty;
      if (div.dataset.index === randomKey) {
        // IF empty
        if (div.dataset.attacked === "No" && !div.hasAttribute("data-ship")) {
          // Recurse at faster timeout if difficulty is Impossible
          if (difficulty === "impossible") {
            if (recursionCount > 0) {
              aiTimer = 1;
            }
            recursionCount += 1;
            triggerAiTurn();
            return;
          }

          const resetDummyTimerParameters = (function () {
            if (difficulty === "dummy") {
              recursionCount = 0;
              aiTimer = 2000;
            }
          })();

          displayAttack(div, "X", "rgb(228, 73, 73)");
          setFeedback("ai", "missed");
          getNodes.aiGrounds.style.pointerEvents = "auto";
        }
        // IF hits a ship
        if (div.dataset.attacked === "No" && div.hasAttribute("data-ship")) {
          // Recurse at faster timeout if difficulty is dummy
          if (difficulty === "dummy") {
            if (recursionCount > 0) {
              aiTimer = 1;
            }
            recursionCount += 1;
            triggerAiTurn();
            return;
          }

          const resetImpossibleTimerParameters = (function () {
            if (difficulty === "impossible") {
              recursionCount = 0;
              aiTimer = 2000;
            }
          })();

          displayAttack(div, "💥", "black");
          setFeedback("ai", "hit", div.dataset.ship);
          triggerAiTurn();
          return;
        }
      }
    }
  };

  return { gameOver };
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

  const setDifficulty = (function () {
    getNodes.difficultyOptions.addEventListener("change", (event) => {
      if (event.target.value === "impossible") {
        localStorage.setItem("difficulty", "impossible");
        window.location.reload();
      }
      if (event.target.value === "normal") {
        localStorage.setItem("difficulty", "normal");
        window.location.reload();
      }
      if (event.target.value === "dummy") {
        localStorage.setItem("difficulty", "dummy");
        window.location.reload();
      }
    });
  })();
})();

const setDragAndDrop = (function () {
  const setAttributes = (function () {
    const game = populateBoards.game;
    const userBoard = game.user.board.flat();
    const legalMoves = game.user.getLegalMoves();
    const defaultUserBoard = game.user.board;

    getNodes.admiralGroundsDivs.forEach((div) => {
      if (div.dataset.ship) {
        div.setAttribute("draggable", true);
      }
    });

    // getNodes.admiralGroundsDivs.forEach((div, divIndex) => {
    // userBoard.forEach((entry, entryIndex) => {
    //   if (divIndex === entryIndex) {
    //     if (entry === null) {
    //       div.classList.add("droppable");
    //     }
    //     if (entry === "O") {
    //       div.classList.add("undroppable");
    //     }
    //   }
    // });
    // });
    const getMoves = function (shipIndex) {
      const shipMoves = legalMoves[shipIndex];
      const shipLegalMoves = [];
      const shipIllegalMoves = [];
      const defineMovesForEachShipRow = (function () {
        for (let n = 0; n < 10; n++) {
          shipLegalMoves.push([]);
          shipIllegalMoves.push([]);
        }
      })();

      defaultUserBoard.forEach((shipRow, rowIndex) => {
        shipMoves.forEach((moves, index) => {
          const values = [];
          for (let n = 0; n < moves.length; n++) {
            const value = shipRow[moves[n]];
            values.push(value);
          }

          const checkLegality = (function () {
            const isAllNull = values.every((value) => value === null);
            if (isAllNull) {
              shipLegalMoves[rowIndex].push(moves[0]);
            }
            if (!isAllNull) {
              shipIllegalMoves[rowIndex].push(moves[0]);
            }
          })();
        });
      });
      return { shipLegalMoves, shipIllegalMoves };
    };

    const setShipAttributes = function (shipIndex, shipLength) {
      const shipMoves = getMoves(shipIndex);
      const shipLegalMoves = shipMoves.shipLegalMoves;
      const shipIllegalMoves = shipMoves.shipIllegalMoves;
      // console.log("###");
      // console.log(shipLength);
      // console.log(shipLegalMoves);
      // console.log(shipIllegalMoves);
      getNodes.admiralGroundsDivs.forEach((div, divIndex) => {
        shipLegalMoves.forEach((moves, movesIndex) => {
          if (moves) {
            if (movesIndex === parseInt(divIndex / 10)) {
              moves.forEach((move) => {
                if (move === divIndex % 10) {
                  div.classList.add(`droppable${shipLength}`);
                }
              });
            }
          }
        });
        shipIllegalMoves.forEach((moves, movesIndex) => {
          if (moves) {
            if (movesIndex === parseInt(divIndex / 10)) {
              moves.forEach((move) => {
                if (move === divIndex % 10) {
                  div.classList.add(`not-droppable${shipLength}`);
                }
              });
            }
          }
        });
      });
    };
    setShipAttributes(0, 5);
    setShipAttributes(1, 4);
    setShipAttributes(2, 3);
    setShipAttributes(3, 3);
    setShipAttributes(4, 2);
  })();
  const admiralDraggableShips = document.querySelectorAll("div[draggable='true']");
  const admiralDroppableSpots = document.querySelectorAll(".droppable");
  const admiralUndroppableSpots = document.querySelectorAll(".undroppable");

  let catchEventDataset = null;
  const dragStart = function (event) {
    event.dataTransfer.setData("text/plain", event.target.dataset.ship);
    catchEventDataset = event.target.dataset.ship;
  };

  const dragOver = function (event) {
    event.preventDefault();

    const setHoveringColor = (function () {
      let currentTarget = event.target;
      for (let n = 0; n < parseInt(catchEventDataset); n++) {
        currentTarget.style.backgroundColor = "rgba(98, 253, 60, 0.6)";
        currentTarget = currentTarget.nextElementSibling;
      }
    })();
  };

  const dragLeave = function (event) {
    const removeHoveringColor = (function () {
      let currentTarget = event.target;
      for (let n = 0; n < parseInt(catchEventDataset); n++) {
        currentTarget.style.backgroundColor = "initial";
        currentTarget = currentTarget.nextElementSibling;
      }
    })();
  };

  const drop = function (event) {
    event.preventDefault();
    const shipDataset = event.dataTransfer.getData("text/plain");
    const dropTarget = event.target;

    const removeHoveringColor = (function () {
      let currentTarget = event.target;
      for (let n = 0; n < parseInt(catchEventDataset); n++) {
        currentTarget.style.backgroundColor = "initial";
        currentTarget = currentTarget.nextElementSibling;
      }
    })();

    const removeScaling = (function () {
      dropTarget.style.transform = "scale(1)";
    })();

    const appendShipToTarget = (function () {
      // Append ship img of the first div(in the set of divs with same dataset) to the target div
      const draggedShip = document.querySelector(`[data-ship='${shipDataset}']`);
      const shipImg = draggedShip.querySelector("img");
      dropTarget.appendChild(shipImg);
    })();
  };

  admiralDraggableShips.forEach((ship) => {
    ship.addEventListener("dragstart", dragStart);
  });

  admiralDroppableSpots.forEach((spot) => {
    spot.addEventListener("dragover", dragOver);
    spot.addEventListener("dragleave", dragLeave);
    spot.addEventListener("drop", drop);
  });

  // indicate undroppable spots with red background
  const undroppableDragOver = function (event) {
    event.preventDefault();
    const setHoveringColor = (function () {
      let currentTarget = event.target;
      for (let n = 0; n < parseInt(catchEventDataset); n++) {
        currentTarget.style.backgroundColor = "rgba(248, 73, 29, 0.6)";
        currentTarget = currentTarget.nextElementSibling;
      }
    })();
  };
  const undroppableDrop = function (event) {
    event.preventDefault();
    const removeHoveringColor = (function () {
      let currentTarget = event.target;
      for (let n = 0; n < parseInt(catchEventDataset); n++) {
        currentTarget.style.backgroundColor = "initial";
        currentTarget = currentTarget.nextElementSibling;
      }
    })();
  };
  admiralUndroppableSpots.forEach((spot) => {
    spot.addEventListener("dragover", undroppableDragOver);
    spot.addEventListener("dragleave", dragLeave);
    spot.addEventListener("drop", undroppableDrop);
  });
})();

// TODO: Scaling, ShipDataSet
