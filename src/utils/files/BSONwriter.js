const BSON = require('bson/lib/bson/bson.js');
const fs = require("fs-extra");

module.exports = async function BSONwriter(path, object) {
    let buffer = BSON.prototype.serialize(object, {});
    await fs.writeFile(("data/" + path).replace(/json/g, "bson"), buffer);
}