const webReq = require("./webRequest");

async function reqLabyCape(uuid) {
    return await webReq(`https://dl.labymod.net/capes/${uuid}`);
}

module.exports = class labyRequest {
    uuid = "";
    headers = {};
    status = 404;
    data = "";
    constructor(uuid) {
        this.uuid = uuid;
    }

    async makeRequest() {
        let res = await reqLabyCape(this.uuid);
        this.headers = res.headers;
        this.status = res.status;
        this.data = res.data;
    }

    hasCape() {
        return this.status != 404;
    }

    getCapePNG() {
        return this.data;
    }
};
