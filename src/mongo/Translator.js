const utils = require("../utils");
const AccountCreator = require("./AccountCreator");
const MongoUtils = require("./MongoUtils");

module.exports = async function Translator() {
    let jsonAcclist = await utils.readJSON("accounts.json");
    for (let account of jsonAcclist) {
        await AccountCreator(MongoUtils.database, account);
    }
};
