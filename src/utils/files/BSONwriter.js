const fs = require("fs-extra");
let BSON;
try {
  BSON = require("bson-ext");
} catch(e) {
  BSON = require("bson");
}

module.exports = async function BSONwriter (path, object) {
  if(Array.isArray(object)) {
    const arr1 = object.slice(0, object.length / 2);
    const arr2 = object.slice(object.length / 2);
    const buffer1 = BSON.serialize(arr1, {});
    const buffer2 = BSON.serialize(arr2, {});
    await fs.writeFile((`data/${path}.1`).replace(/json/g, "bson"), buffer1);
    await fs.writeFile((`data/${path}.2`).replace(/json/g, "bson"), buffer2);
  } else {
    const buffer = BSON.serialize(object, {});
    await fs.writeFile((`data/${path}`).replace(/json/g, "bson"), buffer);
  }
};
