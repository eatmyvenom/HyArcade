const Command = require("../../classes/Command");
const mojangRequest = require("../../mojangRequest");
const utils = require("../../utils");

module.exports = new Command("link", utils.defaultAllowed, async (args) => {
    let player = args[0];
    let discord = args[1];
    let uuid;
    let acclist = await utils.readJSON('./accounts.json');
    let acc;
    if (player.length < 17) {
        acc = acclist.find(
            (a) => a.name.toLowerCase() == player.toLowerCase()
        )
    } else {
        acc = acclist.find(
            (a) => a.uuid.toLowerCase() == player.toLowerCase()
        )
    }

    if(acc == undefined) {
        return { res : "This player is not in the database!" };
    }

    uuid = acc.uuid;

    let disclist = await utils.readJSON("./disclist.json");
    if (disclist[discord]) {
        return { res: "This player has already been linked!" };
    } else if (Object.values(disclist).find((u) => u == uuid) != undefined) {
        return { res: "This user has already been linked!" };
    }

    disclist[discord] = uuid;
    await utils.writeJSON("./disclist.json", disclist);
    return { res: `${player} linked successfully!` };
});
