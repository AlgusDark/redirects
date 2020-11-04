module.exports = {
  plugins: [
    require("postcss-import")({
      path: ["assets/css"],
    }),
    require("tailwindcss")("./assets/css/tailwind.config.js"),
    require("postcss-nested"),
    require("autoprefixer"),
    ...(process.env.NODE_ENV === "production"
      ? [
          require("cssnano")({
            preset: ["default", { discardComments: { removeAll: true } }],
          }),
        ]
      : []),
  ],
};
