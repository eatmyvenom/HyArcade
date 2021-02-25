const hypixelReq = require('./hypixelReq');
const { key } = require('../config.json');
const { getUUIDFromCache , getUUID } = require('./mojangRequest');
const utils = require('./utils');
const sleep = utils.sleep;
const logger = utils.logger;

async function getData(url) {
    let apiPoint = new hypixelReq(url);
    let response = await apiPoint.makeRequest();

    // Hypixel api put the amount of time you have to wait 
    // upon rate limit within the response headers. If this
    // exists, wait that amount of time in seconds then 
    // make a new request.
    while (apiPoint.headers["retry-after"]) {
        logger.err(`${utils.daytime()}ERROR: Rate limit hit, retrying after ${apiPoint.headers["retry-after"]} seconds`);
        await sleep(apiPoint.headers["retry-after"] * 1000);
        response = await apiPoint.makeRequest();
    }
    return response;
}

async function basicRequest(page, extraArgs = [] ) {
    let url = `https://api.hypixel.net/${page}?key=${key}`
    // this is my handling of adding other args that work
    // in urls, its not perfect but it works well here
    if (extraArgs != []) {
        for(let i = 0; i < extraArgs.length; i++) {
            url += `&${extraArgs[i].key}=${extraArgs[i].val}`
        }
    }

    let data = await getData(url);
    return data;
} 

async function getStatusRAW(uuid) {
    return await basicRequest('status', [{ key : 'uuid', val : uuid}] );
}

async function getAccountDataRaw(uuid) {
    return await basicRequest('player', [{ key : 'uuid', val : uuid}] );
}

async function getGameCountsRAW() {
    // dont put empty array since that is automatically done
    return await basicRequest('gameCounts');
}

async function getGuildRaw(id) {
    return await basicRequest('guild', [{ key : 'id', val : id }]);
}

async function getAccountWins(uuid) {
    let data = await getAccountDataRaw(uuid);
    let json = JSON.parse(data);
    // make sure player has stats to be checked
    if(!json.player || !json.player.stats || !json.player.stats.Arcade) {
        return 0;
    }
    let arcade = json.player.stats.Arcade;
    let wins = 0;
    if(arcade.wins_party) wins += arcade.wins_party;
    if(arcade.wins_party_2) wins += arcade.wins_party_2;
    if(arcade.wins_party_3) wins += arcade.wins_party_3;
    return wins;
}

async function getStatus(name) {
    let uuid = await getUUIDFromCache(name);
    // cache miss
    if(!uuid) {
        // store the cache miss for later
        // this helps me identify name changes
        utils.cacheMiss.push(name);
        uuid = getUUID(name);
    }
    
    // account does not exist
    if(!uuid) {
        return undefined;
    }
    let raw = await getStatusRAW(uuid);
    let json = JSON.parse(raw);
    return json.session;
}

module.exports = { getStatusRaw : getStatusRAW, getStatus : getStatus, getGuildRaw : getGuildRaw, getAccountDataRaw : getAccountDataRaw, getGameCountsRAW : getGameCountsRAW, getAccountWins : getAccountWins }
