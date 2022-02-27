const process = require("process");
const logger = require("hyarcade-logger");
const { HypixelApi } = require("hyarcade-requests");
const mojangRequest = require("hyarcade-requests/mojangRequest");
const Json = require("hyarcade-utils/FileHandling/Json");
const dataGeneration = require("./datagen/dataGeneration");
const addAccounts = require("./datagen/addAccounts");
const args = process.argv;

/**
 * Add a new account to the database
 *
 */
async function newAcc() {
  const nameArr = args.slice(2, -1);
  await addAccounts(nameArr);
}

/**
 *
 */
async function linkDiscord() {
  const player = args[3];
  const discord = args[4];
  let uuid = player;
  if (player.length < 16) {
    uuid = await mojangRequest.getUUID(player);
  }
  const disclist = await Json("./disclist.json");
  disclist[discord] = uuid;
  await Json.write("./disclist.json", disclist);
}

/**
 * Create a new player with the specified accounts
 *
 */
async function newPlayer() {
  const name = args[3];
  const alts = args.slice(4);

  // construct object
  const playerObj = {
    name,
    accs: alts,
  };

  // add object to list
  const plrlist = await Json.read("../playerlist.json");
  plrlist.push(playerObj);

  // write new list
  await Json.write("./playerlist.json", plrlist);
  logger.out(`Player "${name}" has been added with ${alts.length} alts.`);
}

/**
 * Create a new guild from the guild a player is in
 *
 */
async function newGuild() {
  const playerUUID = args[3];

  // get data from hypixel
  const gldInfo = await HypixelApi.guild(playerUUID);

  // create the actual guild object
  const id = gldInfo.guild._id;
  const { name } = gldInfo.guild;
  const gldObj = {
    id,
    name,
  };

  // add object to list
  const gldLst = await Json.read("../guildlist.json");
  gldLst.push(gldObj);

  // write new list
  await Json.write("./guildlist.json", gldLst);
  logger.out(`Guild "${name}" has been added successfully.`);
}

/**
 * Get the uuid for a player
 *
 * @param {string[]} args
 */
async function getUUIDCli(args) {
  const name = args[3];
  const uuid = await mojangRequest.getUUIDRaw(name);
  logger.out(`${name}'s uuid is ${uuid}`);
}

/**
 * @param {string[]} args
 */
async function addGuildMembers(args) {
  const uuid = args[3];
  await dataGeneration.addGuild(uuid);
}

/**
 * @param {string[]} args
 */
async function addGIDMembers(args) {
  const uuid = args[3];
  await dataGeneration.addGuildID(uuid);
}

/**
 * @param {string[]} args
 */
async function addGIDsMembers(args) {
  const uuid = args.slice(3);
  await dataGeneration.addGuildIDs(uuid);
}

module.exports = {
  newAcc,
  newGuild,
  newPlayer,
  addGuildMembers,
  addGIDMembers,
  addGIDsMembers,
  getUUID: getUUIDCli,
  linkDiscord,
};
