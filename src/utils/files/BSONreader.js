const BSON = require('bson/lib/bson/bson.js');
const fs = require("fs-extra");

module.exports = async function BSONreader(path) {
    let buffer = await fs.readFile(("data/" + path).replace(/json/g, "bson"));
    return BSON.prototype.deserialize(buffer);
}