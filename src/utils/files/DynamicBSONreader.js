const fs = require("fs-extra");
const BSON = require("bson-ext");

/**
 * 
 * @param {string} filename 
 * @returns {Promise<Array>}
 */
async function DynamicBSONreader (filename) {
    const metadata = BSON.deserialize(await fs.readFile(`${filename}.meta`));

    let result;

    if(metadata.type == 1) {
        result = [];
    }

    for(let i = 0; i < metadata.length; i++) {
        const obj = BSON.deserialize(await fs.readFile(`${filename}.${i}`));
        if(metadata.type == 1) {
            result = result.concat(Object.values(obj));
        }
    }

    return result;
}

module.exports = DynamicBSONreader;
