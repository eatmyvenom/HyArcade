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
    return "";
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
    } else if(Object.values(disclist).find(d=>d==discord)!=undefined) {
        return "This user has already been linked!";
    }

    disclist[uuid] = discord;
    await utils.writeJSON("./disclist.json", disclist);
    return `${player} linked successfully!`;
});

async function checkCommands(command, args, author) {
    switch (command) {
        case "link":
            return await linkCmd.execute(args, author);
    }
    return "";
}

module.exports = { execute: execute };
