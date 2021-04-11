const fs = require("fs/promises");
const ffs = require("fs");

class Config {
    key = "";
    altkeys = [];
    mode = "";
    alwaysForce = false;
    logRateLimit = true;
    watchdogTimeout = 30000;
    cluster = "";
    sortDirection = "";
    printAllWins = false;
    showDaytime = false;
    clusterTarget = "";
    commandCharacter = "";
    clusters = {};
    discord = {};
    events = {};
    webhook = {};
    mojang = {};
    std = {};

    constructor(json) {
        for (let thing in json) {
            this[thing] = json[thing];
        }
    }

    static fromJSON() {
        return new Config(JSON.parse(ffs.readFileSync("./config.json")));
    }

    static fromEnv() {
        return new Config(JSON.parse(process.env.configjson));
    }

    async writeConfig() {
        await fs.writeFile("./config.json", JSON.stringify(this, null, 4));
    }
}

module.exports = Config;
