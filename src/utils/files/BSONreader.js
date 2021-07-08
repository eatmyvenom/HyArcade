const BSON = require('bson/lib/bson/bson.js');
const fs = require("fs-extra");

module.exports = async function BSONreader(path) {
    if(fs.existsSync("data/" + path + ".1")) {
        let buffer1 = await fs.readFile(("data/" + path + ".1").replace(/json/g, "bson"));
        let arr1 = BSON.prototype.deserialize(buffer1);
        let buffer2 = await fs.readFile(("data/" + path + ".2").replace(/json/g, "bson"));
        let arr2 = BSON.prototype.deserialize(buffer2);
        return [].concat(arr1, arr2);
    } else {
        let buffer = await fs.readFile(("data/" + path).replace(/json/g, "bson"));
        return BSON.prototype.deserialize(buffer);
    }
}