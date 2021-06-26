const url = require("url");
const hypixelReq = require("./hypixelReq");
const config = require("../Config").fromJSON();
const { sleep, logger } = require("./utils");

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
    if (process.argv[2] == "bot") {
        key = config.clusters["serverbot"].key;
    }
    if (config.mode == "test") {
        key = config.altkeys[Math.floor(Math.random() * config.altkeys.length)];
    }
    return key;
}

module.exports = class HypixelApi {
    endpoint = "";
    args = {};
    reqUrl = "";

    constructor(endpoint, args = {}) {
        this.endpoint = endpoint;
        this.args = args;
        args.key = getKey();
        let urlargs = new url.URLSearchParams(args);
        this.reqUrl = new url.URL(`${endpoint}?${urlargs.toString()}`, "https://api.hypixel.net");
    }

    async makeRequest() {
        let apiPoint = new hypixelReq(url);
        let response = await apiPoint.makeRequest();

        // Hypixel api put the amount of time you have to wait
        // upon rate limit within the response headers. If this
        // exists, wait that amount of time in seconds then
        // make a new request.
        while (apiPoint.headers["retry-after"]) {
            if (config.logRateLimit) {
                logger.warn(`Rate limit hit, retrying after ${apiPoint.headers["retry-after"]} seconds`);
            }
            await sleep(apiPoint.headers["retry-after"] * 1000);
            response = await apiPoint.makeRequest();
        }
        return response;
    }

    static async key() {
        let Api = new HypixelApi("key");
        let data = await Api.makeRequest();
        try {
            return JSON.parse(data);
        } catch (e) {
            logger.err("Hypixel sent malformed json data");
            logger.err(data);
            return await HypixelApi.key();
        }
    }

    static async player(uuid) {
        let Api = new HypixelApi("player", { uuid: uuid });
        let data = await Api.makeRequest();
        try {
            return JSON.parse(data);
        } catch (e) {
            logger.err("Hypixel sent malformed json data");
            logger.err(data);
            return await HypixelApi.player(uuid);
        }
    }

    static async friends(uuid) {
        let Api = new HypixelApi("friends", { uuid: uuid });
        let data = await Api.makeRequest();
        try {
            return JSON.parse(data);
        } catch (e) {
            logger.err("Hypixel sent malformed json data");
            logger.err(data);
            return await HypixelApi.friends(uuid);
        }
    }

    static async recentgames(uuid) {
        let Api = new HypixelApi("recentgames", { uuid: uuid });
        let data = await Api.makeRequest();
        try {
            return JSON.parse(data);
        } catch (e) {
            logger.err("Hypixel sent malformed json data");
            logger.err(data);
            return await HypixelApi.recentgames(uuid);
        }
    }

    static async status(uuid) {
        let Api = new HypixelApi("status", { uuid: uuid });
        let data = await Api.makeRequest();
        try {
            return JSON.parse(data);
        } catch (e) {
            logger.err("Hypixel sent malformed json data");
            logger.err(data);
            return await HypixelApi.status(uuid);
        }
    }

    static async guild(something) {
        let Api;
        if (something.length == 24) {
            Api = new HypixelApi("guild", { id: something });
        } else if (something.length == 32 || something.length == 36) {
            Api = new HypixelApi("guild", { player: something });
        } else {
            Api = new HypixelApi("guild", { name: something });
        }
        let data = await Api.makeRequest();
        try {
            return JSON.parse(data);
        } catch (e) {
            logger.err("Hypixel sent malformed json data");
            logger.err(data);
            return await HypixelApi.guild(something);
        }
    }

    static async achievements() {
        let Api = new HypixelApi("resources/achievements");
        let data = await Api.makeRequest();
        try {
            return JSON.parse(data);
        } catch (e) {
            logger.err("Hypixel sent malformed json data");
            logger.err(data);
            return await HypixelApi.achievements();
        }
    }

    static async challenges() {
        let Api = new HypixelApi("resources/challenges");
        let data = await Api.makeRequest();
        try {
            return JSON.parse(data);
        } catch (e) {
            logger.err("Hypixel sent malformed json data");
            logger.err(data);
            return await HypixelApi.challenges();
        }
    }

    static async boosters() {
        let Api = new HypixelApi("boosters");
        let data = await Api.makeRequest();
        try {
            return JSON.parse(data);
        } catch (e) {
            logger.err("Hypixel sent malformed json data");
            logger.err(data);
            return await HypixelApi.boosters();
        }
    }

    static async counts() {
        let Api = new HypixelApi("counts");
        let data = await Api.makeRequest();
        try {
            return JSON.parse(data);
        } catch (e) {
            logger.err("Hypixel sent malformed json data");
            logger.err(data);
            return await HypixelApi.counts();
        }
    }

    static async leaderboards() {
        let Api = new HypixelApi("leaderboards");
        let data = await Api.makeRequest();
        try {
            return JSON.parse(data);
        } catch (e) {
            logger.err("Hypixel sent malformed json data");
            logger.err(data);
            return await HypixelApi.leaderboards();
        }
    }
};
