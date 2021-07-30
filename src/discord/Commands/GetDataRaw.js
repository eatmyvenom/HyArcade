const { MessageEmbed } = require("discord.js");
const Command = require("../../classes/Command");
const BotUtils = require("../BotUtils");
const InteractionUtils = require("../interactions/InteractionUtils");
const Util = require("util")

function getProp(o, s) {
    s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    s = s.replace(/^\./, '');           // strip a leading dot
    var a = s.split('.');
    for (var i = 0, n = a.length; i < n; ++i) {
        var k = a[i];
        if (k in o) {
            o = o[k];
        } else {
            return;
        }
    }
    return o;
}

module.exports = new Command("getDataRaw", ["*"], async (args, rawMsg, interaction) => {
    let plr = args[0];
    let acc;
    if (interaction == undefined) {
        acc = await BotUtils.resolveAccount(plr, rawMsg, args.length != 2);
    } else {
        acc = await InteractionUtils.resolveAccount(interaction);
    }
    let path = args[args.length - 1];
    let val = getProp(acc, path);

    if(typeof val == "number" || typeof val == "boolean") {
        val = "" + val;
    }

    if(typeof val != "string") {
        val = Util.inspect(val, true);
    }

    let embed = new MessageEmbed()
        .setTitle(acc.name + "." + path)
        .setDescription(val)
        .setColor(0x44a3e7);
    return { res: "", embed: embed };
});
