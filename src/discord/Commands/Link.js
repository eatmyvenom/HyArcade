const { MessageEmbed } = require("discord.js");
const Command = require("../../classes/Command");
const utils = require("../../utils");

module.exports = new Command("link", utils.defaultAllowed, async (args) => {
    let player = args[0];
    let discord = args[1];
    let uuid;
    let acc;
    let acclist = await utils.readJSON("./accounts.json");
    if (player.length < 17) {
        acc = acclist.find((a) => a.name.toLowerCase() == player.toLowerCase());
    } else {
        acc = acclist.find((a) => a.uuid.toLowerCase() == player.toLowerCase());
    }

    if (acc == undefined) {
        let embed = new MessageEmbed()
            .setTitle("ERROR")
            .setDescription("This player is not in the database!")
            .setColor(0xff0000);
        return { res: "", embed: embed };
    }

    uuid = acc.uuid;

    let disclist = await utils.readJSON("./disclist.json");
    if (disclist[discord]) {
        let embed = new MessageEmbed()
            .setTitle("ERROR")
            .setDescription("This player has already been linked!")
            .setColor(0xff0000);
        return { res: "", embed: embed };
    } else if (Object.values(disclist).find((u) => u == uuid) != undefined) {
        let embed = new MessageEmbed()
            .setTitle("ERROR")
            .setDescription("This user has already been linked!")
            .setColor(0xff0000);
        return { res: "", embed: embed };
    }

    disclist[discord] = uuid;
    await utils.writeJSON("./disclist.json", disclist);
    let embed = new MessageEmbed()
        .setTitle("Success")
        .setDescription(`${player} linked successfully!`)
        .setColor(0x00d492);
    return { res: "", embed: embed };
});
