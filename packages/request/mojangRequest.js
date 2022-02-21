const { default: axios } = require("axios");

/**
 * The raw uuid response from mojang
 *
 * @param {*} name
 * @returns {*}
 */
async function getUUIDRaw(name) {
  // promisify query
  const response = await axios.get(`https://api.mojang.com/users/profiles/minecraft/${name}`, { responseType: "text" });
  return response.data;
}

/**
 * @param {*} uuid
 * @returns {*}
 */
async function getPlayerRaw(uuid) {
  const response = await axios.get(`https://sessionserver.mojang.com/session/minecraft/profile/${uuid}`, { responseType: "text" });
  const { data } = response;
  return data;
}

/**
 * @param {*} uuid
 * @returns {*}
 */
async function getPlayer(uuid) {
  const raw = await getPlayerRaw(uuid);
  return raw;
}

/**
 * Actual uuid from mojang
 *
 * @param {string} name
 * @returns {string}
 */
async function getUUID(name) {
  const raw = await getUUIDRaw(name);

  return raw;
}

module.exports = {
  getUUIDRaw,
  getUUID,
  getPlayer,
};
