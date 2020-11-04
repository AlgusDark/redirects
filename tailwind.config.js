const path = require("path");

module.exports = {
  purge: {
    content: [
      "./layouts/**/*.html",
      "./content/**/*.md",
      "./content/**/*.html",
    ],
    options: {
      whitelist: ["dark"],
    },
  },
  theme: {
    darkSelector: ".dark",
    extend: {
      colors: {
        bg: "var(--color-bg)",
        body: "var(--color-body)",
      },
    },
  },
  variants: {
    borderStyle: ["responsive", "hover", "focus"],
    display: ["dark", "responsive"],
    opacity: ["responsive", "hover", "focus", "active", "group-hover"],
    scale: ["responsive", "hover", "focus", "group-hover"],
    textColor: ["responsive", "hover", "focus", "group-hover"],
    translate: ["responsive", "hover", "focus", "active", "group-hover"],
  },
  plugins: [require("tailwindcss-dark-mode")()],
};
