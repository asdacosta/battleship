import "./reset.css";
import "./battleground.css";

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

  return {
    admiralHeadDivs,
    admiralTailDivs,
    aiHeadDivs,
    aiTailDivs,
    admiralGroundsDivs,
    aiGroundsDivs,
  };
})();

const displayHeadAndTailHoveringEffect = (function () {
  getNodes.admiralHeadDivs.forEach((div, index) => {
    div.addEventListener("mouseover", () => {
      for (let m = 0; m < 10; m++) {
        getNodes.admiralGroundsDivs[10 * m + index].style.border =
          "2px solid rgba(255, 255, 255, 0.4)";
      }
    });
    div.addEventListener("mouseout", () => {
      for (let m = 0; m < 10; m++) {
        getNodes.admiralGroundsDivs[10 * m + index].style.border =
          "2px solid rgb(255, 255, 255)";
      }
    });
  });

  getNodes.admiralTailDivs.forEach((div, index) => {
    div.addEventListener("mouseover", () => {
      for (let n = 0; n < 10; n++) {
        getNodes.admiralGroundsDivs[n + index * 10].style.border =
          "2px solid rgba(255, 255, 255, 0.4)";
      }
    });
    div.addEventListener("mouseout", () => {
      for (let n = 0; n < 10; n++) {
        getNodes.admiralGroundsDivs[n + index * 10].style.border =
          "2px solid rgb(255, 255, 255)";
      }
    });
  });
})();
