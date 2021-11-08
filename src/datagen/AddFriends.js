const { default: fetch } = require("node-fetch");
const addAccounts = require("./addAccounts");

module.exports = async function AddFriends (uuid) {
  const friendsList = await (await fetch(`https://api.slothpixel.me/api/players/${uuid}/friends`)).json();

  const uuids = friendsList.map((f) => f.uuid);

  await addAccounts("others", uuids);
};