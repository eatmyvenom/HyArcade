const BSON = require("bson-ext");
const fs = require("fs-extra");

class sizedWriter {
    length = 0;
    type = 0;
    documents = [];

    /**
     * 
     * @param {Array} newObjs 
     * @param {number} type 0 - Object, 1 - Array
     */
    constructor (newObjs, type) {
      this.length = newObjs.length;
      this.type = type;
      newObjs.forEach((sizedObject) => {
        this.documents.push(BSON.serialize(sizedObject));
      }, this);
    }

    async toFile (filename) {
      const meta = {
        length: this.length,
        type: this.type,
      };
      await fs.writeFile(`${filename}.meta`, BSON.serialize(meta));

      this.documents.forEach((doc, index) => {
        fs.writeFileSync(`${filename}.${index}`, doc);
      });
    }
}

/**
 * 
 * @param {Array} arr 
 * @param {number} chunkSize 
 * @returns {Array}
 */
function chunkArray (arr, chunkSize) {
  return Array.from(Array(Math.ceil(arr.length / chunkSize)), (_, i) => arr.slice(i * chunkSize, i * chunkSize + chunkSize));
}

/**
 * 
 * @param {object} object 
 * @param {string} filename 
 */
async function DynamicBSONwriter (object, filename) {

  const files = Math.ceil(BSON.calculateObjectSize(object) / 16000000);
  let dynamicData;

  if(files > 1) {
    if(Array.isArray(object)) {
      dynamicData = new sizedWriter(chunkArray(object, object.length / files), 1);
    }
  }

  dynamicData.toFile(filename);
}

module.exports = DynamicBSONwriter;
