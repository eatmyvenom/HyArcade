const { HypixelApi } = require("hyarcade-requests");
const MongoConnector = require("hyarcade-requests/MongoConnector");
const AccountResolver = require("../AccountResolver");

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {MongoConnector} connector
 */
module.exports = async (req, res, connector) => {
  const url = new URL(req.url, `https://${req.headers.host}`);
  if (req.method == "GET") {
    res.setHeader("Content-Type", "application/json");

    let cacheAccount = await AccountResolver(connector, url, true);
    let resolvedAccount = await AccountResolver(connector, url);

    const status = await HypixelApi.status(resolvedAccount.uuid);

    status.actionTime = resolvedAccount.actionTime;
    status.name = resolvedAccount.name;
    status.rank = resolvedAccount.rank;
    status.mvpColor = resolvedAccount.mvpColor;
    status.plusColor = resolvedAccount.plusColor;
    status.lastLogout = resolvedAccount.lastLogout;
    status.lastLogin = resolvedAccount.lastLogin;
    status.isLoggedIn = resolvedAccount.isLoggedIn;

    if (cacheAccount.extra.combinedAchievementProgress != resolvedAccount.extra.combinedAchievementProgress) {
      status.actionTime.otherActions = Math.max(status.actionTime.otherActions, cacheAccount.updateTime);
    }

    res.write(JSON.stringify(status));
    res.end();
  } else {
    res.statusCode = 404;
    res.end();
  }
};
