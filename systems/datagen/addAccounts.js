const logger = require("@hyarcade/logger");
const Database = require("@hyarcade/requests/Database");
const { getUUID } = require("@hyarcade/requests/mojangRequest");
const isValidIGN = require("./utils/ignValidator");

/**
 * Add a list of accounts to another list
 *
 * @param {string[]} names
 * @returns {null}
 */
module.exports = async function addAccounts(names) {
  const infoPre = await Database.info();

  let res = "";
  const nameArr = names;
  for (const name of nameArr) {
    let uuid;
    if (name.length == 32 || name.length == 36) {
      uuid = name.replace(/-/g, "").toLowerCase();
    } else {
      if (!isValidIGN(name)) {
        logger.warn(`${name} is not a valid IGN and is being ignored!`);
        res += `${name} is not a valid IGN!\n`;
        continue;
      }
      uuid = await getUUID(name);
    }

    if (uuid == undefined) {
      res += `${name} does not exist!\n`;
      logger.warn(`${name} does not exist!`);
      continue;
    }

    await Database.account(uuid, "", true);
  }

  const info = await Database.info();

  logger.out(`Accounts delta: ${info.accs - infoPre.accs}`);
  res += `Accounts delta: ${info.accs - infoPre.accs}\n`;

  return res;
};
