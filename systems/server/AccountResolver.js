const Logger = require("hyarcade-logger");
const Account = require("hyarcade-requests/types/Account");
const { mojangRequest } = require("hyarcade-requests");

const FileCache = require("hyarcade-utils/FileHandling/FileCache");

/**
 * 
 * @param {FileCache} fileCache 
 * @param {URL} url 
 * @returns {Account}
 */
async function AccountResolver (fileCache, url) {
  const {
    indexedAccounts
  } = fileCache;

  const accounts = Object.values(indexedAccounts);
  accounts.sort((b, a) => a.importance - b.importance);

  const ign = url.searchParams.get("ign");
  let uuid = url.searchParams.get("uuid");
  const discid = url.searchParams.get("discid");
  let acc;

  if(ign != null) {
    Logger.debug(`Using ign "${ign}"`);
    acc = accounts.find((a) => a.name?.toLowerCase() == ign?.trim()?.toLowerCase());
  } else if(uuid != null) {
    Logger.debug(`Using uuid ${uuid}`);
    acc = indexedAccounts[uuid?.toLowerCase()];
  } else if(discid != null) {
    Logger.debug(`Using discord id ${discid}`);
    uuid = fileCache.disclist[discid];

    acc = indexedAccounts[uuid?.toLowerCase()];
  }


  if(acc == undefined && ign != null) {
    acc = accounts.find((a) => {
      if(a.nameHist && a.nameHist.length > 0 && (a?.importance ?? 0) > 9500) {
        for(const name of a.nameHist) {
          if(name.toLowerCase().startsWith(ign.toLowerCase())) {
            return true;
          }
        }
      }
      return false;
    });
  }

  if(acc == undefined) {
    Logger.debug("Fetching account data from hypixel.");
    if(uuid == null) {
      uuid = await mojangRequest.getUUID(ign) ?? null;
    }

    if (uuid != null) {
      acc = new Account(ign, 0, uuid);
      try {
        await acc.updateHypixel();
      } catch (e) {
        Logger.err("ERROR FETCHING ACCOUNT DATA FROM HYPIXEL...");
        Logger.err(e.stack);
      }
      fileCache.indexedAccounts[acc.uuid] = acc;
      fileCache.save();
    }
  }

  if(acc?.name == "null" || acc?.name == "INVALID-NAME" || acc?.nameHist?.includes("INVALID-NAME")) {
    acc = undefined;
  }

  return acc;
}

module.exports = AccountResolver;