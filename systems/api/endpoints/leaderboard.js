/* eslint-disable unicorn/no-array-reduce */
const { MissingFieldError } = require("hyarcade-errors");
const Logger = require("hyarcade-logger");
const { mojangRequest } = require("hyarcade-requests");
const MongoConnector = require("hyarcade-requests/MongoConnector");
const { Guild } = require("hyarcade-structures");
const GenericLeaderboard = require("hyarcade-utils/Leaderboards/GenericLeaderboard");
const MiniWallsLeaderboard = require("hyarcade-utils/Leaderboards/MiniWallsLeaderboard");

/**
 * @param lbprop
 * @param timePeriod
 * @param reverse
 * @param max
 * @param {MongoConnector} connector
 * @returns {Promise<Guild>}
 */
async function GuildLeaderboard(lbprop, timePeriod, reverse, max, connector) {
  Logger.verbose("Getting guild leaderboard");

  const accs = await (timePeriod == undefined || timePeriod == "life" || timePeriod == "lifetime" || timePeriod == undefined || timePeriod == ""
    ? connector.getGuildLeaderboard(lbprop, reverse, max)
    : connector.getGuildHistoricalLeaderboard(lbprop, timePeriod, reverse, max));

  return accs;
}

/**
 * @param input
 * @param path
 * @param reverse
 * @param {MongoConnector} connector
 */
async function GuildMemberLeaderboard(input, path, reverse, connector) {
  let guild;

  if (input.length == 24) {
    guild = await connector.getGuild(input);
  } else if (input.length == 32 || input.length == 36) {
    guild = await connector.getGuildByMember(input.replace(/-/g, ""));
  } else {
    const memberUUID = await mojangRequest.getUUID(input);
    guild = await connector.getGuildByMember(memberUUID);
  }

  const members = guild.memberStats;

  const sorted = members.sort((m1, m2) => {
    const m1Val = path.split(".").reduce((a, b) => a[b], m1);
    const m2Val = path.split(".").reduce((a, b) => a[b], m2);

    return reverse ? m2Val - m1Val : m1Val - m2Val;
  });

  return sorted;
}

/**
 * @param path
 * @param timePeriod
 * @param reverse
 * @param max
 * @param {MongoConnector} connector
 */
async function OldLeaderboard(path, timePeriod, reverse, max, connector) {
  const accs = await connector.getOldLeaderboard(path, timePeriod, reverse, max);

  return accs;
}

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {MongoConnector} connector
 */
module.exports = async (req, res, connector) => {
  const url = new URL(req.url, `https://${req.headers.host}`);
  const reqPath = url.pathname.split("/").slice(1);

  const args = url.searchParams;

  if (req.method == "GET") {
    switch (reqPath[1]) {
      case "guild": {
        const lbprop = args.get("path");
        const timePeriod = args.get("time");
        const reverse = args.has("reverse");
        const max = Math.min(args.get("max") ?? 200, 1000);

        if (lbprop == undefined) {
          throw new MissingFieldError("No path specified to generate a leaderboard from", ["path"]);
        }

        Logger.log(`Guild Leaderboard: ${lbprop} - ${timePeriod} - ${max}`);
        const guilds = await GuildLeaderboard(lbprop, timePeriod, reverse, max, connector);

        res.setHeader("Content-Type", "application/json");
        res.write(JSON.stringify(guilds));
        res.end();
        return;
      }

      case "miniwalls": {
        const stat = args.get("stat");
        const time = args.get("time");

        if (stat == undefined) {
          throw new MissingFieldError("No stat specified to generate a leaderboard from", ["stat"]);
        }

        Logger.log(`Mini Walls Leaderboard: ${stat} - ${time}`);
        res.setHeader("Content-Type", "application/json");

        const leaderboard = JSON.stringify(await MiniWallsLeaderboard(connector, stat, time));

        res.write(leaderboard);
        res.end();

        return;
      }

      case "gmember": {
        const guild = args.get("guild");
        const path = args.get("path");
        const reverse = args.has("reverse");

        if (path == undefined) {
          throw new MissingFieldError("No path specified to generate a leaderboard from", ["path"]);
        }

        const mems = await GuildMemberLeaderboard(guild, path, reverse, connector);
        res.setHeader("Content-Type", "application/json");
        res.write(JSON.stringify(mems));
        res.end();
        return;
      }

      case "old": {
        const path = args.get("path");
        const timePeriod = args.get("time");
        const reverse = args.has("reverse");
        const max = Math.min(args.get("max") ?? 200, 1000);

        const accs = await OldLeaderboard(path, timePeriod, reverse, max, connector);

        res.setHeader("Content-Type", "application/json");
        res.write(JSON.stringify(accs));
        res.end();

        return;
      }

      default: {
        const category = args.get("category");
        const lbprop = args.get("path");
        const timePeriod = args.get("time");
        const reverse = args.has("reverse");
        const max = Math.min(args.get("max") ?? 200, 1000);

        if (lbprop == undefined) {
          throw new MissingFieldError("No path specified to generate a leaderboard from", ["path"]);
        }

        Logger.log(`Leaderboard: ${category}.${lbprop} - ${timePeriod} - ${max}`);
        const accs = await GenericLeaderboard(category, lbprop, timePeriod, reverse, max, connector);

        res.setHeader("Content-Type", "application/json");
        res.write(JSON.stringify(accs));
        res.end();
        return;
      }
    }
  } else {
    res.statusCode = 404;
    res.end();
  }
};
