console.log(process.env.HUGO_ENVIRONMENT);

module.exports = {
  purge: {
    enabled: process.env.HUGO_ENVIRONMENT === "production",
    content: ["./hugo_stats.json"],
    mode: "all",
    options: {
      defaultExtractor: (content) => {
        let els = JSON.parse(content).htmlElements;
        els = els.tags.concat(els.classes, els.ids);
        return els;
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
  theme: {
    extend: {
      colors: {
        bg: "var(--color-bg)",
        text: "var(--color-text)",
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
      },
      typography: {
        DEFAULT: {
          css: {
            a: {
              color: "var(--color-primary)",
              "text-decoration": "none",
              "&:hover": {
                "text-decoration": "underline",
              },
            },
            "blockquote p:first-of-type::before": false,
            "blockquote p:last-of-type::after": false,
            code: {
              padding: "0.125rem 0.2rem",
              "border-radius": "0.2rem",
              background: "#e2e7ed",
            },
            ul: {
              "word-break": "break-word",
            },
          },
        },
      },
    },
  },
};
