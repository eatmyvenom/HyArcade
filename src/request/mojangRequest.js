const logger = require("hyarcade-logger");
const webRequest = require("./webRequest");

/**
 * The raw uuid response from mojang
 *
 * @param {*} name
 * @return {*}
 */
async function getUUIDRaw(name) {
    // promisify query
    let response = await webRequest(`https://api.mojang.com/users/profiles/minecraft/${name}`);
    let data = response.data;
    return data;
}

async function getPlayerRaw(uuid) {
    let response = await webRequest(`https://sessionserver.mojang.com/session/minecraft/profile/${uuid}`);
    let data = response.data;
    return data;
}

async function getPlayer(uuid) {
    let raw = await getPlayerRaw(uuid);
    if (raw != "") {
        return JSON.parse(raw);
    } else {
        // log the missing username so i can change it
        logger.err(`"${uuid}" does not exist`);
        return undefined;
    }
}

/**
 * Actual uuid from mojang
 *
 * @param {String} name
 * @return {String}
 */
async function getUUID(name) {
    let raw = await getUUIDRaw(name);

    // make sure the data isnt an empty response
    if (raw != "") {
        return JSON.parse(raw).id;
    } else {
        // log the missing username so i can change it
        logger.err(`"${name}" does not exist`);
        return undefined;
    }
}

module.exports = {
    getUUIDRaw: getUUIDRaw,
    getUUID: getUUID,
    getPlayer: getPlayer,
};
