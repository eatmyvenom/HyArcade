const fs = require("fs/promises");
const ffs = require("fs");
const { logger } = require("./utils");

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
        logger.info("Reading config from json");
        return new Config(JSON.parse(ffs.readFileSync("./config.json")));
    }

    static fromEnv() {
        logger.info("Reading config from environment");
        return new Config(JSON.parse(process.env.configjson));
    }

    async writeConfig() {
        logger.info("Writing config to json")
        await fs.writeFile("./config.json", JSON.stringify(this, null, 4));
    }
}

module.exports = Config;
