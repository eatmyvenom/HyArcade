const Logger = require("hyarcade-logger");
const { mojangRequest } = require("hyarcade-requests");
const Account = require("hyarcade-requests/types/Account");

const FileCache = require("hyarcade-utils/FileHandling/FileCache");

/**
 *
 * @param {FileCache} fileCache
 * @param {URL} url
 * @returns {Account}
 */
async function AccountResolver(fileCache, url) {
  const { indexedAccounts, disclist } = fileCache;

  const accounts = Object.values(indexedAccounts);
  accounts.sort((b, a) => a.importance - b.importance);

  const ign = url.searchParams.get("ign");
  let uuid = url.searchParams.get("uuid");
  const discid = url.searchParams.get("discid");
  let acc;

  if (ign != undefined) {
    Logger.verbose(`Using ign "${ign}"`);
    acc = accounts.find(a => a.name?.toLowerCase() == ign?.trim()?.toLowerCase());
  } else if (uuid != undefined) {
    Logger.verbose(`Using uuid ${uuid}`);
    acc = indexedAccounts[uuid?.toLowerCase()];
  } else if (discid != undefined) {
    Logger.verbose(`Using discord id ${discid}`);
    uuid = disclist[discid];

    acc = indexedAccounts[uuid?.toLowerCase()];
  }

  if (acc == undefined && ign != undefined) {
    acc = accounts.find(a => {
      if (a.nameHist && a.nameHist.length > 0 && (a?.importance ?? 0) > 9500) {
        for (const name of a.nameHist) {
          if (name.toLowerCase().startsWith(ign.toLowerCase())) {
            return true;
          }
        }
      }
      return false;
    });
  }

  if (acc == undefined) {
    Logger.verbose("Fetching account data from hypixel.");
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
      // eslint-disable-next-line unicorn/consistent-destructuring
      fileCache.indexedAccounts[acc.uuid] = acc;
      fileCache.save();
    }
  }

  if (acc?.name == "null" || acc?.name == "INVALID-NAME" || acc?.nameHist?.includes("INVALID-NAME")) {
    acc = undefined;
  }

  return acc;
}

module.exports = AccountResolver;
