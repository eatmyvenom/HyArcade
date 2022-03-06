const path = require("path");

module.exports = function GetAsset(dir) {
  // eslint-disable-next-line no-undef
  return path.join(__dirname, "../../../", "assets", dir);
};
