const { getUUIDStatus } = require("./hypixelApi");
let { accounts } = require("./listParser").accounts;
let rawstatus = {};

/**
 * Format status for arcade games
 *
 * @param {object} status status object
 * @returns {string}
 */
function arcadeFormatter(status) {
    let str = "";
    if (status.mode == "FARM_HUNT") {
        str += "Farm hunt - ";
    } else if (status.mode == "PVP_CTW") {
        str += "Ctw - ";
    } else if (status.mode == "MINI_WALLS") {
        str += "Mini walls - ";
    } else if (status.mode.includes("HIDE_AND_SEEK")) {
        str += `${modeFormatter(status.mode.replace("HIDE_AND_SEEK", "").toLowerCase().replace("_", " ").trim())} `;
    } else if (status.mode.includes("ZOMBIES")) {
        str += "Zombies - ";
    }
    str += `${status.map}`;
    return str;
}

/**
 * Format text for maps
 *
 * @param {string} txt raw text
 * @returns {string} formatted text
 */
function mapFormatter(txt) {
    return txt.slice(0, 1).toUpperCase() + txt.slice(1).replace(/ the /gi, "").replace(/_/g, " ");
}

/**
 * Format text for game mods
 *
 * @param {string} txt raw text
 * @returns {string} formatted text
 */
function modeFormatter(txt) {
    return txt.slice(0, 1).toUpperCase() + txt.slice(1).toLowerCase().replace(/_/g, " ");
}

/**
 * Convert players status object to a string
 *
 * @param {string} name player name
 * @param {object} status raw status object
 * @returns {string} Formatted result
 */
async function genStatus(name, status) {
    let str = "";

    if (!status) {
        return "";
    }

    // this hack exists because no proper formatter in js
    let pname = (name.slice(0, 1).toUpperCase() + name.slice(1) + "                        ").slice(0, 17);

    // make sure player is online so we dont log a shit ton
    // of offline players doing nothing
    if (status.online) {
        // start the line with the formatted name
        str += `${pname}: `;
        let statusstr = "";
        if (status.mode == "LOBBY") {
            // seeing LOBBY MAIN is not epic so just lower case it
            statusstr += `${modeFormatter(status.gameType)} ${modeFormatter(status.mode)}`;
        } else if (status.gameType == "DUELS") {
            // most duels stuff says duels in the mode
            // so no need to send the gameType
            statusstr += `${status.mode} - ${mapFormatter(status.map)}`;
        } else if (status.gameType == "ARCADE") {
            statusstr += arcadeFormatter(status);
        } else if (status.gameType == "BEDWARS") {
            statusstr += `Bedwars - ${modeFormatter(status.mode)}`;
        } else if (status.gameType == "TNTGAMES") {
            // Tnt games dont have epic names
            statusstr += `Tnt ${modeFormatter(status.mode)} - ${mapFormatter(status.map)}`;
        } else if (status.gameType == "BUILD_BATTLE") {
            // the modes dont have seperate maps, just log the map name
            statusstr += `${status.map}`;
        } else if (status.gameType == "MURDER_MYSTERY") {
            // says muder in the mode title
            statusstr += `${modeFormatter(status.mode)}`;
        } else if (status.gameType == "HOUSING") {
            // housing doesnt have a mode
            statusstr += `Housing ${status.map}`;
        } else if (status.gameType == "SKYBLOCK" && status.mode == "dynamic") {
            // dynamic isnt helpful
            statusstr += "Skyblock island";
        } else {
            // basic formatter for anything i havent covered here
            statusstr += `${modeFormatter(status.gameType)} ${modeFormatter(status.mode)}`;
        }
        if (statusstr.length > 24) {
            statusstr = statusstr.slice(0, 23) + "...";
        }

        str += statusstr + "\n";
    } else {
        return "";
    }

    return str;
}

/**
 * Get a players status and turn it into a string
 *
 * @param {string} uuid
 * @returns {string} formatted status
 */
async function txtStatus(uuid) {
    // unfortunately this cant be shortcut
    let status = await getUUIDStatus(uuid);
    // store this in a json file in case i need it later
    rawstatus[uuid] = status;
    let oldver = accounts.find((acc) => acc.uuid == uuid);
    if (oldver) {
        return await genStatus(oldver.name, status);
    }
}

module.exports = {
    txtStatus: txtStatus,
    genStatus: genStatus,
    rawStatus: rawstatus,
};
