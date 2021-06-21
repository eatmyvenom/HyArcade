const webReq = require("./webRequest");

/**
 * Get an optifine game from in game name
 *
 * @param {String} name
 * @return {Buffer} Cape as raw png
 */
async function reqOFCape(name) {
    return await webReq(`http://s.optifine.net/capes/${name}.png`);
}

module.exports = class optifineRequest {
    name = "";
    headers = {};
    status = 404;
    data = "";

    /**
     * Creates an instance of optifineRequest.
     * @param {String} name players in game name
     */
    constructor(name) {
        this.name = name;
    }

    /**
     * Sends the request to the optifine server and sets object data accordingly
     *
     */
    async makeRequest() {
        let res = await reqOFCape(this.name);
        this.headers = res.headers;
        this.status = res.status;
        this.data = res.data;
    }

    /**
     * Returns if the player has a cape
     *
     * @return {Boolean}
     */
    hasCape() {
        return this.status != 404;
    }

    /**
     * Return the capes raw png
     *
     * @return {Buffer}
     */
    getCapePNG() {
        return this.data;
    }
};
