const fs = require('fs');
const cachedStatus = JSON.parse(fs.readFileSync("./status.json"));
const { getStatus } = require('./hypixelRequest');

let rawstatus = {};
let cachemiss = [];

// arcade is special so it gets its own method
function arcadeFormatter(status) {
    let str = '';
    if (status.mode == "FARM_HUNT") {
        str += "Farm hunt - "
    } else if (status.mode == "PVP_CTW") {
        str += "Ctw - "
    } else if (status.mode == "MINI_WALLS") {
        str += "Mini walls - "
    } else if (status.mode.includes("HIDE_AND_SEEK")) {
        str += `${status.mode.replace("HIDE_AND_SEEK","").toLowerCase().replace("_"," ").trim()} `
    }
    else if (status.mode.includes("ZOMBIES")) {
        str += `Zombies - `
    }
    str += `${status.map}`
    return str;
}

function mapFormatter(txt) {
    return (''+txt)
        .replace(/ the /ig,'')
        .replace(/_/g,' ')
}

function modeFormatter(txt) {
    return (''+txt)
        .toLowerCase()
        .replace(/_/g,' ')
}

async function genStatus(name,status) {
    let str='';
    
    if(!status) {
        return "";
    }

    // this hack exists because no proper formatter in js
    let pname = ( name.slice(0,1).toUpperCase() 
                    + name.slice(1) 
                    + "                        "
                )
                .slice(0,17);
    // store this in a json file in case i need it later
    rawstatus[name]=status;

    // make sure player is online so we dont log a shit ton
    // of offline players doing nothing
    if (status.online) {

        // start the line with the formatted name
        str += `${pname}: `
        if(status.mode == 'LOBBY') {

            // seeing LOBBY MAIN is not epic so just lower case it
            str += `${modeFormatter(status.gameType)} ${modeFormatter(status.mode)}`

        } else if (status.gameType == 'DUELS') {

            // most duels stuff says duels in the mode
            // so no need to send the gameType
            str += `${status.mode} - ${mapFormatter(status.map)}`

        } else if (status.gameType == 'ARCADE') {

            str += arcadeFormatter(status)

        } else if (status.gameType == 'BEDWARS') {

            str += `Bedwars - ${modeFormatter(status.mode)}`

        } else if (status.gameType == 'TNTGAMES') {

            // Tnt games dont have epic names 
            str += `Tnt ${modeFormatter(status.mode)} - ${mapFormatter(status.map)}`

        } else if (status.gameType == 'BUILD_BATTLE') {

            // the modes dont have seperate maps, just log the map name
            str += `${status.map}`

        } else if (status.gameType == 'MURDER_MYSTERY') {

            // says muder in the mode title
            str += `${modeFormatter(status.mode)}`

        } else if (status.gameType == 'HOUSING') {

            // housing doesnt have a mode
            str += `Housing ${status.map}`

        }
        else if (status.gameType == 'SKYBLOCK'
                && status.mode == "dynamic") {

            // dynamic isnt helpful
            str += `Skyblock island`

        } else {

            // basic formatter for anything i havent covered here
            str += `${modeFormatter(status.gameType)} ${modeFormatter(status.mode)}`

        }
        str += "\n"

     } else {
        return "";
    }

    return str
}

async function txtStatus(name) {
    // unfortunately this cant be shortcut
    let status = await getStatus(name);
    return await genStatus(name,status);
}

function isOnlineC(name) {
    if(cachedStatus[name]!=undefined) {
        return cachedStatus[name].online;
    }
    return true;
}

module.exports = { txtStatus : txtStatus, genStatus: genStatus, rawStatus : rawstatus, isOnlineC: isOnlineC, cacheMiss: cachemiss }