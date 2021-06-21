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
    let response = await BotUtils.getStats(acc, game);
    response.res = "**WARNING** This command will be disabled 2 weeks after hypixel was brought back up. Please use `/stats` instead!";
    return response;
});
