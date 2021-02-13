const apiKey = require('fs').readFileSync('./key')
const https = require('https');
const fs = require('fs');
const cachedStatus = JSON.parse(fs.readFileSync("./status.json"));

let rawstatus = {};

function getUUIDFromCache(name) {
    return JSON.parse(fs.readFileSync("uuids.json"))[name]
}

async function getStatus(name) {
    let uuid = await getUUIDFromCache(name);
    if(!uuid) {
        uuid = getUUID(name);
    }
    
    if(!uuid) {
        return undefined;
    }
    let raw = await getStatusRAW(uuid);
    let json = JSON.parse(raw);
    return json.session;
}

async function getUUID(name) {
    let raw = await getUUIDRaw(name);
    if(raw!="") {
        return JSON.parse(raw).id
    } else {
        return undefined;
    }
}

async function getUUIDRaw(name) {
    return new Promise((resolve,reject)=>{
        https.get(`https://api.mojang.com/users/profiles/minecraft/${name}`, res => {
            let reply='';
            res.on('data',d=>{reply+=d});
            res.on('end',()=>{resolve(reply)});
            res.on('error',err=>{reject(err)});
        });
    });
}

async function getStatusRAW(UUID) {
    return new Promise((resolve,reject)=>{
        https.get(`https://api.hypixel.net/status?key=${apiKey}&uuid=${UUID}`, res => {
            let reply='';
            res.on('data',d=>{reply+=d});
            res.on('end',()=>{resolve(reply)});
            res.on('error',err=>{reject(err)});
        });
    });
}

async function txtStatus(name) {
    let status = await getStatus(name);
    let str='';
    if(!status) {
        return "";
    }

    let pname = (name.slice(0,1).toUpperCase() + name.slice(1) + "                        ").slice(0,17);
    rawstatus[name]=status;
    if (status.online) {
        str += `${pname}: `
        if(status.mode == 'LOBBY') {
            str += `${status.gameType.toLowerCase()} ${status.mode.toLowerCase()}`
        } else if (status.gameType == 'DUELS') {
            str += `${status.mode} - ${status.map}`
        } else if (status.gameType == 'ARCADE') {
            if (status.mode == "FARM_HUNT") {
                str += "Farm hunt - "
            } else if (status.mode == "PVP_CTW") {
                str += "Ctw - "
            } else if (status.mode == "MINI_WALLS") {
                str += "Mini walls - "
            } else if (status.mode.includes("HIDE_AND_SEEK")) {
                str += `${status.mode.replace("HIDE_AND_SEEK","").toLowerCase.replace("_"," ")}`
            }
            else if (status.mode.includes("ZOMBIES")) {
                str += `Zombies ${status.mode.replace("Zombies","").toLowerCase.replace("_"," ")}`
            }
            str += `${status.map}`
        } else if (status.gameType == 'BEDWARS') {
            str += `Bedwars ${status.mode.toLowerCase().replace('_',' ')} - ${status.map}`
        } else if (status.gameType == 'TNTGAMES') {
            str += `Tnt ${status.mode.toLowerCase()} - ${status.map}`
        } else if (status.gameType == 'BUILD_BATTLE') {
            str += `${status.map}`
        } else if (status.gameType == 'HOUSING') {
            str += `Housing ${status.map}`
        } else if (status.gameType == 'SKYBLOCK' && status.mode == "dynamic") {
            str += `Skyblock island`
        } else {
            str += `${status.gameType} ${status.mode}`
        }
        str += "\n"
     } else {
        return "";
    }
    
    return str
}

function isOnlineC(name) {
    if(cachedStatus[name]) {
        return cachedStatus[name].online == true;
    }
    return true;
}


module.exports = {getUUID : getUUID, txtStatus : txtStatus, rawStatus : rawstatus, isOnlineC: isOnlineC}