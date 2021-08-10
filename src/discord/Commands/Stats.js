const Command = require("../../classes/Command");
const Logger = require("hyarcade-logger");
const BotUtils = require("../BotUtils");
const InteractionUtils = require("../interactions/InteractionUtils");
const MenuGenerator = require("../interactions/SelectionMenus/MenuGenerator");
const CommandResponse = require("../Utils/CommandResponse");
const {
    ERROR_UNLINKED
} = require("../Utils/Embeds/StaticEmbeds");

module.exports = new Command("stats", ["*"], async (args, rawMsg, interaction) => {
    const game = args[1];
    const acc = await InteractionUtils.resolveAccount(interaction, "player");
    if(acc == undefined) {
        return new CommandResponse("", ERROR_UNLINKED);
    }
    const res = await BotUtils.getStats(acc, `${game}`);
    const e = res.embed;
    Logger.debug("Adding stats buttons to message");
    const menu = await MenuGenerator.statsMenu(acc.uuid);
    return {
        res: "",
        embed: e,
        b: menu
    };
});
