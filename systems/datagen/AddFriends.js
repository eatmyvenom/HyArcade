const { default: axios } = require("axios");
const addAccounts = require("./addAccounts");

module.exports = async function AddFriends(uuid) {
  const friendsFetch = await axios.get(`https://api.slothpixel.me/api/players/${uuid}/friends`);
  const friendsList = friendsFetch.data;

  const uuids = friendsList.map(f => f.uuid);

  await addAccounts(uuids);
};
