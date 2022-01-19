const Account = require("hyarcade-requests/types/Account");
const utils = require("../utils");
const {
  logger
} = utils;
const cfg = require("hyarcade-config").fromJSON();
const force = utils.fileExists("force") || cfg.alwaysForce;

/**
 * @param {Account[]} accounts
 * @param {Account[]} oldAccs
 * @param {collection} collection
 * @returns {Promise}
 */
async function updateAccountsInArr (accounts, oldAccs, collection) {
  return await Promise.all(
    accounts.map(async (account) => {
      const oldAcc = oldAccs.find((a) => a.uuid == account.uuid);
      if(oldAcc != undefined && !force) {
        const aboveArcadeLimit = oldAcc.arcadeWins >= cfg.arcadeWinLimit;
        const fbAboveCringeLimit = oldAcc.football.wins >= cfg.cringeGameUpperBound;
        const fbBelowCringeLimit = oldAcc.footballWins <= cfg.cringeGameLowerBound;
        const fbOutsideCringeLimit = fbBelowCringeLimit || fbAboveCringeLimit;
        const mwAboveCringeLimit = oldAcc.miniWallsWins >= cfg.cringeGameUpperBound;
        const mwBelowCringeLimit = oldAcc.miniWallsWins <= cfg.cringeGameLowerBound;
        const mwOutsideCringeLimit = mwBelowCringeLimit || mwAboveCringeLimit;
        const isLinked = !!oldAcc.discord;
        const hasPlayedRecently = Date.now() - oldAcc.lastLogout < 2629743000;

        if(
          isLinked ||
                    (aboveArcadeLimit && fbOutsideCringeLimit && mwOutsideCringeLimit && hasPlayedRecently)
        ) {
          logger.out(`Updating ${oldAcc.name}'s data`);
          await account.updateData();
        } else {
          logger.out(`Ignoring ${oldAcc.name} for this refresh`);
          account.setData(oldAcc);
        }
      } else {
        await account.updateData();
      }
      const updateObj = {
        $set: account
      };
      await collection.updateOne({
        uuid: account.uuid
      }, updateObj);
    })
  );
}

module.exports = async function (database) {
  const accs = await database.collection("accounts");
  const allAccs = await accs.find({});
  const rawAccs = await allAccs.toArray();
  const list = [];
  for(const acc of rawAccs) {
    const newAcc = new Account(acc.name, acc.wins, acc.uuid);
    newAcc.setData(acc);
    list.push(newAcc);
  }

  let i;
  let j;
  let temparray;

  const chunk = 120;
  for(i = 0, j = list.length; i < j; i += chunk) {
    temparray = list.slice(i, i + chunk);
    await updateAccountsInArr(temparray, list, accs);
  }
};
