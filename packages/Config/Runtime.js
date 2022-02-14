const ffs = require("fs-extra");
const logger = require("hyarcade-logger");

module.exports = class Runtime {
  async save() {
    logger.debug("Saving runtime info json");
    await ffs.writeFile("data/runtimeinfo.json", JSON.stringify(this, undefined, 2));
  }

  static fromJSON() {
    const newRun = new Runtime();
    let json;
    try {
      json = JSON.parse(ffs.readFileSync("data/runtimeinfo.json"));
      for (const p in json) {
        newRun[p] = json[p];
      }
    } catch {
      logger.err("RUNTIME JSON CANNOT LOAD CORRECTLY, SETTING TO NONE");
      json = {};
    }

    return newRun;
  }
};
