const fs = require("fs-extra");

module.exports = {
  async read(fileName) {
    const list = await fs.readFile(fileName);
    if (list.toString().trim() != "") {
      return list
        .toString()
        .trim()
        .split("\n")
        .filter(v => v != "");
    }
  },

  async write(fileName, list) {
    if (list.join("\n").trim() != "") {
      return await fs.writeFile(fileName, list.join("\n").trim());
    }
  },
};
