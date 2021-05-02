const { MessageEmbed } = require("discord.js");
const Account = require("../../account");
const Command = require("../../classes/Command");
const Embeds = require("../Embeds");
const mojangRequest = require("../../mojangRequest");
const utils = require("../../utils");

module.exports = new Command("linkme", ["*"], async (args, rawMsg) => {
    let player = args[0];
    if (player == undefined) {
        let embed = Embeds.errIptIgn;
        return { res: "", embed: embed };
    }
    let acclist = await utils.readJSON("./accounts.json");
    let acc = acclist.find(
        (a) =>
            a.uuid.toLowerCase() == player.toLowerCase() ||
            a.name.toLowerCase() == player.toLowerCase()
    );
    if (acc == undefined) {
        let embed = Embeds.waiting;

        let tmpMsg = await rawMsg.channel.send("", { embed: embed });
        let uuid =
            player.length == 32 ? player : await mojangRequest.getUUID(player);
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
            let embed = Embeds.errPlayerLinked;
            return { res: "", embed: embed };
            // make sure user isnt linked
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
    } else {
        let embed = Embeds.errHypixelMismatch;
        return { res: "", embed: embed };
    }
});
