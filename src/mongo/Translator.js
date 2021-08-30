const utils = require("../utils");
const AccountCreator = require("./AccountCreator");
const MongoUtils = require("./MongoUtils");

module.exports = async function Translator () {
  const jsonAcclist = await utils.readJSON("accounts.json");
  for(const account of jsonAcclist) {
    await AccountCreator(MongoUtils.database, account);
  }
};
