const { MessageEmbed } = require("discord.js");
const Account = require("../../account");
const Command = require("../../classes/Command");
const mojangRequest = require("../../mojangRequest");
const utils = require("../../utils");
const BotUtils = require("../BotUtils");

module.exports = new Command("link", utils.defaultAllowed, async (args, rawMsg) => {
    let player = args[0];
    let discord = args[1];

    if (("" + player).startsWith("https://")) {
        let channelID = player.slice(
            player.lastIndexOf("/") - 18,
            player.lastIndexOf("/")
        );
        let msgID = player.slice(player.lastIndexOf("/") + 1);

        let channel = await BotUtils.client.channels.fetch(channelID);
        let msg = await channel.messages.fetch(msgID);

        discord = msg.author.id;
        player = msg.content;
    }

    let uuid, acc, acclist = await utils.readJSON("./accounts.json");
    if (player.length < 17) {
        acc = acclist.find((a) => a.name.toLowerCase() == player.toLowerCase());
    } else {
        acc = acclist.find((a) => a.uuid.toLowerCase() == player.toLowerCase());
    }

    if (acc == undefined) {
        let embed = new MessageEmbed()
            .setTitle("Waiting <a:loading:837212742301253663>")
            .setDescription(
                "Since the the database does not contain the account it will take some time to fetch the stats. Please wait!"
            )
            .setThumbnail("https://i.imgur.com/GLdqYB2.gif")
            .setColor(0xdcde19)

        let tmpMsg = await rawMsg.channel.send("", { embed: embed });
        uuid = (player.length == 32) ? player : await mojangRequest.getUUID(player);
        if(("" + uuid).length != 32) {
            await tmpMsg.delete();
            let noexistEmbed = new MessageEmbed()
                .setTitle("ERROR")
                .setDescription(`The ign ${player} does not exist or has been changed.`)
                .setColor(0xff0000)
            
            return { res : "", embed: noexistEmbed };
        }
        acc = new Account(player, 0, uuid);
        await acc.updateHypixel();
        await tmpMsg.delete();
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
