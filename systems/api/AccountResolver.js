const { MissingFieldError } = require("@hyarcade/errors");
const Logger = require("@hyarcade/logger");
const { mojangRequest } = require("@hyarcade/requests");
const { Account } = require("@hyarcade/structures");
const { DeepMerge } = require("@hyarcade/helpers-objects");
const APIRuntime = require("./APIRuntime");

let fakeData;

/**
 *
 * @param {APIRuntime} runtime
 * @param {boolean} forceCache
 * @returns {Promise<Account>}
 */
async function AccountResolver(runtime, forceCache = false) {
  const { url, mongoConnector, config } = runtime;
  if (fakeData == undefined) {
    fakeData = await mongoConnector.fakePlayers.find().toArray();
  }

  const ign = url.searchParams.get("ign");
  let uuid = url.searchParams.get("uuid");
  const discid = url.searchParams.get("discid");
  const cacheOnly = url.searchParams.has("cache") || forceCache;

  if (ign == undefined && uuid == undefined && discid == undefined) {
    throw new MissingFieldError("Request has no input to resolve to an account", ["ign"]);
  }

  let acc;

  if (ign != undefined) {
    Logger.verbose(`Using ign "${ign}"`);
    acc = await mongoConnector.getAccount(ign);
  } else if (uuid != undefined) {
    Logger.verbose(`Using uuid ${uuid}`);
    acc = await mongoConnector.getAccount(uuid);
  } else if (discid != undefined) {
    Logger.verbose(`Using discord id ${discid}`);
    acc = await mongoConnector.getAccount(discid);
  }

  if (acc == undefined) {
    Logger.info(`Account: ${ign ?? uuid} missed cache. Fetching!`);
    if (uuid == undefined) {
      Logger.verbose("Fetching uuid from mojang");
      uuid = await mojangRequest.getUUID(ign);
    }

    if (uuid != undefined) {
      acc = new Account(ign, 0, uuid);
      try {
        Logger.verbose("Fetching hypixel data");
        await acc.updateHypixel();
      } catch (error) {
        Logger.err("ERROR FETCHING ACCOUNT DATA FROM HYPIXEL...");
        Logger.err(error.stack);
      }

      if (acc?.name != "INVLAID-NAME" && acc?.name != undefined) {
        Logger.verbose("Pushing to mongodb");
        mongoConnector
          .updateAccount(acc)
          .then(() => {})
          .catch(error => Logger.err(error.stack));
      }
    }
  }

  if (acc?.name == "null" || acc?.name == "INVALID-NAME" || acc?.nameHist?.includes("INVALID-NAME")) {
    acc = undefined;
  }

  if (acc != undefined && !cacheOnly && acc.updateTime < Date.now() - config.database.cacheTime.accounts) {
    Logger.log(`Updating data for ${acc.name}`);
    let newAccount = new Account(acc.name, 0, acc.uuid);
    Object.assign(newAccount, acc);

    await newAccount.updateHypixel();

    const fakeAcc = fakeData.find(a => a.uuid == newAccount.uuid);
    if (fakeAcc != undefined) {
      Logger.info(`Overwriting data for ${newAccount.name}`);
      newAccount = DeepMerge(newAccount, fakeAcc);
    }

    acc = newAccount;

    mongoConnector
      .updateAccount(acc)
      .then(() => {})
      .catch(error => Logger.err(error.stack));
  }

  return acc;
}

module.exports = AccountResolver;
