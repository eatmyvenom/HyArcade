const Account = require("../../classes/account");
const Command = require("../../classes/Command");
const mojangRequest = require("../../request/mojangRequest");
const BotUtils = require("../BotUtils");
const { addAccount } = require("../Utils/Database");
const { ERROR_ARGS_LENGTH } = require("../Utils/Embeds/DynamicEmbeds");
const { ERROR_IGN_UNDEFINED, INFO_LINK_SUCCESS, ERROR_PLAYER_PREVIOUSLY_LINKED, ERROR_ACCOUNT_PREVIOUSLY_LINKED } = require("../Utils/Embeds/StaticEmbeds");

module.exports = new Command("link", ["%trusted%"], async (args) => {
    if (args.length < 1) {
        return { res: "", embed: ERROR_ARGS_LENGTH(1) };
    }
    let player = args[0];
    let discord = args[1];
    let disclist = await BotUtils.getFromDB("disclist");

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
        uuid = player.length == 32 ? player : await mojangRequest.getUUID(player);
        if (("" + uuid).length != 32) {
            let noexistEmbed = ERROR_IGN_UNDEFINED;

            return { res: "", embed: noexistEmbed };
        }
        acc = new Account(player, 0, uuid);
        await acc.updateHypixel();
        await addAccount([acc]);
    }

    uuid = acc.uuid;

    if(args.includes("-f")) {
        disclist[discord] = uuid;
        await BotUtils.writeToDB("disclist", disclist);
        disclist = null;
        let embed = INFO_LINK_SUCCESS;
        return { res: "", embed: embed };
    }

    if (disclist[discord]) {
        let embed = ERROR_PLAYER_PREVIOUSLY_LINKED;
        return { res: "", embed: embed };
    } else if (Object.values(disclist).find((u) => u == uuid) != undefined) {
        let embed = ERROR_ACCOUNT_PREVIOUSLY_LINKED;
        return { res: "", embed: embed };
    }

    disclist[discord] = uuid;
    await BotUtils.writeToDB("disclist", disclist);
    disclist = null;
    let embed = INFO_LINK_SUCCESS;
    return { res: "", embed: embed };
});
