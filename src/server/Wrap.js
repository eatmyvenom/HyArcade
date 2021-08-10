const {logger} = require("../utils");
const {URL} = require("url");
const FileCache = require("../utils/files/FileCache");
const urlModules = {
    account: require("./Res/account"),
    acc: require("./Res/account"),
    leaderboard: require("./Res/leaderboard"),
    lb: require("./Res/leaderboard"),
    db: require("./Res/Database")
};
let fileCache;
const compression = require("compression");
const express = require("express");
const app = express();
app.use(compression());


/**
 * @param {express.Response} res
 * @param {express.Request} req
 */
async function callback (res, req) {
    const request = req.req;
    const response = res.res;

    const url = new URL(request.url, `https://${request.headers.host}`);
    const endpoint = url.pathname.slice(1);
    const mod = urlModules[endpoint];
    if(mod == undefined) {
        logger.err(`Attempted nonexistent endpoint '${endpoint}'`);
        response.statusCode = 404;
        response.end();
    } else {
        try {
            logger.out(`Getting data for ${url}`);
            await mod(request, response, fileCache);
        } catch (e) {
            logger.err(e);
            response.statusCode = 404;
            response.end();
        }
    }
}

app.all("/db", callback);
app.all("/account", callback);
app.all("/acc", callback);
app.all("/leaderboard", callback);
app.all("/lb", callback);

module.exports = function start (port) {
    app.listen(port, () => {
        fileCache = new FileCache("data/");
        logger.log(`Express app listening at http://localhost:${port}`);
    });
};
