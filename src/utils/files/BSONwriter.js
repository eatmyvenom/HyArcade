const BSON = require("bson");
const fs = require("fs-extra");

module.exports = async function BSONwriter(path, object) {
    let buffer = BSON.serialize(object);
    await fs.writeFile(path, buffer);
}