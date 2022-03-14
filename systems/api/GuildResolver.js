const { MissingFieldError, DataNotFoundError } = require("hyarcade-errors");
const Logger = require("hyarcade-logger");
const { mojangRequest } = require("hyarcade-requests");
const { Guild } = require("hyarcade-structures");

/**
 * @param req
 * @param connector
 */
async function GuildResolver(req, connector) {
  const url = new URL(req.url, `https://${req.headers.host}`);
  const uuid = url.searchParams.get("uuid");
  let memberUUID = url.searchParams.get("member");

  if (uuid == undefined && memberUUID == undefined) {
    throw new MissingFieldError("Request has no input to resolve to an guild", ["uuid"]);
  }

  let guild;
  if (uuid) {
    guild = await connector.getGuild(uuid);
  } else if (memberUUID) {
    if (memberUUID.length < 32) {
      memberUUID = await mojangRequest.getUUID(memberUUID);
    }

    if (memberUUID == undefined) {
      throw new DataNotFoundError();
    }

    guild = await connector.getGuildByMember(memberUUID);
  }

  // eslint-disable-next-line unicorn/no-null
  if (guild == undefined || guild == null || (guild.updateTime ?? 0) < Date.now() - 14400000) {
    guild = new Guild(uuid ?? memberUUID);
    Logger.log(`Guild: ${uuid ?? memberUUID} missed cache. Fetching!`);
    await guild.updateWins();

    if (guild.name != "INVALID-NAME") {
      Logger.info("Adding guild to mongo");
      await connector.updateGuild(guild);
    } else {
      guild = { ERROR: "NO-GUILD" };
    }
  }

  return guild;
}

module.exports = GuildResolver;
