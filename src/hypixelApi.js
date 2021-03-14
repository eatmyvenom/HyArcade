const hypixelReq = require("./hypixelReq");
const { sleep, logger } = require("./utils");
const config = require("../config.json");

/**
 * Function to get the key to use
 *
 * @return {String}
 */
function getKey() {
    let key = config.key;
    if (config.cluster) {
        key = config.clusters[config.cluster].key;
    }
    if (config.mode == "test") {
        key = config.altkeys[Math.floor(Math.random() * config.altkeys.length)];
    }
    return key;
}

module.exports = class hypixelAPI {
    /**
     * Get the raw data from a specified url
     *
     * @static
     * @param {String} url
     * @return {String} 
     */
    static async getData(url) {
        let apiPoint = new hypixelReq(url);
        let response = await apiPoint.makeRequest();

        // Hypixel api put the amount of time you have to wait
        // upon rate limit within the response headers. If this
        // exists, wait that amount of time in seconds then
        // make a new request.
        while (apiPoint.headers["retry-after"]) {
            if (config.logRateLimit) {
                logger.err(
                    `Rate limit hit, retrying after ${apiPoint.headers["retry-after"]} seconds`
                );
            }
            await sleep(apiPoint.headers["retry-after"] * 1000);
            response = await apiPoint.makeRequest();
        }
        return response;
    }

    /**
     * Send a web request to hypixel with url a encoded request
     *
     * @static
     * @param {String} page
     * @param {Object} [extraArgs=[]]
     * @return {String}
     */
    static async basicRequest(page, extraArgs = []) {
        let url = `https://api.hypixel.net/${page}?key=${getKey()}`;
        // this is my handling of adding other args that work
        // in urls, its not perfect but it works well here
        if (extraArgs != []) {
            for (let i = 0; i < extraArgs.length; i++) {
                url += `&${extraArgs[i].key}=${extraArgs[i].val}`;
            }
        }

        let data = await hypixelAPI.getData(url);
        return data;
    }

    /**
     * Returns the status for the player with a specified uuid
     *
     * @static
     * @param {String} uuid
     * @return {String} 
     */
    static async getStatusRAW(uuid) {
        return await hypixelAPI.basicRequest("status", [
            { key: "uuid", val: uuid },
        ]);
    }

    /**
     * Returns the stats for a player with a specified uuid
     *
     * @static
     * @param {String} uuid
     * @return {String} 
     */
    static async getAccountDataRaw(uuid) {
        return await hypixelAPI.basicRequest("player", [
            { key: "uuid", val: uuid },
        ]);
    }

    /**
     * Returns the object status for a player with a specified uuid
     *
     * @static
     * @param {String} uuid
     * @return {Object}
     */
    static async getAccountData(uuid) {
        let data = await hypixelAPI.getAccountDataRaw(uuid);
        let json = JSON.parse(data);
        return json;
    }

    /**
     * Returns the amount of players in various games
     *
     * @static
     * @return {String}
     */
    static async getGameCountsRAW() {
        // dont put empty array since that is automatically done
        return await hypixelAPI.basicRequest("gameCounts");
    }

    /**
     * Returns the data of a guild with a specific id
     *
     * @static
     * @param {String} id the interal id that hypixel assigned to this guild
     * @return {String} 
     */
    static async getGuildRaw(id) {
        return await hypixelAPI.basicRequest("guild", [{ key: "id", val: id }]);
    }

    /**
     * Returns the data of a guild that a player is in
     *
     * @static
     * @param {String} uuid The players uuid
     * @return {String} 
     */
    static async getGuildFromPlayer(uuid) {
        return await hypixelAPI.basicRequest("guild", [
            { key: "player", val: uuid },
        ]);
    }

    /**
     * Get the wins for an account with a specified uuid
     * @deprecated
     * @static
     * @param {String} uuid
     * @return {Number} 
     */
    static async getAccountWins(uuid) {
        let json = await hypixelAPI.getAccountData(uuid);
        // make sure player has stats to be checked
        if (!json.player || !json.player.stats || !json.player.stats.Arcade) {
            return 0;
        }
        let arcade = json.player.stats.Arcade;
        let wins = 0;
        if (arcade.wins_party) wins += arcade.wins_party;
        if (arcade.wins_party_2) wins += arcade.wins_party_2;
        if (arcade.wins_party_3) wins += arcade.wins_party_3;
        return wins;
    }

    /**
     * The objectified status of a player with a given uuid
     *
     * @static
     * @param {String} uuid
     * @return {Object} 
     */
    static async getUUIDStatus(uuid) {
        let raw = await hypixelAPI.getStatusRAW(uuid);
        let json = JSON.parse(raw);
        return json.session;
    }

    /**
     * The objectified counts of players in various games
     *
     * @static
     * @return {Object} 
     */
    static async getGameCounts() {
        let data = await hypixelAPI.getGameCountsRAW();
        return JSON.parse(data);
    }
};
