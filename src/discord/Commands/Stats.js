const Command = require("../../classes/Command");
const Logger = require("hyarcade-logger");
const BotUtils = require("../BotUtils");
const InteractionUtils = require("../interactions/InteractionUtils");
const MenuGenerator = require("../interactions/SelectionMenus/MenuGenerator");
const CommandResponse = require("../Utils/CommandResponse");
const { ERROR_UNLINKED } = require("../Utils/Embeds/StaticEmbeds");

module.exports = new Command("stats", ["*"], async (args, rawMsg, interaction) => {
    let game = args[1];
    let acc = await InteractionUtils.resolveAccount(interaction, "player");
    if(acc == undefined) {
        return new CommandResponse("", ERROR_UNLINKED);
    }
    let res = await BotUtils.getStats(acc, "" + game);
    let e = res.embed;
    Logger.debug("Adding stats buttons to message");
    let menu = await MenuGenerator.statsMenu(acc.uuid);
    return { res: "", embed: e, b: menu };
});
