const path = require("path");

module.exports = function GetAsset(dir) {
  // eslint-disable-next-line no-undef
  const daPath = path.join(__dirname, "../../../", "assets", dir);
  return daPath;
};
