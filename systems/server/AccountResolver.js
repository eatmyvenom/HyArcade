const Logger = require("hyarcade-logger");
const { mojangRequest } = require("hyarcade-requests");
const Account = require("hyarcade-requests/types/Account");
const MongoConnector = require("hyarcade-requests/MongoConnector");
const Json = require("hyarcade-utils/FileHandling/Json");

let fakeFile;

/**
 *
 * @param {MongoConnector} connector
 * @param {URL} url
 * @returns {Promise<Account>}
 */
async function AccountResolver(connector, url) {
  if (fakeFile == undefined) {
    fakeFile = await Json.read("fakeStats.json");
  }

  const ign = url.searchParams.get("ign");
  let uuid = url.searchParams.get("uuid");
  const discid = url.searchParams.get("discid");
  const cacheOnly = url.searchParams.has("cache");
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
    Logger.log("Fetching account data from hypixel.");
    if (uuid == undefined) {
      uuid = await mojangRequest.getUUID(ign);
    }

    if (uuid != undefined) {
      acc = new Account(ign, 0, uuid);
      try {
        await acc.updateHypixel();
      } catch (error) {
        Logger.err("ERROR FETCHING ACCOUNT DATA FROM HYPIXEL...");
        Logger.err(error.stack);
      }

      if (acc?.name != "INVLAID-NAME" && acc?.name != undefined) {
        connector
          .updateAccount(acc)
          .then(() => {})
          .catch(Logger.err);
      }
    }
  }

  if (!cacheOnly && acc.updateTime < Date.now() - 600000) {
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
      .catch(Logger.err);
  }

  if (acc?.name == "null" || acc?.name == "INVALID-NAME" || acc?.nameHist?.includes("INVALID-NAME")) {
    acc = undefined;
  }

  return acc;
}

module.exports = AccountResolver;
