module.exports = {
  plugins: [
    require("tailwindcss"),
    require("postcss-import"),
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
