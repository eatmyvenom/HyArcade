#!/usr/bin/env node

const webRequest = require("./src/webRequest");
const fs = require("fs/promises");

async function downloadFile(name, servername) {
    let response = await webRequest("http://eatmyvenom.me/share/" + servername);
    await fs.writeFile("data/" + name, response.data);
}

async function main() {
    await fs.mkdir("data");
    await downloadFile("status.json", "pgstatus.json");
    await downloadFile("runtimeinfo.json", "runtimeinfo.json");
    await downloadFile("acclist.json", "acclist.json");
    await downloadFile("accounts.json", "accounts.json");
    await downloadFile("guild.json", "guild.json");
    await downloadFile("players.json", "players.json");
    await downloadFile("playerlist.json", "playerlist.json");
    await downloadFile("guildlist.json", "guildlist.json");
    await downloadFile("disclist.json", "disclist.json");
}

main();
