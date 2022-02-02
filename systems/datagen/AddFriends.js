const { default: fetch } = require("node-fetch");
const addAccounts = require("./addAccounts");

module.exports = async function AddFriends(uuid) {
  const friendsFetch = await fetch(`https://api.slothpixel.me/api/players/${uuid}/friends`);
  const friendsList = await friendsFetch.json();

  const uuids = friendsList.map(f => f.uuid);

  await addAccounts(uuids);
};
