const utils = require("./utils");
const ffs = require("fs");

module.exports = class Runtime {
    async save() {
        await utils.writeJSON("runtimeinfo", this);
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
