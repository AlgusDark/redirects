type Mode = "dark" | "light";

let key = "cosmonauta-felino";

let $toggle = document.querySelector("#theme-toggle");

document.addEventListener("DOMContentLoaded", ready);

function ready() {
  changeAriaLabel();

  if ($toggle) $toggle.addEventListener("click", toggleMode, false);
}

function changeAriaLabel() {
  let mode = getMode();

  if (mode === "dark") {
    $toggle.setAttribute("aria-label", `Activate light mode`);
  } else {
    $toggle.setAttribute("aria-label", `Activate dark mode`);
  }
}

function getMode() {
  return (localStorage.getItem(key) as Mode) || "dark";
}

function setMode(mode: Mode) {
  try {
    localStorage.setItem(key, mode);
    if (mode === "light") {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    }

    changeAriaLabel();
  } catch (err) {
    console.error(err);
  }
}

function toggleMode() {
  let theme = getMode();
  if (theme === "dark") {
    setMode("light");
  } else {
    setMode("dark");
  }
}
