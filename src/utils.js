const config = require("../config.json");
const fs = require("fs/promises");
/**
 * This only works in async functions
 * because of how promises work.
 */
function sleep(time) {
    return new Promise((resolve) => {
        setTimeout(resolve, time);
    });
}

/**
 * This literally just sorts from
 * an object in the element
 */
function winsSorter(a, b) {
    if (config.sortDirection == "mostleast") {
        if (a.wins < b.wins) return 1;
        if (a.wins > b.wins) return -1;
        return 0;
    } else {
        if (a.wins > b.wins) return 1;
        if (a.wins < b.wins) return -1;
        return 0;
    }
}

function daytime() {
    return config.showDaytime
        ? Date()
              .replace(/.*20[0-9][0-9] /, "")
              .replace(/ [A-Z]..-[0-9]... \(.*\)/, "") + " "
        : "";
}

function day() {
    return Date()
        .replace(/[0-9].:[0-9].:[0-9].*/, "")
        .trim()
        .replace(/ /g, "_");
}

async function writeJSON(path, json) {
    await fs.writeFile(path, JSON.stringify(json, null, 4));
}

function fileExists(path) {
    return require('fs').existsSync(path);
}

async function archiveJson(oldfile, path, timetype) {
    old = JSON.parse(await fs.readFile(oldfile + ".json"));
    await writeJSON(`${path}${oldfile}.${timetype}.json`, old);
}

function log(content) {
    if (config.std.disable) {
        fs.writeFile(config.std.out, content, { flag: "a" });
    } else {
        console.log(content);
    }
}

function error(content) {
    if (config.std.disable) {
        fs.writeFile(config.std.error, content, { flag: "a" });
    } else {
        console.error(daytime() + "ERROR: " + content.trim());
    }
}

module.exports = {
    archiveJson: archiveJson,
    day: day,
    sleep: sleep,
    winsSorter: winsSorter,
    writeJSON: writeJSON,
    fileExists: fileExists,
    daytime: daytime,
    cacheMiss: [],
    logger: {
        out: log,
        err: error,
    },
};
