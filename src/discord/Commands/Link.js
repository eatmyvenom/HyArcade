const Command = require("../../classes/Command");
const mojangRequest = require("../../mojangRequest");
const utils = require("../../utils");

module.exports = new Command("link", utils.defaultAllowed, async (args) => {
    let player = args[0];
    let discord = args[1];
    let uuid = player;
    if (player.length < 16) {
        uuid = await mojangRequest.getUUID(player);
    }
    let disclist = await utils.readJSON("./disclist.json");
    if (disclist[uuid]) {
        return "This player has already been linked!";
    } else if (Object.values(disclist).find((d) => d == discord) != undefined) {
        return "This user has already been linked!";
    }

    disclist[uuid] = discord;
    await utils.writeJSON("./disclist.json", disclist);
    return { res: `${player} linked successfully!` };
});
