const https = require('https');
const { key } = require("./config.json");

async function formatCounts() {
    let str = '';
    let counts = await getGameCounts();
    counts = counts.games;

    str += `Arcade Total      : ${counts.ARCADE.players}\n`
    str += `Party Games Total : ${counts.ARCADE.modes.PARTY}\n`
    str += `HITW Total        : ${counts.ARCADE.modes.HOLE_IN_THE_WALL}\n`
    str += `Farm Hunt Total   : ${counts.ARCADE.modes.FARM_HUNT}\n`
    str += `Limbo Total       : ${counts.LIMBO.players}\n`
    str += `Idle Total        : ${counts.IDLE.players}\n`
    str += `Queue Total       : ${counts.QUEUE.players}`

    return str;
}

async function logCounts() {
    console.log(await formatCounts());
}

async function getGameCounts() {
    let data = await getGameCountsRAW();
    return JSON.parse(data);
}

function getGameCountsRAW() {
    return new Promise((resolve,reject)=>{
        https.get(`https://api.hypixel.net/gameCounts?key=${key}`, res => {
            let reply='';
            res.on('data',d=>{reply+=d});
            res.on('end',()=>{resolve(reply)});
            res.on('error',err=>{reject(err)});
        });
    });
}

module.exports = { formatCounts : formatCounts, logCounts : logCounts };