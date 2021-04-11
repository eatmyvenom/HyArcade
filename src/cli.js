const { getGuildFromPlayer } = require("./hypixelApi");
const { stringNormal, stringDaily, addAccounts } = require("./listUtils");
const utils = require("./utils");
const mojangRequest = require("./mojangRequest");
const dataGeneration = require("./dataGeneration");
const args = process.argv;
const logger = utils.logger;

/**
 * Add a new account to the acclist
 *
 */
async function newAcc() {
    let category = args[args.length - 1];
    let nameArr = args.slice(3, -1);
    await addAccounts(category, nameArr);
}

async function linkDiscord() {
    let player = args[3];
    let discord = args[4];
    let uuid = player;
    if (player.length < 16) {
        uuid = await mojangRequest.getUUID(player);
    }
    let disclist = await utils.readJSON("./disclist.json");
    disclist[discord] = uuid;
    await utils.writeJSON("./disclist.json", disclist);
}

/**
 * Move an account to a different category in the acclist
 *
 */
async function moveAcc() {
    let oldName = args[3];
    let oldCategory = args[4];
    let newCategory = args[5];
    let acclist = utils.readJSON("../acclist.json");
    let oldVer = acclist[oldCategory].find((acc) => acc.name == oldName);

    if (oldVer) {
        acclist[newCategory].push(oldVer);
        acclist[oldCategory][oldName] = undefined;
        utils.writeJSON("./acclist.json", acclist);
    } else {
        logger.err("Couldn't find old version of " + oldName);
    }
}

/**
 * Create a new player with the specified accounts
 *
 */
async function newPlayer() {
    let name = args[3];
    let alts = args.slice(4);

    // construct object
    let playerObj = { name: name, accs: alts };

    // add object to list
    let plrlist = utils.readJSON("../playerlist.json");
    plrlist.push(playerObj);

    // write new list
    await utils.writeJSON("./playerlist.json", plrlist);
    logger.out(`Player "${name}" has been added with ${alts.length} alts.`);
}

/**
 * Create a new guild from the guild a player is in
 *
 */
async function newGuild() {
    let playerUUID = args[3];

    // get data from hypixel
    let gldInfo = JSON.parse(await getGuildFromPlayer(playerUUID));

    // create the actual guild object
    let id = gldInfo.guild._id;
    let name = gldInfo.guild.name;
    let gldObj = { id: id, name: name };

    // add object to list
    let gldLst = utils.readJSON("../guildlist.json");
    gldLst.push(gldObj);

    // write new list
    await utils.writeJSON("./guildlist.json", gldLst);
    logger.out(`Guild "${name}" has been added successfully.`);
}

/**
 * Log a normal list
 *
 * @param {String} name
 */
async function logNormal(name) {
    logger.out(await stringNormal(name));
}

/**
 * Log a daily list
 *
 * @param {String} name
 */
async function logDaily(name) {
    logger.out(await stringDaily(name));
}

/**
 * Check for any name changes
 *
 */
async function checkNames() {
    let acclist = utils.readJSON("../acclist.json");
    let realAccs = utils.readJSON("../accounts.json");

    for (let list in acclist) {
        for (let acc of acclist[list]) {
            real = realAccs.find((a) => a.uuid == acc.uuid);
            if (real != undefined && acc.name != real.name) {
                logger.out(`${acc.name} -> ${real.name}`);
                acc.name = real.name;
            }
        }
    }

    await utils.writeJSON("./acclist.json", acclist);
    logger.out("\nName check complete");
}

/**
 * Log a normal list from arguments
 *
 * @param {String[]} args
 */
async function log(args) {
    let logName = args[3];
    let str = await stringNormal(logName);

    logger.out(str);
}

/**
 * Log a normal list from arguments
 *
 * @param {Stringp[]} args
 */
async function logD(args) {
    let logName = args[3];
    let str = await stringDaily(logName);

    logger.out(str);
}

/**
 * Get the uuid for a player
 *
 * @param {String[]} args
 */
async function getUUIDCli(args) {
    let name = args[3];
    let uuid = await mojangRequest.getUUIDRaw(name);
    logger.out(`${name}'s uuid is ${uuid}`);
}

async function addGuildMembers(args) {
    let uuid = args[3];
    await dataGeneration.addGuild(uuid);
}

module.exports = {
    newAcc: newAcc,
    newGuild: newGuild,
    newPlayer: newPlayer,
    logNormal: logNormal,
    logDaily: logDaily,
    log: log,
    logD: logD,
    checkNames: checkNames,
    addGuildMembers: addGuildMembers,
    getUUID: getUUIDCli,
    moveAcc: moveAcc,
    linkDiscord: linkDiscord,
};
