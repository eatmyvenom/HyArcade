const utils = require('./src/utils');

async function main() {
    await utils.downloadFile('status.json', 'pgstatus.json');
    await utils.downloadFile('acclist.json', 'acclist.json');
    await utils.downloadFile('accounts.json', 'accounts.json');
    await utils.downloadFile('guild.json', 'guild.json');
    await utils.downloadFile('players.json', 'players.json');
}

main();