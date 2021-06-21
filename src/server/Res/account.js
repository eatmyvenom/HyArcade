const URL = require('url').URL;
const utils = require('../../utils');

module.exports = async (req, res) => {
    const url = new URL(req.url, `https://${req.headers.host}`);
    let player = url.searchParams.get("q");
    console.log(player);
    player = player.toLowerCase();
    if(req.method == "GET") {
        res.setHeader('Content-Type', 'text/json');
        let accounts = await utils.readJSON('accounts.json');
        let acc;
        if(player.length == 32) {
            acc = accounts.find(a => a.uuid == player);
        } else if (player.length == 36) {
            acc = accounts.find(a => a.uuidPosix == player);
        } else {
            acc = accounts.find(a => a.name.toLowerCase() == player);
        }
        res.write(JSON.stringify(acc));
        res.end();
    } else {
        res.statusCode = 404;
        res.end();
    }
}