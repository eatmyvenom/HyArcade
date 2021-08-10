const fs = require("fs-extra");
const BSON = require("bson-ext");

module.exports = async function BSONwriter (path, object) {
    if(Array.isArray(object)) {
        let arr1 = object.slice(0, object.length / 2);
        let arr2 = object.slice(object.length / 2);
        let buffer1 = BSON.serialize(arr1, {});
        let buffer2 = BSON.serialize(arr2, {});
        await fs.writeFile((`data/${path}.1`).replace(/json/g, "bson"), buffer1);
        await fs.writeFile((`data/${path}.2`).replace(/json/g, "bson"), buffer2);
    } else {
        let buffer = BSON.serialize(object, {});
        await fs.writeFile((`data/${path}`).replace(/json/g, "bson"), buffer);
    }
};
