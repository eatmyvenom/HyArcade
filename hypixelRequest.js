const https = require('https');
const { key } = require('./config.json');

async function basicRequest(page, extraArgs = [] ) {
    let url = `https://api.hypixel.net/${page}?key=${key}`
    // this is my handling of adding other args that work
    // in urls, its not perfect but it works well here
    if (extraArgs!=[]) {
        for(let i = 0; i < extraArgs.length; i++) {
            url += `&${extraArgs[i].key}=${extraArgs[i].val}`
        }
    }

    return new Promise((resolve,reject)=>{
        https.get(url, res => {
            let reply='';
            res.on('data',d=>{reply+=d});
            res.on('end',()=>{resolve(reply)});
            res.on('error',err=>{reject(err)});
        });
    });
} 

exports.getStatusRaw = async function getStatusRAW(uuid) {
    return await basicRequest('status', [{ key : 'uuid', val : uuid}] );
}

exports.getAccountDataRaw =  async function getAccountDataRaw(uuid) {
    return await basicRequest('player', [{ key : 'uuid', val : uuid}] );
}

exports.getGameCountsRAW = async function getGameCountsRAW() {
    // dont put empty array since that is automatically done
    return await basicRequest('gameCounts');
}