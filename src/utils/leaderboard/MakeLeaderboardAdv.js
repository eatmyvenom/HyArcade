const Json = require("hyarcade-utils/FileHandling/Json");
const { getList } = require("./ListUtils");

/**
 *
 * @param {string} name
 * @param {string} timetype
 * @param {number} maxamnt Max amount of players in
 * @param {Function} callback Callback used to get the stats out of each account
 * @returns {object} The sorted list
 */
module.exports = async function mklistAdv(name, timetype, maxamnt, callback) {
  let newlist;
  let oldlist;
  if (name == "accounts") {
    newlist = await getList();
    oldlist = await getList(timetype);
  } else {
    newlist = await Json.read(`${name}.json`);
    oldlist = await Json.read(`${name}.${timetype}.json`);
  }

  for (let i = 0; i < oldlist.length; i += 1) {
    const oldacc = oldlist[i];
    const newacc = newlist.find(g => `${g.uuid}`.toLowerCase() == `${oldacc.uuid}`.toLowerCase());

    // make sure acc isnt null/undefined
    if (newacc) {
      oldlist[i] = callback(newacc, oldacc);
    }
  }

  // use old list to ensure that players added today
  // don't show up with a crazy amount of daily wins
  return oldlist.slice(0, maxamnt);
};
