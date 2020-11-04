type Mode = "dark" | "light";

let key = "cosmonauta-felino";

document.addEventListener("DOMContentLoaded", ready);

function ready() {
  let toggle = document.querySelector("#theme-toggle");
  if (toggle) toggle.addEventListener("click", toggleMode, false);
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

(function () {
  try {
    let mode = getMode();
    if (!mode) {
      let matches = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (!matches) {
        return;
      }
      mode = "dark";
    }
    if (mode === "light") {
      document.documentElement.classList.remove("dark");
    }

    document.documentElement.classList.add(mode);
  } catch (e) {}
})();
