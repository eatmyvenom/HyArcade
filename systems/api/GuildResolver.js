const { MissingFieldError, DataNotFoundError } = require("@hyarcade/errors");
const Logger = require("@hyarcade/logger");
const { mojangRequest } = require("@hyarcade/requests");
const { Guild } = require("@hyarcade/structures");
const APIRuntime = require("./APIRuntime");

/**
 * @param req
 * @param {APIRuntime} runtime
 */
async function GuildResolver(req, runtime) {
  const { url, config, mongoConnector } = runtime;
  const uuid = url.searchParams.get("uuid");
  const cacheOnly = url.searchParams.has("cache");
  let memberUUID = url.searchParams.get("member");

  if (uuid == undefined && memberUUID == undefined) {
    throw new MissingFieldError("Request has no input to resolve to an guild", ["uuid"]);
  }

  let guild;
  if (uuid) {
    guild = await mongoConnector.getGuild(uuid);
  } else if (memberUUID) {
    if (memberUUID.length < 32) {
      memberUUID = await mojangRequest.getUUID(memberUUID);
    }

    if (memberUUID == undefined) {
      throw new DataNotFoundError();
    }

    guild = await mongoConnector.getGuildByMember(memberUUID);
  }

  const isOutOfDate = (guild?.updateTime ?? 0) < Date.now() - config.database.cacheTime.guilds;

  if ((guild == undefined || isOutOfDate) && !cacheOnly) {
    guild = new Guild(uuid ?? memberUUID);
    Logger.debug(`Guild: ${uuid ?? memberUUID} missed cache. Fetching!`);
    await guild.updateWins();

    if (guild.name != "INVALID-NAME") {
      Logger.info("Adding guild to mongo");
      await mongoConnector.updateGuild(guild);
    } else {
      guild = { ERROR: "NO-GUILD" };
    }
  }

  return guild;
}

module.exports = GuildResolver;
