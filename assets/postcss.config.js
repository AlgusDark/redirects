module.exports = {
  plugins: [
    require("postcss-import")({
      path: ["assets/css"],
    }),
    require("tailwindcss")("./assets/css/tailwind.config.js"),
    require("postcss-nested"),
    ...(process.env.NODE_ENV === "production"
      ? [
          require("autoprefixer"),
          require("cssnano")({
            preset: ["default", { discardComments: { removeAll: true } }],
          }),
        ]
      : []),
  ],
};
