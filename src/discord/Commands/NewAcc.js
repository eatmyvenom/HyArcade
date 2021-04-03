const utils = require("../../utils");
const { addAccounts } = require("../../listUtils");
const Command = require("../../classes/Command");

module.exports = new Command("newAcc", utils.defaultAllowed, async (args) => {
    if (utils.isValidIGN(args[0])) {
        let name = args[0];
        let category = args[1];
        if (utils.isValidIGN(name)) {
            let res = await addAccounts(category, [args[0]]);
            return { res: res };
        } else {
            return { res: "Please input a valid IGN!" };
        }
    }
});
