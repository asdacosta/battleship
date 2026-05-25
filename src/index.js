import "./reset.css";
import "./style.css";

(function importAllAssets() {
  function importAll(r) {
    r.keys().map(r);
  }
  importAll(require.context("./assets", false, /\.(png|jpe?g|svg)$/));
})();

const nameInput = document.querySelector("#admiral");
const battleButton = document.querySelector("#battle-btn");
const admiralForm = document.querySelector("#admiral-form");

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!prefersReducedMotion) {
  const placeholder = "Admiral Name";
  let index = 0;
  let direction = 1;

  setInterval(() => {
    if (direction === 1) {
      nameInput.placeholder = nameInput.placeholder.slice(0, -1);
      nameInput.placeholder += placeholder[index];
      nameInput.placeholder += "|";
      index += 1;
      if (index === placeholder.length) {
        direction = -1;
      }
    } else {
      setTimeout(() => {
        nameInput.placeholder = nameInput.placeholder.slice(0, -2);
        nameInput.placeholder += "|";
        index -= 1;
        if (index === 0) {
          direction = 1;
        }
      }, 1000);
    }
  }, 100);
}

function updateBattleButton() {
  const hasName = nameInput.value.trim().length > 0;
  battleButton.disabled = !hasName;
}

updateBattleButton();
nameInput.addEventListener("input", updateBattleButton);

admiralForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = nameInput.value.trim();
  if (!name) {
    return;
  }
  localStorage.setItem("admiralName", name);
  window.location.href = "./battleground.html";
});
