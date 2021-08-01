const Command = require("../../classes/Command");
const BotUtils = require("../BotUtils");
const SetPresence = require("../Utils/SetPresence");

module.exports = new Command("CyclePresence", ["*"], async () => {
    await SetPresence(BotUtils.client, BotUtils.botMode);
    return {
        res: "Presence cycled"
    };
});
