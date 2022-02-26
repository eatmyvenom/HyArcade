const { HypixelApi } = require("hyarcade-requests");
const Achievements = require("hyarcade-structures/Achievements");
const AccountResolver = require("../AccountResolver");

/**
 *
 * @param {*} req
 * @param {*} res
 * @param connector
 */
module.exports = async (req, res, connector) => {
  const url = new URL(req.url, `https://${req.headers.host}`);
  if (req.method == "GET") {
    res.setHeader("Content-Type", "application/json");

    const acc = await AccountResolver(connector, url);
    const rawAPI = await HypixelApi.player(acc.uuid);

    const AP = new Achievements(rawAPI.player);

    res.write(JSON.stringify(AP));
    res.end();
  } else {
    res.statusCode = 404;
    res.end();
  }
};
