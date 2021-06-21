const { MessageEmbed } = require("discord.js");
const Command = require("../../classes/Command");
const mojangRequest = require("../../request/mojangRequest");
const utils = require("../../utils");

module.exports = new Command("boosters", ["*"], async (args, rawMsg, interaction) => {
    let data = await utils.readJSON("boosters.json");
    let accounts = await utils.readJSON("accounts.json");
    let list = "";
    if (interaction) {
        interaction.defer();
    }
    for (let b of data.boosters) {
        if (b.gameType == 14) {
            let player = b.purchaserUuid;
            let acc = accounts.find((a) => a.uuid == player);
            if (acc) {
                player = acc.name;
            } else {
                player = await mojangRequest.getPlayer(player);
                player = player.name;
            }

            list += `Player: ${player}, time left: ${b.length}\n`;
        }
    }

    return {
        res: "",
        embed: new MessageEmbed()
            .setTitle("Arcade Network boosters")
            .setDescription(list.split("\n").slice(0, 30).join("\n")),
    };
});
