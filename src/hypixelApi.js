const hypixelReq = require('./hypixelReq');
const { key } = require('../config.json');
const { getUUIDFromCache , getUUID } = require('./mojangRequest');
const utils = require('./utils');
const sleep = utils.sleep;
const logger = utils.logger;

module.exports = class hypixelAPI {

    static async getData(url) {
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

    static async basicRequest(page, extraArgs = [] ) {
        let url = `https://api.hypixel.net/${page}?key=${key}`
        // this is my handling of adding other args that work
        // in urls, its not perfect but it works well here
        if (extraArgs != []) {
            for(let i = 0; i < extraArgs.length; i++) {
                url += `&${extraArgs[i].key}=${extraArgs[i].val}`
            }
        }
    
        let data = await hypixelAPI.getData(url);
        return data;
    } 

    static async getStatusRAW(uuid) {
        return await hypixelAPI.basicRequest('status', [{ key : 'uuid', val : uuid}] );
    }

    static async getAccountDataRaw(uuid) {
        return await hypixelAPI.basicRequest('player', [{ key : 'uuid', val : uuid}] );
    }

    static async getAccountData(uuid) {
        let data = await hypixelAPI.getAccountDataRaw(uuid);
        let json = JSON.parse(data);
        return json;
    }

    static async getGameCountsRAW() {
        // dont put empty array since that is automatically done
        return await hypixelAPI.basicRequest('gameCounts');
    }

    static async getGuildRaw(id) {
        return await hypixelAPI.basicRequest('guild', [{ key : 'id', val : id }]);
    }

    static async getAccountWins(uuid) {
        let json = this.getAccountData(uuid);
        // make sure player has stats to be checked
        if(!json.player || !json.player.stats || !json.player.stats.Arcade) {
            return 0;
        }
        let arcade = json.player.stats.Arcade;
        let wins = 0;
        if(arcade.wins_party)   wins += arcade.wins_party;
        if(arcade.wins_party_2) wins += arcade.wins_party_2;
        if(arcade.wins_party_3) wins += arcade.wins_party_3;
        return wins;
    }

    static async getUUIDStatus(uuid) {
        let raw = await hypixelAPI.getStatusRAW(uuid);
        let json = JSON.parse(raw);
        return json.session;
    }

    static async getStatus(name) {
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
        return await hypixelAPI.getUUIDStatus(uuid);
    }

    static async getGameCounts() {
        let data = await getGameCountsRAW();
        return JSON.parse(data);
    }
}
