const https = require('https');

module.exports = function webRequest(url) {
    return new Promise((resolve,reject) => {
        https.get(url, (res) => {
            let reply = '';
            res.on('data',d=>{reply+=d});
            res.on('end',()=>{resolve({data : reply, headers : res.headers, status : res.statusCode})});
            res.on('error',err=>{reject(err)});
        });
    });
}