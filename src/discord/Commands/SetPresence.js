const Command = require("../../classes/Command");
const BotUtils = require("../BotUtils");

module.exports = new Command("SetPresence", ["%trusted%"], async (args) => {
    let presenceObj = JSON.parse(args.join(" "));
    await BotUtils.client.user.setPresence(presenceObj);
    return {
        res: "Presence updated!"
    };
});
