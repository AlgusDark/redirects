let tailwindConfig =
  process.env.HUGO_FILE_TAILWIND_CONFIG_JS || "./tailwind.config.js";
const tailwind = require("tailwindcss")(tailwindConfig);
const autoprefixer = require("autoprefixer");

module.exports = {
  plugins: [
    tailwind,
    require("postcss-import"),
    require("postcss-nested"),
    ...(process.env.HUGO_ENVIRONMENT === "production" ? [autoprefixer] : []),
  ],
};
