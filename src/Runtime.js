const utils = require("./utils");
const ffs = require("fs");
const { logger } = require("./utils");

module.exports = class Runtime {
    async save() {
        logger.debug("Saving runtime info json");
        await utils.writeJSON("runtimeinfo.json", this);
    }

    static fromJSON() {
        let newRun = new Runtime();
        let json = JSON.parse(ffs.readFileSync("data/runtimeinfo.json"));
        for (let p in json) {
            newRun[p] = json[p];
        }
        return newRun;
    }
};
