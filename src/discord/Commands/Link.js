const { MessageEmbed } = require("discord.js");
const Account = require("../../account");
const Command = require("../../classes/Command");
const { addAccounts } = require("../../listUtils");
const mojangRequest = require("../../mojangRequest");
const Embeds = require('../Embeds')
const utils = require("../../utils");
const BotUtils = require("../BotUtils");

module.exports = new Command(
    "link",
    utils.defaultAllowed,
    async (args, rawMsg) => {
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

        let uuid,
            acc,
            acclist = await utils.readJSON("./accounts.json");
        if (player.length < 17) {
            acc = acclist.find(
                (a) => a.name.toLowerCase() == player.toLowerCase()
            );
        } else {
            acc = acclist.find(
                (a) => a.uuid.toLowerCase() == player.toLowerCase()
            );
        }

        if (acc == undefined) {
            let embed = Embeds.waiting;

            let tmpMsg = await rawMsg.channel.send("", { embed: embed });
            uuid =
                player.length == 32
                    ? player
                    : await mojangRequest.getUUID(player);
            if (("" + uuid).length != 32) {
                await tmpMsg.delete();
                let noexistEmbed = Embeds.errIgnNull;

                return { res: "", embed: noexistEmbed };
            }
            acc = new Account(player, 0, uuid);
            await addAccounts("others", [uuid]);
            await acc.updateHypixel();
            await tmpMsg.delete();
        }

        uuid = acc.uuid;

        let disclist = await utils.readJSON("./disclist.json");
        if (disclist[discord]) {
            let embed = Embeds.errPlayerLinked;
            return { res: "", embed: embed };
        } else if (
            Object.values(disclist).find((u) => u == uuid) != undefined
        ) {
            let embed = Embeds.errAccLinked;
            return { res: "", embed: embed };
        }

        disclist[discord] = uuid;
        await utils.writeJSON("./disclist.json", disclist);
        let embed = Embeds.linkSuccess;
        return { res: "", embed: embed };
    }
);
