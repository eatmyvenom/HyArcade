const cfg = require("hyarcade-config").fromJSON();
const Logger = require("hyarcade-logger");
const { mojangRequest } = require("hyarcade-requests");
const MongoConnector = require("hyarcade-requests/MongoConnector");
const Guild = require("hyarcade-structures/Guild");

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {MongoConnector} connector
 */
module.exports = async (req, res, connector) => {
  const url = new URL(req.url, `https://${req.headers.host}`);
  if (req.method == "GET") {
    const uuid = url.searchParams.get("uuid");
    let memberUUID = url.searchParams.get("member");

    let guild;
    if (uuid) {
      guild = await connector.getGuild(uuid);
    } else if (memberUUID) {
      if (memberUUID.length < 32) {
        memberUUID = await mojangRequest.getUUID(memberUUID);
      }
      guild = await connector.getGuildByMember(memberUUID);
    }

    // eslint-disable-next-line unicorn/no-null
    if (guild == undefined || guild == null || (guild.updateTime ?? 0) < Date.now() - 14400000) {
      guild = new Guild(uuid ?? memberUUID);
      await guild.updateWins();

      if (guild.name != "INVALID-NAME") {
        Logger.log("Adding guild to mongo");
        await connector.updateGuild(guild);
      } else {
        guild = { ERROR: "NO-GUILD" };
      }
    }

    res.setHeader("Content-Type", "application/json");

    res.write(JSON.stringify(guild));
    res.end();
  } else if (req.method == "POST") {
    let data = "";
    let json = {};
    if (req.headers.authorization == cfg.database.pass) {
      req.on("data", d => (data += d));
      req.on("end", async () => {
        json = JSON.parse(data);
        const newGuild = json;

        connector
          .updateGuild(newGuild)
          .then(() => {})
          .catch(Logger.err);

        res.end();
      });
    } else {
      Logger.warn("Someone tried to post without correct AUTH");
      res.statusCode = 403;
      res.end();
    }
  } else {
    res.statusCode = 404;
    res.end();
  }
};