const { MessageEmbed } = require("discord.js");
const Account = require("../../account");
const Command = require("../../classes/Command");
const cfg = require("../../Config").fromJSON();
const mojangRequest = require("../../mojangRequest");
const utils = require("../../utils");

module.exports = new Command("linkme", ["*"], async (args, rawMsg) => {
    let player = args[0];
    if (player == undefined) {
        let embed = new MessageEmbed()
            .setTitle("ERROR")
            .setDescription(
                `Input a name or uuid to link your discord to! Use ${cfg.commandCharacter}help for more info on how to use the verify command.`
            )
            .setColor(0xff0000);
        return { res: "", embed: embed };
    }
    let acclist = await utils.readJSON("./accounts.json");
    let acc = acclist.find(
        (a) =>
            a.uuid.toLowerCase() == player.toLowerCase() ||
            a.name.toLowerCase() == player.toLowerCase()
    );
    if (acc == undefined) {
        let embed = new MessageEmbed()
            .setTitle("Waiting...")
            .setDescription(
                "Since the the database does not contain the account it will take some time to fetch the stats. Please wait!"
            )
            .setThumbnail("https://i.imgur.com/GLdqYB2.gif")
            .setColor(0xdcde19)

        let tmpMsg = await rawMsg.channel.send("", { embed: embed });
        let uuid = player.length == 32 ? player : await mojangRequest.getUUID(player);
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

    if (
        ("" + acc.hypixelDiscord).toLowerCase() ==
        rawMsg.author.tag.toLowerCase()
    ) {
        let uuid = player;
        // if its not a uuid then convert to uuid
        if (player.length < 17) {
            uuid = acc.uuid;
        }
        let discord = rawMsg.author.id;
        let disclist = await utils.readJSON("./disclist.json");
        // make sure player isnt linked
        if (disclist[discord]) {
            let embed = new MessageEmbed()
                .setTitle("ERROR")
                .setDescription("This player has already been linked!")
                .setColor(0xff0000);
            return { res: "", embed: embed };
            // make sure user isnt linked
        } else if (
            Object.values(disclist).find((u) => u == uuid) != undefined
        ) {
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
    } else {
        let embed = new MessageEmbed()
            .setTitle("ERROR")
            .setDescription(
                "Your discord tag does not match your hypixel set discord account. In order to link you must set your discord in hypixel to be your exact tag. If you are confused then just try linking via the hystats bot since it uses the same mechanism."
            )
            .setColor(0xff0000);
        return { res: "", embed: embed };
    }
});
