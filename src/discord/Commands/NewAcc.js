const utils = require("../../utils");
const { addAccounts } = require("../../listUtils");
const Command = require("../../classes/Command");

module.exports = new Command("newAcc", utils.defaultAllowed, async (args) => {
    let category = args[args.length - 1];
    let res = await addAccounts(category, args.slice(0,-1));
    return { res: res };
    
});
