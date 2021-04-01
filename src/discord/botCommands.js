const mojangRequest = require("../mojangRequest");
const utils = require("../utils");

const config = require("../Config").fromJSON();

async function execute(txt) {
    if (txt.startsWith(config.commandCharacter)) {
        let cmdArr = txt.slice(1).split(" ");
        return await checkCommands(cmdArr[0], cmdArr.slice(1));
    }
    return "";
}

async function link(args) {
    let player = args[0];
    let discord = args[1];
    let uuid = player;
    if (player.length < 16) {
        uuid = await mojangRequest.getUUID(player);
    }
    let disclist = await utils.readJSON("./disclist.json");
    disclist[uuid] = discord;
    await utils.writeJSON("./disclist.json", disclist);
    return `${player} linked successfully!`;
}

async function checkCommands(command, args) {
    switch (command) {
        case "link":
            return await link(args);
    }
    return "";
}

module.exports = { execute: execute };
