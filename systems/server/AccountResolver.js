const { MissingFieldError } = require("hyarcade-errors");
const Logger = require("hyarcade-logger");
const { mojangRequest, MongoConnector } = require("hyarcade-requests");
const { Account } = require("hyarcade-structures");
const Json = require("hyarcade-utils/FileHandling/Json");

let fakeFile;

/**
 *
 * @param {MongoConnector} connector
 * @param {URL} url
 * @param {boolean} forceCache
 * @returns {Promise<Account>}
 */
async function AccountResolver(connector, url, forceCache = false) {
  if (fakeFile == undefined) {
    fakeFile = await Json.read("fakeStats.json");
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
    acc = await connector.getAccount(ign);
  } else if (uuid != undefined) {
    Logger.verbose(`Using uuid ${uuid}`);
    acc = await connector.getAccount(uuid);
  } else if (discid != undefined) {
    Logger.verbose(`Using discord id ${discid}`);
    acc = await connector.getAccount(discid);
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
        connector
          .updateAccount(acc)
          .then(() => {})
          .catch(error => Logger.err(error.stack));
      }
    }
  }

  if (acc?.name == "null" || acc?.name == "INVALID-NAME" || acc?.nameHist?.includes("INVALID-NAME")) {
    acc = undefined;
  }

  if (acc != undefined && !cacheOnly && acc.updateTime < Date.now() - 600000) {
    Logger.log(`Updating data for ${acc.name}`);
    const newAccount = new Account(acc.name, 0, acc.uuid);
    Object.assign(newAccount, acc);

    await newAccount.updateHypixel();

    if (Object.keys(fakeFile).includes(newAccount.uuid)) {
      Logger.info(`Overwriting data for ${newAccount.name}`);
      Object.assign(newAccount, fakeFile[newAccount.uuid]);
    }

    acc = newAccount;

    connector
      .updateAccount(acc)
      .then(() => {})
      .catch(error => Logger.err(error.stack));
  }

  return acc;
}

module.exports = AccountResolver;
