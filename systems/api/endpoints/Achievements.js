const { HypixelApi } = require("@hyarcade/requests");
const Achievements = require("@hyarcade/structures/Achievements");
const AccountResolver = require("../AccountResolver");
const APIRuntime = require("../APIRuntime");

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {APIRuntime} runtime
 */
module.exports = async (req, res, runtime) => {
  if (req.method == "GET") {
    res.setHeader("Content-Type", "application/json");

    const acc = await AccountResolver(runtime);
    const rawAPI = await HypixelApi.player(acc.uuid);

    const AP = new Achievements(rawAPI.player);

    AP.name = acc.name;
    AP.rank = acc.rank;
    AP.mvpColor = acc.mvpColor;
    AP.plusColor = acc.plusColor;

    res.write(JSON.stringify(AP));
    res.end();
  } else {
    res.statusCode = 404;
    res.end();
  }
};
