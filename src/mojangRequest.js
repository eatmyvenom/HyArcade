const https = require('https');
const fs = require('fs');
const { daytime } = require('./utils');
const webRequest = require('./webRequest')

async function getUUIDRaw(name) {
    // promisify query
    let response = await webRequest(`https://api.mojang.com/users/profiles/minecraft/${name}`);
    let data = response.data;
    return data;
}

async function getUUID(name) {
    let raw = await getUUIDRaw(name);

    // make sure the data isnt an empty response
    if(raw!="") {
        return JSON.parse(raw).id
    } else {
        // log the missing username so i can change it
        logger.err(`${daytime()}ERROR: "${name}" does not exist`)
        return undefined;
    }
}

function getUUIDFromCache(name) {
    // avoid making mojang requests
    return JSON.parse(fs.readFileSync("uuids.json"))[name]
}

module.exports = { getUUIDRaw : getUUIDRaw, getUUID : getUUID, getUUIDFromCache : getUUIDFromCache }
