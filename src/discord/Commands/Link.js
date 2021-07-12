const Account = require("../../classes/account");
const Command = require("../../classes/Command");
const { addAccounts } = require("../../listUtils");
const mojangRequest = require("../../request/mojangRequest");
const Embeds = require("../Embeds");
const utils = require("../../utils");
const BotUtils = require("../BotUtils");

module.exports = new Command("link", ["%trusted%"], async (args, rawMsg) => {
    if (args.length < 1) {
        return { res: "", embed: Embeds.ERROR_ARGS_LENGTH(1) };
    }
    let player = args[0];
    let discord = args[1];

    if (("" + player).startsWith("https://")) {
        let channelID = player.slice(player.lastIndexOf("/") - 18, player.lastIndexOf("/"));
        let msgID = player.slice(player.lastIndexOf("/") + 1);

        let channel = await BotUtils.client.channels.fetch(channelID);
        let msg = await channel.messages.fetch(msgID);

        discord = msg.author.id;
        player = msg.content;
    }

    let uuid,
        acc,
        acclist = await BotUtils.getFromDB("accounts");
    if (player.length < 17) {
        acc = acclist.find((a) => ("" + a.name).toLowerCase() == player.toLowerCase());
    } else {
        acc = acclist.find((a) => ("" + a.uuid).toLowerCase() == player.toLowerCase());
    }

    if (acc == undefined) {
        let embed = Embeds.WARN_WAITING;

        uuid = player.length == 32 ? player : await mojangRequest.getUUID(player);
        if (("" + uuid).length != 32) {
            await tmpMsg.delete();
            let noexistEmbed = Embeds.ERROR_IGN_UNDEFINED;

            return { res: "", embed: noexistEmbed };
        }
        acc = new Account(player, 0, uuid);
        await addAccounts("others", [uuid]);
        await acc.updateHypixel();
    }

    uuid = acc.uuid;

    let disclist = await BotUtils.getFromDB("disclist");
    if (disclist[discord]) {
        let embed = Embeds.ERROR_PLAYER_PREVIOUSLY_LINKED;
        return { res: "", embed: embed };
    } else if (Object.values(disclist).find((u) => u == uuid) != undefined) {
        let embed = Embeds.ERROR_ACCOUNT_PREVIOUSLY_LINKED;
        return { res: "", embed: embed };
    }

    disclist[discord] = uuid;
    await utils.writeJSON("./disclist.json", disclist);
    disclist = null;
    let embed = Embeds.INFO_LINK_SUCCESS;
    return { res: "", embed: embed };
});
