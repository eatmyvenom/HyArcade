const {
    MessageEmbed
} = require("discord.js");
const Command = require("../../classes/Command");
const BotUtils = require("../BotUtils");
const InteractionUtils = require("../interactions/InteractionUtils");
const Util = require("util");

/**
 * @param {object} o
 * @param {string} s
 * @returns {*}
 */
function getProp (o, s) {
    let obj = o;
    let str = s;
    str = str.replace(/\[(\w+)\]/g, ".$1"); // convert indexes to properties
    str = str.replace(/^\./, ""); // strip a leading dot
    const a = str.split(".");
    for(let i = 0, n = a.length; i < n; ++i) {
        const k = a[i];
        if(k in obj) {
            obj = obj[k];
        } else {
            return;
        }
    }
    return obj;
}

module.exports = new Command("getDataRaw", ["*"], async (args, rawMsg, interaction) => {
    const plr = args[0];
    let acc;
    if(interaction == undefined) {
        acc = await BotUtils.resolveAccount(plr, rawMsg, args.length != 2);
    } else {
        acc = await InteractionUtils.resolveAccount(interaction);
    }
    const path = args[args.length - 1];
    let val = getProp(acc, path);

    if(typeof val == "number" || typeof val == "boolean") {
        val = `${val}`;
    }

    if(typeof val != "string") {
        val = Util.inspect(val, true);
    }

    const embed = new MessageEmbed()
        .setTitle(`${acc.name}.${path}`)
        .setDescription(val)
        .setColor(0x44a3e7);
    return {
        res: "",
        embed
    };
});
