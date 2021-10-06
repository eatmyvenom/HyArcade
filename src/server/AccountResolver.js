const Logger = require("hyarcade-logger");
const Account = require("hyarcade-requests/types/Account");
const FileCache = require("../utils/files/FileCache");
const { default: fetch } = require("node-fetch");


/**
 * 
 * @param {FileCache} fileCache 
 * @param {URL} url 
 * @returns {Account}
 */
async function AccountResolver (fileCache, url) {
  const {
    accounts
  } = fileCache;

  const ign = url.searchParams.get("ign");
  let uuid = url.searchParams.get("uuid");
  const discid = url.searchParams.get("discid");
  let acc;

  if(ign != null) {
    Logger.debug(`Using ign "${ign}"`);
    acc = accounts.find((a) => a.name?.toLowerCase() == ign?.toLowerCase());
  } else if(uuid != null) {
    Logger.debug(`Using uuid ${uuid}`);
    acc = accounts.find((a) => a.uuid?.toLowerCase() == uuid?.toLowerCase());
  } else if(discid != null) {
    Logger.debug(`Using discord id ${discid}`);
    const uuid = fileCache.disclist[discid];

    acc = accounts.find((a) => a.uuid == uuid);
  }

  if(acc?.name == "null") {
    acc = undefined;
  }

  if(acc == undefined && ign != null) {
    acc = accounts.find((a) => {
      if(a.nameHist && a.nameHist.length > 0) {
        for(const name of a.nameHist) {
          if(name.toLowerCase().startsWith(ign)) {
            return true;
          }
        }
      }
      return false;
    });
  }

  if(acc?.name == "null") {
    acc = undefined;
  }

  if(acc == undefined) {
    Logger.debug("Getting data from hypixel");
    if(uuid == null) {
      let elecreq = await fetch(`https://api.ashcon.app/mojang/v2/user/${ign}`);
      elecreq = await elecreq.json();
      if(elecreq != undefined) {
        uuid = elecreq.uuid.replace(/-/g, "");
      }
    }

    if (uuid != null) {
      acc = new Account(ign, 0, uuid);
      await acc.updateHypixel();
      fileCache.accounts.push(acc);
    }
  }

  if(acc?.name == "null") {
    acc = undefined;
  }

  return acc;
}

module.exports = AccountResolver;