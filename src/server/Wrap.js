const http = require('http');
const URL = require('url').URL;
const urlModules = {
    account : require("./Res/account")
};

let server = http.createServer(async (request, response) => {
    let url = new URL(request.url, `https://${request.headers.host}`);
    let endpoint = url.pathname.slice(1);
    let mod = urlModules[endpoint];
    if(mod == undefined) {
        console.log("Attempted nonexistent endpoint '" + endpoint + "'")
        response.statusCode = 404;
        response.end();
    } else {
        await mod(request, response);
    }
});

module.exports = server;