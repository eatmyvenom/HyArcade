const { getGameCountsRAW } = require('./hypixelApi');
const { logger } = require('./utils');

async function formatCounts() {
    let str = '';
    let all = await getGameCounts();
    let counts = all.games;

    str += `Arcade Total        : ${counts.ARCADE.players}\n`
    str += `Party Games Total   : ${counts.ARCADE.modes.PARTY}\n`
    str += `HITW Total          : ${counts.ARCADE.modes.HOLE_IN_THE_WALL}\n`
    str += `Farm Hunt Total     : ${counts.ARCADE.modes.FARM_HUNT}\n`
    str += `Throw out Total     : ${counts.ARCADE.modes.THROW_OUT}\n`
    str += `Hypixel says Total  : ${counts.ARCADE.modes.SIMON_SAYS}\n`
    str += `Ctw Total           : ${counts.ARCADE.modes.PVP_CTW}\n`
    str += `Limbo Total         : ${counts.LIMBO.players}\n`
    str += `Idle Total          : ${counts.IDLE.players}\n`
    str += `Queue Total         : ${counts.QUEUE.players}\n`
    str += `Total               : ${all.playerCount}`

    return str;
}

async function logCounts() {
    logger.out(await formatCounts());
}

async function getGameCounts() {
    let data = await getGameCountsRAW();
    return JSON.parse(data);
}

module.exports = { formatCounts : formatCounts, logCounts : logCounts };
