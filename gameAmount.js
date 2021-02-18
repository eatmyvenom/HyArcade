const { sleep } = require('./utils');
const { getGameCountsRAW } = require('./hypixelRequest');

async function formatCounts() {
    let str = '';
    let counts = await getGameCounts();
    counts = counts.games;

    str += `Arcade Total        : ${counts.ARCADE.players}\n`
    str += `Party Games Total   : ${counts.ARCADE.modes.PARTY}\n`
    str += `HITW Total          : ${counts.ARCADE.modes.HOLE_IN_THE_WALL}\n`
    str += `Farm Hunt Total     : ${counts.ARCADE.modes.FARM_HUNT}\n`
    str += `Throw out Total     : ${counts.THROW_OUT.players}\n`
    str += `Hypixel says Total  : ${counts.SIMON_SAYS.players}\n`
    str += `Ctw Total           : ${counts.PVP_CTW.players}\n`
    str += `Idle Total          : ${counts.IDLE.players}\n`
    str += `Queue Total         : ${counts.QUEUE.players}\n`
    str += `Total               : ${counts.playerCount.players}`

    return str;
}

async function logCounts() {
    // this isnt looped so in theory it could get me rate limited
    // so therefore there is a useless sleep here to avoid the 
    // hypixel rate limit
    sleep(500);
    console.log(await formatCounts());
}

async function getGameCounts() {
    let data = await getGameCountsRAW();
    return JSON.parse(data);
}

module.exports = { formatCounts : formatCounts, logCounts : logCounts };