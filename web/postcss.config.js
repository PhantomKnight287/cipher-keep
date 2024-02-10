const path = require("path");
const hexFixPath = path.join(process.cwd(), "./postcss/hex-fix.js");
module.exports = {
  plugins: {
    [hexFixPath]: {},
    tailwindcss: {},
    autoprefixer: {},
  },
};
