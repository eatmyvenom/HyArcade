const BSON = require("bson-ext");
const fs = require("fs-extra");

module.exports = async function BSONreader (path) {
    if(fs.existsSync(`data/${path.replace(/json/g, "bson")}.1`)) {
        let buffer1 = await fs.readFile((`data/${path}.1`).replace(/json/g, "bson"));
        let arr1 = BSON.deserialize(buffer1);
        let buffer2 = await fs.readFile((`data/${path}.2`).replace(/json/g, "bson"));
        let arr2 = BSON.deserialize(buffer2);
        return [].concat(Object.values(arr1), Object.values(arr2));
    } else {
        let buffer = await fs.readFile((`data/${path}`).replace(/json/g, "bson"));
        return BSON.deserialize(buffer);
    }
};
