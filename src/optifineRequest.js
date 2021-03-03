const webReq = require('./webRequest');

async function reqOFCape(name) {
    return await webReq(`http://s.optifine.net/capes/${name}.png`);
}

module.exports = class optifineRequest {
    name = "";
    headers = {};
    status = 404;
    data = "";
    constructor(name) {
        this.name = name;
    }

    async makeRequest() {
        let res = await reqOFCape(this.name);
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
}