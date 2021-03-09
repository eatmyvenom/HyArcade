const { getGuildFromPlayer } = require("./hypixelApi");
const { stringNormal, stringDaily, addAccounts } = require("./listUtils");
const utils = require("./utils");
const mojangRequest = require("./mojangRequest");
const args = process.argv;
const logger = utils.logger;

async function newAcc() {
    let category = args[args.length - 1];
    let nameArr = args.slice(3, -1);
    await addAccounts(category, nameArr);
}

async function newPlayer() {
    let name = args[3];
    let alts = args.slice(4);

    // construct object
    let playerObj = { name: name, accs: alts };

    // add object to list
    let plrlist = require("../playerlist.json");
    plrlist.push(playerObj);

    // write new list
    await utils.writeJSON("./playerlist.json", plrlist);
    logger.out(`Player "${name}" has been added with ${alts.length} alts.`);
}

async function newGuild() {
    let playerUUID = args[3];

    // get data from hypixel
    let gldInfo = JSON.parse(await getGuildFromPlayer(playerUUID));

    // create the actual guild object
    let id = gldInfo.guild._id;
    let name = gldInfo.guild.name;
    let gldObj = { id: id, name: name };

    // add object to list
    let gldLst = require("../guildlist.json");
    gldLst.push(gldObj);

    // write new list
    await utils.writeJSON("./guildlist.json", gldlLst);
    logger.out(`Guild "${name} has been added successfully.`);
}

async function logNormal(name) {
    logger.out(await stringNormal(name));
}

async function logDaily(name) {
    logger.out(await stringDaily(name));
}

async function checkNames() {
    let acclist = require("../acclist.json");
    let realAccs = require("../accounts.json");

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

async function log(args) {
    let logName = args[3];
    let str = await stringNormal(logName);

    logger.out(str);
}

async function logD(args) {
    let logName = args[3];
    let str = await stringDaily(logName);

    logger.out(str);
}

async function getUUIDCli(args) {
    let name = args[3];
    let uuid = await mojangRequest.getUUIDRaw(name);
    logger.out(`${name}'s uuid is ${uuid}`);
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
    getUUID: getUUIDCli,
};
