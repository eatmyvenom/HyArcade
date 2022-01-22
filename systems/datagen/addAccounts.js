const logger = require("hyarcade-logger");
const isValidIGN = require("./utils/ignValidator");
const Account = require("hyarcade-requests/types/Account");
const { getUUID } = require("hyarcade-requests/mojangRequest");
const Database = require("hyarcade-requests/Database");

/**
 * Add a list of accounts to another list
 *
 * @param {string[]} names
 * @returns {null}
 */
module.exports = async function addAccounts (names) {
  const accs = await Database.readDB("accounts", ["name", "uuid", "uuidPosix", "internalId"]);

  let res = "";
  const newAccs = [];
  const nameArr = names;
  for(let name of nameArr) {
    let uuid;
    if(name.length == 32 || name.length == 36) {
      uuid = name.replace(/-/g, "").toLowerCase();
    } else {
      if(!isValidIGN(name)) {
        logger.warn(`${name} is not a valid IGN and is being ignored!`);
        res += `${name} is not a valid IGN!\n`;
        continue;
      }
      uuid = await getUUID(name);
    }

    if(uuid == undefined) {
      res += `${name} does not exist!\n`;
      continue;
    }

    const dupeAcc = accs.find((a) => a.uuid == uuid);

    if(dupeAcc) {
      res += `Refusing to add duplicate "${dupeAcc.name}"\n`;
      logger.warn(`Refusing to add duplicate "${dupeAcc.name}"`);
      continue;
    }

    const acc = new Account("", 0, uuid);
    await acc.updateHypixel();
    name = acc.name;

    newAccs.push(acc);
    logger.out(`${name} with ${acc.arcadeWins} wins added.`);
    res += `${name} with ${acc.arcadeWins} wins added.\n`;
  }

  newAccs.filter((a) => a.uuid != undefined);

  if(newAccs.length > 0) {
    await Database.writeDB("accounts", newAccs);
  }

  return res;
};
