const utils = require("../utils");
const AccountCreator = require("./AccountCreator");
const MongoUtils = require("./MongoUtils");

module.exports = async function Translator () {
  const allAccs = await utils.readJSON("accounts.json");
  for(const account of allAccs) {
    await AccountCreator(MongoUtils.database, account);
  }
};
