const https = require('https');

module.exports = class hypixelAPI {
    url = '';
    headers = {};
    constructor(url) {
        this.url = url;
    }

    async makeRequest() {
        let response = await new Promise((resolve,reject)=>{
            https.get(this.url, res => {
                let reply = '';
                res.on('data',d=>{reply+=d});
                res.on('end',()=>{resolve({res : reply, headers : res.headers})});
                res.on('error',err=>{reject(err)});
            });
        });
        this.headers = response.headers;
        return response.res;
    }
}