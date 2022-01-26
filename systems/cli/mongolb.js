const connector = require("hyarcade-requests/MongoConnector");

/**
 * @param {object} o
 * @param {string} s
 * @returns {*}
 */
function getProp (o, s) {
  let obj = o;
  let str = s;
  str = str.replace(/\[(\w+)\]/g, ".$1"); // convert indexes to properties
  str = str.replace(/^\./, ""); // strip a leading dot
  const a = str.split(".");
  for(let i = 0, n = a.length; i < n; i += 1) {
    const k = a[i];
    if(k in obj) {
      obj = obj[k];
    } else {
      return;
    }
  }
  return obj;
}

/**
 * @param {string[]} args
 */
async function main(args) {
  const c = new connector("mongodb://127.0.0.1:27017");
  await c.connect();

  const lb = await c.getLeaderboard(args[4], args[5], args[6], args[7], args[8]);

  lb.map((acc, i) => `${i + 1}) ${acc.rank.replace(/_PLUS/g, "+")} ${acc.name} - ${getProp(args[4])}`);

  await c.destroy();
}

module.exports = main;