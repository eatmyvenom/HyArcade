const BSON = require("bson");
const fs = require("fs-extra");

module.exports = async function BSONreader(path) {
    let buffer = await fs.readFile(path);
    return BSON.deserialize(buffer);
}