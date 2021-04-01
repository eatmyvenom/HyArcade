const { MessageEmbed } = require("discord.js");
const Command = require("../classes/Command");
const mojangRequest = require("../mojangRequest");
const utils = require("../utils");
let defaultAllowed = [
    "156952208045375488",
    "716907952736567387",
    "696529020627714079",
    "175596984722391049",
    "339560215261347850",
];

const config = require("../Config").fromJSON();

async function execute(txt, senderID) {
    if (txt.startsWith(config.commandCharacter)) {
        let cmdArr = txt.slice(1).split(" ");
        return await checkCommands(cmdArr[0], cmdArr.slice(1), senderID);
    }
    return { res: "" };
}

let linkCmd = new Command("link", defaultAllowed, async (args) => {
    let player = args[0];
    let discord = args[1];
    let uuid = player;
    if (player.length < 16) {
        uuid = await mojangRequest.getUUID(player);
    }
    let disclist = await utils.readJSON("./disclist.json");
    if (disclist[uuid]) {
        return "This player has already been linked!";
    } else if (Object.values(disclist).find((d) => d == discord) != undefined) {
        return "This user has already been linked!";
    }

    disclist[uuid] = discord;
    await utils.writeJSON("./disclist.json", disclist);
    return { res: `${player} linked successfully!` };
});

let statsCommand = new Command("stats", ["*"], async (args) => {
    let player = args[0];

    let acclist = await utils.readJSON("./accounts.json");
    let acc = acclist.find((a) => a.name.toLowerCase() == player.toLowerCase());
    if (acc == undefined) {
        return { res: player + " is not in the database" };
    }

    let iconURL = "https://crafatar.com/avatars/" + acc.uuid + "?overlay";
    let thumbURL =
        " https://crafatar.com/renders/body/" + acc.uuid + "?overlay";
    let playerURL =
        "http://eatmyvenom.me/share/partygames/player.html?q=" + acc.name;

    let lvl = Math.round(acc.level * 100) / 100;

    let embed = new MessageEmbed()
        .setAuthor(acc.name, iconURL, playerURL)
        .setTitle("Stats")
        .setThumbnail(thumbURL)
        .setColor(0x44a3e7)
        .addField("All wins", acc.anyWins, false)
        .addField("Arcade wins", acc.arcadeWins, false)
        .addField("Party games wins", acc.wins, false)
        .addField("Farm hunt wins", acc.farmhuntWins, false)
        .addField("Hypixel says wins", acc.hypixelSaysWins, false)
        .addField("Level", lvl)
        .addField("Rank", acc.rank.replace(/_/g, "").replace(/PLUS/g, "+"), false)
        .addField("UUID", acc.uuid, false);

    return { res: "", embed: embed };
});

async function checkCommands(command, args, author) {
    switch (command) {
        case "link":
        case "ln":
            return await linkCmd.execute(args, author);
            break;

        case "stats":
        case "s":
            return await statsCommand.execute(args, author);
            break;
    }
    return { res: "" };
}

module.exports = { execute: execute };
