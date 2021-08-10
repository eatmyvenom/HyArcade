const Logger = require("hyarcade-logger");
const fetch = require("node-fetch");
const cfg = require("hyarcade-config").fromJSON();

module.exports = class Database {

    static async addAccount (json) {
        const data = JSON.stringify(json);
        const url = new URL("account", cfg.dbUrl);
        Logger.info(`Adding ${data.name} to accounts in database`);

        try {
            await fetch(url.toString(), {
                method: "post",
                body: data,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: cfg.dbPass
                }
            });
        } catch (e) {
            Logger.err("Can't connect to database");
            Logger.err(e);
            return {};
        }
    }

};
