import Account from "../../classes/account.js";
import Command from "../../classes/Command.js";
import Embeds from "../Embeds.js";
import mojangRequest from "../../request/mojangRequest.js";
import utils from "../../utils.js";
import { addAccounts } from "../../listUtils.js";

export let Verify = new Command("linkme", ["*"], async (args, rawMsg, interaction) => {
    let player = args[0];
    if (player == undefined) {
        let embed = Embeds.ERROR_INPUT_IGN;
        return { res: "", embed: embed };
    }
    let acclist = await BotUtils.getFromDB("accounts");
    let acc = acclist.find(
        (a) =>
            ("" + a.uuid).toLowerCase() == player.toLowerCase() || ("" + a.name).toLowerCase() == player.toLowerCase()
    );
    if (acc == undefined) {
        let uuid = player.length == 32 ? player : await mojangRequest.getUUID(player);
        if (("" + uuid).length != 32) {
            let noexistEmbed = Embeds.ERROR_IGN_UNDEFINED;

            return { res: "", embed: noexistEmbed };
        }
        acc = new Account(player, 0, uuid);
        await addAccounts("others", [uuid]);
        await acc.updateHypixel();
    }

    let tag;
    if (interaction == undefined) {
        tag = rawMsg.author.tag.toLowerCase();
    } else {
        tag = interaction.member.user.tag.toLowerCase();
    }

    if (("" + acc.hypixelDiscord).toLowerCase() == tag) {
        let uuid = player;
        // if its not a uuid then convert to uuid
        if (player.length < 17) {
            uuid = acc.uuid;
        }
        let discord;
        if (interaction == undefined) {
            discord = rawMsg.author.id;
        } else {
            discord = interaction.member.id;
        }
        let disclist = await BotUtils.getFromDB("disclist");
        // make sure player isnt linked
        if (disclist[discord]) {
            let embed = Embeds.ERROR_PLAYER_PREVIOUSLY_LINKED;
            return { res: "", embed: embed };
            // make sure user isnt linked
        } else if (Object.values(disclist).find((u) => u == uuid) != undefined) {
            let embed = Embeds.ERROR_ACCOUNT_PREVIOUSLY_LINKED;
            return { res: "", embed: embed };
        }

        disclist[discord] = uuid;
        await utils.writeJSON("./disclist.json", disclist);
        let embed = Embeds.INFO_LINK_SUCCESS;
        return { res: "", embed: embed };
    } else {
        let embed = Embeds.ERROR_LINK_HYPIXEL_MISMATCH;
        return { res: "", embed: embed };
    }
});
