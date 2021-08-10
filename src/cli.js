const {
    getGuildFromPlayer
} = require("./hypixelApi");
const {
    stringNormal,
    stringDaily,
    addAccounts
} = require("./listUtils");
const utils = require("./utils");
const mojangRequest = require("./request/mojangRequest");
const dataGeneration = require("./dataGeneration");
const Account = require("./classes/account");
const AccountCreator = require("./mongo/AccountCreator");
const webRequest = require("./request/webRequest");
const Runtime = require("./Runtime");
const process = require("process");
const args = process.argv;
const logger = utils.logger;

/**
 * Add a new account to the acclist
 *
 */
async function newAcc () {
    let category = args[args.length - 1];
    let nameArr = args.slice(3, -1);
    await addAccounts(category, nameArr);
}

/**
 * @param {object} database
 */
async function mNewAcc (database) {
    let player = args[3];
    let uuid = player;
    if(player.length < 16) {
        uuid = await mojangRequest.getUUID(player);
    }

    let acc = new Account(player, 0, uuid);
    await acc.updateData();
    await AccountCreator(database, acc);
}

/**
 *
 */
async function linkDiscord () {
    let player = args[3];
    let discord = args[4];
    let uuid = player;
    if(player.length < 16) {
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
async function moveAcc () {
    let oldName = args[3];
    let oldCategory = args[4];
    let newCategory = args[5];
    let acclist = await utils.readJSON("../acclist.json");
    let oldVer = acclist[oldCategory].find((acc) => acc.name == oldName);

    if(oldVer) {
        acclist[newCategory].push(oldVer);
        acclist[oldCategory][oldName] = undefined;
        utils.writeJSON("./acclist.json", acclist);
    } else {
        logger.err(`Couldn't find old version of ${oldName}`);
    }
}

/**
 * Create a new player with the specified accounts
 *
 */
async function newPlayer () {
    let name = args[3];
    let alts = args.slice(4);

    // construct object
    let playerObj = {
        name: name,
        accs: alts
    };

    // add object to list
    let plrlist = await utils.readJSON("../playerlist.json");
    plrlist.push(playerObj);

    // write new list
    await utils.writeJSON("./playerlist.json", plrlist);
    logger.out(`Player "${name}" has been added with ${alts.length} alts.`);
}

/**
 * Create a new guild from the guild a player is in
 *
 */
async function newGuild () {
    let playerUUID = args[3];

    // get data from hypixel
    let gldInfo = JSON.parse(await getGuildFromPlayer(playerUUID));

    // create the actual guild object
    let id = gldInfo.guild._id;
    let name = gldInfo.guild.name;
    let gldObj = {
        id: id,
        name: name
    };

    // add object to list
    let gldLst = await utils.readJSON("../guildlist.json");
    gldLst.push(gldObj);

    // write new list
    await utils.writeJSON("./guildlist.json", gldLst);
    logger.out(`Guild "${name}" has been added successfully.`);
}

/**
 * Log a normal list
 *
 * @param {string} name
 */
async function logNormal (name) {
    logger.out(await stringNormal(name));
}

/**
 * Log a daily list
 *
 * @param {string} name
 */
async function logDaily (name) {
    logger.out(await stringDaily(name));
}

/**
 * Check for any name changes
 *
 */
async function checkNames () {
    let acclist = await utils.readJSON("./acclist.json");
    let realAccs = await utils.readJSON("./accounts.json");

    for(let list in acclist) {
        for(let acc of acclist[list]) {
            let real = realAccs.find((a) => a.uuid == acc.uuid);
            if(real != undefined && acc.name != real.name) {
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
 * @param {string[]} args
 */
async function log (args) {
    let logName = args[3];
    let str = await stringNormal(logName);

    logger.out(str);
}

/**
 * Log a normal list from arguments
 *
 * @param {string[]} args
 */
async function logD (args) {
    let logName = args[3];
    let str = await stringDaily(logName);

    logger.out(str);
}

/**
 * Get the uuid for a player
 *
 * @param {string[]} args
 */
async function getUUIDCli (args) {
    let name = args[3];
    let uuid = await mojangRequest.getUUIDRaw(name);
    logger.out(`${name}'s uuid is ${uuid}`);
}

/**
 * @param {string[]} args
 */
async function addGuildMembers (args) {
    let uuid = args[3];
    await dataGeneration.addGuild(uuid);
}

/**
 * @param {string[]} args
 */
async function addGIDMembers (args) {
    let uuid = args[3];
    await dataGeneration.addGuildID(uuid);
}

/**
 * @returns {object}
 */
async function getServerStatus () {
    let hyStatusRaw = await webRequest("https://status.hypixel.net/api/v2/status.json");
    let hyStatus = JSON.parse(hyStatusRaw.data);
    let mojangStatusRaw = await webRequest("https://status.mojang.com/check");
    let mojangStatus = JSON.parse(mojangStatusRaw.data);
    let runtime = Runtime.fromJSON();
    let mwBot = runtime.mwHeartBeat;
    let arcadeBot = runtime.undefinedHeartBeat;
    let marcadeBot = runtime.miniHeartBeat;
    let interactions = runtime.slashHeartBeat;
    let database = runtime.dbERROR;

    let obj = {
        Hypixel: hyStatus.status.indicator,
        MSession: mojangStatus[1]["session.minecraft.net"],
        MAcc: mojangStatus[2]["account.mojang.com"],
        MAuth: mojangStatus[3]["authserver.mojang.com"],
        mw: Date.now() - mwBot < 900000,
        arc: Date.now() - arcadeBot < 900000,
        marc: Date.now() - marcadeBot < 900000,
        slash: Date.now() - interactions < 900000,
        database: !database,
    };
    await utils.writeJSON("serverStatus.json", obj);
    return obj;
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
    addGIDMembers: addGIDMembers,
    getUUID: getUUIDCli,
    moveAcc: moveAcc,
    linkDiscord: linkDiscord,
    mNewAcc: mNewAcc,
    getServerStatus: getServerStatus,
};
