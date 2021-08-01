const Command = require("../../classes/Command");
const BotUtils = require("../BotUtils");

module.exports = new Command("SetAvatar", ["%trusted%"], async (args) => {
    let avatarURL = args[0];
    await BotUtils.client.user.setAvatar(avatarURL);
    return {
        res: "Avatar updated!"
    };
});
