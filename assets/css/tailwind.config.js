const path = require("path");

module.exports = {
  future: {
    purgeLayersByDefault: true,
  },
  purge: {
    content: ["./layouts/**/*.html", "./content/**/*.md"],
    options: {
      whitelist: ["dark"],
    },
  },
  theme: {
    darkSelector: ".dark",
    extend: {
      colors: {
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        tertiary: "var(--color-tertiary)",
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
