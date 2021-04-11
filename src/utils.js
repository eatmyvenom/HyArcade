const Config = require("./Config");
const cfg = Config.fromJSON();
const fs = require("fs/promises");
const webRequest = require("./webRequest");

/**
 * Halt execution for a specified amount of time
 *
 * @param {Number} time the time in milliseconds to sleep
 * @return {null}
 */
function sleep(time) {
    return new Promise((resolve) => {
        setTimeout(resolve, time);
    });
}

/**
 * Determine which element has the most wins
 *
 * @param {*} element1 the first element to be considered
 * @param {*} element2 the second element to be considered
 * @return {Number} where the first element should move in relation to its current position
 */
function winsSorter(element1, element2) {
    if (cfg.sortDirection == "mostleast") {
        if (element1.wins < element2.wins) return 1;
        if (element1.wins > element2.wins) return -1;
        return 0;
    } else {
        if (element1.wins > element2.wins) return 1;
        if (element1.wins < element2.wins) return -1;
        return 0;
    }
}

/**
 * The time in the day that it is currently
 *
 * @return {String}
 */
function daytime() {
    return cfg.showDaytime
        ? Date()
              .replace(/.*20[0-9][0-9] /, "")
              .replace(/ [A-Z]..-[0-9]... \(.*\)/, "") + " "
        : "";
}

/**
 * The current day
 *
 * @return {String}
 */
function day() {
    return Date()
        .replace(/[0-9].:[0-9].:[0-9].*/, "")
        .trim()
        .replace(/ /g, "_");
}

/**
 * Write json data to a file
 *
 * @param {String} path path of the target file
 * @param {Object} json the json data
 */
async function writeJSON(path, json) {
    await fs.writeFile(path, JSON.stringify(json, null, 4));
}

async function readJSON(path) {
    return JSON.parse(await fs.readFile(path));
}

/**
 * Check if a file exists
 *
 * @param {String} path path of the target file
 * @return {Boolean}
 */
function fileExists(path) {
    return require("fs").existsSync(path);
}

/**
 * Copy a json file to another location with a timestamp or type
 *
 * @param {String} oldfile path of the source file
 * @param {String} path path of the target file
 * @param {String} timetype the way of specifying this file
 */
async function archiveJson(oldfile, path, timetype) {
    old = JSON.parse(await fs.readFile(oldfile + ".json"));
    await writeJSON(`${path}${oldfile}.${timetype}.json`, old);
}

/**
 * Log content to stdout or a file
 *
 * @param {String} content
 */
function log(content) {
    if (cfg.std.disable) {
        fs.writeFile(cfg.std.out, content, { flag: "a" });
    } else {
        console.log(content);
    }
}

/**
 * Log content to stderr or a file
 *
 * @param {String} content
 */
function error(content) {
    if (cfg.std.disable) {
        fs.writeFile(cfg.std.error, content, { flag: "a" });
    } else {
        console.error(daytime() + "ERROR: " + ("" + content).trim());
    }
}

async function downloadFile(name, servername) {
    let response = await webRequest("http://eatmyvenom.me/share/" + servername);
    await fs.writeFile(name, response.data);
}

function getKeyByValue(object, value) {
    return Object.keys(object).find((key) => object[key] === value);
}

function isValidIGN(txt) {
    return (
        txt.length < 17 &&
        txt.length > 2 &&
        !txt.includes("!") &&
        !txt.includes("?") &&
        !txt.includes("<") &&
        !txt.includes(";") &&
        !txt.includes('"') &&
        !txt.includes("(") &&
        !txt.includes(")") &&
        txt != "liar" &&
        txt != "pog" &&
        txt != "fuck" &&
        txt != "yes" &&
        txt != "knew" &&
        txt != "hot" &&
        txt != "ofc" &&
        txt != "get" &&
        txt != "are" &&
        txt != "gamer" &&
        txt != "yea" &&
        txt != "okay"
    );
}

let defaultAllowed = Config.fromJSON().discord.trustedUsers;

module.exports = {
    archiveJson: archiveJson,
    day: day,
    sleep: sleep,
    winsSorter: winsSorter,
    writeJSON: writeJSON,
    readJSON: readJSON,
    fileExists: fileExists,
    downloadFile: downloadFile,
    daytime: daytime,
    isValidIGN: isValidIGN,
    defaultAllowed: defaultAllowed,
    getKeyByValue: getKeyByValue,
    cacheMiss: [],
    logger: {
        out: log,
        err: error,
    },
};
