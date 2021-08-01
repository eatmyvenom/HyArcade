const logger = require("../utils").logger;
const URL = require("url").URL;
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
 * @param request
 * @param response
 */
async function callback(request, response) {
    let url = new URL(request.url, `https://${request.headers.host}`);
    let endpoint = url.pathname.slice(1);
    let mod = urlModules[endpoint];
    if(mod == undefined) {
        logger.err("Attempted nonexistent endpoint '" + endpoint + "'");
        response.statusCode = 404;
        response.end();
    } else {
        try {
            logger.out("Getting data for " + url);
            await mod(request, response, fileCache);
        } catch (e) {
            logger.err(e);
            response.statusCode = 404;
            response.end();
        }
    }
}

app.get("/db", callback);
app.get("/account", callback);
app.get("/acc", callback);
app.get("/leaderboard", callback);
app.get("/lb", callback);

module.exports = function start(port) {
    app.listen(port, () => {
        fileCache = new FileCache("data/");
        logger.log(`Express app listening at http://localhost:${port}`);
    });
};
