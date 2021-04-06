const Command = require("../../classes/Command");
const mojangRequest = require("../../mojangRequest");
const utils = require("../../utils");

module.exports = new Command("linkme", ["*"], async (args, rawMsg) => {
    let player = args[0];
    let acclist = await utils.readJSON("./accounts.json");
    let acc = acclist.find(
        (a) =>
            a.uuid.toLowerCase() == player.toLowerCase() ||
            a.name.toLowerCase() == player.toLowerCase()
    );
    if (acc == undefined)
        return { res: "That account does not exist in the database." };

    if (
        ("" + acc.hypixelDiscord).toLowerCase() ==
        rawMsg.author.tag.toLowerCase()
    ) {
        let uuid = player;
        if (player.length < 16) {
            uuid = await mojangRequest.getUUID(player);
        }
        let discord = rawMsg.author.id;
        let disclist = await utils.readJSON("./disclist.json");
        if (disclist[discord]) {
            return { res: "This player has already been linked!" };
        } else if (
            Object.values(disclist).find((u) => u == uuid) != undefined
        ) {
            return { res: "This user has already been linked!" };
        }

        disclist[discord] = uuid;
        await utils.writeJSON("./disclist.json", disclist);
        return { res: `${player} linked successfully!` };
    } else {
        return {
            res:
                "Your discord tag does not match your hypixel set discord account. In order to link you must set your discord in hypixel to be your exact tag. If you are confused then just try linking via the hystats bot since it uses the same mechanism.",
        };
    }
});
