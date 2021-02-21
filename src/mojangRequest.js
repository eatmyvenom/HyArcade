const https = require('https');
const fs = require('fs');

async function getUUIDRaw(name) {
    // promisify query
    return new Promise((resolve,reject)=>{
        https.get(`https://api.mojang.com/users/profiles/minecraft/${name}`, res => {
            let reply='';
            res.on('data',d=>{reply+=d});
            res.on('end',()=>{resolve(reply)});
            res.on('error',err=>{reject(err)});
        });
    });
}

async function getUUID(name) {
    let raw = await getUUIDRaw(name);
    if(raw!="") {
        return JSON.parse(raw).id
    } else {
        console.error(`"${name}" does not exist`)
        return undefined;
    }
}

function getUUIDFromCache(name) {
    return JSON.parse(fs.readFileSync("uuids.json"))[name]
}

module.exports = { getUUIDRaw : getUUIDRaw, getUUID : getUUID, getUUIDFromCache : getUUIDFromCache }