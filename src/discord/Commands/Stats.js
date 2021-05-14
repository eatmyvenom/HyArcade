const { MessageEmbed } = require("discord.js");
const Command = require("../../classes/Command");
const config = require("../../Config").fromJSON();
const BotUtils = require("../BotUtils");

module.exports = new Command("stats", ["*"], async (args, rawMsg) => {
    let player = args[0];

    let game = "" + args[args.length - 1];

    let acc = await BotUtils.resolveAccount(player, rawMsg, args.length != 2);
    if (acc == undefined) {
        if (player == undefined) {
            return {
                res: `It appears your discord isn't linked, run ${config.commandCharacter}verify to link yourself.`,
            };
        }
        return { res: player + " is not in the database" };
    }
    return await BotUtils.getStats(acc, game);
});
