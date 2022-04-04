const { HypixelApi } = require("@hyarcade/requests");
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

    const cacheAccount = await AccountResolver(runtime, true);
    const resolvedAccount = await AccountResolver(runtime);

    const status = await HypixelApi.status(resolvedAccount.uuid);

    status.actionTime = resolvedAccount.actionTime;
    status.name = resolvedAccount.name;
    status.rank = resolvedAccount.rank;
    status.mvpColor = resolvedAccount.mvpColor;
    status.plusColor = resolvedAccount.plusColor;
    status.lastLogout = resolvedAccount.lastLogout;
    status.lastLogin = resolvedAccount.lastLogin;
    status.isLoggedIn = resolvedAccount.isLoggedIn;
    status.apiHidden = resolvedAccount.apiHidden;
    status.mostRecentGameType = resolvedAccount.mostRecentGameType;

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
