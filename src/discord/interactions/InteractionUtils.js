const BotRuntime = require("../BotRuntime");
const Account = require("hyarcade-requests/types/Account");
const AccountResolver = require("./Utils/AccountResolver");

module.exports = class InteractionUtils {
  /**
   * Get an account just purely from a uuid without going
   * through the full resolver
   *
   * @static
   * @param {string} uuid
   * @returns {Promise<Account>}
   */
  static async accFromUUID (uuid) {
    let acc;
    if(BotRuntime.botMode != "mini") {
      const acclist = await BotRuntime.getFromDB("accounts");
      acc = acclist.find((a) => a?.uuid == uuid);
    }

    if(acc == undefined) {
      acc = new Account("", 0, `${uuid}`);
      await acc.updateData();
    }

    return acc;
  }

  static async resolveAccount (interaction, namearg = "player") {
    return await AccountResolver(interaction, namearg);
  }
};
