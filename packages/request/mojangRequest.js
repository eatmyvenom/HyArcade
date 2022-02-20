const { default: axios } = require("axios");
const logger = require("hyarcade-logger");

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
  if (raw != "") {
    return JSON.parse(raw);
  }
  // log the missing username so i can change it
  logger.err(`"${uuid}" does not exist`);
  return;
}

/**
 * Actual uuid from mojang
 *
 * @param {string} name
 * @returns {string}
 */
async function getUUID(name) {
  const raw = await getUUIDRaw(name);

  // make sure the data isnt an empty response
  if (raw != "") {
    return JSON.parse(raw).id;
  }
  // log the missing username so i can change it
  logger.err(`"${name}" does not exist`);
  return;
}

module.exports = {
  getUUIDRaw,
  getUUID,
  getPlayer,
};
