const BSON = require("bson-ext");
const fs = require("fs-extra");

module.exports = async function BSONreader (path) {
    if(fs.existsSync(`data/${path.replace(/json/g, "bson")}.1`)) {
        const buffer1 = await fs.readFile((`data/${path}.1`).replace(/json/g, "bson"));
        const arr1 = BSON.deserialize(buffer1);
        const buffer2 = await fs.readFile((`data/${path}.2`).replace(/json/g, "bson"));
        const arr2 = BSON.deserialize(buffer2);
        return [].concat(Object.values(arr1), Object.values(arr2));
    } 
    const buffer = await fs.readFile((`data/${path}`).replace(/json/g, "bson"));
    return BSON.deserialize(buffer);
    
};
