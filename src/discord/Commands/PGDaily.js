const Command = require("../../classes/Command");
const BotUtils = require("../BotUtils");

module.exports = new Command("pgd", ["*"], async (args) => {
    let embed = await BotUtils.getPGDailyEmbed();
    return { res: "", embed: embed };
});
