import "./reset.css";
import "./style.css";
import Typed from "typed.js";

(function importAllAssets() {
  function importAll(r) {
    r.keys().map(r);
  }
  importAll(require.context("./assets", false, /\.(png|jpe?g|svg)$/));
})();

const nameInput = document.querySelector("#admiral");
const battleButton = document.querySelector("#battle-btn");
const admiralForm = document.querySelector("#admiral-form");
const typehint = document.querySelector("#admiral-typehint");

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let typedInstance = null;

function startTypehint() {
  if (prefersReducedMotion || !typehint || nameInput.value.trim()) {
    return;
  }

  typedInstance?.destroy();
  typehint.textContent = "";
  typehint.classList.remove("is-hidden");

  typedInstance = new Typed(typehint, {
    strings: ["Admiral Name"],
    typeSpeed: 70,
    backSpeed: 40,
    backDelay: 1400,
    startDelay: 300,
    loop: true,
    showCursor: true,
    cursorChar: "|",
    attr: null,
  });
}

function stopTypehint() {
  typedInstance?.destroy();
  typedInstance = null;
  if (typehint) {
    typehint.textContent = "";
    typehint.classList.add("is-hidden");
  }
}

if (prefersReducedMotion) {
  typehint?.classList.add("is-hidden");
} else {
  nameInput.removeAttribute("placeholder");
  startTypehint();
}

function updateBattleButton() {
  const hasName = nameInput.value.trim().length > 0;
  battleButton.disabled = !hasName;

  if (hasName) {
    stopTypehint();
  } else if (!prefersReducedMotion && document.activeElement !== nameInput) {
    startTypehint();
  }
}

nameInput.addEventListener("focus", stopTypehint);
nameInput.addEventListener("blur", () => {
  if (!nameInput.value.trim() && !prefersReducedMotion) {
    startTypehint();
  }
});
nameInput.addEventListener("input", updateBattleButton);

updateBattleButton();

admiralForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = nameInput.value.trim();
  if (!name) {
    return;
  }
  stopTypehint();
  localStorage.setItem("admiralName", name);
  window.location.href = "./battleground.html";
});
