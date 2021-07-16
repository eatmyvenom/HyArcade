const Command = require("../../classes/Command");
const BotUtils = require("../BotUtils");

module.exports = new Command("SetUsername", ["%trusted%"], async (args) => {
    let username = args.join(" ");
    await BotUtils.client.user.setUsername(username);
    return { res: "Username updated!" };
});